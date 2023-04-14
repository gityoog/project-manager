/// <reference types="node" />
import { Repository } from 'typeorm';
import ProjectBus from "../../bus";
import ProjectOutputBus from "../bus";
import ProjectOutputEntity from "./entity";
export default class ProjectOutputService {
    private main;
    private projectBus;
    private bus;
    constructor(main: Repository<ProjectOutputEntity>, projectBus: ProjectBus, bus: ProjectOutputBus);
    query(project: string): Promise<ProjectOutputEntity[]>;
    remove(id: string): Promise<ProjectOutputEntity>;
    read(id: string): Promise<ProjectOutputEntity | null>;
    save({ project, name, content }: {
        project: string;
        name: string;
        content: Buffer;
    }): Promise<ProjectOutputEntity>;
}
