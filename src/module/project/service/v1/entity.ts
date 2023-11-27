import { CreateDateColumnWithFormat } from '@/common/typeorm'
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'

@Entity({ name: 'project_entity', synchronize: false })
export default class ProjectEntityV1 extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('text')
  name!: string

  @Column('text', {
    nullable: true
  })
  type!: string | null

  @Column('text')
  context!: string

  @Column('text')
  build!: string

  @Column('text')
  dev!: string

  @Column('simple-json', { nullable: true })
  build_proc!: {
    encoding?: string
    env?: Record<string, string>
  } | null

  @Column('simple-json', { nullable: true })
  dev_proc!: {
    encoding?: string
    env?: Record<string, string>
  } | null

  @Column({
    type: 'text',
    nullable: true
  })
  deploy!: string

  @Column({
    type: 'int',
    nullable: true
  })
  sort!: string

  @CreateDateColumnWithFormat()
  created_at!: Date
}