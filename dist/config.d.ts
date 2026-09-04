import type { FabricComponentEntry } from "./components/types.js";
import type { FabricRisk } from "./protocol.js";
import { type FabricThinking } from "./thinking.js";
import { type CodePreviewSettings } from "./ui/code-preview.js";
type FabricApprovalMode = "allow" | "ask" | "auto" | "deny";
export type FabricAgentTransport = "auto" | "process" | "tmux" | "screen" | "localterm" | "herdr";
export type FabricAgentRunner = "pi" | "claude" | "veda";
export type FabricUiWidgetMode = "auto" | "always" | "hidden";
type FabricToolDisplayMode = "full" | "compact";
export type FabricResultFormat = "auto" | "yaml" | "json" | "text";
export type FabricPrewalkMode = "in-place" | "trajectory";
export type FabricExecutorRuntime = "quickjs" | "node-process" | "bun-process";
export type FabricConfigScope = "global" | "project";
type FabricCompactionEngine = "pi" | "fabric";
type FabricActorScope = "project" | "session";
interface FabricExecutorConfig {
    runtime: FabricExecutorRuntime;
    timeoutMs: number;
    /** Policy maximum for any executor deadline, including per-invocation
     * requests and per-ref floors. Values above this are visibly normalized. */
    maxTimeoutMs: number;
    /** Exact-ref deadline floors (ms) for known long-running host calls, e.g.
     * "extensions.subagent". Keys are exact refs; no wildcard matching. */
    hostCallTimeouts: Record<string, number>;
    memoryLimitBytes: number;
    maxOutputChars: number;
    maxNestedResultChars: number;
    resultFormat: FabricResultFormat;
}
export interface FabricApprovalConfig {
    read: FabricApprovalMode;
    write: FabricApprovalMode;
    execute: FabricApprovalMode;
    network: FabricApprovalMode;
    agent: FabricApprovalMode;
    model?: string;
}
/** Session-start background revalidation scope for the MCP descriptor cache:
 * "changed" lists only added/reconfigured servers, "all" re-lists every known
 * server, "off" never spawns servers in the background. */
type FabricMcpRevalidatePolicy = "changed" | "all" | "off";
interface FabricMcpCacheConfig {
    /** Serve MCP tool metadata from the on-disk descriptor cache instead of
     * connecting to every configured server on first discovery each session. */
    enabled: boolean;
    revalidate: FabricMcpRevalidatePolicy;
    /** Wall-clock budget for one session-start background revalidation pass. */
    revalidateBudgetMs: number;
}
export interface FabricMcpConfig {
    enabled: boolean;
    configPath?: string;
    disableOAuth: boolean;
    allowDynamicServers: boolean;
    callTimeoutMs: number;
    cache: FabricMcpCacheConfig;
}
interface FabricClaudeRunnerConfig {
    binary: string;
    model?: string;
}
/** Veda CLI options for the `veda` agent runner. The Veda CLI wraps external
 * backends (agy, codex, claude-code, droid, pi, and any backend registered by
 * the installed Veda build); the backend is selected here and the persona
 * controls read-only vs write-capable behavior. */
