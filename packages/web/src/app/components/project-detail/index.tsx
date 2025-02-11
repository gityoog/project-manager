import { FC } from '@/common/vue'
import style from './style.module.scss'
import ElDialog, { iElDialog } from '@/components/el-dialog'
import LocaleService from '@/app/common/locale'
import ElTabs from '@/common/element-ui/tabs'
import ElTabPane from '@/common/element-ui/tabs/pane'
import ProjectDetailItem, { iProjectDetailItem } from './item'

export interface iProjectDetail {
  dialog: iElDialog
  locale: LocaleService
  data: Array<{
    name: string
  } & iProjectDetailItem>
  actived: string
}

const ProjectDetail = FC<{ service: iProjectDetail }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { dialog, locale, data } = service
    const $t = locale.t.project.detail
    return <ElDialog class={style.detail} top='5vh' width='60vw' fullHeight maxHeight='85vh' service={dialog}>
      <div class={style.title} slot="title">
        <div>{$t.title}</div>
      </div>
      <div class={style.container}>
        <ElTabs vModel={service.actived} class={style.tabs}>
          {data.map((item, index) => <ElTabPane name={String(index)} label={item.name}>
            <ProjectDetailItem service={item} />
          </ElTabPane>)}
        </ElTabs>
      </div>
    </ElDialog>
  }
})
export default ProjectDetail