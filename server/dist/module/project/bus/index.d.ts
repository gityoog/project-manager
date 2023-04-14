import EntityEmitter from "@/common/entity-emitter";
import LoggingService from "@/module/logging/service";
import ProjectEntity from "../service/entity";
export default class ProjectBus extends EntityEmitter<ProjectEntity> {
    private logging;
    constructor(logging: LoggingService);
}
