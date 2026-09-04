import type { FabricActionDescriptor, FabricInvocationContext, FabricProvider, FabricProviderListRequest } from "../protocol.js";
import type { MeshIdentity, MeshStore } from "../mesh/store.js";
import { StateStore } from "../state/store.js";
export declare const normalizeStateArgs: import("./arg-normalization.js").ActionArgNormalizer;
export declare class StateProvider implements FabricProvider {
    #private;
    readonly name = "state";
    readonly description = "Schema-style labeled transition layer: an append-only timeline of validated transitions with a compare-and-swap head and evidence-based certification over mesh storage";
    constructor(store: MeshStore, identity: MeshIdentity);
    get state(): StateStore;
    list(request: FabricProviderListRequest, _context: FabricInvocationContext): Promise<FabricActionDescriptor[]>;
    describe(actionName: string, _context: FabricInvocationContext): Promise<FabricActionDescriptor | undefined>;
    prepareArguments(actionName: string, args: Record<string, unknown>): Record<string, unknown>;
    invoke(actionName: string, args: Record<string, unknown>, context: FabricInvocationContext): Promise<unknown>;
}
//# sourceMappingURL=state-provider.d.ts.map