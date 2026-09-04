import type { CatalogRepair } from "./types.js";
export declare const applyActionAliasRepairs: (provider: string, actionName: string, repairs: readonly CatalogRepair[], declared: readonly string[]) => string | undefined;
export declare const applyCatalogArgRepairs: (ref: string, args: Record<string, unknown>, repairs: readonly CatalogRepair[], schema: Record<string, unknown>) => {
    args: Record<string, unknown>;
    changed: boolean;
};
//# sourceMappingURL=apply.d.ts.map