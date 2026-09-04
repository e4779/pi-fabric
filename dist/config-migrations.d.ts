export declare const CURRENT_FABRIC_CONFIG_VERSION = 3;
export interface FabricConfigMigrationResult {
    document: Record<string, unknown>;
    fromVersion: number;
    toVersion: number;
    appliedVersions: number[];
    changed: boolean;
    forwardCompatible: boolean;
}
export declare const migrateFabricConfigDocument: (input: Readonly<Record<string, unknown>>) => FabricConfigMigrationResult;
//# sourceMappingURL=config-migrations.d.ts.map