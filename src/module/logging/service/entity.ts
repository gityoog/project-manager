import { CreateDateColumnWithFormat } from '@/common/typeorm'
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export default class LoggingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('text')
  action!: string

  @Column('text')
  target!: string

  @Column('text', { default: '1' })
  status!: string

  @Column('text')
  ip!: string

  @Column('text')
  user!: string

  @Column('text')
  description!: string

  @CreateDateColumnWithFormat()
  time!: string
}