interface FabricVedaRunnerConfig {
    binary: string;
    /** Veda backend to drive. Defaults to the Antigravity CLI (agy). */
    backend: string;
    /** Optional backend-specific model or Veda model alias. */
    model?: string;
    /** Veda persona: navigator-plan, navigator-chat, reviewer, or worker. */
    persona: string;
}
interface FabricPrewalkConfig {
    enabled?: boolean;
    mode: FabricPrewalkMode;
    model?: string;
    alwaysRearm: boolean;
    compactOnReturn: boolean;
    detectShellWrites: boolean;
    thinking?: FabricThinking;
}
export interface FabricAgentConfig {
    enabled: boolean;
    runner: FabricAgentRunner;
    transport: FabricAgentTransport;
    model?: string;
    claude: FabricClaudeRunnerConfig;
    veda: FabricVedaRunnerConfig;
    thinking: FabricThinking;
    maxConcurrent: number;
    maxPerExecution: number;
    maxDepth: number;
    timeoutMs: number;
    extensions: boolean;
    defaultTools: string[];
    retainRuns: boolean;
    notifyOnComplete: boolean;
    budgetUsd: number;
    maxTokensPerChild: number;
    /** Write usage-only pi-format session files per agent run for external trackers. */
    sessionExport: boolean;
    /** Export store root override; PI_FABRIC_AGENT_DIR wins. Empty = ~/.pi-fabric/agent. */
    sessionExportDir: string;
}
export interface FabricToolCaptureConfig {
    enabled: boolean;
    hideFromModel: boolean;
    keepVisible: string[];
    defaultRisk: FabricRisk;
    risks: Record<string, FabricRisk>;
}
export type FabricSchemaMode = "off" | "audit" | "enforce";
export interface FabricSchemaTrustedCommand {
    command: string;
    args: string[];
    shell: boolean;
    timeoutMs: number;
}
export interface FabricSchemaConfig {
    mode: FabricSchemaMode;
    certificateTtlMs: number;
    maxFiles: number;
    maxBytes: number;
    trustedCommands: Record<string, FabricSchemaTrustedCommand>;
}
interface FabricUiConfig {
    enabled: boolean;
    widget: FabricUiWidgetMode;
    maxRows: number;
    refreshMs: number;
    eventHistory: number;
    haltOnEscape: boolean;
    showAgentToolPreview: boolean;
    toolDisplay: FabricToolDisplayMode;
    updateDebounceMs: number;
}
interface FabricCompactionConfig {
    engine: FabricCompactionEngine;
    targetContextRatio: number;
    thresholds: Record<string, number>;
    tokenThresholds: Record<string, number>;
}
export declare const MIN_COMPACTION_TOKEN_THRESHOLD = 1000;
export declare const MAX_COMPACTION_TOKEN_THRESHOLD = 100000000;
export declare const MIN_COMPACTION_RATIO_THRESHOLD = 0.25;
export declare const MAX_COMPACTION_RATIO_THRESHOLD = 0.95;
export declare const clampCompactionTokenThreshold: (value: number) => number;
export declare const clampCompactionRatioThreshold: (value: number) => number;
export interface FabricRetentionConfig {
    orphanedTempRunMs: number;
    oneShotRunMs: number;
    actorRunArchiveMs: number;
}
export interface FabricMeshConfig {
    enabled: boolean;
    root?: string;
    actorScope: FabricActorScope;
    maxEventBytes: number;
    maxReadEvents: number;
    actorPollMs: number;
    actorQueueLimit: number;
    eventContextChars: number;
    actorContextEntries: number;
}
interface FabricRepairsConfig {
    enabled: boolean;
}
export interface FabricMemoryConfig {
    enabled: boolean;
    indexDir?: string;
    maxSessions: number;
    maxEntryChars: number;
    indexThinking: boolean;
    indexToolOutput: boolean;
    hotSessions?: number;
    digestTerms?: number;
    maxColdVocabularyBytes?: number;
    maxColdCacheBytes?: number;
    maxSyncSessions?: number;
    maxSyncSourceBytes?: number;
    maxCacheCleanupFiles?: number;
    regexMaxPatternBytes?: number;
    regexMaxHaystackTerms?: number;
    regexMaxHaystackBytes?: number;
    regexTimeoutMs?: number;
}
export interface FabricSpeculationConfig {
    /** Master switch for speculative programmatic tool calling during streaming. */
    enabled: boolean;
    /** Maximum simultaneously in-flight speculative calls; excess candidates are dropped. */
    maxConcurrent: number;
    /** Maximum retained unserved speculation entries per turn. */
    maxEntries: number;
    /** Per-stream cap on buffered partial tool-call arguments while extracting the `code` field. */
    maxBufferBytes: number;
    /** Unserved speculation entries older than this are aborted and discarded. */
    entryTtlMs: number;
    /**
     * Tier B: MCP tools that may be speculated despite risk "network". Entries
     * are `server.tool` or `server.*` and match the ref after the `mcp.` prefix.
     * Only enable for tools the operator knows are read-only; cached MCP
     * annotations with destructiveHint=true always refuse.
     */
    mcpAllowlist: string[];
}
export interface FabricModelsConfig {
    /** Alias name → ordered provider/model fallback chain, first available wins. */
    aliases: Record<string, string[]>;
}
export interface FabricConfig {
    fullCodeMode: boolean;
    executor: FabricExecutorConfig;
    approvals: FabricApprovalConfig;
    mcp: FabricMcpConfig;
    prewalk: FabricPrewalkConfig;
    agents: FabricAgentConfig;
    models: FabricModelsConfig;
    components: FabricComponentEntry[];
    capture: FabricToolCaptureConfig;
    ui: FabricUiConfig;
    compaction: FabricCompactionConfig;
    retention: FabricRetentionConfig;
    mesh: FabricMeshConfig;
    memory: FabricMemoryConfig;
    repairs: FabricRepairsConfig;
    schema: FabricSchemaConfig;
    speculation: FabricSpeculationConfig;
    codePreview: CodePreviewSettings;
}
/** Hard implementation maximum for any executor deadline. Policy ceilings
 * (executor.maxTimeoutMs) may be raised up to this value by administrators. */
export declare const MAX_EXECUTOR_TIMEOUT_MS: number;
export declare const MIN_AGENT_TIMEOUT_MS = 1000;
export declare const MAX_AGENT_TIMEOUT_MS: number;
export declare const QUICKJS_MAX_MEMORY_LIMIT_BYTES = 4294967295;
export declare const MAX_EXECUTOR_MEMORY_LIMIT_BYTES: number;
export declare const maxExecutorMemoryLimitBytes: (runtime: FabricExecutorRuntime) => number;
export declare const DEFAULT_FABRIC_CONFIG: FabricConfig;
export declare const normalizeFabricConfig: (input: Record<string, unknown>) => FabricConfig;
export declare const effectiveToolCaptureConfig: (config: Pick<FabricConfig, "fullCodeMode" | "capture"> & Partial<Pick<FabricConfig, "schema">>) => FabricToolCaptureConfig;
export declare const loadFabricConfigForScope: (options: {
    cwd: string;
    agentDir: string;
    projectTrusted: boolean;
}, scope: FabricConfigScope) => FabricConfig;
export declare const loadFabricConfig: (options: {
    cwd: string;
    agentDir: string;
    projectTrusted: boolean;
}) => FabricConfig;
export declare const saveFabricConfig: (options: {
    cwd: string;
    agentDir: string;
    projectTrusted: boolean;
    scope?: FabricConfigScope;
}, partial: Record<string, unknown>) => {
    scope: FabricConfigScope;
    path: string;
};
export {};
//# sourceMappingURL=config.d.ts.map