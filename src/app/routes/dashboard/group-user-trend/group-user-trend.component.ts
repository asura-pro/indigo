import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ActivityService } from 'app/api/service/activity.service'
import { AggsItem, AggsQuery } from 'app/api/service/base.service'
import { CaseService } from 'app/api/service/case.service'
import { NameValue } from 'app/model/common.model'
import { Group } from 'app/model/es.model'

@Component({
  selector: 'app-group-user-trend',
  templateUrl: './group-user-trend.component.html',
})
export class GroupUserTrendComponent implements OnInit {

  type = 'case-growth'
  fitView: any[] = [window.innerWidth, Math.floor(window.innerHeight - 150)]
  view1: any[] = [window.innerWidth, Math.floor(window.innerHeight - 150)]
  view2: any[] = undefined
  colorScheme = {
    domain: [
      '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'
    ]
  }
  colorScheme2 = {
    domain: this.colorScheme.domain.reverse()
  }
  groups: Group[] = []
  group = undefined
  aggsParams: AggsQuery = {
    interval: '1M',
    termsField: 'group',
    dateRange: '1y'
  }
  caseData: AggsItem[] = []
  activityData: AggsItem[] = []
  showSubChart = false
  caseResults: NameValue[] = [{ name: 'indigo', value: 0 }]
  caseSubResults: NameValue[] = []
  caseAggreations: NameValue[] = [{ name: 'indigo', series: [{ name: 'indigo', value: 0 }] }]
  activityResults: NameValue[] = [{ name: 'indigo', value: 0 }]
  activitySubResults: NameValue[] = []
  activityAggreations: NameValue[] = [{ name: 'indigo', series: [{ name: 'indigo', value: 0 }] }]
  @HostListener('window:resize')
  resize() {
    this.fitView = [window.innerWidth, Math.floor(window.innerHeight - 150)]
    if (this.showSubChart) {
      this.view1 = [window.innerWidth, Math.floor((window.innerHeight - 150) * 0.4)]
      this.view2 = [window.innerWidth, Math.floor((window.innerHeight - 150) * 0.6)]
    } else {
      this.view1 = [window.innerWidth, Math.floor(window.innerHeight - 150)]
    }
  }

