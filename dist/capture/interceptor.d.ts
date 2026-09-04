import type { ExtensionRunner, ToolDefinition } from "@earendil-works/pi-coding-agent";
import { type FabricToolCaptureConfig } from "../config.js";
import { CapturedToolCatalog } from "./catalog.js";
export interface RegisteredToolCaptureController {
    setPolicy(config: FabricToolCaptureConfig): void;
    dispose(): void;
}
export interface RegisteredToolCaptureOptions {
    anchorDefinition: ToolDefinition<any, any, any>;
    catalog: CapturedToolCatalog;
    initialPolicy?: FabricToolCaptureConfig;
    onCatalogRefresh?: () => void;
}
type ExtensionRunnerConstructor = {
    prototype: ExtensionRunner;
};
export declare const bundleExtensionRunnerConstructors: (bundleDir: string) => Promise<ExtensionRunnerConstructor[]>;
export declare const installRegisteredToolCapture: (options: RegisteredToolCaptureOptions) => Promise<RegisteredToolCaptureController>;
export {};
//# sourceMappingURL=interceptor.d.ts.map