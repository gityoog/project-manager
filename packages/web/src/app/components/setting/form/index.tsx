import ElButton from '@/common/element-ui/button'
import ElForm from '@/common/element-ui/form'
import ElFormItem from '@/common/element-ui/form/item'
import ElInput from '@/common/element-ui/input'
import ElSelect from '@/common/element-ui/select'
import ElOption from '@/common/element-ui/option'
import { FC } from '@/common/vue'
import ElLoading, { iElLoading } from '@/components/el-loading'
import style from './style.module.scss'

export interface iSettingForm {
  data: {
    shell: string
    pty: string
  }
  ptys: {
    name: string
    value: string
  }[]
  status: iElLoading
  saveLoading: boolean
  save(): void
  refresh(): void
  clearOutput(): void
  clearLog(): void
}

const SettingForm = FC<{ service: iSettingForm }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { data, status, saveLoading, ptys } = service
    return <ElLoading status={status} class={style.form}>
      <ElForm size='small' labelWidth='60px' labelPosition='left'>
        <ElFormItem label='cache'>
          <ElButton onClick={() => service.clearOutput()} type='text'>清空输出</ElButton>
          <ElButton onClick={() => service.clearLog()} type='text'>清空日志</ElButton>
        </ElFormItem>
        <ElFormItem label='shell'>
          <ElInput v-model={data.shell} style="width: 240px;"></ElInput>
        </ElFormItem>
        <ElFormItem label='pty'>
          <ElSelect vModel={data.pty} style="width: 240px;">
            {ptys.map(pty => <ElOption value={pty.value}>{pty.name}</ElOption>)}
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton onClick={() => service.refresh()}>重置</ElButton>
          <ElButton loading={saveLoading} onClick={() => service.save()} type='primary'>保存</ElButton>
        </ElFormItem>
      </ElForm>
    </ElLoading>
  }
})
export default SettingForm