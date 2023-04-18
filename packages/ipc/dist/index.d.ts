export default class ProjectManagerIpc {
    private id;
    private server;
    constructor({ id, idKey, serverKey, log }?: {
        id?: string;
        idKey?: string;
        serverKey?: string;
        log?: (msg: string) => void;
    });
    setLogger(log: (msg: string) => void): void;
    connect({ success, fail }: {
        success?: () => void;
        fail?: (err: string) => void;
    }): void;
    private getClient;
    emitUrl(host: string, port: number): void;
    emitDist(path: string): void;
    emitError(message: string): void;
    destroy(): void;
}
