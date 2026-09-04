import { ActionRegistry } from "../core/action-registry.js";
import type { FabricInvocationContext, FabricScopedProviderResult } from "../protocol.js";
import { type FabricOwnedModelGuidance } from "./model-guidance.js";
import type { FabricComponentDefinition, FabricComponentEntry, FabricComponentGraph, FabricComponentInfo, FabricComponentStopOptions } from "./types.js";
export interface FabricComponentSupervisorOptions {
    invocationContext?(): FabricInvocationContext;
    invoke?(ref: string, args: Record<string, unknown>, context: FabricInvocationContext): Promise<unknown>;
    acquire?(ref: string, args: Record<string, unknown>, context: FabricInvocationContext): Promise<FabricScopedProviderResult>;
    maxResultChars?: number;
}
export declare class FabricComponentSupervisor {
    #private;
    readonly registry: ActionRegistry;
    readonly options: FabricComponentSupervisorOptions;
    constructor(registry: ActionRegistry, options?: FabricComponentSupervisorOptions);
    subscribe(listener: (componentId?: string) => void): () => void;
    assertLifecycleEntryAllowed(operation: string): void;
    list(): FabricComponentInfo[];
    status(id: string): FabricComponentInfo;
    guidance(): FabricOwnedModelGuidance[];
    graph(): FabricComponentGraph;
    start(entry: FabricComponentEntry, definition: FabricComponentDefinition): Promise<FabricComponentInfo>;
    replace(id: string, entry: FabricComponentEntry, definition: FabricComponentDefinition): Promise<FabricComponentInfo>;
    stop(id: string, options?: FabricComponentStopOptions): Promise<void>;
    refresh(): void;
    settle(): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=supervisor.d.ts.map