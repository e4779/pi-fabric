export interface RegexLimits {
    maxPatternBytes: number;
    timeoutMs: number;
}
export interface RegexExecutionError {
    code: "invalid_regex" | "regex_pattern_too_large" | "regex_timeout" | "regex_worker_error";
    message: string;
}
export type RegexExecutionResult = {
    complete: true;
    matched: number[];
} | {
    complete: false;
    matched: [];
    error: RegexExecutionError;
};
/** Execute untrusted regex in a disposable worker that can be forcibly terminated. */
export declare const executeBoundedRegex: (pattern: string, haystacks: string[], limits: RegexLimits) => Promise<RegexExecutionResult>;
//# sourceMappingURL=regex.d.ts.map