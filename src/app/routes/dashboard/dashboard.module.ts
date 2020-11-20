import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { NgxChartsModule } from '@swimlane/ngx-charts'

import { ApiMetricsTrendComponent } from './api-metrics-trend/api-metrics-trend.component'
import { DashboardRoutingModule } from './dashboard-routing.module'
import { DomainApiItemComponent } from './domain-api-item/domain-api-item.component'
import { DomainApiOnlineComponent } from './domain-api-online/domain-api-online.component'
import { DomainOnlineConfigComponent } from './domain-online-config/domain-online-config.component'
import { GroupsComponent } from './groups/groups.component'
import { ProjectsComponent } from './projects/projects.component'
import { UserProfileComponent } from './user-profile/user-profile.component'

const COMPONENT = [
  GroupsComponent,
  ProjectsComponent,
  UserProfileComponent,
  DomainApiOnlineComponent,
  DomainOnlineConfigComponent,
  DomainApiItemComponent,
  ApiMetricsTrendComponent,
]

const COMPONENT_NOROUNT = [
  DomainOnlineConfigComponent,
  ApiMetricsTrendComponent,
]

@NgModule({
  imports: [CommonModule, SharedModule, NgxChartsModule, DashboardRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class DashboardModule { }
