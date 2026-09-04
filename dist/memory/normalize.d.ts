import type { FabricExecutionOutcomeV1, FabricTraceJsonValue } from "../audit/trace.js";
import { type FabricBranchFactV2 } from "../compaction/branch-details.js";
import type { SessionLineage } from "./lineage.js";
export interface MemoryIndexPrivacyPolicy {
    indexThinking: boolean;
    indexToolOutput: boolean;
}
export declare const DEFAULT_MEMORY_INDEX_PRIVACY: MemoryIndexPrivacyPolicy;
export interface NormalizeSessionOptions extends Partial<MemoryIndexPrivacyPolicy> {
    lineage?: SessionLineage;
}
/**
 * A typed, structure-derived projection of one session JSONL line.
 *
 * Text is truncated to `maxEntryChars` for index storage; the full untruncated
 * text remains addressable via {@link expandSession} / `memory.expand`, which
 * re-reads the source line on demand. The `index` is the dense position of the
 * entry among normalized entries within its session (0-based), so it stays
 * stable across re-parse and can address the same line on expand.
 */
export interface NormalizedEntry {
    sessionFile: string;
    sessionId: string;
    index: number;
    entryId: string | null;
    parentId: string | null;
    type: string;
    role: string | null;
    toolName: string | null;
    text: string;
    timestamp: number | null;
    isError: boolean;
    truncated: boolean;
    filesTouched?: string[];
    parentEntryId?: string | null;
    operationAddress?: string;
    ref?: string;
    provider?: string;
    action?: string;
    outcome?: FabricExecutionOutcomeV1;
    operation?: NormalizedFabricOperation;
    branchFact?: NormalizedFabricBranchFact;
    factAddress?: string;
    carrierEntryId?: string;
    carrierParentId?: string | null;
    carrierFromId?: string | null;
}
interface NormalizedFabricOperation {
    address: string;
    parentEntryId: string;
    sequence?: number;
    subordinal?: string;
    tool: string;
    ref: string;
    provider?: string;
    action?: string;
    args: Record<string, FabricTraceJsonValue>;
    outcome: FabricExecutionOutcomeV1;
    error?: string;
    result?: FabricTraceJsonValue;
    resultOmitted?: boolean;
}
interface NormalizedFabricBranchFact {
    kind: FabricBranchFactV2["kind"];
    address: string;
    entryId: string;
    subordinal: string;
    carrierEntryId: string;
    carrierParentId: string | null;
    carrierFromId: string | null;
    text?: string;
    customType?: string;
    display?: boolean;
    phase?: string;
    name?: string;
    description?: string;
    ref?: string;
    provider?: string;
    action?: string;
    tool?: string;
    args?: Record<string, FabricTraceJsonValue>;
    outcome?: FabricExecutionOutcomeV1;
    error?: string;
    result?: FabricTraceJsonValue;
}
export interface NormalizationCoverage {
    complete: boolean;
    reasons: string[];
}
export interface SessionHeaderInfo {
    sessionId: string;
    cwd: string;
    parentSession?: string;
}
/**
 * Extract searchable text from a parsed JSONL entry, structurally — from the
 * typed message content arrays, tool-call name + args, tool-result content,
 * and bashExecution command + output. No regex over prose lives here.
 */
export declare const extractFullText: (raw: Record<string, unknown>, options?: NormalizeSessionOptions) => string;
/**
 * Parse a session JSONL file into typed {@link NormalizedEntry} records.
 *
 * Only entries that carry searchable text are emitted (message, compaction,
 * branch_summary, custom_message); structural-only entries (model_change,
 * thinking_level_change, label, custom, session_info) are skipped, so `index`
 * counts only content-bearing lines. The session header (line 0) is returned
 * separately via {@link readSessionHeader} when needed.
 */
export declare const normalizeSession: (sessionFile: string, maxEntryChars: number, options?: NormalizeSessionOptions) => {
    entries: NormalizedEntry[];
    header: SessionHeaderInfo | null;
    indexCoverage: NormalizationCoverage;
};
/** Read only the session header (first JSONL line). */
export declare const readSessionHeader: (sessionFile: string) => SessionHeaderInfo | null;
/** Re-read a single session line and return its full, untruncated text. */
export declare const expandSessionEntry: (sessionFile: string, index: number, options?: NormalizeSessionOptions) => string | null;
export interface ExpandSessionSelection {
    indices?: number[];
    entryIds?: string[];
    operationAddresses?: string[];
    entryRange?: {
        first: number;
        last: number;
    };
}
export interface ExpandedSessionEntry {
    index: number;
    entryId: string | null;
    text: string;
    parentEntryId?: string | null;
    operationAddress?: string;
    toolName?: string | null;
    ref?: string;
    provider?: string;
    action?: string;
    outcome?: FabricExecutionOutcomeV1;
    filesTouched?: string[];
    operation?: NormalizedFabricOperation;
    branchFact?: NormalizedFabricBranchFact;
    factAddress?: string;
    carrierEntryId?: string;
    carrierParentId?: string | null;
    carrierFromId?: string | null;
}
/** Re-read source once and resolve index, stable entry-id, or inclusive range addresses. */
export declare const expandSessionEntries: (sessionFile: string, selection: ExpandSessionSelection, options?: NormalizeSessionOptions) => ExpandedSessionEntry[];
interface ExpansionAddressError {
    code: "ambiguous_address" | "address_not_found";
    message: string;
    addressType: "entry_id" | "operation_address";
    address: string;
    matches: number;
}
export type ExpandSessionResult = {
    expanded: ExpandedSessionEntry[];
} | {
    expanded: [];
    error: ExpansionAddressError;
};
/** Resolve every requested stable address exactly once, refusing missing or ambiguous identities. */
export declare const expandSessionEntriesChecked: (sessionFile: string, selection: ExpandSessionSelection, options?: NormalizeSessionOptions) => ExpandSessionResult;
export {};
//# sourceMappingURL=normalize.d.ts.map