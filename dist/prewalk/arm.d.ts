import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { FabricState } from "../fabric-state.js";
export declare const armFabricPrewalkSession: (state: FabricState, context: ExtensionContext, pi: ExtensionAPI, input: {
    model: string;
    task?: string;
}) => Promise<void>;
export declare const autoArmFabricPrewalk: (state: FabricState, context: ExtensionContext, pi: ExtensionAPI) => Promise<string | undefined>;
//# sourceMappingURL=arm.d.ts.map