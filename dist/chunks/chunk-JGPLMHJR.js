// src/core/agent-dir.ts
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
var ENV_AGENT_DIR = "PI_CODING_AGENT_DIR";
var CONFIG_DIR_NAME = ".pi";
var expandEnvDir = (envDir) => {
  if (/^file:\/\//.test(envDir)) return fileURLToPath(envDir);
  if (envDir === "~") return homedir();
  if (envDir.startsWith("~/") || process.platform === "win32" && envDir.startsWith("~\\")) {
    return path.join(homedir(), envDir.slice(2));
  }
  return envDir;
};
var resolveAgentDir = () => {
  const envDir = process.env[ENV_AGENT_DIR];
  if (envDir) return expandEnvDir(envDir);
  return path.join(homedir(), CONFIG_DIR_NAME, "agent");
};

// src/ui/dynamic-border.ts
var DynamicBorder = class {
  #color;
  constructor(color = (str) => str) {
    this.#color = color;
  }
  invalidate() {
  }
  render(width) {
    return [this.#color("\u2500".repeat(Math.max(1, width)))];
  }
};

export {
  resolveAgentDir,
  DynamicBorder
};
//# sourceMappingURL=chunk-JGPLMHJR.js.map
