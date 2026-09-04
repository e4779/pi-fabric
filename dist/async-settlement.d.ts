export declare const throwIfAborted: (signal: AbortSignal | undefined) => void;
export declare const runAbortable: <T>(signal: AbortSignal | undefined, operation: () => T | PromiseLike<T>) => Promise<T>;
export declare const settleWithin: (operations: Iterable<PromiseLike<unknown>>, timeoutMs: number) => Promise<boolean>;
//# sourceMappingURL=async-settlement.d.ts.map