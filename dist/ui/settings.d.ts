import type { ExtensionContext, Theme } from "@earendil-works/pi-coding-agent";
import { Container, SettingsList, type SettingItem } from "@earendil-works/pi-tui";
import { buildClaudeModelSource, type ModelSource } from "./model-picker.js";
import { type FabricConfig, type FabricConfigScope } from "../config.js";
import type { CapturedToolCatalog } from "../capture/catalog.js";
import type { FabricState } from "../fabric-state.js";
export declare const executorMemoryLimitOptions: (maximumBytes?: number) => number[];
export type CompactionThresholdSelection = {
    mode: "default";
} | {
    mode: "percent";
    value: number;
} | {
    mode: "tokens";
    value: number;
};
export declare const compactionThresholdPartial: (modelKey: string, selection: CompactionThresholdSelection) => Record<string, unknown>;
export declare const parseBudgetValue: (value: string) => number;
export declare const parseFormattedNumericValue: (value: string) => number;
export interface FabricSettingsComponentOptions {
    initialSaveScope?: FabricConfigScope;
    projectScopeAvailable?: boolean;
    onSaveScopeChange?: (scope: FabricConfigScope) => void;
    itemsForSaveScope?: (scope: FabricConfigScope) => SettingItem[];
}
export declare class FabricSettingsComponent extends Container {
    settingsList: SettingsList;
    private readonly theme;
    private readonly saveScopeText;
    private readonly settingsListContainer;
    private readonly projectScopeAvailable;
    private readonly onChange;
    private readonly onCancel;
    private readonly onSaveScopeChange;
    private readonly itemsForSaveScope;
    private saveScope;
    constructor(theme: Theme, items: SettingItem[], onChange: (id: string, newValue: string) => void, onCancel: () => void, options?: FabricSettingsComponentOptions);
    handleInput(data: string): void;
    private createSettingsList;
    private updateSaveScopeText;
}
export declare const populateClaudeModelSource: (source: ModelSource, load: () => Promise<Parameters<typeof buildClaudeModelSource>[0]>) => Promise<void>;
export declare const buildFabricSettingsItems: (theme: Theme, config: FabricConfig, apply: (id: string, value: unknown) => void, options: {
    keepVisibleCandidates: readonly string[];
    modelSource: ModelSource;
    claudeModelSource?: ModelSource;
    activeModelKey?: string;
}) => SettingItem[];
export interface FabricSettingsDeps {
    state: FabricState;
    applyFabricMode: () => void;
    capturedTools: CapturedToolCatalog;
    onConfigApplied?: (id: string) => void;
}
export declare function openFabricSettings(context: ExtensionContext, deps: FabricSettingsDeps): Promise<void>;
//# sourceMappingURL=settings.d.ts.map