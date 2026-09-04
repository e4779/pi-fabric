import type { RepairCompiler } from "./compiler.js";
export declare const setActiveRepairCompiler: (compiler: RepairCompiler | undefined) => void;
export declare const clearActiveRepairCompiler: (compiler: RepairCompiler | undefined) => void;
export declare const getActiveRepairCompiler: () => RepairCompiler | undefined;
export declare const applyActiveArgRepairs: (ref: string, args: Record<string, unknown>, schema: Record<string, unknown>) => Record<string, unknown>;
export declare const applyActiveActionName: (provider: string, actionName: string, declared: readonly string[]) => string;
//# sourceMappingURL=active.d.ts.map