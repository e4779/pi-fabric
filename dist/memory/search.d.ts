import type { MemoryBranches } from "./lineage.js";
import type { NormalizedEntry } from "./normalize.js";
import type { DigestShard, MemoryCoverage, SearchFilters, Shard } from "./index.js";
import { type RegexExecutionError } from "./regex.js";
import { type MemoryQueryMode } from "./tokenize.js";
export declare const DEFAULT_REGEX_MAX_PATTERN_BYTES = 1024;
export declare const DEFAULT_REGEX_MAX_HAYSTACK_TERMS = 20000;
export declare const DEFAULT_REGEX_MAX_HAYSTACK_BYTES: number;
export declare const DEFAULT_REGEX_TIMEOUT_MS = 250;
export interface SearchQuery {
    query?: string;
    queryMode?: MemoryQueryMode;
    filters?: SearchFilters;
    limit?: number;
    candidateLimits?: {
        maxEntries: number;
        maxDigests: number;
        maxItems: number;
    };
    regexLimits?: {
        maxPatternBytes: number;
        maxHaystackTerms: number;
        maxHaystackBytes: number;
        timeoutMs: number;
    };
}
interface SearchSegmentEntry {
    entry: NormalizedEntry;
    matched: boolean;
    marker: ">" | " ";
}
interface ExactEntryAddress {
    index: number;
    entryId: string | null;
    operationAddress: string | null;
}
interface SearchSegment {
    sessionId: string;
    sessionFile: string;
    sourceHash: string;
    branches: MemoryBranches;
    lineageFingerprint: string;
    sessionMtime: number;
    range: string;
    entryRange: {
        first: number;
        last: number;
    };
    entries: SearchSegmentEntry[];
    exactMatches: ExactEntryAddress[];
    matchedCount: number;
    score: number;
    tier: "hot" | "cold";
}
interface DigestHit {
    sessionId: string;
    sessionFile: string;
    sourceHash: string;
    branches: MemoryBranches;
    lineageFingerprint: string;
    cwd: string;
    lastTs: number | null;
    sessionMtime: number;
    score: number;
    tier: "cold";
    matchedTerms: number;
    matchedStructuralEntries: number;
}
export type SearchItem = {
    kind: "entry";
    segment: SearchSegment;
} | {
    kind: "digest";
    digest: DigestHit;
};
interface QueryCoverage {
    complete: boolean;
    reasons: string[];
    error?: RegexExecutionError;
}
type MemoryMatchMode = "browse" | "lexical" | "regex" | "structural" | "combined";
export interface SearchResult {
    matchMode: MemoryMatchMode;
    matchedCount: number;
    totalMatches: number;
    totalItems: number;
    segmentCount: number;
    segments: SearchSegment[];
    digestHits: DigestHit[];
    items: SearchItem[];
    queryCoverage: QueryCoverage;
}
export declare const searchMemoryIndex: (shards: Shard[], digests: DigestShard[], query: SearchQuery) => Promise<SearchResult>;
export declare const searchShards: (shards: Shard[], query: SearchQuery) => Promise<SearchResult>;
export declare const formatSearchResult: (result: SearchResult, query: string | undefined, coverage?: MemoryCoverage, filters?: SearchFilters) => string;
export {};
//# sourceMappingURL=search.d.ts.map