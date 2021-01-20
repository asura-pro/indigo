import { ParameterType } from 'app/api/service/dubbo.service'

import { DataBody } from './api.model'
import { AbstractResult, JobData, JobMeta } from './job.model'
import { UserProfile } from './user.model'

export interface BaseDoc {
  _id?: string
  _creator?: UserProfile
  summary?: string
  description?: string
  creator?: string
  createdAt?: string
  updatedAt?: string
}

export interface LabelRef {
  name?: string
}

export interface Label extends LabelRef {
  owner?: string
  name?: string
  description?: string
  value?: string
  type?: string
}

export interface Group extends BaseDoc {
  id?: string
  avatar?: string
}

export interface FieldPattern {
  field?: string
  value?: string
  type?: string
}

export interface Project extends BaseDoc {
  id?: string
  group?: string
  avatar?: string
  openapi?: string
  domains?: LabelRef[]
  inclusions?: FieldPattern[]
  exclusions?: FieldPattern[]
}

export interface Api extends BaseDoc {
  type?: string
  path?: string
  method?: string
  deprecated?: boolean
  service?: string
  version?: string
  labels?: LabelRef[]
  schema?: Object & string
  project?: string
  group?: string
}

export interface Case extends BaseDoc {
  project?: string
  group?: string
  request?: CaseRequest
  /** 后端为Map类型, 前端组件内为 string */
  assert?: any
  env?: string
  labels?: LabelRef[]
  generator?: CaseGenerator
  exports?: VariablesExportItem[]
}

export interface DelayCondition {
  value?: number
  timeUnit?: string
}

export interface AssertJumpCondition {
  assert?: object
  to?: number
}

export interface JumpConditions {
  type?: 0 | 1
  conditions?: AssertJumpCondition[]
  script?: string
}

export interface StepData {
  delay?: DelayCondition
  jump?: JumpConditions
}

export interface ScenarioStep {
  id?: string
  type?: string
  enabled?: boolean
  data?: StepData
}

export interface Scenario extends BaseDoc {
  group?: string
  project?: string
  env?: string
  comment?: string
  failFast?: boolean
  steps?: ScenarioStep[]
  labels?: LabelRef[]
  imports?: VariablesImportItem[]
  exports?: VariablesExportItem[]
}

export interface Permissions extends BaseDoc {
  group?: string
  project?: string
  type?: string
  username?: string
  role?: string
  data?: object
}

export interface KeyValueObject {
  key?: string
  value?: string
  enabled?: boolean
  description?: string
}

export interface BlobMetaData {
  engine?: string
  key?: string
  fileName?: string
  contentLength?: number
  contentDisposition?: string
  contentType?: string
}

export interface FormDataItem {
  key?: string
  value?: string
  type?: 'string' | 'blob'
  enabled?: boolean
  description?: string
  metaData?: BlobMetaData
}

export interface MediaObject {
  contentType?: string
  data?: any
}

export interface CaseRequest {
  protocol?: string
  host?: string
  rawUrl?: string
  urlPath?: string
  port?: number
  auth?: Authorization
  method?: string
  path?: KeyValueObject[]
  query?: KeyValueObject[]
  header?: KeyValueObject[]
  cookie?: KeyValueObject[]
  contentType?: string
  body?: MediaObject[]
}

export interface CaseStatis {
  failed?: number
  passed?: number
  isSuccessful?: boolean
}

export interface CaseResultRequest {
  method?: string
  url?: string
  headers?: { [k: string]: string }[]
  body?: MediaObject
}

export interface CaseResultResponse {
  statusCode?: number
  statusMsg?: string
  headers?: { [k: string]: string }[]
  contentType?: string
  body?: string
}

export interface CaseReportItemMetrics {
  renderRequestTime?: number
  renderAuthTime?: number
  requestTime?: number
  evalAssertionTime?: number
  totalTime?: number
}

export interface CaseResult extends AbstractResult {
  request?: CaseResultRequest
  response?: CaseResultResponse
}

export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE']
export const PROTOCOLS = ['http', 'https']
export const ContentTypes = {
  JSON: 'application/json',
  X_WWW_FORM_URLENCODED: 'application/x-www-form-urlencoded',
  TEXT_PLAIN: 'text/plain',
}

export interface ApiImport {
  openApi?: string
  group?: string
  project?: string
  preview?: boolean
}

export interface AuthorizeAndValidate {
  type?: string
  description?: string
  template?: string
}

export interface Authorization {
  type?: string
  data?: object
}

