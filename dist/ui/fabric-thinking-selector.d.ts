import type { Theme } from "@earendil-works/pi-coding-agent";
import { Container, type Focusable } from "@earendil-works/pi-tui";
export interface FabricThinkingSelectorOptions {
    theme: Theme;
    /** The actor's current thinking level, or INHERIT_VALUE for "use the Fabric default". */
    currentValue: string;
    onSelect: (value: string) => void;
    onCancel: () => void;
    headerText?: string;
    inheritName?: string;
}
/**
 * A compact picker for an actor's thinking (reasoning effort) level. Pins an
 * "Inherit" row on top (use the Fabric default) followed by the seven pi
 * thinking levels in order. The current value is marked with a trailing check.
 * Mirrors the look of FabricModelSelector but uses pi-tui's SelectList since
 * the level set is small and fixed (no fuzzy search needed).
 */
export declare class FabricThinkingSelector extends Container implements Focusable {
    private readonly selectList;
    private readonly onSelectCallback;
    focused: boolean;
    constructor(options: FabricThinkingSelectorOptions);
    handleInput(data: string): void;
}
//# sourceMappingURL=fabric-thinking-selector.d.ts.map