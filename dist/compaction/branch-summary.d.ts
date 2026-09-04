import type { SessionEntry } from "@earendil-works/pi-coding-agent";
import { type FabricBranchSummaryDetailsV2 } from "./branch-details.js";
import { type CompactionEnricher } from "./enrichers.js";
export interface FabricBranchSummaryCompilation {
    summary: string;
    details: FabricBranchSummaryDetailsV2;
}
export declare const compileFabricBranchSummary: (entriesToSummarize: SessionEntry[], customInstructions?: string, enrichers?: readonly CompactionEnricher[], oldLeafId?: string | null) => FabricBranchSummaryCompilation | undefined;
//# sourceMappingURL=branch-summary.d.ts.map