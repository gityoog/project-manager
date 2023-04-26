import LocaleService from '@/app/common/locale'
import ElTabs from '@/common/element-ui/tabs'
import ElTabPane from '@/common/element-ui/tabs/pane'
import { FC } from '@/common/vue'
import ElDialog, { iElDialog } from '@/components/el-dialog'
import ProjectCategoryManager, { iProjectCategoryManager } from '../category-manager'
import LoggingManager, { iLoggingManager } from '../logging-manager'
import ServerSetting, { iServerSetting } from './server'
import style from './style.module.scss'

export interface iAppSetting {
  dialog: iElDialog
  locale: LocaleService
  data: {
    label: string
    view: Tsx.Component<{ service: any }>
    service?: object
  }[]
  active(index: number): void
}

const AppSetting = FC<{ service: iAppSetting }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { dialog, locale, data } = service
    const $t = locale.t.setting

    return <ElDialog class={style.setting} width='60vw' title={$t.title} fullHeight service={dialog}>
      <ElTabs on-tab-click={(tab) => {
        service.active(parseInt(tab.index))
      }} class={style.tabs}>
        {data.map((item, index) => <ElTabPane label={item.label}>
          {item.service && <item.view service={item.service} />}
        </ElTabPane>)}
      </ElTabs>
    </ElDialog>
  }
})
export default AppSetting