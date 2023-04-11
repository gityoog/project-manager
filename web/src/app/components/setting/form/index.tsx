import ElButton from '@/common/element-ui/button'
import ElForm from '@/common/element-ui/form'
import ElFormItem from '@/common/element-ui/form/item'
import ElInput from '@/common/element-ui/input'
import { FC } from '@/common/vue'
import style from './style.module.scss'

export interface iSettingForm {
  data: {
    shell: string
  }
}

const SettingForm = FC<{ service: iSettingForm }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { data } = service
    return <div class={style.form}>
      <ElForm size='small' labelWidth='50px' labelPosition='left'>
        <ElFormItem label='shell'>
          <ElInput v-model={data.shell} style="width: 240px;">
            <ElButton slot="append">保存</ElButton>
          </ElInput>
        </ElFormItem>
        <ElFormItem label='缓存'>
          <ElButton type='warning'>清空文件</ElButton>
          <ElButton type='primary'>清空日志</ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  }
})
export default SettingForm