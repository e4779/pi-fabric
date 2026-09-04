import type { AgentTransportAdapter, AgentTransportHandle, AgentTransportLaunch } from "../types.js";
export declare class ProcessTransport implements AgentTransportAdapter {
    readonly kind: "process";
    available(): Promise<boolean>;
    launch(request: AgentTransportLaunch): Promise<AgentTransportHandle>;
}
//# sourceMappingURL=process-transport.d.ts.map