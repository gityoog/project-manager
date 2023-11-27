import ElButton from '@/common/element-ui/button'
import ElFormItem from '@/common/element-ui/form/item'
import ElInput from '@/common/element-ui/input'
import { FC } from '@/common/vue'
import style from './style.module.scss'
import LocaleService from '@/app/common/locale'
import ElBadge from '@/common/element-ui/badge'

export interface iProcessEditor {
  data: {
    name: string
    context: string
    command: string
  }[]
  locale: LocaleService
  add(): void
  remove(index: number): void
  setting(index: number): void
  hasBadge(index: number): boolean
}

const ProcessEditor = FC<{ service: iProcessEditor }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { data, locale } = service
    const $t = locale.t.project.process
    return <>
      {data.map((item, index) => <ElFormItem class={style.formitem}>
        {index === 0 ? <div slot="label">{$t.default}</div> : <div slot="label" class={style.name} ><input placeholder='name' vModel={item.name}></input></div>}
        <div style="display: flex;">
          <ElInput class={style.shell} placeholder='shell command' vModel={item.command}>
            <ElInput placeholder='path/to/context' slot="prepend" vModel={item.context}></ElInput>
            <ElBadge hidden={!service.hasBadge(index)} isDot slot="append" >
              <ElButton onClick={() => { service.setting(index) }} icon="el-icon-s-tools"></ElButton>
            </ElBadge>
          </ElInput>
          <ElButton disabled={index === 0} class={style.remove} type='text' onClick={() => {
            service.remove(index)
          }} icon="el-icon-delete"></ElButton>
        </div>
      </ElFormItem>)}
      <ElFormItem style="margin-top: -8px;">
        <ElButton onClick={() => service.add()} icon='el-icon-plus' type='text'>{$t.add}</ElButton>
      </ElFormItem>
    </>
  }
})
export default ProcessEditor