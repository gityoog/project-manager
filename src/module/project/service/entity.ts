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
  process!: {
    id: string
    name: string
    context: string
    command: string
    encoding?: string
    env?: Record<string, string>
    deploy?: Record<string, any>
  }[] | null

  @CreateDateColumnWithFormat()
  created_at!: Date
}