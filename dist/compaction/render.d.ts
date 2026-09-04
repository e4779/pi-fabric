import type { Sections } from "./projections.js";
export interface RenderOptions {
    firstEntryId: string;
    lastEntryId: string;
    lastTimestamp: string;
    requestLines?: string[];
    summaryKind?: "compaction" | "branch";
}
export declare const renderSummary: (sections: Sections, options: RenderOptions) => string;
//# sourceMappingURL=render.d.ts.map