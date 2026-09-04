import type { AgentRunRecord, AgentUsage, AgentWorkerOptions } from "../agents/types.js";
export declare const emptyUsage: () => AgentUsage;
export declare const createRunningRecord: (options: AgentWorkerOptions, task: string, thinking: AgentRunRecord["thinking"], startedAt: number) => AgentRunRecord;
export declare const writeRunRecord: (filePath: string, record: AgentRunRecord) => void;
export declare const updateRunRecord: (filePath: string, record: AgentRunRecord) => void;
export declare const writeCrashRunRecord: (filePath: string, record: AgentRunRecord, error: unknown) => void;
export declare const applyUsage: (record: AgentRunRecord, message: Record<string, unknown>) => void;
/**
 * Extract the per-message token delta a Pi assistant `message_end` contributed.
 * Unlike `applyUsage`, which mutates the run record, this returns the delta so
 * the worker can attribute a single event without re-deriving it from a
 * post-hoc cumulative diff. Cost is reported in the runner's own total units.
 */
export declare const extractUsageDelta: (message: Record<string, unknown>) => {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    cost: number;
} | undefined;
export declare const latestRunText: (text: string) => string;
//# sourceMappingURL=run-record.d.ts.map