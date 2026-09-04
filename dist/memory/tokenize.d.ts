export declare const compareLexical: (left: string, right: string) => number;
/** Canonical Unicode-aware lexical tokens with no semantic classification. */
export declare const tokenizeLexical: (text: string) => string[];
export declare const lexicalTermCounts: (text: string) => Map<string, number>;
export type MemoryQueryMode = "literal" | "regex";
export type MemoryQueryPlan = {
    kind: "browse";
} | {
    kind: "terms";
    terms: string[];
} | {
    kind: "regex";
    pattern: string;
};
/** Plan only the explicitly selected query mode. Literal input is never compiled as regex. */
export declare const planMemoryQuery: (query: string | undefined, queryMode?: MemoryQueryMode) => MemoryQueryPlan;
//# sourceMappingURL=tokenize.d.ts.map