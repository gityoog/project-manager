import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import style from './style.module.scss'
import CheckSvg from 'app/images/check.svg'
import UnCheckSvg from 'app/images/uncheck.svg'
import RemoveSvg from 'app/images/remove.svg'

export interface iProjectSelector {
  visible: boolean
  isAllChecked(): boolean
  toggleAll(): void
  remove(): void
}

@Component({
  computed: {
    isAllChecked(this: ProjectSelector) {
      return this.service.isAllChecked()
    }
  }
})
export default class ProjectSelector extends Vue {
  @Prop() service!: iProjectSelector

  private isAllChecked!: boolean

  protected render() {
    return <div v-show={this.service.visible} class={style.toolbar}>
      <div onClick={() => this.service.toggleAll()} class={style.textBt}>{this.isAllChecked ? <CheckSvg /> : <UnCheckSvg />}全选</div>
      <div onClick={() => this.service.remove()} class={[style.textBt, style.remove]}><RemoveSvg />删除</div>
    </div>
  }
}
