import { Logger } from "@nestjs/common";
import LoggingEntity from "./entity";
import { Repository } from "typeorm";
import UserStore from "@/service/user-store";
export default class LoggingService {
    private main;
    private logger;
    private user;
    constructor(main: Repository<LoggingEntity>, logger: Logger, user: UserStore);
    query({ page, size, params }: {
        page?: number;
        size?: number;
        params?: {};
    }): Promise<{
        data: LoggingEntity[];
        total: number;
        page: number;
    }>;
    save(data: {
        action: string;
        target: string;
        description: string;
    }): void;
    clear(): Promise<void>;
}
