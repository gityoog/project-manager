import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'project_process_state_entity' })
export default class ProjectProcessStateEntity extends BaseEntity {
  @PrimaryColumn('text')
  id!: string

  @Column('boolean')
  status!: boolean
}