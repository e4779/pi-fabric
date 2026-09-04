import { type ExtensionAPI, type ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CapturedToolCatalog } from "../capture/catalog.js";
import type { FabricState } from "../fabric-state.js";
import type { FabricUiController } from "../ui/controller.js";
interface FabricCommandDeps {
    state: FabricState;
    fabricUi: FabricUiController;
    capturedTools: CapturedToolCatalog;
    applyFabricMode: () => void;
    suspendToolCapture: () => void;
    autoArmPrewalk?: (context: ExtensionContext) => Promise<void>;
    refreshCodePreviewSettings?: () => void;
    refreshToolDisplay?: () => void;
}
export declare function registerFabricCommand(pi: ExtensionAPI, deps: FabricCommandDeps): void;
export {};
//# sourceMappingURL=fabric.d.ts.map