import type { FabricActorInfo, FabricActorRequest } from "../actors/types.js";
/**
 * Durable actor lifecycle proxy for nested Fabric runtimes.
 * Communication remains on the Fabric control plane; only authoritative
 * registry mutations are routed through the root resident host.
 */
export declare class ResidentActorClient {
    #private;
    constructor(meshRoot: string, rootId: string);
    static fromEnv(): ResidentActorClient | undefined;
    createActor(request: FabricActorRequest): Promise<FabricActorInfo>;
    removeActor(id: string): Promise<{
        removed: true;
    }>;
}
//# sourceMappingURL=actor-client.d.ts.map