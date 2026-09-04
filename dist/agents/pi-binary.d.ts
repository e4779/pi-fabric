export interface PiBinaryResolutionOptions {
    env?: NodeJS.ProcessEnv;
    homeDirectory?: string;
    isExecutable?: (file: string) => boolean;
}
export declare const resolvePiBinary: (configured?: string, options?: PiBinaryResolutionOptions) => string;
//# sourceMappingURL=pi-binary.d.ts.map