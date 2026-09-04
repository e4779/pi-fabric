export declare class PartialCodeFieldExtractor {
    #private;
    constructor(maxBytes: number);
    get complete(): boolean;
    /** Decoded `code` content so far, or undefined before the key appears. */
    get code(): string | undefined;
    push(delta: string): void;
}
//# sourceMappingURL=partial-json.d.ts.map