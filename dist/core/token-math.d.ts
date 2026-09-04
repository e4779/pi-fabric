export declare const DEFAULT_COMPACTION_SETTINGS: {
    readonly enabled: true;
    readonly reserveTokens: 16384;
    readonly keepRecentTokens: 20000;
};
type TokenMessage = {
    role: string;
    content?: unknown;
    command?: unknown;
    output?: unknown;
    summary?: unknown;
};
export declare const estimateTokens: (message: TokenMessage) => number;
export declare const calculateContextTokens: (usage: unknown) => number;
export {};
//# sourceMappingURL=token-math.d.ts.map