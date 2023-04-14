import ProjectService from "../service";
import ProjectDto from "../service/dto";
export default class ProjectController {
    private project;
    constructor(project: ProjectService);
    query(data: {
        type?: string | null;
    }): Promise<import("../service/entity").default[]>;
    save(data: ProjectDto): Promise<{
        id: string | undefined;
        type: string | null;
        name: string;
        context: string;
        build: string;
        dev: string;
        deploy: string;
    } & import("../service/entity").default>;
    remove(data: {
        id: string;
    } | {
        ids: string[];
    }): Promise<boolean>;
}
