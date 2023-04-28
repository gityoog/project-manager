import { ISession } from "connect-typeorm"
import { Entity, Column, Index, PrimaryColumn, DeleteDateColumn } from 'typeorm'

@Entity()
export class SessionEntity implements ISession {
  @Index()
  @Column("bigint")
  public expiredAt = Date.now();

  @PrimaryColumn("varchar", { length: 255 })
  public id = "";

  @Column("text")
  public json = "";

  @DeleteDateColumn()
  public destroyedAt?: Date
}