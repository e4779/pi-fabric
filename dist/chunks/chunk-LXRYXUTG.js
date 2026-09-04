import {
  DEFAULT_FABRIC_THINKING,
  defaultCodePreviewSettings,
  isFabricThinking,
  normalizeCodePreviewSettings
} from "./chunk-XCYTQGH2.js";
import {
  PI_CORE_TOOL_NAME_SET
} from "./chunk-XHM55LMF.js";
import {
  renameAtomic
} from "./chunk-LU4SNIHE.js";

// src/config.ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// src/core/model-resolution.ts
var PROVIDER_MODEL_RE = /^[^\s/]+\/[^\s/]+$/;
var FUZZY_RESOLUTION_MARKERS = ["closest", "recent", "latest"];
var modelKey = (model) => `${model.provider}/${model.id}`;
var sameModel = (left, right) => right !== void 0 && left.provider.toLowerCase() === right.provider.toLowerCase() && left.id.toLowerCase() === right.id.toLowerCase();
var normalizeModelAliases = (input) => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return {};
  const aliases = {};
  for (const [rawName, rawValue] of Object.entries(input)) {
    const name = rawName.trim();
    if (!name) continue;
    const values = typeof rawValue === "string" ? [rawValue] : rawValue;
    if (!Array.isArray(values) || values.length === 0) continue;
    const targets = [];
    let valid = true;
    for (const candidate of values) {
      if (typeof candidate !== "string") {
        valid = false;
        break;
      }
      const target = candidate.trim();
      if (!PROVIDER_MODEL_RE.test(target)) {
        valid = false;
        break;
      }
      if (!targets.includes(target)) targets.push(target);
    }
    if (valid && targets.length > 0) aliases[name] = targets;
  }
  return aliases;
};
var FUZZY_MIN_QUERY_LENGTH = 4;
var FUZZY_LEVENSHTEIN_MIN_RATIO = 0.55;
var subsequenceSpan = (needle, haystack) => {
  let index = 0;
  let first = -1;
  let last = -1;
  for (let i = 0; i < haystack.length && index < needle.length; i += 1) {
    if (haystack[i] === needle[index]) {
      if (first === -1) first = i;
      last = i;
      index += 1;
    }
  }
  return index === needle.length ? last - first + 1 : Number.POSITIVE_INFINITY;
};
var levenshteinRatio = (left, right) => {
  if (left === right) return 1;
  if (left.length === 0 || right.length === 0) return 0;
  let previous = Array.from({ length: right.length + 1 }, (_, column) => column);
  for (let i = 0; i < left.length; i += 1) {
    const current = [i + 1];
    for (let j = 0; j < right.length; j += 1) {
      current.push(Math.min(
        previous[j] + 1,
        current[j] + 1,
        previous[j] + (left[i] === right[j] ? 0 : 1)
      ));
    }
    previous = current;
  }
  return 1 - previous[right.length] / Math.max(left.length, right.length);
};
var closenessScore = (query, model) => {
  const id = model.id.toLowerCase();
  const name = model.name?.toLowerCase();
  if (id.startsWith(query)) return 60 + query.length / id.length * 20;
  if (id.includes(query)) return 50 + query.length / id.length * 15;
  if (name?.startsWith(query) === true) return 45 + query.length / name.length * 15;
  if (name?.includes(query) === true) return 40 + query.length / name.length * 10;
  if (model.provider.toLowerCase().includes(query)) return 25;
  if (query.length >= 3 && query[0] === id[0] && subsequenceSpan(query, id) <= query.length + 2) {
    return 18 + query.length / id.length * 6;
  }
  if (query.length >= FUZZY_MIN_QUERY_LENGTH) {
    const idRatio = levenshteinRatio(query, id);
    if (idRatio >= FUZZY_LEVENSHTEIN_MIN_RATIO) return 8 + idRatio * 10;
    if (name !== void 0) {
      const nameRatio = levenshteinRatio(query, name);
      if (nameRatio >= FUZZY_LEVENSHTEIN_MIN_RATIO) return 6 + nameRatio * 8;
    }
  }
  return 0;
};
var pickClosestCandidate = (query, pool, lastUsed) => {
  const usage = {};
  for (const [key, value] of Object.entries(lastUsed ?? {})) {
    usage[key.toLowerCase()] = value;
  }
  const recency = (model) => usage[`${model.provider}/${model.id}`.toLowerCase()] ?? 0;
  let best;
  let bestScore = 0;
  let tied = false;
  for (const model of pool) {
    const score = closenessScore(query, model);
    if (score <= 0) continue;
    if (best === void 0 || score > bestScore) {
      best = model;
      bestScore = score;
      tied = false;
      continue;
    }
    if (score === bestScore) {
      tied = true;
      const bestRecent = recency(best);
      const nextRecent = recency(model);
      if (nextRecent > bestRecent || nextRecent === bestRecent && modelKey(model) > modelKey(best)) {
        best = model;
      }
    }
  }
  if (best === void 0) return void 0;
  const runnersUp = pool.filter(
    (model) => model !== best && closenessScore(query, model) === bestScore
  );
  const wonOnRecency = tied && runnersUp.some((model) => recency(model) !== recency(best));
  return {
    model: best,
    via: !tied ? "closest" : wonOnRecency ? "recent" : "latest"
  };
};
var resolveFabricModel = (query, options) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return { kind: "not-found", query };
  const providerFilter = options.provider?.trim().toLowerCase();
  const available = providerFilter ? options.available.filter((model) => model.provider.toLowerCase() === providerFilter) : [...options.available];
  if (available.length === 0) return { kind: "not-found", query };
  const aliasKey = Object.keys(options.aliases).find(
    (key) => key.toLowerCase() === normalized
  );
  const tried = [];
  if (aliasKey !== void 0) {
    const chain = options.aliases[aliasKey] ?? [];
    for (const target of chain) {
      tried.push(target);
      const separator = target.indexOf("/");
      const provider = target.slice(0, separator);
      const id = target.slice(separator + 1);
      const match = available.find(
        (model) => model.provider.toLowerCase() === provider.toLowerCase() && model.id.toLowerCase() === id.toLowerCase()
      );
      if (match) {
        return sameModel(match, options.current) ? { kind: "already-active", model: match } : { kind: "resolved", model: match, via: aliasKey };
      }
    }
    return { kind: "not-found", query, tried };
  }
  const exact = available.find((model) => modelKey(model).toLowerCase() === normalized) ?? available.find((model) => model.id.toLowerCase() === normalized);
  if (exact) {
    return sameModel(exact, options.current) ? { kind: "already-active", model: exact } : { kind: "resolved", model: exact };
  }
  const candidates = available.filter(
    (model) => model.id.toLowerCase().includes(normalized) || model.name !== void 0 && model.name.toLowerCase().includes(normalized) || model.provider.toLowerCase().includes(normalized)
  );
  if (candidates.length === 1) {
    const match = candidates[0];
    if (match === void 0) return { kind: "not-found", query };
    return sameModel(match, options.current) ? { kind: "already-active", model: match } : { kind: "resolved", model: match };
  }
  const pool = candidates.length > 1 ? candidates : available;
  const picked = pickClosestCandidate(normalized, pool, options.lastUsed);
  if (picked) {
    return sameModel(picked.model, options.current) ? { kind: "already-active", model: picked.model } : { kind: "resolved", model: picked.model, via: picked.via };
  }
  if (candidates.length > 1) return { kind: "ambiguous", query, candidates };
  return { kind: "not-found", query };
};

