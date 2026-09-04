/** Tracks rendered fabric_exec cards so a display preference switch redraws the current transcript. */
export declare class FabricToolDisplayController {
    #private;
    observe(toolCallId: string, kind: "call" | "result", invalidate: () => void): void;
    refresh(): void;
    clear(): void;
}
//# sourceMappingURL=tool-display.d.ts.map