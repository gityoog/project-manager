import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ElDialog, { iElDialog } from '@/components/el-dialog'
import ElInput from '@/common/element-ui/input'

export interface iConfirmDialog {
  dialog: iElDialog
  message: string
  content?: string
  data: {
    content: string
  }
}

@Component
export default class ConfirmDialog extends Vue {
  $props!: {
    service: iConfirmDialog
  }
  @Prop() service!: iConfirmDialog
  protected render() {
    const { dialog, message, content, data } = this.service
    return <ElDialog service={dialog}>
      <div style="white-space: pre-wrap;">{message}</div>
      {content && <ElInput style="margin-top: 10px;" vModel={data.content} placeholder={content} type="textarea" rows={6}></ElInput>}
    </ElDialog>
  }
}
