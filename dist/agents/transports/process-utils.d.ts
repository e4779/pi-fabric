export interface ExecFileResult {
    stdout: string;
    stderr: string;
}
export declare const executeFile: (command: string, args: string[], options?: {
    cwd?: string;
    timeoutMs?: number;
}) => Promise<ExecFileResult>;
export declare const commandAvailable: (command: string) => Promise<boolean>;
export declare const processIsAlive: (pid: number) => boolean;
export interface ScriptRuntimeOptions {
    execPath?: string;
    env?: NodeJS.ProcessEnv;
    /** Require Node.js specifically; used by the Node-process executor whose
     *  `--eval`/`--input-type=module` flags are Node-only. */
    requireNode?: boolean;
    /** Require Bun specifically; used by the Bun-process executor. */
    requireBun?: boolean;
}
export declare const resolveScriptRuntime: (options?: ScriptRuntimeOptions) => Promise<string>;
export declare const resolveScriptRuntimeSync: (options?: ScriptRuntimeOptions) => string;
export declare const scriptSpawnArgs: (workerPath: string, workerArguments: readonly string[], options?: ScriptRuntimeOptions) => Promise<string[]>;
export declare const workerCommand: (workerPath: string, workerArguments: string[]) => Promise<string>;
export declare const spawnDetached: (workerPath: string, workerArguments: string[], cwd: string) => Promise<{
    pid: number;
    stop(): Promise<void>;
    isAlive(): Promise<boolean>;
}>;
//# sourceMappingURL=process-utils.d.ts.map