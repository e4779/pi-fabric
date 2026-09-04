export interface PrewalkFsDrift {
    files: string[];
    truncated: number;
    added: number;
    modified: number;
    deleted: number;
    unchanged: number;
}
export declare class PrewalkDriftTracker {
    #private;
    constructor(options?: {
        maxTrackedFiles?: number;
    });
    captureBaseline(sessionId: string, cwd: string): Promise<void>;
    evaluate(sessionId: string, cwd: string): Promise<PrewalkFsDrift | undefined>;
    drop(sessionId: string): void;
    clear(): void;
}
//# sourceMappingURL=fs-drift.d.ts.map