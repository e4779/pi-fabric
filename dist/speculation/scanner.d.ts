import type { FabricSpeculationCandidate } from "./types.js";
/**
 * Scans a growing partial TypeScript program for completed calls on the spec
 * namespaces whose arguments are all literals. Reparses the full prefix only
 * when newly appended text contains a ")" — which is the earliest point a call
 * expression can complete — so streaming deltas inside string payloads cost a
 * substring scan, not an AST build.
 */
export declare class LiteralCallScanner {
    #private;
    push(code: string): FabricSpeculationCandidate[];
}
//# sourceMappingURL=scanner.d.ts.map