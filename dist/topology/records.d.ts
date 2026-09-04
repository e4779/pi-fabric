import type { FabricActorInfo } from "../actors/types.js";
import type { AgentHandleInfo, AgentRunRecord } from "../agents/types.js";
import type { FabricParticipantRecord } from "./types.js";
export declare const agentParticipantRecords: (records: Array<AgentRunRecord | AgentHandleInfo>, rootId: string, ownerHostId: string, ownerIdentityId: string, parentId: string, firstSeen: Map<string, number>) => FabricParticipantRecord[];
export declare const actorParticipantRecord: (actor: FabricActorInfo, rootId: string, ownerHostId: string, ownerIdentityId: string, parentId: string) => FabricParticipantRecord;
//# sourceMappingURL=records.d.ts.map