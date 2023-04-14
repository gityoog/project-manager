import ConfigService from "../service";
export default class ConfigController {
    private service;
    constructor(service: ConfigService);
    setting(): Promise<{
        shell: string;
    }>;
    saveShell(data: {
        shell: string;
    }): Promise<void>;
}
