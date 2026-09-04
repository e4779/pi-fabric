import type { SessionEntry } from "@earendil-works/pi-coding-agent";
export type ContextMessage = {
    role: string;
} & Record<string, unknown>;
export declare const sessionEntryToContextMessages: (entry: SessionEntry) => ContextMessage[];
export declare const buildSessionContext: (entries: readonly SessionEntry[], leafId?: string, byId?: Map<string, SessionEntry>) => {
    messages: ContextMessage[];
    thinkingLevel: string;
    model: {
        provider: string;
        modelId: string;
    } | null;
};
//# sourceMappingURL=session-context.d.ts.map