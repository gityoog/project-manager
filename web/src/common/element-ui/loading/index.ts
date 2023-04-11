import Vue from 'vue'
import Loading from 'element-ui/lib/loading.js'
import 'element-ui/lib/theme-chalk/loading.css'

Loading.install(Vue)

// 修复el-loading 不更新spinner的bug
// @ts-ignore
const oldUpdate = Vue.options.directives.loading.update as Function

// @ts-ignore 
Vue.options.directives.loading.update = function (el: HTMLElement & { instance: any }, ...args: any[]) {
  el.instance.spinner = el.getAttribute('element-loading-spinner')
  oldUpdate.apply(this, [el, ...args])
}
