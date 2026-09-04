import type { FabricActivityRun } from "../activity/types.js";
import type { MeshEvent } from "../mesh/store.js";
import type { FabricParticipantInfo } from "../topology/types.js";
import type { FabricUiActor, FabricUiAgent, FabricUiMain, FabricUiStateEntry } from "./types.js";
interface FabricRunTopologyPhaseRow {
    kind: "phase";
    id: string;
    name: string;
    status: string;
    agentCount: number;
}
interface FabricRunTopologyAgentRow {
    kind: "agent";
    entityId: string;
    agent: FabricUiAgent;
    ancestorLast: boolean[];
    ancestorEntityIds: string[];
    isLast: boolean;
}
type FabricRunTopologyRow = FabricRunTopologyPhaseRow | FabricRunTopologyAgentRow;
interface FabricRunTopologyOmissionRow {
    kind: "omission";
    direction: "before" | "after" | "both";
    rows: number;
    agents: number;
    phases: number;
    active: number;
    blocked: number;
    failed: number;
    context?: string[];
}
type FabricRunTopologyDisplayRow = FabricRunTopologyRow | FabricRunTopologyOmissionRow;
export declare const buildRunTopologyRows: (run: FabricActivityRun, agents: FabricUiAgent[], options?: {
    includeEmptyPhases?: boolean;
}) => FabricRunTopologyRow[];
export declare const windowRunTopologyRows: (rows: FabricRunTopologyRow[], selectedEntityId: string | undefined, maxRows: number) => FabricRunTopologyDisplayRow[];
export interface FabricProjectMeshTopic {
    id: string;
    name: string;
    status: string;
    system: boolean;
    subscribers: Array<{
        id: string;
        name: string;
        status: string;
    }>;
    recentEvents: number;
    lastEventAt?: number;
}
export interface FabricProjectMeshParticipant {
    id: string;
    entityId: string;
    name: string;
    status: string;
    routes: number;
    lastSeenAt: number;
    agent?: FabricUiAgent;
    participant?: FabricParticipantInfo;
}
export interface FabricProjectMeshRoute {
    id: string;
    fromId: string;
    fromName: string;
    fromKind: string;
    targetId: string;
    targetName: string;
    targetKind: "main" | "actor" | "agent" | "topic";
    topic: string;
    kind: string;
    status: string;
    count: number;
    lastAt: number;
    text?: string;
}
interface FabricProjectMeshRootRow {
    kind: "meshRoot";
    entityId: string;
    main: FabricUiMain;
    actors: number;
    agents: number;
    topics: number;
    state: number;
    routes: number;
}
interface FabricProjectMeshSectionRow {
    kind: "meshSection";
    label: string;
    count: number;
}
interface FabricProjectMeshActorRow {
    kind: "meshActor";
    entityId: string;
    actor: FabricUiActor;
}
interface FabricProjectMeshAgentRow {
    kind: "meshAgent";
    entityId: string;
    participant: FabricProjectMeshParticipant;
    ancestorLast: boolean[];
    isLast: boolean;
}
interface FabricProjectMeshTopicRow {
    kind: "meshTopic";
    entityId: string;
    topic: FabricProjectMeshTopic;
}
interface FabricProjectMeshLinkRow {
    kind: "meshLink";
    relation: "subscribes";
    sourceId: string;
    sourceName: string;
    targetId: string;
    targetName: string;
    status: string;
    isLast: boolean;
}
interface FabricProjectMeshStateRow {
    kind: "meshState";
    entityId: string;
    state: FabricUiStateEntry;
}
interface FabricProjectMeshRouteRow {
    kind: "meshRoute";
    entityId: string;
    route: FabricProjectMeshRoute;
}
interface FabricProjectMeshOmissionRow {
    kind: "meshOmission";
    direction: "before" | "after" | "both";
    rows: number;
    nodes: number;
    main: number;
    actors: number;
    agents: number;
    topics: number;
    state: number;
    routes: number;
    active: number;
    blocked: number;
    failed: number;
}
export type FabricProjectMeshRow = FabricProjectMeshRootRow | FabricProjectMeshSectionRow | FabricProjectMeshActorRow | FabricProjectMeshAgentRow | FabricProjectMeshTopicRow | FabricProjectMeshLinkRow | FabricProjectMeshStateRow | FabricProjectMeshRouteRow;
export type FabricProjectMeshDisplayRow = FabricProjectMeshRow | FabricProjectMeshOmissionRow;
export interface FabricProjectMeshModel {
    participants: FabricProjectMeshParticipant[];
    topics: FabricProjectMeshTopic[];
    routes: FabricProjectMeshRoute[];
    rows: FabricProjectMeshRow[];
    entityOrder: string[];
}
export declare const buildProjectMeshTopology: (input: {
    main: FabricUiMain;
    actors: FabricUiActor[];
    agents: FabricUiAgent[];
    state: FabricUiStateEntry[];
    events: MeshEvent[];
    participants?: FabricParticipantInfo[];
    now: number;
}) => FabricProjectMeshModel;
export declare const windowProjectMeshTopology: (rows: FabricProjectMeshRow[], selectedEntityId: string | undefined, maxRows: number) => FabricProjectMeshDisplayRow[];
export {};
//# sourceMappingURL=topology.d.ts.map