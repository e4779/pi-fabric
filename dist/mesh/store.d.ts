export interface MeshIdentity {
    id: string;
    name: string;
    kind: "main" | "actor" | "agent";
    sessionId?: string;
}
export interface MeshEvent {
    id: string;
    sequence: number;
    topic: string;
    kind: string;
    from: MeshIdentity;
    to?: string;
    text?: string;
    data?: unknown;
    createdAt: number;
}
export interface MeshTailResult {
    events: MeshEvent[];
    nextOffset: number;
}
export interface MeshStateEntry {
    key: string;
    value: unknown;
    version: number;
    updatedAt: number;
    updatedBy: MeshIdentity;
}
export interface MeshStoreOptions {
    maxEventLogBytes?: number;
    retainedEventLogBytes?: number;
    maxStateBytes?: number;
    maxStateTombstones?: number;
    lockTimeoutMs?: number;
    staleLockMs?: number;
}
export declare class MeshStore {
    #private;
    readonly root: string;
    readonly maxEventBytes: number;
    readonly maxReadEvents: number;
    constructor(root: string, maxEventBytes: number, maxReadEvents: number, options?: MeshStoreOptions);
    publish(input: {
        topic: string;
        kind?: string;
        from: MeshIdentity;
        to?: string;
        text?: string;
        data?: unknown;
    }): Promise<MeshEvent>;
    read(input?: {
        after?: number;
        topic?: string;
        to?: string;
        limit?: number;
    }): MeshEvent[];
    latestSequence(): number;
    latestOffset(): number;
    tail(cursor: number, limit?: number): MeshTailResult;
    get(key: string): MeshStateEntry | undefined;
    list(prefix?: string, limit?: number): MeshStateEntry[];
    /** Internal project-state scan for host-managed indexes that must reconcile every key. */
    listAll(prefix?: string): MeshStateEntry[];
    put(input: {
        key: string;
        value: unknown;
        identity: MeshIdentity;
        ifVersion?: number;
    }): Promise<MeshStateEntry>;
    delete(input: {
        key: string;
        ifVersion?: number;
    }): Promise<{
        deleted: boolean;
        version?: number;
    }>;
}
//# sourceMappingURL=store.d.ts.map