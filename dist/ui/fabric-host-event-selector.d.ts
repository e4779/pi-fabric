import type { Theme } from "@earendil-works/pi-coding-agent";
import { Container, type Focusable } from "@earendil-works/pi-tui";
import type { FabricActorHostEvent } from "../actors/types.js";
export interface FabricHostEventSelectorOptions {
    theme: Theme;
    /** Currently enabled host events for the actor. */
    currentValue: FabricActorHostEvent[];
    onSelect: (events: FabricActorHostEvent[]) => void;
    onCancel: () => void;
    headerText?: string;
}
/**
 * A compact multi-select picker for an actor's host-event subscriptions. The
 * supported host events are shown with a [x]/[ ] checkbox; space toggles the
 * row under the cursor, Enter applies the selection, and Esc cancels.
 */
export declare class FabricHostEventSelector extends Container implements Focusable {
    private readonly theme;
    private readonly onSelectCallback;
    private readonly onCancelCallback;
    private readonly listContainer;
    private enabled;
    private selectedIndex;
    focused: boolean;
    constructor(options: FabricHostEventSelectorOptions);
    handleInput(keyData: string): void;
    private updateList;
}
//# sourceMappingURL=fabric-host-event-selector.d.ts.map