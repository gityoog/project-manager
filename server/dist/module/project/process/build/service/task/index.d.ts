import ProjectEntity from "@/module/project/service/entity";
import ProjectProcessBuildBus from "../../bus";
import ProjectOutputService from "@/module/project/ouput/service";
import LoggingService from "@/module/logging/service";
export default class BuildTaskService {
    private project;
    key: string;
    private pty;
    private bus;
    private status;
    private output;
    private clsStore;
    private logging;
    constructor({ project, bus, output, logging }: {
        project: ProjectEntity;
        bus: ProjectProcessBuildBus;
        output: ProjectOutputService;
        logging: LoggingService;
    });
    save(outpath: string): void;
    info(): {
        status: boolean;
        stdout: string[];
    };
    run(shell: string): number | false;
    stop(): boolean;
    destroy(): void;
}
