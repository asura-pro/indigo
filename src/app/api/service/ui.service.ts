import { Inject, Injectable } from '@angular/core'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { newWS, newWSUrl } from 'app/util/ws'
import { NzMessageService } from 'ng-zorro-antd'

import { ApiRes } from '../../model/api.model'
import { API_UI, API_WS } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class UiService extends BaseService {

  constructor(
    private http: _HttpClient,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { super() }

  getDriverLabel(driver: UiDriverAddress) {
    return `${driver.host}:${driver.port}`
  }

  getDriverList(group: string, project: string) {
    return this.http.get<ApiRes<UiDriverAddress[]>>(`${API_UI}/driver/list/${group}/${project}`)
  }

  // direct connect ip:port
  getRfbProxyUrl(driver: UiDriverAddress, group: string, project: string) {
    const query = `host=${driver.host}&port=${driver.port}&token=${this.tokenService.get().token}`
    return newWSUrl(`${API_WS}/ui/proxy/rfb/${group}/${project}?${query}`)
  }

  connectDriver(driver: UiDriverAddress, group: string, project: string) {
    const query = `host=${driver.host}&port=${driver.port}&token=${this.tokenService.get().token}`
    const ws = newWS(`${API_WS}/ui/proxy/connect/${group}/${project}?${query}`)
    ws.onerror = (event) => {
      console.error(event)
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorWsOnError))
    }
    return ws
  }
}

export interface UiDriverAddress {
  host?: string
  port?: number
  password?: string
  type?: string
}

export interface DriverCommand {
  type?: string
  creator?: string
  params?: any
}

export interface DriverStatus {
  updateAt?: string
  status?: string
  command?: DriverCommand
  commandStartAt?: number
}

export interface DriverCommandStart {
  ok?: boolean
  msg?: string
  status?: DriverStatus
}

export interface DriverCommandResult {
  ok?: boolean
  msg?: string
  status?: DriverStatus
}

export interface MonkeyCommandParams {
  startUrl?: string
  delta?: number
  maxOnceKeyCount?: number
  keyEventRatio?: number
  interval?: number
  generateCount?: number
  maxDuration?: number
}

export interface DriverCommandLog {
  command?: string
  type?: string
  params?: any
}

export interface KarateCommandParams {
  text?: string
}