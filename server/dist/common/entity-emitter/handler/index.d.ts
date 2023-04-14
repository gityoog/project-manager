export default class EntityEmitterHanlder {
    private callbacks;
    add(callback: () => Promise<void> | void): void;
    finish(): Promise<void>;
}
