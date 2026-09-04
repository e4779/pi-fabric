import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import type { CodePreviewSettings } from "./ui/code-preview.js";
import { type FabricToolShellDecorator } from "./ui/code-preview-shell.js";
import type { FabricState } from "./fabric-state.js";
import type { PendingFabricHandoff } from "./prewalk/handoff.js";
import type { FabricToolDisplayController } from "./ui/tool-display.js";
export declare const createFabricExecTool: (state: FabricState, codePreviewSettings: CodePreviewSettings, pendingHandoffs: Map<string, PendingFabricHandoff>, decorateShell?: FabricToolShellDecorator, toolDisplay?: FabricToolDisplayController) => ToolDefinition<any, any, any>;
//# sourceMappingURL=fabric-exec-tool.d.ts.map