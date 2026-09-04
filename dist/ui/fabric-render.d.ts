import type { Theme } from "@earendil-works/pi-coding-agent";
import type { CodePreviewSettings } from "./code-preview.js";
import { type Component } from "@earendil-works/pi-tui";
import { type FabricWriteBinding } from "./fabric-code-parser.js";
export { fabricWriteBindings, type FabricWriteBinding } from "./fabric-code-parser.js";
import { type DiffBackgroundIntensity } from "./diff-background.js";
export interface FabricRenderAudit {
    ref: string;
    tool?: string;
    provider?: string;
    success?: boolean;
    error?: string;
    args?: Record<string, unknown>;
    result?: unknown;
    resultTruncated?: boolean;
    preview?: unknown;
    /** True for audits reconstructed from the durable trace: args are privacy-projected and results/previews were never persisted. */
    fromTrace?: boolean;
    startedAt?: number;
    endedAt?: number;
    previewHeadline?: string;
}
export declare const inheritEnclosingBackground: (text: string) => string;
export declare const safeTerminalText: (value: string) => string;
export declare const inheritComponentBackground: (component: Component) => Component;
export declare const renderBoundedLines: (lines: string[], theme?: Theme, diffIntensity?: DiffBackgroundIntensity, wrapLineIndexes?: ReadonlySet<number>) => Component;
export declare const fabricMulticallCallLimit: (expanded: boolean) => number;
/** Render the "keybinding to expand" hint, mirroring pi core's native tool previews. */
export declare function expandHint(theme: Theme): string;
export declare const restoreLegacyBashCommands: (audits: FabricRenderAudit[], fabricArgs: unknown) => FabricRenderAudit[];
export interface FabricWriteArgumentPreviewInput {
    bindings: FabricWriteBinding[];
    strings?: Record<string, string> | undefined;
    expanded: boolean;
    cwd?: string | undefined;
    settings?: CodePreviewSettings | undefined;
    spinner?: string | undefined;
}
export declare const renderFabricWriteArgumentPreview: (input: FabricWriteArgumentPreviewInput, theme: Theme, invalidate?: () => void) => Component | null;
/** Compact one-line title for a nested Fabric call, e.g. `read src/index.ts` or `$ ls -la`. */
export declare function nestedCallTitle(audit: FabricRenderAudit, theme: Theme, invalidate?: () => void, core?: {
    cwd: string;
    settings: CodePreviewSettings;
}): string;
type AgentToolPreviewRenderOptions = {
    expanded: boolean;
    compact?: boolean | undefined;
    showTools?: boolean | undefined;
    core?: {
        cwd: string;
        settings: CodePreviewSettings;
    } | undefined;
    invalidate?: (() => void) | undefined;
};
export declare const renderAgentToolPreviewLines: (audit: FabricRenderAudit, theme: Theme, options: AgentToolPreviewRenderOptions) => string[];
interface FabricMulticallPreview {
    auditIndex: number;
    body: string;
    hidden: number;
}
export interface FabricMulticallPartialInput {
    audits: FabricRenderAudit[];
    phases: string[];
    progress?: string | undefined;
    expanded: boolean;
    preview?: FabricMulticallPreview | undefined;
    core?: {
        cwd: string;
        settings: CodePreviewSettings;
    } | undefined;
    showAgentToolPreview?: boolean | undefined;
    spinner?: string | undefined;
    activityLabel?: string | undefined;
}
export declare const singleCallProgressLine: (progress: string | undefined, previewLines: string[]) => string;
export declare const compactProgressPreview: (progress: string) => string;
export declare const renderFabricMulticallPartial: (input: FabricMulticallPartialInput, theme: Theme, invalidate?: () => void) => Component;
export interface FabricCoreToolPreview extends FabricRenderAudit {
    ref: string;
}
export declare const captureFabricCoreToolPreviews: (audits: FabricRenderAudit[], previous?: FabricCoreToolPreview[]) => FabricCoreToolPreview[];
export declare const restoreFabricCoreToolPreviews: (audits: FabricRenderAudit[], previews: FabricCoreToolPreview[]) => FabricRenderAudit[];
export interface FabricAgentPreview {
    ref: string;
    id: string;
    preview: unknown;
}
export declare const captureFabricAgentPreviews: (audits: FabricRenderAudit[], previous?: FabricAgentPreview[]) => FabricAgentPreview[];
export declare const restoreFabricAgentPreviews: (audits: FabricRenderAudit[], previews: FabricAgentPreview[]) => FabricRenderAudit[];
export interface FabricWritePreview {
    ref: string;
    path?: string | undefined;
    content: string;
}
export declare const captureFabricWritePreviews: (audits: FabricRenderAudit[]) => FabricWritePreview[];
export interface FabricCallHeadlinePreview {
    ref: string;
    headline: string;
}
export declare const captureFabricCallHeadlinePreviews: (audits: FabricRenderAudit[]) => FabricCallHeadlinePreview[];
export declare const restoreFabricCallHeadlinePreviews: (audits: FabricRenderAudit[], previews: FabricCallHeadlinePreview[]) => FabricRenderAudit[];
export declare const restoreFabricWritePreviews: (audits: FabricRenderAudit[], previews: FabricWritePreview[]) => FabricRenderAudit[];
/** Extract the human-readable body text from a nested call result or write arguments, if any. */
export declare function nestedCallBody(audit: FabricRenderAudit): string | undefined;
/** Source code + language for syntax highlighting, for reads (file content) and writes (content being written). */
export declare function nestedCallCode(audit: FabricRenderAudit): {
    code: string;
    lang: string;
} | null;
/** Render a syntax-highlighted line diff for a nested `pi.edit` call, or null. */
export declare function nestedEditDiff(audit: FabricRenderAudit, theme: Theme, invalidate?: () => void): string[] | null;
export declare function modelReadHint(audits: FabricRenderAudit[], output: string, theme: Theme): string;
//# sourceMappingURL=fabric-render.d.ts.map