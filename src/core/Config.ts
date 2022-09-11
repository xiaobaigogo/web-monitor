import {
  newFetch,
  newAjax,
  getEventData,
  newHistoryState,
  getDeviceData,
  getPromiseError,
  getJsError,
  getResourceError,
  getPerformanceData
} from "../lib/index";

import { Sender } from "./Sender";

import { isRecord, reportType, sendConfig } from "../type/index";
import { Builder } from "./Builder";

export function handleConfig(config: Partial<isRecord>) {
    if(config.isRecordAjax) {
    newFetch()
    newAjax()
  }

  if (config.isRecordBehavior) {
    getEventData()
  }

  if (config.isRecordDevice) {
    getDeviceData()
  }

  if (config.isRecordJsError) {
    getJsError()
  }

  if (config.isRecordPromiseError) {
    getPromiseError()
  }

  if (config.isRecordResourceError) {
    getResourceError()
  }

  if (config.isRecordPerformance) {
    getPerformanceData()
  }

  if (config.isRecordPv) {
    const pvHashTag = config.isRecordPvHashTag || false
    newHistoryState({ pvHashTag })
  }
}

export function handleBuildConfig(app_id: string, app_name: string) {
  return new Builder(app_id, app_name)
}

export function handleSendConfig(url:string, config: Partial<sendConfig>) {
  let {maxLen = 10, maxTime = 10000, mode = reportType.standard} = config
  return new Sender(url, maxLen, maxTime, mode)
}