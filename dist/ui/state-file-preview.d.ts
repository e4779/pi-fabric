import type { Theme } from "@earendil-works/pi-coding-agent";
import type { FabricUiStateEntry } from "./types.js";
export interface FabricStateFilePreview {
    path: string;
    absolutePath: string;
    language: string;
    content: string;
    lines: string[];
    truncated: boolean;
}
export declare const loadStateFilePreview: (entry: FabricUiStateEntry, cwd: string) => FabricStateFilePreview | undefined;
export declare const renderStateFilePreview: (preview: FabricStateFilePreview, theme: Theme, width: number, maxLines: number, invalidate?: () => void) => string[];
//# sourceMappingURL=state-file-preview.d.ts.map