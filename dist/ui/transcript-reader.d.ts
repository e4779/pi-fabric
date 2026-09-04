import type { FabricAgentTranscript, FabricTranscriptSource } from "./transcript.js";
export declare class AgentTranscriptReader {
    #private;
    read(source: FabricTranscriptSource, followLatest?: boolean): FabricAgentTranscript;
    loadOlder(source: FabricTranscriptSource): boolean;
    loadNewer(source: FabricTranscriptSource): boolean;
    loadLatest(source: FabricTranscriptSource): boolean;
    clear(): void;
}
//# sourceMappingURL=transcript-reader.d.ts.map