export interface Environment extends BaseDoc {
  group?: string
  project?: string
  auth?: Authorization[]
  namespace?: string
  enableProxy?: boolean
  server?: string
  custom?: KeyValueObject[]
  headers?: KeyValueObject[]
}

export interface IndexResultData {
  result?: string
  _id?: string
  _index?: string
  _type?: string
  _version?: number
}


export interface JobTrigger {
  project?: string
  group?: string
  startNow?: boolean
  startDate?: number
  endDate?: number
  repeatCount?: number
  interval?: number
  cron?: string
  triggerType?: string
}

export interface Job extends BaseDoc {
  classAlias?: string
  createdAt?: string
  group?: string
  project?: string
  env?: string
  labels?: LabelRef[]
  comment?: string
  scheduler?: string
  jobData?: JobData
  trigger?: JobTrigger[]
  imports?: VariablesImportItem[]
}

export interface JobReportData {
  dayIndexSuffix?: string
  cases?: CaseReportItem[]
  scenarios?: ScenarioReportItem[]
  ext?: Object
}

export interface CaseDataItemRequest {
  method?: string
  url?: string
  headers?: object
  body?: string
}

export interface JobReportDataItem {
  reportId?: string
  caseId?: string
  scenarioId?: string
  jobId?: string
  metrics?: CaseReportItemMetrics
  request?: ReportDataItemRequest
  response?: ReportDataItemResponse
  assertions?: Object
  assertionsResult?: Object
}

export interface JobReportDataStatistic {
  caseCount?: number
  caseOK?: number
  caseKO?: number
  scenarioCount?: number
  scenarioOK?: number
  scenarioKO?: number
  scenarioCaseCount?: number
  scenarioCaseOK?: number
  scenarioCaseKO?: number
  scenarioCaseOO?: number
  okRate?: number
  assertionPassed?: number
  assertionFailed?: number
}

export interface JobReport extends BaseDoc {
  scheduler?: string
  group?: string
  project?: string
  type?: string
  jobId?: string
  jobName?: string
  classAlias?: string
  startAt?: string
  endAt?: string
  elapse?: number
  result?: string
  errorMsg?: string
  node?: string
  data?: JobReportData
  statis?: JobReportDataStatistic
}

export interface JobNotify extends BaseDoc {
  group?: string
  project?: string
  jobId?: string
  subscriber?: string
  type?: string
  trigger?: string
  enabled?: boolean
  data?: Object
}

export interface JobExecDesc {
  job?: Job
  report?: JobReport
}

export interface CaseReportItem {
  id?: string
  title?: string
  itemId?: string
  status?: string
  msg?: string
  type?: string
  statis?: CaseStatis
}

export interface ScenarioReportItem {
  id?: string
  title?: string
  status?: string
  msg?: string
  steps?: CaseReportItem[]
}

export interface JobReportData {
  cases?: CaseReportItem[]
  scenarios?: ScenarioReportItem[]
  ext?: Object
  renderedDescription?: string
}

export interface IndexDocResponse {
  id?: string
}

export interface UpdateDocResponse {
  id?: string
  result?: string
}

export interface Assertion {
  name?: string
  description?: string
}

export interface TransformFunction {
  name?: string
  description?: string
}

export interface CaseGeneratorListItem {
  map?: KeyValueObject[]
  assert?: any
}

export interface CaseGenerator {
  script?: string
  list?: CaseGeneratorListItem[]
  count?: number
  variables?: object[]
}

export interface ReportItemEvent {
  index?: number
  status?: string
  errMsg?: string
  result?: AbstractResult
}

export interface ContextOptions {
  jobEnv?: string
  scenarioEnv?: string
  caseEnv?: string
  initCtx?: Object
}

export interface DebugOptions {
  times?: number
}

export interface DeleteResData {
  case?: DataBody<Case[]>
  scenario?: DataBody<Scenario[]>
  job?: DataBody<Job[]>
}

export interface DomainOnlineLog {
  name?: string
  tag?: string
  count?: number
  date?: string
  coverage?: number
}

export interface RestApiOnlineLog {
  domain?: string
  tag?: string
  method?: string
  urlPath?: string
  count?: number
  percentage?: number
  belongs?: GroupProject[]
  metrics?: Metrics
}

export interface Metrics {
  p25?: number
  p50?: number
  p75?: number
  p90?: number
  p95?: number
  p99?: number
  p999?: number
  min?: number
  avg?: number
  max?: number
}

export interface GroupProject {
  group?: string
  project?: string
  covered?: boolean
  count?: number
}

export interface ProjectApiCoverage {
  group?: string
  project?: string
  domain?: string
  date?: string
  coverage?: number
}

export interface FieldPattern {
  field?: string
  value?: string
  alias?: string
  type?: string
}

