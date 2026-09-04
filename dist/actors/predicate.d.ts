import type { FabricActorValidityFacts, FabricActorValidWhileSource } from "./types.js";
export declare const validateActorValidWhile: (value: FabricActorValidWhileSource | undefined) => Promise<void>;
export declare const evaluateActorValidWhile: (source: FabricActorValidWhileSource, facts: FabricActorValidityFacts) => Promise<{
    valid: boolean;
    reason?: string;
}>;
//# sourceMappingURL=predicate.d.ts.map