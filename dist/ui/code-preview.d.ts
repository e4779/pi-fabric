type DiffBackgroundIntensity = "off" | "subtle" | "medium";
type DiffWordEmphasis = "all" | "smart" | "off";
type ToolCallBackgroundMode = "on" | "border" | "off";
type PathIconMode = "unicode" | "nerd" | "off";
type CodePreviewToolName = "bash" | "read" | "write" | "edit" | "grep" | "find" | "ls";
export interface CodePreviewSettings {
    shikiTheme: string;
    diffIntensity: DiffBackgroundIntensity;
    wordEmphasis: DiffWordEmphasis;
    toolCallBackground: ToolCallBackgroundMode;
    toolCallTiming: boolean;
    readCollapsedLines: number;
    readContentPreview: boolean;
    writeContentPreview: boolean;
    writeCollapsedLines: number;
    editDiffPreview: boolean;
    editCollapsedLines: number | "all";
    grepCollapsedLines: number;
    grepResultPreview: boolean;
    findResultPreview: boolean;
    lsResultPreview: boolean;
    pathListCollapsedLines: number;
    readLineNumbers: boolean;
    bashResultPreview: boolean;
    bashWarnings: boolean;
    syntaxHighlighting: boolean;
    secretWarnings: boolean;
    pathIcons: PathIconMode;
    tools: CodePreviewToolName[];
}
export type ShikiThemeVariant = "light" | "dark";
/**
 * Parse a shiki theme preference into per-variant theme ids. "auto" resolves to
 * the built-in pair and tracks Pi's resolved variant at render time; a
 * "<light>/<dark>" pair fixes both variants explicitly; anything else is a
 * single variant-independent theme id.
 */
export declare const parseShikiThemePreference: (preference: string) => {
    lightTheme: string;
    darkTheme: string;
    followsVariant: boolean;
};
/** Resolve the effective shiki theme id for a preference and variant. */
export declare const resolveShikiTheme: (preference: string, variant: ShikiThemeVariant) => string;
/** Environment-backed defaults; fabric.json "codePreview" layers override these. */
export declare const defaultCodePreviewSettings: () => CodePreviewSettings;
/**
 * Validate a fabric.json "codePreview" section on top of the environment-backed
 * defaults. Unknown or mistyped values are ignored.
 */
export declare const normalizeCodePreviewSettings: (raw: unknown) => CodePreviewSettings;
export {};
//# sourceMappingURL=code-preview.d.ts.map