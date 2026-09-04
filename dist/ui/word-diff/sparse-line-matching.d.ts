import type { AddedDiffLine, RemovedDiffLine } from "./parse.js";
import type { IndexedChangedLine } from "./changed-line.js";
import type { WordChangeConfidence } from "./types.js";
export type SparseChangedLinePair = {
    removedIndex: number;
    addedIndex: number;
    confidence: WordChangeConfidence;
};
type ChangedLineScoreAt = (removedPosition: number, addedPosition: number) => number;
export type SparseLineMatchingPolicy = {
    minPositionalFallbackPairScore: number;
    minChangedLinePairScore: number;
    competingChangedLineScoreAt: (removedLength: number, addedLength: number, removedPosition: number, addedPosition: number, scoreAt: ChangedLineScoreAt) => number;
    isAmbiguousChangedLinePairScore: (score: number, competingScore: number) => boolean;
    isReciprocalBestChangedLinePair: (score: number, competingScore: number) => boolean;
    linePairConfidence: (score: number, competingScore: number) => WordChangeConfidence;
};
export type TopTwoCandidateValues = {
    best: number;
    second: number;
};
export declare function matchChangedLinesSparse(removed: Array<IndexedChangedLine<RemovedDiffLine>>, added: Array<IndexedChangedLine<AddedDiffLine>>, policy: SparseLineMatchingPolicy): SparseChangedLinePair[];
export declare function competingCandidateValue(values: TopTwoCandidateValues | undefined, candidateValue: number): number;
export {};
//# sourceMappingURL=sparse-line-matching.d.ts.map