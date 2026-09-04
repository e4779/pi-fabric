export interface SkillReference {
    name: string;
    filePath: string;
    disableModelInvocation?: boolean;
}
export declare const buildSkillReferenceGuidance: (prompt: string, skills: readonly SkillReference[]) => string | undefined;
//# sourceMappingURL=skill-references.d.ts.map