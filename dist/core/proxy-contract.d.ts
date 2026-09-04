export declare const PROXY_CONTRACT_CUSTOM_TYPE = "pi-fabric-proxy";
export declare const isRewritableCapturedToolName: (name: string) => boolean;
export declare const rewritableHiddenCapturedToolNames: (names: Iterable<string>) => string[];
export declare const extractSkillRegions: (text: string) => string;
export declare const capturedToolMentions: (text: string, names: readonly string[]) => string[];
export declare const proxyContractMentionsInSkills: (prompt: string, systemPrompt: string, names: readonly string[]) => string[];
export declare const formatProxyContractReminder: (names: readonly string[]) => string;
/**
 * Branch-local set of captured names already reminded. Restored from
 * `pi-fabric-proxy` transcript entries only — never counted as furnace fires.
 */
export declare class ProxyContractLedger {
    #private;
    reset(): void;
    restoreFromEntries(entries: readonly unknown[]): void;
    take(candidates: readonly string[]): string[];
}
//# sourceMappingURL=proxy-contract.d.ts.map