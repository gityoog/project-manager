import ProjectBus from "@/module/project/bus";
import ProjectOutputService from "@/module/project/ouput/service";
import ProjectService from "@/module/project/service";
import NodeIpcService from "../../node-ipc";
import ProjectProcessBuildBus from "../bus";
export default class ProjectProcessBuildService {
    private bus;
    private project;
    private projectBus;
    private ipc;
    private output;
    private data;
    private keyDict;
    constructor(bus: ProjectProcessBuildBus, project: ProjectService, projectBus: ProjectBus, ipc: NodeIpcService, output: ProjectOutputService);
    run(id: string): Promise<number | false>;
    stop(id: string): boolean;
    info(id: string): {
        status: boolean;
        stdout: string[];
    } | undefined;
    private init;
    private factory;
    private get;
}
