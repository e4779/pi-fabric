import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { FabricPrewalkMode, FabricResultFormat } from "../config.js";
import { type FabricCallAudit } from "../core/action-registry.js";
import type { CompactRequestIntent } from "../core/compact-controller.js";
import type { FabricExecutionResult } from "../execution-service.js";
import type { FabricInvocationActivityUpdate, FabricInvocationContext } from "../protocol.js";
import type { AgentSessionSeed, AgentToolResultMessage } from "../agents/types.js";
import type { PrewalkController } from "./controller.js";
import type { PrewalkFsDrift } from "./fs-drift.js";
export declare const PREWALK_ARMED_MESSAGE_TYPE = "pi-fabric-prewalk-armed";
export declare const filterPrewalkContinuationMessages: <Message>(messages: Message[], accept: (continuationId: string) => boolean) => {
    messages: Message[];
    changed: boolean;
};
export declare const prewalkArmedPrompt: (mode: FabricPrewalkMode, model: string) => string;
export declare const hasPrewalkArmedPrompt: (entries: ReadonlyArray<unknown>, content: string) => boolean;
export interface BoundaryHandoffRunner {
    executeHandoff(args: Record<string, unknown>, context: FabricInvocationContext, sessionSeed: AgentSessionSeed): Promise<Record<string, unknown>>;
}
export interface PendingFabricHandoff {
    kind: "explicit" | "prewalk-in-place" | "prewalk-trajectory";
    args: Record<string, unknown>;
    audit: FabricCallAudit;
    resultFormat: FabricResultFormat;
    triggerRef?: string;
    triggerSeq?: number;
    triggerFiles?: string[];
    triggerFilesTruncated?: number;
}
export declare const withTrajectoryRearmDirective: (text: string, pending: PendingFabricHandoff, handoff: Record<string, unknown>, controller: PrewalkController, sessionId: string) => string;
export declare const claimFabricHandoff: (controller: PrewalkController, execution: FabricExecutionResult, sessionId: string, resultFormat: FabricResultFormat) => PendingFabricHandoff | undefined;
export declare const claimFabricFsDriftHandoff: (controller: PrewalkController, execution: FabricExecutionResult, sessionId: string, drift: PrewalkFsDrift, resultFormat: FabricResultFormat) => PendingFabricHandoff | undefined;
export interface InPlacePrewalkSettleOptions {
    compactOnReturn?: boolean;
    compact?: {
        request(intent: CompactRequestIntent): unknown;
        maybeCommit(context: ExtensionContext): Promise<void>;
        status?(): {
            pending?: unknown;
        };
    };
}
export declare const settleInPlacePrewalk: (controller: PrewalkController, extension: ExtensionAPI, context: ExtensionContext, options?: InPlacePrewalkSettleOptions) => Promise<boolean>;
export declare const runFabricHandoffAtBoundary: (controller: PrewalkController, runner: BoundaryHandoffRunner, extension: ExtensionAPI, pending: PendingFabricHandoff, outerToolResult: AgentToolResultMessage, context: ExtensionContext, activity?: (update: FabricInvocationActivityUpdate) => void) => Promise<Record<string, unknown>>;
//# sourceMappingURL=handoff.d.ts.map