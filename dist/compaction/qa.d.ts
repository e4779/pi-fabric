import { type CompactionEvent } from "./normalize.js";
type ProbeClass = "content" | "address";
export interface Probe {
    id: string;
    class: ProbeClass;
    question: string;
    answer: string;
}
interface ProbeFailure {
    probe: Probe;
    reason: string;
}
export interface ProbeCheck {
    passed: Probe[];
    failed: ProbeFailure[];
}
export interface QaReport {
    score: number;
    contentScore: number;
    addressScore: number;
    failures: ProbeFailure[];
}
export declare const generateProbes: (events: CompactionEvent[], cutIndex: number) => Probe[];
export declare const checkProbes: (summaryText: string, probes: Probe[]) => ProbeCheck;
export declare const qaReport: (events: CompactionEvent[], cutIndex: number, summaryText: string) => QaReport;
export {};
//# sourceMappingURL=qa.d.ts.map