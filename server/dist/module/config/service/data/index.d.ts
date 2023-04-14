import { Repository } from 'typeorm';
import ConfigEntity from "../entity";
import LoggingService from "@/module/logging/service";
type item = {
    name: string;
    default: () => string;
};
type data = {
    shell: item;
};
export default class ConfigData {
    private main;
    private logging;
    private data;
    private cache;
    constructor(main: Repository<ConfigEntity>, logging: LoggingService);
    set(key: keyof data, value: string): Promise<void>;
    get(key: keyof data): Promise<string>;
    private save;
}
export {};
