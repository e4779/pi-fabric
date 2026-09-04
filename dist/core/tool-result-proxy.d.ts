import type { ExtensionRunner } from "@earendil-works/pi-coding-agent";
import type { ResolvedFabricAction } from "./action-registry.js";
export interface FabricToolResultProxyRequest {
    action: ResolvedFabricAction;
    args: Record<string, unknown>;
    toolCallId: string;
    value: unknown;
    signal?: AbortSignal;
}
export interface FabricNestedToolResultProxy {
    proxy(request: FabricToolResultProxyRequest): Promise<unknown>;
}
export declare class FabricToolResultProxy implements FabricNestedToolResultProxy {
    readonly runner: () => ExtensionRunner | undefined;
    constructor(runner: () => ExtensionRunner | undefined);
    proxy(request: FabricToolResultProxyRequest): Promise<unknown>;
}
//# sourceMappingURL=tool-result-proxy.d.ts.map