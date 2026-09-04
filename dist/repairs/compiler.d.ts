import { type CatalogRepair, type RepairClassification, type RepairStatus } from "./types.js";
export interface RepairCompilerOptions {
    agentDir: string;
    enabled?: boolean;
}
export declare class RepairCompiler {
    #private;
    readonly directory: string;
    readonly enabled: boolean;
    constructor(options: RepairCompilerOptions);
    get catalogDigest(): string;
    get repairs(): readonly CatalogRepair[];
    setCatalogSurface(surface: {
        providers: readonly string[];
        capturedTools: readonly string[];
    }): void;
    observe(classification: RepairClassification, options?: {
        countError?: boolean;
    }): CatalogRepair | undefined;
    recordInvocationError(): void;
    observeInvalidArgs(ref: string, args: Record<string, unknown>, declared: readonly string[], message: string, options?: {
        countError?: boolean;
        extraKeys?: readonly string[];
    }): CatalogRepair | undefined;
    observeUnknownAction(provider: string, actionName: string, declared: readonly string[], options?: {
        countError?: boolean;
    }): CatalogRepair | undefined;
    applyArgs(ref: string, args: Record<string, unknown>, schema: Record<string, unknown>): Record<string, unknown>;
    applyActionName(provider: string, actionName: string, declared: readonly string[]): string;
    status(): RepairStatus;
}
//# sourceMappingURL=compiler.d.ts.map