import type { FabricAgentRunner } from "../config.js";
import type { MeshEvent, MeshIdentity } from "../mesh/store.js";
import type { FabricParticipantKind } from "../topology/types.js";
export declare const FABRIC_PARTICIPANT_LIFECYCLE_TOPIC = "fabric.participant.lifecycle";
export declare const FABRIC_LIFECYCLE_SUBSCRIPTION_PREFIX = "topology/subscriptions/";
export declare const FABRIC_LIFECYCLE_EVENTS: readonly ["pi.input", "pi.agent_start", "pi.agent_end", "pi.turn_end", "pi.agent_settled", "pi.tool_error", "pi.session_compact", "run.completed", "run.failed", "run.stopped", "run.timed_out", "tokens.usage", "component.state"];
export type FabricLifecycleEventType = (typeof FABRIC_LIFECYCLE_EVENTS)[number];
type FabricLifecycleDelivery = "steer" | "followUp";
export interface FabricLifecycleSource {
    id: string;
    name: string;
    kind: FabricParticipantKind;
    rootId: string;
    runner: FabricAgentRunner;
    ownerHostId?: string;
    ownerIdentityId?: string;
}
export interface FabricLifecyclePublishRequest {
    source: FabricLifecycleSource;
    event: FabricLifecycleEventType;
    occurredAt?: number;
    runId?: string;
    status?: string;
    data?: unknown;
}
export interface FabricLifecycleEvent {
    version: 1;
    id: string;
    sequence: number;
    event: FabricLifecycleEventType;
    source: FabricLifecycleSource;
    occurredAt: number;
    publishedAt: number;
    runId?: string;
    status?: string;
    data?: unknown;
}
/**
 * Attributed token usage for one token-bearing child event.
 *
 * The worker emits one of these per assistant message (Pi) or per usage-bearing
 * assistant/result frame (Claude), tagged with the run/runner/depth identity the
 * manager passes in. Cumulative tokens mirror in + cacheRead + cacheWrite at
 * the moment the event fired; cost is micro-USD from the runner's own report.
 */
export interface FabricTokenUsagePayload {
    runId: string;
    name: string;
    runner: FabricAgentRunner;
    depth: number;
    actorId?: string;
    actorName?: string;
    cumulativeTokens: number;
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    cost: number;
}
export declare const tokenUsagePayloadFromValue: (value: unknown) => FabricTokenUsagePayload | undefined;
export interface FabricLifecycleSubscriptionRequest {
    from: string;
    events: FabricLifecycleEventType[];
    to: string;
    delivery: FabricLifecycleDelivery;
    triggerTurn: boolean;
    once?: boolean;
}
export interface FabricLifecycleSubscription {
    format: 1;
    id: string;
    from: string;
    events: FabricLifecycleEventType[];
    to: string;
    delivery: FabricLifecycleDelivery;
    triggerTurn: boolean;
    once: boolean;
    afterSequence: number;
    createdAt: number;
    updatedAt: number;
    createdBy: MeshIdentity;
    lastDeliveredAt?: number;
    lastEventId?: string;
    lastError?: string;
}
export declare const isFabricLifecycleEventType: (value: unknown) => value is FabricLifecycleEventType;
export declare const lifecycleSourceIdentity: (source: FabricLifecycleSource) => MeshIdentity;
export declare const lifecycleEventFromMesh: (event: MeshEvent) => FabricLifecycleEvent | undefined;
export declare const lifecycleSubscriptionFromValue: (value: unknown) => FabricLifecycleSubscription | undefined;
export {};
//# sourceMappingURL=types.d.ts.map