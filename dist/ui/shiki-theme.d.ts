import type { ThemeRegistration } from "shiki";
/**
 * Resolve a shiki theme id to its loaded theme object. Returns undefined when
 * the id is not a bundled shiki theme, so callers can fall back gracefully.
 */
export declare function resolveShikiThemeObject(themeId: string): Promise<ThemeRegistration | undefined>;
//# sourceMappingURL=shiki-theme.d.ts.map