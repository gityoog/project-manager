import LocaleService from '@/app/common/locale'
import ElAutocomplete from '@/common/element-ui/autocomplete'
import ElForm from '@/common/element-ui/form'
import ElFormItem from '@/common/element-ui/form/item'
import { FC } from '@/common/vue'
import ElDialog, { iElDialog } from '@/components/el-dialog'
import EnvEditor, { iEnvEditor } from '@/components/env-editor'
import ElCheckbox from '@/common/element-ui/checkbox'
import OutputDeploySettings, { iOutputDeploySettings } from './deploy'

export interface iProcessSettings {
  dialog: iElDialog
  data: {
    encoding: string
    autostart: boolean
  }
  env: iEnvEditor
  locale: LocaleService
  deploy: iOutputDeploySettings
  queryEncoding: (query: string, callback: (list: { value: string }[]) => void) => void
}

const ProcessSettings = FC<{ service: iProcessSettings }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { dialog, data, locale, env, deploy } = service
    const $t = locale.t.project.process.setting
    return <ElDialog appendToBody title={$t.title} service={dialog}>
      <ElForm size='small' labelWidth='120px' labelPosition='right'>
        <ElFormItem label={$t.autostart.title}>
          <ElCheckbox vModel={data.autostart}>{$t.autostart.label}</ElCheckbox>
        </ElFormItem>
        <ElFormItem label={$t.encoding}>
          <ElAutocomplete placeholder='utf8' vModel={data.encoding} style="width: 240px;" fetch-suggestions={(query, callback) => {
            service.queryEncoding(query, callback)
          }}></ElAutocomplete>
        </ElFormItem>
        <ElFormItem style="margin-bottom: 0px;" label={$t.env.title}>
          <EnvEditor lang={$t.env} service={env} />
        </ElFormItem>
        <OutputDeploySettings service={deploy} />
      </ElForm>
    </ElDialog>
  }
})
export default ProcessSettings