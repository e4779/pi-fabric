export declare class Semaphore {
    #private;
    readonly limit: number;
    constructor(limit: number);
    acquire(signal?: AbortSignal): Promise<() => void>;
}
//# sourceMappingURL=semaphore.d.ts.map