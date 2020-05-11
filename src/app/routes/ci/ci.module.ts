import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { MonacoEditorModule } from 'ngx-monaco-editor'
import { SortablejsModule } from 'ngx-sortablejs'

import { ScenarioModule } from '../scenario/scenario.module'
import { CiEventComponent } from './ci-event/ci-event.component'
import { CiEventsListListComponent } from './ci-events-list/ci-events-list.component'
import { CiRoutingModule } from './ci-routing.module'

const COMPONENT = [
  CiEventComponent,
  CiEventsListListComponent,
]

const COMPONENT_NOROUNT = []

@NgModule({
  imports: [
    CommonModule,
    MonacoEditorModule,
    SortablejsModule,
    SharedModule,
    CiRoutingModule,
    ScenarioModule,
  ],
  exports: [...COMPONENT],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class CiModule { }
