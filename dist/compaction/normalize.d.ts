import type { SessionEntry } from "@earendil-works/pi-coding-agent";
import type { FabricExecutionOutcomeV1, FabricTraceJsonValue } from "../audit/trace.js";
import { type FabricProjectionSource } from "./trace-events.js";
interface EventBase {
    index: number;
    entryId: string;
    sourceEntryId: string;
}
interface UserEvent extends EventBase {
    kind: "user";
    text: string;
}
interface AssistantTextEvent extends EventBase {
    kind: "assistantText";
    text: string;
}
interface CustomMessageEvent extends EventBase {
    kind: "customMessage";
    customType: string;
    text: string;
    display: boolean;
    details?: FabricTraceJsonValue;
}
export interface ToolCallEvent extends EventBase {
    kind: "toolCall";
    toolCallId: string;
    name: string;
    args: Record<string, unknown>;
}
interface ToolResultEvent extends EventBase {
    kind: "toolResult";
    toolCallId: string;
    toolName: string;
    isError: boolean;
    text: string;
}
interface BashEvent extends EventBase {
    kind: "bash";
    toolCallId: string;
    command: string;
    isError: boolean;
    exitCode: number | null;
    error?: string;
}
interface FabricPhaseEvent extends EventBase {
    kind: "fabricPhase";
    subordinal: string;
    address: string;
    phase: string;
}
export interface FabricRunEvent extends EventBase {
    kind: "fabricRun";
    toolCallId: string;
    subordinal: string;
    address: string;
    name: string;
    description?: string;
    outcome: FabricExecutionOutcomeV1;
    source: FabricProjectionSource | "result" | "branch";
}
interface FabricOperationEvent extends EventBase {
    kind: "fabricOperation";
    subordinal: string;
    address: string;
    ref: string;
    provider?: string;
    action?: string;
    tool: string;
    args: Record<string, FabricTraceJsonValue>;
    outcome: FabricExecutionOutcomeV1;
    error?: string;
    result?: FabricTraceJsonValue;
    source: FabricProjectionSource | "branch";
}
export type CompactionEvent = UserEvent | AssistantTextEvent | CustomMessageEvent | ToolCallEvent | ToolResultEvent | BashEvent | FabricPhaseEvent | FabricRunEvent | FabricOperationEvent;
export declare const isPiCustomMessageEntry: (entry: SessionEntry) => entry is Extract<SessionEntry, {
    type: "custom_message";
}>;
declare const firstLine: (text: string) => string;
export declare const normalizeEntries: (entries: SessionEntry[]) => CompactionEvent[];
export declare const countErasedThinkingBlocks: (entries: SessionEntry[]) => number;
export { firstLine };
//# sourceMappingURL=normalize.d.ts.map