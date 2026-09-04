import type { ExtensionAPI, ExtensionContext, ExtensionEvent } from "@earendil-works/pi-coding-agent";
import { type FabricActorPiHostEvent } from "./types.js";
export type FabricActorHostEventObserver = (eventName: FabricActorPiHostEvent, event: ExtensionEvent, context: ExtensionContext) => void;
export declare const registerFabricActorHostEventObservers: (pi: ExtensionAPI, observer: FabricActorHostEventObserver) => void;
//# sourceMappingURL=host-event-observer.d.ts.map