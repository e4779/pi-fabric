export declare const HEADLINE_ARG_KEYS: readonly ["task", "path", "query", "message", "search", "pattern", "command", "text", "prompt", "question", "input", "content", "expression", "url", "topic", "key", "filter", "name", "q"];
/**
 * Pick the best single-line argument value to display beside a nested call's
 * tool name, for tools that have no bespoke preview. Returns `undefined`
 * when no string payload argument is present.
 */
export declare const headlineArg: (args: Record<string, unknown> | undefined, max?: number) => string | undefined;
//# sourceMappingURL=call-preview.d.ts.map