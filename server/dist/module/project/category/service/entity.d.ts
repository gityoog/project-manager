import { BaseEntity } from 'typeorm';
export default class ProjectCategoryEntity extends BaseEntity {
    id: string;
    name: string;
    sort: string;
    created_at: Date;
    updated_at: Date;
}
