/// <reference types="node" />
import { BaseEntity, EntityManager } from 'typeorm';
import EventEmitter from 'events';
import EntityEmitterHanlder from './handler';
export default class EntityEmitter<T extends BaseEntity> {
    private emitter;
    add(row: T): void;
    onAdd(callback: (row: T) => void): () => EventEmitter;
    update(row: T, origin: T): void;
    onUpdate(callback: (row: T, origin: T) => void): () => EventEmitter;
    remove(row: T | T[]): void;
    onRemove(callback: (row: T) => void): () => EventEmitter;
    handle(): EntityEmitterHanlder;
    private removeHandlers;
    startRemove(row: T, manager: EntityManager, handler: EntityEmitterHanlder): Promise<void>;
    beforeRemove(callback: (row: T, manager: EntityManager, onFinish: (callback: () => Promise<void> | void) => void) => Promise<void>): () => void;
    on(callback: (action: 'Add' | 'Remove' | 'Update', row: T, origin?: T) => void): () => void;
    onChange(callback: (rows: T[]) => void): () => void;
}
