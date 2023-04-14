declare namespace PtyState {
    type url = {
        host: string;
        port: string;
    };
    type stats = {
        cpu: string;
        memory: string;
    };
}
declare class PtyState {
    private stdout;
    private status;
    private stats;
    activeStats(pid: number): void;
    get(): {
        status: boolean;
        stdout: string[];
        stats: {
            cpu: string;
            memory: string;
        } | null;
    };
    onStatsUpdate(callback: (stats: PtyState.stats | null) => void): void;
    private stdoutCallback?;
    writeStdout(data: string): void;
    onStdoutPush(callback: (data: string) => void): void;
    private statusChange?;
    setStatus(status: boolean): void;
    onStatusChange(callback: (status: boolean) => void): void;
    clear(): void;
    destroy(): void;
}
export default PtyState;
