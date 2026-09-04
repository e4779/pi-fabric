import type { FabricPeerInfo } from "./types.js";
/**
 * Derive a Linear-style label prefix from a project path's basename:
 * "pi-queue-steer" -> "PQS", "fabric" -> "FAB". Falls back to "P".
 */
export declare const peerLabelPrefix: (cwd: string | undefined) => string;
/** Snapshot of one root peer session for pickers and status lines. */
export interface FabricPeerCard {
    id: string;
    label: string;
    status: "idle" | "running";
    model?: string;
    cwd?: string;
    startedAt: number;
    updatedAt: number;
    pendingMessages: boolean;
}
/** Labels are chronological, so creation order is simply label minting order. */
export declare const buildPeerCards: (peers: readonly FabricPeerInfo[]) => FabricPeerCard[];
interface PeerSettleProgress {
    waiting: Array<{
        label: string;
        status: "idle" | "running";
    }>;
}
export type PeerSettleResult = {
    ok: true;
} | {
    ok: false;
    error: string;
};
export interface AwaitPeerSettleOptions {
    /** Fresh peer snapshot source (typically FabricRuntimeState.peerInfos()). */
    poll: () => FabricPeerInfo[];
    /** Peer label (case-insensitive) or exact participant id. Omitted means all peers. */
    selector?: string;
    settledForMs?: number;
    pollMs?: number;
    now?: () => number;
    signal?: AbortSignal;
    onUpdate?: (progress: PeerSettleProgress) => void;
}
/**
 * Wait until every watched peer has settled: only runs that started after
 * arming delay it (an idle-at-arm peer satisfies once the quiet window
 * passes), and a peer vanishing from the mesh counts as settled since it can
 * no longer conflict.
 */
export declare const awaitPeerSettle: (options: AwaitPeerSettleOptions) => Promise<PeerSettleResult>;
export {};
//# sourceMappingURL=peer-settle.d.ts.map