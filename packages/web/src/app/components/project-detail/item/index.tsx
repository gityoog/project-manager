import TerminalComponent, { iTerminal } from '@/components/terminal'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import style from './style.module.scss'
import DragHeight from '@/components/drag-height'
import ElButton from '@/common/element-ui/button'
import CPUIcon from 'app/images/CPU.svg'
import MemoryIcon from 'app/images/memory.svg'
import TableList, { iTableList } from '@/components/table-list'
import ElTableColumn from '@/common/element-ui/table/column'
import LocaleService from '@/app/common/locale'

export interface iProjectDetailItem {
  locale: LocaleService
  ready: boolean
  terminal: iTerminal | null
  height: number | null
  status: boolean
  toggleLoading: boolean
  toggleStatus(): void
  stats: {
    cpu: string
    memory: string
  } | null
  table: iTableList
  download(index: number): void
  remove(index: number): void
}

@Component
export default class ProjectDetailItem extends Vue {
  $props!: {
    service: iProjectDetailItem
  }
  @Prop() service!: iProjectDetailItem
  protected render() {
    const $t = this.service.locale.t.project.detail
    const { terminal, status, stats, table, toggleLoading, ready } = this.service
    return <div class={style.component}>
      {ready && <div class={style.container}>
        {this.service.height !== null && <>
          <DragHeight class={style.terminal} min={40} vModel={this.service.height}>
            {terminal && <TerminalComponent service={terminal}></TerminalComponent>}
          </DragHeight>
          <div class={style.bar}>
            {<div class={style.stats}>
              {stats && <>
                <CPUIcon /><span class={style.value}>{stats.cpu}</span>
                <MemoryIcon /><span class={style.value}>{stats.memory}</span>
              </>}
            </div>}
            <ElButton loading={toggleLoading} size='mini' icon={status ? 'el-icon-close' : 'el-icon-s-promotion'} class={style.bt} type={status ? 'danger' : 'primary'} onClick={() => this.service.toggleStatus()}>
              {status ? $t.process.stop : $t.process.start}
            </ElButton>
          </div>
        </>}
        <div class={style.files}>
          <TableList size='mini' service={table}>
            <ElTableColumn label={$t.output.filename} prop="name" />
            <ElTableColumn label={$t.output.time} width="140" prop="created_at" />
            <ElTableColumn label={$t.output.size} width="90" prop="size" />
            <ElTableColumn label={$t.output.action} width="160px" align="center" scopedSlots={{
              default: ({ $index }) => <div class={style.actions}>
                <ElButton size='mini' type='text' onClick={() => this.service.download($index)}>{$t.output.download}</ElButton>
                <ElButton size='mini' class={style.remove} type='text' onClick={() => this.service.remove($index)}>{$t.output.remove}</ElButton>
              </div>
            }} />
          </TableList>
        </div>
      </div>}
    </div>
  }
}