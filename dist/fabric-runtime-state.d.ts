import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { FabricActivityStore } from "./activity/store.js";
import { ActorManager } from "./actors/manager.js";
import { GlobalActorRegistry } from "./actors/global-registry.js";
import type { FabricActorHostEvent } from "./actors/types.js";
import { CapturedToolCatalog } from "./capture/catalog.js";
import { FabricComponentCatalog } from "./components/catalog.js";
import { FabricComponentLoader } from "./components/loader.js";
import { type FabricOwnedModelGuidance } from "./components/model-guidance.js";
import type { FabricComponentDefinition, FabricComponentGraph } from "./components/types.js";
import { type FabricConfig, type FabricResultFormat, type FabricSchemaMode } from "./config.js";
import { ActionRegistry } from "./core/action-registry.js";
import { FabricSessionApprovals } from "./core/approval-controller.js";
import { CompactController } from "./core/compact-controller.js";
import { FabricExecutionService, type FabricExecutionResult } from "./execution-service.js";
import { RepairCompiler } from "./repairs/compiler.js";
import { FabricSpeculationStreamTap } from "./speculation/stream-tap.js";
import { MeshStore } from "./mesh/store.js";
import type { FabricLifecycleEventType } from "./lifecycle/types.js";
import type { FabricParticipantInfo, FabricParticipantListOptions, FabricPeerInfo } from "./topology/types.js";
import { PrewalkController } from "./prewalk/controller.js";
import { PrewalkDriftTracker } from "./prewalk/fs-drift.js";
import { type PendingFabricHandoff } from "./prewalk/handoff.js";
import type { AgentToolResultMessage } from "./agents/types.js";
import { type FabricAgentMessageDelivery, type FabricAgentMessageResult, type FabricMainAgentInfo } from "./main-agent.js";
import { type FabricProvider } from "./protocol.js";
import { AgentManager } from "./agents/manager.js";
import type { FabricRuntimePaths } from "./runtime-paths.js";
export interface FabricRuntimeStateOptions {
    activity?: FabricActivityStore;
    prewalk?: PrewalkController;
    prewalkDrift?: PrewalkDriftTracker;
    sessionApprovals?: FabricSessionApprovals;
    paths?: FabricRuntimePaths;
}
export declare class FabricRuntimeState {
    #private;
    readonly pi: ExtensionAPI;
    readonly capturedTools: CapturedToolCatalog;
    readonly componentCatalog: FabricComponentCatalog;
    readonly activity: FabricActivityStore;
    readonly prewalk: PrewalkController;
    readonly prewalkDrift: PrewalkDriftTracker;
    readonly sessionApprovals: FabricSessionApprovals;
    constructor(pi: ExtensionAPI, capturedTools: CapturedToolCatalog, options?: FabricRuntimeStateOptions);
    get initialized(): boolean;
    get widgetDismissedAt(): number;
    set widgetDismissedAt(value: number);
    get cwd(): string | undefined;
    get config(): FabricConfig;
    /** Stream tap for speculative PTC; undefined when speculation is disabled. */
    get speculationTap(): FabricSpeculationStreamTap | undefined;
    /** Turn-boundary backstop: tap state and unserved entries never outlive a turn. */
    resetSpeculation(): void;
    get registry(): ActionRegistry;
    get components(): FabricComponentLoader;
    get execution(): FabricExecutionService;
    get agents(): AgentManager;
    get actors(): ActorManager;
    get globalActors(): GlobalActorRegistry;
    get mesh(): MeshStore;
    mainAgentInfo(context?: ExtensionContext): FabricMainAgentInfo;
    peerInfos(): FabricPeerInfo[];
    componentGraph(): FabricComponentGraph;
    modelGuidance(): FabricOwnedModelGuidance[];
    participantInfos(options?: FabricParticipantListOptions): FabricParticipantInfo[];
    queueUserMessage(targetId: string, message: string, delivery: FabricAgentMessageDelivery): Promise<FabricAgentMessageResult>;
    stopParticipant(targetId: string): Promise<unknown>;
    get compact(): CompactController;
    get repairs(): RepairCompiler;
    initialize(context: ExtensionContext, bootstrapConfig?: FabricConfig): Promise<void>;
    ensure(context: ExtensionContext): Promise<void>;
    setSchemaMode(mode: FabricSchemaMode, executorRuntime: FabricConfig["executor"]["runtime"]): void;
    reloadConfig(context: ExtensionContext, next: FabricConfig): void;
    claimHandoff(execution: FabricExecutionResult, sessionId: string, resultFormat: FabricResultFormat, outerToolCallId: string): Promise<PendingFabricHandoff | undefined>;
    runHandoffAtBoundary(pending: PendingFabricHandoff, outerToolResult: AgentToolResultMessage, context: ExtensionContext): Promise<Record<string, unknown>>;
    noteMainActivity(context: ExtensionContext): void;
    dispatchHostEvent(event: FabricActorHostEvent, payload: unknown, context: ExtensionContext): number;
    publishHostLifecycle(event: FabricLifecycleEventType, payload: unknown): Promise<void>;
    registerExternal(provider: FabricProvider, options?: {
        overwrite?: boolean;
    }): void;
    registerExternalComponent(component: FabricComponentDefinition, options?: {
        overwrite?: boolean;
    }): void;
    settleComponents(): Promise<void>;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=fabric-runtime-state.d.ts.map