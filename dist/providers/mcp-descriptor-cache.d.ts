import type { ServerDefinition } from "mcporter";
export declare const MCP_DESCRIPTOR_CACHE_VERSION = 1;
export interface McpConfigLayerStat {
    path: string;
    mtimeMs: number;
    size: number;
}
interface CachedMcpToolAnnotations {
    readOnlyHint?: boolean;
    idempotentHint?: boolean;
    destructiveHint?: boolean;
    openWorldHint?: boolean;
}
interface CachedMcpTool {
    name: string;
    description?: string;
    inputSchema?: unknown;
    outputSchema?: unknown;
    annotations?: CachedMcpToolAnnotations;
}
export interface CachedMcpServer {
    definitionHash: string;
    transport: string;
    description: string | null;
    fetchedAt: string;
    stale: boolean;
    tools: CachedMcpTool[];
}
export interface McpDescriptorCacheFile {
    version: number;
    layers: McpConfigLayerStat[];
    updatedAt: string;
    servers: Record<string, CachedMcpServer>;
}
export declare const mcpConfigLayerPaths: (rootDir: string, configPath?: string) => string[];
export declare const statConfigLayers: (rootDir: string, configPath?: string) => Promise<McpConfigLayerStat[]>;
export declare const sameConfigLayers: (left: McpConfigLayerStat[], right: McpConfigLayerStat[]) => boolean;
export declare const hashServerDefinition: (definition: ServerDefinition) => string;
export declare const parseCachedServer: (value: unknown) => CachedMcpServer | undefined;
export declare class McpDescriptorCacheStore {
    readonly filePath: string;
    constructor(filePath: string);
    load(): Promise<McpDescriptorCacheFile | undefined>;
    save(file: McpDescriptorCacheFile): Promise<void>;
}
export {};
//# sourceMappingURL=mcp-descriptor-cache.d.ts.map