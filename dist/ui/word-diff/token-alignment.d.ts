import type { WordChangeConfidence } from "./types.js";
import { type WordEmphasisToken } from "./tokens.js";
import type { TokenGroup } from "./ranges.js";
export type ChangedTokenGap = {
    removed: TokenGroup;
    added: TokenGroup;
};
export declare function collectChangedTokenGaps(before: WordEmphasisToken[], beforeStart: number, beforeEnd: number, after: WordEmphasisToken[], afterStart: number, afterEnd: number, gaps: ChangedTokenGap[]): WordChangeConfidence;
//# sourceMappingURL=token-alignment.d.ts.map