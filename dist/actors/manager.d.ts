import type { ImageContent } from "@earendil-works/pi-ai";
import type { FabricCapabilityRequirement } from "../components/types.js";
import type { FabricCapabilityViewLease } from "../core/action-registry.js";
import { type FabricMeshConfig, type FabricRetentionConfig } from "../config.js";
import { MeshStore, type MeshIdentity } from "../mesh/store.js";
import type { FabricMainAgentTarget } from "../main-agent.js";
import type { FabricParticipantResidency } from "../topology/types.js";
import { AgentManager } from "../agents/manager.js";
import type { FabricActorBindingScope, FabricActorDelivery, FabricActorDeliveryRequest, FabricActorHostEvent, FabricActorInfo, FabricActorLog, FabricActorMessage, FabricActorRequest, FabricActorRunBinding } from "./types.js";
export interface ActorMessageBindingOptions {
    /** Per-call values layered over this session binding. */
    overrides?: FabricActorRunBinding;
    /** Already-resolved caller view received through the owner control plane. */
    binding?: FabricActorRunBinding;
}
export declare class ActorManager {
    #private;
    readonly sessionId: string;
    readonly identity: MeshIdentity;
    readonly mesh: MeshStore;
    readonly meshConfig: FabricMeshConfig;
    readonly agents: AgentManager;
    readonly onDeliver: (request: FabricActorDeliveryRequest) => void;
    constructor(sessionId: string, identity: MeshIdentity, mesh: MeshStore, meshConfig: FabricMeshConfig, agents: AgentManager, onDeliver: (request: FabricActorDeliveryRequest) => void, options?: {
        actorRoot?: string;
        persistent?: boolean;
        mainAgent?: FabricMainAgentTarget;
        canManageActor?: (id: string) => boolean | undefined;
        lineageAlive?: (rootId: string) => boolean;
        adoptionGraceMs?: number;
        claimResidency?: FabricParticipantResidency;
        rootId?: string;
        meshCursorPath?: string;
        retention?: FabricRetentionConfig;
        acquireCapabilityView?(requirements: readonly FabricCapabilityRequirement[], signal: AbortSignal): Promise<FabricCapabilityViewLease>;
    });
    subscribe(listener: () => void): () => void;
    retryCapabilityWaiters(): void;
    /**
     * Create an actor. The asRegistryOwner option is reserved for the resident
     * host control channel (residency file protocol): that host already IS the
     * authoritative registry owner, so the foreign-live-actor guard - which
     * protects against concurrent local starters - must not veto creates that
     * arrive over that channel (e.g. while a ceded-but-not-yet-adopted durable
     * still carries its creating root lineage).
     */
    create(request: FabricActorRequest, { asRegistryOwner }?: {
        asRegistryOwner?: boolean;
    }): Promise<FabricActorInfo>;
    list(): FabricActorInfo[];
    listOwned(): FabricActorInfo[];
    cede(id: string): Promise<FabricActorInfo>;
    reclaim(id: string): FabricActorInfo;
    status(id: string): FabricActorInfo;
    owns(id: string): boolean;
    /** Resolve the immutable model/thinking view that a direct activation will pin. */
    resolveBinding(id: string, overrides?: FabricActorRunBinding): FabricActorRunBinding;
    /**
     * Change an actor model binding. Session scope is the default and is writable
     * by passive project sessions because it never mutates the shared definition.
     * Project scope changes the shared default and therefore remains owner-gated.
     */
    setModel(id: string, model: string | undefined, scope?: FabricActorBindingScope): Promise<FabricActorInfo>;
    /**
     * Change an actor reasoning-effort binding. Like model bindings, session
     * scope overlays the shared project default and project scope is owner-gated.
     */
    setThinking(id: string, thinking: string | undefined, scope?: FabricActorBindingScope): Promise<FabricActorInfo>;
    /**
     * Replace an existing actor's tool allowlist. The new list takes effect on
     * the next queued message; an in-flight run keeps its launch-time tools. An
     * empty list leaves a Pi actor with only its host-required fabric_exec tool
     * and a Claude actor with no tools — unless the Pi actor was created with
     * `extensions: false`, in which case an empty list leaves it with no tools.
     */
    setTools(id: string, tools: string[]): Promise<FabricActorInfo>;
    /**
     * Replace an existing actor's host-event subscriptions. Already-queued work
     * for a removed event still runs, but future dispatches respect the new set.
     * Pass an empty array to pause host-event reactivity while keeping the actor
     * alive and reachable by direct messages and mesh topics.
     */
    setEvents(id: string, events: FabricActorHostEvent[]): Promise<FabricActorInfo>;
    /**
     * Replace an actor's host delivery policy. Active delivery modes require an
     * explicit trigger choice; mailbox and nextTurn reject triggerTurn=true.
     */
    setDeliveryPolicy(id: string, delivery: FabricActorDelivery, triggerTurn: boolean): Promise<FabricActorInfo>;
    /**
     * Clear an actor's recorded inbox/outbox history. The actor keeps running;
     * only its bounded message log is reset — useful to declutter a long mailbox
     * from the dashboard without stopping the actor.
     */
    clearMessages(id: string): Promise<FabricActorInfo>;
    /**
     * Replace an existing actor's default instruction (its persona / system-prompt
     * body). Takes effect on the actor's next queued message: #runRequest builds
     * the system prompt from actor.instructions at run start, so an in-flight run
     * keeps the instructions it was launched with. Lets a steering user refine an
     * actor's role from the dashboard without recreating it.
     */
    setInstructions(id: string, instructions: string): Promise<FabricActorInfo>;
    tell(id: string, message: string, data?: unknown, bindingOptions?: ActorMessageBindingOptions): {
        queued: true;
        messageId: string;
    };
    /**
     * Legacy unacknowledged relay retained for compatibility when no participant
     * control plane is available. New routing resolves ownerHostId and uses
     * fabric.control.command/fabric.control.ack instead.
     */
    steerRemote(targetId: string, message: string, kind: "steer" | "followUp", data?: unknown): Promise<{
        queued: true;
        messageId: string;
        routed: "mesh";
    }>;
    ask(id: string, message: string, data?: unknown, signal?: AbortSignal, bindingOptions?: ActorMessageBindingOptions): Promise<FabricActorMessage>;
    messages(id: string, limit?: number): FabricActorMessage[];
    /**
     * Read an actor's default instruction (its persona / system-prompt body).
     * Used by the dashboard to prefill the instructions editor; deliberately not
     * part of the mesh-presence FabricActorInfo to keep the persona text off the
     * shared mesh state.
     */
    instructions(id: string): string;
    /**
     * Read an actor's portable definition — the fields that cross the
     * global⇄project boundary (name, instructions, subscriptions, run settings).
     * Excludes all history (messages, session transcript, run logs) so export
     * can save a project actor to the global registry with a clean slate.
     */
    definition(id: string): FabricActorRequest;
    readLog(id: string, opts?: {
        type?: "session" | "run" | "all";
        lines?: number;
        runId?: string;
        before?: number;
    }): FabricActorLog;
    noteMainActivity(idle?: boolean): void;
    observeHostEvent(event: FabricActorHostEvent, idle?: boolean): boolean;
    dispatchHostEvent(event: FabricActorHostEvent, payload: unknown, images?: readonly ImageContent[]): number;
    dispatchObservedHostEvent(event: FabricActorHostEvent, payload: unknown, images?: readonly ImageContent[]): number;
    stop(id: string): Promise<FabricActorInfo>;
    /**
     * Whether the stop-the-world gate is currently armed. haltAll() arms it
     * (ESC stop-the-world) and the "input" host event lifts it when the user
     * resumes with a new message. Read-only view of the private gate so the
     * ESC handler can treat a repeated lone Esc while already halted as a
     * no-op rather than re-arming and re-notifying.
     */
    get halted(): boolean;
    /**
     * Interrupt every non-stopped actor: abort its in-flight run (if any) and
     * reject every queued message so subsequent execution is cancelled. Unlike
     * stop(), actors stay alive and idle — they keep their identity, session,
     * and subscriptions, and resume responding to future events. Returns the
     * number of actors that had work to cancel. Also arms a short cooldown that
     * suppresses host-event dispatch so the interrupt's own turn_end /
     * agent_settled events do not immediately re-enqueue the actors.
     */
    haltAll(): {
        halted: number;
    };
    remove(id: string): Promise<{
        removed: boolean;
    }>;
    close(): Promise<void>;
    validateDirectMessage(message: string, data: unknown): void;
}
//# sourceMappingURL=manager.d.ts.map