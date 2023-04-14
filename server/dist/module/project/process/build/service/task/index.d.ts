import ProjectEntity from "@/module/project/service/entity";
import ProjectProcessBuildBus from "../../bus";
import ProjectOutputService from "@/module/project/ouput/service";
export default class BuildTaskService {
    private project;
    key: string;
    private pty;
    private bus;
    private status;
    private output;
    private clsStore;
    constructor({ project, bus, output }: {
        project: ProjectEntity;
        bus: ProjectProcessBuildBus;
        output: ProjectOutputService;
    });
    save(outpath: string): void;
    info(): {
        status: boolean;
        stdout: string[];
    };
    run(): number | false;
    stop(): boolean;
    destroy(): void;
}
