import { type FabricExecutionTraceV1 } from "./trace.js";
export declare const FABRIC_EXECUTION_DETAILS_MAX_BYTES: number;
export interface FabricPersistedExecutionDetailsV1 {
    success: boolean;
    trace: FabricExecutionTraceV1;
    /** Rich render audits persisted verbatim (minus in-memory media) so a resumed transcript re-renders — and expands — exactly like the live one. */
    audits: FabricLegacyRenderAudit[];
    phases: string[];
    error?: string;
    outputFormat?: "yaml" | "json";
    outputFormatStartLine?: number;
    outputFormatLines?: number;
}
/**
 * The audit fields that cross into the session record; read back by
 * {@link legacyAudit}. In-memory-only payloads (image blocks, media notes,
 * correlation ids) never persist.
 */
export interface FabricPersistableAuditInput {
    ref: string;
    tool?: string;
    provider?: string;
    success?: boolean;
    error?: string;
    args?: Record<string, unknown>;
    result?: unknown;
    resultTruncated?: boolean;
    preview?: unknown;
    startedAt?: number;
    endedAt?: number;
}
export interface FabricLegacyRenderAudit {
    ref: string;
    tool?: string;
    provider?: string;
    success?: boolean;
    error?: string;
    args?: Record<string, unknown>;
    result?: unknown;
    resultTruncated?: boolean;
    preview?: unknown;
    /** Set only when reconstructed from the durable trace: args are privacy-projected and results/previews are not retained. */
    fromTrace?: boolean;
    startedAt?: number;
    endedAt?: number;
}
export interface FabricExecutionRenderDetails {
    success?: boolean;
    error?: string;
    progress?: string;
    outputFormat?: "yaml" | "json";
    outputFormatStartLine?: number;
    outputFormatLines?: number;
    phases: string[];
    audits: FabricLegacyRenderAudit[];
}
/**
 * Creates the only object stored in final fabric_exec details. The
 * privacy-projected trace stays the functional record for compaction and tool
 * ownership; rich call audits persist verbatim (minus in-memory media) so a
 * resumed transcript re-renders and expands exactly like the live one — the
 * collapsed display, not the session record, is the visual boundary. The
 * aggregate object, not each member independently, is bound; display-only
 * audits trim before the functional trace.
 */
export declare const createFabricPersistedExecutionDetails: (input: {
    success: boolean;
    trace: FabricExecutionTraceV1;
    audits?: readonly FabricPersistableAuditInput[];
    phases?: readonly string[];
    error?: string;
    outputFormat?: "yaml" | "json";
    outputFormatStartLine?: number;
    outputFormatLines?: number;
}) => FabricPersistedExecutionDetailsV1;
/**
 * Adapts both old audit-bearing session details and current trace-only details
 * for rendering. Legacy audits win when present so old transcripts retain
 * their historical rich previews.
 */
export declare const readFabricExecutionRenderDetails: (value: unknown) => FabricExecutionRenderDetails;
//# sourceMappingURL=details.d.ts.map