import { type IndexedChangedLine } from "./changed-line.js";
import { type ChangedLinePair } from "./line-matching.js";
import type { DiffWordEmphasis } from "./types.js";
import { type AddedDiffLine, type ParsedDiffLine, type RemovedDiffLine } from "./parse.js";
import type { ConfidentWordChangeRanges } from "./types.js";
type ChangedLineBlockAnalysis = {
    removed: Array<IndexedChangedLine<RemovedDiffLine>>;
    added: Array<IndexedChangedLine<AddedDiffLine>>;
    pairs: ChangedLinePair[];
    ranges: ChangedLineRangePair[];
};
type ChangedLineRangePair = {
    pair: ChangedLinePair;
    ranges: ConfidentWordChangeRanges;
};
export declare function analyzeChangedLineBlock(block: ParsedDiffLine[], wordEmphasis: DiffWordEmphasis): ChangedLineBlockAnalysis;
export {};
//# sourceMappingURL=change-block.d.ts.map