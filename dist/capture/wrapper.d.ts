import type { ExtensionRunner, RegisteredTool } from "@earendil-works/pi-coding-agent";
type WrappedExecute = (toolCallId: unknown, params: unknown, signal: unknown, onUpdate: (update: any) => void, ctx?: unknown) => Promise<any>;
export interface WrappedRegisteredTool {
    name: string;
    label: string | undefined;
    description: string | undefined;
    parameters: unknown;
    constrainedSampling: unknown;
    prepareArguments: ((args: Record<string, unknown>) => unknown) | undefined;
    executionMode: unknown;
    execute: WrappedExecute;
}
export declare const wrapRegisteredToolForCapture: (registeredTool: RegisteredTool, runner: ExtensionRunner) => WrappedRegisteredTool;
export {};
//# sourceMappingURL=wrapper.d.ts.map