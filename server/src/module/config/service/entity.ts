import { Entity, Column, BaseEntity } from 'typeorm'

@Entity()
export default class ConfigEntity extends BaseEntity {
  @Column('text', {
    primary: true
  })
  name!: string

  @Column('text')
  value!: string
}