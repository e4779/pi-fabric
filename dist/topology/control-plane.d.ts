import type { FabricActorRunBinding } from "../actors/types.js";
import { MeshStore, type MeshIdentity } from "../mesh/store.js";
export type FabricControlOperation = "steer" | "followUp" | "stop" | "ask" | "cancel";
export interface FabricControlCommand {
    version: 1;
    commandId: string;
    targetId: string;
    operation: FabricControlOperation;
    replyTo: string;
    message?: string;
    data?: unknown;
    triggerTurn?: boolean;
    binding?: FabricActorRunBinding;
    cancelCommandId?: string;
    requestedAt: number;
    deadlineAt?: number;
}
export interface FabricControlAcceptance {
    accepted: boolean;
    messageId?: string;
    result?: unknown;
    error?: string;
}
export interface FabricControlResult {
    queued: true;
    messageId: string;
    routed: "mesh";
    acknowledged: true;
}
export type FabricControlHandler = (command: FabricControlCommand, from: MeshIdentity, signal: AbortSignal) => Promise<FabricControlAcceptance> | FabricControlAcceptance;
export interface FabricControlPlaneOptions {
    enabled: boolean;
    hostId: string;
    pollMs?: number;
    acknowledgementTimeoutMs?: number;
}
export interface FabricControlInput {
    message?: string;
    data?: unknown;
    triggerTurn?: boolean;
    binding?: FabricActorRunBinding;
}
export interface FabricControlRequestOptions {
    timeoutMs?: number;
    signal?: AbortSignal;
}
export declare class FabricControlPlane {
    #private;
    readonly mesh: MeshStore;
    readonly identity: MeshIdentity;
    readonly options: FabricControlPlaneOptions;
    constructor(mesh: MeshStore, identity: MeshIdentity, options: FabricControlPlaneOptions);
    start(handler: FabricControlHandler): void;
    request(ownerHostId: string, targetId: string, operation: FabricControlOperation, input?: FabricControlInput, ownerIdentityId?: string): Promise<FabricControlResult>;
    requestResult<T>(ownerHostId: string, targetId: string, operation: FabricControlOperation, input?: FabricControlInput, ownerIdentityId?: string, options?: FabricControlRequestOptions): Promise<T>;
    close(): Promise<void>;
}
//# sourceMappingURL=control-plane.d.ts.map