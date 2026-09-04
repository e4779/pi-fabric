export interface AtomicWriteOptions {
    mode?: number;
    dirMode?: number;
    renameRetries?: number;
    renameRetryDelayMs?: number;
}
export declare const renameAtomic: (source: string, target: string, options?: AtomicWriteOptions) => void;
export declare const writeFileAtomic: (filePath: string, contents: string, options?: AtomicWriteOptions) => void;
export interface AtomicJsonOptions extends AtomicWriteOptions {
    space?: number;
    newline?: boolean;
}
export declare const writeJsonAtomic: (filePath: string, value: unknown, options?: AtomicJsonOptions) => void;
//# sourceMappingURL=atomic-write.d.ts.map