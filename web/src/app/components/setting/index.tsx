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
  activeForm(): void
  activeCategory(): void
  activeLogging(): void
}

const AppSetting = FC<{ service: iAppSetting }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { dialog, category, logging, form } = service
    return <ElDialog class={style.setting} width='60vw' title='系统设置' fullHeight service={dialog}>
      <ElTabs on-tab-click={(tab) => {
        if (tab.label === '分类管理') {
          service.activeCategory()
        } else if (tab.label === '操作日志') {
          service.activeLogging()
        } else if (tab.label === '基础设置') {
          service.activeForm()
        }
      }} class={style.tabs}>
        <ElTabPane label='基础设置'>
          {form && <SettingForm service={form} />}
        </ElTabPane>
        <ElTabPane label='分类管理'>
          {category && <ProjectCategoryManager service={category} />}
        </ElTabPane>
        <ElTabPane label='操作日志'>
          {logging && <LoggingManager service={logging} />}
        </ElTabPane>
      </ElTabs>
    </ElDialog>
  }
})
export default AppSetting