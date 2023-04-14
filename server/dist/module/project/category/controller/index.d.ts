import ProjectCategoryService from "../service";
import ProjectCategoryDto from "../service/dto";
export default class ProjectCategoryController {
    private project;
    constructor(project: ProjectCategoryService);
    query(): Promise<{
        data: import("../service/entity").default[];
        other: boolean;
    }>;
    save(data: ProjectCategoryDto): Promise<{
        id: string | undefined;
        name: string;
        sort: string;
    } & import("../service/entity").default>;
    remove({ id }: {
        id: string;
    }): Promise<boolean>;
    removes(projects: {
        id: string;
    }[]): Promise<boolean[]>;
}
