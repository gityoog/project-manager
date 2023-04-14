import EntityEmitter from "@/common/entity-emitter";
import LoggingService from "@/module/logging/service";
import ProjectOutputEntity from "../service/entity";
export default class ProjectOutputBus extends EntityEmitter<ProjectOutputEntity> {
    private logging;
    constructor(logging: LoggingService);
    clear(): void;
}
