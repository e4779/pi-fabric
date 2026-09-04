import type { FabricModelGuidance, FabricModelGuidanceInfo, FabricModelGuidancePlacement, FabricModelGuidanceTarget } from "./types.js";
export declare const FABRIC_EXECUTION_GUIDANCE_SLOT = "fabric.execution";
export declare const MAX_FABRIC_MODEL_GUIDANCE_PER_COMPONENT = 64;
export declare const MAX_FABRIC_MODEL_GUIDANCE_CONTENT_CHARS = 32000;
export declare const MAX_FABRIC_MODEL_GUIDANCE_TOTAL_CHARS = 64000;
export declare const MAX_FABRIC_MODEL_GUIDANCE_REGISTRATIONS = 1024;
export declare const MAX_FABRIC_MODEL_GUIDANCE_SNAPSHOT_CHARS = 1000000;
export interface NormalizedFabricModelGuidance {
    label: string;
    models: string[];
    content: string;
    targets: FabricModelGuidanceTarget[];
    placement: FabricModelGuidancePlacement;
    slot?: string;
}
export interface FabricOwnedModelGuidance extends NormalizedFabricModelGuidance {
    componentId: string;
    component: string;
    revision: number;
}
export declare const compareFabricOwnedModelGuidance: (left: FabricOwnedModelGuidance, right: FabricOwnedModelGuidance) => number;
export interface FabricGuidanceDefaultSlot {
    slot: string;
    content: string;
}
export interface FabricResolvedModelGuidance {
    slotText: string;
    appendText: string;
    digest: string;
    sources: Array<{
        componentId: string;
        component: string;
        label: string;
        placement: FabricModelGuidancePlacement;
        slot?: string;
        contentHash: string;
    }>;
}
export declare const normalizeFabricModelGuidance: (guidance: FabricModelGuidance) => NormalizedFabricModelGuidance;
export declare const parseFabricOwnedModelGuidance: (value: unknown) => FabricOwnedModelGuidance[];
export declare const fabricModelGuidanceInfo: (guidance: NormalizedFabricModelGuidance) => FabricModelGuidanceInfo;
export declare const resolveFabricModelGuidance: (guidance: readonly FabricOwnedModelGuidance[], options: {
    model?: string;
    target: FabricModelGuidanceTarget;
    defaults?: readonly FabricGuidanceDefaultSlot[];
    includeSlots?: boolean;
}) => FabricResolvedModelGuidance;
//# sourceMappingURL=model-guidance.d.ts.map