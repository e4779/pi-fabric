import type { ActionRegistry } from "../core/action-registry.js";
import type { FabricProvider } from "../protocol.js";
import type { FabricComponentCatalog } from "./catalog.js";
import type { FabricComponentLoader } from "./loader.js";
import type { FabricComponentContext, FabricComponentDefinition, FabricComponentEntry } from "./types.js";
export declare const FABRIC_PROVIDER_COMPONENT_PREFIX = "fabric.provider.";
export declare const FABRIC_COMPONENT_PROVIDER_NAMES: readonly ["pi", "extensions", "mcp", "mesh", "state", "schema", "compact", "agents", "memory"];
export interface FabricProviderComponentSpec<TProvider extends FabricProvider> {
    provider: string;
    description: string;
    requires?: FabricComponentDefinition["requires"];
    create(context: FabricComponentContext): TProvider | Promise<TProvider>;
    mounted?(provider: TProvider): void;
    unmounted?(provider: TProvider): void;
    start?(provider: TProvider): void | Promise<void>;
}
export interface FabricProviderComponent {
    entry: FabricComponentEntry;
    definition: FabricComponentDefinition;
}
export declare class FabricProviderComponentManifest {
    #private;
    readonly catalog: FabricComponentCatalog;
    readonly loader: FabricComponentLoader;
    constructor(catalog: FabricComponentCatalog, loader: FabricComponentLoader);
    entries(): FabricComponentEntry[];
    install(component: FabricProviderComponent): Promise<void>;
    assertActive(expectedProviders: Iterable<string>, registry: ActionRegistry): void;
}
export declare const createProviderComponent: <TProvider extends FabricProvider>(spec: FabricProviderComponentSpec<TProvider>) => FabricProviderComponent;
//# sourceMappingURL=provider-component.d.ts.map