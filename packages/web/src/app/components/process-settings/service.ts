import LocaleService from "@/app/common/locale"
import IElDialog from "@/components/el-dialog/service"
import IEnvEditor from "@/components/env-editor/service"
import { Inject, Service } from "ioc-di"
import { iProcessSettings } from "."
import encodings from "./encodings"

@Service()
export default class IProcessSettings implements iProcessSettings {
  @Inject() locale!: LocaleService
  dialog = new IElDialog
  env = new IEnvEditor
  data = {
    encoding: ''
  }
  encodings: {
    name: string
    value: string
  }[] = []

  queryEncoding(query: string, callback: (list: { value: string }[]) => void) {
    callback(encodings.filter(item => item.toLowerCase().indexOf(query.toLowerCase()) > -1).map(i => ({ value: i })))
  }

  open({ encoding, env }: {
    encoding?: string
    env?: Record<string, string>
  }, callback: (data: {
    encoding?: string
    env?: Record<string, string>
  } | null) => void) {
    this.data = { encoding: encoding || '' }
    this.env.setData(
      env ? Object.keys(env).map(key => ({
        key,
        value: env[key]
      }))
        : [])
    this.dialog.open(() => {
      const env = this.env.getData()
      const result: {
        encoding?: string
        env?: Record<string, string>
      } = {}
      if (this.data.encoding) {
        result.encoding = this.data.encoding
      }
      if (env.length > 0) {
        result.env = env.reduce((t, c) => (t[c.key] = c.value, t), {} as Record<string, string>)
      }
      callback(Object.keys(result).length > 0 ? result : null)
      this.dialog.close()
    })
  }

}