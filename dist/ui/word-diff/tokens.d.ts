export type WordEmphasisToken = {
    value: string;
    start: number;
    end: number;
};
export declare function wordEmphasisTokens(text: string): WordEmphasisToken[];
export declare function wordTokenValues(text: string): string[];
export declare function isIdentifierToken(value: string): boolean;
export declare function isNumberToken(value: string): boolean;
export declare function isSymbolToken(value: string): boolean;
export declare function isMeaningfulOperatorToken(value: string): boolean;
export declare function wordEmphasisTokenWeight(value: string): number;
export declare function splitIdentifierToken(value: string, start: number): WordEmphasisToken[];
export declare function wordEmphasisSimilarityTokenValues(tokens: WordEmphasisToken[]): string[];
export declare function isIdentifierSimilarityPart(value: string): boolean;
//# sourceMappingURL=tokens.d.ts.map