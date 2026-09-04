import type { FabricFreshnessChecker } from "./freshness.js";
import type { FabricSpeculationConfig, FabricSpeculationReplay, FabricSpeculationRuntime, FabricSpeculationServeResult, FabricSpeculationStats } from "./types.js";
/**
 * Turn-scoped store of pre-launched speculation promises.
 *
 * Correctness contract: a stored promise may only be served to a real call
 * when (1) the mutation epoch has not advanced since the speculation launched
 * — the epoch bumps after any real in-program invocation whose effect kind is
 * not "none" — (2) the entry's freshness checker, when present, still holds,
 * and (3) the entry was launched against the same provider binding the real
 * call resolved: the binding token is part of the cache key, so an entry that
 * a reset could not abort (its speculate() was still mid-describe when the
 * binding was replaced) can never match the replacement's serve key. Entries
 * are take-once (identical duplicate calls each need their own speculation)
 * and are aborted + counted wasted when their execution finishes without
 * serving them or when the turn resets.
 */
export declare class FabricSpeculationStore implements FabricSpeculationRuntime {
    #private;
    constructor(config: Pick<FabricSpeculationConfig, "maxConcurrent" | "maxEntries" | "entryTtlMs">);
    get epoch(): number;
    stats(): FabricSpeculationStats & {
        pending: number;
    };
    bumpEpoch(): void;
    static key(parentToolCallId: string, ref: string, preparedArgs: Record<string, unknown>, bindingToken: string): string;
    /**
     * Register and start a speculative invocation. Returns false when at
     * capacity; the candidate is dropped silently (a miss costs nothing, the
     * real call executes normally later).
     */
    launch(parentToolCallId: string, ref: string, preparedArgs: Record<string, unknown>, execute: (signal: AbortSignal) => Promise<unknown>, freshness: FabricFreshnessChecker | undefined, replay: FabricSpeculationReplay, bindingToken: string): boolean;
    tryServe(parentToolCallId: string, ref: string, preparedArgs: Record<string, unknown>, bindingToken: string): Promise<FabricSpeculationServeResult>;
    /** Execution for this tool call finished: everything unserved is waste. */
    onInvocationEnd(parentToolCallId: string): void;
    /** Turn backstop: speculation never outlives a turn. */
    reset(): void;
}
//# sourceMappingURL=store.d.ts.map