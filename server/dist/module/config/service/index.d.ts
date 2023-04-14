import ConfigData from "./data";
export default class ConfigService {
    private data;
    constructor(data: ConfigData);
    getShell(): Promise<string>;
    setShell(value: string): Promise<void>;
}