// src/config-migrations.ts
var CURRENT_FABRIC_CONFIG_VERSION = 3;
var isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var mergeObjects = (base, override) => {
  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = merged[key];
    merged[key] = isObject(current) && isObject(value) ? mergeObjects(current, value) : value;
  }
  return merged;
};
var migrations = [
  {
    from: 0,
    to: 1,
    migrate(document) {
      const migrated = { ...document };
      const legacy = migrated.subagents;
      const canonical = migrated.agents;
      if (legacy !== void 0) {
        if (canonical !== void 0 && isObject(legacy) !== isObject(canonical)) {
          throw new Error(
            "Fabric configuration cannot merge legacy subagents with a malformed agents section"
          );
        }
        migrated.agents = isObject(legacy) && isObject(canonical) ? mergeObjects(legacy, canonical) : canonical ?? legacy;
      }
      delete migrated.subagents;
      return migrated;
    }
  },
  {
    from: 1,
    to: 2,
    migrate(document) {
      const migrated = { ...document };
      const ui = migrated.ui;
      if (isObject(ui) && Object.hasOwn(ui, "showNestedToolCalls")) {
        const renamed = { ...ui };
        if (!Object.hasOwn(renamed, "showAgentToolPreview")) {
          renamed.showAgentToolPreview = renamed.showNestedToolCalls;
        }
        delete renamed.showNestedToolCalls;
        migrated.ui = renamed;
      }
      return migrated;
    }
  },
  {
    from: 2,
    to: 3,
    migrate(document) {
      const migrated = { ...document };
      const ui = migrated.ui;
      if (isObject(ui) && Object.hasOwn(ui, "nestedToolDebounceMs")) {
        const renamed = { ...ui };
        if (!Object.hasOwn(renamed, "updateDebounceMs")) {
          renamed.updateDebounceMs = renamed.nestedToolDebounceMs;
        }
        delete renamed.nestedToolDebounceMs;
        migrated.ui = renamed;
      }
      return migrated;
    }
  }
];
var configVersion = (document) => {
  const value = document.configVersion;
  if (value === void 0) return 0;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error("Fabric configuration configVersion must be a non-negative integer");
  }
  return value;
};
var migrateFabricConfigDocument = (input) => {
  const fromVersion = configVersion(input);
  if (fromVersion > CURRENT_FABRIC_CONFIG_VERSION) {
    return {
      document: structuredClone(input),
      fromVersion,
      toVersion: fromVersion,
      appliedVersions: [],
      changed: false,
      forwardCompatible: true
    };
  }
  let version = fromVersion;
  let document = structuredClone(input);
  const appliedVersions = [];
  while (version < CURRENT_FABRIC_CONFIG_VERSION) {
    const migration = migrations.find((candidate) => candidate.from === version);
    if (!migration || migration.to !== version + 1) {
      throw new Error(`No Fabric configuration migration exists for version ${version}`);
    }
    document = migration.migrate(document);
    version = migration.to;
    document.configVersion = version;
    appliedVersions.push(version);
  }
  if (Object.hasOwn(document, "subagents")) {
    throw new Error("Current Fabric configuration contains removed key subagents");
  }
  return {
    document,
    fromVersion,
    toVersion: version,
    appliedVersions,
    changed: appliedVersions.length > 0,
    forwardCompatible: false
  };
};

