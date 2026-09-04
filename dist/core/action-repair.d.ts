interface ActionNameRepair {
    /** Canonical declared action name when exactly one candidate fits. */
    repaired?: string;
    /** Ranked declared candidates for the didactic failure message. */
    suggestions: string[];
}
/**
 * Repair a spilled action name against the provider's declared names.
 * Returns the canonical name when exactly one declared candidate fits, or
 * ranked suggestions for the didactic failure message.
 */
export declare const repairActionName: (declared: readonly string[], actionName: string) => ActionNameRepair;
/**
 * The didactic unknown-action failure message. The original
 * "Unknown Fabric action: <ref>" prefix is preserved verbatim; declared
 * candidates are appended only when repair found close misses.
 */
export declare const formatUnknownActionMessage: (ref: string, suggestions: readonly string[]) => string;
export {};
//# sourceMappingURL=action-repair.d.ts.map