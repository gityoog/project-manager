import ElButton from '@/common/element-ui/button'
import ElForm from '@/common/element-ui/form'
import ElFormItem from '@/common/element-ui/form/item'
import ElInput from '@/common/element-ui/input'
import ElSelect from '@/common/element-ui/select'
import ElOption from '@/common/element-ui/option'
import { FC } from '@/common/vue'
import ElLoading, { iElLoading } from '@/components/el-loading'
import style from './style.module.scss'
import LocaleService from '@/app/common/locale'
import ElCheckBox from '@/common/element-ui/checkbox'

export interface iServerSetting {
  data: {
    shell: string
    pty: string
    keepProcess: boolean
  }
  ptys: {
    name: string
    value: string
  }[]
  status: iElLoading
  saveLoading: boolean
  locale: LocaleService
  save(): void
  refresh(): void
  clearOutput(): void
  clearLog(): void
}

const ServerSetting = FC<{ service: iServerSetting }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { data, status, saveLoading, ptys, locale } = service
    const $t = locale.t.setting.server
    return <ElLoading status={status} class={style.form}>
      <ElForm size='mini' labelWidth='100px' labelPosition='left'>
        <ElFormItem label={$t.cache}>
          <ElButton onClick={() => service.clearOutput()} type='text'>{$t.clearOutput}</ElButton>
          <ElButton onClick={() => service.clearLog()} type='text'>{$t.clearLog}</ElButton>
        </ElFormItem>
        <ElFormItem label={$t.shell}>
          <ElInput v-model={data.shell} style="width: 240px;"></ElInput>
        </ElFormItem>
        <ElFormItem label={$t.pty}>
          <ElSelect vModel={data.pty} style="width: 240px;">
            {ptys.map(pty => <ElOption value={pty.value} label={pty.name}></ElOption>)}
          </ElSelect>
        </ElFormItem>
        <ElFormItem label={$t.keepProcess}>
          <ElCheckBox vModel={data.keepProcess}>{locale.t.tip.enabled}</ElCheckBox>
        </ElFormItem>
        <ElFormItem>
          <ElButton onClick={() => service.refresh()}>{$t.reset}</ElButton>
          <ElButton loading={saveLoading} onClick={() => service.save()} type='primary'>{$t.save}</ElButton>
        </ElFormItem>
      </ElForm>
    </ElLoading>
  }
})
export default ServerSetting