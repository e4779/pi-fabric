import type { Theme } from "@earendil-works/pi-coding-agent";
import type { TUI } from "@earendil-works/pi-tui";
import type { CodePreviewSettings } from "./code-preview.js";
import type { Entity } from "./dashboard-model.js";
import type { FabricAgentTranscript } from "./transcript.js";
import type { FabricDashboardSnapshot, FabricUiActor, FabricUiAgent } from "./types.js";
export type FabricTranscriptTarget = FabricUiAgent | FabricUiActor;
export interface DashboardDetailRenderState {
    view: "summary" | "transcript";
    scroll: number;
    pageAnchor: "start" | "end" | undefined;
    transcriptFollowing: boolean;
    transcriptToolsExpanded: boolean;
}
export interface DashboardDetailRenderResult {
    lines: string[];
    scroll: number;
    maxScroll: number;
    pageAnchor: "start" | "end" | undefined;
}
interface DashboardDetailRendererOptions {
    agentTranscript: ((agent: FabricUiAgent, followLatest: boolean) => FabricAgentTranscript) | undefined;
    actorTranscript: ((actor: FabricUiActor, followLatest: boolean) => FabricAgentTranscript) | undefined;
    codePreviewSettings: CodePreviewSettings | undefined;
    actorDefaultTools: string[];
}
export declare class DashboardDetailRenderer {
    readonly tui: TUI;
    readonly theme: Theme;
    readonly snapshot: () => FabricDashboardSnapshot;
    private detailView;
    private detailScroll;
    private detailMaxScroll;
    private transcriptPageAnchor;
    private transcriptFollowing;
    private transcriptToolsExpanded;
    private actionHint;
    private toolToggleHint;
    private readonly transcriptMarkdown;
    private readonly highlightInvalidate;
    private readonly agentTranscript;
    private readonly actorTranscript;
    private readonly codePreviewSettings;
    private readonly actorDefaultTools;
    constructor(tui: TUI, theme: Theme, snapshot: () => FabricDashboardSnapshot, options: DashboardDetailRendererOptions);
    render(width: number, snapshot: FabricDashboardSnapshot, entity: Entity, state: DashboardDetailRenderState, actionHint: string, toolToggleHint: string): DashboardDetailRenderResult;
    invalidate(): void;
    private detailActionHint;
    private transcriptToolToggleHint;
    private transcriptTarget;
    private hasTranscript;
    private transcriptFor;
    private renderDetail;
    private transcriptLines;
    private transcriptToolLines;
    private transcriptToolAudit;
    private transcriptStructuredLines;
    private markdownTranscriptLines;
    private markdownLines;
    private detailLines;
    private renderNarrowDetail;
    private topBorder;
    private middleBorder;
    private bottomBorder;
    private row;
}
export {};
//# sourceMappingURL=dashboard-detail.d.ts.map