import 'element-ui/lib/theme-chalk/base.css'
import Vue from 'vue'
import { Already, Inject, Root, Service } from 'ioc-di'
import VueDIProvider from '@/common/vue/ioc-di'
import AppControl from '@/app/components/app-control'
import Request from '@/common/request'
import ElNotification from '@/common/element-ui/notification'
import Websocket from '@/common/websocket'
import LocaleService from './common/locale'
import 'app/style/index.scss'
import IAppAuth from './components/app-auth/service'
import AppAuth from './components/app-auth'

@Root()
@Service()
export default class App {
  @Inject() private provider!: VueDIProvider
  @Inject() private locale!: LocaleService
  @Inject() private auth!: IAppAuth

  private token = `s_${Math.random().toString(36)}` //应用级身份标识
  vue!: Vue
  constructor() {
    this.init()
  }


  @Already
  private init() {
    Request.main.bindToken(this.token)
    Request.main.bindBaseUrl(ENV.mainApi)
    Request.main.bindNoAuthHandler(() => {
      this.auth.noAuth()
    })
    Request.main.bindErrorhandler(error => {
      ElNotification.warning({
        title: '操作未完成',
        message: error
      })
    })
    // Websocket.main.bindToken(this.token)
    Websocket.main.bindBaseUrl(ENV.socketApi)

    const self = this
    Vue.observable(self.auth)
    Vue.observable(this.locale)
    this.auth.init()

    this.vue = new Vue({
      el: '#app',
      beforeCreate() {
        self.provider.bind(this)
      },
      render(h) {
        return self.auth.enabled
          ? h(AppAuth, { props: { service: self.auth } })
          : h(AppControl)
      }
    })
  }
}