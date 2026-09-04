// src/worker/options.ts
var argumentMap = (argv) => {
  const result = /* @__PURE__ */ new Map();
  for (let index = 2; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || value === void 0) {
      throw new Error(`Invalid worker argument near ${key ?? "<end>"}`);
    }
    result.set(key.slice(2), value);
  }
  return result;
};
var required = (args, name) => {
  const value = args.get(name);
  if (!value) throw new Error(`Missing worker argument: --${name}`);
  return value;
};
var optional = (args, name) => args.get(name) || void 0;
var parseWorkerOptions = (argv = process.argv) => {
  const args = argumentMap(argv);
  const model = optional(args, "model");
  const thinking = optional(args, "thinking");
  const fabricExtensionPath = optional(args, "fabric-extension");
  const schemaFile = optional(args, "schema-file");
  const imagesFile = optional(args, "images-file");
  const systemPrompt = optional(args, "system-prompt");
  const sessionFile = optional(args, "session-file");
  const sessionExportFile = optional(args, "session-export-file");
  const actorId = optional(args, "actor-id");
  const actorName = optional(args, "actor-name");
  const capabilityRequirementsSource = optional(args, "capability-requirements");
  const capabilityDigest = optional(args, "capability-digest");
  const capabilityRequirements = capabilityRequirementsSource ? JSON.parse(capabilityRequirementsSource) : void 0;
  if (capabilityRequirements !== void 0 && (!Array.isArray(capabilityRequirements) || capabilityRequirements.length > 128 || capabilityRequirements.some((ref) => typeof ref !== "string" || ref.length > 256 || !ref.includes(".")))) {
    throw new Error("Invalid worker capability requirements");
  }
  const meshRoot = optional(args, "mesh-root");
  const projectRoot = optional(args, "project-root");
  const ownerHostId = optional(args, "owner-host-id");
  const ownerIdentityId = optional(args, "owner-identity-id");
  const runRoot = optional(args, "run-root");
  const steerFile = optional(args, "steer-file");
  const branch = optional(args, "branch");
  const worktree = optional(args, "worktree");
  const maxTokens = optional(args, "max-tokens");
  const runnerSessionId = optional(args, "runner-session-id");
  const mainAgentId = optional(args, "main-agent-id");
  const runner = required(args, "runner");
  if (runner !== "pi" && runner !== "claude" && runner !== "veda") {
    throw new Error(`Unsupported Fabric agent runner: ${runner}`);
  }
  return {
    id: required(args, "id"),
    runner,
    name: required(args, "name"),
    taskFile: required(args, "task-file"),
    ...imagesFile ? { imagesFile } : {},
    statusFile: required(args, "status-file"),
    lifecycleFile: required(args, "lifecycle-file"),
    logFile: required(args, "log-file"),
    ...schemaFile ? { schemaFile } : {},
    cwd: required(args, "cwd"),
    piBinary: required(args, "pi-binary"),
    claudeBinary: required(args, "claude-binary"),
    vedaBinary: required(args, "veda-binary"),
    vedaBackend: required(args, "veda-backend"),
    vedaPersona: required(args, "veda-persona"),
    timeoutMs: Number(required(args, "timeout-ms")),
    depth: Number(required(args, "depth")),
    fullCodeMode: required(args, "full-code-mode") === "true",
    ...mainAgentId ? { mainAgentId } : {},
    extensions: required(args, "extensions") === "true",
    tools: JSON.parse(required(args, "tools")),
    grantedRisks: JSON.parse(required(args, "granted-risks")),
    transport: required(args, "transport"),
    ...fabricExtensionPath ? { fabricExtensionPath } : {},
    ...model ? { model } : {},
    ...thinking ? { thinking } : {},
    ...systemPrompt ? { systemPrompt } : {},
    ...sessionFile ? { sessionFile } : {},
    ...sessionExportFile ? { sessionExportFile } : {},
    ...actorId ? { actorId } : {},
    ...actorName ? { actorName } : {},
    ...capabilityRequirements ? { capabilityRequirements: [...new Set(capabilityRequirements)] } : {},
    ...capabilityDigest ? { capabilityDigest } : {},
    ...meshRoot ? { meshRoot } : {},
    ...projectRoot ? { projectRoot } : {},
    ...ownerHostId ? { ownerHostId } : {},
    ...ownerIdentityId ? { ownerIdentityId } : {},
    ...runnerSessionId ? { runnerSessionId } : {},
    ...runRoot ? { runRoot } : {},
    ...steerFile ? { steerFile } : {},
    ...branch ? { branch } : {},
    ...worktree ? { worktree } : {},
    ...maxTokens ? { maxTokens: Number(maxTokens) } : {}
  };
};
export {
  parseWorkerOptions
};
//# sourceMappingURL=options-IM6IMLWM.js.map
