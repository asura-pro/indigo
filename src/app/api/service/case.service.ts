import { Inject, Injectable } from '@angular/core'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { newWS } from 'app/util/ws'
import { NzMessageService } from 'ng-zorro-antd'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import {
  Case,
  CaseResult,
  ContextOptions,
  DeleteResData,
  IndexDocResponse,
  LabelRef,
  UpdateDocResponse,
} from '../../model/es.model'
import { API_HTTP, API_WS } from '../path'
import { AggsItem, AggsQuery, BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class CaseService extends BaseService {

  constructor(
    private http: _HttpClient,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { super() }

  query(group: string, project: string, query: QueryCase) {
    return this.http.post<ApiRes<Case[]>>(`${API_HTTP}/${group}/${project}/query`, query)
  }

  index(group: string, project: string, cs: Case) {
    return this.http.put(`${API_HTTP}/${group}/${project}`, cs) as Observable<ApiRes<IndexDocResponse>>
  }

  clone(group: string, project: string, id: string) {
    return this.http.put(`${API_HTTP}/${group}/${project}/clone/${id}`) as Observable<ApiRes<IndexDocResponse>>
  }

  delete(group: string, project: string, id: string, preview: boolean = null) {
    return this.http.delete(
      `${API_HTTP}/${group}/${project}/${id}${preview === null ? '' : '?preview=' + preview}`) as Observable<ApiRes<DeleteResData>>
  }

  batchDelete(group: string, project: string, ids: string[], preview: boolean = null) {
    return this.http.post(
      `${API_HTTP}/${group}/${project}/batch/delete${preview === null ? '' : '?preview=' + preview}`,
      { ids },
    ) as Observable<ApiRes<DeleteResData>>
  }

  update(group: string, project: string, id: string, cs: Case) {
    return this.http.post<ApiRes<UpdateDocResponse>>(`${API_HTTP}/${group}/${project}/update/${id}`, cs)
  }

  test(group: string, project: string, cs: { id: string, cs: Case, options: ContextOptions }) {
    return this.http.post<ApiRes<CaseResult>>(`${API_HTTP}/${group}/${project}/test`, cs)
  }

  getById(group: string, project: string, id: string) {
    return this.http.get<ApiRes<Case>>(`${API_HTTP}/${group}/${project}/${id}`)
  }

  openApiPreview(group: string, project: string, options: OpenApiImport) {
    return this.http.post<ApiRes<Case[]>>(`${API_HTTP}/${group}/${project}/openapi/preview`, options)
  }

  openApiImport(group: string, project: string, options: OpenApiImport) {
    return this.http.put<ApiRes<number>>(`${API_HTTP}/${group}/${project}/openapi/import`, options)
  }

  newQuerySubject(group: string, project: string, response: Subject<ApiRes<Case[]>>) {
    const querySubject = new Subject<QueryCase>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<Case[]>>(`${API_HTTP}/${group}/${project}/query`, query).subscribe(
        res => response.next(res),
        err => response.next(null))
    })
    return querySubject
  }

  searchAfterSubject(group: string, project: string, response: Subject<ApiRes<CaseWithSort[]>>) {
    const querySubject = new Subject<SearchAfterCase>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<CaseWithSort[]>>(`${API_HTTP}/${group}/${project}/after`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  aggsSubject(group: string, project: string, response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<AggsQuery>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<AggsItem[]>>(`${API_HTTP}/${group}/${project}/aggs`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  aggsLabelsSubject(group: string, project: string, response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<string>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(label => {
      this.http.get<ApiRes<AggsItem[]>>(`${API_HTTP}/${group}/${project}/aggs/labels?label=${label}`).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  batchOperateLabels(group: string, project: string, ops: BatchOperationLabels) {
    return this.http.post<ApiRes<any>>(`${API_HTTP}/${group}/${project}/batch/labels`, ops)
  }

  batchTransfer(group: string, project: string, ops: BatchTransfer) {
    return this.http.post<ApiRes<any>>(`${API_HTTP}/${group}/${project}/batch/transfer`, ops)
  }

  newTestWs(group: string, project: string, id: string) {
    let idParam = ''
    if (id) {
      idParam = `&id=${id}`
    }
    const ws = newWS(`${API_WS}/http/${group}/${project}/test?token=${this.tokenService.get()['token']}${idParam}`)
    ws.onerror = (event) => {
      console.error(event)
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorWsOnError))
    }
    return ws
  }
}

export interface QueryCase extends QueryPage {
  group?: string
  project?: string
  host?: string
  methods?: string[]
  path?: string
  text?: string
  ids?: string[]
  labels?: string[]
  hasCreators?: boolean
  isCloned?: boolean
}

export interface SearchAfter {
  group?: string
  project?: string
  creator?: string
  text?: string
  size?: number
  sort?: any[]
}

export interface SearchAfterCase extends SearchAfter {
  onlyMe?: boolean
}

export interface CaseWithSort extends Case {
  _sort: any[]
}

export interface UpdateCase {
  id?: string
  cs?: Case
}
export interface BatchOperationLabels {
  labels?: { id: string, labels: LabelRef[] }[]
}

export interface BatchTransfer {
  group?: string
  project?: string
  ids?: string[]
}

export interface ConvertOptions {
  scheme?: string
  host?: string
  port?: number
  basePath?: string
  labels?: string[]
}

export interface OpenApiImport {
  url?: string
  content?: string
  list?: Case[]
  options?: ConvertOptions
}

export function httpRequestSignature(cs: Case) {
  if (cs && cs.request) {
    const schema = cs.request.protocol ? cs.request.protocol + '://' : ''
    if (cs.request.port) {
      let portStr = `:${cs.request.port}`
      if (('http' === cs.request.protocol && cs.request.port === 80) || ('https' === cs.request.protocol && cs.request.port === 443)) {
        portStr = ''
      }
      return decodeURIComponent(`${schema}${cs.request.host}${portStr}${cs.request.urlPath}`)
    } else {
      return decodeURIComponent(`${schema}${cs.request.host}${cs.request.urlPath}`)
    }
  } else {
    return ''
  }
}
