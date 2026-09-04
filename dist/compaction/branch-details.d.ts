import type { FabricExecutionOutcomeV1, FabricTraceJsonValue } from "../audit/trace.js";
export declare const FABRIC_BRANCH_SUMMARY_KIND: "pi-fabric.branch-summary";
declare const FABRIC_BRANCH_SUMMARY_VERSION_V1: 1;
export declare const FABRIC_BRANCH_SUMMARY_VERSION: 2;
export declare const FABRIC_BRANCH_SUMMARY_MAX_BYTES: number;
export declare const FABRIC_BRANCH_SUMMARY_MAX_FACTS = 256;
export declare const FABRIC_BRANCH_RUN_NAME_MAX_BYTES = 256;
export declare const FABRIC_BRANCH_RUN_DESCRIPTION_MAX_BYTES = 1024;
interface BranchFactBase {
    entryId: string;
    subordinal: string;
    address: string;
}
interface FabricBranchUserFactV1 extends BranchFactBase {
    kind: "user";
    text: string;
}
interface FabricBranchCustomMessageFactV1 extends BranchFactBase {
    kind: "customMessage";
    customType: string;
    text: string;
    display: boolean;
    details?: FabricTraceJsonValue;
}
interface FabricBranchPhaseFactV1 extends BranchFactBase {
    kind: "phase";
    phase: string;
}
export interface FabricBranchOperationFactV1 extends BranchFactBase {
    kind: "operation";
    ref: string;
    provider?: string;
    action?: string;
    tool: string;
    args: Record<string, FabricTraceJsonValue>;
    outcome: FabricExecutionOutcomeV1;
    error?: string;
    result?: FabricTraceJsonValue;
}
type FabricBranchFactV1 = FabricBranchUserFactV1 | FabricBranchCustomMessageFactV1 | FabricBranchPhaseFactV1 | FabricBranchOperationFactV1;
interface FabricBranchRunFactV2 extends BranchFactBase {
    kind: "fabricRun";
    name: string;
    description?: string;
    outcome: FabricExecutionOutcomeV1;
}
export type FabricBranchFactV2 = FabricBranchFactV1 | FabricBranchRunFactV2;
interface FabricBranchSummarySource {
    firstEntryId: string;
    lastEntryId: string;
    entryCount: number;
    /** Canonical abandoned-branch provenance. Absent only on older v1 envelopes. */
    oldLeafId?: string | null;
}
interface FabricBranchSummaryRequest {
    text: string;
    sourceBytes: number;
    truncated: boolean;
}
export interface FabricBranchSummaryDetailsV1 {
    kind: typeof FABRIC_BRANCH_SUMMARY_KIND;
    version: typeof FABRIC_BRANCH_SUMMARY_VERSION_V1;
    source: FabricBranchSummarySource;
    facts: FabricBranchFactV1[];
    omittedFacts: number;
    sections: string[];
    request: FabricBranchSummaryRequest;
}
export interface FabricBranchSummaryDetailsV2 {
    kind: typeof FABRIC_BRANCH_SUMMARY_KIND;
    version: typeof FABRIC_BRANCH_SUMMARY_VERSION;
    source: FabricBranchSummarySource;
    facts: FabricBranchFactV2[];
    omittedFacts: number;
    sections: string[];
    request: FabricBranchSummaryRequest;
}
export type FabricBranchSummaryDetails = FabricBranchSummaryDetailsV1 | FabricBranchSummaryDetailsV2;
export declare const readFabricBranchSummaryDetailsV1: (value: unknown) => FabricBranchSummaryDetailsV1 | undefined;
export declare const readFabricBranchSummaryDetailsV2: (value: unknown) => FabricBranchSummaryDetailsV2 | undefined;
export declare const readFabricBranchSummaryDetails: (value: unknown) => FabricBranchSummaryDetails | undefined;
export {};
//# sourceMappingURL=branch-details.d.ts.map