import type { FabricResultFormat } from "../config.js";
export declare const formatJsonAsYaml: (value: unknown) => string | undefined;
export interface FormattedFabricValue {
    text: string;
    language?: "yaml" | "json";
    highlightedLineCount?: number;
}
export declare const formatFabricValue: (value: unknown, format: FabricResultFormat, maxChars?: number) => FormattedFabricValue;
//# sourceMappingURL=structured.d.ts.map