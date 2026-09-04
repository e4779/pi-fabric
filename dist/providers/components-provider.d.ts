import { FabricComponentLoader } from "../components/loader.js";
import type { FabricActionDescriptor, FabricInvocationContext, FabricProvider, FabricProviderListRequest } from "../protocol.js";
export declare class ComponentsProvider implements FabricProvider {
    readonly loader: FabricComponentLoader;
    readonly name = "components";
    readonly description = "Supervised component lifecycle, exact capability dependencies, effect cleanup, and reload diagnostics.";
    constructor(loader: FabricComponentLoader);
    list(request: FabricProviderListRequest, _context: FabricInvocationContext): Promise<FabricActionDescriptor[]>;
    describe(actionName: string, _context: FabricInvocationContext): Promise<FabricActionDescriptor | undefined>;
    invoke(actionName: string, args: Record<string, unknown>, _context: FabricInvocationContext): Promise<unknown>;
}
//# sourceMappingURL=components-provider.d.ts.map