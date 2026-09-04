import type { FabricActionDescriptor, FabricInvocationContext, FabricProvider, FabricProviderListRequest } from "../protocol.js";
import { MeshStore, type MeshIdentity } from "../mesh/store.js";
import type { FabricParticipantSource } from "../topology/types.js";
export declare const normalizeMeshArgs: import("./arg-normalization.js").ActionArgNormalizer;
export declare class MeshProvider implements FabricProvider {
    readonly store: MeshStore;
    readonly identity: MeshIdentity;
    readonly participants: FabricParticipantSource;
    readonly name = "mesh";
    readonly description = "Durable topics and compare-and-swap shared state for emergent agent coordination";
    constructor(store: MeshStore, identity: MeshIdentity, participants: FabricParticipantSource);
    list(request: FabricProviderListRequest, _context: FabricInvocationContext): Promise<FabricActionDescriptor[]>;
    describe(actionName: string, _context: FabricInvocationContext): Promise<FabricActionDescriptor | undefined>;
    prepareArguments(actionName: string, args: Record<string, unknown>): Record<string, unknown>;
    invoke(actionName: string, args: Record<string, unknown>, _context: FabricInvocationContext): Promise<unknown>;
}
//# sourceMappingURL=mesh-provider.d.ts.map