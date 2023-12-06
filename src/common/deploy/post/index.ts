import { getErrorMessage } from "@/common/utils"
import DeployBasic from "../basic"
import Axios, { CancelTokenSource } from "axios"
import FormData from 'form-data'

type data = {
  type: string
  url: string
  key: string
}


export default class DeployByPost extends DeployBasic {
  private options: Partial<data> | null = null
  private source: CancelTokenSource | null = null
  async run(file: Buffer): Promise<boolean> {
    if (this.source) {
      return false
    }
    this.emitStart()
    if (!this.options) {
      this.emitFail('No Options')
      return false
    }
    if (!this.options.url) {
      this.emitFail('No Options.Url')
      return false
    }
    if (this.options.type === 'formdata' || this.options.type === 'binary') {
      this.source = Axios.CancelToken.source()
      let data
      let headers
      if (this.options.type === 'formdata') {
        data = new FormData()
        data.append(this.options.key || 'file', file)
        headers = { "Content-Type": "multipart/form-data" }
      } else {
        data = file
        headers = {}
      }
      Axios.post(this.options.url, data, {
        headers
      }).then(() => {
        this.emitSuccess()
      }).catch((e) => {
        if (Axios.isCancel(e)) {
          this.emitFail('Request Cancelled')
        } else {
          this.emitFail('Request Error: ' + getErrorMessage(e))
        }
      }).finally(() => {
        this.source = null
      })
      return true
    } else {
      this.emitFail('Invalid Options.Type:' + this.options.type)
      return false
    }
  }
  async stop(): Promise<boolean> {
    if (this.source) {
      this.source.cancel()
      return true
    }
    return false
  }
  setOptions(data: Partial<data> | null): void {
    this.options = data
  }
  beforeDestroy() {
    this.stop()
    this.source = null
  }
}