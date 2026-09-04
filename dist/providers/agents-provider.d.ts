import { ActorManager } from "../actors/manager.js";
import { GlobalActorRegistry } from "../actors/global-registry.js";
import type { FabricActorRunBinding } from "../actors/types.js";
import type { FabricAgentMessageResult, FabricMainAgentTarget } from "../main-agent.js";
import type { MeshIdentity } from "../mesh/store.js";
import { LifecycleBroker } from "../lifecycle/broker.js";
import { type FabricLifecycleEvent, type FabricLifecycleSubscription } from "../lifecycle/types.js";
import { FabricControlPlane, type FabricControlCommand, type FabricControlAcceptance } from "../topology/control-plane.js";
import type { FabricParticipantSource } from "../topology/types.js";
import type { FabricActionDescriptor, FabricInvocationContext, FabricProvider, FabricProviderListRequest } from "../protocol.js";
import { AgentManager } from "../agents/manager.js";
import type { AgentRunRecord, AgentSessionSeed } from "../agents/types.js";
import { type FabricModelsConfig } from "../config.js";
import { ResidencyClient } from "../residency/client.js";
import { type FabricAgentToolPreviewNode, type FabricTranscriptEntry } from "../ui/transcript.js";
export interface AgentToolPreviewTreeOptions {
    tools: (record: AgentRunRecord) => FabricTranscriptEntry[];
    maxDepth?: number;
    maxNodes?: number;
}
export declare const collectAgentToolPreviewNodes: (records: readonly AgentRunRecord[], options: AgentToolPreviewTreeOptions, depth?: number, budget?: {
    remaining: number;
}) => FabricAgentToolPreviewNode[];
export declare const normalizeAgentsArgs: import("./arg-normalization.js").ActionArgNormalizer;
export declare class AgentsProvider implements FabricProvider {
    #private;
    readonly manager: AgentManager;
    readonly actorManager: ActorManager;
    readonly globalActors: GlobalActorRegistry;
    readonly mainAgent: FabricMainAgentTarget;
    readonly participants: FabricParticipantSource;
    readonly control: FabricControlPlane | undefined;
    readonly lifecycle: LifecycleBroker;
    readonly agentToolPreviewEnabled: () => boolean;
    readonly residency?: ResidencyClient | undefined;
    readonly ownsRuntime: boolean;
    readonly modelsConfig: () => FabricModelsConfig;
    readonly name = "agents";
    readonly description = "The user-facing Main target, one-shot Pi or Claude Code agents, and persistent mailbox actors over process, tmux, screen, LocalTerm, or Herdr";
    constructor(manager: AgentManager, actorManager: ActorManager, globalActors: GlobalActorRegistry, mainAgent: FabricMainAgentTarget, participants: FabricParticipantSource, control: FabricControlPlane | undefined, lifecycle: LifecycleBroker, agentToolPreviewEnabled?: () => boolean, residency?: ResidencyClient | undefined, ownsRuntime?: boolean, modelsConfig?: () => FabricModelsConfig);
    list(request: FabricProviderListRequest, _context: FabricInvocationContext): Promise<FabricActionDescriptor[]>;
    describe(actionName: string, _context: FabricInvocationContext): Promise<FabricActionDescriptor | undefined>;
    prepareArguments(actionName: string, args: Record<string, unknown>): Record<string, unknown>;
    handoff(args: Record<string, unknown>, context: FabricInvocationContext): Promise<Record<string, unknown>>;
    executeHandoff(args: Record<string, unknown>, context: FabricInvocationContext, sessionSeed: AgentSessionSeed): Promise<Record<string, unknown>>;
    invoke(actionName: string, args: Record<string, unknown>, context: FabricInvocationContext): Promise<unknown>;
    routeMessage(id: string, message: string, data: unknown, kind: "steer" | "followUp", context?: FabricInvocationContext, options?: {
        from?: MeshIdentity;
        triggerTurn?: boolean;
        binding?: FabricActorRunBinding;
    }): Promise<FabricAgentMessageResult>;
    /** Flush pending coalesced lifecycle deliveries; used by tests and shutdown. */
    flushLifecycleDeliveries(): Promise<void>;
    deliverLifecycle(subscription: FabricLifecycleSubscription, event: FabricLifecycleEvent): Promise<void>;
    acceptControl(command: FabricControlCommand, from: MeshIdentity, signal?: AbortSignal): Promise<FabricControlAcceptance>;
    stopParticipant(id: string): Promise<unknown>;
    close(): Promise<void>;
}
//# sourceMappingURL=agents-provider.d.ts.map