import type { SessionEntry } from "@earendil-works/pi-coding-agent";
interface ThinkingTransferSource {
    provider: string;
    modelId: string;
    /** pi-ai transport api of the source model, when the registry resolves it. */
    api?: string | undefined;
}
interface ThinkingTransferTarget {
    provider: string;
    modelId: string;
    api?: string | undefined;
    reasoning?: boolean | undefined;
    /** Model replays thinking as visible text; deliberation must not leak there. */
    requiresThinkingAsText?: boolean | undefined;
}
export interface ThinkingTransferInput {
    source?: ThinkingTransferSource;
    target: ThinkingTransferTarget;
}
export type ThinkingTransferPolicy = "preserved" | "re-signed" | "stripped";
export interface ThinkingTransferReport {
    policy: ThinkingTransferPolicy;
    translated: number;
    dropped: number;
}
export declare const REASONING_CONTENT_SIGNATURE = "reasoning_content";
export declare const thinkingTransferPolicy: (input: ThinkingTransferInput) => ThinkingTransferPolicy;
export declare const translateThinkingForExecutor: (entries: SessionEntry[], policy: ThinkingTransferPolicy) => {
    entries: SessionEntry[];
    report: ThinkingTransferReport;
};
export declare const THINKING_DIGEST_CUSTOM_TYPE = "pi-fabric-handoff-thinking";
export interface ThinkingDigest {
    content: string;
    citedBlocks: number;
}
export declare const buildThinkingDigest: (entries: SessionEntry[], input: ThinkingTransferInput) => ThinkingDigest | undefined;
export {};
//# sourceMappingURL=thinking-transfer.d.ts.map