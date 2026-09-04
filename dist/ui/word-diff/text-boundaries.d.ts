export type TextBoundarySegment = {
    value: string;
    start: number;
    end: number;
};
export declare function commonPrefixLength(before: string, after: string): number;
export declare function commonSuffixLength(before: string, after: string, prefixLength: number): number;
export declare function needsBoundarySafeOffsets(text: string): boolean;
export declare function textBoundarySegments(text: string): TextBoundarySegment[];
export declare function rangesAtGraphemeBoundaries(text: string, ranges: Array<[number, number]>): Array<[number, number]>;
//# sourceMappingURL=text-boundaries.d.ts.map