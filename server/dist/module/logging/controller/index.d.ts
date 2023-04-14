import LoggingService from "../service";
export default class LoggingController {
    private service;
    constructor(service: LoggingService);
    query(data: {
        page?: number;
        size?: number;
        params?: {};
    }): Promise<{
        data: import("../service/entity").default[];
        total: number;
        page: number;
    }>;
    clear(): Promise<void>;
}
