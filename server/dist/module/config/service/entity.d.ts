import { BaseEntity } from 'typeorm';
export default class ConfigEntity extends BaseEntity {
    name: string;
    value: string;
}
