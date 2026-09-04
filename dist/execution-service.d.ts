import type { Usage } from "@earendil-works/pi-ai";
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import { type FabricExecutionTraceV1 } from "./audit/trace.js";
import { FabricActivityStore } from "./activity/store.js";
import type { CapturedToolCatalog } from "./capture/catalog.js";
import type { FabricRunDisplay } from "./activity/types.js";
import { type FabricConfig } from "./config.js";
import { ActionRegistry, type FabricCallAudit } from "./core/action-registry.js";
import { FabricSessionApprovals } from "./core/approval-controller.js";
import { FabricAutoApprovalClassifier } from "./core/auto-approval-classifier.js";
import type { FabricCommittedCapabilityView } from "./protocol.js";
import type { FabricTypeError } from "./runtime/type-checker.js";
export interface FabricExecutionResult {
    success: boolean;
    value: unknown;
    logs: string[];
    audits: FabricCallAudit[];
    phases: string[];
    trace: FabricExecutionTraceV1;
    elapsedMs: number;
    typeErrors?: FabricTypeError[];
    error?: string;
    handoffRequest?: Record<string, unknown>;
    usage?: Usage;
}
interface FabricExecutionPartial {
    audits: FabricCallAudit[];
    phases: string[];
    progress?: string | undefined;
}
export interface FabricExecutionAuthorizer {
    authorize(ref: string, parentToolCallId: string): Promise<void>;
}
export interface FabricExecutionOptions {
    code: string;
    strings?: Record<string, string>;
    /** Per-invocation whole-program deadline request from fabric_exec.timeoutMs.
     * Raises (never lowers) the configured executor.timeoutMs, subject to
     * executor.maxTimeoutMs. */
    requestedTimeoutMs?: number;
    signal: AbortSignal | undefined;
    parentToolCallId: string;
    context: ExtensionContext;
    tokenBudget?: number;
    maxAgentCalls?: number;
    display?: FabricRunDisplay;
    onPartial(snapshot: FabricExecutionPartial): void;
}
export declare class FabricExecutionService {
    #private;
    readonly registry: ActionRegistry;
    readonly config: FabricConfig;
    readonly activity?: FabricActivityStore | undefined;
    readonly authorizer?: FabricExecutionAuthorizer | undefined;
    readonly autoApprovalClassifier: FabricAutoApprovalClassifier;
    readonly sessionApprovals: FabricSessionApprovals;
    readonly capturedTools?: CapturedToolCatalog | undefined;
    constructor(registry: ActionRegistry, config: FabricConfig, activity?: FabricActivityStore | undefined, authorizer?: FabricExecutionAuthorizer | undefined, autoApprovalClassifier?: FabricAutoApprovalClassifier, sessionApprovals?: FabricSessionApprovals, capturedTools?: CapturedToolCatalog | undefined);
    setCapabilityView(view: FabricCommittedCapabilityView | undefined): void;
    execute(options: FabricExecutionOptions): Promise<FabricExecutionResult>;
}
export {};
//# sourceMappingURL=execution-service.d.ts.map