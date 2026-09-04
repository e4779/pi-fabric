import { type FabricExecutionOutcomeV1, type FabricTraceJsonValue } from "../audit/trace.js";
export type FabricProjectionSource = "trace" | "legacy";
interface FabricProjectionOperation {
    sequence: number;
    ref: string;
    provider?: string;
    action?: string;
    tool: string;
    args: Record<string, FabricTraceJsonValue>;
    outcome: FabricExecutionOutcomeV1;
    error?: string;
    result?: FabricTraceJsonValue;
    source: FabricProjectionSource;
}
export interface FabricProjectionTrace {
    source: FabricProjectionSource;
    outcome?: FabricExecutionOutcomeV1;
    phases: string[];
    operations: FabricProjectionOperation[];
}
export declare const readFabricProjectionTrace: (details: unknown) => FabricProjectionTrace | undefined;
export {};
//# sourceMappingURL=trace-events.d.ts.map