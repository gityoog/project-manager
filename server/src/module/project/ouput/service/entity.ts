import { CreateDateColumnWithFormat, NonNullableColumn, UpdateDateColumnWithFormat } from '@/common/typeorm'
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export default class ProjectOutputEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text', unique: false })
  name!: string

  @Column({ type: 'text' })
  project!: string

  @Column({ type: 'blob' })
  content!: Buffer

  @Column({ type: 'text' })
  size!: string

  @CreateDateColumnWithFormat()
  created_at!: Date
}