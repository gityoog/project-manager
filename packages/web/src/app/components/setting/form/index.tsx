import ElButton from '@/common/element-ui/button'
import ElForm from '@/common/element-ui/form'
import ElFormItem from '@/common/element-ui/form/item'
import ElInput from '@/common/element-ui/input'
import { FC } from '@/common/vue'
import ElLoading, { iElLoading } from '@/components/el-loading'
import style from './style.module.scss'

export interface iSettingForm {
  data: {
    shell: string
  }
  status: iElLoading
  saveShellLoading: boolean
  saveShell(): void
  clearOutput(): void
  clearLog(): void
}

const SettingForm = FC<{ service: iSettingForm }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { data, status, saveShellLoading } = service
    return <ElLoading status={status} class={style.form}>
      <ElForm size='small' labelWidth='50px' labelPosition='left'>
        <ElFormItem label='shell'>
          <ElInput v-model={data.shell} style="width: 300px;">
            <ElButton loading={saveShellLoading} onClick={() => service.saveShell()} slot="append">保存</ElButton>
          </ElInput>
        </ElFormItem>
        <ElFormItem label='缓存'>
          <ElButton onClick={() => service.clearOutput()} type='text'>清空输出</ElButton>
          <ElButton onClick={() => service.clearLog()} type='text'>清空日志</ElButton>
        </ElFormItem>
      </ElForm>
    </ElLoading>
  }
})
export default SettingForm