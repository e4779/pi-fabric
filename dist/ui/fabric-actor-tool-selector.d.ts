import type { Theme } from "@earendil-works/pi-coding-agent";
import { Container, type Focusable } from "@earendil-works/pi-tui";
export interface FabricActorToolSelectorOptions {
    theme: Theme;
    currentValue: string[];
    onSelect: (tools: string[]) => void;
    onCancel: () => void;
    headerText?: string;
}
export declare class FabricActorToolSelector extends Container implements Focusable {
    private readonly theme;
    private readonly onSelectCallback;
    private readonly onCancelCallback;
    private readonly listContainer;
    private enabled;
    private selectedIndex;
    focused: boolean;
    constructor(options: FabricActorToolSelectorOptions);
    handleInput(keyData: string): void;
    private updateList;
}
//# sourceMappingURL=fabric-actor-tool-selector.d.ts.map