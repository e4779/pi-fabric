export declare const CLONE_SKIP_PREFIXES: readonly [".git", ".pi/fabric/worktrees"];
export declare class CowUnavailableError extends Error {
    constructor(message: string, options?: {
        cause?: unknown;
    });
}
export declare const cloneTree: (source: string, dest: string, prefixes?: readonly string[]) => Promise<void>;
//# sourceMappingURL=cow-clone.d.ts.map