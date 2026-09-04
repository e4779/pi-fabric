export interface ParsedGitWorktreeAdd {
    gitCwd?: string;
    branch?: {
        flag: "-b" | "-B";
        name: string;
    };
    detach: boolean;
    quiet: boolean;
    dest: string;
    startPoint?: string;
}
export declare const parseGitWorktreeAdd: (command: string) => ParsedGitWorktreeAdd | undefined;
export interface BashToolResult {
    content: Array<{
        type: "text";
        text: string;
    }>;
    details: {
        exitCode: number;
        cloned: boolean;
    };
}
export declare const tryExecuteGitWorktreeAdd: (args: Record<string, unknown>, sessionCwd: string) => Promise<BashToolResult | undefined>;
//# sourceMappingURL=bash-worktree-add.d.ts.map