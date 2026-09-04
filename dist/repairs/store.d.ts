import { type RepairTableFile } from "./types.js";
export declare const repairsDirectory: (agentDir: string) => string;
export interface LoadedRepairTable {
    table: RepairTableFile;
    error?: string;
}
export declare const loadRepairTable: (directory: string, catalogDigest: string) => LoadedRepairTable;
export declare const saveRepairTable: (directory: string, table: RepairTableFile) => RepairTableFile;
//# sourceMappingURL=store.d.ts.map