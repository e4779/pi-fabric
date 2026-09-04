export declare const FABRIC_RUN_ROOT_PREFIX = "pi-fabric-runs-";
export interface RetentionSweepResult {
    removedRoots: string[];
    removedRuns: string[];
}
export declare const markRunRootActive: (root: string, now?: number) => void;
export declare const heartbeatRunRoot: (root: string, now?: number) => void;
export declare const markRunRootClosed: (root: string, now?: number) => void;
export declare const sweepTempRunRoots: (options: {
    tempRoot: string;
    currentRoot?: string;
    orphanedTempRunRetentionMs: number;
    oneShotRunRetentionMs: number;
    now?: number;
}) => RetentionSweepResult;
export declare const pruneActorRunArchives: (options: {
    runsDirectory: string;
    latestRunId?: string;
    retentionMs: number;
    now?: number;
}) => string[];
//# sourceMappingURL=retention.d.ts.map