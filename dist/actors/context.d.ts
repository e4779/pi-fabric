interface ActorDigest {
    filesTouched: string[];
    openErrors: number;
    lastError: string;
    lastUserRequest: string;
}
export interface ActorContext {
    digest: ActorDigest;
    transcript: string[];
}
export declare const buildActorContext: (branch: unknown[], tailCount: number, maxChars: number) => ActorContext;
export {};
//# sourceMappingURL=context.d.ts.map