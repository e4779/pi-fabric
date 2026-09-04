import type { Theme } from "@earendil-works/pi-coding-agent";
import { Container, type Focusable } from "@earendil-works/pi-tui";
import { type ModelSource } from "./model-picker.js";
export interface FabricModelSelectorChoice {
    value: string;
    label: string;
    description: string;
    current: boolean;
}
export interface FabricModelSelectorOptions {
    theme: Theme;
    source: ModelSource;
    /** The currently configured canonical model key or "Inherit". */
    currentValue: string;
    onSelect: (value: string) => void;
    onCancel: () => void;
    /** Header line above the search input. Defaults to the global-default wording. */
    headerText?: string;
    /** Label shown for the unset/default row. Defaults to Inherit. */
    inheritLabel?: string;
    /** Description shown for the unset/default row's footer name. */
    inheritName?: string;
}
/**
 * A /model-style searchable model picker adapted for Fabric: same look
 * (search input, list with `[provider]` badges and a ✓ on
 * the current row, scroll indicator, and a "Model Name:" footer) but it writes
 * the Fabric default-model setting instead of the host's default model, and
 * pins an unset/default row on top. Order respects pi-model-sort (most recently
 * used first); search filters by fuzzy match and re-sorts by recency, matching
 * pi-model-sort's patched /model behavior.
 */
export declare class FabricModelSelector extends Container implements Focusable {
    private readonly theme;
    private readonly allEntries;
    private filteredEntries;
    private readonly lastUsed;
    private readonly currentKey;
    private readonly currentValue;
    private selectedIndex;
    private readonly searchInput;
    private readonly listContainer;
    private readonly onSelectCallback;
    private readonly onCancelCallback;
    private readonly headerText;
    private readonly inheritLabel;
    private readonly inheritName;
    private _focused;
    constructor(options: FabricModelSelectorOptions);
    get focused(): boolean;
    set focused(value: boolean);
    handleInput(keyData: string): void;
    rpcChoices(): FabricModelSelectorChoice[];
    selectRpc(value: string): boolean;
    private handleSelect;
    private buildEntries;
    /** Filter by fuzzy match, then re-sort by recency (mirrors pi-model-sort). */
    private sortEntries;
    private filterModels;
    /** Mirrors getModelSelectorSearchText from pi's /model selector. */
    private searchText;
    private updateList;
}
//# sourceMappingURL=fabric-model-selector.d.ts.map