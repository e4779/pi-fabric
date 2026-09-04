import type { FabricLogLine } from "../agents/types.js";
import type { FabricAgentTranscript, FabricTranscriptEntry } from "./transcript.js";
export declare class TranscriptAccumulator {
    #private;
    readonly entries: FabricTranscriptEntry[];
    append(events: Array<Record<string, unknown>>): void;
    snapshot(olderAvailable?: boolean, updatedAt?: number, maxEntries?: number): FabricAgentTranscript;
}
export declare const parseRaw: (raw: string) => Record<string, unknown> | undefined;
export declare const parsedEvents: (lines: FabricLogLine[]) => Array<Record<string, unknown>>;
interface ToolLifecycleStart {
    id: string;
    event: Record<string, unknown>;
}
export declare const normalizedToolStarts: (event: Record<string, unknown>) => ToolLifecycleStart[];
export declare const missingToolStartIds: (events: Array<Record<string, unknown>>) => Set<string>;
export {};
//# sourceMappingURL=transcript-parser.d.ts.map