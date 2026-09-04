import type { AgentCompactionStatus } from "./types.js";
interface CompactControlFrame {
    id: string;
    type: "compact";
    customInstructions?: string;
}
interface CompactControlEvent {
    type?: unknown;
    id?: unknown;
    command?: unknown;
    success?: unknown;
    error?: unknown;
    aborted?: unknown;
    errorMessage?: unknown;
}
export interface ChildCompactControlHooks {
    send(frame: CompactControlFrame): void;
    close(): void;
    update(status: AgentCompactionStatus): void;
    now?: () => number;
}
export declare class ChildCompactControl {
    #private;
    readonly runId: string;
    readonly hooks: ChildCompactControlHooks;
    constructor(runId: string, hooks: ChildCompactControlHooks);
    queue(instructions?: string): void;
    childSettled(): void;
    observe(event: CompactControlEvent): void;
}
export {};
//# sourceMappingURL=compact-control.d.ts.map