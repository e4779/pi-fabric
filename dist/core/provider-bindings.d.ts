import type { FabricComponentProviderLease } from "../components/types.js";
import type { FabricProvider } from "../protocol.js";
type FabricProviderBindingState = "staged" | "active" | "retiring" | "closed";
export interface FabricProviderBinding {
    id: string;
    name: string;
    generation: number;
    provider: FabricProvider;
    state: FabricProviderBindingState;
    ownerRetained: boolean;
    allowReplace: boolean;
    retainers: number;
    inFlight: number;
    closeTask?: Promise<void>;
    closeError?: string;
    unsubscribeCatalog?: () => void;
}
export type FabricProviderBindingEvent = {
    type: "staged" | "activated" | "retiring" | "closed";
    binding: FabricProviderBinding;
} | {
    type: "catalog";
    provider: string;
};
export declare class FabricProviderBindings {
    #private;
    subscribe(listener: (event: FabricProviderBindingEvent) => void): () => void;
    current(name: string): FabricProviderBinding | undefined;
    binding(id: string): FabricProviderBinding | undefined;
    has(name: string): boolean;
    providers(): FabricProvider[];
    entries(): FabricProviderBinding[];
    mount(provider: FabricProvider, options?: {
        overwrite?: boolean;
        staged?: boolean;
    }): FabricComponentProviderLease;
    activate(bindingIds: readonly string[]): string[];
    unregister(name: string): FabricProvider | undefined;
    retire(id: string): void;
    retain(ids: Iterable<string>): () => Promise<void>;
    beginInvocation(id: string): () => Promise<void>;
    notifyCatalogChanged(provider: string): void;
    close(excludedProviderNames?: Set<string>): Promise<void>;
    private releaseOwner;
}
export {};
//# sourceMappingURL=provider-bindings.d.ts.map