import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { FabricApprovalConfig } from "../config.js";
import type { FabricRisk } from "../protocol.js";
import type { ResolvedFabricAction } from "./action-registry.js";
import { FabricAutoApprovalClassifier, type FabricAutoApprovalDecision } from "./auto-approval-classifier.js";
export declare class FabricSessionApprovals {
    #private;
    readonly approvedRisks: Set<FabricRisk>;
    serialize<T>(request: () => Promise<T>): Promise<T>;
}
export interface FabricAutoApprovalAudit {
    action: string;
    risk: FabricRisk;
    decision: "allow" | "escalate";
    reason: string;
    model?: string;
    error?: string;
    at: number;
}
export declare class ApprovalController {
    #private;
    readonly config: FabricApprovalConfig;
    readonly context: ExtensionContext;
    readonly sessionApprovals: FabricSessionApprovals;
    readonly classifier: FabricAutoApprovalClassifier;
    readonly onAutoDecision?: ((audit: FabricAutoApprovalAudit, decision?: FabricAutoApprovalDecision) => void) | undefined;
    constructor(config: FabricApprovalConfig, context: ExtensionContext, sessionApprovals?: FabricSessionApprovals, classifier?: FabricAutoApprovalClassifier, onAutoDecision?: ((audit: FabricAutoApprovalAudit, decision?: FabricAutoApprovalDecision) => void) | undefined);
    approve(action: ResolvedFabricAction, args?: Record<string, unknown>): Promise<void>;
}
//# sourceMappingURL=approval-controller.d.ts.map