export interface DomainOnlineConfig extends BaseDoc {
  domain?: string
  tag?: string
  maxApiCount?: number
  minReqCount?: number
  exSuffixes?: string
  inclusions?: FieldPattern[]
  exclusions?: FieldPattern[]
  exMethods?: LabelRef[]
}

export interface DubboRequestBody {
  dubboGroup?: string
  interface?: string
  method?: string
  parameterTypes?: ParameterType[]
  args?: string
  address?: string
  port?: number
  version?: string
  zkConnectString?: string
  zkUsername?: string
  zkPassword?: string
  path?: string
  enableLb?: boolean
  lbAlgorithm?: string
}

export interface DubboRequest extends BaseDoc {
  group?: string
  project?: string
  env?: string
  request?: DubboRequestBody
  generator?: CaseGenerator
  assert?: object
  labels?: LabelRef[]
  exports?: VariablesExportItem[]
}

export interface SqlRequestBody {
  host?: string
  port?: number
  username?: string
  password?: string
  encryptedPass?: string
  database?: string
  table?: string
  sql?: string
  exports?: VariablesExportItem[]
}

export interface SqlRequest extends BaseDoc {
  group?: string
  project?: string
  env?: string
  request?: SqlRequestBody
  assert?: object
  labels?: LabelRef[]
  generator?: CaseGenerator
  exports?: VariablesExportItem[]
}

export interface DubboRequestReportModel {
  body?: any
}

export interface SqlRequestReportModel {
  body?: any
}

type ReportDataItemRequest = CaseDataItemRequest | SqlRequest | DubboRequest
type ReportDataItemResponse = CaseResultResponse | DubboRequestReportModel | SqlRequestReportModel

export interface VariablesExportItem {
  srcPath?: string
  dstName?: string
  scope?: string
  description?: string
  enabled?: boolean
  function?: string
  extra?: ExtraData
}

export interface ExtraData {
  options?: KeyValueObject[]
  script?: string
}

export interface VariablesImportItem {
  name?: string
  scope?: string
  value?: any
  type?: string
  extra?: ExtraData
  description?: string
  enabled?: boolean
  exposed?: boolean
  function?: string
}

export interface Activity {
  group?: string
  project?: string
  user?: string
  type?: string
  targetId?: string
  timestamp?: string
  data?: any
}

export interface Favorite extends BaseDoc {
  group: string
  project: string
  summary?: string
  user?: string
  type: string
  targetType: string
  targetId: string
  timestamp?: string
  checked?: boolean
  data?: any
}

export interface ControllerOptions {
  from?: number
  to?: number
  enableLog?: boolean
  enableReport?: boolean
}

export interface ScenarioTestWebMessage {
  summary: string
  description?: string
  steps: ScenarioStep[]
  options?: ContextOptions
  imports?: VariablesImportItem[]
  exports?: VariablesExportItem[]
  controller?: ControllerOptions
}

export interface JobTestMessage {
  jobId: string
  jobMeta: JobMeta
  jobData: JobData,
  imports?: VariablesImportItem[]
  controller?: ControllerOptions
}

export interface ReadinessCheck {
  enabled?: boolean
  targetType?: string
  targetId?: string
  delay?: number
  interval?: number
  timeout?: number
  retries?: number
}

export interface CiTrigger extends BaseDoc {
  group?: string
  project?: string
  debounce?: number
  enabled?: boolean
  targetType?: string
  targetId?: string
  env?: string
  service?: string
  readiness?: ReadinessCheck
}

export interface TriggerEventLog {
  group?: string
  project?: string
  env?: string
  author?: string
  service?: string
  type?: string
  timestamp?: string
  triggerId?: string
  targetType?: string
  targetGroup?: string
  targetProject?: string
  targetId?: string
  result?: string
  reportId?: string
  createdAt?: string
}

export const FavoriteType = {
  TYPE_TOP_TOP: 'toptop',
  TYPE_WATCH: 'watch',
  TYPE_STAR: 'star',
  TYPE_FOLLOW: 'follow'
}

export const FavoriteTargetType = {
  TARGET_TYPE_SCENARIO: 'scenario',
  TARGET_TYPE_JOB: 'job',
}

export const ImportItemType = {
  ENUM: 'enum'
}

export const TimeUnit = {
  MILLI: 'milli',
  SECOND: 'second',
  MINUTE: 'minute',
}

export const TriggerEventLogType = {
  miss: 'miss',
  debounce: 'debounce',
  ill: 'ill',
  unknown: 'unknown',
  error: 'error',
  success: 'success',
  fail: 'fail'
}
