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

  @CreateDateColumnWithFormat({
    transformer: [{
      to: (value: Date) => value,
      from: (value: Date) => value.toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
      })
    }]
  })
  created_at!: Date
}