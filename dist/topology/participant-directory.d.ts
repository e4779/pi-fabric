import type { FabricMainAgentInfo } from "../main-agent.js";
import { MeshStore, type MeshIdentity } from "../mesh/store.js";
import type { FabricParticipantInfo, FabricParticipantListOptions, FabricParticipantRecord, FabricParticipantSource, FabricPeerInfo } from "./types.js";
export interface ParticipantDirectoryOptions {
    enabled: boolean;
    hostId: string;
    rootId: string;
    identity: MeshIdentity;
    selfOwnerHostId?: string;
    selfOwnerIdentityId?: string;
    heartbeatMs?: number;
    leaseMs?: number;
}
export type ParticipantSnapshotSource = () => FabricParticipantRecord[];
export declare class ParticipantDirectory implements FabricParticipantSource {
    #private;
    readonly mesh: MeshStore;
    readonly options: ParticipantDirectoryOptions;
    constructor(mesh: MeshStore, options: ParticipantDirectoryOptions);
    registerSource(source: ParticipantSnapshotSource): () => void;
    start(): Promise<void>;
    scheduleRefresh(): void;
    refresh(): Promise<void>;
    list(options?: FabricParticipantListOptions, now?: number): FabricParticipantInfo[];
    get(id: string, now?: number): FabricParticipantInfo | undefined;
    self(now?: number): FabricParticipantInfo;
    peers(now?: number): FabricPeerInfo[];
    root(main: FabricMainAgentInfo): FabricParticipantRecord;
    quiesce(): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=participant-directory.d.ts.map