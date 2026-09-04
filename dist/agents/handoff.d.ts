import { type SessionEntry } from "@earendil-works/pi-coding-agent";
import type { AgentSessionSeed, AgentToolResultMessage, HandoffCompactionRequest } from "./types.js";
import { type ThinkingTransferInput } from "./thinking-transfer.js";
interface HandoffSessionSource {
    getBranch(): SessionEntry[];
    getEntry(id: string): SessionEntry | undefined;
    getLeafId(): string | null;
    getSessionFile(): string | undefined;
    getSessionId(): string;
}
interface CurrentModel {
    provider: string;
    id: string;
}
export declare const checkedHandoffCompaction: (value: unknown) => HandoffCompactionRequest | undefined;
export declare const snapshotHandoffSession: (source: HandoffSessionSource, currentModel: CurrentModel | undefined, outerToolResult: AgentToolResultMessage, outerToolCallId: string) => AgentSessionSeed;
export declare const writeHandoffSession: (seed: AgentSessionSeed, cwd: string, directory: string, transfer?: ThinkingTransferInput, compaction?: HandoffCompactionRequest) => string;
export {};
//# sourceMappingURL=handoff.d.ts.map