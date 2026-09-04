import type { Usage } from "@earendil-works/pi-ai/compat";
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { ResolvedFabricAction } from "./action-registry.js";
export interface FabricAutoApprovalDecision {
    decision: "allow" | "escalate";
    reason: string;
    model: string;
    usage: Usage;
}
export declare class FabricAutoApprovalClassifier {
    classify(action: ResolvedFabricAction, args: Record<string, unknown>, context: ExtensionContext, modelKey?: string): Promise<FabricAutoApprovalDecision>;
}
//# sourceMappingURL=auto-approval-classifier.d.ts.map