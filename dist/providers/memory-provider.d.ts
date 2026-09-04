import type { FabricActionDescriptor, FabricInvocationContext, FabricProvider, FabricProviderListRequest } from "../protocol.js";
import type { FabricMemoryConfig } from "../config.js";
import type { LiveSessionBranch } from "../memory/lineage.js";
export declare const normalizeMemoryArgs: import("./arg-normalization.js").ActionArgNormalizer;
export interface MemoryProviderContext {
    agentDir: string;
    cwd: string;
    config: FabricMemoryConfig;
    sessionId?: string;
    sessionFile?: string;
    getLiveBranch?: () => LiveSessionBranch;
}
export declare class MemoryProvider implements FabricProvider {
    private readonly context;
    readonly name = "memory";
    readonly description = "Cross-session memory: a search engine over every Pi session timeline on this machine";
    constructor(context: MemoryProviderContext);
    list(request: FabricProviderListRequest, _context: FabricInvocationContext): Promise<FabricActionDescriptor[]>;
    describe(actionName: string, _context: FabricInvocationContext): Promise<FabricActionDescriptor | undefined>;
    prepareArguments(actionName: string, args: Record<string, unknown>): Record<string, unknown>;
    invoke(actionName: string, args: Record<string, unknown>, invocationContext: FabricInvocationContext): Promise<unknown>;
    private recall;
    private expand;
    private sessions;
}
//# sourceMappingURL=memory-provider.d.ts.map