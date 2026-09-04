export type FabricFreshnessChecker = () => boolean;
/**
 * Build a serve-time freshness checker for a speculated call, or undefined
 * when the ref relies on epoch invalidation alone (tree-walking reads,
 * session-local stores). The epoch already covers every effect executed inside
 * the program; checkers exist for state that can move independently of the
 * program (the working tree) on refs where checking is O(1).
 */
export declare const createFreshnessChecker: (ref: string, preparedArgs: Record<string, unknown>, cwd: string) => FabricFreshnessChecker | undefined;
//# sourceMappingURL=freshness.d.ts.map