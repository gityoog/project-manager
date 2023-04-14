import ProjectDto from "./dto";
import ProjectEntity from "./entity";
import { Repository, DataSource } from "typeorm";
import ProjectCategoryEntity from "../category/service/entity";
import ProjectBus from "../bus";
import ProjectCategoryBus from "../category/bus";
export default class ProjectService {
    private main;
    private category;
    private dataSource;
    private bus;
    private categoryBus;
    constructor(main: Repository<ProjectEntity>, category: Repository<ProjectCategoryEntity>, dataSource: DataSource, bus: ProjectBus, categoryBus: ProjectCategoryBus);
    query(data: {
        type?: string | null;
    }): Promise<ProjectEntity[]>;
    detail(id: string): Promise<ProjectEntity | null>;
    save(dto: ProjectDto): Promise<{
        id: string | undefined;
        type: string | null;
        name: string;
        context: string;
        build: string;
        dev: string;
        deploy: string;
    } & ProjectEntity>;
    remove(data: {
        id: string;
    } | {
        ids: string[];
    }): Promise<boolean>;
}
