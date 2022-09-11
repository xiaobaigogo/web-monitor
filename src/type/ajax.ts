import { baseType } from "./index";
/**
 * @src 请求url
 * @responseStatus 响应状态码
 * @duration 响应时间
 * @params 请求参数
 * @success 请求成功与否
 */
export interface AjaxData extends baseType {
  src: URL|string,
  responseStatus: number,
  duration?: number,
  params: any,
  success: boolean
}