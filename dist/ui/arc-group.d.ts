import type { Theme } from "@earendil-works/pi-coding-agent";
/**
 * Returns `lines` with the trailing run of arc items converted to continuation
 * items so a following arc can close the group. Returns the input untouched
 * when no arc item trails the block.
 */
export declare function continueArcGroup(lines: string[]): string[];
/** Arc item line with a plain label; glyph and label are muted. */
export declare function arcItem(theme: Theme, label: string): string;
/** Arc item line with a pre-styled label; only the glyph is muted. */
export declare function arcItemStyled(theme: Theme, label: string): string;
/**
 * Appends an arc item to `lines`, converting the preceding arc run into
 * continuation items so the new item is the group's only closing corner.
 */
export declare function pushArcItem(lines: string[], item: string): void;
//# sourceMappingURL=arc-group.d.ts.map