import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { FabricActivityRun } from "../activity/types.js";
import type { FabricState } from "../fabric-state.js";
import type { MeshEvent } from "../mesh/store.js";
import { type FabricDashboardSnapshot } from "./types.js";
export declare const createDashboardSnapshot: (state: FabricState, events: MeshEvent[], context?: ExtensionContext, activityRuns?: FabricActivityRun[]) => FabricDashboardSnapshot;
//# sourceMappingURL=snapshot.d.ts.map