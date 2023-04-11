import 'app/style/index.scss'
import 'element-ui/lib/theme-chalk/base.css'
import Vue from 'vue'
import { Already, Inject, Root, Service } from 'ioc-di'
import VueDIProvider from '@/common/vue/ioc-di'
import AppControl from 'app/components/control'
import Request from '@/common/request'
import ElNotification from '@/common/element-ui/notification'
import Websocket from '@/common/websocket'

@Root()
@Service()
export default class App {
  @Inject() private provider!: VueDIProvider
  private token = `s_${Math.random().toString(36)}` //应用级身份标识
  vue!: Vue
  constructor() {
    this.init()
  }

  @Already
  private init() {
    Request.main.bindToken(this.token)
    Request.main.bindBaseUrl(ENV.mainApi)
    Request.main.bindErrorhandler(error => {
      ElNotification.warning({
        title: '操作未完成',
        message: error
      })
    })
    // Websocket.main.bindToken(this.token)
    Websocket.main.bindBaseUrl(ENV.socketApi)

    const self = this
    this.vue = new Vue({
      el: '#app',
      beforeCreate() {
        self.provider.bind(this)
      },
      render(h) {
        return h(AppControl)
      }
    })
  }
}