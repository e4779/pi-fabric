import type { Theme } from "@earendil-works/pi-coding-agent";
import type { CodePreviewSettings } from "./code-preview.js";
import type { FabricRenderAudit } from "./fabric-render.js";
export interface CoreToolRenderOptions {
    cwd: string;
    settings: CodePreviewSettings;
    expanded: boolean;
    maxLines: number;
    invalidate?: () => void;
}
export interface RenderedCoreToolBody {
    lines: string[];
    hidden: number;
}
export declare const isCoreToolAudit: (audit: FabricRenderAudit) => boolean;
export declare const coreToolRendererEnabled: (audit: FabricRenderAudit, settings: CodePreviewSettings) => boolean;
export declare const coreToolPreviewEnabled: (audit: FabricRenderAudit, settings: CodePreviewSettings) => boolean;
export declare const renderCoreToolBody: (audit: FabricRenderAudit, theme: Theme, options: CoreToolRenderOptions) => RenderedCoreToolBody | null;
export declare const coreToolTitle: (audit: FabricRenderAudit, theme: Theme, options: Pick<CoreToolRenderOptions, "cwd" | "settings" | "invalidate">) => string | null;
//# sourceMappingURL=core-tool-render.d.ts.map