import type { WordChangeConfidence } from "./types.js";
import type { AddedDiffLine, RemovedDiffLine } from "./parse.js";
import type { IndexedChangedLine } from "./changed-line.js";
export type ChangedLinePair = {
    removedIndex: number;
    addedIndex: number;
    confidence: WordChangeConfidence;
};
export declare function matchChangedLines(removed: Array<IndexedChangedLine<RemovedDiffLine>>, added: Array<IndexedChangedLine<AddedDiffLine>>): ChangedLinePair[];
//# sourceMappingURL=line-matching.d.ts.map