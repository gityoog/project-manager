import EntityEmitter from "@/common/entity-emitter";
import LoggingService from "@/module/logging/service";
import ProjectCategoryEntity from "@/module/project/category/service/entity";
export default class ProjectCategoryBus extends EntityEmitter<ProjectCategoryEntity> {
    private logging;
    constructor(logging: LoggingService);
}
