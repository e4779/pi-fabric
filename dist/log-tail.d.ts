import type { FabricLogLine } from "./agents/types.js";
export interface JsonlPage {
    lines: FabricLogLine[];
    hasMore: boolean;
    before?: number;
}
/** Read a bounded JSONL page backwards from an already validated descriptor. */
export declare const readJsonlPageFromDescriptor: (descriptor: number, limit: number, before?: number, knownSize?: number, maxBytes?: number) => JsonlPage;
/** Read a bounded JSONL page backwards, touching only enough file chunks to fill it. */
export declare const readJsonlPage: (filePath: string, limit: number, before?: number, maxBytes?: number) => JsonlPage;
//# sourceMappingURL=log-tail.d.ts.map