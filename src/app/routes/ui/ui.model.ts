import { BaseDoc, BlobMetaData, LabelRef } from 'app/model/es.model'
import { DocRef } from 'app/model/job.model'

export interface FileNodeData {
  data?: object
  blob?: BlobMetaData
}

export interface FileNode extends BaseDoc {
  group?: string
  project?: string
  name?: string
  type?: string
  path?: DocRef[]
  parent?: string
  size?: number
  extension?: string
  app?: string
  labels?: LabelRef[]
  data?: FileNodeData
}

export interface UiTaskReportData {
  result?: any
}

export interface UiTaskReport extends BaseDoc {
  group?: string
  project?: string
  taskId?: string
  type?: string
  startAt?: number
  endAt?: number
  elapse?: number
  result?: 'success' | 'fail'
  errorMsg?: string
  node?: string
  day?: string
  params?: object
  data?: UiTaskReportData
}

export interface LogEntry extends BaseDoc {
  taskId?: string
  reportId?: string
  type?: string
  hostname?: string
  pid?: string
  method?: string
  level?: string
  source?: string
  text?: string
  timestamp?: number
  data?: object
}

export interface CommandOptions {
  electron?: boolean
  saveCommandLog?: boolean
  saveDriverLog?: boolean
}

export const APP = {
  KARATE: 'karate',
  SOLOPI: 'solopi',
  WEB_MONKEY: 'web.monkey',
  RAW: 'raw',
}

export const DRIVERS = {
  CHROME: 'chrome',
  ANDROID: 'android',
  IOS: 'ios'
}

export function removeWindowSelection() {
  if (document['selection']) {
    document['selection'].empty()
  } else {
    window.getSelection().removeAllRanges()
  }
}
