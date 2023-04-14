import ProjectEntity from "@/module/project/service/entity";
import ProjectProcessDevBus from "../../bus";
import LoggingService from "@/module/logging/service";
type url = {
    host: string;
    port: string;
} | null;
export default class DevTaskService {
    private project;
    key: string;
    private pty;
    private url;
    private bus;
    private logging;
    constructor({ project, bus, logging }: {
        project: ProjectEntity;
        bus: ProjectProcessDevBus;
        logging: LoggingService;
    });
    setUrl(url: url): void;
    info(): {
        pty: {
            status: boolean;
            stdout: string[];
            stats: {
                cpu: string;
                memory: string;
            } | null;
        };
        url: url;
    };
    run(shell: string): number | false;
    stop(): boolean;
    destroy(): void;
}
export {};
