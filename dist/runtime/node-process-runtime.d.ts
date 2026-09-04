import { type FabricHostCall, type FabricSandboxOptions, type FabricSandboxResult } from "./quickjs-runtime.js";
export declare class NodeProcessRuntime {
    #private;
    constructor(interpreter?: "node" | "bun");
    execute(code: string, hostCall: FabricHostCall, options: FabricSandboxOptions): Promise<FabricSandboxResult>;
}
export declare class BunProcessRuntime extends NodeProcessRuntime {
    constructor();
}
//# sourceMappingURL=node-process-runtime.d.ts.map