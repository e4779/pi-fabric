import type { FabricTraceJsonValue } from "./trace.js";
export interface FabricAuditProjection {
    value: {
        [key: string]: FabricTraceJsonValue;
    };
    droppedValues: number;
}
/**
 * Projects invocation arguments by exact built-in reference. Unknown,
 * extension, MCP, schema, state, compact, and generic provider calls retain no
 * arguments. This allowlist, rather than secret-looking string matching, is
 * the durable trace's primary confidentiality boundary.
 */
export declare const projectFabricAuditArgs: (ref: string, args: Record<string, unknown>) => FabricAuditProjection;
/**
 * Results are omitted except for the exact boolean creation outcome emitted by
 * pi.write. No provider details or output text accompany that flag.
 */
export declare const projectFabricAuditResult: (ref: string, result: unknown) => FabricAuditProjection | undefined;
//# sourceMappingURL=projection.d.ts.map