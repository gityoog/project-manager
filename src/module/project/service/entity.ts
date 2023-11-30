import { CreateDateColumnWithFormat } from '@/common/typeorm'
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'

@Entity({ name: 'project_entity_v2' })
export default class ProjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('text')
  name!: string

  @Column('text', {
    nullable: true
  })
  type!: string | null

  @Column({
    type: 'int',
    nullable: true
  })
  sort!: string

  @Column('simple-json', {
    nullable: true
  })
  process!: App.Project.Process.Config[] | null

  @CreateDateColumnWithFormat()
  created_at!: Date
}