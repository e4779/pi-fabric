import type { ExtensionContext, MessageUpdateEvent } from "@earendil-works/pi-coding-agent";
import type { LiteralCallScanner } from "./scanner.js";
import type { FabricSpeculationCandidate } from "./types.js";
export interface FabricSpeculationTapOptions {
    enabled(): boolean;
    maxBufferBytes(): number;
    /** Static cheap gate (Tier-A set / MCP allowlist) before the registry re-validates. */
    isEligible(ref: string): boolean;
    launch(toolCallId: string, candidate: FabricSpeculationCandidate, context: ExtensionContext): void;
}
/**
 * Watches assistant message streaming for fabric_exec tool calls, incrementally
 * decodes the `code` argument, and launches speculative executions for
 * literal-argument calls as soon as they complete in the stream. Never throws
 * into the event pipeline: every failure mode degrades to no speculation.
 */
export declare class FabricSpeculationStreamTap {
    #private;
    constructor(options: FabricSpeculationTapOptions);
    setScannerFactory(factory: () => LiteralCallScanner): void;
    /** Drain candidates recovered while the scanner module loaded. */
    flushCatchUp(context: Parameters<FabricSpeculationTapOptions["launch"]>[2]): void;
    /** New assistant message: content indices restart. */
    reset(): void;
    handleMessageUpdate(event: MessageUpdateEvent, context: ExtensionContext): void;
}
//# sourceMappingURL=stream-tap.d.ts.map