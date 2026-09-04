export interface WorktreeLease {
    gitRoot: string;
    path: string;
    /** Effective child cwd inside the generated worktree. */
    cwd: string;
    branch: string;
}
export declare class WorktreeManager {
    #private;
    create(id: string, cwd: string, name: string, preserveSourceSubdirectory?: boolean): Promise<WorktreeLease>;
    get(id: string): WorktreeLease | undefined;
    cleanup(id: string, deleteBranch?: boolean): Promise<boolean>;
}
//# sourceMappingURL=worktree-manager.d.ts.map