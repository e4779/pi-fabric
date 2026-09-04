import type { FabricInvocationActivityUpdate } from "../protocol.js";
import type { FabricActivityEventInput, FabricActivityItem, FabricActivityItemInput, FabricActivityPhase, FabricActivityRun, FabricPhaseInput, FabricRunDisplay } from "./types.js";
export declare class FabricActivityStore {
    #private;
    revision(): number;
    subscribe(listener: () => void): () => void;
    reset(): void;
    start(id: string, display?: FabricRunDisplay, nameHint?: string): FabricActivityRun;
    resume(runId: string): void;
    configure(runId: string, display: FabricRunDisplay): FabricActivityRun;
    phase(runId: string, input: FabricPhaseInput): FabricActivityPhase;
    upsertItem(runId: string, input: FabricActivityItemInput): FabricActivityItem;
    event(runId: string, input: FabricActivityEventInput): void;
    beginCall(runId: string, input: {
        callId: string;
        ref: string;
        args: Record<string, unknown>;
    }): void;
    updateCallArgs(runId: string, callId: string, args: Record<string, unknown>): void;
    updateCall(runId: string, callId: string, update: FabricInvocationActivityUpdate): void;
    finishCall(runId: string, callId: string, input: {
        success: boolean;
        result?: unknown;
        preview?: unknown;
        error?: string;
    }): void;
    finish(runId: string, success: boolean, error?: string): void;
    runs(): FabricActivityRun[];
    runSummaries(): FabricActivityRun[];
    get(id: string): FabricActivityRun | undefined;
}
//# sourceMappingURL=store.d.ts.map