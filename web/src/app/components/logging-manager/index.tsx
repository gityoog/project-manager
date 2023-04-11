import ElButton from '@/common/element-ui/button'
import ElTableColumn from '@/common/element-ui/table/column'
import { FC } from '@/common/vue'
import TableList, { iTableList } from '@/components/table-list'
import style from './style.module.scss'

export interface iLoggingManager {
  remove(index: number): void
  table: iTableList<{

  }>
}

const LoggingManager = FC<{ service: iLoggingManager }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { table } = service
    return <div class={style.manager}>
      <div class={style.table}>
        <TableList size='mini' service={table}>
          <ElTableColumn label='对象' prop="target" />
          <ElTableColumn label='操作' prop="action" />
          <ElTableColumn label='用户' prop="user" />
          <ElTableColumn label='ip' prop="ip" />
          <ElTableColumn label='时间' prop="time" />
          <ElTableColumn label='备注' prop="description" />
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