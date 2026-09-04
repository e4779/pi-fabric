export declare function classifyPiBashError(error: unknown): unknown;
/** Keep native exit status independent of middleware display transformations. */
export declare function piBashResultError(original: unknown, text: string): Error;
/** Only provider-classified exits may cross a runtime bridge as settle metadata. */
export declare function piBashExitMetadata(error: unknown): {
    exitCode: number;
    output: string;
} | undefined;
//# sourceMappingURL=pi-bash-error.d.ts.map