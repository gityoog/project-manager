import ProjectCategoryDto from "./dto";
import ProjectCategoryEntity from "./entity";
import { Repository, DataSource } from "typeorm";
import ProjectEntity from "../../service/entity";
import ProjectCategoryBus from "../bus";
export default class ProjectCategoryService {
    private main;
    private project;
    private dataSource;
    private bus;
    constructor(main: Repository<ProjectCategoryEntity>, project: Repository<ProjectEntity>, dataSource: DataSource, bus: ProjectCategoryBus);
    query(): Promise<{
        data: ProjectCategoryEntity[];
        other: boolean;
    }>;
    save(dto: ProjectCategoryDto): Promise<{
        id: string | undefined;
        name: string;
        sort: string;
    } & ProjectCategoryEntity>;
    remove(id: string): Promise<boolean>;
}
