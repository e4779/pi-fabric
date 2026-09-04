import type { FabricActionDescriptor } from "../protocol.js";
export interface ArgNormalizationSpec {
    aliases?: Readonly<Record<string, string>>;
    numerics?: readonly string[];
    numericArrays?: readonly string[];
    values?: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
    knownKeys?: readonly string[];
}
export type ActionArgNormalizer = (actionName: string, args: Record<string, unknown>) => Record<string, unknown>;
/** Unique declared key for a spilled spelling, or undefined when already
 * canonical / ambiguous / unmatched. Used by the catalog repair compiler. */
export declare const uniqueDeclaredKeyForSpelling: (spilled: string, declared: readonly string[]) => string | undefined;
export declare const normalizeActionArgs: (args: Record<string, unknown>, spec: ArgNormalizationSpec) => Record<string, unknown>;
export declare const actionArgNormalizer: (describeActions: () => ReadonlyArray<Pick<FabricActionDescriptor, "name" | "inputSchema">>, table?: Record<string, ArgNormalizationSpec>) => ActionArgNormalizer;
//# sourceMappingURL=arg-normalization.d.ts.map