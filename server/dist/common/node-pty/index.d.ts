import PtyState from "./state";
export default class NodePtyService {
    private key;
    private options;
    private process?;
    private listeners;
    private state;
    constructor(key: string, options?: {
        stats?: boolean;
    });
    run({ command, cwd, shell, env }: {
        shell: string;
        command: string | string[];
        cwd: string;
        env?: Record<string, string>;
    }): number;
    stop(): boolean;
    info(): {
        status: boolean;
        stdout: string[];
        stats: {
            cpu: string;
            memory: string;
        } | null;
    };
    tip(name: string, detail?: string): void;
    onStdoutPush(callback: (data: string) => void): void;
    onStatusChange(callback: (status: boolean) => void): void;
    onStatsUpdate(callback: (stats: PtyState.stats | null) => void): void;
    private clear;
    destroy(): void;
}
