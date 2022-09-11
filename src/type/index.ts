export interface baseType {
  [key: string]: any
}

export enum keyType {
  Error = 'error',
  Device = 'device',
  Performance = 'Performance',
  Behavior = 'Behavior',
  Ajax = 'Ajax',
  Pv = 'Pv',
  Uv = 'Uv'
}

export interface buildDataType {
  type: keyType
  data: baseType
  uv: string
  app_id: string
  app_name?: string
}

export interface configType {
  url: string
  app_id: string
  app_name: string
  config: isRecord
  [key: string]: any
}

export interface isRecord {
  isRecordBehavior: boolean
  isRecordAjax: boolean
  isRecordDevice: boolean
  isRecordPerformance: boolean
  isRecordJsError: boolean
  isRecordPromiseError: boolean
  isRecordResourceError: boolean
  isRecordPv: boolean
  isRecordPvHashTag: boolean
}

export interface sendConfig {
  maxLen: number
  maxTime: number
  mode: reportType
}

export enum reportType {
  lazyReport = 'lazyReport',
  standard = 'standard',
  immediate = 'immediate'
}