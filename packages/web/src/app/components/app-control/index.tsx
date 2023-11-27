import { Vue, Component } from 'vue-property-decorator'
import { DIComponent, Inject } from '@/common/vue/ioc-di'
import MyKeepAlive from '@/common/vue/keep-alive'
import style from './style.module.scss'
import LogoSvg from 'app/images/logo.svg'
import PlusSvg from 'app/images/plus.svg'
import MinSvg from 'app/images/min.svg'
import SettingSvg from 'app/images/setting.svg'
import CPUIcon from 'app/images/CPU.svg'
import MemoryIcon from 'app/images/memory.svg'
import IAppControl from './service'
import ProjectList, { iProjectList } from '../project-list'
import ProjectEditor, { iProjectEditor } from '../project-editor'
import AppSetting, { iAppSetting } from '../setting'
import ProjectSelector, { iProjectSelector } from '../project-selector'
import ProjectDetail, { iProjectDetail } from '../project-detail'
import LocaleService from '@/app/common/locale'
import ProcessSettings, { iProcessSettings } from '../process-settings'

export interface iAppControl {
  tabs: {
    name: string
    visible: boolean
  }[]
  active(index: number): void
  isActived(index: number): boolean
  list: iProjectList | null
  editor: iProjectEditor
  setting: iAppSetting
  selector: iProjectSelector
  detail: iProjectDetail
  process: iProcessSettings
  stats: {
    cpu: string
    memory: string
  } | null
  showStats: boolean
  add(): void
  remove(): void
  openSetting(): void
}

@DIComponent
export default class AppControl extends Vue {
  @Inject(IAppControl) private service!: iAppControl
  @Inject() private locale!: LocaleService

  protected render() {
    const { tabs, list, editor, setting, selector, detail, showStats, stats, process } = this.service
    const $t = this.locale.t
    return <div class={style.app}>
      <AppSetting service={setting} />
      <ProjectEditor service={editor} />
      <ProjectDetail service={detail} />
      <ProcessSettings service={process} />
      <div class={style.header}>
        <div class={style.logo}>
          <LogoSvg size="32px" fill='#fff'></LogoSvg>
          <div class={style.right}>
            <div class={style.text}>{$t.title}</div>
            {showStats && stats && <div class={style.stats}>
              <CPUIcon /><span class={style.value}>{stats.cpu}</span>
              <MemoryIcon /><span class={style.value}>{stats.memory}</span>
            </div>}
          </div>
        </div>
        <div class={style.nav}>
          {tabs.map((item, index) => <div v-show={item.visible} onClick={() => this.service.active(index)} class={[style.item, this.service.isActived(index) && style.actived]}>
            {item.name}
          </div>)}
        </div>
        <div onClick={() => this.service.add()} class={style.icon}>
          <PlusSvg size="20px" fill='#fff' />
        </div>
        <div onClick={() => this.service.remove()} class={style.icon}>
          <MinSvg size="20px" fill='#fff' />
        </div>
        <div onClick={() => this.service.openSetting()} class={style.icon}>
          <SettingSvg size="20px" fill='#fff' />
        </div>
      </div>
      <div class={style.content}>
        <div class={style.container}>
          <MyKeepAlive>
            {list && <ProjectList key={list.key} service={list}></ProjectList>}
          </MyKeepAlive>
        </div>
      </div>
      <ProjectSelector service={selector}></ProjectSelector>
    </div>
  }
}