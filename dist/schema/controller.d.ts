import type { FabricSchemaConfig } from "../config.js";
import type { MeshIdentity, MeshStore } from "../mesh/store.js";
import type { FabricInvocationContext } from "../protocol.js";
import type { StateStore } from "../state/store.js";
import { type SchemaEvidence, type SchemaFileOperation } from "./types.js";
export declare class SchemaController {
    #private;
    readonly cwd: string;
    readonly config: FabricSchemaConfig;
    readonly mesh: MeshStore;
    readonly identity: MeshIdentity;
    readonly state?: StateStore | undefined;
    constructor(cwd: string, config: FabricSchemaConfig, mesh: MeshStore, identity: MeshIdentity, state?: StateStore | undefined);
    authorize(ref: string, parentToolCallId: string): Promise<void>;
    status(parentToolCallId?: string): Record<string, unknown>;
    hypothesize(input: {
        label: string;
        summary: string;
        evidence: SchemaEvidence[];
        complexityReduction?: boolean;
    }, context: FabricInvocationContext): Promise<Record<string, unknown>>;
    verify(hypothesisId: string, context: FabricInvocationContext): Promise<Record<string, unknown>>;
    commit(input: {
        hypothesisId: string;
        certificate: string;
        operations: SchemaFileOperation[];
        postconditions: SchemaEvidence[];
    }, context: FabricInvocationContext): Promise<Record<string, unknown>>;
    abort(input: {
        hypothesisId: string;
        certificate?: string;
    }, context: FabricInvocationContext): Promise<Record<string, unknown>>;
    endInvocation(parentToolCallId: string): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map