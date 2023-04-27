import ElButton from '@/common/element-ui/button'
import ElForm from '@/common/element-ui/form'
import ElFormItem from '@/common/element-ui/form/item'
import ElSelect from '@/common/element-ui/select'
import ElOption from '@/common/element-ui/option'
import { FC } from '@/common/vue'
import style from './style.module.scss'
import LocaleService from '@/app/common/locale'
import ElInput from '@/common/element-ui/input'

export interface iLocalSetting {
  data: {
    lang: string
    fontSize: string
    fontFamily: string
  }
  langs: {
    name: string
    value: string
  }[]
  locale: LocaleService
  save(): void
  refresh(): void
}

const LocalSetting = FC<{ service: iLocalSetting }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { data, langs, locale } = service
    const $t = locale.t.setting.local
    return <div class={style.form}>
      <ElForm size='mini' labelWidth='60px' labelPosition='left'>
        <ElFormItem label={$t.language}>
          <ElSelect vModel={data.lang} style="width: 240px;">
            {langs.map(lang => <ElOption value={lang.value} label={lang.name}></ElOption>)}
          </ElSelect>
        </ElFormItem>
        <ElFormItem label={$t.pty}>
          <div>
            <ElInput vModel={data.fontFamily} style="width: 240px;">
              <div style="width: 60px;text-align: center;" slot="prepend">{$t.fontFamily}</div>
            </ElInput>
          </div>
          <div style="margin-top: 4px;">
            <ElInput vModel={data.fontSize} style="width: 240px;">
              <div style="width: 60px;text-align: center;" slot="prepend">{$t.fontSize}</div>
            </ElInput>
          </div>
        </ElFormItem>
        <ElFormItem>
          <ElButton onClick={() => service.refresh()}>{$t.reset}</ElButton>
          <ElButton onClick={() => service.save()} type='primary'>{$t.save}</ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  }
})
export default LocalSetting