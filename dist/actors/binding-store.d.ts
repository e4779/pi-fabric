import { type FabricThinking } from "../thinking.js";
export interface ActorSessionBindingRecord {
    model?: string;
    thinking?: FabricThinking;
    updatedAt: number;
}
export declare class ActorBindingStore {
    #private;
    readonly sessionId: string;
    readonly filePath: string | undefined;
    constructor(sessionId: string, root: string | undefined);
    get(actorId: string): ActorSessionBindingRecord | undefined;
    setModel(actorId: string, model: string | undefined): Promise<ActorSessionBindingRecord | undefined>;
    setThinking(actorId: string, thinking: FabricThinking | undefined): Promise<ActorSessionBindingRecord | undefined>;
    delete(actorId: string): Promise<boolean>;
}
//# sourceMappingURL=binding-store.d.ts.map