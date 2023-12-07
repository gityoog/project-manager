import LocaleService from '@/app/common/locale'
import ElAutocomplete from '@/common/element-ui/autocomplete'
import ElFormItem from '@/common/element-ui/form/item'
import ElInput from '@/common/element-ui/input'
import { FC } from '@/common/vue'

export interface iPostEditorRender {
  locale: LocaleService
  data: {
    url: string
    sign: {
      key: string
      scheme: string
    }
    form: {
      sign: string
      file: string
    }
  }
  queryScheme: (query: string, callback: (list: { value: string }[]) => void) => void
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
      <ElFormItem label={$t.formFileKey}>
        <ElInput placeholder='file' style="width: 240px" vModel={data.form.file}></ElInput>
      </ElFormItem>
      <ElFormItem label={$t.formSignKey}>
        <ElInput placeholder='sign' style="width: 240px" vModel={data.form.sign}></ElInput>
      </ElFormItem>
      <ElFormItem label={$t.signScheme}>
        <ElAutocomplete fetch-suggestions={(query, callback) => {
          service.queryScheme(query, callback)
        }} placeholder='pkcs1-sha256' style="width: 240px" vModel={data.sign.scheme}></ElAutocomplete>
      </ElFormItem>
      <ElFormItem label={$t.signKey}>
        <ElInput type='textarea' placeholder='-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----' style="width: 240px" vModel={data.sign.key}></ElInput>
      </ElFormItem>
    </>
  }
})
export default PostEditorRender