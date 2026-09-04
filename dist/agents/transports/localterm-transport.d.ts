import type { AgentTransportAdapter, AgentTransportHandle, AgentTransportLaunch } from "../types.js";
export declare class LocaltermTransport implements AgentTransportAdapter {
    readonly kind: "localterm";
    available(): Promise<boolean>;
    launch(request: AgentTransportLaunch): Promise<AgentTransportHandle>;
}
//# sourceMappingURL=localterm-transport.d.ts.map