
/**
 * @src 请求url
 * @responseStatus 响应状态码
 * @duration 响应时间
 * @params 请求参数
 */
export interface AjaxData {
  src: URL|string,
  responseStatus: number,
  duration?: number,
  params: any,
}