export type MemoryBranches = "active" | "all";
export interface LiveSessionBranch {
    entries: readonly unknown[];
    leafId: string | null;
}
export interface SessionLineage {
    branches: MemoryBranches;
    leafId: string | null;
    entryOrdinals: ReadonlySet<number> | null;
    fingerprint: string;
    coverageReasons: string[];
}
/**
 * Reconstruct Pi 0.80.6's persisted leaf semantics without treating append
 * order as a transcript: the final persisted entry is the leaf, duplicate IDs
 * resolve to their last record in the ID map, and parent links are walked to a
 * root. Cycles are stopped defensively and reported as incomplete coverage.
 */
export declare const reconstructSessionLineage: (sessionFile: string, branches: MemoryBranches, liveBranch?: LiveSessionBranch) => SessionLineage;
//# sourceMappingURL=lineage.d.ts.map