import { CapturedToolCatalog } from "../capture/catalog.js";
import type { FabricActionDescriptor, FabricInvocationContext, FabricProvider, FabricProviderListRequest } from "../protocol.js";
import { CapturedToolsProvider } from "./captured-tools-provider.js";
export declare class PiToolsProvider implements FabricProvider {
    #private;
    readonly name = "pi";
    readonly description = "Pi's built-in coding tools";
    constructor(cwd: string, catalog?: CapturedToolCatalog, capturedTools?: CapturedToolsProvider);
    list(request: FabricProviderListRequest, _context: FabricInvocationContext): Promise<FabricActionDescriptor[]>;
    describe(actionName: string, _context: FabricInvocationContext): Promise<FabricActionDescriptor | undefined>;
    prepareArguments(actionName: string, args: Record<string, unknown>): Record<string, unknown>;
    invoke(actionName: string, args: Record<string, unknown>, context: FabricInvocationContext): Promise<unknown>;
}
//# sourceMappingURL=pi-tools-provider.d.ts.map