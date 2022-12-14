import { baseType } from "./index";
/**
 * @errorType 错误类型
 * @errorUrl 发生错误的url
 * @errorMessage 错误信息
 * @errorFilename 发生错误的文件名
 * @errorLineno 错误所在列
 * @errorColno 错误所在行
 * @time 错误发生时间
 */
export interface ErrorData extends baseType {
  errorType: string | undefined
  errorUrl?: string | undefined
  errorMessage: string | undefined
  errorFilename: string | undefined
  errorLineno?: number | undefined
  errorColno?: number | undefined
  time: string
}


