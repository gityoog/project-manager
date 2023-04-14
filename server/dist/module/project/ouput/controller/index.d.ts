import { Response } from "express";
import ProjectOutputService from "../service";
export default class ProjectOutputController {
    private service;
    constructor(service: ProjectOutputService);
    query({ project }: {
        project: string;
    }): Promise<import("../service/entity").default[]>;
    remove({ id }: {
        id: string;
    }): Promise<import("../service/entity").default>;
    download({ id }: {
        id: string;
    }, response: Response): Promise<void>;
}
