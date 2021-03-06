import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'

import { CallbackComponent } from './callback/callback.component'
import { Exception403Component } from './exception/403.component'
import { Exception404Component } from './exception/404.component'
import { Exception500Component } from './exception/500.component'
import { GroupModelComponent } from './group/group-model/group-model.component'
import { GroupProjectsComponent } from './group/group-projects/group-projects.component'
import { HomeModule } from './home/home.module'
import { UserLoginComponent } from './passport/login/login.component'
import { ProjectApiNewComponent } from './project/project-api-new/project-api-new.component'
import { ProjectCasesComponent } from './project/project-cases/project-cases.component'
import { ProjectCiCdListComponent } from './project/project-cicd-list/project-cicd-list.component'
import { ProjectDubboListComponent } from './project/project-dubbo-list/project-dubbo-list.component'
import { ProjectEnvsComponent } from './project/project-envs/project-envs.component'
import { ProjectJobsComponent } from './project/project-jobs/project-jobs.component'
import { ProjectModelComponent } from './project/project-model/project-model.component'
import { ProjectScenariosComponent } from './project/project-scenarios/project-scenarios.component'
import { ProjectSqlListComponent } from './project/project-sql-list/project-sql-list.component'
import { RouteRoutingModule } from './routes-routing.module'

const COMPONENTS = [
  // passport pages
  UserLoginComponent,
  // single pages
  CallbackComponent,
  Exception403Component,
  Exception404Component,
  Exception500Component,
  // group
  GroupModelComponent,
  GroupProjectsComponent,
  // project
  ProjectModelComponent,
  ProjectApiNewComponent,
  ProjectCasesComponent,
  ProjectEnvsComponent,
  ProjectJobsComponent,
  ProjectScenariosComponent,
  ProjectDubboListComponent,
  ProjectSqlListComponent,
  ProjectCiCdListComponent,
]
const COMPONENTS_NOROUNT = []

@NgModule({
  imports: [SharedModule, HomeModule, RouteRoutingModule, NgxChartsModule, InfiniteScrollModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule { }
