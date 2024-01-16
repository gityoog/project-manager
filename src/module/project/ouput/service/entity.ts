import { CreateDateColumnWithFormat, NonNullableColumn, UpdateDateColumnWithFormat } from '@/common/typeorm'
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export default class ProjectOutputEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text', unique: false })
  name!: string

  @Column({ type: 'text', nullable: true })
  version!: string | null

  @Column({ type: 'text' })
  project!: string

  @Column({ type: 'text', nullable: true })
  process!: string | null

  @Column({
    type: 'blob',
    nullable: true
  })
  content!: Buffer | null

  @Column({
    type: 'text',
    nullable: true
  })
  path!: string | null

  @Column({ type: 'text' })
  size!: string

  @CreateDateColumnWithFormat()
  created_at!: Date
}