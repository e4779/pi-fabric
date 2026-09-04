import type { AgentTransportAdapter, AgentTransportHandle, AgentTransportLaunch } from "../types.js";
export declare class TmuxTransport implements AgentTransportAdapter {
    readonly kind: "tmux";
    available(): Promise<boolean>;
    launch(request: AgentTransportLaunch): Promise<AgentTransportHandle>;
}
//# sourceMappingURL=tmux-transport.d.ts.map