/**
 * @connectTime TCP连接耗时
 * @ttfbTime ttfb时间:发出页面请求到接收到应答数据第一个字节所花费的毫秒数
 * @responseTime 响应时间
 * @parseDOMTime 解析DOM时间
 * @domContentLoadedTime DOMContentLoaded事件时间
 * @domContentLoaded DOMContentLoaded时间
 * @loadTime 完整的页面加载时间
 * @parseDNSTime DNS解析时间
 * @domReadyTime DOM准备总时间
 * @firstPaint 页面首次渲染时间
 * @largestContentfulPaint 页面最大内容渲染时间
 * @timeToInteractive 页面首次可交互时间
 * @firstMeaningfulPaint 页面最有意义元素渲染时间
 */
export interface PerformanceData {
  connectTime: number | undefined
  ttfbTime: number | undefined
  responseTime: number | undefined
  parseDOMTime: number | undefined
  domContentLoadedTime: number | undefined
  domContentLoaded: number | undefined
  loadTime: number | undefined
  parseDNSTime: number | undefined
  domReadyTime: number | undefined
  firstPaint: number | undefined
  firstContentfulPaint: number | undefined
  largestContentfulPaint: number | undefined
  timeToInteractive: number | undefined
  firstMeaningfulPaint?: number | undefined
}