import type { Theme } from "@earendil-works/pi-coding-agent";
import type { FabricActivityRun } from "../activity/types.js";
import type { Entity, StatusFilter } from "./dashboard-model.js";
import type { FabricProjectMeshModel } from "./topology.js";
import type { FabricDashboardSnapshot } from "./types.js";
export interface FabricGraphPoint {
    x: number;
    y: number;
}
export interface FabricGraphAnimation {
    now: number;
    reducedMotion: boolean;
    showHistory: boolean;
    replayRouteId?: string;
    replayLabel?: string;
}
export interface FabricTopologyGroupSegment {
    id: string;
    label: string;
}
export declare const topologyParticipantGroup: (kind: "root" | "peer" | "agent" | "actor") => FabricTopologyGroupSegment & {
    order: number;
};
export declare const topologyTopicGroupPath: (name: string) => FabricTopologyGroupSegment[];
export declare const topologyStateGroupPath: (key: string) => FabricTopologyGroupSegment[];
export declare const topologyTreeRouteNodeIds: (nodes: ReadonlyMap<string, {
    parentId?: string;
}>, fromId: string, toId: string) => string[];
export interface FabricTopologyRenderResult {
    lines: string[];
    positions: Map<string, FabricGraphPoint>;
    selectedPosition?: FabricGraphPoint;
}
export declare const renderFabricTopologyPanel: ({ theme, filter, selectedEntityId, snapshot, run, mesh, allEntities, entities, width, height, camera, animation, invalidate, }: {
    theme: Theme;
    filter: StatusFilter;
    selectedEntityId: string | undefined;
    snapshot: FabricDashboardSnapshot;
    run: FabricActivityRun | undefined;
    mesh: FabricProjectMeshModel;
    allEntities: Entity[];
    entities: Entity[];
    width: number;
    height: number;
    camera: FabricGraphPoint;
    animation: FabricGraphAnimation;
    invalidate?: () => void;
}) => FabricTopologyRenderResult;
export declare const directionalGraphTarget: (positions: ReadonlyMap<string, FabricGraphPoint>, currentId: string | undefined, direction: "left" | "right" | "up" | "down") => string | undefined;
//# sourceMappingURL=dashboard-fabric-graph.d.ts.map