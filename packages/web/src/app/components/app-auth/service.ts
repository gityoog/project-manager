import Status from "@/common/status"
import { iAppAuth } from "."
import { MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/message-box.css'
import AppApi from "@/app/api"
import { Inject, Service } from "ioc-di"
import LocaleService from "@/app/common/locale"

@Service()
export default class IAppAuth implements iAppAuth {
  @Inject() locale!: LocaleService
  status = new Status
  enabled = true
  private handleLock = false
  private get $t() {
    return this.locale.t
  }
  init() {
    this.enabled = true
    this.status.use(
      AppApi.user.info().success(data => {
        this.enabled = false
        console.log(data)
      }).fail(error => {
        console.log(error)
      }), true
    )
  }

  noAuth() {
    if (this.handleLock) return
    if (this.status.loading) return
    this.handleLock = true
    MessageBox({
      title: this.$t.auth.expired,
      message: this.$t.auth.expiredMessage,
      showCancelButton: true,
      confirmButtonText: this.$t.tip.confirm,
      cancelButtonText: this.$t.tip.cancel,
      callback: confirm => {
        this.handleLock = false
        if (confirm === 'confirm') {
          this.init()
        }
      }
    })
  }

  data = {
    password: '',
  }
  submiting = false
  submit() {
    AppApi.user.pwd({
      pwd: this.data.password
    }).success(data => {
      this.enabled = false
    }).load(() => {
      this.submiting = true
    }).final(() => {
      this.submiting = false
      this.data.password = ''
    })
  }

}