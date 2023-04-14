import { BaseEntity } from 'typeorm';
export default class ProjectEntity extends BaseEntity {
    id: string;
    name: string;
    type: string | null;
    context: string;
    build: string;
    dev: string;
    deploy: string;
    sort: string;
}
