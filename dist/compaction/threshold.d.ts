import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { FabricConfig } from "../config.js";
export declare const modelCompactionKey: (model: Pick<NonNullable<ExtensionContext["model"]>, "provider" | "id"> | undefined) => string | undefined;
export declare const compactAtConfiguredThreshold: (context: ExtensionContext, config: FabricConfig) => Promise<boolean>;
//# sourceMappingURL=threshold.d.ts.map