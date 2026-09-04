import type { Theme } from "@earendil-works/pi-coding-agent";
import { Container, type Focusable } from "@earendil-works/pi-tui";
import type { FabricActorDeliveryPolicy } from "../actors/delivery-policy.js";
export interface FabricActorDeliverySelectorOptions {
    theme: Theme;
    currentValue: FabricActorDeliveryPolicy;
    onSelect: (policy: FabricActorDeliveryPolicy) => void;
    onCancel: () => void;
    headerText?: string;
}
export declare class FabricActorDeliverySelector extends Container implements Focusable {
    private readonly selectList;
    focused: boolean;
    constructor(options: FabricActorDeliverySelectorOptions);
    handleInput(data: string): void;
}
//# sourceMappingURL=fabric-actor-delivery-selector.d.ts.map