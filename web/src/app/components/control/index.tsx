import { Vue, Component } from 'vue-property-decorator'
import { DIComponent, Inject } from '@/common/vue/ioc-di'
import MyKeepAlive from '@/common/vue/keep-alive'
import style from './style.module.scss'
import LogoSvg from 'app/images/logo.svg'
import PlusSvg from 'app/images/plus.svg'
import MinSvg from 'app/images/min.svg'
import SettingSvg from 'app/images/setting.svg'
import IAppControl from './service'
import ProjectList, { iProjectList } from '../project-list'
import ProjectEditor, { iProjectEditor } from '../project-editor'
import AppSetting, { iAppSetting } from '../setting'
import ProjectSelector, { iProjectSelector } from '../project-selector'
import ProjectBuilder, { iProjectBuilder } from '../project-builder'

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
  builder: iProjectBuilder
  add(): void
  remove(): void
  openSetting(): void
}

@DIComponent
export default class AppControl extends Vue {
  @Inject(IAppControl) private service!: iAppControl
  protected render() {
    const { tabs, list, editor, setting, selector, builder } = this.service
    return <div class={style.app}>
      <AppSetting service={setting} />
      <ProjectEditor service={editor} />
      <ProjectBuilder service={builder} />
      <div class={style.header}>
        <div class={style.logo}>
          <LogoSvg size="32px" fill='#fff'></LogoSvg>
          <div class={style.text}>项目管理可视化</div></div>
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