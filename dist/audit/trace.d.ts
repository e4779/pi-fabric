export declare const FABRIC_EXECUTION_TRACE_KIND: "pi-fabric.execution";
export declare const FABRIC_EXECUTION_TRACE_VERSION: 1;
export declare const FABRIC_EXECUTION_TRACE_MAX_BYTES: number;
export type FabricTraceJsonPrimitive = string | number | boolean | null;
export type FabricTraceJsonValue = FabricTraceJsonPrimitive | FabricTraceJsonValue[] | {
    [key: string]: FabricTraceJsonValue;
};
export type FabricExecutionOutcomeV1 = "succeeded" | "failed" | "aborted" | "timed_out";
export type FabricExecutionFailureStageV1 = "resolve" | "prepare" | "validate" | "approve" | "invoke" | "guard";
export interface FabricExecutionTraceOperationV1 {
    type: "call";
    sequence: number;
    ref: string;
    provider?: string;
    action?: string;
    args: {
        [key: string]: FabricTraceJsonValue;
    };
    outcome: FabricExecutionOutcomeV1;
    failureStage?: FabricExecutionFailureStageV1;
    error?: string;
    result?: FabricTraceJsonValue;
    resultTruncated?: boolean;
}
export interface FabricExecutionTraceCountsV1 {
    droppedValues: number;
    truncatedValues: number;
    redactedValues: number;
    droppedOperations: number;
}
export interface FabricExecutionTraceV1 {
    kind: typeof FABRIC_EXECUTION_TRACE_KIND;
    version: typeof FABRIC_EXECUTION_TRACE_VERSION;
    outcome: FabricExecutionOutcomeV1;
    phases: string[];
    operations: FabricExecutionTraceOperationV1[];
    counts: FabricExecutionTraceCountsV1;
    error?: string;
}
interface MutableCounts {
    droppedValues: number;
    truncatedValues: number;
    redactedValues: number;
}
interface TraceResultMeta {
    resultTruncated?: boolean;
}
interface Sanitized<T extends FabricTraceJsonValue> {
    value: T;
    counts: MutableCounts;
}
interface MutableOperation {
    type: "call";
    sequence: number;
    ref: string;
    projectionRef: string;
    provider?: string;
    action?: string;
    causeSafe?: boolean;
    args: Sanitized<{
        [key: string]: FabricTraceJsonValue;
    }>;
    outcome?: FabricExecutionOutcomeV1;
    failureStage?: FabricExecutionFailureStageV1;
    error?: Sanitized<string>;
    result?: Sanitized<FabricTraceJsonValue>;
    resultTruncated?: boolean;
    droppedResultValues: number;
}
export declare class FabricTraceSafeError extends Error {
}
export declare class FabricResolutionError extends FabricTraceSafeError {
}
export declare class FabricExecutionTraceOperationHandle {
    private readonly recorder;
    private readonly operation;
    constructor(recorder: FabricExecutionTraceRecorder, operation: MutableOperation | undefined);
    resolved(provider: string, action: string): void;
    prepared(args: Record<string, unknown>): void;
    succeed(result: unknown, meta?: TraceResultMeta): void;
    fail(stage: FabricExecutionFailureStageV1, error: unknown, outcome?: FabricExecutionOutcomeV1, result?: unknown, meta?: TraceResultMeta): void;
}
export declare class FabricExecutionTraceRecorder {
    #private;
    sealed: boolean;
    snapshotIdentifier(value: string, maxBytes?: number): string;
    issueCall(ref: string, args: Record<string, unknown>): FabricExecutionTraceOperationHandle;
    seal(outcome: FabricExecutionOutcomeV1, phases: readonly string[], safeError?: string): FabricExecutionTraceV1;
}
export declare const executionOutcomeFromError: (error: unknown, signal?: AbortSignal) => FabricExecutionOutcomeV1;
export declare const isFabricExecutionTraceOperationV1: (value: unknown) => value is FabricExecutionTraceOperationV1;
export declare const isFabricExecutionTraceV1: (value: unknown) => value is FabricExecutionTraceV1;
export declare const readFabricExecutionTraceV1: (value: unknown) => FabricExecutionTraceV1 | undefined;
export {};
//# sourceMappingURL=trace.d.ts.map