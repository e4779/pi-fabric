/** The small source shape needed to render a captured core override. */
export interface FabricCoreOverrideTypeSource {
    name: string;
    inputSchema: unknown;
}
/**
 * Build the full-code `pi` declaration for the current exact-name overrides.
 *
 * The static PiToolsApi remains the base interface. Each generated member is
 * an additive overload with the core slot's static result type; a renderer
 * failure intentionally produces a loose object overload so runtime schema
 * validation remains the authority.
 */
export declare const buildCoreOverrideGuestDeclarations: (sources: readonly FabricCoreOverrideTypeSource[]) => string | undefined;
//# sourceMappingURL=core-override-guest-types.d.ts.map