import type { FabricModelUsage } from "./model-resolution.js";
/**
 * Load model last-used timestamps (`provider/id` → Unix ms) recorded by the
 * pi-model-sort extension. Missing or malformed data degrades to an empty map,
 * in which case resolution simply falls back to its no-recency tie-break.
 */
export declare const loadModelUsage: (agentDir?: string) => FabricModelUsage;
//# sourceMappingURL=model-usage.d.ts.map