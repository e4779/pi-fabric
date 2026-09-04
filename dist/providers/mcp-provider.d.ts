import type { FabricMcpConfig } from "../config.js";
import type { FabricActionDescriptor, FabricInvocationContext, FabricProvider, FabricProviderListRequest } from "../protocol.js";
import { McpDescriptorCacheStore } from "./mcp-descriptor-cache.js";
export interface McpProviderHooks {
    /** Full provider-fidelity descriptor slice after any tool-list change. */
    onSliceChanged?: (descriptors: FabricActionDescriptor[]) => void;
}
export interface McpProviderOptions {
    cache?: McpDescriptorCacheStore;
    hooks?: McpProviderHooks;
}
export declare class McpProvider implements FabricProvider {
    #private;
    readonly cwd: string;
    readonly config: FabricMcpConfig;
    readonly name = "mcp";
    readonly description = "External MCP tools discovered and pooled by mcporter";
    constructor(cwd: string, config: FabricMcpConfig, options?: McpProviderOptions);
    list(request: FabricProviderListRequest, context: FabricInvocationContext): Promise<FabricActionDescriptor[]>;
    describe(actionName: string, context: FabricInvocationContext): Promise<FabricActionDescriptor | undefined>;
    invoke(actionName: string, args: Record<string, unknown>, context: FabricInvocationContext): Promise<unknown>;
    close(): Promise<void>;
    warmup(): void;
    sliceDescriptors(): FabricActionDescriptor[];
    settle(): Promise<void>;
}
//# sourceMappingURL=mcp-provider.d.ts.map