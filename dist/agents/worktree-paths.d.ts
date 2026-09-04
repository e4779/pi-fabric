export declare const FABRIC_WORKTREE_EXCLUDE = ".pi/fabric/worktrees/";
export declare const fabricWorktreePath: (gitRoot: string, id: string) => string;
export declare const isFabricWorktreePath: (worktree: string, id: string) => boolean;
export declare const ensureWorktreeExclude: (gitRoot: string) => Promise<void>;
//# sourceMappingURL=worktree-paths.d.ts.map