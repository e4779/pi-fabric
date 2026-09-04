import type { NormalizationCoverage, NormalizedEntry } from "./normalize.js";
/** Compact structural posting: source identity, typed role/tool fields, time, and exact Fabric capability identity. */
export type DigestEntryAddress = [
    index: number,
    entryId: string | null,
    operationAddress: string | null,
    role: string | null,
    toolName: string | null,
    timestamp: number | null,
    ref: string | null,
    provider: string | null,
    action: string | null,
    outcome: NormalizedEntry["outcome"] | null
];
interface DigestIndexCoverage {
    complete: boolean;
    vocabularyBytes: number;
    reasons: string[];
}
export interface SessionDigest {
    sessionId: string;
    file: string;
    cwd: string;
    firstTs: number | null;
    lastTs: number | null;
    entryCount: number;
    filesTouched: string[];
    toolHistogram: Record<string, number>;
    errorCount: number;
    /** Sorted exact unique canonical terms. Terms never contain posting lists. */
    vocabulary: string[];
    /** Structural entry identities retained independently from lexical vocabulary. */
    addresses: DigestEntryAddress[];
    indexCoverage: DigestIndexCoverage;
}
export interface DigestInput {
    sessionId: string;
    file: string;
    cwd: string;
    entries: NormalizedEntry[];
    maxVocabularyBytes?: number;
    filesTouchedLimit?: number;
    normalizationCoverage?: NormalizationCoverage;
}
/** Purely fold normalized session entries into bounded lexical and structural metadata. */
export declare const foldSessionDigest: (input: DigestInput) => SessionDigest;
export {};
//# sourceMappingURL=digest.d.ts.map