import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CodePreviewSettings } from "./code-preview.js";
import type { FabricState } from "../fabric-state.js";
import { type FabricDashboardSnapshot } from "./types.js";
export declare class FabricUiController {
    #private;
    readonly state: FabricState;
    readonly codePreviewSettings?: CodePreviewSettings | undefined;
    constructor(state: FabricState, codePreviewSettings?: CodePreviewSettings | undefined);
    start(context: ExtensionContext): void;
    stop(): void;
    openDashboard(context: ExtensionContext): Promise<void>;
    snapshot(): FabricDashboardSnapshot;
}
//# sourceMappingURL=controller.d.ts.map