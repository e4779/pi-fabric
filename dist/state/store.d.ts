import { MeshStore, type MeshEvent, type MeshIdentity, type MeshStateEntry } from "../mesh/store.js";
import type { AdvanceHeadInput, StateCertificate, StateComplexityResult, StateComplexitySummary, StateGoal, StateHead, StateTransitionInput, StateTransitionRecord, VerificationReport } from "./types.js";
export type { AdvanceHeadInput, StateCertificate, StateComplexityResult, StateComplexitySummary, StateGoal, StateHead, StateTransitionInput, StateTransitionKind, StateTransitionRecord, VerificationReport, } from "./types.js";
export declare const STATE_TOPIC = "fabric.state";
export declare const CURRENT_KEY = "state/current";
export declare const GOAL_KEY = "state/goal";
export declare const COMPLEXITY_KEY_PREFIX = "state/complexity/";
export declare class StateStore {
    readonly store: MeshStore;
    constructor(store: MeshStore);
    toHead(entry: MeshStateEntry): StateHead;
    get(): {
        head: StateHead | null;
        goal: StateGoal | null;
        complexity: StateComplexitySummary;
        certification: {
            current: StateCertificate | null;
            recent: StateCertificate[];
        };
    };
    getHead(): StateHead | null;
    transition(input: StateTransitionInput, identity: MeshIdentity, cwd?: string): Promise<{
        event: MeshEvent;
        head: StateHead;
    }>;
    private markHeadCommitted;
    advanceHead(input: AdvanceHeadInput): Promise<MeshStateEntry>;
    private advanceHeadWithBefore;
    private rollbackWrites;
    private stateEvents;
    private lastDeletedVersion;
    history(input?: {
        label?: string;
        limit?: number;
        includeArchived?: boolean;
    }): {
        transitions: StateTransitionRecord[];
        labels: string[];
        certifications: StateCertificate[];
    };
    complexity(input: {
        files?: string[];
        cwd: string;
    }): StateComplexityResult;
    private prepareComplexity;
    private complexityLedgers;
    private readComplexityLedger;
    private complexityKey;
    private normalizeComplexityFiles;
    goal(input: {
        check: string;
        description?: string;
    }, identity: MeshIdentity): Promise<MeshStateEntry>;
    checkGoal(input: {
        cwd: string;
        timeoutMs?: number;
        signal?: AbortSignal | undefined;
        identity: MeshIdentity;
    }): Promise<{
        passed: boolean;
        output: string;
        exitCode: number | null;
        error?: string;
    }>;
    private persistCurrentCertificate;
    private revokeCurrentCertificate;
    verify(input: {
        labels?: string[];
        includeArchived?: boolean;
        cwd: string;
        timeoutMs?: number;
        signal?: AbortSignal | undefined;
        identity: MeshIdentity;
    }): Promise<VerificationReport>;
}
//# sourceMappingURL=store.d.ts.map