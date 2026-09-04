import type { FabricComponentDisposer, FabricComponentEffect, FabricComponentEffectInfo, FabricComponentEffectRegistration } from "./types.js";
interface FabricEffectFailure {
    label: string;
    error: string;
}
export interface FabricEffectCleanupReport {
    status: "disposed" | "quarantined";
    failures: FabricEffectFailure[];
}
export type FabricEffectGuard = () => boolean | Promise<boolean>;
export interface FabricEffectScopeOptions {
    guard?: FabricEffectGuard;
}
export interface FabricEffectLifecycleHooks {
    beforeCleanup?(): void;
}
export declare class FabricEffectDivertedError extends Error {
    readonly cleanupError: unknown;
    constructor(message?: string, cleanupError?: unknown);
}
export declare class FabricEffectScope {
    #private;
    constructor(options?: FabricEffectScopeOptions);
    get state(): "open" | "disposing" | "disposed";
    footprint(limit?: number): FabricComponentEffectInfo[];
    effect(setup: () => FabricComponentEffect, registration?: FabricComponentEffectRegistration, hooks?: FabricEffectLifecycleHooks): Promise<FabricComponentDisposer>;
    defer(disposer: FabricComponentDisposer, registration?: FabricComponentEffectRegistration): FabricComponentDisposer;
    dispose(): Promise<FabricEffectCleanupReport>;
}
export {};
//# sourceMappingURL=effect-scope.d.ts.map