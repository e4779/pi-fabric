import { FabricComponentCatalog } from "./catalog.js";
import { FabricComponentSupervisor } from "./supervisor.js";
import type { FabricComponentEntry, FabricComponentGraph, FabricComponentInfo } from "./types.js";
export declare class FabricComponentLoader {
    #private;
    readonly catalog: FabricComponentCatalog;
    readonly supervisor: FabricComponentSupervisor;
    constructor(catalog: FabricComponentCatalog, supervisor: FabricComponentSupervisor);
    entries(): FabricComponentEntry[];
    pinnedEntries(): FabricComponentEntry[];
    definitions(): Array<{
        name: string;
        description?: string;
        revision: number;
        requirements: string[];
        provisions: string[];
    }>;
    list(): FabricComponentInfo[];
    status(id: string): FabricComponentInfo;
    graph(): FabricComponentGraph;
    reload(id?: string): Promise<FabricComponentInfo[]>;
    installPinned(entries: readonly FabricComponentEntry[]): Promise<FabricComponentInfo[]>;
    reconcile(entries: readonly FabricComponentEntry[]): Promise<FabricComponentInfo[]>;
    settle(): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=loader.d.ts.map