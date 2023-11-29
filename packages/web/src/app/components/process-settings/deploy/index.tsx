import LocaleService from '@/app/common/locale'
import ElDivider from '@/common/element-ui/divider'
import ElFormItem from '@/common/element-ui/form/item'
import ElOption from '@/common/element-ui/option'
import ElSelect from '@/common/element-ui/select'
import { FC } from '@/common/vue'

export interface iOutputDeploySettings {
  locale: LocaleService
  type: string
  types: {
    name: string
    type: string
  }[]
  setType(type: string): void
  Render: Tsx.Component | null
}

const OutputDeploySettings = FC<{ service: iOutputDeploySettings }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { types, Render, locale } = service
    const $t = locale.t.project.process.setting.deploy
    return <>
      <ElDivider contentPosition='left'>{$t.title}</ElDivider>
      <ElFormItem label={$t.type}>
        <ElSelect clearable style="width: 240px" value={service.type} onInput={(type: string) => {
          service.setType(type)
        }}>
          {types.map(item => <ElOption value={item.type}>{item.name}</ElOption>)}
        </ElSelect>
      </ElFormItem>
      {Render && <Render />}
    </>
  }
})
export default OutputDeploySettings