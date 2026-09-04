export declare const MAX_FAILURE_MODEL_OUTPUT_CHARS = 20000;
export declare const modelOutputBudget: (configuredMaxChars: number, success: boolean) => number;
export interface BoundedModelOutput {
    text: string;
    artifactPath?: string;
    originalChars: number;
    omittedChars: number;
}
type ArtifactWriter = (content: string) => Promise<string>;
export declare const boundModelOutput: (visible: string, maxChars: number, fullOutput?: string, writeArtifact?: ArtifactWriter) => Promise<BoundedModelOutput>;
export {};
//# sourceMappingURL=output-budget.d.ts.map