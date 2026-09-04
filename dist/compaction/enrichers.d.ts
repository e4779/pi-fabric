import type { CompactionEvent } from "./normalize.js";
import type { Sections } from "./projections.js";
export interface CompactionEnricher {
    readonly name: string;
    applies(events: CompactionEvent[]): boolean;
    contribute(events: CompactionEvent[], sections: Sections): void;
}
export declare const NO_BUILTIN_ENRICHERS: readonly CompactionEnricher[];
export declare const runEnrichers: (enrichers: readonly CompactionEnricher[], events: CompactionEvent[], sections: Sections) => void;
//# sourceMappingURL=enrichers.d.ts.map