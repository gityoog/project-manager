import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import style from './style.module.scss'
import ElLoading, { iElLoading } from '@/components/el-loading'
import ElInput from '@/common/element-ui/input'
import ElButton from '@/common/element-ui/button'
import LocaleService from '@/app/common/locale'

export interface iAppAuth {
  locale: LocaleService
  data: {
    password: string
  }
  status: iElLoading
  submiting: boolean
  submit(): void
}

@Component
export default class AppAuth extends Vue {
  @Prop() service!: iAppAuth
  protected render() {
    const { status, data, submiting, locale } = this.service
    const $t = locale.t
    return <ElLoading status={status} class={style.app}>
      <div class={style.container}>
        <div v-show={!status.loading} class={style.form}>
          <ElInput nativeOnKeypress={e => {
            if (e.key && e.key.toLowerCase() === 'enter') {
              this.service.submit()
            }
          }} type="password" vModel={data.password} placeholder={$t.auth.password}></ElInput>
          <ElButton loading={submiting} onClick={() => this.service.submit()} >{$t.tip.submit}</ElButton>
        </div>
      </div>
    </ElLoading>
  }
}