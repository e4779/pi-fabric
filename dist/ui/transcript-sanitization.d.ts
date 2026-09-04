interface RedactionBudget {
    chars: number;
    nodes: number;
}
export declare const recordOf: (value: unknown) => Record<string, unknown> | undefined;
export declare const terminalSafe: (value: string, trim?: boolean) => string;
export declare const clip: (value: string, max: number, trim?: boolean) => string;
export declare const contentText: (value: unknown) => string;
export declare const messageError: (message: Record<string, unknown>) => string;
export declare const redact: (value: unknown, key?: string, depth?: number, budget?: RedactionBudget) => unknown;
export declare const redactRecord: (value: unknown) => Record<string, unknown> | undefined;
export declare const compactRedactedValue: (value: unknown) => string;
export {};
//# sourceMappingURL=transcript-sanitization.d.ts.map