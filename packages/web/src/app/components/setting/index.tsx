import LocaleService from '@/app/common/locale'
import ElTabs from '@/common/element-ui/tabs'
import ElTabPane from '@/common/element-ui/tabs/pane'
import { FC } from '@/common/vue'
import ElDialog, { iElDialog } from '@/components/el-dialog'
import ProjectCategoryManager, { iProjectCategoryManager } from '../category-manager'
import LoggingManager, { iLoggingManager } from '../logging-manager'
import SettingForm, { iSettingForm } from './form'
import style from './style.module.scss'

export interface iAppSetting {
  dialog: iElDialog
  form?: iSettingForm
  category?: iProjectCategoryManager
  logging?: iLoggingManager
  locale: LocaleService
  activeForm(): void
  activeCategory(): void
  activeLogging(): void
}

const AppSetting = FC<{ service: iAppSetting }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { dialog, category, logging, form, locale } = service
    const $t = locale.t.setting

    return <ElDialog class={style.setting} width='60vw' title={$t.title} fullHeight service={dialog}>
      <ElTabs on-tab-click={(tab) => {
        if (tab.label === $t.category.title) {
          service.activeCategory()
        } else if (tab.label === $t.logging.title) {
          service.activeLogging()
        } else if (tab.label === $t.base.title) {
          service.activeForm()
        }
      }} class={style.tabs}>
        <ElTabPane label={$t.base.title}>
          {form && <SettingForm service={form} />}
        </ElTabPane>
        <ElTabPane label={$t.category.title}>
          {category && <ProjectCategoryManager service={category} />}
        </ElTabPane>
        <ElTabPane label={$t.logging.title}>
          {logging && <LoggingManager service={logging} />}
        </ElTabPane>
      </ElTabs>
    </ElDialog>
  }
})
export default AppSetting