import { CompactController } from "../core/compact-controller.js";
import type { FabricActionDescriptor, FabricInvocationContext, FabricProvider, FabricProviderListRequest } from "../protocol.js";
export declare const normalizeCompactArgs: import("./arg-normalization.js").ActionArgNormalizer;
export declare class CompactProvider implements FabricProvider {
    readonly controller: CompactController;
    readonly name = "compact";
    readonly description = "Programmatic, advisory-then-committed context compaction for the host Pi session";
    constructor(controller: CompactController);
    list(request: FabricProviderListRequest, _context: FabricInvocationContext): Promise<FabricActionDescriptor[]>;
    describe(actionName: string, _context: FabricInvocationContext): Promise<FabricActionDescriptor | undefined>;
    prepareArguments(actionName: string, args: Record<string, unknown>): Record<string, unknown>;
    invoke(actionName: string, args: Record<string, unknown>, context: FabricInvocationContext): Promise<unknown>;
}
//# sourceMappingURL=compact-provider.d.ts.map