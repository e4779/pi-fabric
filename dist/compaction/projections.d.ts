import { type CompactionEvent } from "./normalize.js";
export interface Sections {
    goal: string[];
    files: string[];
    activity: string[];
    outstanding: string[];
    earlierTurns: string[];
    status: string[];
    transcript: string[];
}
export declare const MAX_USER_GOAL_LINES = 3;
export declare const MAX_USER_GOAL_LINE = 1024;
export declare const MAX_FILES_PER_KIND = 24;
export declare const MAX_UNRESOLVED = 24;
export declare const MAX_EARLIER_TURNS = 32;
export interface ProjectionOmittedCounts {
    goal: number;
    files: number;
    activity: number;
    outstanding: number;
    earlierTurns: number;
    transcript: number;
}
export interface ProjectionResult {
    sections: Sections;
    omittedCounts: ProjectionOmittedCounts;
}
export declare const projectOutstanding: (events: CompactionEvent[]) => string[];
export declare const projectWithMetadata: (events: CompactionEvent[]) => ProjectionResult;
export declare const project: (events: CompactionEvent[]) => Sections;
//# sourceMappingURL=projections.d.ts.map