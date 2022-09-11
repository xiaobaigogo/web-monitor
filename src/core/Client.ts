import { buildDataType, configType, isRecord } from "../type/index"
import { Builder } from "./Builder"
import { Sender } from "./Sender"
import { handleBuildConfig, handleConfig, handleSendConfig } from "./Config"


export class Client {
  static app_id: string
  static app_name: string
  static url: string
  static queue: buildDataType[]

  static config: Partial<isRecord>

  static builder: Builder
  static sender: Sender

  constructor(config: configType) {
    const { app_id, app_name, url } = config
    Client.app_id = app_id
    Client.app_name = app_name
    Client.url = url

    Client.config = config.config

    Client.sender = handleSendConfig(Client.url, config.sendConfig)
    Client.builder = handleBuildConfig(Client.app_id, Client.app_name)

    setTimeout(() => {
      handleConfig(config.config)
    }, 0);
  }
}