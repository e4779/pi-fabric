// src/worker/session-export.ts
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
var FABRIC_AGENT_MARKER = "fabricagent-";
var nonNegative = (value) => Number.isFinite(value) ? Math.max(0, value) : 0;
var SessionExporter = class {
  file;
  #sessionId;
  #cwd;
  #agentName;
  #headerWritten = false;
  #lastEntryId = null;
  #disabled = false;
  constructor(options) {
    this.file = options.file;
    this.#sessionId = options.sessionId;
    this.#cwd = options.cwd;
    this.#agentName = options.agentName;
  }
  /**
   * Append one attributed assistant usage line. Zero-usage pushes are skipped
   * so heartbeat-style emissions never write entries; the file and its header
   * are created lazily on the first real push so runs that never touch a model
   * leave nothing behind. Best-effort: any IO failure disables the exporter
   * rather than failing the run.
   */
  push(usage, model, provider, at = Date.now()) {
    if (this.#disabled) return;
    const tokens = {
      input: nonNegative(usage.input),
      output: nonNegative(usage.output),
      cacheRead: nonNegative(usage.cacheRead),
      cacheWrite: nonNegative(usage.cacheWrite)
    };
    const cost = nonNegative(usage.cost);
    const totalTokens = tokens.input + tokens.output + tokens.cacheRead + tokens.cacheWrite;
    if (totalTokens === 0 && cost === 0) return;
    try {
      this.#ensureHeader(at);
      const id = randomUUID();
      const entry = {
        type: "message",
        id,
        parentId: this.#lastEntryId,
        timestamp: new Date(at).toISOString(),
        message: {
          role: "assistant",
          model: model?.trim() ? model : "unknown",
          ...provider?.trim() ? { provider } : {},
          usage: { ...tokens, totalTokens, cost: { total: cost } }
        }
      };
      fs.appendFileSync(this.file, `${JSON.stringify(entry)}
`, { encoding: "utf8", mode: 384 });
      this.#lastEntryId = id;
    } catch {
      this.#disabled = true;
    }
  }
  #ensureHeader(at) {
    if (this.#headerWritten) return;
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const timestamp = new Date(at).toISOString();
    const header = {
      type: "session",
      version: 3,
      id: this.#sessionId,
      timestamp,
      cwd: this.#cwd
    };
    fs.writeFileSync(this.file, `${JSON.stringify(header)}
`, { encoding: "utf8", mode: 384 });
    const info = {
      type: "session_info",
      id: `info_${this.#sessionId}`,
      parentId: null,
      timestamp,
      name: `${FABRIC_AGENT_MARKER}${this.#agentName}`
    };
    fs.appendFileSync(this.file, `${JSON.stringify(info)}
`, { encoding: "utf8", mode: 384 });
    this.#lastEntryId = header.id;
    this.#headerWritten = true;
  }
};
export {
  FABRIC_AGENT_MARKER,
  SessionExporter
};
//# sourceMappingURL=session-export-DTTE5UBV.js.map
