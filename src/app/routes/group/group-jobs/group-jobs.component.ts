import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { Group } from '../../../model/es.model'

@Component({
  selector: 'app-group-jobs',
  templateUrl: './group-jobs.component.html',
})
export class GroupJobsComponent implements OnInit {

  group: Group = {}
  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private msgService: NzMessageService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }


}