// src/config.ts
var MIN_COMPACTION_TOKEN_THRESHOLD = 1e3;
var MAX_COMPACTION_TOKEN_THRESHOLD = 1e8;
var MIN_COMPACTION_RATIO_THRESHOLD = 0.25;
var MAX_COMPACTION_RATIO_THRESHOLD = 0.95;
var clampCompactionTokenThreshold = (value) => Math.min(
  MAX_COMPACTION_TOKEN_THRESHOLD,
  Math.max(MIN_COMPACTION_TOKEN_THRESHOLD, Math.round(value))
);
var clampCompactionRatioThreshold = (value) => Math.min(
  MAX_COMPACTION_RATIO_THRESHOLD,
  Math.max(MIN_COMPACTION_RATIO_THRESHOLD, value)
);
var MAX_EXECUTOR_TIMEOUT_MS = 24 * 36e5;
var MIN_AGENT_TIMEOUT_MS = 1e3;
var DEFAULT_AGENT_TIMEOUT_MS = 36e5;
var MAX_AGENT_TIMEOUT_MS = 24 * 36e5;
var QUICKJS_MAX_MEMORY_LIMIT_BYTES = 4294967295;
var MAX_EXECUTOR_MEMORY_LIMIT_BYTES = Math.max(
  8 * 1024 * 1024,
  Math.min(Number.MAX_SAFE_INTEGER, Math.floor(os.totalmem()))
);
var maxExecutorMemoryLimitBytes = (runtime) => runtime === "quickjs" ? Math.min(QUICKJS_MAX_MEMORY_LIMIT_BYTES, MAX_EXECUTOR_MEMORY_LIMIT_BYTES) : MAX_EXECUTOR_MEMORY_LIMIT_BYTES;
var DEFAULT_FABRIC_CONFIG = {
  fullCodeMode: true,
  executor: {
    runtime: "quickjs",
    timeoutMs: 12e4,
    maxTimeoutMs: 9e5,
    hostCallTimeouts: {},
    memoryLimitBytes: 64 * 1024 * 1024,
    maxOutputChars: 5e4,
    maxNestedResultChars: 2e6,
    resultFormat: "auto"
  },
  approvals: {
    read: "allow",
    write: "allow",
    execute: "allow",
    network: "allow",
    agent: "allow"
  },
  mcp: {
    enabled: true,
    disableOAuth: true,
    allowDynamicServers: true,
    callTimeoutMs: 12e4,
    cache: {
      enabled: true,
      revalidate: "changed",
      revalidateBudgetMs: 6e4
    }
  },
  prewalk: {
    mode: "in-place",
    alwaysRearm: false,
    compactOnReturn: true,
    detectShellWrites: true
  },
  agents: {
    enabled: true,
    runner: "pi",
    transport: "process",
    claude: { binary: "claude" },
    veda: { binary: "veda", backend: "agy", persona: "navigator-chat" },
    thinking: DEFAULT_FABRIC_THINKING,
    maxConcurrent: 4,
    maxPerExecution: 100,
    maxDepth: 2,
    timeoutMs: DEFAULT_AGENT_TIMEOUT_MS,
    extensions: true,
    defaultTools: ["read", "bash", "edit", "write", "grep", "find", "ls"],
    retainRuns: false,
    notifyOnComplete: true,
    budgetUsd: 0,
    maxTokensPerChild: 0,
    sessionExport: true,
    sessionExportDir: ""
  },
  components: [],
  capture: {
    enabled: true,
    hideFromModel: true,
    keepVisible: ["fabric_exec"],
    defaultRisk: "execute",
    risks: {
      read: "read",
      grep: "read",
      find: "read",
      ls: "read",
      edit: "write",
      write: "write",
      bash: "execute",
      fovea_sketch: "read",
      fovea_focus: "read",
      fovea_dwell: "read",
      fovea_impact: "read"
    }
  },
  ui: {
    enabled: true,
    widget: "auto",
    maxRows: 6,
    refreshMs: 500,
    eventHistory: 80,
    haltOnEscape: true,
    showAgentToolPreview: true,
    toolDisplay: "compact",
    updateDebounceMs: 100
  },
  compaction: {
    engine: "fabric",
    targetContextRatio: 0.65,
    thresholds: {},
    tokenThresholds: {}
  },
  retention: {
    orphanedTempRunMs: 6 * 60 * 60 * 1e3,
    oneShotRunMs: 24 * 60 * 60 * 1e3,
    actorRunArchiveMs: 7 * 24 * 60 * 60 * 1e3
  },
  mesh: {
    enabled: true,
    actorScope: "project",
    maxEventBytes: 256 * 1024,
    maxReadEvents: 500,
    actorPollMs: 250,
    actorQueueLimit: 32,
    eventContextChars: 4e4,
    actorContextEntries: 14
  },
  models: {
    aliases: {}
  },
  memory: {
    enabled: true,
    maxSessions: 500,
    maxEntryChars: 2e3,
    indexThinking: false,
    indexToolOutput: true,
    hotSessions: 50,
    digestTerms: 200,
    maxColdVocabularyBytes: 512 * 1024,
    maxColdCacheBytes: 1024 * 1024,
    maxSyncSessions: 1e4,
    maxSyncSourceBytes: 512 * 1024 * 1024,
    maxCacheCleanupFiles: 1e5,
    regexMaxPatternBytes: 1024,
    regexMaxHaystackTerms: 2e4,
    regexMaxHaystackBytes: 2 * 1024 * 1024,
    regexTimeoutMs: 250
  },
  repairs: {
    enabled: true
  },
  schema: {
    mode: "off",
    certificateTtlMs: 3e4,
    maxFiles: 100,
    maxBytes: 10 * 1024 * 1024,
    trustedCommands: {}
  },
  speculation: {
    enabled: true,
    maxConcurrent: 4,
    maxEntries: 64,
    maxBufferBytes: 2 * 1024 * 1024,
    entryTtlMs: 18e4,
    mcpAllowlist: []
  },
  codePreview: defaultCodePreviewSettings()
};
var readJsonObjectFile = (filePath) => {
  try {
    const source = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(source);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("configuration root must be an object");
    }
    return { document: parsed, source };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return void 0;
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read ${filePath}: ${message}`);
  }
};
var mergeObjects2 = (base, override) => {
  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = merged[key];
    if (typeof baseValue === "object" && baseValue !== null && !Array.isArray(baseValue) && typeof value === "object" && value !== null && !Array.isArray(value)) {
      merged[key] = mergeObjects2(
        baseValue,
        value
      );
    } else {
      merged[key] = value;
    }
  }
  return merged;
};
var approvalMode = (value, fallback) => value === "allow" || value === "ask" || value === "auto" || value === "deny" ? value : fallback;
var booleanValue = (value, fallback) => typeof value === "boolean" ? value : fallback;
var boundedInteger = (value, fallback, min, max) => typeof value === "number" && Number.isInteger(value) ? Math.max(min, Math.min(max, value)) : fallback;
var boundedFloat = (value, fallback, min, max) => typeof value === "number" && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
var stringValue = (value) => typeof value === "string" && value.trim() ? value : void 0;
var runnerValue = (value, fallback) => value === "pi" || value === "claude" || value === "veda" ? value : fallback;
var prewalkModeValue = (value, fallback) => value === "in-place" || value === "trajectory" ? value : fallback;
var transportValue = (value, fallback) => value === "auto" || value === "process" || value === "tmux" || value === "screen" || value === "localterm" || value === "herdr" ? value : fallback;
var thinkingValue = (value, fallback) => isFabricThinking(value) ? value : fallback;
var objectValue = (value) => typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
var widgetModeValue = (value, fallback) => value === "auto" || value === "always" || value === "hidden" ? value : fallback;
var toolDisplayModeValue = (value, fallback) => value === "full" || value === "compact" ? value : fallback;
var executorRuntimeValue = (value, fallback) => value === "quickjs" || value === "node-process" || value === "bun-process" ? value : fallback;
var resultFormatValue = (value, fallback) => value === "auto" || value === "yaml" || value === "json" || value === "text" ? value : fallback;
var compactionEngineValue = (value, fallback) => value === "pi" || value === "fabric" ? value : fallback;
var actorScopeValue = (value, fallback) => value === "project" || value === "session" ? value : fallback;
var schemaModeValue = (value, fallback) => value === "off" || value === "audit" || value === "enforce" ? value : fallback;
var mcpRevalidatePolicyValue = (value, fallback) => value === "changed" || value === "all" || value === "off" ? value : fallback;
var riskValue = (value, fallback) => value === "read" || value === "write" || value === "execute" || value === "network" || value === "agent" ? value : fallback;
var normalizeFabricConfig = (input) => {
  const executor = objectValue(input.executor);
  const executorMaxTimeoutMs = boundedInteger(
    executor.maxTimeoutMs,
    DEFAULT_FABRIC_CONFIG.executor.maxTimeoutMs,
    1e3,
    MAX_EXECUTOR_TIMEOUT_MS
  );
  const approvals = objectValue(input.approvals);
  const mcp = objectValue(input.mcp);
  const mcpCache = objectValue(mcp.cache);
  const prewalk = objectValue(input.prewalk);
  const agents = objectValue(input.agents);
  const claude = objectValue(agents.claude);
  const veda = objectValue(agents.veda);
  const capture = objectValue(input.capture);
  const ui = objectValue(input.ui);
  const compaction = objectValue(input.compaction);
  const retention = objectValue(input.retention);
  const mesh = objectValue(input.mesh);
  const memory = objectValue(input.memory);
  const repairs = objectValue(input.repairs);
  const modelsSection = objectValue(input.models);
  const schema = objectValue(input.schema);
  const schemaMode = schemaModeValue(schema.mode, DEFAULT_FABRIC_CONFIG.schema.mode);
  const speculation = objectValue(input.speculation);
  const configuredExecutorRuntime = executorRuntimeValue(
    executor.runtime,
    DEFAULT_FABRIC_CONFIG.executor.runtime
  );
  const executorRuntime = schemaMode === "enforce" ? "quickjs" : configuredExecutorRuntime;
  const configuredTools = Array.isArray(agents.defaultTools) ? agents.defaultTools.filter(
    (tool) => typeof tool === "string" && Boolean(tool)
  ) : DEFAULT_FABRIC_CONFIG.agents.defaultTools;
  const approvalModel = stringValue(approvals.model);
  const configPath = stringValue(mcp.configPath);
  const meshRoot = stringValue(mesh.root);
  const memoryIndexDir = stringValue(memory.indexDir);
  const compactionThresholds = Object.fromEntries(
    Object.entries(objectValue(compaction.thresholds)).filter(
      ([model, threshold]) => model.includes("/") && typeof threshold === "number" && Number.isFinite(threshold)
    ).map(([model, threshold]) => [
      model,
      clampCompactionRatioThreshold(threshold)
    ])
  );
  const compactionTokenThresholds = Object.fromEntries(
    Object.entries(objectValue(compaction.tokenThresholds)).filter(
      ([model, tokens]) => model.includes("/") && typeof tokens === "number" && Number.isFinite(tokens)
    ).map(([model, tokens]) => [
      model,
      clampCompactionTokenThreshold(tokens)
    ])
  );
  const prewalkModel = stringValue(prewalk.model);
  const prewalkThinking = isFabricThinking(prewalk.thinking) ? prewalk.thinking : void 0;
  const agentModel = stringValue(agents.model);
  const claudeBinary = stringValue(claude.binary);
  const claudeModel = stringValue(claude.model);
  const vedaBinary = stringValue(veda.binary);
  const vedaBackend = stringValue(veda.backend);
  const vedaModel = stringValue(veda.model);
  const vedaPersona = stringValue(veda.persona);
  const agentThinking = thinkingValue(agents.thinking, DEFAULT_FABRIC_CONFIG.agents.thinking);
  const configuredComponents = Array.isArray(input.components) ? input.components.flatMap((raw) => {
    const componentEntry = objectValue(raw);
    const id = stringValue(componentEntry.id);
    const component = stringValue(componentEntry.component);
    if (!id || !component) return [];
    return [{
      id,
      component,
      ...Object.prototype.hasOwnProperty.call(componentEntry, "config") ? { config: componentEntry.config } : {},
      ...typeof componentEntry.disabled === "boolean" ? { disabled: componentEntry.disabled } : {}
    }];
  }).slice(0, 256) : DEFAULT_FABRIC_CONFIG.components;
  const configuredVisible = Array.isArray(capture.keepVisible) ? capture.keepVisible.filter(
    (name) => typeof name === "string" && Boolean(name.trim())
  ) : DEFAULT_FABRIC_CONFIG.capture.keepVisible;
  const configuredRisks = {
    ...DEFAULT_FABRIC_CONFIG.capture.risks,
    ...objectValue(capture.risks)
  };
  const trustedCommands = Object.fromEntries(
    Object.entries(objectValue(schema.trustedCommands)).flatMap(([name, raw]) => {
      if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(name)) return [];
      const command = objectValue(raw);
      const executable = stringValue(command.command);
      if (!executable) return [];
      const shell = booleanValue(command.shell, false);
      const args = !shell && Array.isArray(command.args) ? command.args.filter((arg) => typeof arg === "string").slice(0, 64) : [];
      return [[name, {
        command: executable,
        args,
        shell,
        timeoutMs: boundedInteger(command.timeoutMs, 3e4, 1, 3e5)
      }]];
    })
  );
  const risks = Object.fromEntries(
    Object.entries(configuredRisks).filter(([name]) => Boolean(name.trim())).map(([name, risk]) => [name, riskValue(risk, DEFAULT_FABRIC_CONFIG.capture.defaultRisk)])
  );
  return {
    fullCodeMode: booleanValue(input.fullCodeMode, DEFAULT_FABRIC_CONFIG.fullCodeMode),
    executor: {
      runtime: executorRuntime,
      maxTimeoutMs: boundedInteger(
        executor.maxTimeoutMs,
        DEFAULT_FABRIC_CONFIG.executor.maxTimeoutMs,
        1e3,
        MAX_EXECUTOR_TIMEOUT_MS
      ),
      hostCallTimeouts: Object.fromEntries(
        Object.entries(objectValue(executor.hostCallTimeouts)).filter(
          ([ref, value]) => typeof ref === "string" && Boolean(ref.trim()) && typeof value === "number" && Number.isFinite(value) && value >= 1
        ).map(([ref, value]) => [ref, boundedInteger(value, 1e3, 1e3, executorMaxTimeoutMs)])
      ),
      timeoutMs: boundedInteger(
        executor.timeoutMs,
        DEFAULT_FABRIC_CONFIG.executor.timeoutMs,
        1e3,
        executorMaxTimeoutMs
      ),
      memoryLimitBytes: boundedInteger(
        executor.memoryLimitBytes,
        DEFAULT_FABRIC_CONFIG.executor.memoryLimitBytes,
        8 * 1024 * 1024,
        maxExecutorMemoryLimitBytes(executorRuntime)
      ),
      maxOutputChars: boundedInteger(
        executor.maxOutputChars,
        DEFAULT_FABRIC_CONFIG.executor.maxOutputChars,
        1e3,
        1e6
      ),
      maxNestedResultChars: boundedInteger(
        executor.maxNestedResultChars,
        DEFAULT_FABRIC_CONFIG.executor.maxNestedResultChars,
        1e4,
        2e7
      ),
      resultFormat: resultFormatValue(
        executor.resultFormat,
        DEFAULT_FABRIC_CONFIG.executor.resultFormat
      )
    },
    approvals: {
      read: approvalMode(approvals.read, DEFAULT_FABRIC_CONFIG.approvals.read),
      write: approvalMode(approvals.write, DEFAULT_FABRIC_CONFIG.approvals.write),
      execute: approvalMode(approvals.execute, DEFAULT_FABRIC_CONFIG.approvals.execute),
      network: approvalMode(approvals.network, DEFAULT_FABRIC_CONFIG.approvals.network),
      agent: approvalMode(approvals.agent, DEFAULT_FABRIC_CONFIG.approvals.agent),
      ...approvalModel ? { model: approvalModel } : {}
    },
    mcp: {
      enabled: booleanValue(mcp.enabled, DEFAULT_FABRIC_CONFIG.mcp.enabled),
      ...configPath ? { configPath } : {},
      disableOAuth: booleanValue(mcp.disableOAuth, DEFAULT_FABRIC_CONFIG.mcp.disableOAuth),
      allowDynamicServers: booleanValue(
        mcp.allowDynamicServers,
        DEFAULT_FABRIC_CONFIG.mcp.allowDynamicServers
      ),
      callTimeoutMs: boundedInteger(
        mcp.callTimeoutMs,
        DEFAULT_FABRIC_CONFIG.mcp.callTimeoutMs,
        1e3,
        9e5
      ),
      cache: {
        enabled: booleanValue(mcpCache.enabled, DEFAULT_FABRIC_CONFIG.mcp.cache.enabled),
        revalidate: mcpRevalidatePolicyValue(
          mcpCache.revalidate,
          DEFAULT_FABRIC_CONFIG.mcp.cache.revalidate
        ),
        revalidateBudgetMs: boundedInteger(
          mcpCache.revalidateBudgetMs,
          DEFAULT_FABRIC_CONFIG.mcp.cache.revalidateBudgetMs,
          1e3,
          6e5
        )
      }
    },
    prewalk: {
      ...prewalk.enabled === false ? { enabled: false } : {},
      mode: prewalkModeValue(prewalk.mode, DEFAULT_FABRIC_CONFIG.prewalk.mode),
      ...prewalkModel ? { model: prewalkModel } : {},
      ...prewalkThinking ? { thinking: prewalkThinking } : {},
      alwaysRearm: booleanValue(
        prewalk.alwaysRearm,
        DEFAULT_FABRIC_CONFIG.prewalk.alwaysRearm
      ),
      compactOnReturn: booleanValue(
        prewalk.compactOnReturn,
        DEFAULT_FABRIC_CONFIG.prewalk.compactOnReturn
      ),
      detectShellWrites: booleanValue(
        prewalk.detectShellWrites,
        DEFAULT_FABRIC_CONFIG.prewalk.detectShellWrites
      )
    },
    agents: {
      enabled: booleanValue(agents.enabled, DEFAULT_FABRIC_CONFIG.agents.enabled),
      runner: runnerValue(agents.runner, DEFAULT_FABRIC_CONFIG.agents.runner),
      transport: transportValue(agents.transport, DEFAULT_FABRIC_CONFIG.agents.transport),
      ...agentModel ? { model: agentModel } : {},
      claude: {
        binary: claudeBinary ?? DEFAULT_FABRIC_CONFIG.agents.claude.binary,
        ...claudeModel ? { model: claudeModel } : {}
      },
      veda: {
        binary: vedaBinary ?? DEFAULT_FABRIC_CONFIG.agents.veda.binary,
        backend: vedaBackend ?? DEFAULT_FABRIC_CONFIG.agents.veda.backend,
        ...vedaModel ? { model: vedaModel } : {},
        persona: vedaPersona ?? DEFAULT_FABRIC_CONFIG.agents.veda.persona
      },
      thinking: agentThinking,
      maxConcurrent: boundedInteger(
        agents.maxConcurrent,
        DEFAULT_FABRIC_CONFIG.agents.maxConcurrent,
        1,
        32
      ),
      maxPerExecution: boundedInteger(
        agents.maxPerExecution,
        DEFAULT_FABRIC_CONFIG.agents.maxPerExecution,
        1,
        1e3
      ),
      maxDepth: boundedInteger(
        agents.maxDepth,
        DEFAULT_FABRIC_CONFIG.agents.maxDepth,
        0,
        Number.MAX_SAFE_INTEGER
      ),
      timeoutMs: boundedInteger(
        agents.timeoutMs,
        DEFAULT_FABRIC_CONFIG.agents.timeoutMs,
        MIN_AGENT_TIMEOUT_MS,
        MAX_AGENT_TIMEOUT_MS
      ),
      extensions: booleanValue(agents.extensions, DEFAULT_FABRIC_CONFIG.agents.extensions),
      defaultTools: configuredTools,
      retainRuns: booleanValue(agents.retainRuns, DEFAULT_FABRIC_CONFIG.agents.retainRuns),
      notifyOnComplete: booleanValue(
        agents.notifyOnComplete,
        DEFAULT_FABRIC_CONFIG.agents.notifyOnComplete
      ),
      budgetUsd: boundedFloat(
        agents.budgetUsd,
        DEFAULT_FABRIC_CONFIG.agents.budgetUsd,
        0,
        1e6
      ),
      maxTokensPerChild: boundedInteger(
        agents.maxTokensPerChild,
        DEFAULT_FABRIC_CONFIG.agents.maxTokensPerChild,
        0,
        1e8
      ),
      sessionExport: booleanValue(
        agents.sessionExport,
        DEFAULT_FABRIC_CONFIG.agents.sessionExport
      ),
      sessionExportDir: typeof agents.sessionExportDir === "string" ? agents.sessionExportDir : DEFAULT_FABRIC_CONFIG.agents.sessionExportDir
    },
    components: configuredComponents.map((entry) => structuredClone(entry)),
    capture: {
      enabled: booleanValue(capture.enabled, DEFAULT_FABRIC_CONFIG.capture.enabled),
      hideFromModel: booleanValue(
        capture.hideFromModel,
        DEFAULT_FABRIC_CONFIG.capture.hideFromModel
      ),
      keepVisible: [...new Set(configuredVisible)],
      defaultRisk: riskValue(capture.defaultRisk, DEFAULT_FABRIC_CONFIG.capture.defaultRisk),
      risks
    },
    ui: {
      enabled: booleanValue(ui.enabled, DEFAULT_FABRIC_CONFIG.ui.enabled),
      widget: widgetModeValue(ui.widget, DEFAULT_FABRIC_CONFIG.ui.widget),
      maxRows: boundedInteger(ui.maxRows, DEFAULT_FABRIC_CONFIG.ui.maxRows, 1, 20),
      refreshMs: boundedInteger(ui.refreshMs, DEFAULT_FABRIC_CONFIG.ui.refreshMs, 100, 1e4),
      eventHistory: boundedInteger(
        ui.eventHistory,
        DEFAULT_FABRIC_CONFIG.ui.eventHistory,
        1,
        500
      ),
      haltOnEscape: booleanValue(ui.haltOnEscape, DEFAULT_FABRIC_CONFIG.ui.haltOnEscape),
      // Renamed from ui.showNestedToolCalls; the v2 migration rewrites persisted
      // files, and this fallback covers configs normalized without migration.
      showAgentToolPreview: booleanValue(
        ui.showAgentToolPreview ?? ui.showNestedToolCalls,
        DEFAULT_FABRIC_CONFIG.ui.showAgentToolPreview
      ),
      toolDisplay: toolDisplayModeValue(
        ui.toolDisplay,
        DEFAULT_FABRIC_CONFIG.ui.toolDisplay
      ),
      // Renamed from ui.nestedToolDebounceMs (v3): the window coalesces every
      // live fabric_exec card update — nested calls, progress, agent previews.
      updateDebounceMs: boundedInteger(
        ui.updateDebounceMs ?? ui.nestedToolDebounceMs,
        DEFAULT_FABRIC_CONFIG.ui.updateDebounceMs,
        0,
        2e3
      )
    },
    compaction: {
      engine: compactionEngineValue(compaction.engine, DEFAULT_FABRIC_CONFIG.compaction.engine),
      targetContextRatio: boundedFloat(
        compaction.targetContextRatio,
        DEFAULT_FABRIC_CONFIG.compaction.targetContextRatio,
        0.25,
        0.85
      ),
      thresholds: compactionThresholds,
      tokenThresholds: compactionTokenThresholds
    },
    retention: {
      orphanedTempRunMs: boundedInteger(
        retention.orphanedTempRunMs,
        DEFAULT_FABRIC_CONFIG.retention.orphanedTempRunMs,
        60 * 60 * 1e3,
        365 * 24 * 60 * 60 * 1e3
      ),
      oneShotRunMs: boundedInteger(
        retention.oneShotRunMs,
        DEFAULT_FABRIC_CONFIG.retention.oneShotRunMs,
        60 * 60 * 1e3,
        365 * 24 * 60 * 60 * 1e3
      ),
      actorRunArchiveMs: boundedInteger(
        retention.actorRunArchiveMs,
        DEFAULT_FABRIC_CONFIG.retention.actorRunArchiveMs,
        60 * 60 * 1e3,
        365 * 24 * 60 * 60 * 1e3
      )
    },
    mesh: {
      enabled: booleanValue(mesh.enabled, DEFAULT_FABRIC_CONFIG.mesh.enabled),
      ...meshRoot ? { root: meshRoot } : {},
      actorScope: actorScopeValue(mesh.actorScope, DEFAULT_FABRIC_CONFIG.mesh.actorScope),
      maxEventBytes: boundedInteger(
        mesh.maxEventBytes,
        DEFAULT_FABRIC_CONFIG.mesh.maxEventBytes,
        1024,
        4 * 1024 * 1024
      ),
      maxReadEvents: boundedInteger(
        mesh.maxReadEvents,
        DEFAULT_FABRIC_CONFIG.mesh.maxReadEvents,
        1,
        1e4
      ),
      actorPollMs: boundedInteger(
        mesh.actorPollMs,
        DEFAULT_FABRIC_CONFIG.mesh.actorPollMs,
        50,
        1e4
      ),
      actorQueueLimit: boundedInteger(
        mesh.actorQueueLimit,
        DEFAULT_FABRIC_CONFIG.mesh.actorQueueLimit,
        1,
        1e3
      ),
      eventContextChars: boundedInteger(
        mesh.eventContextChars,
        DEFAULT_FABRIC_CONFIG.mesh.eventContextChars,
        1e3,
        1e6
      ),
      actorContextEntries: boundedInteger(
        mesh.actorContextEntries,
        DEFAULT_FABRIC_CONFIG.mesh.actorContextEntries,
        1,
        100
      )
    },
    models: {
      aliases: normalizeModelAliases(modelsSection.aliases)
    },
    memory: {
      enabled: booleanValue(memory.enabled, DEFAULT_FABRIC_CONFIG.memory.enabled),
      ...memoryIndexDir ? { indexDir: memoryIndexDir } : {},
      maxSessions: boundedInteger(
        memory.maxSessions,
        DEFAULT_FABRIC_CONFIG.memory.maxSessions,
        1,
        1e5
      ),
      maxEntryChars: boundedInteger(
        memory.maxEntryChars,
        DEFAULT_FABRIC_CONFIG.memory.maxEntryChars,
        100,
        1e6
      ),
      indexThinking: booleanValue(
        memory.indexThinking,
        DEFAULT_FABRIC_CONFIG.memory.indexThinking ?? false
      ),
      indexToolOutput: booleanValue(
        memory.indexToolOutput,
        DEFAULT_FABRIC_CONFIG.memory.indexToolOutput ?? true
      ),
      hotSessions: boundedInteger(
        memory.hotSessions,
        DEFAULT_FABRIC_CONFIG.memory.hotSessions ?? 50,
        0,
        1e5
      ),
      digestTerms: boundedInteger(
        memory.digestTerms,
        DEFAULT_FABRIC_CONFIG.memory.digestTerms ?? 200,
        1,
        1e4
      ),
      maxColdVocabularyBytes: boundedInteger(
        memory.maxColdVocabularyBytes,
        DEFAULT_FABRIC_CONFIG.memory.maxColdVocabularyBytes ?? 512 * 1024,
        2,
        64 * 1024 * 1024
      ),
      maxColdCacheBytes: boundedInteger(
        memory.maxColdCacheBytes,
        DEFAULT_FABRIC_CONFIG.memory.maxColdCacheBytes ?? 1024 * 1024,
        512,
        128 * 1024 * 1024
      ),
      maxSyncSessions: boundedInteger(
        memory.maxSyncSessions,
        DEFAULT_FABRIC_CONFIG.memory.maxSyncSessions ?? 1e4,
        1,
        1e6
      ),
      maxSyncSourceBytes: boundedInteger(
        memory.maxSyncSourceBytes,
        DEFAULT_FABRIC_CONFIG.memory.maxSyncSourceBytes ?? 512 * 1024 * 1024,
        1024,
        8 * 1024 * 1024 * 1024
      ),
      maxCacheCleanupFiles: boundedInteger(
        memory.maxCacheCleanupFiles,
        DEFAULT_FABRIC_CONFIG.memory.maxCacheCleanupFiles ?? 1e5,
        1,
        1e6
      ),
      regexMaxPatternBytes: boundedInteger(
        memory.regexMaxPatternBytes,
        DEFAULT_FABRIC_CONFIG.memory.regexMaxPatternBytes ?? 1024,
        1,
        64 * 1024
      ),
      regexMaxHaystackTerms: boundedInteger(
        memory.regexMaxHaystackTerms,
        DEFAULT_FABRIC_CONFIG.memory.regexMaxHaystackTerms ?? 2e4,
        1,
        1e6
      ),
      regexMaxHaystackBytes: boundedInteger(
        memory.regexMaxHaystackBytes,
        DEFAULT_FABRIC_CONFIG.memory.regexMaxHaystackBytes ?? 2 * 1024 * 1024,
        1024,
        128 * 1024 * 1024
      ),
      regexTimeoutMs: boundedInteger(
        memory.regexTimeoutMs,
        DEFAULT_FABRIC_CONFIG.memory.regexTimeoutMs ?? 250,
        10,
        1e4
      )
    },
    repairs: {
      enabled: booleanValue(repairs.enabled, DEFAULT_FABRIC_CONFIG.repairs.enabled)
    },
    schema: {
      mode: schemaMode,
      certificateTtlMs: boundedInteger(
        schema.certificateTtlMs,
        DEFAULT_FABRIC_CONFIG.schema.certificateTtlMs,
        1e3,
        10 * 6e4
      ),
      maxFiles: boundedInteger(
        schema.maxFiles,
        DEFAULT_FABRIC_CONFIG.schema.maxFiles,
        1,
        1e3
      ),
      maxBytes: boundedInteger(
        schema.maxBytes,
        DEFAULT_FABRIC_CONFIG.schema.maxBytes,
        1024,
        100 * 1024 * 1024
      ),
      trustedCommands
    },
    speculation: {
      enabled: booleanValue(
        speculation.enabled,
        DEFAULT_FABRIC_CONFIG.speculation.enabled
      ),
      maxConcurrent: boundedInteger(
        speculation.maxConcurrent,
        DEFAULT_FABRIC_CONFIG.speculation.maxConcurrent,
        1,
        32
      ),
      maxEntries: boundedInteger(
        speculation.maxEntries,
        DEFAULT_FABRIC_CONFIG.speculation.maxEntries,
        1,
        1024
      ),
      maxBufferBytes: boundedInteger(
        speculation.maxBufferBytes,
        DEFAULT_FABRIC_CONFIG.speculation.maxBufferBytes,
        64 * 1024,
        64 * 1024 * 1024
      ),
      entryTtlMs: boundedInteger(
        speculation.entryTtlMs,
        DEFAULT_FABRIC_CONFIG.speculation.entryTtlMs,
        5e3,
        30 * 6e4
      ),
      mcpAllowlist: [
        ...new Set(
          (Array.isArray(speculation.mcpAllowlist) ? speculation.mcpAllowlist : []).filter(
            (entry) => typeof entry === "string" && entry.trim().length > 0
          ).map((entry) => entry.trim().slice(0, 256))
        )
      ].slice(0, 256)
    },
    codePreview: normalizeCodePreviewSettings(input.codePreview)
  };
};
var effectiveToolCaptureConfig = (config) => config.schema?.mode === "enforce" ? {
  ...config.capture,
  enabled: true,
  hideFromModel: true,
  keepVisible: ["fabric_exec"],
  risks: { ...config.capture.risks }
} : config.fullCodeMode ? {
  ...config.capture,
  keepVisible: config.capture.keepVisible.filter(
    (name) => !PI_CORE_TOOL_NAME_SET.has(name)
  ),
  risks: { ...config.capture.risks }
} : {
  ...config.capture,
  enabled: false,
  hideFromModel: false,
  keepVisible: [...config.capture.keepVisible],
  risks: { ...config.capture.risks }
};
var planConfigFile = (filePath) => {
  const input = readJsonObjectFile(filePath);
  if (!input) return void 0;
  const migration = migrateFabricConfigDocument(input.document);
  return {
    path: filePath,
    document: migration.document,
    source: input.source,
    changed: migration.changed
  };
};
var writeJsonAtomic = (filePath, document, expectedSource) => {
  const resolvedPath = fs.existsSync(filePath) ? fs.realpathSync(filePath) : filePath;
  const directory = path.dirname(resolvedPath);
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
  const mode = fs.existsSync(resolvedPath) ? fs.statSync(resolvedPath).mode & 511 : 384;
  const temporaryPath = path.join(
    directory,
    `.${path.basename(resolvedPath)}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`
  );
  let descriptor;
  try {
    descriptor = fs.openSync(temporaryPath, "wx", mode);
    fs.writeFileSync(descriptor, `${JSON.stringify(document, null, 2)}
`, "utf8");
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = void 0;
    if (expectedSource !== void 0) {
      let currentSource;
      try {
        currentSource = fs.readFileSync(resolvedPath, "utf8");
      } catch (error) {
        throw new Error(`Fabric configuration changed while updating ${filePath}`, { cause: error });
      }
      if (currentSource !== expectedSource) {
        throw new Error(`Fabric configuration changed while updating ${filePath}`);
      }
    }
    renameAtomic(temporaryPath, resolvedPath);
    try {
      const directoryDescriptor = fs.openSync(directory, "r");
      try {
        fs.fsyncSync(directoryDescriptor);
      } finally {
        fs.closeSync(directoryDescriptor);
      }
    } catch (error) {
      const code = error instanceof Error && "code" in error ? error.code : void 0;
      if (code !== "EINVAL" && code !== "ENOTSUP" && code !== "EISDIR" && code !== "EPERM") throw error;
    }
  } catch (error) {
    if (descriptor !== void 0) fs.closeSync(descriptor);
    fs.rmSync(temporaryPath, { force: true });
    throw error;
  }
};
var resolveFabricConfig = (options, includeProject) => {
  let merged = structuredClone(DEFAULT_FABRIC_CONFIG);
  const plans = [
    planConfigFile(path.join(options.agentDir, "fabric.json")),
    ...includeProject ? [planConfigFile(path.join(options.cwd, ".pi", "fabric.json"))] : []
  ].filter((plan) => plan !== void 0);
  for (const plan of plans) {
    if (plan.changed) writeJsonAtomic(plan.path, plan.document, plan.source);
    merged = mergeObjects2(merged, plan.document);
  }
  const inheritedFullCodeMode = process.env.PI_FABRIC_FULL_CODE_MODE;
  if (inheritedFullCodeMode === "true" || inheritedFullCodeMode === "false") {
    merged.fullCodeMode = inheritedFullCodeMode === "true";
  }
  return normalizeFabricConfig(merged);
};
var loadFabricConfigForScope = (options, scope) => {
  if (scope === "project" && !options.projectTrusted) {
    throw new Error("Cannot load project Fabric configuration for an untrusted project");
  }
  return resolveFabricConfig(options, scope === "project");
};
var loadFabricConfig = (options) => {
  const config = resolveFabricConfig(options, options.projectTrusted);
  if (config.compaction.engine === "fabric") {
    process.env.PI_FABRIC_COMPACTION_ENGINE = "fabric";
  } else {
    delete process.env.PI_FABRIC_COMPACTION_ENGINE;
  }
  return config;
};
var saveFabricConfig = (options, partial) => {
  const scope = options.scope ?? (options.projectTrusted ? "project" : "global");
  if (scope === "project" && !options.projectTrusted) {
    throw new Error("Cannot save project Fabric configuration for an untrusted project");
  }
  const targetPath = scope === "project" ? path.join(options.cwd, ".pi", "fabric.json") : path.join(options.agentDir, "fabric.json");
  if (Object.hasOwn(partial, "configVersion") || Object.hasOwn(partial, "subagents")) {
    throw new Error("Fabric configuration updates must use the current schema");
  }
  const input = readJsonObjectFile(targetPath);
  const existing = migrateFabricConfigDocument(input?.document ?? {}).document;
  const merged = mergeObjects2(existing, partial);
  merged.configVersion = Math.max(
    typeof merged.configVersion === "number" ? merged.configVersion : 0,
    CURRENT_FABRIC_CONFIG_VERSION
  );
  writeJsonAtomic(targetPath, merged, input?.source);
  return { scope, path: targetPath };
};

export {
  FUZZY_RESOLUTION_MARKERS,
  resolveFabricModel,
  MIN_COMPACTION_TOKEN_THRESHOLD,
  MAX_COMPACTION_TOKEN_THRESHOLD,
  MIN_COMPACTION_RATIO_THRESHOLD,
  MAX_COMPACTION_RATIO_THRESHOLD,
  clampCompactionTokenThreshold,
  clampCompactionRatioThreshold,
  MIN_AGENT_TIMEOUT_MS,
  MAX_AGENT_TIMEOUT_MS,
  QUICKJS_MAX_MEMORY_LIMIT_BYTES,
  maxExecutorMemoryLimitBytes,
  DEFAULT_FABRIC_CONFIG,
  effectiveToolCaptureConfig,
  loadFabricConfigForScope,
  loadFabricConfig,
  saveFabricConfig
};
//# sourceMappingURL=chunk-LXRYXUTG.js.map
