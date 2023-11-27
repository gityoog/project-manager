import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { EntitySubscriberInterface, BaseEntity, RemoveEvent } from 'typeorm'
import { DataSource, QueryRunner } from 'typeorm'

type action = 'Add' | 'Remove' | 'Update'

namespace EntitySubscriber {
  export type Action = action
}

@Injectable()
abstract class EntitySubscriber<T extends BaseEntity = BaseEntity> implements OnModuleInit {
  @Inject() private dataSource!: DataSource
  protected abstract Entity?: new () => T
  onModuleInit() {
    this.dataSource.subscribers.push({
      listenTo: () => this.Entity,
      afterInsert: async ({ entity, queryRunner, manager }) => {
        this.addCallback(queryRunner, () => this.events.forEach(fn => fn('Add', entity)))
      },
      afterUpdate: async ({ entity, databaseEntity, queryRunner, manager }) => {
        this.addCallback(queryRunner, () => this.events.forEach(fn => fn('Update', entity as T, databaseEntity)))
      },
      beforeRemove: async (event) => {
        for (const fn of this.beforeRemoveEvents) {
          await fn(event)
        }
      },
      afterRemove: ({ entity, databaseEntity, queryRunner }) => {
        this.addCallback(queryRunner, () => this.events.forEach(fn => fn('Remove', databaseEntity, entity)))
      },
      afterTransactionCommit: ({ queryRunner }) => {
        if (queryRunner.data.callback) {
          queryRunner.data.callback.forEach((fn: Function) => fn())
          delete queryRunner.data.callback
        }
      },
      afterTransactionRollback: ({ queryRunner }) => {
        if (queryRunner.data.callback) {
          delete queryRunner.data.callback
        }
      }
    } as EntitySubscriberInterface<T>)
  }
  private addCallback(queryRunner: QueryRunner, callback: () => void) {
    if (queryRunner.isTransactionActive) {
      if (!queryRunner.data?.callback) {
        queryRunner.data.callback = []
      }
      queryRunner.data.callback.push(callback)
    } else {
      callback()
    }
  }
  private events: Array<(action: action, row: T, origin?: T) => void> = []
  private beforeRemoveEvents: Array<(event: RemoveEvent<T>) => Promise<void>> = []
  async beforeRemove(callback: (event: RemoveEvent<T>) => Promise<void>) {
    this.beforeRemoveEvents.push(callback)
  }
  async on(callback: (action: action, row: T, origin?: T) => void) {
    this.events.push(callback)
  }
  async onAdd(callback: (row: T) => void) {
    this.on((action, row) => {
      if (action === 'Add') {
        callback(row)
      }
    })
  }
  async onRemove(callback: (row: T, origin?: T) => void) {
    this.on((action, row, origin) => {
      if (action === 'Remove') {
        callback(row, origin)
      }
    })
  }
  async onUpdate(callback: (row: T, origin?: T) => void) {
    this.on((action, row, origin) => {
      if (action === 'Update') {
        callback(row, origin)
      }
    })
  }
}

export default EntitySubscriber