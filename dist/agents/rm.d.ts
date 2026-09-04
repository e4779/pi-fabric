type RemoveFn = (target: string, options: {
    recursive: boolean;
    force: boolean;
}) => Promise<void>;
/**
 * Recursively remove a directory tree, retrying on transient filesystem
 * races. `fs.rm({ force: true })` ignores ENOENT, but on macOS/APFS a
 * recursive removal can still surface ENOTEMPTY when a child entry has not
 * yet been purged by the filesystem. Retry a few times with a short backoff
 * so agent cleanup and shutdown do not flake on that race. The `rm`
 * argument is a seam for tests; production callers omit it.
 */
export declare const removeTree: (target: string, rm?: RemoveFn) => Promise<void>;
export {};
//# sourceMappingURL=rm.d.ts.map