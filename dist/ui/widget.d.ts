import type { Component } from "@earendil-works/pi-tui";
import type { Theme } from "@earendil-works/pi-coding-agent";
import type { FabricUiWidgetMode } from "../config.js";
import { type FabricDashboardSnapshot } from "./types.js";
export declare const shouldShowFabricWidget: (snapshot: FabricDashboardSnapshot, mode: FabricUiWidgetMode) => boolean;
export declare class FabricWidget implements Component {
    #private;
    readonly theme: Theme;
    readonly snapshot: () => FabricDashboardSnapshot;
    readonly maxRows: number;
    constructor(theme: Theme, snapshot: () => FabricDashboardSnapshot, maxRows: number);
    render(width: number): string[];
    hasChanged(): boolean;
    invalidate(): void;
}
//# sourceMappingURL=widget.d.ts.map