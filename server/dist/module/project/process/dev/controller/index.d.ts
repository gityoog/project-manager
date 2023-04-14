import ProjectProcessDevService from "../service";
export default class ProjectProcessDevController {
    private service;
    constructor(service: ProjectProcessDevService);
    info(data: {
        id: string;
    }): {
        pty: {
            status: boolean;
            stdout: string[];
            stats: {
                cpu: string;
                memory: string;
            } | null;
        };
        url: {
            host: string;
            port: string;
        } | null;
    } | undefined;
    start(data: {
        id: string;
    }): Promise<number | false>;
    stop(data: {
        id: string;
    }): void;
}
