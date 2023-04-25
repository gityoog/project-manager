import { FC } from '@/common/vue'
import '@/common/element-ui/loading'

export interface iElLoading {
  loading: boolean
  error: boolean
  msg: string
}
const ElLoading = FC<{
  status: iElLoading
  fail?: boolean
}>({
  functional: true,
  render(h, context) {
    const { status, fail = true } = context.props
    return <div
      {...context.data}
      attrs={{
        ...context.data.attrs,
        'element-loading-text': status.msg || 'Loading',
        'element-loading-spinner': status.error ? 'el-icon-close' : undefined,
        status: undefined,
        fail: undefined
      }}
      v-loading={status.loading || (fail && status.error)}
    >{context.children}</div>
  }
})
export default ElLoading