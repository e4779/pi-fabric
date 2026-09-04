import type { DiffWordEmphasis } from "./types.js";
import type { ConfidentWordChangeRanges, WordChangeConfidence, WordChangeRanges } from "./types.js";
import { type WordEmphasisToken } from "./tokens.js";
export type { ConfidentWordChangeRanges, WordChangeConfidence, WordChangeRanges } from "./types.js";
export declare function shouldEmphasizeChangedPair(ranges: ConfidentWordChangeRanges, lineConfidence: WordChangeConfidence): boolean;
export declare function changedRanges(before: string, after: string, wordEmphasis: DiffWordEmphasis): WordChangeRanges;
export declare function changedRangesWithConfidence(before: string, after: string, wordEmphasis: DiffWordEmphasis): ConfidentWordChangeRanges;
export declare function changedRangesForTokensWithConfidence(before: string, after: string, beforeTokens: WordEmphasisToken[], afterTokens: WordEmphasisToken[], wordEmphasis: DiffWordEmphasis): ConfidentWordChangeRanges;
//# sourceMappingURL=emphasis.d.ts.map