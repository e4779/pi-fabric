import type { FabricActivityCall, FabricActivityItem, FabricActivityKind, FabricActivityPhase, FabricActivityRun } from "../activity/types.js";
import type { GlobalActorDefinition } from "../actors/types.js";
import type { FabricComponentInfo } from "../components/types.js";
import type { FabricDashboardSnapshot, FabricUiActor, FabricUiAgent, FabricUiMain, FabricUiPeer, FabricUiStateEntry } from "./types.js";
import { type FabricProjectMeshModel, type FabricProjectMeshParticipant, type FabricProjectMeshRoute, type FabricProjectMeshTopic } from "./topology.js";
export type Entity = {
    id: string;
    kind: "main";
    label: string;
    status: string;
    value: FabricUiMain;
} | {
    id: string;
    kind: "peer";
    label: string;
    status: string;
    value: FabricUiPeer;
} | {
    id: string;
    kind: "agent";
    label: string;
    status: string;
    value: FabricUiAgent;
} | {
    id: string;
    kind: "actor";
    label: string;
    status: string;
    value: FabricUiActor;
} | {
    id: string;
    kind: "globalActor";
    label: string;
    status: string;
    value: GlobalActorDefinition;
} | {
    id: string;
    kind: "call";
    label: string;
    status: string;
    value: FabricActivityCall;
} | {
    id: string;
    kind: "item";
    label: string;
    status: string;
    value: FabricActivityItem;
} | {
    id: string;
    kind: "state";
    label: string;
    status: string;
    value: FabricUiStateEntry;
} | {
    id: string;
    kind: "component";
    label: string;
    status: string;
    value: FabricComponentInfo;
} | {
    id: string;
    kind: "meshParticipant";
    label: string;
    status: string;
    value: FabricProjectMeshParticipant;
} | {
    id: string;
    kind: "meshTopic";
    label: string;
    status: string;
    value: FabricProjectMeshTopic;
} | {
    id: string;
    kind: "meshRoute";
    label: string;
    status: string;
    value: FabricProjectMeshRoute;
};
type PanelKind = "phase" | "unphased" | "session";
export interface PhasePanel {
    id: string;
    name: string;
    status: string;
    completed: number;
    total: number;
    phase?: FabricActivityPhase;
    kind: PanelKind;
    agents?: number;
    tokens?: number;
    elapsedMs?: number;
}
export type Pane = "phases" | "entities";
export type OverviewView = "activity" | "topology";
type EntityGroupKind = FabricActivityKind | "globalActor" | "peer" | "state" | "component" | "meshParticipant" | "meshTopic" | "meshRoute";
export interface EntityGroup {
    kind: EntityGroupKind;
    label: string;
    entries: Array<{
        entity: Entity;
        index: number;
    }>;
}
export declare const groupEntities: (entities: Entity[]) => EntityGroup[];
export type StatusFilter = "all" | "active" | "completed" | "failed";
export declare const filters: StatusFilter[];
export declare const entitiesForOverview: (snapshot: FabricDashboardSnapshot, run: FabricActivityRun | undefined, panel: PhasePanel | undefined, view: OverviewView, projectMesh?: FabricProjectMeshModel) => Entity[];
export declare const phasePanels: (snapshot: FabricDashboardSnapshot, run: FabricActivityRun | undefined) => PhasePanel[];
export declare const matchesFilter: (status: string, filter: StatusFilter) => boolean;
export declare const tokensFor: (snapshot: FabricDashboardSnapshot, run: FabricActivityRun | undefined) => number;
export {};
//# sourceMappingURL=dashboard-model.d.ts.map