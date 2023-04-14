import ConfigService from "@/module/config/service";
import LoggingService from "@/module/logging/service";
import ProjectBus from "@/module/project/bus";
import ProjectService from "@/module/project/service";
import NodeIpcService from "../../node-ipc";
import ProjectProcessDevBus from "../bus";
export default class ProjectProcessDevService {
    private bus;
    private project;
    private projectBus;
    private ipc;
    private config;
    private logging;
    private data;
    private keyDict;
    constructor(bus: ProjectProcessDevBus, project: ProjectService, projectBus: ProjectBus, ipc: NodeIpcService, config: ConfigService, logging: LoggingService);
    run(id: string): Promise<number | false>;
    stop(id: string): void;
    info(id: string): {
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
    private init;
    private factory;
    private get;
}
