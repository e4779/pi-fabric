export interface CloneFirstWorktreeAdd {
    gitRoot: string;
    dest: string;
    branch?: {
        flag: "-b" | "-B";
        name: string;
    };
    detach?: boolean;
    quiet?: boolean;
    startPoint?: string;
}
export interface CloneFirstWorktreeResult {
    cloned: boolean;
    message: string;
}
export declare const addCloneFirstWorktree: (options: CloneFirstWorktreeAdd) => Promise<CloneFirstWorktreeResult>;
//# sourceMappingURL=clone-first-worktree.d.ts.map