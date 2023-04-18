import { BaseEntity, EntityManager } from 'typeorm'
import EventEmitter from 'events'
import EntityEmitterHanlder from './handler'
import debounce from 'lodash.debounce'

export default class EntityEmitter<T extends BaseEntity> {
  private emitter = new EventEmitter()
  add(row: T) {
    this.emitter.emit('Add', row)
  }
  onAdd(callback: (row: T) => void) {
    this.emitter.on('Add', callback)
    return () => {
      return this.emitter.off('Add', callback)
    }
  }
  update(row: T, origin: T) {
    this.emitter.emit('Update', row, origin)
  }
  onUpdate(callback: (row: T, origin: T) => void) {
    this.emitter.on('Update', callback)
    return () => {
      return this.emitter.off('Update', callback)
    }
  }
  remove(row: T | T[]) {
    if (Array.isArray(row)) {
      row.forEach(row => this.emitter.emit('Remove', row))
    } else {
      this.emitter.emit('Remove', row)
    }
  }
  onRemove(callback: (row: T) => void) {
    this.emitter.on('Remove', callback)
    return () => {
      return this.emitter.off('Remove', callback)
    }
  }
  handle() {
    return new EntityEmitterHanlder
  }
  private removeHandlers: Array<(row: T, manager: EntityManager, onFinish: (callback: () => Promise<void> | void) => void) => Promise<void>> = []
  async startRemove(row: T, manager: EntityManager, handler: EntityEmitterHanlder) {
    for (const fn of this.removeHandlers) {
      await fn(row, manager, (callback) => {
        handler.add(callback)
      })
    }
  }
  beforeRemove(callback: (row: T, manager: EntityManager, onFinish: (callback: () => Promise<void> | void) => void) => Promise<void>) {
    this.removeHandlers.push(callback)
    return () => {
      const index = this.removeHandlers.indexOf(callback)
      if (index >= 0) {
        this.removeHandlers.splice(index, 1)
      }
    }
  }
  on(callback: (action: 'Add' | 'Remove' | 'Update', row: T, origin?: T) => void): () => void {
    const off = [
      this.onAdd(row => callback('Add', row)),
      this.onUpdate((row, origin) => callback('Update', row, origin)),
      this.onRemove(row => callback('Remove', row)),
    ]
    return () => {
      off.forEach(fn => fn())
      off.splice(0, off.length)
    }
  }
  onChange(callback: (rows: T[]) => void) {
    const rows: T[] = []
    const fn = debounce(() => {
      callback(rows.splice(0, rows.length))
    }, 100)
    return this.on((_, row) => {
      rows.push(row)
      fn()
    })
  }
}