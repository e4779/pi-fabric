// src/agents/claude-cli.ts
import { randomUUID } from "node:crypto";
import path from "node:path";
import crossSpawn from "cross-spawn";
var NODE_SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".cjs", ".mjs", ".ts", ".cts", ".mts"]);
var spawnCli = (command, args, options) => NODE_SCRIPT_EXTENSIONS.has(path.extname(command).toLowerCase()) ? crossSpawn(process.execPath, [command, ...args], options) : crossSpawn(command, [...args], options);
var MODEL_DISCOVERY_TIMEOUT_MS = 1e4;
var MODEL_DISCOVERY_MAX_CHARS = 2e6;
var CLAUDE_TOOL_NAMES = {
  read: "Read",
  grep: "Grep",
  find: "Glob",
  ls: "Glob",
  bash: "Bash",
  edit: "Edit",
  write: "Write"
};
var nonEmptyString = (value) => typeof value === "string" && value.trim() ? value.trim() : void 0;
var asClaudeModel = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
  const record = value;
  const modelValue = nonEmptyString(record.value);
  if (!modelValue) return void 0;
  const resolvedModel = nonEmptyString(record.resolvedModel) ?? modelValue;
  const displayName = nonEmptyString(record.displayName) ?? modelValue;
  const description = nonEmptyString(record.description) ?? resolvedModel;
  const supportedEffortLevels = Array.isArray(record.supportedEffortLevels) ? record.supportedEffortLevels.filter(
    (level) => typeof level === "string" && Boolean(level.trim())
  ) : void 0;
  return {
    value: modelValue,
    resolvedModel,
    displayName,
    description,
    ...typeof record.supportsEffort === "boolean" ? { supportsEffort: record.supportsEffort } : {},
    ...supportedEffortLevels && supportedEffortLevels.length > 0 ? { supportedEffortLevels } : {},
    ...typeof record.supportsAdaptiveThinking === "boolean" ? { supportsAdaptiveThinking: record.supportsAdaptiveThinking } : {},
    ...typeof record.supportsFastMode === "boolean" ? { supportsFastMode: record.supportsFastMode } : {},
    ...typeof record.supportsAutoMode === "boolean" ? { supportsAutoMode: record.supportsAutoMode } : {}
  };
};
var mapClaudeTools = (tools) => {
  const mapped = [];
  for (const tool of tools) {
    const claudeTool = Object.hasOwn(CLAUDE_TOOL_NAMES, tool) ? CLAUDE_TOOL_NAMES[tool] : void 0;
    if (!claudeTool) {
      throw new Error(
        `Claude runner does not support Fabric tool ${JSON.stringify(tool)}. Supported tools: ${Object.keys(
          CLAUDE_TOOL_NAMES
        ).join(", ")}`
      );
    }
    if (!mapped.includes(claudeTool)) mapped.push(claudeTool);
  }
  return mapped;
};
var normalizeClaudeModel = (model) => {
  const trimmed = model.trim();
  const normalized = trimmed.startsWith("claude/") ? trimmed.slice("claude/".length) : trimmed.startsWith("anthropic/") ? trimmed.slice("anthropic/".length) : trimmed;
  if (!normalized) throw new Error("Claude model must include a runtime model value");
  return normalized;
};
var claudeEffort = (thinking) => thinking === "off" || thinking === "minimal" ? "low" : thinking;
var buildClaudeArguments = (options) => {
  const tools = mapClaudeTools(options.tools);
  const args = [
    "-p",
    "--input-format",
    "stream-json",
    "--output-format",
    "stream-json",
    "--verbose",
    "--include-partial-messages",
    "--permission-mode",
    "dontAsk",
    "--tools",
    tools.join(",")
  ];
  if (tools.length > 0) args.push("--allowedTools", tools.join(","));
  if (!options.extensions) args.push("--safe-mode");
  if (!options.persistentSession) args.push("--no-session-persistence");
  if (options.runnerSessionId) args.push("--resume", options.runnerSessionId);
  if (options.model) args.push("--model", normalizeClaudeModel(options.model));
  if (options.thinking) args.push("--effort", claudeEffort(options.thinking));
  if (options.systemPrompt) args.push("--append-system-prompt", options.systemPrompt);
  if (options.schema) args.push("--json-schema", options.schema);
  if (options.name) args.push("--name", options.name);
  return args;
};
var claudeUserMessage = (message, images = []) => ({
  type: "user",
  message: {
    role: "user",
    content: images.length === 0 ? message : [
      { type: "text", text: message },
      ...images.map((image) => ({
        type: "image",
        source: {
          type: "base64",
          media_type: image.mimeType,
          data: image.data
        }
      }))
    ]
  },
  parent_tool_use_id: null,
  session_id: "",
  uuid: randomUUID()
});
var discoverClaudeModels = async (binary, cwd, timeoutMs = MODEL_DISCOVERY_TIMEOUT_MS) => new Promise((resolve, reject) => {
  const requestId = `fabric-models-${randomUUID()}`;
  const child = spawnCli(
    binary,
    [
      "-p",
      "--safe-mode",
      "--no-session-persistence",
      "--input-format",
      "stream-json",
      "--output-format",
      "stream-json",
      "--verbose",
      "--permission-mode",
      "dontAsk",
      "--tools",
      ""
    ],
    { cwd, stdio: ["pipe", "pipe", "pipe"] }
  );
  let stdout = "";
  let stderr = "";
  let settled = false;
  let timeout;
  let forceKill;
  const finish = (error, models) => {
    if (settled) return;
    settled = true;
    if (timeout) clearTimeout(timeout);
    child.kill("SIGTERM");
    forceKill = setTimeout(() => child.kill("SIGKILL"), 1e3);
    forceKill.unref();
    if (error) reject(error);
    else resolve(models ?? []);
  };
  const inspectLines = () => {
    const lines = stdout.split("\n");
    stdout = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      let parsed;
      try {
        parsed = JSON.parse(line);
      } catch {
        continue;
      }
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) continue;
      const event = parsed;
      if (event.type !== "control_response") continue;
      const response = event.response;
      if (typeof response !== "object" || response === null || Array.isArray(response)) continue;
      const envelope = response;
      if (envelope.request_id !== requestId) continue;
      if (envelope.subtype !== "success") {
        finish(new Error(nonEmptyString(envelope.error) ?? "Claude model discovery failed"));
        return;
      }
      const payload = envelope.response;
      if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
        finish(new Error("Claude model discovery returned an invalid response"));
        return;
      }
      const rawModels = payload.models;
      const models = Array.isArray(rawModels) ? rawModels.map(asClaudeModel).filter((model) => Boolean(model)) : [];
      finish(void 0, models);
      return;
    }
  };
  child.stdout?.on("data", (chunk) => {
    stdout += chunk.toString("utf8");
    if (stdout.length > MODEL_DISCOVERY_MAX_CHARS) {
      finish(new Error("Claude model discovery output exceeded its safety limit"));
      return;
    }
    inspectLines();
  });
  child.stderr?.on("data", (chunk) => {
    stderr = (stderr + chunk.toString("utf8")).slice(-2e4);
  });
  child.once("error", (error) => finish(error));
  child.once("close", (code) => {
    if (forceKill) clearTimeout(forceKill);
    if (settled) return;
    inspectLines();
    const detail = stderr.trim();
    finish(
      new Error(
        detail || `Claude model discovery exited with code ${code ?? "unknown"} before initialization`
      )
    );
  });
  child.stdin?.on("error", () => {
  });
  child.stdin?.end(
    `${JSON.stringify({
      type: "control_request",
      request_id: requestId,
      request: { subtype: "initialize" }
    })}
`
  );
  timeout = setTimeout(() => {
    finish(new Error(`Claude model discovery timed out after ${timeoutMs}ms`));
  }, timeoutMs);
  timeout.unref();
});

export {
  mapClaudeTools,
  normalizeClaudeModel,
  claudeEffort,
  buildClaudeArguments,
  claudeUserMessage,
  discoverClaudeModels
};
//# sourceMappingURL=chunk-EKJ4KUXF.js.map
