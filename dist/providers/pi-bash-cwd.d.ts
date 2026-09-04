import { type ToolDefinition } from "@earendil-works/pi-coding-agent";
export declare const PI_BASH_CWD_KEY = "cwd";
/**
 * Resolve and validate a single bash call's execution directory.
 *
 * Relative paths resolve against the session cwd. Unlike the leaf-agent
 * resolver this deliberately does NOT canonicalize symlinks: agents commonly
 * target git worktrees whose paths are symlinks, and rewriting those to their
 * real targets changes what `pwd` reports inside the command and breaks
 * tooling that keys on the worktree path. `path.resolve` normalizes `..`
 * lexically, which is all the approval classifier needs to see a truthful
 * absolute target.
 *
 * Containment is intentionally not enforced. Models can already reach any
 * directory with `cd <dir> && <command>`, which Fabric neither inspects nor
 * contains, so a containment check here would add no boundary — it would only
 * push calls back into the string-concatenated form that evades it. Directory
 * containment belongs to pi's project-trust layer or a bash spawn hook.
 */
export declare const resolvePiBashCwd: (sessionCwd: string, requested: unknown) => string;
/**
 * Rewrite a bash call's cwd in place, leaving every other argument untouched.
 *
 * The arguments are never split into an execution copy: pi's bash schema
 * declares no additionalProperties and its execute destructures
 * { command, timeout }, so the extra key is inert there, while events,
 * approval, and previews all benefit from seeing it. Resolving at the
 * preparation stage means an unusable directory fails before validation and
 * before approval — no prompt, nothing executed — and everything downstream
 * reads the resolved absolute path instead of the model's `../..` spelling,
 * so an obfuscated target cannot pass for a harmless one.
 */
export declare const resolveBashCwdArgument: (sessionCwd: string, args: Record<string, unknown>) => Record<string, unknown>;
/**
 * Declare `cwd` on the bash descriptor.
 *
 * Not load-bearing for validation — pi's bash schema sets no
 * additionalProperties, so an undeclared cwd would pass anyway. It is declared
 * because the descriptor is the contract the capability surface, the generated
 * guest declarations, and the approval classifier all read; a tool that
 * quietly honors a field it does not advertise is the next person's trap.
 *
 * Rebuilt as a fresh TObject rather than spread-cloned: TypeBox schemas carry
 * Symbol keys that a spread drops, which would leave Value.Check unable to
 * validate the descriptor at all. Property values are reused by reference, so
 * they keep their own Symbols.
 */
export declare const withBashCwdSchema: (schema: unknown) => unknown;
/**
 * Bash definitions bound to an execution directory.
 *
 * This class is the whole seam between Fabric's per-call cwd and pi's
 * cwd-bound tool family: `createBashToolDefinition(cwd)`'s argument is what
 * reaches spawn context and then BashOperations.exec. If pi-coding-agent ever
 * honors ExtensionContext.cwd (earendil-works/pi#8679), or Fabric moves onto
 * pi-agent-core's harness tools where the execution environment already
 * carries cwd, this collapses to passing cwd through the context and the class
 * goes away — the guest-facing `pi.bash({ command, cwd })` contract is
 * unaffected either way.
 */
export declare class BashCwdDefinitions {
    #private;
    /** A bash definition bound to `cwd`, reusing a recent one when possible. */
    get(cwd: string): ToolDefinition<any, any, any>;
}
//# sourceMappingURL=pi-bash-cwd.d.ts.map