type project = {
    id: string;
};
type data = project & ({
    action: 'status';
    value: boolean;
} | {
    action: 'stdout';
    value: string;
} | {
    action: 'url';
    value: {
        host: string;
        port: string;
    } | null;
} | {
    action: 'stats';
    value: {
        cpu: string;
        memory: string;
    } | null;
});
export default class ProjectProcessDevBus {
    private callbacks;
    emit(data: data): void;
    on(callback: (data: data) => void): () => void;
}
export {};
