import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import style from './style.module.scss'
import CheckSvg from 'app/images/check.svg'
import UnCheckSvg from 'app/images/uncheck.svg'
import RemoveSvg from 'app/images/remove.svg'
import { DIComponent, Inject } from '@/common/vue/ioc-di'
import LocaleService from '@/app/common/locale'

export interface iProjectSelector {
  visible: boolean
  isAllChecked(): boolean
  toggleAll(): void
  remove(): void
}

@DIComponent({
  computed: {
    isAllChecked(this: ProjectSelector) {
      return this.service.isAllChecked()
    }
  }
})
export default class ProjectSelector extends Vue {
  @Prop() service!: iProjectSelector
  @Inject() private locale!: LocaleService

  private isAllChecked!: boolean

  protected render() {
    const $t = this.locale.t.selector
    return <div v-show={this.service.visible} class={style.toolbar}>
      <div onClick={() => this.service.toggleAll()} class={style.textBt}>{this.isAllChecked ? <CheckSvg /> : <UnCheckSvg />}{$t.checkAll}</div>
      <div onClick={() => this.service.remove()} class={[style.textBt, style.remove]}><RemoveSvg />{$t.remove}</div>
    </div>
  }
}
