/** Minimal model view needed for resolution; satisfied by pi Model entries. */
export interface FabricModelCandidate {
    provider: string;
    id: string;
    name?: string;
}
export type FabricModelResolution = {
    kind: "resolved";
    model: FabricModelCandidate;
    via?: string;
} | {
    kind: "already-active";
    model: FabricModelCandidate;
} | {
    kind: "ambiguous";
    query: string;
    candidates: FabricModelCandidate[];
} | {
    kind: "not-found";
    query: string;
    tried?: string[];
};
/** Markers reported in `via` when an inexact selector is fuzzy-resolved. */
export declare const FUZZY_RESOLUTION_MARKERS: readonly ["closest", "recent", "latest"];
/**
 * Normalize raw `models.aliases` config into alias name → ordered targets.
 * String targets degrade to one-element fallback chains. Entries whose name,
 * target list, or any `provider/model` target string is malformed are
 * dropped entirely, matching the lenient fallback style of the other config
 * normalizers (no partial alias survives with a silently missing target).
 */
export declare const normalizeModelAliases: (input: unknown) => Record<string, string[]>;
export type FabricModelUsage = Record<string, number>;
/**
 * Resolve a model selector against aliases and the available (authenticated)
 * registry. Order: alias lookup first so a configured name always wins, then
 * exact provider/id, exact id, then fuzzy selection. A lone partial match is
 * returned directly; broader candidate pools are ranked by closeness, with
 * equal-closeness ties falling to the most recently used model (when usage
 * timestamps are supplied, e.g. from pi-model-sort) and then to the
 * highest-sorting key, mirroring pi's newest-alias convention. Only a pool
 * with no resemblance at all stays not-found; `ambiguous` is retained for
 * defensive completeness but the ranker always produces a deterministic pick.
 */
export declare const resolveFabricModel: (query: string, options: {
    aliases: Record<string, string[]>;
    available: readonly FabricModelCandidate[];
    current?: FabricModelCandidate;
    provider?: string;
    lastUsed?: FabricModelUsage;
}) => FabricModelResolution;
//# sourceMappingURL=model-resolution.d.ts.map