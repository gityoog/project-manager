import { FC } from '@/common/vue'
import ElDialog, { iElDialog } from 'components/el-dialog'
import ElForm from '@/common/element-ui/form'
import ElFormItem from '@/common/element-ui/form/item'
import ElInput from '@/common/element-ui/input'
import ElSelect from '@/common/element-ui/select'
import ElOption from '@/common/element-ui/option'
import LocaleService from '@/app/common/locale'
import ProcessEditor, { iProcessEditor } from '../process-editor'

export interface iProjectEditor {
  dialog: iElDialog
  types: {
    id: string
    name: string
  }[]
  data: {
    name: string
    type: string
    sort: string
  }
  process: iProcessEditor
  locale: LocaleService
}
const ProjectEditor = FC<{ service: iProjectEditor }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { dialog, data, types, locale, process } = service
    const $t = locale.t.project.edit
    return <ElDialog title={$t.title} service={dialog}>
      <ElForm labelPosition="right" labelWidth="100px">
        <ElFormItem label={$t.name}>
          <ElInput placeholder={$t.name} vModel={data.name}></ElInput>
        </ElFormItem>
        <ElFormItem label={$t.category}>
          <ElSelect style="width: 100%;" vModel={data.type} >
            {types.map(item => <ElOption label={item.name} value={item.id}></ElOption>)}
          </ElSelect>
        </ElFormItem>
        <ElFormItem label={$t.sort}>
          <ElInput placeholder='0' type="number" vModel={data.sort}></ElInput>
        </ElFormItem>
        <ProcessEditor service={process} />
      </ElForm>
    </ElDialog>
  }
})
export default ProjectEditor