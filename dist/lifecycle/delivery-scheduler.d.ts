import type { FabricLifecycleEvent, FabricLifecycleSubscription } from "./types.js";
export interface PendingLifecycleDelivery {
    subscription: FabricLifecycleSubscription;
    event: FabricLifecycleEvent;
}
export type LifecycleBatchDispatcher = (target: string, batch: PendingLifecycleDelivery[]) => Promise<void>;
export type LifecycleDeliveryErrorHandler = (target: string, batch: PendingLifecycleDelivery[], error: unknown) => void;
export declare const DEFAULT_LIFECYCLE_COALESCE_MS = 2000;
/**
 * Coalesce lifecycle deliveries per target so a burst of run completions
 * wakes the orchestrator once instead of once per event (#85).
 *
 * Each wake turn costs the orchestrator a full agent run; without coalescing,
 * a fan-out of N completed runs serializes into N runs and later events land
 * many minutes after their occurredAt. followUp deliveries for the same
 * target inside the coalescing window are batched into one message; steer
 * deliveries pass through immediately because they interrupt the current
 * run and must not be delayed.
 */
export declare class LifecycleDeliveryScheduler {
    #private;
    readonly deliver: LifecycleBatchDispatcher;
    readonly onError: LifecycleDeliveryErrorHandler;
    constructor(coalesceMs: number, deliver: LifecycleBatchDispatcher, onError?: LifecycleDeliveryErrorHandler);
    schedule(target: string, delivery: PendingLifecycleDelivery): void;
    flush(target: string): Promise<void>;
    flushAll(): Promise<void>;
    dispose(): Promise<void>;
}
//# sourceMappingURL=delivery-scheduler.d.ts.map