import { Inject, Service } from "ioc-di"
import { iPostEditorRender } from "."
import LocaleService from "@/app/common/locale"
import IEnvEditor from "@/components/env-editor/service"

type form = {
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
}

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

type data = DeepPartial<form> & {
  payload?: {
    key: string
    value: string
  }[]
}

@Service()
export default class IPostEditorRender implements iPostEditorRender {
  @Inject() locale!: LocaleService
  payload = new IEnvEditor
  data: form = {
    url: '',
    sign: {
      key: '',
      scheme: ''
    },
    form: {
      sign: '',
      file: '',
      version: ''
    }
  }
  setData(data?: data) {
    data = data || {}
    this.data.url = data.url || ''
    this.data.sign.key = data.sign?.key || ''
    this.data.sign.scheme = data.sign?.scheme || ''
    this.data.form.sign = data.form?.sign || ''
    this.data.form.file = data.form?.file || ''
    this.data.form.version = data.form?.version || ''
    this.payload.setData(data.payload || [])
  }
  getData() {
    const data: data = {}
    if (this.data.url) {
      data.url = this.data.url
    }
    if (this.data.sign.key || this.data.sign.scheme) {
      data.sign = {}
      if (this.data.sign.key) {
        data.sign.key = this.data.sign.key
      }
      if (this.data.sign.scheme) {
        data.sign.scheme = this.data.sign.scheme
      }
    }
    data.form = {}
    if (this.data.form.sign) {
      data.form.sign = this.data.form.sign
    }
    if (this.data.form.file) {
      data.form.file = this.data.form.file
    }
    if (this.data.form.version) {
      data.form.version = this.data.form.version
    }
    if (Object.keys(data.form).length === 0) {
      delete data.form
    }
    const payload = this.payload.getData()
    if (payload.length > 0) {
      data.payload = payload
    }
    return data
  }
  queryScheme(query: string, callback: (list: { value: string }[]) => void) {
    callback(
      [
        "pkcs1-ripemd160", "pkcs1-md4", "pkcs1-md5", "pkcs1-sha", "pkcs1-sha1", "pkcs1-sha224",
        "pkcs1-sha256", "pkcs1-sha384", "pkcs1-sha512", "pss-ripemd160", "pss-md4", "pss-md5",
        "pss-sha", "pss-sha1", "pss-sha224", "pss-sha256", "pss-sha384", "pss-sha512"
      ]
        .filter(item => item.toLowerCase().indexOf(query.toLowerCase()) > -1).map(i => ({ value: i }))
    )
  }
}