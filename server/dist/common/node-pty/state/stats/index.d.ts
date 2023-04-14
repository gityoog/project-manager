type stats = {
    cpu: string;
    memory: string;
};
export default class PtyUsageStats {
    private cores;
    private callback?;
    private timeout?;
    private index;
    private running;
    private data;
    getData(): stats | null;
    private setData;
    onUpdate(callback: (stats: stats | null) => void): void;
    start(pid: number): void;
    private query;
    stop(): void;
    destroy(): void;
}
export {};
