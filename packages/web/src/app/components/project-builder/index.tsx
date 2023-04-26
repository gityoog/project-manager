import { FC } from '@/common/vue'
import ElDialog, { iElDialog } from '@/components/el-dialog'
import TerminalComponent, { iTerminal } from '@/components/terminal'
import style from './style.module.scss'

import ArrowDownSvg from 'app/images/arrow-down.svg'
import ArrowUpSvg from 'app/images/arrow-up.svg'
import ElButton from '@/common/element-ui/button'
import TableList, { iTableList } from '@/components/table-list'
import ElTableColumn from '@/common/element-ui/table/column'
import LocaleService from '@/app/common/locale'

export interface iProjectBuilder {
  dialog: iElDialog
  locale: LocaleService
  expanded: boolean
  terminal: iTerminal
  status: boolean
  toggleStatus(): void
  table: iTableList
  download(index: number): void
  remove(index: number): void
}

const ProjectBuilder = FC<{ service: iProjectBuilder }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { dialog, status, terminal, table, locale } = service
    const $t = locale.t.project.build
    return <ElDialog title={$t.title} class={style.builder} width='60vw' fullHeight service={dialog}>
      <div class={style.container}>
        <div class={style.top}>
          <div class={style.console}>
            <div class={[style.terminal, service.expanded ? style.expanded : null]}>
              <TerminalComponent service={terminal}></TerminalComponent>
            </div>
            <div onClick={() => service.expanded = !service.expanded} class={style.expand}>
              {service.expanded ? <ArrowUpSvg /> : <ArrowDownSvg />}
            </div>
          </div>
          <ElButton size='mini' icon={status ? 'el-icon-close' : 'el-icon-s-promotion'} class={style.bt} type={status ? 'danger' : 'primary'} onClick={() => service.toggleStatus()}>
            {status ? $t.stop : $t.run}
          </ElButton>
        </div>
        <div class={style.list}>
          <TableList size='mini' service={table}>
            <ElTableColumn label={$t.list.name} prop="name" />
            <ElTableColumn label={$t.list.time} prop="created_at" />
            <ElTableColumn label={$t.list.size} prop="size" />
            <ElTableColumn label={$t.list.action} width="160px" align="center" scopedSlots={{
              default: ({ $index }) => <div class={style.actions}>
                <ElButton size='mini' type='text' onClick={() => service.download($index)}>{$t.download}</ElButton>
                <ElButton size='mini' class={style.remove} type='text' onClick={() => service.remove($index)}>{$t.remove}</ElButton>
              </div>
            }} />
          </TableList>
        </div>
      </div>
    </ElDialog>
  }
})
export default ProjectBuilder