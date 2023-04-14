export default class BuildTaskStatus {
    private pty;
    private zip;
    private save;
    get(): boolean;
    canStop(): boolean;
    setPty(value: boolean): void;
    setZip(value: boolean): void;
    setSave(value: boolean): void;
    private callback?;
    onChange(callback: (status: boolean) => void): void;
    private update;
    destroy(): void;
}