  constructor(
    private caseService: CaseService,
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  typeChange() {
    if (this.type === 'case-aggregation') {
      this.updateCaseAggregationData()
    } else if (this.type === 'activity-growth') {
      if (this.activityData.length === 0) {
        this.loadActivityAggData()
      }
    } else if (this.type === 'activity-aggregation') {
      this.updateActivityAggregationData()
    }
  }

  updateActivityAggregationData() {
    if (this.activityData && this.activityData.length > 0) {
      this.activityAggreations = this.getLineChartAggreationData(this.activityData)
    }
  }

  updateCaseAggregationData() {
    if (this.caseData && this.caseData.length > 0) {
      this.caseAggreations = this.getLineChartAggreationData(this.caseData)
    }
  }

  getLineChartAggreationData(originData: AggsItem[]) {
    if (originData[0].sub[0].type === 'group') {
      const tmp: { [k: string]: NameValue[] } = {}
      originData.forEach(item => {
        const date = item.id
        const subGroupCount: { [k: string]: number } = {}
        item.sub.forEach(subItem => {
          subGroupCount[subItem.id] = subItem.count
        })
        this.groups.forEach(group => {
          const groupSeries = tmp[group.id] || []
          let subCount = 0
          if (subGroupCount[group.id] !== undefined) {
            subCount = subGroupCount[group.id]
          }
          if (groupSeries.length > 0) {
            groupSeries.push({ name: date, value: subCount + groupSeries[groupSeries.length - 1].value })
          } else {
            groupSeries.push({ name: date, value: subCount })
          }
          tmp[group.id] = groupSeries
        })
      })
      const tmpResults: NameValue[] = []
      for (const groupId of Object.keys(tmp).sort()) {
        tmpResults.push({ name: groupId, series: tmp[groupId] })
      }
      return tmpResults
    } else {
      const tmp: { [creatorOrPorject: string]: { [date: string]: number } } = {}
      originData.forEach(item => {
        const date = item.id
        const sub = item.sub
        sub.forEach(subItem => {
          const creatorOrPorject = subItem.id
          let seriesData = tmp[creatorOrPorject]
          if (seriesData) {
            seriesData[date] = subItem.count
          } else {
            seriesData = {}
            seriesData[date] = subItem.count
            tmp[creatorOrPorject] = seriesData
          }
        })
      })
      const tmpResults: NameValue[] = []
      for (const creatorOrPorject of Object.keys(tmp).sort()) {
        const seriesTmp = tmp[creatorOrPorject]
        const seriesData: NameValue[] = []
        originData.forEach(dataItem => {
          const date = dataItem.id
          let currDateCount = seriesTmp[date]
          if (currDateCount === undefined) {
            currDateCount = 0
          }
          let currBucketCount = 0
          if (seriesData.length > 0) {
            currBucketCount = seriesData[seriesData.length - 1].value + currDateCount
          } else {
            currBucketCount = currDateCount
          }
          seriesData.push({ name: date, value: currBucketCount })
        })
        tmpResults.push({ name: creatorOrPorject, series: seriesData })
      }
      return tmpResults
    }
  }

  groupChange() {
    if (this.group) {
      this.aggsParams.termsField = 'project'
    } else {
      this.aggsParams.termsField = 'group'
    }
    this.loadData()
  }

  loadCaseAggData(updateAggregationPanel = false) {
    let groups: boolean = null
    if (this.groups && this.groups.length > 0) {
      groups = false
    }
    this.caseService.trend({ group: this.group, ...this.aggsParams }, groups).subscribe(res => {
      this.showSubChart = false
      this.resize()
      if (res.data.groups && res.data.groups.length > 0) {
        this.groups = res.data.groups
      }
      this.caseData = res.data.trends
      this.caseResults = res.data.trends.map(item => {
        return { name: item.id, value: item.count }
      })
      if (updateAggregationPanel) {
        this.updateCaseAggregationData()
      }
    })
  }

  loadActivityAggData(updateAggregationPanel = false) {
    this.activityService.trend({ group: this.group, ...this.aggsParams }).subscribe(res => {
      this.showSubChart = false
      this.resize()
      this.activityData = res.data.trends
      this.activityResults = res.data.trends.map(item => {
        return { name: item.id, value: item.count }
      })
      if (updateAggregationPanel) {
        this.updateActivityAggregationData()
      }
    })
  }

  loadData() {
    if (this.type === 'case-growth') {
      this.loadCaseAggData()
    } else if (this.type === 'case-aggregation') {
      this.loadCaseAggData(true)
    } else if (this.type === 'activity-growth') {
      this.loadActivityAggData()
    } else if (this.type === 'activity-aggregation') {
      this.loadActivityAggData(true)
    }
  }

  onSelect(item: NameValue) {
    if (this.type === 'case-growth') {
      this.caseSubResults = this.getSubHorizontalBarData(this.caseData, item)
    } else if (this.type === 'activity-growth') {
      this.activitySubResults = this.getSubHorizontalBarData(this.activityData, item)
    }
  }

  private getSubHorizontalBarData(originData: AggsItem[], item: NameValue) {
    const dataAggItem = originData.find(dataItem => dataItem.id === item.name)
    if (dataAggItem) {
      const subAggItems = dataAggItem.sub
      if (subAggItems && subAggItems.length > 0) {
        this.showSubChart = true
        this.resize()
        if (subAggItems[0].type === 'group') {
          const tmp: { [k: string]: boolean } = {}
          const tmpResults = subAggItems.map(subAggItem => {
            tmp[subAggItem.id] = true
            return { name: subAggItem.id, value: subAggItem.count }
          })
          this.groups.forEach(group => {
            if (!tmp[group.id]) {
              tmpResults.push({ name: group.id, value: 0 })
            }
          })
          return tmpResults
        } else {
          return subAggItems.map(subAggItem => {
            return { name: subAggItem.id, value: subAggItem.count }
          })
        }
      }
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.loadData()
    })
  }
}