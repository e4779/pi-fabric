import type { AgentTransportAdapter, AgentTransportHandle, AgentTransportLaunch } from "../types.js";
export declare class HerdrTransport implements AgentTransportAdapter {
    #private;
    private readonly environment;
    readonly kind: "herdr";
    constructor(environment?: NodeJS.ProcessEnv);
    available(): Promise<boolean>;
    launch(request: AgentTransportLaunch): Promise<AgentTransportHandle>;
}
//# sourceMappingURL=herdr-transport.d.ts.map