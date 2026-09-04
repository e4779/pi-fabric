import { type FabricAgentRunner, type FabricAgentConfig, type FabricRetentionConfig } from "../config.js";
import { type ClaudeModelInfo } from "./claude-cli.js";
import type { FabricSteeringMode, FabricAgentLog, AgentHandleInfo, AgentRunRecord, AgentRunRequest, AgentRunResult, AgentSteerResult } from "./types.js";
import { type FabricLifecyclePublishRequest } from "../lifecycle/types.js";
export declare const effectiveAgentTimeoutMs: (configuredTimeoutMs: number, requestedTimeoutMs?: number) => number;
interface AgentParticipantGuidanceRequest {
    model?: string;
    runner: FabricAgentRunner;
}
type AgentParticipantGuidanceResolver = (request: AgentParticipantGuidanceRequest) => string | undefined;
/** Reject the cwd combination excluded from the leaf-agent release. */
export declare const validateAgentCwdRequest: (request: Pick<AgentRunRequest, "cwd" | "recursive">) => void;
/** Resolve and validate a one-shot agent's filesystem execution directory. */
export declare const resolveAgentCwd: (parentCwd: string, requestedCwd?: string) => string;
export declare class AgentManager {
    #private;
    readonly cwd: string;
    readonly config: FabricAgentConfig;
    constructor(cwd: string, config: FabricAgentConfig, options?: {
        workerPath?: string;
        fabricExtensionPath?: string;
        piBinary?: string;
        claudeBinary?: string;
        vedaBinary?: string;
        runRoot?: string;
        fullCodeMode?: boolean;
        mainAgentId?: string;
        meshRoot?: string;
        projectRoot?: string;
        hostId?: string;
        identityId?: string;
        retention?: FabricRetentionConfig;
        onBackgroundComplete?: (result: AgentRunResult) => void;
        onLifecycle?: (event: FabricLifecyclePublishRequest) => void;
        preparePiModel?: (model: string) => Promise<void>;
        resolveParticipantGuidance?: AgentParticipantGuidanceResolver;
    });
    subscribeUi(listener: () => void): () => void;
    resolveCwd(requestedCwd?: string): string;
    spawn(request: AgentRunRequest, signal?: AbortSignal): Promise<AgentHandleInfo>;
    run(request: AgentRunRequest, signal?: AbortSignal): Promise<AgentRunResult>;
    wait(id: string): Promise<AgentRunResult>;
    markForeground(id: string): void;
    detachSignal(id: string): void;
    status(id: string): AgentRunRecord | AgentHandleInfo;
    list(): Array<AgentRunRecord | AgentHandleInfo>;
    listForUi(): Array<AgentRunRecord | AgentHandleInfo>;
    runDirectory(id: string): string | undefined;
    worktreeGitRoot(id: string): string | undefined;
    claudeModels(refresh?: boolean): Promise<ClaudeModelInfo[]>;
    stop(id: string): Promise<AgentRunResult>;
    cleanup(id: string, deleteBranch?: boolean): Promise<{
        cleaned: boolean;
    }>;
    readLog(id: string, opts?: {
        lines?: number;
        before?: number;
    }): FabricAgentLog;
    steer(id: string, message: string, data?: unknown): AgentSteerResult;
    followUp(id: string, message: string, data?: unknown): AgentSteerResult;
    setSteeringMode(id: string, mode: FabricSteeringMode): AgentSteerResult;
    setFollowUpMode(id: string, mode: FabricSteeringMode): AgentSteerResult;
    compact(id: string, instructions?: string): AgentSteerResult;
    close(): Promise<void>;
}
export {};
//# sourceMappingURL=manager.d.ts.map