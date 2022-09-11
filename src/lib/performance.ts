import { PerformanceData } from "../type/performance";

import { Client } from "../core/Client";
import { keyType } from "../type/index";

function getPerformanceDataI(firstPaint?: number, firstContentfulPaint?: number, largestContentfulPaint?: number) {
  // performance.timing: PerformanceTiming 兼容至 IE9
  const {
    fetchStart,
    connectStart,
    connectEnd,
    responseStart,
    responseEnd,
    domLoading,
    domInteractive,
    domContentLoadedEventStart,
    domContentLoadedEventEnd,
    loadEventStart,
    domainLookupStart,
    domainLookupEnd,
  } = performance.timing
  const perfoemanceData: PerformanceData = {
    connectTime: connectEnd - connectStart,
    ttfbTime: responseStart - fetchStart,
    responseTime: responseEnd - responseStart,
    parseDOMTime: domInteractive - responseEnd,
    domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart, // domContentLoadedEventEnd – fetchStart
    domContentLoaded: domContentLoadedEventEnd - fetchStart,
    loadTime: loadEventStart - fetchStart,
    parseDNSTime: domainLookupEnd - domainLookupStart,
    domReadyTime: domContentLoadedEventStart - fetchStart,
    firstPaint,
    timeToInteractive: domInteractive - domLoading,
    firstContentfulPaint,
    largestContentfulPaint,
  }
  return perfoemanceData
}

export async function getPerformanceData() {
  let firstPaint: number
  let firstContentfulPaint: number
  let largestContentfulPaint: number
  new PerformanceObserver((entryList, observer) => {
    const entryFp = entryList.getEntriesByName('first-paint')
    const entryFcp = entryList.getEntriesByName('first-contentful-paint')
    firstPaint = Math.round(entryFp[0].startTime)
    firstContentfulPaint = Math.round(entryFcp[0].startTime)
    observer.disconnect()
  }).observe({ type: 'paint', buffered: true })
  new PerformanceObserver((entryList, observer) => {
    const entries = entryList.getEntries()
    const entry = entries[entries.length - 1]
    largestContentfulPaint = Math.round(entry.startTime)
    observer.disconnect()
  }).observe({ type: 'largest-contentful-paint', buffered: true })

  window.addEventListener('load', () => {
    setTimeout(() => {
      const data = getPerformanceDataI(firstPaint, firstContentfulPaint, largestContentfulPaint)
      // console.log(data)
      Client.sender.saveData(data, keyType.Performance)

    }, 2500)
  })
}
