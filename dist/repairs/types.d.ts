export declare const REPAIR_TABLE_VERSION: 1;
export declare const MAX_CATALOG_REPAIRS = 256;
export type RepairStage = "invocation_outer_schema" | "invocation_typecheck" | "invocation_args" | "invocation_unknown_action" | "didactic" | "effect";
interface KeyAliasRepair {
    kind: "keyAlias";
    ref: string;
    from: string;
    to: string;
}
interface ActionAliasRepair {
    kind: "actionAlias";
    provider: string;
    from: string;
    to: string;
}
export type CatalogRepair = KeyAliasRepair | ActionAliasRepair;
export interface RepairTableFile {
    version: typeof REPAIR_TABLE_VERSION;
    catalogDigest: string;
    repairs: CatalogRepair[];
    createdAt: string;
    updatedAt: string;
}
export interface RepairClassification {
    stage: RepairStage;
    fingerprint: string;
    /** When set, a unique mapping the compiler may insert on first hit. */
    candidate?: CatalogRepair;
}
interface RepairFingerprintCount {
    fingerprint: string;
    stage: RepairStage;
    count: number;
}
export interface RepairStatus {
    enabled: boolean;
    catalogDigest: string;
    repairCount: number;
    applyHits: number;
    invocationErrors: number;
    effectDropped: number;
    storeError?: string;
    fingerprints: RepairFingerprintCount[];
    repairs: CatalogRepair[];
}
export declare const repairIdentity: (repair: CatalogRepair) => string;
export declare const emptyRepairTable: (catalogDigest: string, now?: string) => RepairTableFile;
export {};
//# sourceMappingURL=types.d.ts.map