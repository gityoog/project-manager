export default class Options {
    private static _instance;
    static default(...args: ConstructorParameters<typeof Options>): Options;
    static factory(): Options;
    port: number;
    db: string;
    web?: string;
    constructor({ port, db, web }: {
        port: number;
        db: string;
        web?: string;
    });
}
