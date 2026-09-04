import { type ShikiThemeVariant } from "./code-preview.js";
interface Rgb {
    r: number;
    g: number;
    b: number;
}
export declare const ansi256ToRgb: (index: number) => Rgb;
/** Minimal structural view of Pi's active theme, as handed to renderers. */
export interface PiThemeLike {
    name?: string;
    getBgAnsi?(color: "userMessageBg"): string;
}
/**
 * Classify Pi's active theme as a light or dark variant. Named built-ins are
 * matched directly, custom themes fall back to the luminance of Pi's message
 * background color, and as a last resort COLORFGBG provides a terminal hint.
 */
export declare const classifyPiTheme: (theme: PiThemeLike | undefined, env?: NodeJS.ProcessEnv) => ShikiThemeVariant | undefined;
/**
 * Adopt the variant of the pi theme instance handed to a renderer. When the
 * configured preference follows the variant ("auto" or a "light/dark" pair),
 * the effective shiki theme swaps as Pi auto-switches.
 */
export declare function observePiTheme(theme: PiThemeLike | undefined): void;
/** The shiki theme currently used for rendering (after variant resolution). */
export declare const effectiveShikiTheme: () => string;
/** Whether the effective shiki theme is a light theme. */
export declare const effectiveShikiThemeIsLight: () => boolean;
/** Pi's most recently observed theme variant. */
export declare const observedThemeVariant: () => ShikiThemeVariant;
/** Resolve a shiki language id from a file path, or undefined if unsupported. */
export declare function languageFromPath(filePath: string | undefined): string | undefined;
/** Configure highlighting without loading Shiki until the first code preview needs it. */
export declare function configureHighlighting(themePreferenceValue: string, syntaxEnabled?: boolean): void;
/** Initialize (or reinitialize) the shared shiki highlighter. Fire-and-forget safe. */
export declare function initHighlighting(theme: string, syntaxEnabled?: boolean): Promise<void>;
/**
 * Highlight `text` as `lang`, returning per-line truecolor ANSI strings that match
 * pi-code-previews' rendering (same shiki theme + token conversion). Returns null
 * when highlighting is disabled, the language is unsupported, the highlighter is
 * not yet ready, or the content is too large. Pass `invalidate` to request a
 * re-render once the highlighter/language becomes ready.
 */
export declare function highlightCode(text: string, lang: string, invalidate?: () => void): string[] | null;
export interface FileHighlightLine {
    raw: string;
    ansi: string;
}
/**
 * Highlight a line range of an on-disk file with full grammar state, returning
 * per-line { raw, ansi } entries for 0-based [from, to). `raw` is the
 * tab-expanded source line so callers can verify the rendered content still
 * matches the file. Returns null while coverage has not reached `to` (or when
 * the file is unusable); passing `invalidate` repaints as soon as the range is
 * covered and pumps bounded background tokenization — parked shiki
 * GrammarState, one ~5-10ms slice per event-loop tick, work only while
 * waiters exist.
 */
export declare function highlightFileLines(filePath: string, lang: string, from: number, to: number, invalidate?: () => void): FileHighlightLine[] | null;
/**
 * Highlight a line range of an in-memory document with full grammar state.
 * Shares the disk-backed pump, cache, and budgets; the caller supplies the
 * cache identity via `cacheKey` (already namespaced by theme + language) and
 * the tab-expanded source lines. Returns null while coverage has not reached
 * `to`; passing `invalidate` repaints as soon as the range is covered.
 */
export declare function highlightSourceLines(cacheKey: string, sourceLines: string[], lang: string, from: number, to: number, invalidate?: () => void): FileHighlightLine[] | null;
export {};
//# sourceMappingURL=highlight.d.ts.map