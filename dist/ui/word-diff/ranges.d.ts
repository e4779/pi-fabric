import type { WordEmphasisToken } from "./tokens.js";
export type TextRange = [number, number];
export type TokenGroup = {
    start: number;
    end: number;
};
export declare function rangesForTokenGroup(tokens: WordEmphasisToken[], group: TokenGroup): TextRange[];
export declare function pushTokenRange(ranges: TextRange[], token: WordEmphasisToken): void;
export declare function mergeRangesByStart(ranges: TextRange[]): TextRange[];
export declare function mergeRanges(ranges: TextRange[]): TextRange[];
//# sourceMappingURL=ranges.d.ts.map