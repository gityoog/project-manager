import { FC } from '@/common/vue'
import style from './style.module.scss'
import CloseSvg from './close.svg'

export interface iEnvEditor {
  data: {
    key: string
    value: string
  }[]
  add(): void
  remove(index: number): void
}

const EnvEditor = FC<{
  service: iEnvEditor
  lang?: string
}>({
  functional: true,
  render(h, context) {
    const { service, lang } = context.props
    const { data } = service
    return <div class={style.envEditor}>
      <table>
        {data.map((item, index) => <tr>
          <td class={[style.input, style.key]} ><input placeholder='key' vModel={item.key}></input></td>
          <td class={style.eq}>=</td>
          <td class={style.input} ><input placeholder='value' vModel={item.value}></input></td>
          <td class={style.remove} onClick={() => service.remove(index)}><CloseSvg /></td>
        </tr>)}
      </table>
      <div class={style.add} onClick={() => service.add()}>{lang === 'zh-CN' ? '添加参数' : 'Add Env'}</div>
    </div>
  }
})
export default EnvEditor