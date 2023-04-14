import LoggingService from "../service";
export default class LoggingController {
    private project;
    constructor(project: LoggingService);
    query(data: {
        page?: number;
        size?: number;
        params?: {};
    }): Promise<{
        data: import("../service/entity").default[];
        total: number;
        page: number;
    }>;
}
