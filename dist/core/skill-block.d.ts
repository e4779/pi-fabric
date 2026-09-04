import type { Skill } from "@earendil-works/pi-coding-agent";
export declare const formatSkillsForPrompt: (skills: readonly Skill[]) => string;
export interface ParsedSkillBlock {
    name: string;
    location: string;
    content: string;
    userMessage: string | undefined;
}
export declare const parseSkillBlock: (text: string) => ParsedSkillBlock | null;
//# sourceMappingURL=skill-block.d.ts.map