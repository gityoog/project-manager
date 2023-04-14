import ProjectEntity from "@/module/project/service/entity";
import ProjectProcessDevBus from "../../bus";
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
    constructor({ project, bus }: {
        project: ProjectEntity;
        bus: ProjectProcessDevBus;
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
    run(): number | false;
    stop(): boolean;
    destroy(): void;
}
export {};
