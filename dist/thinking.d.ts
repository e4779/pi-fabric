/**
 * Shared thinking (reasoning effort) level type and helpers.
 *
 * Fabric resolves a thinking level per run (explicit call/actor value, else the
 * Fabric default, "medium"). Pi receives it via "--thinking" and clamps it to
 * the model's supported levels using next-highest fallback (see pi-ai
 * clampThinkingLevel). Claude receives it via "--effort"; off/minimal map to
 * low. Fabric itself only selects the requested/default level.
 */
export type FabricThinking = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
/** Fabric-wide default thinking level, used when a call/actor omits one. */
export declare const DEFAULT_FABRIC_THINKING: FabricThinking;
/** Ordered lowest -> highest; matches pi-ai's EXTENDED_THINKING_LEVELS. */
export declare const THINKING_LEVELS: readonly FabricThinking[];
/** Type guard for a Fabric thinking level value (config, CLI args, JSON). */
export declare const isFabricThinking: (value: unknown) => value is FabricThinking;
/** Human-readable label for a thinking level (shown in pickers and settings). */
export declare const thinkingLabel: (level: FabricThinking) => string;
//# sourceMappingURL=thinking.d.ts.map