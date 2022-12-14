import { baseType } from "./index";
/**
 * @url 页面地址
 * @referer 源页面
 * @title 页面标题
 * @time 访问时间
 */
export interface PvData extends baseType {
  url: URL | string,
  referer: URL | string,
  title: string,
  time: string
}

/**
 * @dom 页面元素
 * @eventType 操作事件
 * @time 操作时间
 */
export interface BehaviorData extends baseType {
  dom: string | null,
  eventType: string | undefined,
  time: string
}