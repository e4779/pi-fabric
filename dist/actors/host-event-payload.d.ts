import type { ImageContent } from "@earendil-works/pi-ai";
interface FabricActorHostMediaDescriptor {
    type: "image";
    mediaIndex: number;
    mimeType: string;
}
export interface PreparedFabricActorHostPayload {
    payload: unknown;
    images: ImageContent[];
    media: FabricActorHostMediaDescriptor[];
}
export declare const prepareFabricActorHostPayload: (value: unknown, maxChars: number) => PreparedFabricActorHostPayload;
export {};
//# sourceMappingURL=host-event-payload.d.ts.map