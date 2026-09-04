import type { FabricComponentDefinition, FabricComponentDiscovery } from "./types.js";
export interface FabricComponentCatalogEntry {
    definition: FabricComponentDefinition;
    revision: number;
}
export interface FabricComponentCatalogEvent {
    name: string;
    current?: FabricComponentCatalogEntry;
    previous?: FabricComponentCatalogEntry;
}
export declare class FabricComponentCatalog {
    #private;
    readonly discovery: FabricComponentDiscovery;
    register(definition: FabricComponentDefinition, options?: {
        overwrite?: boolean;
    }): void;
    unregister(name: string): FabricComponentDefinition | undefined;
    get(name: string): FabricComponentCatalogEntry | undefined;
    list(): Array<FabricComponentCatalogEntry & {
        name: string;
    }>;
    clear(): void;
    subscribe(listener: (event: FabricComponentCatalogEvent) => void): () => void;
}
//# sourceMappingURL=catalog.d.ts.map