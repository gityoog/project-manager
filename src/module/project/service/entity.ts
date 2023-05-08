import { CreateDateColumnWithFormat } from '@/common/typeorm'
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'

@Entity()
export default class ProjectEntity extends BaseEntity {
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