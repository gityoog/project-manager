import { FC } from '@/common/vue'
import ElDialog, { iElDialog } from 'components/el-dialog'
import ElForm from '@/common/element-ui/form'
import ElFormItem from '@/common/element-ui/form/item'
import ElInput from '@/common/element-ui/input'
import ElSelect from '@/common/element-ui/select'
import ElOption from '@/common/element-ui/option'

export interface iProjectEditor {
  dialog: iElDialog
  types: {
    id: string
    name: string
  }[]
  data: {
    name: string
    context: string
    build: string
    dev: string
    type: string
    sort: string
    deploy: string
  }
}
const typeProp = {
  prop: 'id',
  label: 'name'
}
const ProjectEditor = FC<{ service: iProjectEditor }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { dialog, data, types } = service
    return <ElDialog service={dialog}>
      <ElForm labelPosition="right" labelWidth="100px">
        <ElFormItem label="项目名称">
          <ElInput vModel={data.name}></ElInput>
        </ElFormItem>
        <ElFormItem label="项目类型">
          <ElSelect style="width: 100%;" vModel={data.type} >
            {types.map(item => <ElOption label={item.name} value={item.id}></ElOption>)}
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="项目地址">
          <ElInput vModel={data.context}></ElInput>
        </ElFormItem>
        <ElFormItem label="调试命令">
          <ElInput vModel={data.dev}></ElInput>
        </ElFormItem>
        <ElFormItem label="打包命令">
          <ElInput vModel={data.build}></ElInput>
        </ElFormItem>
        <ElFormItem label="部署地址">
          <ElInput vModel={data.deploy}></ElInput>
        </ElFormItem>
        <ElFormItem label="项目排序">
          <ElInput type="number" vModel={data.sort}></ElInput>
        </ElFormItem>
      </ElForm>
    </ElDialog>
  }
})
export default ProjectEditor