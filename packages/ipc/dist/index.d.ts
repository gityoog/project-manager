export default class ProjectManagerIpc {
    private id;
    private server;
    constructor({ idKey, serverKey, log }?: {
        idKey?: string;
        serverKey?: string;
        log?: (msg: string) => void;
    });
    setLogger(log: (msg: string) => void): void;
    connect({ success, fail }?: {
        success?: () => void;
        fail?: (err: string) => void;
    }): void;
    private getClient;
    emitUrl(host: string, port: number): void;
    emitDist(path: string, { version, name }?: {
        version?: string;
        name?: string;
    }): void;
    emitError(message: string): void;
    disconnect(): void;
    destroy(): void;
}
