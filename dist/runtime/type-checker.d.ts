export interface FabricTypeError {
    line: number;
    column: number;
    message: string;
}
export interface FabricTypeCheckResult {
    errors: FabricTypeError[];
    javascript?: string;
    sourceMap?: string;
}
export declare const normalizeTypeScriptPath: (fileName: string) => string;
/** Guest programs execute inside this wrapper; user code starts on wrapped line 2. */
export declare const wrapFabricGuestCode: (code: string) => string;
export interface FabricTranspileResult {
    code: string;
    sourceMap?: string;
}
export declare const transpileFabricCodeWithSourceMap: (code: string) => FabricTranspileResult;
export declare const typeCheckFabricCode: (code: string, declarations: string) => FabricTypeCheckResult;
//# sourceMappingURL=type-checker.d.ts.map