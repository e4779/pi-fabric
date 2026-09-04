export interface FabricWriteBinding {
    path: string;
    stringKey: string;
}
export declare const fabricStringLiterals: (code: string) => string[];
export declare const fabricWriteBindings: (code: string) => FabricWriteBinding[];
export declare const fabricExecTitleHint: (code: string) => string | undefined;
//# sourceMappingURL=fabric-code-parser.d.ts.map