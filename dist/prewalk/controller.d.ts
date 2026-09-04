import type { FabricPrewalkMode } from "../config.js";
import type { FabricCallAudit } from "../core/action-registry.js";
import { type FabricThinking } from "../thinking.js";
interface FabricPrewalkArm {
    mode: FabricPrewalkMode;
    model: string;
    sessionId: string;
    armedAt: number;
    alwaysRearm: boolean;
    task?: string;
    thinking?: FabricThinking;
}
interface FabricPrewalkContinuation extends FabricPrewalkArm {
    continuationId: string;
    returnModel: string;
    accepted: boolean;
}
export type FabricPrewalkStatus = {
    state: "idle";
} | ({
    state: "armed" | "handing_off";
} & FabricPrewalkArm) | ({
    state: "continuation_pending";
} & FabricPrewalkContinuation);
export interface FabricPrewalkClaim {
    arm: FabricPrewalkArm;
    mutation: FabricCallAudit;
    seq: number;
}
export interface FabricPrewalkSettlement {
    continuationId: string;
    returnModel: string;
    executorModel: string;
}
export declare class PrewalkController {
    #private;
    status(): FabricPrewalkStatus;
    arm(input: {
        model: string;
        mode?: FabricPrewalkMode;
        sessionId: string;
        task?: string;
        alwaysRearm?: boolean;
        thinking?: FabricThinking;
    }): FabricPrewalkStatus;
    observeTask(sessionId: string, task: string): FabricPrewalkStatus;
    isArmed(sessionId?: string): boolean;
    beginContinuation(continuationId: string, returnModel: string): FabricPrewalkStatus;
    acceptContinuation(sessionId: string, continuationId: string): boolean;
    takeContinuationSettlement(sessionId: string): FabricPrewalkSettlement | undefined;
    finishContinuation(sessionId: string, continuationId: string): boolean;
    failHandoff(): FabricPrewalkStatus;
    settleTask(sessionId: string): boolean;
    completeTask(): FabricPrewalkStatus;
    claim(audits: FabricCallAudit[], sessionId: string): FabricPrewalkClaim | undefined;
    claimFsDrift(sessionId: string, files: readonly string[]): FabricPrewalkClaim | undefined;
    cancel(): void;
}
export {};
//# sourceMappingURL=controller.d.ts.map