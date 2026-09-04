import { MeshStore, type MeshIdentity } from "../mesh/store.js";
import type { FabricParticipantSource } from "../topology/types.js";
import { type FabricLifecycleEvent, type FabricLifecyclePublishRequest, type FabricLifecycleSubscription, type FabricLifecycleSubscriptionRequest } from "./types.js";
export interface LifecycleBrokerOptions {
    enabled: boolean;
    pollMs: number;
    maxReadEvents: number;
}
export type FabricLifecycleDeliveryHandler = (subscription: FabricLifecycleSubscription, event: FabricLifecycleEvent) => Promise<void> | void;
export declare class LifecycleBroker {
    #private;
    readonly mesh: MeshStore;
    readonly identity: MeshIdentity;
    readonly participants: FabricParticipantSource;
    readonly options: LifecycleBrokerOptions;
    readonly deliver: FabricLifecycleDeliveryHandler;
    constructor(mesh: MeshStore, identity: MeshIdentity, participants: FabricParticipantSource, options: LifecycleBrokerOptions, deliver: FabricLifecycleDeliveryHandler);
    start(): void;
    publish(request: FabricLifecyclePublishRequest): Promise<FabricLifecycleEvent | undefined>;
    subscribe(request: FabricLifecycleSubscriptionRequest): Promise<FabricLifecycleSubscription>;
    list(input?: {
        from?: string;
        to?: string;
    }): FabricLifecycleSubscription[];
    unsubscribe(id: string): Promise<{
        removed: boolean;
    }>;
    close(): Promise<void>;
}
//# sourceMappingURL=broker.d.ts.map