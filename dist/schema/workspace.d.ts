export interface WorkspaceSnapshot {
    fingerprint: string;
    git: boolean;
    head: string | null;
    indexDigest: string | null;
    entries: Record<string, string>;
    files: number;
    bytes: number;
}
export declare const snapshotWorkspace: (cwdInput: string, excludedRoots?: string[]) => WorkspaceSnapshot;
export declare const resolveWorkspaceFile: (cwdInput: string, requestedPath: string, options: {
    allowAbsent: boolean;
}) => {
    absolute: string;
    relative: string;
    exists: boolean;
};
export declare const sha256File: (absolute: string) => string;
//# sourceMappingURL=workspace.d.ts.map