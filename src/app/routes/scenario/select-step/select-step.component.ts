import { Location } from '@angular/common'
import { Component, HostListener, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { GroupProjectSelectorModel } from '@shared/group-project-selector/group-project-selector.component'
import { ApiRes } from 'app/model/api.model'
import { PageSingleModel } from 'app/model/page.model'
import { CaseModelComponent } from 'app/routes/case/case-model/case-model.component'
import { calcDrawerWidth } from 'app/util/drawer'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, QueryCase } from '../../../api/service/case.service'
import { caseToScenarioStep, ScenarioStepType } from '../../../api/service/scenario.service'
import { Case, ContextOptions, DubboRequest, ScenarioStep, SqlRequest } from '../../../model/es.model'

@Component({
  selector: 'app-select-step',
  styles: [`
    .search-group-project {
      margin-bottom: 8px;
    }
    .line {
      width: 100%;
    }
    .line .title {
      padding-left: 10px;
      font-size: smaller;
      color: lightgray;
    }
    .line .tail-labels {
      float: right;
      transform: scale(0.8);
      margin-right: 8px;
    }
    .line .tail-labels span {
      color: lightblue;
    }`
  ],
  templateUrl: './select-step.component.html',
})
export class SelectStepComponent implements OnInit {

  @Input()
  set group(val: string) {
    this.searchGroupProject.group = val
  }
  @Input()
  set project(val: string) {
    this.searchGroupProject.project = val
  }
  tabIndex = 0
  drawerWidth = calcDrawerWidth()
  searchGroupProject: GroupProjectSelectorModel

  httpItems: Case[] = []
  httpItemsPage = new PageSingleModel()
  searchHttpStepModel: QueryCase = {}
  searchHttpStepSubject: Subject<QueryCase>

  _ctxOptions: ContextOptions = {}
  @Input()
  set ctxOptions(val: ContextOptions) {
    if (val) {
      this._ctxOptions = val
    }
  }
  @Input() onSelectSubject: Subject<StepEvent>
  @Input() onUpdateSubject: Subject<StepEvent>
  @HostListener('window:resize')
  resize() {
    this.drawerWidth = calcDrawerWidth()
  }

  constructor(
    private caseService: CaseService,
    private drawerService: NzDrawerService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.searchGroupProject = {
      group: this.group,
      project: this.project
    }
  }

  tabIndexChange() {
    console.log(this.tabIndex)
  }

  groupProjectChange() {
    switch (this.tabIndex) {
      case 0:
        this.searchHttpSteps()
        break
      case 1:
        break
      case 2:
        break
    }
  }

  addHttpStep(item: Case) {
    if (this.onSelectSubject) {
      this.onSelectSubject.next({
        step: {
          id: item._id,
          type: ScenarioStepType.CASE,
          stored: false,
        },
        stepData: item
      })
    }
  }

  viewHttpStep(item: Case) {
    this.drawerService.create({
      nzWidth: this.drawerWidth,
      nzContent: CaseModelComponent,
      nzContentParams: {
        id: item._id,
        isInDrawer: true,
        newStep: (stepData: Case) => {
          this.onSelectSubject.next({ step: caseToScenarioStep(stepData), stepData: stepData })
        },
        updateStep: (stepData: Case) => {
          this.httpItems = this.httpItems.map(httpItem => {
            if (httpItem._id === stepData._id) {
              return stepData
            } else {
              return item
            }
          })
          this.onUpdateSubject.next({ step: caseToScenarioStep(stepData), stepData: stepData })
        },
        ctxOptions: this._ctxOptions
      },
      nzBodyStyle: {
        padding: '0px'
      },
      nzClosable: false,
    })
  }

  methodTagColor(item: Case) {
    switch (item.request.method) {
      case 'GET':
        return 'green'
      case 'DELETE':
        return 'red'
      case 'POST':
        return 'cyan'
      case 'PUT':
        return 'blue'
      default:
        return 'purple'
    }
  }

  searchHttpSteps() {
    this.searchHttpStepSubject.next({
      ...this.searchHttpStepModel, ...this.httpItemsPage.toPageQuery(), ...this.searchGroupProject
    })
  }

  ngOnInit(): void {
    const response = new Subject<ApiRes<Case[]>>()
    response.subscribe(res => {
      this.httpItemsPage.pageTotal = res.data.total
      this.httpItems = res.data.list
    })
    this.searchHttpStepSubject = this.caseService.newQuerySubject(response)
    this.searchHttpSteps()
  }
}

export type ScenarioStepData = Case | SqlRequest | DubboRequest

export interface StepEvent {
  step: ScenarioStep
  stepData: ScenarioStepData
}
