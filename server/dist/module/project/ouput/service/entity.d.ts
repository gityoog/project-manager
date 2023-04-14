/// <reference types="node" />
import { BaseEntity } from 'typeorm';
export default class ProjectOutputEntity extends BaseEntity {
    id: string;
    name: string;
    project: string;
    content: Buffer;
    size: string;
    created_at: Date;
}
