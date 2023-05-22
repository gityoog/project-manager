import { FC } from '@/common/vue'
import style from './style.module.scss'
import CPUIcon from 'app/images/CPU.svg'
import DBIcon from 'app/images/DB.svg'
import MemoryIcon from 'app/images/memory.svg'
import CheckSvg from 'app/images/check.svg'
import UnCheckSvg from 'app/images/uncheck.svg'
import PlayIcon from 'app/images/play.svg'
import PauseIcon from 'app/images/pause.svg'
import TerminalComponent, { iTerminal } from 'components/terminal'
import LocaleService from '@/app/common/locale'
import DragHeight from '@/components/drag-height'

export interface iProjectCard {
  id: string
  name: string
  cpuUsage: string
  memoryUsage: string
  status: boolean
  terminal: iTerminal | null
  showCheck: boolean
  checked: boolean
  url: string | null
  locale: LocaleService
  height: number
  showTerminal: boolean
  open(): void
  stop(): void
  run(): void
  edit(): void
  build(): void
  toggleCheck(): void
  toggleTerminal(): void
}

const ProjectCard = FC<{ service: iProjectCard }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { status, url, cpuUsage, memoryUsage, terminal, locale, showTerminal } = service
    const $t = locale.t.project.card
    return <div key={service.id} class={style.card}>
      <div v-show={service.showCheck} onClick={() => service.toggleCheck()} class={style.check}>{service.checked ? <CheckSvg /> : <UnCheckSvg />}</div>
      <div onClick={() => status ? service.stop() : service.run()} class={[style.status, status ? style.enabled : undefined]}>
        {status ? <PlayIcon></PlayIcon> : <PauseIcon></PauseIcon>}
      </div>
      <div class={style.detail}>
        <div class={style.title}>
          <div class={style.left}>
            <div onClick={() => service.edit()} class={style.name}>{service.name}</div>
            <div onClick={() => service.toggleTerminal()} class={[style.status, status ? style.enabled : undefined]}>{status ? $t.running : $t.exited}</div>
          </div>
          <div class={style.buildBt} onClick={() => service.build()} ><DBIcon size="24px" fill="#fff" ></DBIcon>{$t.build}</div>
        </div>
        {status && <div class={style.info}>
          <div class={style.stat}>
            <div v-show={cpuUsage} class={style.item} style='color:#e35f5f;'>
              <CPUIcon fill="#e35f5f"></CPUIcon>
              {cpuUsage}
            </div>
            <div v-show={memoryUsage} class={style.item} style='color:#A586B6;'><MemoryIcon fill="#A586B6"></MemoryIcon>{memoryUsage}</div>
          </div>
          {<div v-show={url} class={style.url} onClick={() => {
            service.open()
          }}>{url}</div>}
        </div>}
      </div>
      {status || showTerminal ?
        <DragHeight class={style.terminal} min={120} vModel={service.height}>
          {terminal && <TerminalComponent service={terminal}></TerminalComponent>}
        </DragHeight>
        : <div></div>}
    </div>
  }
})
export default ProjectCard

