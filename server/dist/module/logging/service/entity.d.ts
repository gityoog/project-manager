import { BaseEntity } from 'typeorm';
export default class LoggingEntity extends BaseEntity {
    id: string;
    action: string;
    target: string;
    ip: string;
    user: string;
    description: string;
    time: string;
}
