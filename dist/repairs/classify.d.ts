import type { RepairClassification } from "./types.js";
export declare const classifyInvalidArgs: (ref: string, message: string, extraKeys?: readonly string[]) => RepairClassification;
export declare const classifyUnknownAction: (ref: string) => RepairClassification;
export declare const classifyTypeErrors: (messages: readonly string[], enclosingTool?: string) => RepairClassification[];
export declare const classifyToolResult: (input: {
    toolName?: string;
    isError?: boolean;
    content?: unknown;
}) => RepairClassification | undefined;
//# sourceMappingURL=classify.d.ts.map