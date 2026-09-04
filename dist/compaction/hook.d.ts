import { type CompactionResult, type ExtensionAPI, type SessionEntry } from "@earendil-works/pi-coding-agent";
import { type CompactionEnricher } from "./enrichers.js";
import { type CompactionInstructionDecodeError, type CompactionInstructionPolicy } from "./instructions.js";
import { type ProjectionOmittedCounts } from "./projections.js";
type CompactionEngine = "pi" | "fabric";
export interface FabricCompactionBudget {
    contextWindow: number;
    targetContextRatio: number;
    reserveTokens: number;
    keepRecentTokens: number;
}
type FabricCompactionBindingConstraint = "continuity" | "occupancy" | "reserve" | "reduction";
export interface FabricCompactionBudgetDetails {
    strategy: "adaptive" | "continuity";
    contextWindow: number;
    targetContextRatio: number;
    targetContextTokens: number;
    reserveTokens: number;
    keepRecentTokens: number;
    rawTokensBefore: number;
    tokenScale: number;
    fixedOverheadTokens: number;
    retainedRawTokens: number;
    projectedTokensAfter: number;
    continuityTargetTokens?: number;
    occupancyCeilingTokens?: number;
    safeCeilingTokens?: number;
    reductionCeilingTokens?: number;
    rawTailTokenBudget?: number;
    bindingConstraint?: FabricCompactionBindingConstraint;
}
export declare const rawContextTokens: (branchEntries: SessionEntry[]) => number;
export type CutResult = {
    ok: true;
    summarized: SessionEntry[];
    firstKeptEntryId: string;
    firstSummarizedEntryId: string;
    lastSummarizedEntryId: string;
    lastTimestamp: string;
    budget?: Omit<FabricCompactionBudgetDetails, "projectedTokensAfter">;
} | {
    ok: false;
    reason: "empty";
};
export declare const computeCut: (branchEntries: SessionEntry[], options?: {
    tokensBefore: number;
    budget: FabricCompactionBudget;
}) => CutResult;
interface EntryRange {
    first: string;
    last: string;
}
export interface FabricCompactionDetailsV2 {
    compactor: "fabric";
    version: 2;
    sections: string[];
    coverage: {
        cumulativeSourceRange: EntryRange;
        liveCutRange: EntryRange;
    };
    counts: {
        branchEntries: number;
        cumulativeSourceEntries: number;
        sourceEvents: number;
        liveCutEntries: number;
        priorFabricV1: number;
        priorFabricV2: number;
    };
    omittedCounts: ProjectionOmittedCounts & {
        preserve: number;
        thinking?: number;
    };
    instructionPolicy: CompactionInstructionPolicy;
    stableAddresses: {
        firstKeptEntryId: string;
        cumulativeSourceRange: EntryRange;
        recall: "session-entry-id-range";
    };
    budget?: FabricCompactionBudgetDetails;
    timestamp: string;
}
export declare const fabricCompactionVersion: (details: unknown) => 1 | 2 | undefined;
export declare const compileFabricSummary: (branchEntries: SessionEntry[], tokensBefore: number, enrichers?: readonly CompactionEnricher[], customInstructions?: string, budget?: FabricCompactionBudget) => {
    compaction: CompactionResult<FabricCompactionDetailsV2>;
} | {
    cancel: true;
    reason: string;
    instructionError?: CompactionInstructionDecodeError;
};
export interface CompactionHookOptions {
    getEngine: () => CompactionEngine;
    getTargetContextRatio?: () => number;
    getThresholdContextRatio?: (modelKey: string) => number | undefined;
    getThresholdTokens?: (modelKey: string) => number | undefined;
    enrichers?: readonly CompactionEnricher[];
}
export declare const registerCompactionHook: (pi: ExtensionAPI, options: CompactionHookOptions) => void;
export {};
//# sourceMappingURL=hook.d.ts.map