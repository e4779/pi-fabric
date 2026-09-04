export declare const fabricExecutionKernelGuidance: (fullCodeMode: boolean) => string;
export declare const defaultFabricExecutionGuidance: (fullCodeMode: boolean) => string;
export interface ExtensionRosterToolSource {
    name: string;
    sourceInfo?: {
        source?: string;
        path?: string;
    };
}
export declare const extensionToolRosterGuidance: (tools: ReadonlyArray<ExtensionRosterToolSource>, coreToolNames: ReadonlySet<string>) => string | undefined;
export declare const fabricSchemaGuidance: (mode: "off" | "audit" | "enforce") => string | undefined;
//# sourceMappingURL=system-guidance.d.ts.map