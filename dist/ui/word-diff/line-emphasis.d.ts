import type { ParsedDiffLine } from "./parse.js";
import type { DiffWordEmphasis } from "./types.js";
export declare const changedLineEmphasis: (block: ParsedDiffLine[], wordEmphasis: DiffWordEmphasis) => Map<number, {
    ranges: Array<[number, number]>;
    kind: "add" | "remove";
}>;
//# sourceMappingURL=line-emphasis.d.ts.map