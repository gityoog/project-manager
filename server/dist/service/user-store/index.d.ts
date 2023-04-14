import { ClsService } from "nestjs-cls";
export default class UserStore {
    private cls;
    id: string;
    name: string;
    ip: string;
    constructor(cls: ClsService);
    get token(): string;
}
