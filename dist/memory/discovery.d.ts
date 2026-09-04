export interface SessionRef {
    id: string;
    file: string;
    cwd: string;
    mtime: number;
}
export interface ResolveScopeInput {
    agentDir: string;
    cwd: string;
    scope: string;
    sessionId?: string;
    sessionFile?: string;
    maxSessions: number;
}
/** Encode a cwd into the safe directory name pi stores session files under. */
export declare const encodeCwdDir: (cwd: string) => string;
/**
 * Enumerate every session JSONL file under the agent dir, newest first by
 * file mtime. Bounded by `maxSessions`. Returns refs with resolved cwd and
 * sessionId from each file header (falling back to the file stem).
 */
export declare const enumerateAllSessions: (agentDir: string, maxSessions: number) => SessionRef[];
export declare class AmbiguousSessionError extends Error {
    readonly session: string;
    readonly candidates: string[];
    readonly code = "ambiguous_session";
    constructor(session: string, candidates: string[]);
}
export declare const resolveSessionTarget: (agentDir: string, target: string) => SessionRef | null;
/**
 * Resolve a scope string into the concrete set of session files to search.
 *
 * - `session` (default): the current session file (from invocation context
 *   if available, else the newest session for the current cwd).
 * - `project`: all sessions stored under the current cwd's default session dir.
 * - `global`: all sessions under the agent dir, bounded by `maxSessions`.
 * - `session:<id-or-path>`: one specific session by id or file path.
 */
export declare const resolveScope: (input: ResolveScopeInput) => SessionRef[];
//# sourceMappingURL=discovery.d.ts.map