import type { AgentTransportAdapter, AgentTransportHandle, AgentTransportLaunch } from "../types.js";
export declare class ScreenTransport implements AgentTransportAdapter {
    readonly kind: "screen";
    available(): Promise<boolean>;
    launch(request: AgentTransportLaunch): Promise<AgentTransportHandle>;
}
//# sourceMappingURL=screen-transport.d.ts.map