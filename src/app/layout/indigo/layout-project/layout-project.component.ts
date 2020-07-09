import { DOCUMENT } from '@angular/common'
import { Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2 } from '@angular/core'
import { ActivatedRoute, NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router'
import { Menu, MenuService, ScrollService, SettingsService } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'

import { ProjectService } from '../../../api/service/project.service'
import { SharedService } from '../../../api/service/shared.service'
import { Project } from '../../../model/es.model'
import { LayoutAbstractClass } from '../layout-abstract.class'

@Component({
  selector: 'layout-project',
  templateUrl: './layout-project.component.html',
})
export class LayoutProjectComponent extends LayoutAbstractClass {

  project: Project = {}

  constructor(
    router: Router,
    _message: NzMessageService,
    resolver: ComponentFactoryResolver,
    settings: SettingsService,
    el: ElementRef,
    renderer: Renderer2,
    @Inject(DOCUMENT) doc: any,
    scroll: ScrollService,
    menuSrv: MenuService,
    route: ActivatedRoute,
    private projectService: ProjectService,
    sharedService: SharedService,
  ) {
    super(router, _message, resolver, settings, el, renderer, doc)
    sharedService.currentProject.subscribe(project => this.project = project)
    // scroll to top in change page
    router.events.subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true
      }
      if (evt instanceof NavigationError) {
        this.isFetching = false
        return
      }
      if (!(evt instanceof NavigationEnd)) {
        return
      }
      setTimeout(() => {
        scroll.scrollToTop()
        this.isFetching = false
      }, 100)
    })
    // set menu and group infomation
    route.paramMap.subscribe(param => {
      const group = param.get('group')
      const project = param.get('project')
      const settingsUrl = `/project/${group}/${project}/settings`
      if (group && project && router.url !== settingsUrl) {
        projectService.getById(group, project).subscribe(
          res => this.project = res.data,
          err => router.navigateByUrl('/')
        )
      }
      menuSrv.clear()
      const menus: Menu[] = [
        {
          text: '主导航',
          i18n: 'menu-main-navigation',
          group: true,
          hideInBreadcrumb: true,
          children: [
            {
              text: 'Http 请求',
              i18n: 'menu-cases',
              icon: { type: 'icon', value: 'chrome', theme: 'outline' },
              children: [
                {
                  text: 'Http 列表',
                  i18n: 'menu-list',
                  link: `/${group}/${project}`,
                },
                {
                  text: '新建 Http',
                  i18n: 'menu-new',
                  link: `/cases/${group}/${project}/new`,
                },
              ]
            },
            {
              text: 'Dubbo',
              i18n: 'menu-dubbo-test',
              icon: { type: 'icon', value: 'alibaba', theme: 'outline' },
              children: [
                {
                  text: '列表',
                  i18n: 'menu-list',
                  link: `/dubbo/${group}/${project}`,
                },
                {
                  text: '新建',
                  i18n: 'menu-new',
                  link: `/dubboes/${group}/${project}/new`,
                },
              ]
            },
            {
              text: 'Sql',
              i18n: 'menu-sql-test',
              icon: { type: 'icon', value: 'database', theme: 'outline' },
              children: [
                {
                  text: '列表',
                  i18n: 'menu-list',
                  link: `/sql/${group}/${project}`,
                },
                {
                  text: '新建',
                  i18n: 'menu-new',
                  link: `/sqls/${group}/${project}/new`,
                },
              ]
            },
            // {
            //   text: '接口管理',
            //   i18n: 'menu-apis',
            //   icon: { type: 'icon', value: 'api', theme: 'outline' },
            //   children: [
            //     // {
            //     //   'text': '接口列表',
            //     //   'i18n': 'menu-api-list',
            //     //   'link': `/rest/${group}/${project}`,
            //     // },
            //     // {
            //     //   'text': '新建接口',
            //     //   'i18n': 'menu-new-api',
            //     //   'link': `/apis/${group}/${project}/new`,
            //     // },
            //     {
            //       text: 'OpenApi',
            //       i18n: 'menu-openapi',
            //       link: `/project/${group}/${project}/openapi`,
            //     },
            //   ]
            // },
            {
              text: '场景管理',
              i18n: 'menu-scenarios',
              icon: { type: 'icon', value: 'picture', theme: 'outline' },
              children: [
                {
                  text: '场景列表',
                  i18n: 'menu-scenario-list',
                  link: `/scenario/${group}/${project}`,
                },
                {
                  text: '新建场景',
                  i18n: 'menu-new-scenario',
                  link: `/scenarios/${group}/${project}/new`,
                },
              ]
            },
            {
              text: '任务管理',
              i18n: 'menu-jobs',
              icon: { type: 'icon', value: 'schedule', theme: 'outline' },
              link: `/job/${group}/${project}`,
              children: [
                {
                  text: '任务列表',
                  i18n: 'menu-job-list',
                  link: `/job/${group}/${project}`,
                },
                {
                  text: '新建任务',
                  i18n: 'menu-new-job',
                  link: `/jobs/${group}/${project}/new`,
                },
                {
                  text: '任务报告',
                  i18n: 'menu-job-report',
                  link: `/project/${group}/${project}/report`,
                },
              ]
            },
            {
              text: 'CI / CD',
              i18n: 'menu-ci-cd',
              icon: { type: 'icon', value: 'thunderbolt', theme: 'outline' },
              children: [
                {
                  text: 'CICD列表',
                  i18n: 'menu-list',
                  link: `/ci/${group}/${project}`,
                },
                {
                  text: '新建',
                  i18n: 'menu-new',
                  link: `/cis/${group}/${project}/new`,
                },
                {
                  text: '事件',
                  i18n: 'menu-events',
                  link: `/cis/${group}/${project}/events`,
                },
              ]
            },
            {
              text: '环境管理',
              i18n: 'menu-envs',
              icon: { type: 'icon', value: 'environment', theme: 'outline' },
              children: [
                {
                  text: '配置列表',
                  i18n: 'menu-env-list',
                  link: `/env/${group}/${project}`,
                },
                {
                  text: '新建配置',
                  i18n: 'menu-new-env',
                  link: `/envs/${group}/${project}/new`,
                },
              ]
            },
            {
              text: '设置',
              i18n: 'menu-settings',
              icon: { type: 'icon', value: 'setting', theme: 'outline' },
              children: [
                {
                  text: '基本信息',
                  i18n: 'menu-general-info',
                  link: `/project/${group}/${project}/settings`,
                },
                {
                  text: '同步设置',
                  i18n: 'menu-sync-settings',
                  link: `/project/${group}/${project}/sync`,
                },
                {
                  text: '其他选项',
                  i18n: 'menu-other-options',
                  link: `/project/${group}/${project}/options`,
                }
              ]
            }
          ]
        },
      ]
      menuSrv.add(menus)
    })
  }

  avatarText() {
    return this.projectService.getAvatarText(this.project)
  }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed)
  }
}
