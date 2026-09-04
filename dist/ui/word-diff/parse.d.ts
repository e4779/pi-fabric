export type ParsedDiffLine = {
    kind: "+" | "-" | " ";
    lineNumber: string;
    content: string;
};
export type AddedDiffLine = ParsedDiffLine & {
    kind: "+";
};
export type RemovedDiffLine = ParsedDiffLine & {
    kind: "-";
};
export declare function diffLineNumberWidth(lines: Array<ParsedDiffLine | null>): number;
export declare function formatDiffLineNumber(lineNumber: string, width: number): string;
export declare function parseDiffLine(line: string): ParsedDiffLine | null;
export declare function isAddedDiffLine(line: ParsedDiffLine | null): line is AddedDiffLine;
export declare function isRemovedDiffLine(line: ParsedDiffLine | null): line is RemovedDiffLine;
//# sourceMappingURL=parse.d.ts.map