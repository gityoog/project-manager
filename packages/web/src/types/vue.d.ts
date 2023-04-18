import Vue from 'vue'

declare module 'vue/types/jsx' {
  interface HTMLAttributes extends JSX.VueComponentAttributes {
    // 扩展原生html组件 vue固有的属性
  }
}