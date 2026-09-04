import type { FabricAgentConfig } from "../config.js";
/**
 * Host-side resolution for the usage export store written by spawned workers
 * (see worker/session-export.ts). Files follow the pi-format store layout that
 * tokscale and ccusage already scan:
 *
 *   <root>/sessions/.fabric/<encoded-cwd>/<timestamp>_<runId>.jsonl
 *
 * Both trackers walk their session roots recursively, while pi's own resume
 * picker only reads its immediate "<encoded-cwd>" directory — so hosting the
 * export under the ".fabric" namespace inside pi's store makes trackers count
 * subagent usage with zero configuration while pi itself never lists these
 * files. Root resolves as:
 *
 *   PI_FABRIC_AGENT_DIR env  >  agents.sessionExportDir  >  ~/.pi/agent
 *
 * Prefer an isolated store instead? Set agents.sessionExportDir to
 * ~/.pi-fabric/agent and register it as a ccusage pi.stores named store.
 */
export declare const SESSION_EXPORT_ENV = "PI_FABRIC_AGENT_DIR";
/**
 * Pi's exact cwd → session-subdir encoding (badlogic/pi-mono
 * getDefaultSessionDirPath): `/Users/dev/project` becomes `--Users-dev-project--`.
 * Both trackers only require the directory to sit under the scanned tree; using
 * pi's encoding keeps fabric sessions visually consistent with native ones.
 * Already-absolute inputs are encoded verbatim: resolving a POSIX path on win32
 * would prepend the current drive (`/x` → `D:\\x`) and skew the encoding, so
 * only relative inputs go through the platform resolver like pi does.
 */
export declare const encodeSessionExportCwd: (cwd: string) => string;
/** Root of the export store, or undefined when `agents.sessionExport` is off. */
export declare const resolveSessionExportDir: (config: FabricAgentConfig) => string | undefined;
/**
 * Final JSONL path for one run: `<root>/sessions/.fabric/<encoded-cwd>/<ts>_<runId>.jsonl`.
 * The ".fabric" namespace is deliberate: tokscale (walkdir) and ccusage both
 * recurse past it, but pi's per-project resume picker never descends into it.
 */
export declare const sessionExportFileFor: (root: string, cwd: string, runId: string, at: Date) => string;
//# sourceMappingURL=session-export.d.ts.map