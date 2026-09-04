import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
export interface CompactRequestIntent {
    reason?: string;
    instructions?: string;
    preserve?: string[];
    requestedBy?: string;
}
export interface CompactPendingIntent {
    reason?: string;
    instructions?: string;
    preserve?: string[];
    requestedBy: string;
    requestedAt: number;
}
type CompactCommitStatus = "committed" | "cancelled" | "failed";
export interface CompactLastCommit {
    at: number;
    requestedBy: string;
    status: CompactCommitStatus;
    summary?: string;
    tokensBefore?: number;
    estimatedTokensAfter?: number;
    error?: string;
}
export interface CompactStatus {
    pending?: CompactPendingIntent;
    last?: CompactLastCommit;
}
export interface CompactControllerHooks {
    onRequest?: (intent: CompactPendingIntent) => void;
    onCommit?: (info: CompactLastCommit) => void;
}
export declare class CompactController {
    #private;
    constructor(hooks?: CompactControllerHooks);
    request(intent: CompactRequestIntent): CompactPendingIntent;
    cancel(): void;
    status(): CompactStatus;
    maybeCommit(context: ExtensionContext): Promise<void>;
}
export {};
//# sourceMappingURL=compact-controller.d.ts.map