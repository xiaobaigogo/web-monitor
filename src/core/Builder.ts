import { baseType, buildDataType } from "../type/index";


export class Builder {
  static BuildData: (data: baseType) => buildDataType
  private baseBuilder:Record<string, any> = { }

  constructor(app_id:string, app_name:string) {
    this.baseBuilder.app_id = app_id
    this.baseBuilder.app_name = app_name

    Builder.BuildData = (data: baseType): buildDataType => {
      return {
        ...data,
        app_id: this.baseBuilder.app_id,
        app_name: this.baseBuilder.app_name
      } as buildDataType
    }
  } 
}

// export const baseBuilder:Record<string, any> = {}

// export function BuildData(data: baseType): buildDataType {
//   return {
//     ...data,
//     app_id: baseBuilder.app_id,
//     app_name: baseBuilder.app_name
//   } as buildDataType
// }