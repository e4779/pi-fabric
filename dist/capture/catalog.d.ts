import type { ExtensionRunner, RegisteredTool, SourceInfo, ToolDefinition } from "@earendil-works/pi-coding-agent";
import { wrapRegisteredToolForCapture } from "./wrapper.js";
import type { FabricToolCaptureConfig } from "../config.js";
import type { FabricRisk } from "../protocol.js";
export interface CapturedToolEntry {
    name: string;
    definition: ToolDefinition<any, any, any>;
    registeredTool: RegisteredTool;
    sourceInfo: SourceInfo;
    runner: ExtensionRunner;
    wrappedTool: ReturnType<typeof wrapRegisteredToolForCapture>;
    risk: FabricRisk;
}
export declare class CapturedToolCatalog {
    #private;
    get runner(): ExtensionRunner | undefined;
    get suspended(): boolean;
    markSuspended(): void;
    markResumed(): void;
    replace(registeredTools: RegisteredTool[], runner: ExtensionRunner, config: FabricToolCaptureConfig, ownSourcePath: string): void;
    clear(): void;
    refresh(): void;
    subscribe(listener: () => void): () => void;
    get(name: string): CapturedToolEntry | undefined;
    require(name: string): CapturedToolEntry;
    list(): CapturedToolEntry[];
    get size(): number;
}
//# sourceMappingURL=catalog.d.ts.map