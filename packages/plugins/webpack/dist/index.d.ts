import { Compiler, Stats } from 'webpack';
export default class ProjectManagerWebpackPlugin {
    private options;
    private name;
    private logger;
    private ipc;
    constructor(options: {
        devInfo?: () => {
            host: string;
            port: number;
        };
        distInfo?: () => {
            version?: string;
            name?: string;
        } | Promise<{
            version?: string;
            name?: string;
        }>;
    });
    apply(compiler: Compiler): void;
    outFile(stats: Stats): Promise<void>;
}
