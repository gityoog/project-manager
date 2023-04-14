import { Logger } from "@nestjs/common";
export default class NodeIpcService {
    constructor(logger: Logger);
    private inited;
    private init;
    on(event: 'url', callback: (data: {
        id: string;
        host: string;
        port: string;
    }) => void): void;
    on(event: 'dist', callback: (data: {
        id: string;
        path: string;
    }) => void): void;
    off(event: string, callback: (data: any) => void): void;
}
