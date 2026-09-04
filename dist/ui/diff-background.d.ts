import type { Theme } from "@earendil-works/pi-coding-agent";
export type DiffBackgroundIntensity = "off" | "subtle" | "medium";
export type DiffLineKind = "add" | "remove";
export declare const markDiffLine: (kind: DiffLineKind, line: string) => string;
export declare const parseMarkedDiffLine: (rawLine: string) => {
    kind?: DiffLineKind;
    line: string;
};
export declare const createDiffBackgroundResolver: (theme: Theme | undefined, intensity: DiffBackgroundIntensity) => ((kind: DiffLineKind) => string | undefined);
export declare const applyDiffBackground: (line: string, background: string | undefined) => string;
export declare const wrapDiffAnsiToWidth: (text: string, width: number, maxRows?: number, continuationPrefix?: string) => string[];
//# sourceMappingURL=diff-background.d.ts.map