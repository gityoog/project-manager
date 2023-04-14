import ProjectOutputBus from "@/module/project/ouput/bus";
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
    action: 'new';
});
export default class ProjectProcessBuildBus {
    private output;
    private callbacks;
    constructor(output: ProjectOutputBus);
    emit(data: data): void;
    on(callback: (data: data) => void): () => void;
}
export {};
