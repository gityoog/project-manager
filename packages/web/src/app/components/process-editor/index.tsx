import LocaleService from '@/app/common/locale'
import ElAutocomplete from '@/common/element-ui/autocomplete'
import ElForm from '@/common/element-ui/form'
import ElFormItem from '@/common/element-ui/form/item'
import { FC } from '@/common/vue'
import ElDialog, { iElDialog } from '@/components/el-dialog'
import EnvEditor, { iEnvEditor } from '@/components/env-editor'

export interface iProcessEditor {
  dialog: iElDialog
  data: {
    encoding: string
  }
  env: iEnvEditor
  locale: LocaleService
  queryEncoding: (query: string, callback: (list: { value: string }[]) => void) => void
}

const ProcessEditor = FC<{ service: iProcessEditor }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { dialog, data, locale, env } = service
    const $t = locale.t.project.edit.process
    return <ElDialog appendToBody title={$t.title} service={dialog}>
      <ElForm size='small' labelWidth='100px' labelPosition='right'>
        <ElFormItem label={$t.encoding}>
          <ElAutocomplete placeholder='utf8' vModel={data.encoding} style="width: 240px;" fetch-suggestions={(query, callback) => {
            service.queryEncoding(query, callback)
          }}></ElAutocomplete>
        </ElFormItem>
        <ElFormItem label={$t.env}>
          <EnvEditor lang={locale.t.lang} service={env} />
        </ElFormItem>
      </ElForm>
    </ElDialog>
  }
})
export default ProcessEditor