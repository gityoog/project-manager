import LocaleService from '@/app/common/locale'
import ElButton from '@/common/element-ui/button'
import ElForm from '@/common/element-ui/form'
import ElFormItem from '@/common/element-ui/form/item'
import ElInput from '@/common/element-ui/input'
import ElTableColumn from '@/common/element-ui/table/column'
import { FC } from '@/common/vue'
import TableList, { iTableList } from '@/components/table-list'
import style from './style.module.scss'

export interface iProjectCategoryManager {
  loading: boolean
  form: {
    id: string
    name: string
    sort: string
  }
  locale: LocaleService
  save(): void
  cancel(): void
  remove(index: number): void
  edit(index: number): void
  table: iTableList<{
    name: string
    sort: string
  }>
}

const ProjectCategoryManager = FC<{ service: iProjectCategoryManager }>({
  functional: true,
  render(h, context) {
    const service = context.props.service
    const { table, form, loading, locale } = service
    const $t = locale.t.category
    return <div class={style.manager}>
      <div class={style.form}>
        <ElForm size='mini' inline>
          <ElFormItem label={$t.name}>
            <ElInput vModel={form.name}></ElInput>
          </ElFormItem>
          <ElFormItem label={$t.sort}>
            <ElInput vModel={form.sort}></ElInput>
          </ElFormItem>
          <ElFormItem >
            {form.id ?
              [
                <ElButton onClick={() => service.save()} loading={loading} type='primary'>{$t.save}</ElButton>,
                <ElButton onClick={() => service.cancel()}>{$t.cancel}</ElButton>
              ]
              : <ElButton onClick={() => service.save()} loading={loading} type='primary'>{$t.add}</ElButton>}

          </ElFormItem>
        </ElForm>
      </div>
      <div class={style.table}>
        <TableList size='mini' service={table}>
          <ElTableColumn label={$t.name} prop="name" />
          <ElTableColumn label={$t.sort} prop="sort" />
          <ElTableColumn label={$t.time} prop="updated_at" />
          <ElTableColumn label={$t.action} width="140px" align="center" scopedSlots={{
            default: ({ $index }) => <div class={style.actions}>
              <ElButton type='text' onClick={() => service.edit($index)}>{$t.edit}</ElButton>
              <ElButton class={style.remove} type='text' onClick={() => service.remove($index)}>{$t.remove}</ElButton>
            </div>
          }} />
        </TableList>
      </div>
    </div>
  }
})
export default ProjectCategoryManager