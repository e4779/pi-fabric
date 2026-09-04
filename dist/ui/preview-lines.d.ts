export type PreviewLineEntry<T> = {
    kind: "line";
    line: T;
    index: number;
} | {
    kind: "hidden";
    hidden: number;
};
export declare function countContentLines(content: string): number;
export declare function selectPreviewTextLines(text: string, limit: number): {
    entries: Array<PreviewLineEntry<string>>;
    shown: number;
    hidden: number;
    total: number;
};
//# sourceMappingURL=preview-lines.d.ts.map