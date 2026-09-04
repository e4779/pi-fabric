import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { MeshIdentity } from "./mesh/store.js";
export type FabricAgentMessageDelivery = "steer" | "followUp";
export interface FabricMainAgentInfo {
    id: string;
    name: "Main";
    kind: "main";
    status: "idle" | "running" | "remote";
    runner: "pi";
    transport: "host";
    cwd?: string;
    sessionId?: string;
    model?: string;
    thinking?: string;
    startedAt?: number;
    updatedAt: number;
    pendingMessages: boolean;
    local: boolean;
}
export interface FabricMainAgentDeliveryRequest {
    from: MeshIdentity;
    message: string;
    delivery: FabricAgentMessageDelivery;
    triggerTurn?: boolean;
    data?: unknown;
}
export interface FabricAgentMessageResult {
    queued: true;
    messageId: string;
    routed: "local" | "main" | "mesh";
    acknowledged?: boolean;
}
export interface FabricMainModelSwitchResult {
    ok: boolean;
    error?: string;
}
export interface FabricMainAgentTarget {
    readonly id: string;
    readonly local: boolean;
    matches(id: string): boolean;
    info(context?: ExtensionContext): FabricMainAgentInfo;
    deliverAgent(request: FabricMainAgentDeliveryRequest): FabricAgentMessageResult;
    switchModel?(target: {
        provider: string;
        id: string;
    }, context: ExtensionContext): Promise<FabricMainModelSwitchResult>;
}
export interface FabricIdentityResolution {
    identity: MeshIdentity;
    mainAgentId: string;
}
export declare const resolveFabricIdentity: (sessionId: string, environment?: NodeJS.ProcessEnv) => FabricIdentityResolution;
export declare class MainAgentController implements FabricMainAgentTarget {
    readonly pi: ExtensionAPI;
    readonly id: string;
    readonly local: boolean;
    readonly cwd: string;
    readonly sessionId?: string | undefined;
    readonly startedAt: number;
    constructor(pi: ExtensionAPI, id: string, local: boolean, cwd: string, sessionId?: string | undefined);
    matches(id: string): boolean;
    info(context?: ExtensionContext): FabricMainAgentInfo;
    switchModel(target: {
        provider: string;
        id: string;
    }, context: ExtensionContext): Promise<FabricMainModelSwitchResult>;
    deliverUser(message: string, delivery: FabricAgentMessageDelivery): FabricAgentMessageResult;
    deliverAgent(request: FabricMainAgentDeliveryRequest): FabricAgentMessageResult;
}
//# sourceMappingURL=main-agent.d.ts.map