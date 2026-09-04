#!/usr/bin/env node

// src/residency/launcher.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crossSpawn from "cross-spawn";

// src/residency/launcher-owner.ts
function observeResidentOwner(ownerPid, childPid, claimed) {
  if (childPid === void 0) {
    return { claimed, observedOwner: ownerPid !== void 0, closeInput: false };
  }
  if (ownerPid === childPid) {
    return { claimed: true, observedOwner: true, closeInput: false };
  }
  if (ownerPid !== void 0) {
    return { claimed, observedOwner: true, closeInput: true };
  }
  return { claimed, observedOwner: false, closeInput: claimed };
}

// src/residency/launcher.ts
var NODE_SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".cjs", ".mjs", ".ts", ".cts", ".mts"]);
var spawnPi = (command, args, options) => NODE_SCRIPT_EXTENSIONS.has(path.extname(command).toLowerCase()) ? crossSpawn(process.execPath, [command, ...args], options) : crossSpawn(command, [...args], options);
var parseConfigPath = (argv) => {
  const index = argv.indexOf("--config");
  const value = index >= 0 ? argv[index + 1] : void 0;
  if (!value) throw new Error("Missing resident launcher argument: --config");
  return path.resolve(value);
};
var readConfig = (configPath2) => {
  const value = JSON.parse(fs.readFileSync(configPath2, "utf8"));
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Invalid Fabric resident host config");
  }
  const config = value;
  if (typeof config.cwd !== "string" || typeof config.piBinary !== "string") {
    throw new Error("Fabric resident host config is incomplete");
  }
  return { cwd: config.cwd, piBinary: config.piBinary };
};
var liveOwnerPid = (ownerPath) => {
  try {
    const owner = JSON.parse(fs.readFileSync(ownerPath, "utf8"));
    if (typeof owner.pid !== "number") return void 0;
    process.kill(owner.pid, 0);
    return owner.pid;
  } catch {
    return void 0;
  }
};
var writeFailure = (configPath2, error) => {
  try {
    const message = error instanceof Error ? error.message : String(error);
    const dir = path.dirname(configPath2);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "error.json"), JSON.stringify({
      error: message,
      occurredAt: Date.now()
    }, null, 2));
    fs.appendFileSync(path.join(dir, "launcher.log"), `${JSON.stringify({ event: "launcher-failed", at: Date.now(), message })}
`);
  } catch {
  }
};
var configPath = parseConfigPath(process.argv);
try {
  const config = readConfig(configPath);
  const trace = (event, extra = {}) => {
    try {
      const dir = path.dirname(configPath);
      fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(path.join(dir, "launcher.log"), `${JSON.stringify({
        event,
        at: Date.now(),
        ...extra
      })}
`);
    } catch {
    }
  };
  trace("launcher-started", { pid: process.pid, configPath, platform: process.platform });
  const entry = fileURLToPath(new URL("./pi-entry.js", import.meta.url));
  const child = spawnPi(config.piBinary, [
    "--mode",
    "rpc",
    "--no-session",
    "--no-tools",
    "--no-extensions",
    "--no-skills",
    "--no-prompt-templates",
    "--no-context-files",
    "--extension",
    entry
  ], {
    cwd: config.cwd,
    detached: false,
    // RPC ends on stdin EOF. Keep it open only while this child owns residency.
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, PI_FABRIC_RESIDENT_CONFIG: configPath }
  });
  let seenOwner = false;
  let claimedOwner = false;
  let closingInput = false;
  let stderr = "";
  const ownerPath = path.join(path.dirname(configPath), "owner.json");
  const childLogPath = path.join(path.dirname(configPath), "child-stderr.log");
  try {
    fs.rmSync(childLogPath, { force: true });
  } catch {
  }
  child.stdout?.on("data", (chunk) => {
    try {
      fs.appendFileSync(childLogPath, chunk);
    } catch {
    }
  });
  const ownerPoll = setInterval(() => {
    const observation = observeResidentOwner(liveOwnerPid(ownerPath), child.pid, claimedOwner);
    claimedOwner = observation.claimed;
    seenOwner ||= observation.observedOwner;
    if (observation.closeInput && !closingInput) {
      closingInput = true;
      child.stdin?.end();
    }
  }, 50);
  ownerPoll.unref();
  child.stderr?.on("data", (chunk) => {
    stderr = `${stderr}${chunk}`.slice(-4e3);
    try {
      fs.appendFileSync(childLogPath, chunk);
    } catch {
    }
  });
  trace("child-spawned", { pid: child.pid });
  child.on("error", (error) => {
    trace("child-error", { message: error instanceof Error ? error.message : String(error) });
    writeFailure(configPath, error);
  });
  child.on("exit", (code, signal) => {
    clearInterval(ownerPoll);
    trace("child-exit", { code, signal, seenOwner });
    if (!seenOwner) writeFailure(configPath, stderr.trim() || `Pi resident host exited (${signal ?? code ?? "unknown"})`);
    process.exitCode = code ?? 1;
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => child.kill(signal));
  }
} catch (error) {
  writeFailure(configPath, error);
  process.exitCode = 1;
}
//# sourceMappingURL=launcher.js.map
