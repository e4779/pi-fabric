import type { ImageContent } from "@earendil-works/pi-ai";
import type { FabricThinking } from "../thinking.js";
export interface ClaudeModelInfo {
    value: string;
    resolvedModel: string;
    displayName: string;
    description: string;
    supportsEffort?: boolean;
    supportedEffortLevels?: string[];
    supportsAdaptiveThinking?: boolean;
    supportsFastMode?: boolean;
    supportsAutoMode?: boolean;
}
interface ClaudeRunArguments {
    model?: string;
    thinking?: FabricThinking;
    tools: string[];
    extensions: boolean;
    systemPrompt?: string;
    schema?: string;
    runnerSessionId?: string;
    persistentSession: boolean;
    name?: string;
}
export declare const mapClaudeTools: (tools: readonly string[]) => string[];
export declare const normalizeClaudeModel: (model: string) => string;
export declare const claudeEffort: (thinking: FabricThinking) => string;
export declare const buildClaudeArguments: (options: ClaudeRunArguments) => string[];
export declare const claudeUserMessage: (message: string, images?: readonly ImageContent[]) => Record<string, unknown>;
export declare const discoverClaudeModels: (binary: string, cwd: string, timeoutMs?: number) => Promise<ClaudeModelInfo[]>;
export {};
//# sourceMappingURL=claude-cli.d.ts.map