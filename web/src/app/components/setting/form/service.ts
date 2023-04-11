import { Service } from "ioc-di"
import { iSettingForm } from "."

@Service()
export default class ISettingForm implements iSettingForm {
  data = {
    shell: 'cmd.exe /C'
  }
}