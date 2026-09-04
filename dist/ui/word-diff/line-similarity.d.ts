import type { AddedDiffLine, RemovedDiffLine } from "./parse.js";
import { type IndexedChangedLine } from "./changed-line.js";
type ChangedLineSimilarityDocuments = {
    removedFeatures: string[][];
    addedFeatures: string[][];
    documentCounts: Map<string, number>;
};
type SimilarityTokenWeight = (token: string) => number;
export declare function changedLineSimilarityDocuments(removed: Array<IndexedChangedLine<RemovedDiffLine>>, added: Array<IndexedChangedLine<AddedDiffLine>>): ChangedLineSimilarityDocuments;
export declare function hasUniqueSharedSimilarityFeature(removed: IndexedChangedLine<RemovedDiffLine>, added: IndexedChangedLine<AddedDiffLine>, documents: ChangedLineSimilarityDocuments): boolean;
export declare function similarityTokenWeight(documents: ChangedLineSimilarityDocuments): SimilarityTokenWeight;
export declare function fallbackLineSimilarity(removed: IndexedChangedLine<RemovedDiffLine>, added: IndexedChangedLine<AddedDiffLine>, weight: SimilarityTokenWeight, removedWeight?: number, addedWeight?: number): number;
export declare function tokenSimilarity(beforeTokens: string[], afterTokens: string[], weight?: SimilarityTokenWeight, minimumRelevantSimilarity?: number, beforeWeight?: number, afterWeight?: number): number;
export declare function similarityTokenListWeight(tokens: string[], weight: SimilarityTokenWeight): number;
export {};
//# sourceMappingURL=line-similarity.d.ts.map