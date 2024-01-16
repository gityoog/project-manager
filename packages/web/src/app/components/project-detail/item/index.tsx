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
  deployEnabled: boolean
  stats: {
    cpu: string
    memory: string
  } | null
  table: iTableList
  download(index: number): void
  remove(index: number): void
  hasDeploy(index: number): boolean
  deployStatus(index: number): Project.Deploy.status
  startDeploy(index: number): void
  stopDeploy(index: number): void
}

@Component
export default class ProjectDetailItem extends Vue {
  $props!: {
    service: iProjectDetailItem
  }
  @Prop() service!: iProjectDetailItem
  protected render() {
    const $t = this.service.locale.t.project.detail
    const { terminal, status, stats, table, toggleLoading, ready, deployEnabled } = this.service
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
            <ElTableColumn label={$t.output.version} width="90" prop="version" />
            <ElTableColumn label={$t.output.time} width="140" prop="created_at" />
            <ElTableColumn label={$t.output.size} width="90" prop="size" />
            {deployEnabled && <ElTableColumn label={$t.output.deploy.title} width="90" align='center' scopedSlots={{
              default: ({ $index }) => {
                const status = this.service.deployStatus($index)
                return this.service.hasDeploy($index) ? <div class={style.deployBt}>
                  {status?.type === 'running' ?
                    <>
                      <ElButton icon="el-icon-loading" class={style.normal} size='mini' type='text' >{$t.output.deploy.deploying}</ElButton>
                      <ElButton icon="el-icon-video-pause" class={style.hover} size='mini' type='text' onClick={() => this.service.stopDeploy($index)} >{$t.output.deploy.stop}</ElButton>
                    </>
                    : status?.type === 'failed' ? <>
                      <ElButton icon="el-icon-close" class={style.normal} size='mini' type='text' >{$t.output.deploy.failed}</ElButton>
                      <ElButton icon="el-icon-video-play" title={status.msg} class={style.hover} size='mini' type='text' onClick={() => this.service.startDeploy($index)} >{$t.output.deploy.retry}</ElButton>
                    </>
                      : status?.type === 'success' ? <>
                        <ElButton icon="el-icon-check" class={style.normal} size='mini' type='text' >{$t.output.deploy.successfull}</ElButton>
                        <ElButton icon="el-icon-video-play" title={status.msg} class={style.hover} size='mini' type='text' onClick={() => this.service.startDeploy($index)} >{$t.output.deploy.run}</ElButton>
                      </>
                        : <ElButton icon="el-icon-video-play" size='mini' type='text' onClick={() => this.service.startDeploy($index)}>{$t.output.deploy.run}</ElButton>
                  }
                </div> : <></>
              }
            }} />}
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