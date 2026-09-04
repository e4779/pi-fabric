type PairScoreAt = (beforeIndex: number, afterIndex: number) => number;
export declare function suffixAlignedPairs(beforeLength: number, afterLength: number, scoreAt: PairScoreAt): Array<[number, number]>;
export declare function prefixAlignedPairs(beforeLength: number, afterLength: number, scoreAt: PairScoreAt): Array<[number, number]>;
export declare function suffixAlignmentScore(beforeLength: number, afterLength: number, scoreAt: PairScoreAt): number;
export {};
//# sourceMappingURL=alignment.d.ts.map