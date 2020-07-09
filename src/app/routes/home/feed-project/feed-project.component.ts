import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { I18NService } from '@core'
import { ActivityType, FeedItem } from 'app/api/service/activity.service'
import { ProjectService } from 'app/api/service/project.service'
import { Project } from 'app/model/es.model'

@Component({
  selector: 'app-feed-project',
  templateUrl: './feed-project.component.html',
  styleUrls: ['../feed-item.css']
})
export class FeedProjectComponent {

  action = ''
  item: FeedItem = {}
  project: Project = {}
  @Input()
  set data(item: FeedItem) {
    this.item = item
    this.project = item.data as Project || {}
    switch (item.activity.type) {
      case ActivityType.TYPE_NEW_PROJECT:
        this.action = this.i18nService.fanyi('tips-create-project')
        break
      default:
        break
    }
  }

  constructor(
    private projectService: ProjectService,
    private i18nService: I18NService,
    private router: Router,
  ) { }

  avatarText() {
    return this.projectService.getAvatarText(this.project)
  }

  go() {
    const activity = this.item.activity
    this.router.navigateByUrl(`/${activity.group}/${activity.project}`)
  }
}
