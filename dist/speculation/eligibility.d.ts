import type { FabricRisk } from "../protocol.js";
export declare const TIER_A_SPECULATION_REFS: ReadonlySet<string>;
export interface SpeculationActionView {
    ref: string;
    provider: string;
    risk: FabricRisk;
    effectKind: string | undefined;
    annotations?: {
        readOnlyHint?: boolean;
        idempotentHint?: boolean;
        destructiveHint?: boolean;
        openWorldHint?: boolean;
    };
}
/** Match `server.tool` / `server.*` allowlist patterns against an MCP ref tail. */
export declare const mcpAllowlistMatch: (refWithoutProvider: string, allowlist: readonly string[]) => boolean;
/**
 * Static per-ref gate used both by the stream tap (cheap) and by
 * ActionRegistry.speculate (authoritative, post-descriptor-resolution).
 */
export declare const isSpeculationEligible: (action: SpeculationActionView, mcpAllowlist: readonly string[]) => boolean;
//# sourceMappingURL=eligibility.d.ts.map