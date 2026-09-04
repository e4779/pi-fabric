import type { FabricAgentLog, AgentHandleInfo, AgentRunRecord, AgentRunRequest, AgentRunResult } from "../agents/types.js";
import type { FabricOwnedModelGuidance } from "../components/model-guidance.js";
import type { FabricMainAgentTarget } from "../main-agent.js";
import { MeshStore } from "../mesh/store.js";
import type { FabricParticipantSource } from "../topology/types.js";
import { type ResidentHostConfig, type ResidentHostOwner } from "./protocol.js";
export interface ResidencyClientOptions {
    config: ResidentHostConfig;
    mesh: MeshStore;
    participants: FabricParticipantSource;
    mainAgent: FabricMainAgentTarget;
    hostPath?: string;
}
export declare class ResidencyClient {
    #private;
    readonly options: ResidencyClientOptions;
    readonly hostId: string;
    constructor(options: ResidencyClientOptions);
    start(): void;
    close(): Promise<void>;
    updateModelGuidance(guidance: readonly FabricOwnedModelGuidance[]): void;
    ensureHost(): Promise<ResidentHostOwner>;
    ensureActor(id: string): Promise<void>;
    spawnAgent(request: AgentRunRequest, signal?: AbortSignal): Promise<AgentHandleInfo>;
    hasAgent(id: string): boolean;
    statusAgent(id: string): AgentRunRecord | AgentHandleInfo;
    listAgents(): Array<AgentRunRecord | AgentHandleInfo>;
    waitAgent(id: string, signal?: AbortSignal): Promise<AgentRunResult>;
    readAgentLog(id: string, options?: {
        lines?: number;
        before?: number;
    }): FabricAgentLog;
    removeActor(id: string): Promise<{
        removed: boolean;
    }>;
    cleanupAgent(id: string, deleteBranch?: boolean): Promise<{
        cleaned: boolean;
    }>;
}
//# sourceMappingURL=client.d.ts.map