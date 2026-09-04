export declare const FABRIC_COMPACTION_REQUEST_PREFIX = "__pi_fabric_compact_request_v1__:";
export declare const MAX_COMPACTION_INSTRUCTIONS_CHARS: number;
export declare const MAX_PRESERVE_ITEMS = 16;
export declare const MAX_PRESERVE_ITEM_CHARS: number;
export declare const MAX_TYPED_COMPACTION_SOURCE_BYTES: number;
export interface TypedCompactionRequest {
    version: 1;
    instructions?: string;
    preserve?: string[];
}
export interface CompactionInstructionPolicy {
    mode: "none" | "plain" | "typed-v1";
    canonicalized: boolean;
    sourceBytes: number;
    truncated: boolean;
    preserveCount: number;
    omittedPreserveCount: number;
}
type CompactionInstructionErrorCode = "encoded-source-too-large" | "malformed-json" | "duplicate-field" | "invalid-unicode" | "structure-too-complex" | "invalid-object" | "unknown-field" | "unsupported-version" | "invalid-type" | "instructions-too-large" | "preserve-too-many" | "preserve-item-too-large";
export interface CompactionInstructionDecodeError {
    code: CompactionInstructionErrorCode;
    message: string;
    sourceBytes: number;
}
export type DecodedCompactionInstructions = {
    ok: true;
    requestLines: string[];
    policy: CompactionInstructionPolicy;
} | {
    ok: false;
    requestLines: [];
    error: CompactionInstructionDecodeError;
};
export declare const compactionRequestBoundsError: (request: Omit<TypedCompactionRequest, "version">) => Omit<CompactionInstructionDecodeError, "sourceBytes"> | undefined;
export declare const encodeCompactionRequest: (request: Omit<TypedCompactionRequest, "version">) => string;
export declare const decodeCompactionInstructions: (source: string | undefined) => DecodedCompactionInstructions;
export {};
//# sourceMappingURL=instructions.d.ts.map