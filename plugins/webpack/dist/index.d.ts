import { Compiler } from 'webpack';
export default class ProjectManagerWebpackPlugin {
    private options;
    private name;
    private server;
    private child;
    private key?;
    private logger;
    constructor(options: {
        devInfo?: () => {
            host: string;
            port: number;
        };
    });
    apply(compiler: Compiler): void;
    private getClient;
    private fail;
    private complete;
    private url;
}
