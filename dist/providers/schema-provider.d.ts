import type { FabricActionDescriptor, FabricInvocationContext, FabricProvider, FabricProviderListRequest } from "../protocol.js";
import { SchemaController } from "../schema/controller.js";
export declare const normalizeSchemaArgs: import("./arg-normalization.js").ActionArgNormalizer;
export declare class SchemaProvider implements FabricProvider {
    readonly controller: SchemaController;
    readonly name = "schema";
    readonly description = "Host-owned, opt-in Schema verification and bounded local-file transaction control plane";
    constructor(controller: SchemaController);
    list(request: FabricProviderListRequest, _context: FabricInvocationContext): Promise<FabricActionDescriptor[]>;
    describe(actionName: string, _context: FabricInvocationContext): Promise<FabricActionDescriptor | undefined>;
    prepareArguments(actionName: string, args: Record<string, unknown>): Record<string, unknown>;
    invoke(actionName: string, args: Record<string, unknown>, context: FabricInvocationContext): Promise<unknown>;
    invocationEnded(parentToolCallId: string): Promise<void>;
}
//# sourceMappingURL=schema-provider.d.ts.map