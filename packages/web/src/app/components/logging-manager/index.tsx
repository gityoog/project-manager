import LocaleService from '@/app/common/locale'
import ElButton from '@/common/element-ui/button'
import ElTableColumn from '@/common/element-ui/table/column'
import { FC } from '@/common/vue'
import TableList, { iTableList } from '@/components/table-list'
import style from './style.module.scss'

export interface iLoggingManager {
  locale: LocaleService
  remove(index: number): void
  table: iTableList<{

  }>
}

const LoggingManager = FC<{ service: iLoggingManager }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { table, locale } = service
    const $t = locale.t.logging
    return <div class={style.manager}>
      <div class={style.table}>
        <TableList size='mini' service={table}>
          <ElTableColumn label={$t.target} prop="target" width="110" />
          <ElTableColumn label={$t.action} prop="action" width="60" />
          <ElTableColumn label={$t.user} prop="user" width="100" show-overflow-tooltip />
          <ElTableColumn label={$t.ip} prop="ip" width="100" />
          <ElTableColumn label={$t.time} prop="time" width="140" />
          <ElTableColumn label={$t.description} prop="description" show-overflow-tooltip />
          {/* <ElTableColumn label='删除' width="140px" align="center" scopedSlots={{
            default: ({ $index }) => <div class={style.actions}>
              <ElButton class={style.remove} type='text' onClick={() => service.remove($index)}>删除</ElButton>
            </div>
          }} /> */}
        </TableList>
      </div>
    </div>
  }
})
export default LoggingManager