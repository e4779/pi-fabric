/**
 * Usage-only Pi-format session export for external cost trackers (tokscale,
 * ccusage). Fabric subagents run with `--no-session`, so nothing they spend is
 * visible to tools that aggregate token usage from session JSONL files. When
 * enabled, the worker appends one attributed assistant usage line per turn to
 * a minimal pi-format session file under `~/.pi-fabric/agent/sessions/`
 * (or PI_FABRIC_AGENT_DIR): a `session` header, a `session_info` marker naming
 * the run as "fabricagent-<name>", and `message` entries carrying only
 * model/provider/usage — never transcript content.
 *
 * tokscale's pi parser attaches the `session_info` name to every assistant
 * message in the file (agent-level attribution), and ccusage's pi adapter
 * counts each message line toward named-store reports.
 *
 * Self-contained on purpose: this module is dynamically imported by the
 * spawned worker through plain Node with worker.ts switching the import
 * extension, so it must only use node builtins.
 */
export declare const FABRIC_AGENT_MARKER = "fabricagent-";
export interface SessionExportUsage {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    cost: number;
}
export declare class SessionExporter {
    #private;
    readonly file: string;
    constructor(options: {
        file: string;
        sessionId: string;
        cwd: string;
        agentName: string;
    });
    /**
     * Append one attributed assistant usage line. Zero-usage pushes are skipped
     * so heartbeat-style emissions never write entries; the file and its header
     * are created lazily on the first real push so runs that never touch a model
     * leave nothing behind. Best-effort: any IO failure disables the exporter
     * rather than failing the run.
     */
    push(usage: SessionExportUsage, model?: string, provider?: string, at?: number): void;
}
//# sourceMappingURL=session-export.d.ts.map