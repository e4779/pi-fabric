import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
type ToolCallBackgroundMode = "on" | "border" | "off";
type AnyTool = ToolDefinition<any, any, any>;
export type FabricToolShellDecorator = <TTool extends AnyTool>(tool: TTool, options?: {
    mode?: ToolCallBackgroundMode;
    preserveSelfShell?: boolean;
    toolCallTiming?: boolean;
}) => TTool;
export declare const withCodePreviewShell: FabricToolShellDecorator;
export {};
//# sourceMappingURL=code-preview-shell.d.ts.map