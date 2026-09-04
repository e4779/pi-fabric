// src/agents/veda-cli.ts
var VEDA_TOOL_NAMES = {
  read: "read",
  grep: "grep",
  find: "glob",
  ls: "glob",
  bash: "bash",
  edit: "edit",
  write: "write"
};
var mapVedaTools = (tools) => {
  const mapped = [];
  for (const tool of tools) {
    const vedaTool = Object.hasOwn(VEDA_TOOL_NAMES, tool) ? VEDA_TOOL_NAMES[tool] : void 0;
    if (!vedaTool) {
      throw new Error(
        `Veda runner does not support Fabric tool ${JSON.stringify(tool)}. Supported tools: ${Object.keys(
          VEDA_TOOL_NAMES
        ).join(", ")}`
      );
    }
    if (!mapped.includes(vedaTool)) mapped.push(vedaTool);
  }
  return mapped;
};
var normalizeVedaModel = (model) => {
  const trimmed = model.trim();
  const normalized = trimmed.startsWith("veda/") ? trimmed.slice("veda/".length) : trimmed;
  if (!normalized) throw new Error("Veda model must include a model value");
  return normalized;
};
var vedaReasoning = (thinking) => thinking === "off" || thinking === "minimal" ? "minimal" : thinking;
var buildVedaArguments = (options) => {
  const tools = mapVedaTools(options.tools);
  const args = ["-b", options.backend, "-p", options.persona];
  if (options.model) args.push("-m", normalizeVedaModel(options.model));
  if (options.thinking) args.push("-r", vedaReasoning(options.thinking));
  if (tools.length > 0) args.push("--tools", tools.join(","));
  else args.push("--no-tools");
  args.push("--json", "--no-sel", "-S", options.session, "--no-notify");
  return args;
};

export {
  mapVedaTools,
  normalizeVedaModel,
  vedaReasoning,
  buildVedaArguments
};
//# sourceMappingURL=chunk-KKL6O7KG.js.map
