export interface LanguageComplexity {
    readonly language: string;
    readonly extensions: readonly string[];
    count(source: string): number;
}
export interface FileComplexity {
    file: string;
    language: string;
    count: number;
}
export declare const typeScriptJavaScriptComplexity: LanguageComplexity;
export declare const countFileComplexity: (file: string) => FileComplexity | undefined;
//# sourceMappingURL=complexity.d.ts.map