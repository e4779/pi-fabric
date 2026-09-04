// src/worker/run-record.ts
import fs from "node:fs";
import path from "node:path";
var MAX_RUN_ERROR_CHARS = 2e4;
var MAX_RUN_TEXT_CHARS = 1e5;
var emptyUsage = () => ({
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  cost: 0
});
var createRunningRecord = (options, task, thinking, startedAt) => ({
  id: options.id,
  name: options.name,
  task,
  status: "running",
  runner: options.runner,
  transport: options.transport,
  cwd: options.cwd,
  ...options.model ? { model: options.model } : {},
  ...thinking ? { thinking } : {},
  ...options.actorId ? { actorId: options.actorId } : {},
  ...options.actorName ? { actorName: options.actorName } : {},
  ...options.capabilityRequirements ? { capabilityRequirements: [...options.capabilityRequirements] } : {},
  ...options.capabilityDigest ? { capabilityDigest: options.capabilityDigest } : {},
  startedAt,
  updatedAt: startedAt,
  turns: 0,
  toolCalls: 0,
  text: "",
  usage: emptyUsage(),
  logFile: options.logFile,
  ...options.branch ? { branch: options.branch } : {},
  ...options.worktree ? { worktree: options.worktree } : {}
});
var writeRunRecord = (filePath, record) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify(record, null, 2), {
    encoding: "utf8",
    mode: 384
  });
  renameWithRetry(temporaryPath, filePath);
};
var RETRYABLE_RENAME_CODES = /* @__PURE__ */ new Set(["EPERM", "EACCES", "EEXIST", "EBUSY"]);
var syncSleep = (ms) => {
  try {
    const buffer = new Int32Array(new SharedArrayBuffer(4));
    Atomics.wait(buffer, 0, 0, ms);
  } catch {
  }
};
var renameWithRetry = (source, target) => {
  for (let attempt = 1; ; attempt++) {
    try {
      fs.renameSync(source, target);
      return;
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : void 0;
      if (attempt >= 8 || code === void 0 || !RETRYABLE_RENAME_CODES.has(code)) {
        throw error;
      }
      syncSleep(25 * attempt);
    }
  }
};
var updateRunRecord = (filePath, record) => {
  record.updatedAt = Date.now();
  writeRunRecord(filePath, record);
};
var writeCrashRunRecord = (filePath, record, error) => {
  const reason = error instanceof Error ? error.message : String(error);
  const crashed = {
    ...record,
    status: "failed",
    error: `Worker crashed before reporting a result: ${reason}`.slice(0, MAX_RUN_ERROR_CHARS),
    finishedAt: Date.now(),
    updatedAt: Date.now()
  };
  delete crashed.currentTool;
  writeRunRecord(filePath, crashed);
};
var numberField = (value) => typeof value === "number" ? value : 0;
var applyUsage = (record, message) => {
  const usage = message.usage;
  if (typeof usage !== "object" || usage === null) return;
  const values = usage;
  record.usage.input += numberField(values.input);
  record.usage.output += numberField(values.output);
  record.usage.cacheRead += numberField(values.cacheRead);
  record.usage.cacheWrite += numberField(values.cacheWrite);
  const cost = values.cost;
  if (typeof cost === "number") record.usage.cost += cost;
  if (typeof cost === "object" && cost !== null) {
    record.usage.cost += numberField(cost.total);
  }
};
var extractUsageDelta = (message) => {
  const usage = message.usage;
  if (typeof usage !== "object" || usage === null || Array.isArray(usage)) return void 0;
  const values = usage;
  const cost = values.cost;
  return {
    input: numberField(values.input),
    output: numberField(values.output),
    cacheRead: numberField(values.cacheRead),
    cacheWrite: numberField(values.cacheWrite),
    cost: typeof cost === "number" ? cost : typeof cost === "object" && cost !== null ? numberField(cost.total) : 0
  };
};
var latestRunText = (text) => Array.from(text).slice(-MAX_RUN_TEXT_CHARS).join("");
export {
  applyUsage,
  createRunningRecord,
  emptyUsage,
  extractUsageDelta,
  latestRunText,
  updateRunRecord,
  writeCrashRunRecord,
  writeRunRecord
};
//# sourceMappingURL=run-record-IYNFBDT4.js.map
