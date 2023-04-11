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
    const { table, form, loading } = service
    return <div class={style.manager}>
      <div class={style.form}>
        <ElForm size='mini' inline>
          <ElFormItem label='名称'>
            <ElInput vModel={form.name}></ElInput>
          </ElFormItem>
          <ElFormItem label='排序'>
            <ElInput vModel={form.sort}></ElInput>
          </ElFormItem>
          <ElFormItem >
            {form.id ?
              [
                <ElButton onClick={() => service.save()} loading={loading} type='primary'>保存</ElButton>,
                <ElButton onClick={() => service.cancel()}>取消</ElButton>
              ]
              : <ElButton onClick={() => service.save()} loading={loading} type='primary'>添加</ElButton>}

          </ElFormItem>
        </ElForm>
      </div>
      <div class={style.table}>
        <TableList size='mini' service={table}>
          <ElTableColumn label='名称' prop="name" />
          <ElTableColumn label='排序' prop="sort" />
          <ElTableColumn label='时间' prop="updated_at" />
          <ElTableColumn label='操作' width="140px" align="center" scopedSlots={{
            default: ({ $index }) => <div class={style.actions}>
              <ElButton type='text' onClick={() => service.edit($index)}>编辑</ElButton>
              <ElButton class={style.remove} type='text' onClick={() => service.remove($index)}>删除</ElButton>
            </div>
          }} />
        </TableList>
      </div>
    </div>
  }
})
export default ProjectCategoryManager