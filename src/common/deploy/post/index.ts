import { getErrorMessage } from "@/common/utils"
import DeployBasic from "../basic"
import Axios, { CancelTokenSource } from "axios"
import FormData from 'form-data'
import NodeRSA, { SigningSchemeHash } from 'node-rsa'
import { Readable } from 'stream'
import DataQueue from "./data-queue"

type data = {
  url: string
  sign: {
    key: string
    scheme: string
  }
  form: {
    sign: string
    file: string
    version: string
  }
  payload?: {
    key: string
    value: string
  }[]
}


export default class DeployByPost extends DeployBasic {
  private options: Partial<data> | null = null
  private source: CancelTokenSource | null = null
  async run(file: Buffer, data: { version: string | null }): Promise<boolean> {
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
    const formData = new FormData()
    formData.append(this.options.form?.file || 'file', file, { filename: 'update.zip' })
    formData.append(this.options.form?.version || 'version', data.version || '')
    this.options.payload?.forEach(item => {
      formData.append(item.key, item.value)
    })
    if (this.options.sign?.key) {
      try {
        const rsa = new NodeRSA()
        rsa.importKey(this.options.sign.key)
        if (this.options.sign.scheme) {
          rsa.setOptions({
            signingScheme: this.options.sign.scheme as SigningSchemeHash
          })
        }
        const sign = rsa.sign(file, 'base64')
        formData.append(this.options.form?.sign || 'sign', sign)
      } catch (e) {
        this.emitFail('Sign Error: ' + getErrorMessage(e))
        return false
      }
    }
    this.source = Axios.CancelToken.source()
    Axios.post<Readable>(this.options.url, formData, {
      headers: formData.getHeaders(),
      cancelToken: this.source.token,
      responseType: 'stream',
      onUploadProgress: (progress) => {
        if (progress.progress) {
          if (progress.progress < 1) {
            this.emitProgress('POST: ' + Math.floor(progress.progress * 100) + '%')
          } else {
            this.emitProgress('Waiting...')
          }
        }
      },
    }).then((res) => {
      const length = res.headers['content-length'] || res.headers['Content-Length']
      if (length) {
        this.emitSuccess(
          res.data.read().toString()
        )
      } else {
        DataQueue.from(res.data, {
          data: (chunk) => {
            this.emitProgress(chunk)
          },
          finish: (last) => {
            if (!last || ['ok', 'success'].includes(last)) {
              this.emitSuccess(last)
            } else {
              this.emitFail(last)
            }
          },
          error: (e) => {
            this.emitFail('Request Error: ' + getErrorMessage(e))
          }
        })
      }
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