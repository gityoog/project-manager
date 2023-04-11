import { CreateDateColumnWithFormat, NonNullableColumn, UpdateDateColumnWithFormat } from '@/common/typeorm'
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export default class ProjectCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({
    type: 'text',
    unique: true,
    name: '名称'
  })
  name!: string

  @Column({
    type: 'int',
    nullable: true
  })
  sort!: string


  @CreateDateColumnWithFormat()
  created_at!: Date

  @UpdateDateColumnWithFormat()
  updated_at!: Date
}