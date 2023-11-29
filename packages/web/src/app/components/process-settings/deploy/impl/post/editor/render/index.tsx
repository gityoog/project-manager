import LocaleService from '@/app/common/locale'
import ElFormItem from '@/common/element-ui/form/item'
import ElInput from '@/common/element-ui/input'
import ElRadio from '@/common/element-ui/radio'
import ElRadioGroup from '@/common/element-ui/radio/group'
import { FC } from '@/common/vue'

export interface iPostEditorRender {
  locale: LocaleService
  data: {
    url: string
    type: string
    key: string
  }
}

const PostEditorRender = FC<{ service: iPostEditorRender }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { data } = service
    const $t = service.locale.t.project.process.setting.deploy.post
    return <>
      <ElFormItem label={$t.url}>
        <ElInput style="width: 240px" vModel={data.url}></ElInput>
      </ElFormItem>
      <ElFormItem label={$t.type}>
        <ElRadioGroup vModel={data.type}>
          <ElRadio label="formdata">{$t.formdata}</ElRadio>
          <ElRadio label="binary">{$t.binary}</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      {data.type === 'formdata' && <ElFormItem label={$t.key}>
        <ElInput style="width: 240px" vModel={data.key}></ElInput>
      </ElFormItem>}
    </>
  }
})
export default PostEditorRender