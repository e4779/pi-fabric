import { type SessionDigest } from "./digest.js";
import type { SessionRef } from "./discovery.js";
import type { LiveSessionBranch, MemoryBranches } from "./lineage.js";
import type { NormalizedEntry } from "./normalize.js";
export declare const MEMORY_CACHE_VERSION = 6;
export declare const DEFAULT_HOT_SESSIONS = 50;
type MemoryTier = "hot" | "cold";
interface CacheRecord {
    cacheVersion: typeof MEMORY_CACHE_VERSION;
    kind: "shard" | "digest";
    mtime: number;
    size: number;
    sourceHash: string;
    branches: MemoryBranches;
    lineageFingerprint: string;
    policy: string;
    cacheBytes: number;
    cacheSourceRatio: number;
}
export interface Shard extends CacheRecord {
    kind: "shard";
    sessionFile: string;
    sessionId: string;
    entries: NormalizedEntry[];
    totalEntryCount: number;
    indexCoverage: {
        complete: boolean;
        reasons: string[];
    };
    tier?: MemoryTier;
    indexReason?: string;
}
export interface DigestShard extends SessionDigest, CacheRecord {
    kind: "digest";
}
export interface MemoryIndexOptions {
    indexDir: string;
    maxEntryChars: number;
    hotSessions?: number;
    digestTerms?: number;
    maxColdVocabularyBytes?: number;
    maxColdCacheBytes?: number;
    maxSyncSessions?: number;
    maxSyncSourceBytes?: number;
    maxCacheCleanupFiles?: number;
    branches?: MemoryBranches;
    indexThinking?: boolean;
    indexToolOutput?: boolean;
    liveBranchForFile?: (sessionFile: string) => LiveSessionBranch | undefined;
}
export interface EntryRange {
    first: number;
    last: number;
}
export declare const shardPathForSession: (sessionFile: string, indexDir: string, branches?: MemoryBranches) => string;
export declare const digestPathForSession: (sessionFile: string, indexDir: string, branches?: MemoryBranches) => string;
export interface SourceState {
    mtime: number;
    size: number;
    sourceHash: string;
}
export declare const fingerprintSource: (file: string) => SourceState | null;
export declare const loadShard: (ref: SessionRef, options: MemoryIndexOptions) => Shard;
export declare const loadDigest: (ref: SessionRef, options: MemoryIndexOptions) => DigestShard;
export interface MemoryCoverage {
    complete: boolean;
    indexedSessions: number;
    eligibleSessions: number;
    staleSessions: number;
    incompleteSessions: number;
    reasons: string[];
}
export interface TieredIndexBundle {
    shards: Shard[];
    digests: DigestShard[];
    refs: SessionRef[];
    tiers: Map<string, MemoryTier>;
    coverage: MemoryCoverage;
}
export declare const loadTieredIndex: (refs: SessionRef[], allRefs: SessionRef[], options: MemoryIndexOptions, hydrate?: boolean, entryRange?: EntryRange) => TieredIndexBundle;
export interface SearchFilters {
    role?: string;
    tool?: string;
    ref?: string;
    provider?: string;
    action?: string;
    outcome?: NonNullable<NormalizedEntry["outcome"]>;
    since?: number;
    until?: number;
}
export interface IndexedEntry {
    entry: NormalizedEntry;
    sessionMtime: number;
}
export interface ScoredEntry extends IndexedEntry {
    score: number;
}
export interface ShardBundle {
    shards: Shard[];
    refs: SessionRef[];
}
export declare const loadShards: (refs: SessionRef[], options: MemoryIndexOptions) => ShardBundle;
export declare const bm25Score: (shards: Shard[], terms: string[], filters: SearchFilters, candidateLimit?: number) => ScoredEntry[];
export declare const recentEntries: (shards: Shard[], filters: SearchFilters, limit: number) => IndexedEntry[];
export {};
//# sourceMappingURL=index.d.ts.map