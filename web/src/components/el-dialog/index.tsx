import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Dialog from '@/common/element-ui/dialog'
import ElLoading, { iElLoading } from 'components/el-loading'
import style from './style.module.scss'
import ElScrollbar from '@/common/element-ui/scrollbar'
import ElButton from '@/common/element-ui/button'

export interface iElDialog {
  visible: boolean
  scroll: boolean
  maxHeight: string
  footer: boolean
  isCanSubmit: boolean

  status: {
    loading: boolean
    error: boolean
    msg: string
  }

  loading: iElLoading
  close: () => void
  submit: () => void
  fireClose: () => void
  onOpened?: () => void
  beforeClose?: (done: () => void) => void

  width: string
  title: string
  closeOnClickModal: boolean
  top?: string
  appendToBody?: boolean
  center?: boolean
}

@Component
export default class ElDialog extends Vue {
  $props!: {
    service: iElDialog
    top?: string
    width?: string
    customClass?: string
    title?: string
    maxHeight?: string
    fullHeight?: boolean
  }
  @Prop() service!: iElDialog
  @Prop() top?: string
  @Prop() width?: string
  @Prop() customClass?: string
  @Prop() title?: string
  @Prop() maxHeight?: string
  @Prop(Boolean) fullHeight!: boolean

  @Watch('service.visible')
  onVisibleChange(visible: boolean) {
    if (visible) {
      this.resize()
    }
  }

  resize = () => {
    if (this.service.visible) {
      this.service.maxHeight = Math.floor(document.body.clientHeight * 0.6 - 100) + 'px'
    }
  }
  mounted() {
    document.addEventListener('resize', this.resize)
  }
  beforeDestroy() {
    document.removeEventListener('resize', this.resize)
  }

  protected render() {
    return (
      <Dialog
        class={style.editor}
        customClass={this.customClass}
        top={this.top ?? this.service.top}
        width={this.width ?? this.service.width}
        appendToBody={this.service.appendToBody}
        title={this.title ?? this.service.title}
        closeOnClickModal={this.service.closeOnClickModal}
        center={this.service.center}
        before-close={this.service.beforeClose}
        visible={this.service.visible}
        on={{
          'update:visible': (visible: boolean) => this.service.visible = visible,
          'opened': () => this.service.onOpened?.(),
          'closed': () => this.service.fireClose()
        }}
      >
        {this.$slots.title && <template slot='title'>{this.$slots.title}</template>}
        <ElLoading style="min-height: 40px;" status={this.service.loading}>{this.service.scroll ?
          <ElScrollbar wrapStyle={`max-height: ${this.maxHeight ?? this.service.maxHeight};`}>
            {this.$slots.default}
          </ElScrollbar>
          : this.fullHeight ? <div style={`height: ${this.maxHeight ?? this.service.maxHeight}`}>{this.$slots.default}</div> : this.$slots.default
        }</ElLoading>
        {this.service.footer && (!this.service.loading.loading && !this.service.loading.error && this.service.isCanSubmit ?
          <span slot="footer">
            {this.service.status.error ? <div class={[style.loadMsg, 'el-dialog__footer-msg']}>{this.service.status.msg}</div> : null}
            {this.$slots.footer}
            <ElButton size="small" onClick={() => this.service.close()} >取 消</ElButton>
            <ElButton loading={this.service.status.loading} size="small" type="primary" onClick={() => this.service.submit()}>确 定</ElButton>
          </span> :
          <span slot="footer">
            {this.$slots.footer}
            <ElButton size="small" onClick={() => this.service.close()}>关 闭</ElButton>
          </span>)}
      </Dialog>
    )
  }
}