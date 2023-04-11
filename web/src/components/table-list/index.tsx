import ElTable from '@/common/element-ui/table'
import { FCGeneric } from '@/common/vue'
import { ElementUIComponentSize } from 'element-ui/types/component'
import ElLoading, { iElLoading } from '../el-loading'
import PageInfo, { iPageInfo } from '../page-info'
import ResizeComponent from '../resize'
import style from './style.module.scss'

export interface iTableList<T = any, P extends Record<string, any> = Record<string, any>> {
  status: iElLoading
  data: T[]
  pageInfo?: iPageInfo | null
  params: {
    data: P
    done(): void
  }
  key: string
}

const TableList = FCGeneric<
  <T, P extends Record<string, any>>(props: {
    service: iTableList<T, P>
    size?: ElementUIComponentSize
    theme?: 'normal' | 'gray'
    autoHeight?: boolean
    stripe?: boolean
    scopedSlots?: Tsx.ScopedSlots<{
      header: {
        data: P
        done(): void
      }
    }>
  }) => JSX.Element>({
    functional: true,
    render(h, context) {
      const { service, size, autoHeight = false, theme = 'gray', stripe = true } = context.props
      const { status, data, pageInfo, params } = service
      const header = context.scopedSlots.header
      return <ElLoading style={context.data.staticStyle} status={status} class={style.component} fail={false}>
        {header && <div class={style.header}>{header(params)}</div>}
        <ResizeComponent
          class={[style.table, style['theme-' + theme]]}
          v-loading={status.error}
          element-loading-spinner="el-icon-close"
          element-loading-text={status.msg}
          scopedSlots={{
            default: (rect) =>
              <ElTable
                key={service.key}
                stripe={stripe}
                size={size}
                data={data}
                maxHeight={autoHeight ? undefined : rect.height}
              >
                {context.children}
              </ElTable>
          }}></ResizeComponent>
        {pageInfo && <div class={style.footer}>
          <PageInfo service={pageInfo}></PageInfo>
        </div>}
      </ElLoading>
    }
  })
export default TableList