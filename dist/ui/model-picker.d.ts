export type ModelLike = {
    provider: string;
    id: string;
    name?: string;
};
export type ClaudeModelLike = {
    value: string;
    displayName?: string;
    resolvedModel?: string;
};
/** Structural shape buildModelSource needs; the real ModelRegistry satisfies this. */
type ModelRegistryLike = {
    getAvailable(): ModelLike[];
};
/** Value used for the "no override" picker entry. Stored as "" on disk. */
export declare const INHERIT_VALUE = "Inherit";
/** A model list plus pi-model-sort's last-used timestamps, ready for the picker. */
export interface ModelSource {
    models: ModelLike[];
    lastUsed: Record<string, number>;
}
/**
 * Read pi-model-sort's last-used timestamps from
 * <agentDir>/extensions/pi-model-sort.json (best-effort). Returns {} when the
 * agent dir is unknown or the file is absent/unreadable so the picker degrades
 * to alphabetical order.
 *
 * The agent dir is injected by the caller because this module loads through a
 * native dynamic import (lazy dashboard) that cannot resolve pi's
 * extension-loader alias for "@earendil-works/pi-coding-agent" (#13).
 */
export declare function readModelSortLastUsed(agentDir?: string): Record<string, number>;
/**
 * Sort models the way pi-model-sort reorders the /model picker: current model
 * first, then most recently used (descending), then provider/id alphabetical.
 * Mirrors sortByLastUsed from pi-model-sort/src/index.ts so this picker matches
 * the order users see in /model.
 */
export declare function sortByLastUsed<T extends ModelLike>(items: T[], lastUsed: Record<string, number>, currentModelKey: string | null): T[];
/** Build a ModelSource from the registry, degrading to an empty list on failure. */
export declare function buildModelSource(registry: ModelRegistryLike, agentDir?: string): ModelSource;
export declare function buildClaudeModelSource(models: readonly ClaudeModelLike[]): ModelSource;
/** Build the canonical `provider/id` key used on disk and by `pi --model`. */
export declare const modelKey: (provider: string, id: string) => string;
export {};
//# sourceMappingURL=model-picker.d.ts.map