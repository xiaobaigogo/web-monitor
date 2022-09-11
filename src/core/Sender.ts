import { baseType, keyType, buildDataType, reportType } from "../type/index"
// import { getUv } from "../lib/behavior";
import { Builder } from "./Builder"

import { getUv } from "../lib/behavior";

const uv = getUv()

// let defaultReportType = reportType.standard

// /**
//  * 将数据存到队列中
//  * @param data 
//  */
// export function saveData(data: baseType, type: keyType) {
//   const fixdata = BuildData({ data, type, uv })
//   sendQueue.push(fixdata)
//   // console.log(sendQueue)
//   if (defaultReportType === reportType.immediate) {
//     // 实时监听sendQueue变动
//   }
// }

// /**
//  * 发送数据
//  * @param url
//  */
// export function sendData(url: string = base_url, maxLen: number) {
//   maxLen = maxLen
//   const sendEvents = sendQueue.splice(0, Math.min(maxLen, sendQueue.length))
//   const send = navigator.sendBeacon ?
//     navigator.sendBeacon.bind(navigator) :
//     (url: string = base_url, data: string) => {
//       const beacon = new Image()
//       beacon.src = `${url}?data=${encodeURIComponent(data)}`
//     }

//   // console.log(JSON.stringify(sendEvents))
//   send(url, JSON.stringify(sendEvents))
// }


// /**
//  * 上报数据
//  * @param url
//  */
// export function reportData(url: string = base_url, mode: reportType = reportType.standard, maxLen: number, maxTime?: number) {
//   // console.log(mode)
//   let timer: number
//   switch (mode) {
//     case reportType.lazyReport:
//       defaultReportType = reportType.lazyReport
//       window.addEventListener('visibilitychange', () => {
//         if (document.visibilityState === 'hidden') sendData(url, sendQueue.length)
//       })
//       break;
//     case reportType.standard:
//       defaultReportType = reportType.standard
//       const fun = () => {
//         if (sendQueue.length) {
//           sendData(url, maxLen)
//         }
//         timer = setTimeout(fun, maxTime);
//       }
//       timer = setTimeout(fun, maxTime)
//       break;
//     case reportType.immediate:
//       defaultReportType = reportType.immediate
//       break
//     default:
//       break;
//   }

//   window.addEventListener('beforeunload', () => {
//     if (sendQueue.length) {
//       sendData(url, sendQueue.length)
//     }
//     clearInterval(timer)
//   })
// }


export class Sender {
  private base_url: string
  private sendQueue: buildDataType[] = []
  private mode: reportType
  //@ts-expect-error
  private timer: number

  private maxLen = 50
  private maxTime = 5000
  constructor(url: string, maxLen: number, maxTime: number, mode?: reportType) {
    this.base_url = url || "http://localhost:3000/"
    this.maxLen = maxLen
    this.maxTime = maxTime
    this.mode = mode || reportType.standard

    this.initReportDataType()
  }

  saveData(data: baseType, type: keyType) {
    const fixdata = Builder.BuildData({ data, type, uv })
    this.sendQueue.push(fixdata)
    console.log(fixdata)
    // if (this.mode == reportType.immediate) {
    //   this.sendData()
    // } else if (this.sendQueue.length > this.maxLen) {
    //   this.sendData()
    // }
  }

  sendData(all: boolean = false) {
    if (all) {
      const sendEvents = this.sendQueue.splice(0, this.sendQueue.length)
      if (sendEvents.length == 0) return
      const send = navigator.sendBeacon ?
        navigator.sendBeacon.bind(navigator) :
        (url: string = this.base_url, data: string) => {
          const beacon = new Image()
          beacon.src = `${url}?data=${encodeURIComponent(data)}`
        }

      // console.log(JSON.stringify(sendEvents))
      send(this.base_url, JSON.stringify(sendEvents))
    } else {
      const sendEvents = this.sendQueue.splice(0, Math.min(this.maxLen, this.sendQueue.length))
      if (sendEvents.length == 0) return
      const send = navigator.sendBeacon ?
        navigator.sendBeacon.bind(navigator) :
        (url: string = this.base_url, data: string) => {
          const beacon = new Image()
          beacon.src = `${url}?data=${encodeURIComponent(data)}`
        }

      // console.log(JSON.stringify(sendEvents))
      send(this.base_url, JSON.stringify(sendEvents))
    }
  }

  initReportDataType() {
    switch (this.mode) {
      case reportType.lazyReport:
        window.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') this.sendData(true)
        })
        break;
      case reportType.standard:
        const fun = () => {
          if (this.sendQueue.length) {
            this.sendData()
          }
          this.timer = setTimeout(fun, this.maxTime);
        }
        this.timer = setTimeout(fun, this.maxTime)
        window.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') this.sendData(true)
          clearInterval(this.timer)
        })
        break;
      case reportType.immediate:
        this.sendData(true)
        break
      default:
        break;
    }
  }

}