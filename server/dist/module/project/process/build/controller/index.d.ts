import ProjectProcessBuildService from "../service";
export default class ProjectProcessBuildController {
    private service;
    constructor(service: ProjectProcessBuildService);
    info(data: {
        id: string;
    }): {
        status: boolean;
        stdout: string[];
    } | undefined;
    start(data: {
        id: string;
    }): Promise<number | false>;
    stop(data: {
        id: string;
    }): boolean;
}
