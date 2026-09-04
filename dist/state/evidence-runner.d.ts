import type { VerifyStatus } from "./types.js";
export interface RunCommandOptions {
    cwd: string;
    timeoutMs: number;
    signal?: AbortSignal | undefined;
}
export interface CommandResult {
    status: VerifyStatus;
    exitCode: number | null;
    output: string;
    outputBytes: number;
    outputOmittedBytes: number;
    outputDigest: string;
    error?: string;
}
export declare const runCommand: (command: string, options: RunCommandOptions) => Promise<CommandResult>;
//# sourceMappingURL=evidence-runner.d.ts.map