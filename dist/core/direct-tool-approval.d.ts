import type { Usage } from "@earendil-works/pi-ai";
import type { ExtensionAPI, ExtensionContext, ToolCallEvent } from "@earendil-works/pi-coding-agent";
import type { FabricConfig } from "../config.js";
import { FabricSessionApprovals, type FabricAutoApprovalAudit } from "./approval-controller.js";
import { FabricAutoApprovalClassifier, type FabricAutoApprovalDecision } from "./auto-approval-classifier.js";
export declare const mergeFabricApprovalUsage: (existing: Usage | undefined, approval: Usage) => Usage;
export declare class FabricDirectToolApproval {
    #private;
    readonly pi: Pick<ExtensionAPI, "getAllTools">;
    readonly getConfig: () => FabricConfig;
    readonly sessionApprovals: FabricSessionApprovals;
    readonly classifier: FabricAutoApprovalClassifier;
    readonly onAutoDecision?: ((audit: FabricAutoApprovalAudit, decision?: FabricAutoApprovalDecision) => void) | undefined;
    constructor(pi: Pick<ExtensionAPI, "getAllTools">, getConfig: () => FabricConfig, sessionApprovals: FabricSessionApprovals, classifier?: FabricAutoApprovalClassifier, onAutoDecision?: ((audit: FabricAutoApprovalAudit, decision?: FabricAutoApprovalDecision) => void) | undefined);
    approve(event: ToolCallEvent, context: ExtensionContext): Promise<void>;
    takeUsage(toolCallId: string): Usage | undefined;
    clear(): void;
}
//# sourceMappingURL=direct-tool-approval.d.ts.map