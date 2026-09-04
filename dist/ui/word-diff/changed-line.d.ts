import type { AddedDiffLine, RemovedDiffLine } from "./parse.js";
import { type WordEmphasisToken } from "./tokens.js";
export type IndexedChangedLine<T extends AddedDiffLine | RemovedDiffLine> = {
    index: number;
    line: T;
    normalizedContent?: string;
    tokens?: WordEmphasisToken[];
    similarityTokenValues?: string[];
    similarityFeatureValues?: string[];
};
export declare function indexedChangedLine<T extends AddedDiffLine | RemovedDiffLine>(index: number, line: T): IndexedChangedLine<T>;
export declare function normalizedChangedContent(line: IndexedChangedLine<AddedDiffLine | RemovedDiffLine>): string;
export declare function changedLineTokens(line: IndexedChangedLine<AddedDiffLine | RemovedDiffLine>): WordEmphasisToken[];
//# sourceMappingURL=changed-line.d.ts.map