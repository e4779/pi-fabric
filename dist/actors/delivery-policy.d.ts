import type { FabricActorDelivery } from "./types.js";
export interface FabricActorDeliveryPolicy {
    delivery: FabricActorDelivery;
    triggerTurn: boolean;
}
export declare const resolveActorDeliveryPolicy: (delivery: FabricActorDelivery | undefined, triggerTurn: boolean | undefined) => FabricActorDeliveryPolicy;
export declare const actorDeliveryNotice: (delivery: Exclude<FabricActorDelivery, "mailbox">, triggerTurn: boolean) => string | undefined;
//# sourceMappingURL=delivery-policy.d.ts.map