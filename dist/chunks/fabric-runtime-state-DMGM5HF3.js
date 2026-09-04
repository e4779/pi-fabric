import {
  classifyPiBashError,
  piBashResultError
} from "./chunk-ZEDVRYLH.js";
import {
  sanitizeMcpRefPart
} from "./chunk-2YLD7GNM.js";
import {
  MemoryProvider,
  actionArgNormalizer,
  uniqueDeclaredKeyForSpelling
} from "./chunk-76CXVOZC.js";
import "./chunk-HG7D6AOD.js";
import "./chunk-E2LYJAID.js";
import "./chunk-VWSJJK3M.js";
import "./chunk-4OXEXLH6.js";
import {
  ApprovalController,
  FABRIC_COMPONENT_PROVIDER_NAMES,
  FABRIC_PROVIDER_COMPONENT_PREFIX,
  FabricActivityStore,
  FabricAutoApprovalClassifier,
  FabricProviderComponentManifest,
  FabricSessionApprovals,
  MainAgentController,
  PrewalkController,
  PrewalkDriftTracker,
  claimFabricFsDriftHandoff,
  claimFabricHandoff,
  createProviderComponent,
  expandSkillDirMarkersForRead,
  repairFabricGuestCode,
  resolveFabricIdentity,
  runFabricHandoffAtBoundary
} from "./chunk-YFGTAQC5.js";
import {
  AgentTranscriptReader,
  MAX_WRITE_DIFF_BYTES,
  countContentLines,
  recentTranscriptTools,
  writeContentForPreview
} from "./chunk-MJNWCLRJ.js";
import {
  ActionRegistry,
  clearActiveRepairCompiler,
  repairActionName,
  setActiveRepairCompiler
} from "./chunk-6EM5SWVG.js";
import {
  formatFabricEffectConflict
} from "./chunk-PM3ESBLM.js";
import {
  runAbortable,
  throwIfAborted
} from "./chunk-JRJ77EGR.js";
import {
  resolveAgentDir
} from "./chunk-JGPLMHJR.js";
import {
  FABRIC_COMPONENT_DISCOVER_EVENT,
  FABRIC_PROVIDER_DISCOVER_EVENT,
  FABRIC_TOOL_RESULT_PROXY_KIND,
  readFabricToolResultProxyDetailsV1
} from "./chunk-CTG37A6U.js";
import {
  ActorManager,
  AgentManager,
  FABRIC_LIFECYCLE_EVENTS,
  FABRIC_PARTICIPANT_LIFECYCLE_TOPIC,
  FabricControlPlane,
  LifecycleBroker,
  MeshStore,
  ParticipantDirectory,
  actorDeliveryNotice,
  actorParticipantRecord,
  addCloneFirstWorktree,
  agentParticipantRecords,
  effectiveAgentTimeoutMs,
  isFabricLifecycleEventType,
  isFabricWorktreePath,
  lifecycleSourceIdentity,
  resolveActorDeliveryPolicy,
  resolveAgentCwd,
  resolvePiBinary,
  validateAgentCwdRequest
} from "./chunk-LHW2QGKS.js";
import "./chunk-EKJ4KUXF.js";
import "./chunk-KKL6O7KG.js";
import {
  executeFile,
  processIsAlive,
  spawnDetached
} from "./chunk-OANJNIWI.js";
import {
  checkedHandoffCompaction
} from "./chunk-3QCDEK4M.js";
import {
  FABRIC_ACTOR_HOST_EVENTS,
  isFabricActorHostEvent,
  readJsonlPage
} from "./chunk-QOOWAB5D.js";
import {
  DEFAULT_FABRIC_CONFIG,
  FUZZY_RESOLUTION_MARKERS,
  MAX_AGENT_TIMEOUT_MS,
  MIN_AGENT_TIMEOUT_MS,
  loadFabricConfig,
  resolveFabricModel
} from "./chunk-LXRYXUTG.js";
import {
  isFabricThinking
} from "./chunk-XCYTQGH2.js";
import {
  PI_CORE_TOOL_NAMES
} from "./chunk-XHM55LMF.js";
import {
  MAX_FABRIC_MODEL_GUIDANCE_PER_COMPONENT,
  MAX_FABRIC_MODEL_GUIDANCE_REGISTRATIONS,
  MAX_FABRIC_MODEL_GUIDANCE_SNAPSHOT_CHARS,
  MAX_FABRIC_MODEL_GUIDANCE_TOTAL_CHARS,
  compareFabricOwnedModelGuidance,
  fabricModelGuidanceInfo,
  normalizeFabricModelGuidance,
  resolveFabricModelGuidance
} from "./chunk-BH2VUB62.js";
import {
  stableJsonHash
} from "./chunk-2DGB2R4E.js";
import {
  ResidentActorClient
} from "./chunk-HDBZ4IXL.js";
import {
  RESIDENT_HOST_FORMAT,
  residentDeliveryPrefix,
  residentHostId,
  residentRoot
} from "./chunk-2JELHSX5.js";
import {
  writeJsonAtomic
} from "./chunk-LU4SNIHE.js";
import {
  MAX_COMPACTION_INSTRUCTIONS_CHARS,
  MAX_PRESERVE_ITEMS,
  MAX_PRESERVE_ITEM_CHARS,
  compactionRequestBoundsError,
  encodeCompactionRequest,
  fabricExecTitleHintCached
} from "./chunk-7B4MWJK4.js";
import "./chunk-4IZKKHJM.js";
import "./chunk-Y2TSC4OL.js";
import {
  FabricExecutionTraceRecorder,
  FabricTraceSafeError,
  executionOutcomeFromError
} from "./chunk-AZOIDGCU.js";

// src/fabric-runtime-state.ts
import path16 from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";

// src/actors/global-registry.ts
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
var ACTOR_NAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9 _.-]{0,59}$/;
var TOPIC_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,127}$/;
var HOST_EVENTS = new Set(FABRIC_ACTOR_HOST_EVENTS);
var RESPONSE_MODES = /* @__PURE__ */ new Set(["text", "directive"]);
var normalizeRequirements = (value) => {
  if (value === void 0) return void 0;
  if (!Array.isArray(value) || value.length > 128) {
    throw new Error("Invalid global actor capability requirements");
  }
  const normalized = /* @__PURE__ */ new Map();
  for (const item of value) {
    const ref = typeof item === "string" ? item.trim() : typeof item === "object" && item !== null && !Array.isArray(item) && typeof item.ref === "string" ? item.ref.trim() : "";
    if (ref.length > 256 || !ref.includes(".") || ref.startsWith(".") || ref.endsWith(".")) {
      throw new Error("Invalid global actor capability requirement");
    }
    const optional = typeof item === "object" && item !== null && item.optional === true;
    normalized.set(ref, (normalized.get(ref) ?? true) && optional);
  }
  return [...normalized].sort(([left], [right]) => left.localeCompare(right)).map(([ref, optional]) => ({ ref, ...optional ? { optional: true } : {} }));
};
var TRANSPORTS = /* @__PURE__ */ new Set([
  "auto",
  "process",
  "tmux",
  "screen",
  "localterm",
  "herdr"
]);
var atomicWrite = (filePath, value) => {
  writeJsonAtomic(filePath, value, { space: 2 });
};
var clone = (value) => structuredClone(value);
var resolveDefinition = (actors, idOrName) => {
  const exact = actors.get(idOrName);
  if (exact) return exact;
  const matches = [...actors.values()].filter(
    (actor) => actor.id.startsWith(idOrName) || actor.name === idOrName
  );
  if (matches.length === 1 && matches[0]) return matches[0];
  if (matches.length > 1) throw new Error(`Ambiguous global actor: ${idOrName}`);
  return void 0;
};
var GlobalActorRegistry = class {
  #actors = /* @__PURE__ */ new Map();
  #path;
  #maxBytes;
  constructor(agentDir, maxInstructionsBytes) {
    this.#path = path.join(agentDir, "fabric", "actors", "global-actors.json");
    this.#maxBytes = maxInstructionsBytes;
    this.#load();
  }
  list() {
    return [...this.#actors.values()].map(clone);
  }
  resolve(idOrName) {
    const found = resolveDefinition(this.#actors, idOrName);
    return found ? clone(found) : void 0;
  }
  /**
   * Save a definition to the global registry. If a template with the same name
   * already exists, throws unless `overwrite` is true (in which case the
   * existing template is updated in place, keeping its id). Returns the stored
   * definition.
   */
  create(def, overwrite = false) {
    const validated = this.#validate(def);
    const existing = [...this.#actors.values()].find((actor) => actor.name === validated.name);
    if (existing) {
      if (!overwrite) {
        throw new Error(`A global actor named ${validated.name} already exists (${existing.id})`);
      }
      const updated = {
        ...existing,
        ...validated,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: Date.now()
      };
      this.#actors.set(existing.id, updated);
      this.#save();
      return clone(updated);
    }
    const created = {
      ...validated,
      id: randomUUID().replaceAll("-", ""),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.#actors.set(created.id, created);
    this.#save();
    return clone(created);
  }
  /**
   * Apply a partial patch to a stored template (e.g. new instructions). Only
   * the supplied fields are replaced; the rest are preserved. Re-validates any
   * changed field.
   */
  update(idOrName, patch) {
    const existing = resolveDefinition(this.#actors, idOrName);
    if (!existing) throw new Error(`Unknown global actor: ${idOrName}`);
    const merged = {
      name: patch.name ?? existing.name,
      instructions: patch.instructions ?? existing.instructions,
      events: patch.events ?? existing.events,
      topics: patch.topics ?? existing.topics,
      delivery: patch.delivery ?? existing.delivery,
      responseMode: patch.responseMode ?? existing.responseMode,
      triggerTurn: patch.triggerTurn ?? existing.triggerTurn,
      coalesce: patch.coalesce ?? existing.coalesce,
      ...patch.residency !== void 0 ? { residency: patch.residency } : existing.residency ? { residency: existing.residency } : {},
      runner: patch.runner ?? existing.runner,
      ...patch.model !== void 0 ? { model: patch.model } : existing.model ? { model: existing.model } : {},
      ...patch.thinking !== void 0 ? { thinking: patch.thinking } : existing.thinking ? { thinking: existing.thinking } : {},
      ...patch.tools !== void 0 ? { tools: patch.tools } : existing.tools ? { tools: existing.tools } : {},
      ...patch.transport !== void 0 ? { transport: patch.transport } : existing.transport ? { transport: existing.transport } : {},
      ...patch.timeoutMs !== void 0 ? { timeoutMs: patch.timeoutMs } : existing.timeoutMs ? { timeoutMs: existing.timeoutMs } : {},
      ...patch.extensions !== void 0 ? { extensions: patch.extensions } : typeof existing.extensions === "boolean" ? { extensions: existing.extensions } : {},
      ...patch.validWhile !== void 0 ? { validWhile: patch.validWhile } : existing.validWhile ? { validWhile: existing.validWhile } : {}
    };
    const validated = this.#validate(merged);
    if (validated.name !== existing.name) {
      const clash = [...this.#actors.values()].find(
        (actor) => actor.id !== existing.id && actor.name === validated.name
      );
      if (clash) {
        throw new Error(`A global actor named ${validated.name} already exists (${clash.id})`);
      }
    }
    const updated = {
      ...validated,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: Date.now()
    };
    this.#actors.set(existing.id, updated);
    this.#save();
    return clone(updated);
  }
  remove(idOrName) {
    const existing = resolveDefinition(this.#actors, idOrName);
    if (!existing) return { removed: false };
    this.#actors.delete(existing.id);
    this.#save();
    return { removed: true };
  }
  /**
   * Strip identity/timestamps from a stored template to produce the request
   * shape ActorManager.create expects. Optionally rename the imported actor so
   * a template can be stamped into a project under a different name (e.g. to
   * avoid a collision with a live actor).
   */
  toRequest(def, as) {
    const name = as?.trim() || def.name;
    const request = {
      name,
      instructions: def.instructions,
      events: [...def.events],
      topics: [...def.topics],
      delivery: def.delivery,
      responseMode: def.responseMode,
      triggerTurn: def.triggerTurn,
      coalesce: def.coalesce,
      ...def.residency ? { residency: def.residency } : {},
      runner: def.runner,
      ...def.model ? { model: def.model } : {},
      ...def.thinking ? { thinking: def.thinking } : {},
      ...def.tools ? { tools: [...def.tools] } : {},
      ...def.transport ? { transport: def.transport } : {},
      ...def.timeoutMs ? { timeoutMs: def.timeoutMs } : {},
      ...typeof def.extensions === "boolean" ? { extensions: def.extensions } : {},
      ...def.validWhile ? { validWhile: clone(def.validWhile) } : {}
    };
    return request;
  }
  #validate(def) {
    const name = def.name.trim();
    if (!ACTOR_NAME_PATTERN.test(name)) throw new Error(`Invalid global actor name: ${def.name}`);
    const instructions = def.instructions;
    if (!instructions.trim()) throw new Error("Global actor instructions must not be empty");
    if (Buffer.byteLength(instructions, "utf8") > this.#maxBytes) {
      throw new Error(`Global actor instructions exceed ${this.#maxBytes} bytes`);
    }
    const events = [...new Set(def.events ?? [])];
    for (const event of events) {
      if (!HOST_EVENTS.has(event)) throw new Error(`Unsupported global actor event: ${event}`);
    }
    const topics = [...new Set(def.topics ?? [])];
    for (const topic of topics) {
      if (!TOPIC_PATTERN.test(topic)) throw new Error(`Invalid global actor topic: ${topic}`);
    }
    const deliveryPolicy = resolveActorDeliveryPolicy(def.delivery, def.triggerTurn);
    const responseMode = def.responseMode ?? "text";
    if (!RESPONSE_MODES.has(responseMode)) {
      throw new Error(`Invalid global actor response mode: ${def.responseMode}`);
    }
    const coalesce = def.coalesce ?? true;
    const residency = def.residency ?? "session";
    if (residency !== "session" && residency !== "durable") {
      throw new Error(`Invalid global actor residency: ${String(def.residency)}`);
    }
    const runner = def.runner ?? "pi";
    if (runner !== "pi" && runner !== "claude") {
      throw new Error(`Invalid global actor runner: ${String(def.runner)}`);
    }
    const model = typeof def.model === "string" && def.model.trim() ? def.model.trim() : void 0;
    const thinking = def.thinking !== void 0 && isFabricThinking(def.thinking) ? def.thinking : void 0;
    const tools = Array.isArray(def.tools) ? [...new Set(def.tools.filter((tool) => typeof tool === "string"))] : void 0;
    const transport = def.transport !== void 0 && TRANSPORTS.has(def.transport) ? def.transport : void 0;
    const timeoutMs = typeof def.timeoutMs === "number" ? def.timeoutMs : void 0;
    const extensions = typeof def.extensions === "boolean" ? def.extensions : void 0;
    const requires = normalizeRequirements(def.requires);
    const validWhile = def.validWhile?.version === 1 && typeof def.validWhile.source === "string" && def.validWhile.source.trim() && def.validWhile.source.length <= 16e3 ? clone(def.validWhile) : void 0;
    if (def.validWhile && !validWhile) throw new Error("Invalid global actor validWhile predicate");
    return {
      name,
      instructions,
      events,
      topics,
      delivery: deliveryPolicy.delivery,
      responseMode,
      triggerTurn: deliveryPolicy.triggerTurn,
      coalesce,
      residency,
      runner,
      ...model ? { model } : {},
      ...thinking ? { thinking } : {},
      ...tools ? { tools } : {},
      ...transport ? { transport } : {},
      ...timeoutMs ? { timeoutMs } : {},
      ...extensions !== void 0 ? { extensions } : {},
      ...requires && requires.length > 0 ? { requires } : {},
      ...validWhile ? { validWhile } : {}
    };
  }
  #load() {
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(this.#path, "utf8"));
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") return;
      return;
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return;
    const records = parsed.actors;
    if (!Array.isArray(records)) return;
    for (const value of records) {
      if (typeof value !== "object" || value === null || Array.isArray(value)) continue;
      const record = value;
      if (typeof record.id !== "string" || !/^[a-f0-9]{32}$/.test(record.id) || typeof record.name !== "string" || !ACTOR_NAME_PATTERN.test(record.name) || typeof record.instructions !== "string" || Buffer.byteLength(record.instructions, "utf8") > this.#maxBytes || typeof record.createdAt !== "number") {
        continue;
      }
      const events = Array.isArray(record.events) ? record.events.filter((event) => HOST_EVENTS.has(event)) : [];
      const topics = Array.isArray(record.topics) ? record.topics.filter(
        (topic) => typeof topic === "string" && TOPIC_PATTERN.test(topic)
      ) : [];
      const delivery = record.delivery === "steer" || record.delivery === "followUp" || record.delivery === "nextTurn" ? record.delivery : "mailbox";
      const responseMode = record.responseMode === "directive" ? "directive" : "text";
      const triggerTurn = (delivery === "steer" || delivery === "followUp") && record.triggerTurn === true;
      const coalesce = record.coalesce !== false;
      const residency = record.residency === "durable" ? "durable" : "session";
      const runner = record.runner === "claude" ? "claude" : "pi";
      const thinking = isFabricThinking(record.thinking) ? record.thinking : void 0;
      const tools = Array.isArray(record.tools) ? record.tools.filter((tool) => typeof tool === "string") : void 0;
      const transport = record.transport !== void 0 && TRANSPORTS.has(record.transport) ? record.transport : void 0;
      const timeoutMs = typeof record.timeoutMs === "number" ? record.timeoutMs : void 0;
      const extensions = typeof record.extensions === "boolean" ? record.extensions : void 0;
      let requires;
      try {
        requires = normalizeRequirements(record.requires);
      } catch {
        continue;
      }
      const validWhile = record.validWhile?.version === 1 && typeof record.validWhile.source === "string" && record.validWhile.source.length <= 16e3 ? clone(record.validWhile) : void 0;
      const def = {
        id: record.id,
        name: record.name,
        instructions: record.instructions,
        events,
        topics,
        delivery,
        responseMode,
        triggerTurn,
        coalesce,
        residency,
        runner,
        createdAt: record.createdAt,
        updatedAt: typeof record.updatedAt === "number" ? record.updatedAt : record.createdAt,
        ...typeof record.model === "string" && record.model ? { model: record.model } : {},
        ...thinking ? { thinking } : {},
        ...tools ? { tools } : {},
        ...transport ? { transport } : {},
        ...timeoutMs ? { timeoutMs } : {},
        ...extensions !== void 0 ? { extensions } : {},
        ...requires && requires.length > 0 ? { requires } : {},
        ...validWhile ? { validWhile } : {}
      };
      this.#actors.set(def.id, def);
    }
  }
  #save() {
    const file = { format: 1, actors: [...this.#actors.values()] };
    atomicWrite(this.#path, file);
  }
};

// src/actors/context.ts
var FILE_EXT = "ts|tsx|js|jsx|mjs|cjs|json|md|markdown|css|scss|html|vue|svelte|py|rs|go|java|kt|swift|rb|php|sh|bash|yaml|yml|toml|sql|env|lock";
var PATH_RE = new RegExp("([\"'`])([\\w@./-]+\\.(?:" + FILE_EXT + "))\\1", "g");
var clip = (value, max) => {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max - 1) + "\u2026" : text;
};
var firstLine = (value) => {
  const i = value.indexOf("\n");
  return i === -1 ? value : value.slice(0, i);
};
var textOf = (content) => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map(
      (part) => part && typeof part === "object" && part.type === "text" ? String(part.text ?? "") : ""
    ).join("");
  }
  return "";
};
var isMessage = (value) => typeof value === "object" && value !== null && "role" in value;
var extractMessages = (branch) => {
  const messages = [];
  let foundWrapped = false;
  for (const entry of branch) {
    if (entry && typeof entry === "object" && entry.type === "message") {
      const message2 = entry.message;
      if (isMessage(message2)) {
        messages.push(message2);
        foundWrapped = true;
      }
    }
  }
  if (foundWrapped) return messages;
  for (const entry of branch) if (isMessage(entry)) messages.push(entry);
  return messages;
};
var argHint = (args) => {
  if (!args || typeof args !== "object") return "";
  const a = args;
  const v = a.file ?? a.path ?? a.pattern ?? a.command ?? a.cmd ?? a.code;
  return typeof v === "string" && v ? clip(v, 80) : "";
};
var scanFiles = (messages, cap) => {
  const seen = /* @__PURE__ */ new Set();
  for (const m of messages) {
    let hay = typeof m.content === "string" ? m.content : "";
    if (Array.isArray(m.content)) {
      for (const part of m.content) {
        if (!part || typeof part !== "object") continue;
        const block = part;
        if (block.type === "text") hay += " " + (block.text ?? "");
        else if (block.type === "toolCall") hay += " " + JSON.stringify(block.arguments ?? {});
      }
    }
    hay += " " + (m.command ?? "") + " " + (m.output ?? "");
    PATH_RE.lastIndex = 0;
    let match;
    while ((match = PATH_RE.exec(hay)) !== null) {
      if (match[2]) seen.add(match[2]);
      if (seen.size >= cap * 3) break;
    }
  }
  return [...seen].sort().slice(0, cap);
};
var buildDigest = (messages) => {
  let openErrors = 0;
  let lastError = "";
  let lastUserRequest = "";
  for (const m of messages) {
    if (m.role === "user") {
      const t = textOf(m.content).trim();
      if (t) lastUserRequest = clip(t, 300);
    } else if (m.role === "toolResult" && m.isError) {
      openErrors++;
      lastError = clip(firstLine(textOf(m.content)), 200);
    } else if (m.role === "bashExecution" && typeof m.exitCode === "number" && m.exitCode !== 0) {
      openErrors++;
      lastError = clip(firstLine(m.output ?? m.command ?? ""), 200);
    }
  }
  return { filesTouched: scanFiles(messages, 30), openErrors, lastError, lastUserRequest };
};
var compactBlocks = (msg) => {
  const lines = [];
  if (msg.role === "user") {
    const t = textOf(msg.content).trim();
    if (t) lines.push(`user: ${clip(t, 200)}`);
  } else if (msg.role === "assistant") {
    if (Array.isArray(msg.content)) {
      for (const part of msg.content) {
        if (!part || typeof part !== "object") continue;
        const block = part;
        if (block.type === "text") {
          const t = (block.text ?? "").trim();
          if (t) lines.push(`asst: ${clip(t, 200)}`);
        } else if (block.type === "toolCall") {
          lines.push(`call: ${block.name ?? "?"} ${argHint(block.arguments)}`);
        }
      }
    } else if (typeof msg.content === "string") {
      const t = msg.content.trim();
      if (t) lines.push(`asst: ${clip(t, 200)}`);
    }
  } else if (msg.role === "toolResult") {
    const t = textOf(msg.content).trim();
    lines.push(`result ${msg.toolName ?? ""}: ${clip(firstLine(t), 150)}${msg.isError ? " [ERR]" : ""}`);
  } else if (msg.role === "bashExecution") {
    lines.push(`bash: ${clip(msg.command ?? "", 120)} -> ${msg.exitCode ?? "?"}`);
  }
  return lines;
};
var boundLines = (lines, maxChars) => {
  let total = lines.join("\n").length;
  const out = [...lines];
  while (total > maxChars && out.length > 1) {
    out.shift();
    total = out.join("\n").length;
  }
  return out;
};
var buildActorContext = (branch, tailCount, maxChars) => {
  const messages = extractMessages(branch);
  const digest3 = buildDigest(messages);
  const lines = [];
  for (const m of messages.slice(-tailCount)) {
    for (const line of compactBlocks(m)) lines.push(line);
  }
  return { digest: digest3, transcript: boundLines(lines, maxChars) };
};

// src/actors/host-event-payload.ts
import { createHash } from "node:crypto";
var normalizedKey = (key) => key.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
var isSensitiveKey = (key) => {
  const normalized = normalizedKey(key);
  return [
    "password",
    "passwd",
    "secret",
    "token",
    "accesstoken",
    "refreshtoken",
    "authorization",
    "cookie",
    "credential",
    "credentials",
    "apikey",
    "privatekey",
    "clientsecret"
  ].some((sensitive) => normalized === sensitive || normalized.endsWith(sensitive));
};
var redactInlineSecrets = (value) => value.replace(/\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi, "Bearer [redacted]").replace(/\bBasic\s+[A-Za-z0-9+/=]{8,}/gi, "Basic [redacted]").replace(/\b(?:sk|pk|ghp|github_pat|xox[baprs])[-_][A-Za-z0-9_-]{12,}\b/g, "[redacted]").replace(
  /\b(Authorization|Proxy-Authorization|Cookie|Set-Cookie|X-Api-Key)\s*:\s*[^\r\n;]+/gi,
  "$1: [redacted]"
).replace(/(https?:\/\/)[^\s/:@]+:[^\s/@]+@/gi, "$1[redacted]@");
var looksLikeBase64 = (value) => {
  if (value.startsWith("data:") && value.includes(";base64,")) return true;
  if (value.length < 1024 || value.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/=_\r\n-]+$/.test(value);
};
var isImageContent = (value) => typeof value === "object" && value !== null && !Array.isArray(value) && value.type === "image" && typeof value.data === "string" && typeof value.mimeType === "string";
var prepareFabricActorHostPayload = (value, maxChars) => {
  const images = [];
  const media = [];
  const imageIndexes = /* @__PURE__ */ new Map();
  const seen = /* @__PURE__ */ new WeakSet();
  let json;
  try {
    const serialized = JSON.stringify(value, (key, nested) => {
      if (key && isSensitiveKey(key)) return "[redacted]";
      if (isImageContent(nested)) {
        const sha256 = createHash("sha256").update(nested.mimeType).update("\0").update(nested.data).digest("hex");
        let mediaIndex = imageIndexes.get(sha256);
        if (mediaIndex === void 0) {
          mediaIndex = images.length;
          imageIndexes.set(sha256, mediaIndex);
          images.push({ type: "image", data: nested.data, mimeType: nested.mimeType });
          media.push({ type: "image", mediaIndex, mimeType: nested.mimeType });
        }
        return {
          type: "image",
          mediaIndex,
          mimeType: nested.mimeType,
          redacted: true
        };
      }
      if (typeof nested === "object" && nested !== null && !Array.isArray(nested) && nested.type === "image") {
        return {
          type: "image",
          ...typeof nested.mimeType === "string" ? { mimeType: nested.mimeType } : {},
          redacted: true
        };
      }
      if (typeof nested === "string") {
        if (looksLikeBase64(nested)) return "[omitted base64]";
        return redactInlineSecrets(nested);
      }
      if (typeof nested === "bigint") return String(nested);
      if (typeof nested === "function" || typeof nested === "symbol") return void 0;
      if (typeof nested === "object" && nested !== null) {
        if (seen.has(nested)) return "[circular or repeated reference]";
        seen.add(nested);
      }
      return nested;
    });
    json = serialized ?? "null";
  } catch {
    json = JSON.stringify(String(value));
  }
  if (json.length > maxChars) json = json.slice(json.length - maxChars);
  let payload;
  try {
    payload = JSON.parse(json);
  } catch {
    payload = json;
  }
  return { payload, images, media };
};

// src/components/catalog.ts
var NAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;
var FabricComponentCatalog = class {
  #definitions = /* @__PURE__ */ new Map();
  #listeners = /* @__PURE__ */ new Set();
  discovery = {
    version: 1,
    register: (component, options) => this.register(component, options)
  };
  register(definition, options = {}) {
    if (!NAME_PATTERN.test(definition.name)) {
      throw new Error(`Invalid Fabric component name: ${definition.name}`);
    }
    if (typeof definition.activate !== "function") {
      throw new Error(`Fabric component ${definition.name} must define activate()`);
    }
    const previous = this.#definitions.get(definition.name);
    if (previous && !options.overwrite) {
      throw new Error(`Fabric component already registered: ${definition.name}`);
    }
    const current = {
      definition,
      revision: (previous?.revision ?? 0) + 1
    };
    this.#definitions.set(definition.name, current);
    this.#emit({ name: definition.name, current, ...previous ? { previous } : {} });
  }
  unregister(name) {
    const previous = this.#definitions.get(name);
    if (!previous) return void 0;
    this.#definitions.delete(name);
    this.#emit({ name, previous });
    return previous.definition;
  }
  get(name) {
    return this.#definitions.get(name);
  }
  list() {
    return [...this.#definitions.entries()].map(([name, entry]) => ({ name, ...entry })).sort((left, right) => left.name.localeCompare(right.name));
  }
  clear() {
    for (const name of [...this.#definitions.keys()]) this.unregister(name);
  }
  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
  #emit(event) {
    for (const listener of [...this.#listeners]) {
      try {
        listener(event);
      } catch {
      }
    }
  }
};

// src/components/effect-scope.ts
var FabricEffectDivertedError = class extends Error {
  cleanupError;
  constructor(message2 = "Fabric effect target changed at an iteration boundary", cleanupError) {
    super(message2);
    this.name = "FabricEffectDivertedError";
    this.cleanupError = cleanupError;
  }
};
var errorMessage = (error) => error instanceof Error ? error.message : String(error);
var isPromiseLike = (value) => typeof value === "object" && value !== null && "then" in value && typeof value.then === "function";
var isIterable = (value) => typeof value === "object" && value !== null && Symbol.iterator in value && typeof value[Symbol.iterator] === "function";
var isAsyncIterable = (value) => typeof value === "object" && value !== null && Symbol.asyncIterator in value && typeof value[Symbol.asyncIterator] === "function";
var collectDisposer = (value, disposers) => {
  if (value === void 0 || value === null) return;
  if (typeof value !== "function") throw new TypeError("Fabric effect yielded an invalid disposer");
  disposers.push(value);
};
var normalizeRegistration = (registration, fallbackLabel) => {
  if (typeof registration === "string") return { label: registration };
  if (!registration) return { label: fallbackLabel };
  const resources = [...new Set((registration.resources ?? []).filter((resource) => typeof resource === "string" && resource.length > 0).map((resource) => resource.slice(0, 256)))].slice(0, 64);
  const label = registration.label?.trim().slice(0, 256) || fallbackLabel;
  return {
    label,
    effect: {
      label,
      kind: registration.kind ?? "transactional",
      resources: resources.length > 0 ? resources : ["*"],
      ordering: registration.ordering ?? "unknown"
    }
  };
};
var beginCleanup = (record) => {
  if (record.cleanupStarted) return;
  record.cleanupStarted = true;
  record.beforeCleanup?.();
};
var closeIterator = async (iterator, disposers) => {
  if (!iterator.return) return;
  let step = await iterator.return();
  while (!step.done) {
    collectDisposer(step.value, disposers);
    step = await iterator.next();
  }
};
var checkTarget = async (guard) => {
  if (guard && !await guard()) throw new FabricEffectDivertedError();
};
var driveIterator = async (iterator, record, guard) => {
  try {
    for (; ; ) {
      if (!record.armed) {
        beginCleanup(record);
        await closeIterator(iterator, record.disposers);
        return;
      }
      await checkTarget(guard);
      const step = await iterator.next();
      if (!step.done) collectDisposer(step.value, record.disposers);
      if (!record.armed) {
        beginCleanup(record);
        await closeIterator(iterator, record.disposers);
        return;
      }
      if (step.done) {
        await checkTarget(guard);
        return;
      }
    }
  } catch (error) {
    if (error instanceof FabricEffectDivertedError) {
      try {
        beginCleanup(record);
        await closeIterator(iterator, record.disposers);
      } catch (closeError) {
        throw new FabricEffectDivertedError(
          "Fabric effect target changed and iterator close failed",
          closeError
        );
      }
    }
    throw error;
  }
};
var collectEffect = async (effect, record, guard) => {
  const resolved = isPromiseLike(effect) ? await effect : effect;
  if (resolved === void 0 || resolved === null || typeof resolved === "function") {
    collectDisposer(resolved, record.disposers);
    if (record.armed) await checkTarget(guard);
    return;
  }
  if (isAsyncIterable(resolved)) {
    await driveIterator(resolved[Symbol.asyncIterator](), record, guard);
    return;
  }
  if (isIterable(resolved)) {
    await driveIterator(resolved[Symbol.iterator](), record, guard);
    return;
  }
  throw new TypeError("Fabric effect returned an unsupported value");
};
var FabricEffectScope = class {
  #records = [];
  #setupCleanupFailures = [];
  #guard;
  #state = "open";
  #cleanup;
  constructor(options = {}) {
    this.#guard = options.guard;
  }
  get state() {
    return this.#state;
  }
  footprint(limit = Number.POSITIVE_INFINITY) {
    const effects = [];
    for (const record of this.#records) {
      if (effects.length >= limit) break;
      if (!record.disposed && record.effect) {
        effects.push({ ...record.effect, resources: [...record.effect.resources] });
      }
    }
    return effects;
  }
  async effect(setup, registration = "anonymous", hooks = {}) {
    if (this.#state !== "open") {
      throw new Error("Cannot create an effect on a disposing Fabric scope");
    }
    const normalized = normalizeRegistration(registration, "anonymous");
    const record = {
      label: normalized.label,
      ...normalized.effect ? { effect: normalized.effect } : {},
      disposers: [],
      setup: Promise.resolve(),
      dispose: async () => {
      },
      disposed: false,
      armed: true,
      cleanupStarted: false,
      ...hooks.beforeCleanup ? { beforeCleanup: hooks.beforeCleanup } : {}
    };
    const cleanupDisposers = async () => {
      beginCleanup(record);
      const failures = [];
      for (const disposer of record.disposers.splice(0).reverse()) {
        try {
          await disposer();
        } catch (error) {
          failures.push(error);
        }
      }
      if (failures.length > 0) {
        throw new AggregateError(failures, `Fabric effect cleanup failed: ${record.label}`);
      }
    };
    let disposal;
    record.dispose = async () => {
      if (record.disposed) return disposal;
      record.disposed = true;
      record.armed = false;
      disposal = (async () => {
        await record.setup.catch(() => void 0);
        await cleanupDisposers();
      })();
      return disposal;
    };
    this.#records.push(record);
    record.setup = (async () => {
      try {
        if (this.#guard) await checkTarget(this.#guard);
        if (!record.armed) return;
        await collectEffect(setup(), record, this.#guard);
      } catch (error) {
        try {
          await cleanupDisposers();
        } catch (cleanupError) {
          const failures = cleanupError instanceof AggregateError ? cleanupError.errors : [cleanupError];
          for (const failure of failures) {
            this.#setupCleanupFailures.push({ label: record.label, error: errorMessage(failure) });
          }
          throw new AggregateError(
            [error, cleanupError],
            `Fabric effect setup and rollback failed: ${record.label}`
          );
        }
        throw error;
      }
    })();
    try {
      await record.setup;
      if (this.#state === "open") {
        const index = this.#records.indexOf(record);
        if (index >= 0 && index !== this.#records.length - 1) {
          this.#records.splice(index, 1);
          this.#records.push(record);
        }
      }
    } catch (error) {
      const index = this.#records.indexOf(record);
      if (index >= 0) this.#records.splice(index, 1);
      throw error;
    }
    return record.dispose;
  }
  defer(disposer, registration = "deferred") {
    if (this.#state !== "open") {
      throw new Error("Cannot defer cleanup on a disposing Fabric scope");
    }
    const normalized = normalizeRegistration(registration, "deferred");
    const record = {
      label: normalized.label,
      ...normalized.effect ? { effect: normalized.effect } : {},
      disposers: [disposer],
      setup: Promise.resolve(),
      dispose: async () => {
      },
      disposed: false,
      armed: true,
      cleanupStarted: false
    };
    let disposal;
    record.dispose = async () => {
      if (record.disposed) return disposal;
      record.disposed = true;
      record.armed = false;
      disposal = (async () => {
        const failures = [];
        for (const cleanup of record.disposers.splice(0).reverse()) {
          try {
            await cleanup();
          } catch (error) {
            failures.push(error);
          }
        }
        if (failures.length > 0) {
          throw new AggregateError(failures, `Fabric effect cleanup failed: ${record.label}`);
        }
      })();
      return disposal;
    };
    this.#records.push(record);
    return record.dispose;
  }
  dispose() {
    if (this.#cleanup) return this.#cleanup;
    this.#state = "disposing";
    this.#cleanup = (async () => {
      const failures = this.#setupCleanupFailures.splice(0);
      for (const record of this.#records.splice(0).reverse()) {
        try {
          await record.dispose();
        } catch (error) {
          if (error instanceof AggregateError) {
            for (const nested of error.errors) {
              failures.push({ label: record.label, error: errorMessage(nested) });
            }
          } else {
            failures.push({ label: record.label, error: errorMessage(error) });
          }
        }
      }
      this.#state = "disposed";
      return {
        status: failures.length > 0 ? "quarantined" : "disposed",
        failures
      };
    })();
    return this.#cleanup;
  }
};

// src/components/supervisor.ts
var COMPONENT_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;
var PROVIDER_NAME_PATTERN = /^[a-z][a-z0-9_-]*$/;
var MAX_COMPONENT_EFFECTS = 256;
var MAX_SUPERVISED_COMPONENTS = 1024;
var MAX_CHILDREN_PER_COMPONENT = 256;
var componentLifecycleStorage;
var componentLifecycleStorageTask;
var lifecycleStorage = () => {
  componentLifecycleStorageTask ??= import("node:async_hooks").then(({ AsyncLocalStorage }) => {
    componentLifecycleStorage ??= new AsyncLocalStorage();
    return componentLifecycleStorage;
  });
  return componentLifecycleStorageTask;
};
var errorMessage2 = (error) => error instanceof Error ? error.message : String(error);
var normalizeRequirements2 = (definition) => {
  const normalized = /* @__PURE__ */ new Map();
  for (const requirement of definition.requires ?? []) {
    const ref = (typeof requirement === "string" ? requirement : requirement.ref).trim();
    if (!ref || ref.length > 256 || !ref.includes(".")) {
      throw new Error(
        `Fabric component ${definition.name} requirement must use provider.action: ${ref || "<empty>"}`
      );
    }
    const optional = typeof requirement === "string" ? false : requirement.optional === true;
    normalized.set(ref, (normalized.get(ref) ?? true) && optional);
  }
  return [...normalized].sort(([left], [right]) => left.localeCompare(right)).map(([ref, optional]) => ({ ref, ...optional ? { optional: true } : {} }));
};
var normalizeProvisions = (definition) => {
  const names = (definition.provides ?? []).map(
    (provision) => (typeof provision === "string" ? provision : provision.provider).trim()
  );
  for (const name of names) {
    if (!PROVIDER_NAME_PATTERN.test(name)) {
      throw new Error(`Invalid provider declaration on ${definition.name}: ${name}`);
    }
  }
  return [...new Set(names)].sort();
};
var defaultInvocationContext = () => ({
  cwd: process.cwd(),
  signal: void 0,
  parentToolCallId: "fabric-component",
  nestedToolCallId: "fabric-component",
  extensionContext: {},
  update() {
  }
});
var targetKey = (revision, digest3, missing, provisionOccupancy) => stableJsonHash({ revision, digest: digest3, missing, provisionOccupancy });
var FabricComponentIndependenceError = class extends Error {
  constructor(message2) {
    super(message2);
    this.name = "FabricComponentIndependenceError";
  }
};
var normalizeResources = (resources) => {
  const normalized = [...new Set((resources ?? []).filter((resource) => typeof resource === "string" && resource.length > 0).map((resource) => resource.slice(0, 256)))].slice(0, 64);
  return normalized.length > 0 ? normalized : ["*"];
};
var trackedRegistration = (registration, fallbackLabel) => {
  if (typeof registration === "string") return { label: registration };
  return { label: fallbackLabel, ...registration };
};
var registrationEffect = (registration) => ({
  label: registration.label?.trim().slice(0, 256) || "anonymous",
  kind: registration.kind ?? "transactional",
  resources: normalizeResources(registration.resources),
  ordering: registration.ordering ?? "unknown"
});
var actionEffect = (action) => {
  if (!action.effect || action.effect.kind === "none") return void 0;
  return {
    label: action.ref,
    kind: action.effect.kind,
    resources: normalizeResources(action.effect.resources),
    ordering: action.effect.ordering ?? "unknown"
  };
};
var summarizeEffects = (effects) => {
  const resourceNoncommutative = /* @__PURE__ */ new Map();
  let hasNoncommutative = false;
  let hasUnknown = false;
  let hasUnknownNoncommutative = false;
  let effectful = 0;
  for (const effect of effects) {
    if (effect.kind === "none") continue;
    effectful++;
    const noncommutative = effect.ordering !== "commutative";
    hasNoncommutative ||= noncommutative;
    for (const resource of effect.resources) {
      if (resource === "*") {
        hasUnknown = true;
        hasUnknownNoncommutative ||= noncommutative;
      } else {
        resourceNoncommutative.set(
          resource,
          (resourceNoncommutative.get(resource) ?? false) || noncommutative
        );
      }
    }
  }
  return {
    hasEffects: effectful > 0,
    hasNoncommutative,
    hasUnknown,
    hasUnknownNoncommutative,
    resourceNoncommutative
  };
};
var effectConflictsBetween = (left, right) => {
  if (!left.hasEffects || !right.hasEffects) return [];
  const conflicts = [];
  if (left.hasUnknown && (left.hasUnknownNoncommutative || right.hasNoncommutative) || right.hasUnknown && (right.hasUnknownNoncommutative || left.hasNoncommutative)) {
    conflicts.push({ resources: ["*"], reason: "unknown_resource" });
  }
  const overlap = [...left.resourceNoncommutative.keys()].filter(
    (resource) => right.resourceNoncommutative.has(resource) && ((left.resourceNoncommutative.get(resource) ?? false) || (right.resourceNoncommutative.get(resource) ?? false))
  ).sort();
  if (overlap.length > 0) {
    conflicts.push({ resources: overlap, reason: "shared_resource" });
  }
  return conflicts;
};
var compareEffectInfo = (left, right) => left.label.localeCompare(right.label) || left.kind.localeCompare(right.kind) || left.ordering.localeCompare(right.ordering) || left.resources.join("\0").localeCompare(right.resources.join("\0"));
var FabricComponentSupervisor = class {
  constructor(registry, options = {}) {
    this.registry = registry;
    this.options = options;
    this.#unsubscribeRegistry = registry.subscribeProviderChanges(() => this.refresh());
  }
  #components = /* @__PURE__ */ new Map();
  #listeners = /* @__PURE__ */ new Set();
  #unsubscribeRegistry;
  #requested = false;
  #reconciling;
  #closed = false;
  #activationSequence = 0;
  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
  assertLifecycleEntryAllowed(operation) {
    this.#assertLifecycleCallAllowed(operation);
  }
  list() {
    const components = [...this.#components.values()].sort((left, right) => left.entry.id.localeCompare(right.entry.id));
    const effects = new Map(components.map((component) => [
      component.entry.id,
      this.#effects(component)
    ]));
    const summaries = new Map(components.map((component) => [
      component.entry.id,
      summarizeEffects(effects.get(component.entry.id))
    ]));
    const conflicts = new Map(components.map((component) => [
      component.entry.id,
      []
    ]));
    for (let leftIndex = 0; leftIndex < components.length; leftIndex++) {
      const left = components[leftIndex];
      for (let rightIndex = leftIndex + 1; rightIndex < components.length; rightIndex++) {
        const right = components[rightIndex];
        if (left.guarantee !== "revertible" && right.guarantee !== "revertible") continue;
        const bases = effectConflictsBetween(
          summaries.get(left.entry.id),
          summaries.get(right.entry.id)
        );
        for (const basis of bases) {
          if (left.guarantee === "revertible" && conflicts.get(left.entry.id).length < 64) {
            conflicts.get(left.entry.id).push({ withComponent: right.entry.id, ...basis });
          }
          if (right.guarantee === "revertible" && conflicts.get(right.entry.id).length < 64) {
            conflicts.get(right.entry.id).push({ withComponent: left.entry.id, ...basis });
          }
        }
      }
    }
    return components.map((component) => this.#info(
      component,
      effects.get(component.entry.id),
      conflicts.get(component.entry.id)
    ));
  }
  status(id) {
    return this.#info(this.#require(id));
  }
  guidance() {
    return [...this.#components.values()].filter((component) => component.state === "active").flatMap((component) => component.modelGuidance.map((guidance) => ({
      ...structuredClone(guidance),
      componentId: component.entry.id,
      component: component.definition.name,
      revision: component.revision
    }))).sort(compareFabricOwnedModelGuidance);
  }
  graph() {
    const providers = /* @__PURE__ */ new Map();
    for (const component of this.#components.values()) {
      for (const provider of component.provisions) providers.set(provider, component.entry.id);
    }
    const dependencyEdges = [];
    const ownershipEdges = [];
    for (const component of this.#components.values()) {
      for (const requirement of component.requirements) {
        const provider = requirement.ref.slice(0, requirement.ref.indexOf("."));
        const source = providers.get(provider);
        if (source) {
          dependencyEdges.push({
            from: component.entry.id,
            to: source,
            ref: requirement.ref,
            kind: "dependency"
          });
        }
      }
      if (component.parentId) {
        ownershipEdges.push({
          from: component.entry.id,
          to: component.parentId,
          ref: "component:parent",
          kind: "ownership"
        });
      }
    }
    const edges = [...dependencyEdges, ...ownershipEdges].sort(
      (left, right) => left.from.localeCompare(right.from) || left.to.localeCompare(right.to) || left.ref.localeCompare(right.ref)
    );
    return { components: this.list(), edges, cycles: this.#cycles(dependencyEdges) };
  }
  async start(entry, definition) {
    this.#assertOpen();
    this.#assertLifecycleCallAllowed("start Fabric components");
    const component = this.#insert(entry, definition);
    await this.#requestReconcile();
    if (component.state === "failed" || component.state === "quarantined") {
      throw new Error(component.error ?? `Fabric component ${entry.id} failed to start`);
    }
    return this.#info(component);
  }
  async replace(id, entry, definition) {
    this.#assertOpen();
    this.#assertLifecycleCallAllowed("replace Fabric components");
    const component = this.#require(id);
    if (entry.id !== id) throw new Error("Fabric component replacement cannot change its entry id");
    this.#validateEntry(entry, definition);
    const nextProvisions = normalizeProvisions(definition);
    this.#assertProvisionsAvailable(id, nextProvisions);
    const previous = {
      entry: structuredClone(component.entry),
      definition: component.definition,
      requirements: component.requirements,
      provisions: component.provisions,
      guarantee: component.guarantee,
      revision: component.revision,
      parentId: component.parentId
    };
    component.removeWhenSettled = false;
    this.#retire(component);
    await this.#unload(component, /* @__PURE__ */ new Set());
    const unloadedState = component.state;
    if (unloadedState === "quarantined") {
      throw new Error(component.error ?? `Fabric component ${id} cleanup failed`);
    }
    this.#applyReplacement(component, entry, definition, previous.revision + 1, nextProvisions);
    await this.#requestReconcile();
    const candidateState = component.state;
    if (candidateState !== "failed" && candidateState !== "quarantined") {
      return this.#info(component);
    }
    const replacementError = component.error ?? `Fabric component ${id} replacement failed`;
    if (candidateState === "quarantined") throw new Error(replacementError);
    this.#retire(component);
    await this.#unload(component, /* @__PURE__ */ new Set());
    component.entry = previous.entry;
    component.definition = previous.definition;
    component.requirements = previous.requirements;
    component.provisions = previous.provisions;
    component.guarantee = previous.guarantee;
    if (previous.parentId) component.parentId = previous.parentId;
    else delete component.parentId;
    component.revision = previous.revision + 2;
    component.epoch++;
    component.retired = false;
    component.state = "waiting";
    component.missing = [];
    component.optionalMissing = [];
    component.actionEffects = [];
    component.modelGuidance = [];
    component.consecutiveDiversions = 0;
    component.removeWhenSettled = false;
    delete component.error;
    delete component.cleanupErrors;
    component.blockedOnEffects = false;
    delete component.blockedKey;
    component.updatedAt = Date.now();
    await this.#requestReconcile();
    const rollbackState = component.state;
    if (rollbackState === "failed" || rollbackState === "quarantined") {
      throw new AggregateError(
        [new Error(replacementError), new Error(component.error ?? "rollback failed")],
        `Fabric component ${id} replacement and rollback failed`
      );
    }
    throw new Error(`${replacementError}; previous revision restored`);
  }
  async stop(id, options = {}) {
    const component = this.#require(id);
    if (this.#selfLifecycleStop(id)) {
      component.removeWhenSettled = true;
      this.#retire(component);
      return;
    }
    this.#assertLifecycleCallAllowed("stop Fabric components");
    this.#retire(component);
    await this.#unload(component, /* @__PURE__ */ new Set());
    if (this.#components.get(id) !== component) return;
    if (component.state === "quarantined" && !options.force) {
      throw new Error(component.error ?? `Fabric component ${id} cleanup failed`);
    }
    component.state = "disposed";
    component.updatedAt = Date.now();
    this.#emit(id);
    this.#components.delete(id);
    this.#emit(id);
    await this.#requestReconcile();
  }
  refresh() {
    if (this.#closed) return;
    void this.#requestReconcile().catch(() => void 0);
  }
  async settle() {
    this.#assertLifecycleCallAllowed("settle Fabric components");
    await this.#waitForReconcile();
  }
  async close() {
    if (this.#closed) return;
    this.#assertLifecycleCallAllowed("close Fabric components");
    this.#closed = true;
    this.#unsubscribeRegistry();
    const components = [...this.#components.values()].sort(
      (left, right) => right.activationOrder - left.activationOrder || right.createdAt - left.createdAt || right.entry.id.localeCompare(left.entry.id)
    );
    for (const component of components) this.#retire(component);
    const visited = /* @__PURE__ */ new Set();
    for (const component of components) await this.#unload(component, visited);
    for (const component of this.#components.values()) {
      if (component.state !== "quarantined") component.state = "disposed";
      component.updatedAt = Date.now();
      this.#emit(component.entry.id);
    }
    this.#components.clear();
    this.#emit();
    this.#listeners.clear();
  }
  #insert(entry, definition, parentId) {
    this.#validateEntry(entry, definition);
    if (this.#components.size >= MAX_SUPERVISED_COMPONENTS) {
      throw new Error(
        `Fabric component supervisor supports at most ${MAX_SUPERVISED_COMPONENTS} fibers`
      );
    }
    if (this.#components.has(entry.id)) {
      throw new Error(`Fabric component already exists: ${entry.id}`);
    }
    const provisions = normalizeProvisions(definition);
    this.#assertProvisionsAvailable(entry.id, provisions);
    const now = Date.now();
    const component = {
      entry: structuredClone(entry),
      definition,
      ...parentId ? { parentId } : {},
      state: "waiting",
      guarantee: definition.guarantee ?? "managed",
      requirements: normalizeRequirements2(definition),
      provisions,
      missing: [],
      optionalMissing: [],
      revision: 1,
      epoch: 0,
      retired: false,
      activationOrder: 0,
      childSequence: 0,
      consecutiveDiversions: 0,
      removeWhenSettled: false,
      createdAt: now,
      updatedAt: now,
      scope: void 0,
      viewLease: void 0,
      providerLeases: [],
      actionEffects: [],
      modelGuidance: [],
      abortController: void 0,
      transition: void 0,
      blockedOnEffects: false
    };
    this.#components.set(entry.id, component);
    this.#emit(entry.id);
    return component;
  }
  #insertChild(parent, definition, options = {}) {
    if (parent.retired || parent.tearingDown || parent.state !== "loading" || parent.scope?.state !== "open") {
      throw new Error(`Fabric component ${parent.entry.id} can only use children while activating`);
    }
    const childCount = [...this.#components.values()].filter(
      (component) => component.parentId === parent.entry.id
    ).length;
    if (childCount >= MAX_CHILDREN_PER_COMPONENT) {
      throw new Error(
        `Fabric component ${parent.entry.id} supports at most ${MAX_CHILDREN_PER_COMPONENT} children`
      );
    }
    const sequence = ++parent.childSequence;
    const rawLocalId = options.id ?? `${definition.name}-${sequence}`;
    const localId = options.id ? rawLocalId : rawLocalId.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/^[^a-zA-Z0-9]+/, "") || `child-${sequence}`;
    if (!COMPONENT_ID_PATTERN.test(localId)) {
      throw new Error(`Invalid Fabric child component id: ${rawLocalId}`);
    }
    const joined = `${parent.entry.id}.${localId}`;
    const id = joined.length <= 128 ? joined : `${parent.entry.id.slice(0, 94)}.${stableJsonHash(joined).slice(0, 32)}`;
    const entry = {
      id,
      component: definition.name,
      ...Object.prototype.hasOwnProperty.call(options, "config") ? { config: options.config } : {}
    };
    const child = this.#insert(entry, definition, parent.entry.id);
    this.#requested = true;
    parent.scope.defer(
      () => this.#retireOwnedChild(parent.entry.id, child.entry.id),
      `component:child:${child.entry.id}`
    );
    return {
      id: child.entry.id,
      status: () => {
        if (this.#components.get(child.entry.id) !== child) {
          throw new Error(`Fabric child component is no longer installed: ${child.entry.id}`);
        }
        return this.#info(child);
      },
      stop: async (stopOptions) => {
        if (this.#components.get(child.entry.id) !== child) return;
        if (this.#selfLifecycleStop(child.entry.id)) {
          child.removeWhenSettled = true;
          this.#retire(child);
          return;
        }
        this.#assertLifecycleCallAllowed("stop a child component");
        this.#retire(child);
        await this.#unload(child, /* @__PURE__ */ new Set());
        if (this.#components.get(child.entry.id) !== child) return;
        if (child.state === "quarantined" && !stopOptions?.force) {
          throw new Error(child.error ?? `Fabric component ${child.entry.id} cleanup failed`);
        }
        child.state = "disposed";
        child.updatedAt = Date.now();
        this.#emit(child.entry.id);
        this.#components.delete(child.entry.id);
        this.#emit(child.entry.id);
        this.#requested = true;
      }
    };
  }
  #validateEntry(entry, definition) {
    if (!COMPONENT_ID_PATTERN.test(entry.id)) {
      throw new Error(`Invalid Fabric component id: ${entry.id}`);
    }
    if (entry.component !== definition.name) {
      throw new Error(
        `Fabric component entry ${entry.id} selects ${entry.component}, not ${definition.name}`
      );
    }
  }
  #assertProvisionsAvailable(id, provisions) {
    for (const component of this.#components.values()) {
      if (component.entry.id === id) continue;
      const overlap = provisions.filter((provider) => component.provisions.includes(provider));
      if (overlap.length > 0) {
        throw new Error(
          `Fabric components ${id} and ${component.entry.id} declare the same providers: ${overlap.join(", ")}`
        );
      }
    }
    const owner = this.#components.get(id);
    const occupied = provisions.filter(
      (provider) => this.registry.has(provider) && !owner?.providerLeases.some((lease) => lease.name === provider && lease.active)
    );
    if (occupied.length > 0) {
      throw new Error(
        `Fabric component ${id} providers are already registered outside the component: ${occupied.join(", ")}`
      );
    }
  }
  #applyReplacement(component, entry, definition, revision, provisions = normalizeProvisions(definition)) {
    component.entry = structuredClone(entry);
    component.definition = definition;
    component.requirements = normalizeRequirements2(definition);
    component.provisions = provisions;
    component.guarantee = definition.guarantee ?? "managed";
    component.revision = revision;
    component.epoch++;
    component.retired = false;
    component.state = "waiting";
    component.missing = [];
    component.optionalMissing = [];
    component.actionEffects = [];
    component.modelGuidance = [];
    component.childSequence = 0;
    component.consecutiveDiversions = 0;
    component.removeWhenSettled = false;
    delete component.error;
    delete component.cleanupErrors;
    component.blockedOnEffects = false;
    delete component.blockedKey;
    component.updatedAt = Date.now();
  }
  #retire(component) {
    if (component.retired) return;
    component.retired = true;
    component.epoch++;
    component.updatedAt = Date.now();
  }
  #requestReconcile() {
    this.#requested = true;
    this.#startReconcile();
    return this.#waitForReconcile();
  }
  #startReconcile() {
    if (this.#reconciling || this.#closed) return;
    const task = this.#drainReconcile();
    this.#reconciling = task;
    void task.finally(() => {
      if (this.#reconciling === task) this.#reconciling = void 0;
      if (this.#requested && !this.#closed) this.#startReconcile();
    }).catch(() => void 0);
  }
  async #waitForReconcile() {
    for (; ; ) {
      this.#startReconcile();
      const task = this.#reconciling;
      if (!task) return;
      await task;
      if (!this.#requested && !this.#reconciling) return;
    }
  }
  async #drainReconcile() {
    while (this.#requested && !this.#closed) {
      this.#requested = false;
      for (const component of this.#components.values()) {
        await this.#reconcile(component);
      }
    }
  }
  async #reconcile(component) {
    if (component.retired || component.state === "loading" || component.state === "unloading" || component.state === "disposed" || component.state === "quarantined") {
      return;
    }
    const baseContext = this.#invocationContext(component);
    const resolution = await this.registry.inspectCapabilities(
      component.requirements,
      baseContext
    );
    component.missing = resolution.missing;
    component.optionalMissing = resolution.optionalMissing;
    const key = targetKey(
      component.revision,
      resolution.view?.digest,
      resolution.missing,
      component.provisions.map((provider) => this.registry.has(provider))
    );
    const effectiveKey = component.blockedOnEffects ? stableJsonHash({ key, effects: this.#effectEnvironmentDigest(component) }) : key;
    if (component.state === "active") {
      const provisionsActive = component.providerLeases.length === component.provisions.length && component.providerLeases.every((lease) => lease.active);
      if (provisionsActive && resolution.satisfied && resolution.view?.digest === component.viewLease?.view?.digest) return;
      await this.#unload(component, /* @__PURE__ */ new Set());
      const unloadedState = component.state;
      if (component.retired || unloadedState === "quarantined") return;
    }
    if (!resolution.satisfied) {
      component.state = "waiting";
      component.blockedOnEffects = false;
      component.updatedAt = Date.now();
      component.blockedKey = effectiveKey;
      this.#emit(component.entry.id);
      return;
    }
    if (component.state === "failed" && component.blockedKey === effectiveKey) return;
    await this.#load(component, baseContext, key);
  }
  async #load(component, baseContext, key) {
    if (component.transition) await component.transition;
    if (component.retired || this.#closed) return;
    const epoch = component.epoch;
    const storage = await lifecycleStorage();
    if (component.retired || this.#closed) return;
    const task = storage.run(
      { supervisor: this, componentId: component.entry.id, phase: "loading" },
      () => this.#performLoad(component, baseContext, key, epoch)
    );
    component.transition = task;
    try {
      await task;
    } finally {
      if (component.transition === task) component.transition = void 0;
      this.#removeRetiredAfterTransition(component);
    }
  }
  async #performLoad(component, baseContext, key, epoch) {
    component.state = "loading";
    component.updatedAt = Date.now();
    component.missing = [];
    component.actionEffects = [];
    component.modelGuidance = [];
    component.consecutiveDiversions = 0;
    component.removeWhenSettled = false;
    delete component.error;
    delete component.cleanupErrors;
    this.#emit(component.entry.id);
    const controller = new AbortController();
    let scope;
    let viewLease;
    const providerLeases = [];
    const actionEffects = [];
    const modelGuidance = [];
    try {
      viewLease = await this.registry.acquireCapabilityView(
        component.requirements,
        { ...baseContext, signal: controller.signal }
      );
      if (!viewLease.satisfied || !viewLease.view) {
        const missing = [...viewLease.missing];
        const optionalMissing = [...viewLease.optionalMissing];
        await viewLease.release();
        viewLease = void 0;
        if (this.#transitionCurrent(component, epoch)) {
          component.state = "waiting";
          component.missing = missing;
          component.optionalMissing = optionalMissing;
          component.updatedAt = Date.now();
          this.#emit(component.entry.id);
        }
        return;
      }
      if (!this.#transitionCurrent(component, epoch)) throw new FabricEffectDivertedError();
      const committedView = viewLease.view;
      scope = new FabricEffectScope({
        guard: () => this.#targetMatches(component, epoch, committedView.digest, baseContext)
      });
      component.scope = scope;
      component.viewLease = viewLease;
      component.abortController = controller;
      component.providerLeases = providerLeases;
      component.actionEffects = actionEffects;
      component.modelGuidance = modelGuidance;
      const declared = new Set(component.provisions);
      const assertRegistrationOpen = () => {
        if (component.tearingDown || scope?.state !== "open") {
          throw new Error(
            `Fabric component ${component.entry.id} cannot register effects during teardown`
          );
        }
      };
      const invocation = {
        ...baseContext,
        signal: controller.signal,
        capabilityView: committedView,
        effectPolicy: component.guarantee === "revertible" ? "strict" : "advisory"
      };
      const context = {
        id: component.entry.id,
        signal: controller.signal,
        invocation,
        view: committedView,
        effect: async (setup, registration) => {
          assertRegistrationOpen();
          const tracked = trackedRegistration(registration, "anonymous");
          if (component.guarantee === "revertible") {
            this.#assertEffectCapacity(component, 1);
            if (tracked.kind === "emission") {
              throw new Error(
                `Revertible Fabric component ${component.entry.id} cannot register an emission effect`
              );
            }
            this.#assertIndependent(component, [registrationEffect(tracked)]);
          }
          const dispose = await scope.effect(setup, tracked);
          return async () => {
            await dispose();
            this.refresh();
          };
        },
        defer: (disposer, registration) => {
          assertRegistrationOpen();
          const tracked = trackedRegistration(registration, "deferred");
          const dispose = scope.defer(disposer, tracked);
          if (component.guarantee === "revertible") this.#assertEffectCapacity(component);
          if (component.guarantee === "revertible" && tracked.kind === "emission") {
            throw new Error(
              `Revertible Fabric component ${component.entry.id} cannot defer an emission effect`
            );
          }
          return async () => {
            await dispose();
            this.refresh();
          };
        },
        guide: (guidance) => {
          assertRegistrationOpen();
          const normalized = normalizeFabricModelGuidance(guidance);
          if (modelGuidance.some((entry) => entry.label === normalized.label)) {
            throw new Error(
              `Fabric component ${component.entry.id} registered guidance label ${normalized.label} more than once`
            );
          }
          if (modelGuidance.length >= MAX_FABRIC_MODEL_GUIDANCE_PER_COMPONENT) {
            throw new Error(
              `Fabric component ${component.entry.id} supports at most ${MAX_FABRIC_MODEL_GUIDANCE_PER_COMPONENT} guidance registrations`
            );
          }
          const totalChars = modelGuidance.reduce((sum, entry) => sum + entry.content.length, 0) + normalized.content.length;
          if (totalChars > MAX_FABRIC_MODEL_GUIDANCE_TOTAL_CHARS) {
            throw new Error(
              `Fabric component ${component.entry.id} guidance exceeds ${MAX_FABRIC_MODEL_GUIDANCE_TOTAL_CHARS} characters`
            );
          }
          const projection = [...this.#components.values()].flatMap((candidate) => candidate.modelGuidance);
          if (projection.length >= MAX_FABRIC_MODEL_GUIDANCE_REGISTRATIONS) {
            throw new Error(
              `Fabric component guidance supports at most ${MAX_FABRIC_MODEL_GUIDANCE_REGISTRATIONS} registrations`
            );
          }
          const projectionChars = projection.reduce((sum, entry) => sum + entry.content.length, 0) + normalized.content.length;
          if (projectionChars > MAX_FABRIC_MODEL_GUIDANCE_SNAPSHOT_CHARS) {
            throw new Error(
              `Fabric component guidance snapshot exceeds ${MAX_FABRIC_MODEL_GUIDANCE_SNAPSHOT_CHARS} characters`
            );
          }
          const registration = {
            label: `guidance:${normalized.label}`,
            kind: "transactional",
            resources: [`fabric:guidance:${component.entry.id}:${normalized.label}`],
            ordering: "commutative"
          };
          if (component.guarantee === "revertible") {
            this.#assertEffectCapacity(component, 1);
            this.#assertIndependent(component, [registrationEffect(registration)]);
          }
          let registered = true;
          const unregister = () => {
            if (!registered) return;
            registered = false;
            const index = modelGuidance.indexOf(normalized);
            if (index >= 0) modelGuidance.splice(index, 1);
            component.updatedAt = Date.now();
            if (component.state === "active") this.#emit(component.entry.id);
          };
          modelGuidance.push(normalized);
          let dispose;
          try {
            dispose = scope.defer(unregister, registration);
          } catch (error) {
            unregister();
            throw error;
          }
          component.updatedAt = Date.now();
          if (component.state === "active") this.#emit(component.entry.id);
          return async () => {
            await dispose();
            this.refresh();
          };
        },
        provide: (provider) => {
          assertRegistrationOpen();
          if (component.guarantee === "revertible" && !provider.close) {
            throw new Error(
              `Revertible Fabric component ${component.entry.id} provider ${provider.name} must implement close()`
            );
          }
          if (!declared.has(provider.name)) {
            throw new Error(
              `Fabric component ${component.entry.id} mounted undeclared provider ${provider.name}`
            );
          }
          if (providerLeases.some((lease2) => lease2.name === provider.name)) {
            throw new Error(
              `Fabric component ${component.entry.id} mounted provider ${provider.name} more than once`
            );
          }
          const lease = this.registry.mount(provider, { staged: true });
          providerLeases.push(lease);
          return lease;
        },
        use: (definition, options) => this.#insertChild(component, definition, options),
        acquire: async (ref, args) => {
          if (!committedView.bindings[ref]) {
            throw new Error(
              `Fabric component ${component.entry.id} acquired undeclared or unavailable capability ${ref}`
            );
          }
          const action = await this.registry.describe(ref, invocation);
          if (action.effect?.kind !== "scoped") {
            throw new Error(`Fabric action is not a scoped acquisition: ${ref}`);
          }
          const effect = actionEffect(action);
          if (component.guarantee === "revertible") {
            this.#assertEffectCapacity(component, 1);
            this.#assertIndependent(component, [effect]);
          }
          const acquired = this.options.acquire ? await this.options.acquire(ref, args ?? {}, invocation) : await this.registry.acquireScoped(ref, args ?? {}, invocation);
          try {
            scope.defer(acquired.dispose, {
              label: `acquire:${ref}`,
              kind: effect.kind,
              resources: effect.resources,
              ordering: effect.ordering
            });
          } catch (error) {
            await acquired.dispose();
            throw error;
          }
          return acquired.value;
        },
        call: async (ref, args) => {
          if (!committedView.bindings[ref]) {
            throw new Error(
              `Fabric component ${component.entry.id} called undeclared or unavailable capability ${ref}`
            );
          }
          const callInvocation = {
            ...invocation,
            signal: component.tearingDown ? void 0 : invocation.signal
          };
          const action = await this.registry.describe(ref, callInvocation);
          if (action.effect?.kind === "scoped") {
            throw new Error(`Fabric scoped action ${ref} must be used through context.acquire()`);
          }
          if (component.guarantee === "revertible" && action.effect?.kind !== "none" && action.effect?.kind !== "transactional") {
            throw new Error(
              `Revertible Fabric component ${component.entry.id} cannot emit non-revertible action ${ref}`
            );
          }
          const effect = actionEffect(action);
          if (effect && component.guarantee === "revertible") {
            this.#assertEffectCapacity(component, 1);
            this.#assertIndependent(component, [effect]);
          }
          const callArgs = args ?? {};
          const value = this.options.invoke ? await this.options.invoke(ref, callArgs, callInvocation) : await this.registry.invoke(ref, callArgs, {
            ...callInvocation,
            approve: async () => {
            },
            audits: [],
            maxResultChars: this.options.maxResultChars ?? 2e6
          });
          if (effect && actionEffects.length < MAX_COMPONENT_EFFECTS) actionEffects.push(effect);
          return value;
        }
      };
      await scope.effect(
        () => component.definition.activate(context, component.entry.config),
        "component:activate",
        { beforeCleanup: () => {
          component.tearingDown = true;
        } }
      );
      const unprovided = component.provisions.filter(
        (name) => !providerLeases.some((lease) => lease.name === name)
      );
      if (unprovided.length > 0) {
        throw new Error(
          `Fabric component ${component.entry.id} did not mount declared providers: ${unprovided.join(", ")}`
        );
      }
      if (!await this.#targetMatches(component, epoch, committedView.digest, baseContext)) {
        throw new FabricEffectDivertedError(
          `Fabric component ${component.entry.id} capability target changed during activation`
        );
      }
      if (component.guarantee === "revertible") {
        this.#assertIndependent(component, this.#effects(component));
      }
      this.registry.activateProviderBindings(
        providerLeases.map((lease) => lease.bindingId)
      );
      if (!this.#transitionCurrent(component, epoch)) {
        throw new FabricEffectDivertedError(
          `Fabric component ${component.entry.id} was retired during activation`
        );
      }
      component.state = "active";
      component.blockedOnEffects = false;
      component.consecutiveDiversions = 0;
      component.activationOrder = ++this.#activationSequence;
      component.optionalMissing = viewLease.optionalMissing;
      component.blockedKey = key;
      component.updatedAt = Date.now();
      this.#emit(component.entry.id);
    } catch (error) {
      component.tearingDown = true;
      controller.abort(error);
      for (const lease of providerLeases) lease.retire();
      const report = scope ? await scope.dispose() : { status: "disposed", failures: [] };
      const providerCleanup = await Promise.allSettled(
        providerLeases.map((lease) => lease.release())
      );
      const viewCleanup = viewLease ? (await Promise.allSettled([viewLease.release()]))[0] : void 0;
      if (component.scope === scope) component.scope = void 0;
      if (component.viewLease === viewLease) component.viewLease = void 0;
      if (component.abortController === controller) component.abortController = void 0;
      if (component.providerLeases === providerLeases) component.providerLeases = [];
      if (component.actionEffects === actionEffects) component.actionEffects = [];
      if (component.modelGuidance === modelGuidance) component.modelGuidance = [];
      component.tearingDown = false;
      component.updatedAt = Date.now();
      const cleanupErrors = [
        ...report.failures.map((failure) => `${failure.label}: ${failure.error}`),
        ...error instanceof FabricEffectDivertedError && error.cleanupError !== void 0 ? [`iterator-close: ${errorMessage2(error.cleanupError)}`] : [],
        ...providerCleanup.flatMap(
          (result) => result.status === "rejected" ? [`provider: ${errorMessage2(result.reason)}`] : []
        ),
        ...providerLeases.flatMap(
          (lease) => lease.active ? [`provider:${lease.name}: binding remained active after rollback`] : []
        ),
        ...viewCleanup?.status === "rejected" ? [`capability-view: ${errorMessage2(viewCleanup.reason)}`] : []
      ];
      let diverted = error instanceof FabricEffectDivertedError || !this.#transitionCurrent(component, epoch);
      if (!diverted && viewLease?.view) {
        try {
          diverted = !await this.#targetMatches(
            component,
            epoch,
            viewLease.view.digest,
            baseContext
          );
        } catch {
        }
      }
      let retryDelayMs = 0;
      if (cleanupErrors.length > 0) {
        component.state = "quarantined";
        component.consecutiveDiversions = 0;
        component.error = errorMessage2(error);
        component.cleanupErrors = cleanupErrors;
      } else if (diverted) {
        component.state = "waiting";
        component.consecutiveDiversions++;
        retryDelayMs = Math.min(2 ** (component.consecutiveDiversions - 1), 100);
        delete component.error;
        delete component.cleanupErrors;
        component.blockedOnEffects = false;
        delete component.blockedKey;
      } else {
        component.state = "failed";
        component.consecutiveDiversions = 0;
        component.blockedOnEffects = error instanceof FabricComponentIndependenceError;
        component.error = errorMessage2(error);
        component.blockedKey = component.blockedOnEffects ? stableJsonHash({ key, effects: this.#effectEnvironmentDigest(component) }) : key;
      }
      this.#emit(component.entry.id);
      if (diverted && !component.retired && !this.#closed) {
        await new Promise((resolve2) => setTimeout(resolve2, retryDelayMs));
        if (!component.retired && !this.#closed) this.#requested = true;
      }
    }
  }
  async #targetMatches(component, epoch, digest3, baseContext) {
    if (!this.#transitionCurrent(component, epoch)) return false;
    const { capabilityView: _committedView, ...uncommittedContext } = baseContext;
    const resolution = await this.registry.inspectCapabilities(component.requirements, {
      ...uncommittedContext,
      signal: void 0
    });
    return this.#transitionCurrent(component, epoch) && resolution.satisfied && resolution.view?.digest === digest3;
  }
  #transitionCurrent(component, epoch) {
    return !component.retired && component.epoch === epoch && this.#components.get(component.entry.id) === component && !this.#closed;
  }
  async #unload(component, visited) {
    if (visited.has(component.entry.id)) return;
    visited.add(component.entry.id);
    component.abortController?.abort(
      new Error(`Fabric component ${component.entry.id} is unloading`)
    );
    if (component.transition) await component.transition;
    if (!component.scope && !component.viewLease && component.providerLeases.length === 0) {
      if (component.state !== "disposed" && component.state !== "quarantined") {
        component.state = "waiting";
      }
      return;
    }
    const storage = await lifecycleStorage();
    const task = storage.run(
      { supervisor: this, componentId: component.entry.id, phase: "unloading" },
      () => this.#performUnload(component, visited)
    );
    component.transition = task;
    try {
      await task;
    } finally {
      if (component.transition === task) component.transition = void 0;
      this.#removeRetiredAfterTransition(component);
    }
  }
  async #performUnload(component, visited) {
    component.state = "unloading";
    component.tearingDown = true;
    component.updatedAt = Date.now();
    component.abortController?.abort(
      new Error(`Fabric component ${component.entry.id} is unloading`)
    );
    for (const lease of component.providerLeases) lease.retire();
    this.#emit(component.entry.id);
    const childCleanupErrors = [];
    const children = [...this.#components.values()].filter((candidate) => candidate.parentId === component.entry.id).sort(
      (left, right) => right.activationOrder - left.activationOrder || right.createdAt - left.createdAt || right.entry.id.localeCompare(left.entry.id)
    );
    for (const child of children) {
      try {
        await this.#retireOwnedChild(component.entry.id, child.entry.id, visited);
      } catch (error) {
        childCleanupErrors.push(`child:${child.entry.id}: ${errorMessage2(error)}`);
      }
    }
    const bindingIds = new Set(component.providerLeases.map((lease) => lease.bindingId));
    for (const dependent of this.#components.values()) {
      if (dependent === component || !dependent.viewLease?.view) continue;
      const depends = Object.values(dependent.viewLease.view.bindings).some(
        (binding) => bindingIds.has(binding.providerBindingId)
      );
      if (depends) await this.#unload(dependent, visited);
    }
    const leases = component.providerLeases;
    const scope = component.scope;
    const viewLease = component.viewLease;
    const report = await scope?.dispose();
    const providerCleanup = await Promise.allSettled(leases.map((lease) => lease.release()));
    const viewCleanup = viewLease ? (await Promise.allSettled([viewLease.release()]))[0] : void 0;
    component.scope = void 0;
    component.viewLease = void 0;
    component.abortController = void 0;
    component.providerLeases = [];
    component.actionEffects = [];
    component.modelGuidance = [];
    component.tearingDown = false;
    component.updatedAt = Date.now();
    const cleanupErrors = [
      ...childCleanupErrors,
      ...(report?.failures ?? []).map(
        (failure) => `${failure.label}: ${failure.error}`
      ),
      ...providerCleanup.flatMap(
        (result) => result.status === "rejected" ? [`provider: ${errorMessage2(result.reason)}`] : []
      ),
      ...leases.flatMap(
        (lease) => lease.active ? [`provider:${lease.name}: binding remained active after unload`] : []
      ),
      ...viewCleanup?.status === "rejected" ? [`capability-view: ${errorMessage2(viewCleanup.reason)}`] : []
    ];
    if (cleanupErrors.length > 0) {
      component.state = "quarantined";
      component.error = `Fabric component ${component.entry.id} cleanup failed`;
      component.cleanupErrors = cleanupErrors;
    } else {
      component.state = "waiting";
      delete component.cleanupErrors;
    }
    this.#emit(component.entry.id);
  }
  async #retireOwnedChild(parentId, childId, visited = /* @__PURE__ */ new Set()) {
    const child = this.#components.get(childId);
    if (!child || child.parentId !== parentId) return;
    this.#retire(child);
    await this.#unload(child, visited);
    if (this.#components.get(childId) !== child) return;
    const cleanupError = child.state === "quarantined" ? new Error(child.error ?? `Fabric child component ${childId} cleanup failed`) : void 0;
    child.state = child.state === "quarantined" ? "quarantined" : "disposed";
    child.updatedAt = Date.now();
    this.#emit(childId);
    this.#components.delete(childId);
    this.#emit(childId);
    this.#requested = true;
    if (cleanupError) throw cleanupError;
  }
  #removeRetiredAfterTransition(component) {
    if (!component.removeWhenSettled || component.state === "quarantined" || this.#components.get(component.entry.id) !== component) return;
    component.removeWhenSettled = false;
    component.state = "disposed";
    component.updatedAt = Date.now();
    this.#emit(component.entry.id);
    this.#components.delete(component.entry.id);
    this.#emit(component.entry.id);
    this.#requested = true;
  }
  #effects(component) {
    const scopedLimit = Math.max(0, MAX_COMPONENT_EFFECTS - component.actionEffects.length);
    const effects = [
      ...component.scope?.footprint(scopedLimit) ?? [],
      ...component.actionEffects.slice(0, MAX_COMPONENT_EFFECTS)
    ].slice(0, MAX_COMPONENT_EFFECTS);
    return effects.map((effect) => ({ ...effect, resources: [...effect.resources] })).sort(compareEffectInfo);
  }
  #effectConflicts(component, effects = this.#effects(component)) {
    const summary = summarizeEffects(effects);
    const conflicts = [];
    for (const other of this.#components.values()) {
      if (other === component) continue;
      for (const conflict of effectConflictsBetween(
        summary,
        summarizeEffects(this.#effects(other))
      )) {
        conflicts.push({ withComponent: other.entry.id, ...conflict });
        if (conflicts.length >= 64) break;
      }
      if (conflicts.length >= 64) break;
    }
    return conflicts.sort(
      (left, right) => left.withComponent.localeCompare(right.withComponent) || left.reason.localeCompare(right.reason) || left.resources.join("\0").localeCompare(right.resources.join("\0"))
    );
  }
  #effectEnvironmentDigest(component) {
    const environment = [...this.#components.values()].filter((other) => other !== component).sort((left, right) => left.entry.id.localeCompare(right.entry.id)).flatMap((other) => {
      const effects = this.#effects(other);
      return effects.length > 0 ? [{ id: other.entry.id, guarantee: other.guarantee, effects }] : [];
    });
    return stableJsonHash(environment);
  }
  #assertEffectCapacity(component, additional = 0) {
    if (component.guarantee !== "revertible") return;
    const count = (component.scope?.footprint(MAX_COMPONENT_EFFECTS + 1).length ?? 0) + component.actionEffects.length + additional;
    if (count > MAX_COMPONENT_EFFECTS) {
      throw new Error(
        `Revertible Fabric component ${component.entry.id} exceeds ${MAX_COMPONENT_EFFECTS} tracked effects`
      );
    }
  }
  #assertIndependent(component, effects) {
    const conflicts = this.#effectConflicts(component, [...effects]);
    if (conflicts.length === 0) return;
    throw new FabricComponentIndependenceError(
      `Revertible Fabric component ${component.entry.id} has non-independent effects: ` + conflicts.map(
        (conflict) => formatFabricEffectConflict(
          conflict.withComponent,
          conflict.resources,
          conflict.reason
        )
      ).join("; ")
    );
  }
  #invocationContext(component) {
    const base = this.options.invocationContext?.() ?? defaultInvocationContext();
    return {
      ...base,
      parentToolCallId: `component:${component.entry.id}:${component.revision}`,
      nestedToolCallId: `component:${component.entry.id}:${component.revision}`
    };
  }
  #info(component, projectedEffects, projectedConflicts) {
    const effects = projectedEffects ?? this.#effects(component);
    const effectConflicts = component.guarantee === "revertible" ? projectedConflicts ?? this.#effectConflicts(component, effects) : [];
    return {
      id: component.entry.id,
      component: component.definition.name,
      ...component.parentId ? { parentId: component.parentId } : {},
      state: component.state,
      guarantee: component.guarantee,
      revision: component.revision,
      requirements: component.requirements.map((requirement) => requirement.ref),
      provisions: [...component.provisions],
      missing: [...component.missing],
      optionalMissing: [...component.optionalMissing],
      effects,
      ...effectConflicts.length > 0 ? { effectConflicts } : {},
      ...component.state === "active" && component.modelGuidance.length > 0 ? { guidance: component.modelGuidance.map(fabricModelGuidanceInfo) } : {},
      ...component.viewLease?.view?.digest ? { targetDigest: component.viewLease.view.digest } : {},
      ...component.error ? { error: component.error } : {},
      ...component.cleanupErrors ? { cleanupErrors: [...component.cleanupErrors] } : {},
      createdAt: component.createdAt,
      updatedAt: component.updatedAt
    };
  }
  #cycles(edges) {
    const adjacent = /* @__PURE__ */ new Map();
    for (const edge of edges) {
      const targets = adjacent.get(edge.from) ?? [];
      targets.push(edge.to);
      adjacent.set(edge.from, targets);
    }
    const cycles = /* @__PURE__ */ new Map();
    const visit = (node, path17, positions) => {
      const position = positions.get(node);
      if (position !== void 0) {
        const cycle = path17.slice(position);
        const rotations = cycle.map((_, index) => [
          ...cycle.slice(index),
          ...cycle.slice(0, index)
        ]);
        rotations.sort((left, right) => left.join("\0").localeCompare(right.join("\0")));
        const canonical = rotations[0];
        cycles.set(canonical.join("\0"), canonical);
        return;
      }
      if (path17.length > this.#components.size) return;
      const nextPositions = new Map(positions).set(node, path17.length);
      for (const target of adjacent.get(node) ?? []) {
        visit(target, [...path17, node], nextPositions);
      }
    };
    for (const id of this.#components.keys()) visit(id, [], /* @__PURE__ */ new Map());
    return [...cycles.values()].sort(
      (left, right) => left.join("\0").localeCompare(right.join("\0"))
    );
  }
  #selfLifecycleStop(id) {
    const frame = componentLifecycleStorage?.getStore();
    return frame?.supervisor === this && frame.componentId === id;
  }
  #assertLifecycleCallAllowed(operation) {
    const frame = componentLifecycleStorage?.getStore();
    if (!frame || frame.supervisor !== this) return;
    throw new Error(
      `Cannot ${operation} from ${frame.phase} transition ${frame.componentId}`
    );
  }
  #require(id) {
    const component = this.#components.get(id);
    if (!component) throw new Error(`Unknown Fabric component: ${id}`);
    return component;
  }
  #assertOpen() {
    if (this.#closed) throw new Error("Fabric component supervisor is closed");
  }
  #emit(componentId) {
    for (const listener of [...this.#listeners]) {
      try {
        listener(componentId);
      } catch {
      }
    }
  }
};

// src/components/loader.ts
var ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;
var message = (error) => error instanceof Error ? error.message : String(error);
var cloneEntry = (entry) => structuredClone(entry);
var entryHash = (entry) => stableJsonHash(entry);
var FabricComponentLoader = class {
  constructor(catalog, supervisor) {
    this.catalog = catalog;
    this.supervisor = supervisor;
    this.#unsubscribeCatalog = catalog.subscribe((event) => {
      const affected = [...this.#targetEntries().values()].filter(
        (entry) => entry.component === event.name && entry.disabled !== true
      );
      if (affected.length === 0 || this.#closed) return;
      void this.#enqueue(() => this.#applyDesired()).catch((error) => {
        for (const entry of affected) this.#errors.set(entry.id, message(error));
      });
    });
  }
  #loaded = /* @__PURE__ */ new Map();
  #errors = /* @__PURE__ */ new Map();
  #firstSeen = /* @__PURE__ */ new Map();
  #unsubscribeCatalog;
  #desired = /* @__PURE__ */ new Map();
  #pinned = /* @__PURE__ */ new Map();
  #tail = Promise.resolve();
  #closed = false;
  entries() {
    return [...this.#desired.values()].map(cloneEntry);
  }
  pinnedEntries() {
    return [...this.#pinned.values()].map(cloneEntry);
  }
  definitions() {
    return this.catalog.list().map(({ definition, revision }) => ({
      name: definition.name,
      ...definition.description ? { description: definition.description } : {},
      revision,
      requirements: (definition.requires ?? []).map(
        (requirement) => typeof requirement === "string" ? requirement : requirement.ref
      ),
      provisions: (definition.provides ?? []).map(
        (provision) => typeof provision === "string" ? provision : provision.provider
      )
    }));
  }
  list() {
    const live = new Map(
      this.supervisor.list().map((info) => [
        info.id,
        this.#errors.has(info.id) ? { ...info, error: this.#errors.get(info.id) } : info
      ])
    );
    for (const entry of this.#targetEntries().values()) {
      if (entry.disabled || live.has(entry.id) || this.catalog.get(entry.component)) continue;
      const now = this.#firstSeen.get(entry.id) ?? Date.now();
      this.#firstSeen.set(entry.id, now);
      live.set(entry.id, {
        id: entry.id,
        component: entry.component,
        state: "waiting",
        guarantee: "managed",
        requirements: [],
        provisions: [],
        missing: [`component:${entry.component}`],
        optionalMissing: [],
        effects: [],
        error: `Fabric component definition is unavailable: ${entry.component}`,
        revision: 0,
        createdAt: now,
        updatedAt: now
      });
    }
    return [...live.values()].sort((left, right) => left.id.localeCompare(right.id));
  }
  status(id) {
    const info = this.list().find((candidate) => candidate.id === id);
    if (!info) throw new Error(`Unknown Fabric component: ${id}`);
    return info;
  }
  graph() {
    const graph = this.supervisor.graph();
    const present = new Set(graph.components.map((component) => component.id));
    return {
      ...graph,
      components: [
        ...graph.components,
        ...this.list().filter((component) => !present.has(component.id))
      ].sort((left, right) => left.id.localeCompare(right.id))
    };
  }
  reload(id) {
    this.supervisor.assertLifecycleEntryAllowed("reload the component loader");
    return this.#enqueue(async () => {
      const targets = id ? [[id, this.#loaded.get(id)]] : [...this.#loaded.entries()];
      if (id && !targets[0]?.[1]) {
        const desired = this.#targetEntries().get(id);
        if (desired && !this.catalog.get(desired.component)) {
          throw new Error(`Fabric component definition is unavailable: ${desired.component}`);
        }
        throw new Error(`Unknown Fabric component: ${id}`);
      }
      for (const [componentId, loaded] of targets) {
        if (!loaded) continue;
        try {
          await this.supervisor.replace(componentId, loaded.entry, loaded.definition);
          this.#errors.delete(componentId);
        } catch (error) {
          this.#errors.set(componentId, message(error));
          throw error;
        }
      }
      return id ? [this.status(id)] : this.list();
    });
  }
  installPinned(entries) {
    this.supervisor.assertLifecycleEntryAllowed("install pinned components");
    if (entries.length > 256) throw new Error("Fabric supports at most 256 pinned components");
    const next = this.#entryMap(entries);
    return this.#enqueue(async () => {
      for (const id of next.keys()) {
        if (this.#desired.has(id)) {
          throw new Error(`Pinned Fabric component id conflicts with configured entry: ${id}`);
        }
      }
      const previous = this.#pinned;
      this.#pinned = next;
      try {
        await this.#applyDesired();
        return this.list();
      } catch (error) {
        this.#pinned = previous;
        throw error;
      }
    });
  }
  reconcile(entries) {
    this.supervisor.assertLifecycleEntryAllowed("reconcile the component loader");
    if (entries.length > 256) throw new Error("Fabric configuration supports at most 256 components");
    const next = this.#entryMap(entries);
    return this.#enqueue(async () => {
      for (const id of next.keys()) {
        if (this.#pinned.has(id)) {
          throw new Error(`Fabric component entry id is reserved by a pinned component: ${id}`);
        }
      }
      const previous = this.#desired;
      this.#desired = next;
      try {
        await this.#applyDesired();
        return this.list();
      } catch (error) {
        this.#desired = previous;
        throw error;
      }
    });
  }
  async settle() {
    await this.#tail;
    await this.supervisor.settle();
    await this.#tail;
  }
  async close() {
    if (this.#closed) return;
    this.supervisor.assertLifecycleEntryAllowed("close the component loader");
    this.#closed = true;
    this.#unsubscribeCatalog();
    await this.#tail;
    await this.supervisor.close();
    this.#loaded.clear();
    this.#pinned.clear();
  }
  #entryMap(entries) {
    const next = /* @__PURE__ */ new Map();
    for (const rawEntry of entries) {
      const entry = cloneEntry(rawEntry);
      if (!ID_PATTERN.test(entry.id)) throw new Error(`Invalid Fabric component id: ${entry.id}`);
      if (!entry.component.trim()) {
        throw new Error(`Fabric component entry ${entry.id} has an empty component name`);
      }
      if (next.has(entry.id)) throw new Error(`Duplicate Fabric component entry id: ${entry.id}`);
      next.set(entry.id, entry);
    }
    return next;
  }
  #targetEntries() {
    return new Map([...this.#pinned, ...this.#desired]);
  }
  #enqueue(operation) {
    if (this.#closed) return Promise.reject(new Error("Fabric component loader is closed"));
    const run = this.#tail.then(operation, operation);
    this.#tail = run.then(() => void 0, () => void 0);
    return run;
  }
  async #applyDesired() {
    const targets = /* @__PURE__ */ new Map();
    for (const entry of this.#targetEntries().values()) {
      if (entry.disabled) continue;
      const catalogEntry = this.catalog.get(entry.component);
      if (!catalogEntry) continue;
      targets.set(entry.id, {
        entry: cloneEntry(entry),
        definition: catalogEntry.definition,
        definitionRevision: catalogEntry.revision,
        entryHash: entryHash(entry)
      });
    }
    const added = [];
    const changed = [];
    const removed = [];
    try {
      for (const [id, target] of targets) {
        const current = this.#loaded.get(id);
        if (!current) {
          try {
            await this.supervisor.start(target.entry, target.definition);
            this.#loaded.set(id, target);
            added.push(id);
          } catch (error) {
            try {
              await this.supervisor.stop(id);
            } catch {
            }
            throw error;
          }
          continue;
        }
        if (current.entryHash === target.entryHash && current.definitionRevision === target.definitionRevision) {
          continue;
        }
        await this.supervisor.replace(id, target.entry, target.definition);
        changed.push({ id, previous: current });
        this.#loaded.set(id, target);
      }
      for (const [id, current] of [...this.#loaded]) {
        if (targets.has(id)) continue;
        await this.supervisor.stop(id);
        this.#loaded.delete(id);
        removed.push(current);
      }
      for (const id of targets.keys()) {
        this.#errors.delete(id);
        this.#firstSeen.delete(id);
      }
    } catch (error) {
      const rollbackErrors = [];
      for (const current of removed.reverse()) {
        try {
          await this.supervisor.start(current.entry, current.definition);
          this.#loaded.set(current.entry.id, current);
        } catch (rollbackError) {
          rollbackErrors.push(rollbackError);
        }
      }
      for (const { id, previous } of changed.reverse()) {
        try {
          await this.supervisor.replace(id, previous.entry, previous.definition);
          this.#loaded.set(id, previous);
        } catch (rollbackError) {
          rollbackErrors.push(rollbackError);
        }
      }
      for (const id of added.reverse()) {
        try {
          await this.supervisor.stop(id);
          this.#loaded.delete(id);
        } catch (rollbackError) {
          rollbackErrors.push(rollbackError);
        }
      }
      for (const id of targets.keys()) this.#errors.set(id, message(error));
      if (rollbackErrors.length > 0) {
        throw new AggregateError(
          [error, ...rollbackErrors],
          "Fabric component transaction and rollback failed"
        );
      }
      throw error;
    }
  }
};

// src/core/compact-controller.ts
var DEFAULT_REQUESTED_BY = "model";
var isString = (value) => typeof value === "string" && value.length > 0;
var checkedPreserve = (value) => {
  if (value === void 0) return void 0;
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error("compact preserve must be an array of strings");
  }
  return [...value];
};
var CompactController = class {
  #pending;
  #last;
  #inFlight;
  #hooks;
  constructor(hooks = {}) {
    this.#hooks = hooks;
  }
  // Record a pending compaction intent. A single slot: a new request replaces
  // any pending one, keeping the latest instructions.
  request(intent) {
    const preserve = checkedPreserve(intent.preserve);
    const request = {
      ...intent.instructions !== void 0 ? { instructions: intent.instructions } : {},
      ...preserve !== void 0 ? { preserve } : {}
    };
    const boundsError = compactionRequestBoundsError(request);
    if (boundsError) throw new Error(boundsError.message);
    if (preserve !== void 0) encodeCompactionRequest(request);
    const pending = {
      requestedBy: isString(intent.requestedBy) ? intent.requestedBy : DEFAULT_REQUESTED_BY,
      requestedAt: Date.now(),
      ...isString(intent.reason) ? { reason: intent.reason } : {},
      ...isString(intent.instructions) ? { instructions: intent.instructions } : {},
      ...preserve !== void 0 ? { preserve } : {}
    };
    this.#pending = pending;
    this.#hooks.onRequest?.(pending);
    return pending;
  }
  // Clear a pending intent without committing. Safe to call when nothing is
  // pending.
  cancel() {
    this.#pending = void 0;
  }
  status() {
    return {
      ...this.#pending ? { pending: this.#pending } : {},
      ...this.#last ? { last: this.#last } : {}
    };
  }
  // Commit the pending intent at a safe boundary. Called and awaited from the
  // host `agent_settled` event so Pi cannot publish its public settled event
  // until the callback-based compaction API has completed or failed.
  async maybeCommit(context) {
    if (this.#inFlight) return this.#inFlight;
    const pending = this.#pending;
    if (!pending) return;
    const requestedBy = pending.requestedBy;
    const instructions = pending.preserve ? encodeCompactionRequest({
      ...pending.instructions !== void 0 ? { instructions: pending.instructions } : {},
      preserve: pending.preserve
    }) : pending.instructions;
    const committing = pending;
    const clearCommittedIntent = () => {
      if (this.#pending === committing) this.#pending = void 0;
    };
    let settle;
    const completion = new Promise((resolve2) => {
      settle = resolve2;
    });
    this.#inFlight = completion;
    let callbackSettled = false;
    const finish = (apply) => {
      if (callbackSettled) return;
      callbackSettled = true;
      try {
        apply();
      } finally {
        settle();
      }
    };
    try {
      if (context.signal?.aborted) {
        finish(() => {
          this.#last = {
            at: Date.now(),
            requestedBy,
            status: "failed",
            error: "Compaction aborted before it started"
          };
          clearCommittedIntent();
          this.#hooks.onCommit?.(this.#last);
        });
      } else {
        context.compact({
          ...instructions ? { customInstructions: instructions } : {},
          onComplete: (result) => finish(() => {
            this.#last = {
              at: Date.now(),
              requestedBy,
              status: "committed",
              summary: result.summary,
              tokensBefore: result.tokensBefore,
              ...result.estimatedTokensAfter !== void 0 ? { estimatedTokensAfter: result.estimatedTokensAfter } : {}
            };
            clearCommittedIntent();
            this.#hooks.onCommit?.(this.#last);
          }),
          onError: (error) => finish(() => {
            const message2 = error?.message ?? "Compaction error";
            clearCommittedIntent();
            const cancelled = message2 === "Compaction cancelled" || message2 === "Already compacted";
            this.#last = {
              at: Date.now(),
              requestedBy,
              status: cancelled ? "cancelled" : "failed",
              error: message2
            };
            this.#hooks.onCommit?.(this.#last);
          })
        });
      }
      await completion;
    } catch (error) {
      finish(() => {
        this.#last = {
          at: Date.now(),
          requestedBy,
          status: "failed",
          error: error instanceof Error ? error.message : "Compaction failed to start"
        };
        clearCommittedIntent();
        this.#hooks.onCommit?.(this.#last);
      });
      await completion;
    } finally {
      if (this.#inFlight === completion) this.#inFlight = void 0;
    }
  }
};

// src/core/tool-result-proxy.ts
var nativeLifecycleProviders = /* @__PURE__ */ new Set(["pi", "extensions"]);
var textFromContent = (content) => content.filter((part) => part.type === "text").map((part) => part.text).join("\n");
var textForValue = (value) => {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
};
var valueFromContent = (content) => {
  if (content.every((part) => part.type === "text")) return textFromContent(content);
  return { content };
};
var FabricToolResultProxy = class {
  constructor(runner) {
    this.runner = runner;
  }
  async proxy(request) {
    if (nativeLifecycleProviders.has(request.action.provider)) return request.value;
    const runner = this.runner();
    if (!runner) return request.value;
    const content = [{ type: "text", text: textForValue(request.value) }];
    const details = {
      kind: FABRIC_TOOL_RESULT_PROXY_KIND,
      ref: request.action.ref,
      result: request.value
    };
    const patch = await runAbortable(request.signal, () => runner.emitToolResult({
      type: "tool_result",
      toolName: request.action.ref,
      toolCallId: request.toolCallId,
      input: request.args,
      content,
      details,
      isError: false
    }));
    if (!patch) return request.value;
    const patchedContent = patch.content ?? content;
    if (patch.isError === true) {
      throw new Error(
        textFromContent(patchedContent).trim() || `Fabric result middleware marked ${request.action.ref} as failed.`
      );
    }
    const patchedDetails = readFabricToolResultProxyDetailsV1(patch.details);
    if (patchedDetails?.ref === request.action.ref && !Object.is(patchedDetails.result, request.value)) {
      return patchedDetails.result;
    }
    if (patchedContent !== content) return valueFromContent(patchedContent);
    return request.value;
  }
};

// src/runtime/orchestration.ts
var BLOCKING_ORCHESTRATION_REFS = /* @__PURE__ */ new Set([
  "agents.run",
  "agents.wait",
  "agents.ask"
]);
var isBlockingOrchestrationRef = (ref) => BLOCKING_ORCHESTRATION_REFS.has(ref);
var ORCHESTRATION_RE = /\b(?:workflow\.agent|agents\.(?:run|wait|ask)|council\.run|rlm\.query)\s*\(|(?<!\.)\bagent\s*(?:<[^<>]*>)?\s*\(/;
var codeUsesOrchestration = (code) => ORCHESTRATION_RE.test(code);

// src/execution-service.ts
var runtimeDependencies;
var loadRuntimeDependencies = () => runtimeDependencies ??= Promise.all([
  import("./quickjs-runtime-FOWHLNEM.js"),
  import("./node-process-runtime-DSEXYWUJ.js"),
  import("./type-checker-Q5AEOKB3.js"),
  import("./guest-types-FI7XQA3C.js"),
  import("./dynamic-guest-types-SVPB5XE7.js"),
  import("./core-override-guest-types-REGZNDGG.js")
]).then(([quickjs, nodeProcess, checker, guest, dynamicGuest, coreOverrides]) => ({
  QuickJsRuntime: quickjs.QuickJsRuntime,
  NodeProcessRuntime: nodeProcess.NodeProcessRuntime,
  BunProcessRuntime: nodeProcess.BunProcessRuntime,
  typeCheckFabricCode: checker.typeCheckFabricCode,
  guestTypeDeclarations: guest.guestTypeDeclarations,
  buildDynamicGuestDeclarations: dynamicGuest.buildDynamicGuestDeclarations,
  buildCoreOverrideGuestDeclarations: coreOverrides.buildCoreOverrideGuestDeclarations
}));
var executionOutcomeFromTermination = (reason) => {
  switch (reason) {
    case "completed":
      return "succeeded";
    case "aborted":
      return "aborted";
    case "timed_out":
      return "timed_out";
    case "runtime_error":
      return "failed";
  }
};
var aggregateUsage = (usages) => ({
  input: usages.reduce((total, usage) => total + usage.input, 0),
  output: usages.reduce((total, usage) => total + usage.output, 0),
  cacheRead: usages.reduce((total, usage) => total + usage.cacheRead, 0),
  cacheWrite: usages.reduce((total, usage) => total + usage.cacheWrite, 0),
  ...usages.some((usage) => usage.cacheWrite1h !== void 0) ? { cacheWrite1h: usages.reduce((total, usage) => total + (usage.cacheWrite1h ?? 0), 0) } : {},
  ...usages.some((usage) => usage.reasoning !== void 0) ? { reasoning: usages.reduce((total, usage) => total + (usage.reasoning ?? 0), 0) } : {},
  totalTokens: usages.reduce((total, usage) => total + usage.totalTokens, 0),
  cost: {
    input: usages.reduce((total, usage) => total + usage.cost.input, 0),
    output: usages.reduce((total, usage) => total + usage.cost.output, 0),
    cacheRead: usages.reduce((total, usage) => total + usage.cost.cacheRead, 0),
    cacheWrite: usages.reduce((total, usage) => total + usage.cost.cacheWrite, 0),
    total: usages.reduce((total, usage) => total + usage.cost.total, 0)
  }
});
var FabricExecutionService = class {
  constructor(registry, config, activity, authorizer, autoApprovalClassifier = new FabricAutoApprovalClassifier(), sessionApprovals = new FabricSessionApprovals(), capturedTools) {
    this.registry = registry;
    this.config = config;
    this.activity = activity;
    this.authorizer = authorizer;
    this.autoApprovalClassifier = autoApprovalClassifier;
    this.sessionApprovals = sessionApprovals;
    this.capturedTools = capturedTools;
  }
  #runtime;
  #runtimeKind;
  #capabilityView;
  setCapabilityView(view) {
    this.#capabilityView = view;
  }
  async execute(options) {
    const startedAt = performance.now();
    const traceRecorder = new FabricExecutionTraceRecorder();
    this.activity?.start(
      options.parentToolCallId,
      options.display,
      options.display?.name?.trim() ? void 0 : fabricExecTitleHintCached(options.code)
    );
    const dependencies = await loadRuntimeDependencies();
    const effectiveFullCodeMode = this.config.fullCodeMode || this.config.schema.mode === "enforce";
    const unavailable = new Map(
      this.registry.unavailableProviders().map((entry) => [entry.name, entry.reason])
    );
    const guestTypeSources = await this.registry.guestTypeSources({
      cwd: options.context.cwd,
      signal: options.signal,
      parentToolCallId: options.parentToolCallId,
      nestedToolCallId: `${options.parentToolCallId}_typedecls`,
      extensionContext: options.context,
      update() {
      },
      ...this.#capabilityView ? { capabilityView: this.#capabilityView } : {}
    });
    const coreOverrideDeclarations = effectiveFullCodeMode ? dependencies.buildCoreOverrideGuestDeclarations(
      this.capturedTools?.list().map((entry) => ({
        name: entry.name,
        inputSchema: entry.definition.parameters
      })) ?? []
    ) : void 0;
    const code = repairFabricGuestCode(options.code);
    const checked = dependencies.typeCheckFabricCode(
      code,
      dependencies.guestTypeDeclarations(effectiveFullCodeMode, {
        excludeGlobals: [...unavailable.keys()],
        dynamic: dependencies.buildDynamicGuestDeclarations(guestTypeSources),
        ...coreOverrideDeclarations ? { coreOverrides: coreOverrideDeclarations } : {}
      })
    );
    if (checked.errors.length > 0) {
      for (const error of checked.errors) {
        const missing = /^Cannot find name '([^']+)'/.exec(error.message);
        const reason = missing?.[1] ? unavailable.get(missing[1]) : void 0;
        if (missing && reason) {
          error.message = `${error.message} Fabric provider "${missing[1]}" is unavailable: ${reason}`;
        }
      }
      this.activity?.finish(options.parentToolCallId, false, "Type checking failed");
      return {
        success: false,
        value: void 0,
        logs: [],
        audits: [],
        phases: [],
        trace: traceRecorder.seal(
          "failed",
          [],
          `Type checking failed (${checked.errors.length} ${checked.errors.length === 1 ? "error" : "errors"})`
        ),
        elapsedMs: performance.now() - startedAt,
        typeErrors: checked.errors
      };
    }
    const classifierUsages = [];
    const recordAutoDecision = (audit, decision) => {
      const operation = traceRecorder.issueCall("fabric.approval.auto", {
        action: audit.action,
        risk: audit.risk
      });
      operation.succeed(audit);
      if (decision) classifierUsages.push(decision.usage);
    };
    const approval = new ApprovalController(
      this.config.approvals,
      options.context,
      this.sessionApprovals,
      this.autoApprovalClassifier,
      recordAutoDecision
    );
    const audits = [];
    const phases = [];
    const workflowSpans = /* @__PURE__ */ new Map();
    let agentCalls = 0;
    let handoffRequest;
    const maxAgentCalls = Math.max(
      1,
      Math.min(
        options.maxAgentCalls ?? this.config.agents.maxPerExecution,
        this.config.agents.maxPerExecution
      )
    );
    const guardAgentCall = (ref) => {
      if (ref !== "agents.run" && ref !== "agents.handoff" && ref !== "agents.spawn" && ref !== "agents.create") return;
      agentCalls++;
      if (agentCalls > maxAgentCalls) {
        throw new FabricTraceSafeError(`Fabric agent budget exhausted (${maxAgentCalls} per execution)`);
      }
    };
    const fullCodeProvider = (value) => {
      const separator = value.indexOf(".");
      const provider = separator > 0 ? value.slice(0, separator) : value;
      return provider === "pi" || provider === "extensions" ? provider : void 0;
    };
    const guardFullCodeRef = (ref) => {
      if (effectiveFullCodeMode) return;
      const provider = fullCodeProvider(ref);
      if (!provider) return;
      throw new FabricTraceSafeError(
        `Fabric full code mode is disabled; call ${provider === "pi" ? "Pi core" : "registered extension"} tools directly outside fabric_exec`
      );
    };
    let currentProgress;
    let emitPending = false;
    let emitTimer;
    const emitNow = () => {
      emitPending = false;
      options.onPartial({
        audits: audits.slice(),
        phases: phases.slice(),
        progress: currentProgress
      });
    };
    const flushEmit = () => {
      if (emitTimer) clearTimeout(emitTimer);
      emitTimer = void 0;
      if (emitPending) emitNow();
    };
    const emit = () => {
      emitPending = true;
      const debounceMs = this.config.ui.updateDebounceMs;
      if (debounceMs <= 0) {
        flushEmit();
        return;
      }
      if (emitTimer) return;
      emitTimer = setTimeout(() => {
        emitTimer = void 0;
        if (emitPending) emitNow();
      }, debounceMs);
      emitTimer.unref?.();
    };
    const update = (message2) => {
      currentProgress = message2;
      emit();
    };
    const observeInvocation = (event) => {
      if (this.activity) {
        if (event.type === "call_start") {
          this.activity.beginCall(options.parentToolCallId, event);
        } else if (event.type === "call_update") {
          this.activity.updateCall(options.parentToolCallId, event.callId, event.update);
        } else if (event.type === "call_args") {
          this.activity.updateCallArgs(options.parentToolCallId, event.callId, event.args);
        } else {
          this.activity.finishCall(options.parentToolCallId, event.callId, event);
        }
      }
      if (event.type === "call_end") emit();
    };
    const baseContext = {
      cwd: options.context.cwd,
      signal: options.signal,
      parentToolCallId: options.parentToolCallId,
      nestedToolCallId: `${options.parentToolCallId}_metadata`,
      extensionContext: options.context,
      update,
      ...this.#capabilityView ? { capabilityView: this.#capabilityView } : {}
    };
    const orchestrationTimeoutMs = Math.max(
      this.config.executor.timeoutMs,
      this.config.agents.timeoutMs
    );
    const requestedTimeoutMs = typeof options.requestedTimeoutMs === "number" && Number.isFinite(options.requestedTimeoutMs) ? Math.max(1, Math.floor(options.requestedTimeoutMs)) : 0;
    const effectiveTimeoutMs = Math.max(
      codeUsesOrchestration(code) ? orchestrationTimeoutMs : this.config.executor.timeoutMs,
      Math.min(requestedTimeoutMs, this.config.executor.maxTimeoutMs)
    );
    const minimumTimeoutMsForHostCall = (ref, args) => {
      const targetRef = ref === "fabric.$call" && typeof args.ref === "string" ? args.ref : ref;
      const targetArgs = ref === "fabric.$call" && typeof args.args === "object" && args.args !== null && !Array.isArray(args.args) ? args.args : args;
      if (targetRef === "pi.bash") {
        const seconds = targetArgs.timeout;
        const milliseconds = targetArgs.timeoutMs;
        const requested = typeof seconds === "number" && Number.isFinite(seconds) ? seconds * 1e3 : typeof milliseconds === "number" && Number.isFinite(milliseconds) ? milliseconds : 0;
        if (requested > 0) {
          return Math.max(
            this.config.executor.timeoutMs,
            Math.min(Math.floor(requested) + 5e3, MAX_AGENT_TIMEOUT_MS)
          );
        }
      }
      const refFloor = this.config.executor.hostCallTimeouts[targetRef];
      if (refFloor !== void 0) {
        return Math.max(
          this.config.executor.timeoutMs,
          Math.min(Math.floor(refFloor), this.config.executor.maxTimeoutMs)
        );
      }
      if (!isBlockingOrchestrationRef(targetRef)) return void 0;
      const requestedTimeoutMs2 = targetRef === "agents.run" && typeof targetArgs.timeoutMs === "number" && Number.isFinite(targetArgs.timeoutMs) ? Math.max(
        MIN_AGENT_TIMEOUT_MS,
        Math.min(Math.floor(targetArgs.timeoutMs), MAX_AGENT_TIMEOUT_MS)
      ) : 0;
      return Math.max(orchestrationTimeoutMs, requestedTimeoutMs2);
    };
    const traceAttempt = async (ref, args, signal, run) => {
      const operation = traceRecorder.issueCall(ref, args);
      let stage = "invoke";
      try {
        const value = await run((nextStage) => {
          stage = nextStage;
        });
        operation.succeed(void 0);
        return value;
      } catch (error) {
        operation.fail(stage, error, executionOutcomeFromError(error, signal));
        throw error;
      }
    };
    const invokeAction = async (ref, args, callContext) => {
      const traceOperation = traceRecorder.issueCall(ref, args);
      try {
        guardFullCodeRef(ref);
        guardAgentCall(ref);
      } catch (error) {
        traceOperation.fail(
          "guard",
          error,
          executionOutcomeFromError(error, callContext.signal)
        );
        throw error;
      }
      return this.registry.invoke(ref, args, {
        ...callContext,
        ...ref === "agents.handoff" ? {
          deferHandoff(request) {
            if (handoffRequest) {
              throw new Error(
                "Only one agents.handoff request is allowed per fabric_exec invocation"
              );
            }
            handoffRequest = structuredClone(request);
            return {
              scheduled: true,
              status: "deferred",
              boundary: "fabric_exec_end"
            };
          }
        } : {},
        ...this.authorizer ? {
          authorize: (action) => this.authorizer.authorize(action.ref, options.parentToolCallId)
        } : {},
        approve: async (action, preparedArgs) => {
          if (action.ref === "schema.commit") {
            await approval.approve({ ...action, risk: "write" }, preparedArgs);
            await approval.approve({ ...action, risk: "execute" }, preparedArgs);
            return;
          }
          await approval.approve(action, preparedArgs);
        },
        audits,
        maxResultChars: this.config.executor.maxNestedResultChars,
        traceOperation,
        observeInvocation
      });
    };
    let sandboxResult;
    try {
      const runtimeKind = this.config.executor.runtime;
      if (!this.#runtime || this.#runtimeKind !== runtimeKind) {
        this.#runtime = runtimeKind === "node-process" ? new dependencies.NodeProcessRuntime() : runtimeKind === "bun-process" ? new dependencies.BunProcessRuntime() : new dependencies.QuickJsRuntime();
        this.#runtimeKind = runtimeKind;
      }
      sandboxResult = await this.#runtime.execute(
        code,
        async (ref, args, runtimeSignal) => {
          const callContext = { ...baseContext, signal: runtimeSignal };
          switch (ref) {
            case "fabric.$providers":
              return traceAttempt(
                "fabric.discovery.providers",
                args,
                runtimeSignal,
                () => this.registry.providers().filter(
                  (provider) => !callContext.capabilityView || Object.values(callContext.capabilityView.bindings).some((binding) => binding.provider === provider.name)
                ).filter(
                  (provider) => effectiveFullCodeMode || !fullCodeProvider(provider.name)
                )
              );
            case "fabric.$catalog":
              return traceAttempt(
                "fabric.discovery.catalog",
                args,
                runtimeSignal,
                async (setStage) => {
                  const provider = typeof args.provider === "string" ? args.provider : void 0;
                  setStage("guard");
                  if (provider) guardFullCodeRef(`${provider}.*`);
                  setStage(provider && !this.registry.has(provider) ? "resolve" : "invoke");
                  return this.registry.catalog(callContext, {
                    ...provider ? { provider } : {},
                    ...typeof args.limit === "number" ? { limit: args.limit } : {},
                    includeProvider: (name) => effectiveFullCodeMode || !fullCodeProvider(name)
                  });
                }
              );
            case "fabric.$models": {
              const operation = traceRecorder.issueCall("fabric.discovery.models", args);
              const registry = options.context.modelRegistry;
              try {
                const available = typeof registry?.getAvailable === "function" ? registry.getAvailable() : [];
                const models = available.map((model) => ({
                  provider: String(model.provider),
                  id: String(model.id),
                  name: String(model.name ?? model.id),
                  key: `${model.provider}/${model.id}`
                }));
                operation.succeed(void 0);
                return models;
              } catch (error) {
                operation.fail(
                  "invoke",
                  error,
                  executionOutcomeFromError(error, runtimeSignal)
                );
                return [];
              }
            }
            case "fabric.$list":
              return traceAttempt(
                "fabric.discovery.list",
                args,
                runtimeSignal,
                async (setStage) => {
                  setStage("guard");
                  if (typeof args.provider === "string") {
                    guardFullCodeRef(`${args.provider}.*`);
                  }
                  setStage(
                    typeof args.provider === "string" && !this.registry.has(args.provider) ? "resolve" : "invoke"
                  );
                  const actions = await this.registry.list(
                    {
                      ...typeof args.provider === "string" ? { provider: args.provider } : {},
                      ...typeof args.namespace === "string" ? { namespace: args.namespace } : {},
                      ...typeof args.query === "string" ? { query: args.query } : {},
                      ...typeof args.limit === "number" ? { limit: args.limit } : {}
                    },
                    callContext
                  );
                  return actions.filter(
                    (action) => effectiveFullCodeMode || !fullCodeProvider(action.provider)
                  );
                }
              );
            case "fabric.$search":
              return traceAttempt(
                "fabric.discovery.search",
                args,
                runtimeSignal,
                async () => {
                  const actions = await this.registry.search(
                    String(args.query ?? ""),
                    callContext,
                    typeof args.limit === "number" ? args.limit : void 0
                  );
                  return actions.filter(
                    (action) => effectiveFullCodeMode || !fullCodeProvider(action.provider)
                  );
                }
              );
            case "fabric.$describe":
              return traceAttempt(
                "fabric.discovery.describe",
                args,
                runtimeSignal,
                async (setStage) => {
                  const targetRef = String(args.ref ?? "");
                  setStage("guard");
                  guardFullCodeRef(targetRef);
                  setStage("resolve");
                  return this.registry.describe(targetRef, callContext);
                }
              );
            case "fabric.$call": {
              const callArgs = typeof args.args === "object" && args.args !== null && !Array.isArray(args.args) ? args.args : {};
              const targetRef = String(args.ref ?? "");
              return invokeAction(targetRef, callArgs, callContext);
            }
            case "fabric.$progress":
              return traceAttempt(
                "fabric.workflow.progress",
                args,
                runtimeSignal,
                () => update(String(args.message ?? "Working"))
              );
            case "fabric.$configure":
              return traceAttempt(
                "fabric.workflow.configure",
                args,
                runtimeSignal,
                () => {
                  const display = {
                    ...typeof args.name === "string" ? { name: args.name } : {},
                    ...typeof args.description === "string" ? { description: args.description } : {}
                  };
                  return this.activity?.configure(options.parentToolCallId, display) ?? display;
                }
              );
            case "fabric.$phase":
              return traceAttempt(
                "fabric.workflow.phase",
                args,
                runtimeSignal,
                (setStage) => {
                  setStage("validate");
                  const name = typeof args.name === "string" ? args.name.trim() : "";
                  if (!name) throw new Error("Workflow phase name must be a non-empty string");
                  phases.push(name);
                  const phaseIndex = phases.length - 1;
                  const phaseInput = {
                    name,
                    ...typeof args.id === "string" ? { id: args.id } : {},
                    ...typeof args.description === "string" ? { description: args.description } : {},
                    ...typeof args.total === "number" ? { total: args.total } : {}
                  };
                  setStage("invoke");
                  const activityPhase = this.activity?.phase(options.parentToolCallId, phaseInput);
                  update(`Phase: ${name}`);
                  return {
                    name,
                    index: phaseIndex,
                    ...activityPhase ? { id: activityPhase.id } : {}
                  };
                }
              );
            case "fabric.$item":
              return traceAttempt(
                "fabric.workflow.item",
                args,
                runtimeSignal,
                () => {
                  const item = args;
                  return this.activity?.upsertItem(options.parentToolCallId, item) ?? item;
                }
              );
            case "fabric.$event":
              return traceAttempt(
                "fabric.workflow.event",
                args,
                runtimeSignal,
                () => {
                  const event = args;
                  this.activity?.event(options.parentToolCallId, event);
                }
              );
            case "fabric.$spanStart": {
              const id = typeof args.id === "string" ? args.id : "";
              const kind = args.kind;
              if (!id || kind !== "parallel" && kind !== "pipeline") {
                throw new Error("Invalid internal workflow span start");
              }
              if (workflowSpans.has(id)) throw new Error("Duplicate internal workflow span");
              const operation = traceRecorder.issueCall(`fabric.workflow.${kind}`, args);
              workflowSpans.set(id, { kind, operation });
              return void 0;
            }
            case "fabric.$spanEnd": {
              const id = typeof args.id === "string" ? args.id : "";
              const span = workflowSpans.get(id);
              if (!span) throw new Error("Unknown internal workflow span");
              workflowSpans.delete(id);
              if (args.outcome === "succeeded") span.operation.succeed(void 0);
              else {
                span.operation.fail(
                  "invoke",
                  void 0,
                  executionOutcomeFromError(new Error("Workflow span failed"), runtimeSignal)
                );
              }
              return void 0;
            }
            default:
              return invokeAction(ref, args, callContext);
          }
        },
        {
          timeoutMs: effectiveTimeoutMs,
          memoryLimitBytes: this.config.executor.memoryLimitBytes,
          maxLogChars: this.config.executor.maxOutputChars,
          minimumTimeoutMsForHostCall,
          ...checked.javascript ? { transpiledCode: checked.javascript } : {},
          ...checked.sourceMap ? { transpiledSourceMap: checked.sourceMap } : {},
          ...options.strings ? { strings: options.strings } : {},
          ...options.tokenBudget !== void 0 ? { tokenBudget: options.tokenBudget } : {},
          ...options.signal ? { signal: options.signal } : {}
        }
      );
    } catch (error) {
      const message2 = error instanceof Error ? error.message : String(error);
      this.activity?.finish(options.parentToolCallId, false, message2);
      throw error;
    } finally {
      await this.registry.endInvocation(options.parentToolCallId);
      flushEmit();
    }
    const runOutcome = executionOutcomeFromTermination(sandboxResult.terminationReason);
    const succeeded = runOutcome === "succeeded";
    this.activity?.finish(options.parentToolCallId, succeeded, sandboxResult.error);
    return {
      success: succeeded,
      value: sandboxResult.value,
      logs: sandboxResult.logs,
      audits,
      phases,
      // Guest and provider error text may embed tool output or source
      // literals, so the durable trace records only safe causes.
      trace: traceRecorder.seal(runOutcome, phases),
      elapsedMs: performance.now() - startedAt,
      ...sandboxResult.error ? { error: sandboxResult.error } : {},
      ...handoffRequest ? { handoffRequest } : {},
      ...classifierUsages.length > 0 ? { usage: aggregateUsage(classifierUsages) } : {}
    };
  }
};

// src/repairs/apply.ts
var strictDeclaredPropertyNames = (schema) => {
  if (schema.type !== "object" || schema.additionalProperties !== false || schema.patternProperties !== void 0) {
    return void 0;
  }
  const properties = schema.properties;
  if (!properties || typeof properties !== "object" || Array.isArray(properties)) return void 0;
  return Object.keys(properties);
};
var applyKeyAliasRepairs = (ref, args, repairs, schema) => {
  const declared = strictDeclaredPropertyNames(schema);
  if (!declared) return { args, changed: false };
  const declaredSet = new Set(declared);
  const applicable = repairs.filter(
    (repair) => repair.kind === "keyAlias" && repair.ref === ref && repair.from in args && repair.from !== repair.to && !declaredSet.has(repair.from) && declaredSet.has(repair.to) && uniqueDeclaredKeyForSpelling(repair.from, declared) === repair.to
  );
  const sourceCountByTarget = /* @__PURE__ */ new Map();
  for (const repair of applicable) {
    sourceCountByTarget.set(repair.to, (sourceCountByTarget.get(repair.to) ?? 0) + 1);
  }
  let out = args;
  let changed = false;
  for (const repair of applicable) {
    const canonicalPresent = repair.to in args;
    if (!canonicalPresent && sourceCountByTarget.get(repair.to) !== 1) continue;
    if (out === args) out = { ...args };
    if (!(repair.to in out)) out[repair.to] = out[repair.from];
    delete out[repair.from];
    changed = true;
  }
  return { args: out, changed };
};
var applyActionAliasRepairs = (provider, actionName, repairs, declared) => {
  if (declared.includes(actionName)) return void 0;
  const liveTarget = repairActionName(declared, actionName).repaired;
  if (!liveTarget) return void 0;
  for (const repair of repairs) {
    if (repair.kind !== "actionAlias") continue;
    if (repair.provider !== provider) continue;
    if (repair.from !== actionName) continue;
    if (repair.to !== liveTarget) continue;
    return repair.to;
  }
  return void 0;
};
var applyCatalogArgRepairs = (ref, args, repairs, schema) => applyKeyAliasRepairs(ref, args, repairs, schema);

// src/repairs/catalog-digest.ts
var catalogDigestFromSurface = (surface) => stableJsonHash({
  v: 1,
  providers: [...surface.providers].sort(),
  captured: [...surface.capturedTools].sort()
});

// src/repairs/promote.ts
var keyAliasCandidate = (ref, extraKeys, declared) => {
  if (extraKeys.length !== 1) return void 0;
  const from = extraKeys[0];
  const to = uniqueDeclaredKeyForSpelling(from, declared);
  if (!to) return void 0;
  return { kind: "keyAlias", ref, from, to };
};
var actionAliasCandidate = (provider, actionName, declared) => {
  const repair = repairActionName(declared, actionName);
  if (!repair.repaired || repair.repaired === actionName) return void 0;
  return {
    kind: "actionAlias",
    provider,
    from: actionName,
    to: repair.repaired
  };
};

// src/repairs/store.ts
import { randomUUID as randomUUID2 } from "node:crypto";
import fs2 from "node:fs";
import path2 from "node:path";

// src/repairs/types.ts
var REPAIR_TABLE_VERSION = 1;
var MAX_CATALOG_REPAIRS = 256;
var repairIdentity = (repair) => {
  if (repair.kind === "keyAlias") {
    return `keyAlias:${repair.ref}:${repair.from}:${repair.to}`;
  }
  return `actionAlias:${repair.provider}:${repair.from}:${repair.to}`;
};
var emptyRepairTable = (catalogDigest, now = (/* @__PURE__ */ new Date()).toISOString()) => ({
  version: REPAIR_TABLE_VERSION,
  catalogDigest,
  repairs: [],
  createdAt: now,
  updatedAt: now
});

// src/repairs/store.ts
var REPAIR_LOCK_ATTEMPTS = 50;
var REPAIR_LOCK_DELAY_MS = 5;
var REPAIR_STALE_LOCK_MS = 3e4;
var repairsDirectory = (agentDir) => path2.join(agentDir, "fabric", "repairs");
var currentPath = (directory) => path2.join(directory, "current.json");
var lockPath = (directory) => path2.join(directory, "current.lock");
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var errorCode = (error) => isRecord(error) && typeof error.code === "string" ? error.code : void 0;
var sleepSync = (() => {
  try {
    const buffer = new Int32Array(new SharedArrayBuffer(4));
    return (ms) => {
      Atomics.wait(buffer, 0, 0, ms);
    };
  } catch {
    return () => void 0;
  }
})();
var parseRepair = (value) => {
  if (!isRecord(value) || typeof value.kind !== "string") return void 0;
  if (value.kind === "keyAlias") {
    if (typeof value.ref !== "string" || typeof value.from !== "string" || typeof value.to !== "string" || !value.ref.trim() || !value.from.trim() || !value.to.trim()) {
      return void 0;
    }
    return { kind: "keyAlias", ref: value.ref.trim(), from: value.from.trim(), to: value.to.trim() };
  }
  if (value.kind === "actionAlias") {
    if (typeof value.provider !== "string" || typeof value.from !== "string" || typeof value.to !== "string" || !value.provider.trim() || !value.from.trim() || !value.to.trim()) {
      return void 0;
    }
    return {
      kind: "actionAlias",
      provider: value.provider.trim(),
      from: value.from.trim(),
      to: value.to.trim()
    };
  }
  return "skip";
};
var parseRepairTable = (value) => {
  if (!isRecord(value) || value.version !== REPAIR_TABLE_VERSION) return void 0;
  if (typeof value.catalogDigest !== "string" || !value.catalogDigest.trim()) return void 0;
  if (!Array.isArray(value.repairs) || value.repairs.length > MAX_CATALOG_REPAIRS) return void 0;
  const repairs = [];
  const identities = /* @__PURE__ */ new Set();
  for (const entry of value.repairs) {
    const parsed = parseRepair(entry);
    if (parsed === "skip") continue;
    if (!parsed) return void 0;
    const identity = repairIdentity(parsed);
    if (identities.has(identity)) continue;
    identities.add(identity);
    repairs.push(parsed);
  }
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return void 0;
  return {
    version: REPAIR_TABLE_VERSION,
    catalogDigest: value.catalogDigest.trim(),
    repairs,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt
  };
};
var errorText = (error) => (error instanceof Error ? error.message : String(error)).slice(0, 200);
var writeTable = (file, table) => {
  writeJsonAtomic(file, table, { space: 2, newline: true, mode: 384, dirMode: 448 });
};
var processAlive = (pid) => {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};
var reapStaleLock = (lock, verify) => {
  const claim = `${lock}.reap-${process.pid}-${randomUUID2()}`;
  try {
    fs2.renameSync(lock, claim);
  } catch {
    return false;
  }
  if (!verify(claim)) {
    try {
      fs2.renameSync(claim, lock);
    } catch {
      if (verify(claim)) fs2.rmSync(claim, { recursive: true, force: true });
    }
    return false;
  }
  fs2.rmSync(claim, { recursive: true, force: true });
  return true;
};
var withRepairLock = (directory, operation) => {
  fs2.mkdirSync(directory, { recursive: true, mode: 448 });
  const lock = lockPath(directory);
  const ownerPath = path2.join(lock, "owner");
  const token = randomUUID2();
  let acquired = false;
  for (let attempt = 0; attempt < REPAIR_LOCK_ATTEMPTS; attempt++) {
    try {
      fs2.mkdirSync(lock, { mode: 448 });
      try {
        fs2.writeFileSync(ownerPath, `${token}
${process.pid}
${Date.now()}
`, {
          encoding: "utf8",
          mode: 384
        });
      } catch (error) {
        fs2.rmSync(lock, { recursive: true, force: true });
        throw error;
      }
      acquired = true;
      break;
    } catch (error) {
      if (errorCode(error) !== "EEXIST") throw error;
      try {
        const firstOwner = fs2.readFileSync(ownerPath, "utf8");
        const [, pidText, createdText] = firstOwner.trim().split("\n");
        const stale = Date.now() - Number(createdText) > REPAIR_STALE_LOCK_MS;
        if (stale && !processAlive(Number(pidText))) {
          const secondOwner = fs2.readFileSync(ownerPath, "utf8");
          if (secondOwner === firstOwner && reapStaleLock(lock, (claimed) => {
            try {
              const owner = fs2.readFileSync(path2.join(claimed, "owner"), "utf8");
              const [, pid, created] = owner.trim().split("\n");
              return Date.now() - Number(created) > REPAIR_STALE_LOCK_MS && !processAlive(Number(pid));
            } catch {
              return false;
            }
          })) {
            continue;
          }
        }
      } catch {
        try {
          const first = fs2.statSync(lock);
          if (Date.now() - first.mtimeMs > REPAIR_STALE_LOCK_MS && reapStaleLock(lock, (claimed) => {
            try {
              return Date.now() - fs2.statSync(claimed).mtimeMs > REPAIR_STALE_LOCK_MS;
            } catch {
              return false;
            }
          })) {
            continue;
          }
        } catch {
        }
      }
      if (attempt === REPAIR_LOCK_ATTEMPTS - 1) break;
      sleepSync(REPAIR_LOCK_DELAY_MS);
    }
  }
  if (!acquired) throw new Error("Timed out waiting for the Fabric repair table lock");
  try {
    return operation();
  } finally {
    try {
      const owner = fs2.readFileSync(ownerPath, "utf8");
      if (owner.startsWith(`${token}
`)) {
        fs2.rmSync(lock, { recursive: true, force: true });
      }
    } catch {
    }
  }
};
var loadRepairTable = (directory, catalogDigest) => {
  const file = currentPath(directory);
  let raw;
  try {
    raw = fs2.readFileSync(file, "utf8");
  } catch (error) {
    if (errorCode(error) === "ENOENT") return { table: emptyRepairTable(catalogDigest) };
    return {
      table: emptyRepairTable(catalogDigest),
      error: `repair table is unreadable: ${errorText(error)}`
    };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { table: emptyRepairTable(catalogDigest), error: "repair table is malformed JSON" };
  }
  const table = parseRepairTable(parsed);
  if (!table) {
    return { table: emptyRepairTable(catalogDigest), error: "repair table is invalid" };
  }
  if (table.catalogDigest !== catalogDigest) return { table: emptyRepairTable(catalogDigest) };
  return { table };
};
var saveRepairTable = (directory, table) => withRepairLock(directory, () => {
  const loaded = loadRepairTable(directory, table.catalogDigest);
  if (loaded.error) throw new Error(loaded.error);
  const persisted = loaded.table;
  const repairs = [];
  const identities = /* @__PURE__ */ new Set();
  for (const repair of [...persisted.repairs, ...table.repairs]) {
    const identity = repairIdentity(repair);
    if (identities.has(identity)) continue;
    if (repairs.length >= MAX_CATALOG_REPAIRS) break;
    identities.add(identity);
    repairs.push(repair);
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const merged = {
    version: REPAIR_TABLE_VERSION,
    catalogDigest: table.catalogDigest,
    repairs,
    createdAt: persisted.repairs.length > 0 ? persisted.createdAt : table.createdAt,
    updatedAt: now
  };
  writeTable(currentPath(directory), merged);
  return merged;
});

// src/repairs/compiler.ts
var errorMessage3 = (error) => (error instanceof Error ? error.message : String(error)).slice(0, 240);
var RepairCompiler = class {
  directory;
  enabled;
  #digest = "";
  #table;
  #counts = /* @__PURE__ */ new Map();
  #applyHits = 0;
  #invocationErrors = 0;
  #effectDropped = 0;
  #storeError;
  constructor(options) {
    this.directory = repairsDirectory(options.agentDir);
    this.enabled = options.enabled !== false;
    this.#table = emptyRepairTable("");
  }
  get catalogDigest() {
    return this.#digest;
  }
  get repairs() {
    return this.#table.repairs;
  }
  setCatalogSurface(surface) {
    const digest3 = catalogDigestFromSurface(surface);
    if (digest3 === this.#digest && this.#table.catalogDigest === digest3) return;
    this.#digest = digest3;
    if (!this.enabled) {
      this.#table = emptyRepairTable(digest3);
      this.#storeError = void 0;
    } else {
      const loaded = loadRepairTable(this.directory, digest3);
      this.#table = loaded.table;
      this.#storeError = loaded.error;
    }
    this.#counts.clear();
  }
  observe(classification, options) {
    if (classification.stage === "effect") {
      this.#effectDropped += 1;
      return void 0;
    }
    if (options?.countError !== false) this.#invocationErrors += 1;
    const existing = this.#counts.get(classification.fingerprint);
    const candidate = classification.candidate ?? existing?.candidate;
    const next = {
      stage: classification.stage,
      count: (existing?.count ?? 0) + 1,
      ...candidate ? { candidate } : {}
    };
    this.#counts.set(classification.fingerprint, next);
    if (!this.enabled || !next.candidate) return void 0;
    return this.#promote(next.candidate);
  }
  recordInvocationError() {
    this.#invocationErrors += 1;
  }
  observeInvalidArgs(ref, args, declared, message2, options) {
    const extra = options?.extraKeys ?? Object.keys(args).filter((key) => !declared.includes(key));
    const candidate = keyAliasCandidate(ref, extra, declared);
    return this.observe(
      {
        stage: "invocation_args",
        fingerprint: extra[0] ? `args:${ref}:${extra[0]}` : `args:${ref}:${message2.slice(0, 80)}`,
        ...candidate ? { candidate } : {}
      },
      options
    );
  }
  observeUnknownAction(provider, actionName, declared, options) {
    const candidate = actionAliasCandidate(provider, actionName, declared);
    return this.observe(
      {
        stage: "invocation_unknown_action",
        fingerprint: `unknown:${provider}.${actionName}`,
        ...candidate ? { candidate } : {}
      },
      options
    );
  }
  applyArgs(ref, args, schema) {
    if (!this.enabled || this.#table.repairs.length === 0) return args;
    const result = applyCatalogArgRepairs(ref, args, this.#table.repairs, schema);
    if (result.changed) this.#applyHits += 1;
    return result.args;
  }
  applyActionName(provider, actionName, declared) {
    if (!this.enabled || this.#table.repairs.length === 0) return actionName;
    const repaired = applyActionAliasRepairs(
      provider,
      actionName,
      this.#table.repairs,
      declared
    );
    if (repaired && repaired !== actionName) {
      this.#applyHits += 1;
      return repaired;
    }
    return actionName;
  }
  status() {
    const fingerprints = [...this.#counts.entries()].map(([fingerprint, state]) => ({
      fingerprint,
      stage: state.stage,
      count: state.count
    })).sort((left, right) => right.count - left.count || left.fingerprint.localeCompare(right.fingerprint)).slice(0, 20);
    return {
      enabled: this.enabled,
      catalogDigest: this.#digest,
      repairCount: this.#table.repairs.length,
      applyHits: this.#applyHits,
      invocationErrors: this.#invocationErrors,
      effectDropped: this.#effectDropped,
      ...this.#storeError ? { storeError: this.#storeError } : {},
      fingerprints,
      repairs: [...this.#table.repairs]
    };
  }
  #promote(candidate) {
    if (!this.#digest) return void 0;
    const identity = repairIdentity(candidate);
    if (this.#table.repairs.some((repair) => repairIdentity(repair) === identity)) {
      if (this.#storeError) this.#persist(this.#table);
      return void 0;
    }
    if (this.#table.repairs.length >= MAX_CATALOG_REPAIRS) return void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const next = {
      ...this.#table,
      catalogDigest: this.#digest || this.#table.catalogDigest,
      repairs: [...this.#table.repairs, candidate],
      updatedAt: now,
      createdAt: this.#table.createdAt || now
    };
    const saved = this.#persist(next);
    if (!saved) return candidate;
    return saved.repairs.some((repair) => repairIdentity(repair) === identity) ? candidate : void 0;
  }
  #persist(table) {
    try {
      this.#table = saveRepairTable(this.directory, table);
      this.#storeError = void 0;
      return this.#table;
    } catch (error) {
      this.#table = table;
      this.#storeError = errorMessage3(error);
      return void 0;
    }
  }
};

// src/speculation/eligibility.ts
var TIER_A_SPECULATION_REFS = /* @__PURE__ */ new Set([
  "pi.read",
  "pi.grep",
  "pi.find",
  "pi.ls",
  "memory.recall",
  "memory.expand",
  "memory.sessions",
  "state.get",
  "state.history",
  "state.complexity",
  "schema.status",
  "compact.status",
  "components.list",
  "components.status",
  "components.graph"
]);
var mcpAllowlistMatch = (refWithoutProvider, allowlist) => {
  for (const pattern of allowlist) {
    if (pattern.endsWith(".*")) {
      if (refWithoutProvider.startsWith(`${pattern.slice(0, -2)}.`)) return true;
    } else if (pattern === refWithoutProvider) {
      return true;
    }
  }
  return false;
};
var isSpeculationEligible = (action, mcpAllowlist) => {
  if (TIER_A_SPECULATION_REFS.has(action.ref)) {
    return action.risk === "read" && action.effectKind === "none";
  }
  if (action.provider !== "mcp" || action.risk !== "network") return false;
  if (mcpAllowlist.length === 0) return false;
  if (!mcpAllowlistMatch(action.ref.slice("mcp.".length), mcpAllowlist)) return false;
  if (action.annotations?.destructiveHint === true) return false;
  if (action.annotations && action.annotations.readOnlyHint === false) return false;
  return true;
};

// src/speculation/freshness.ts
import fs3 from "node:fs";
import path3 from "node:path";
var statSignature = (filePath) => {
  try {
    const stats = fs3.statSync(filePath);
    return { mtimeMs: stats.mtimeMs, size: stats.size };
  } catch (error) {
    const code = error instanceof Error && "code" in error ? error.code : void 0;
    return code === "ENOENT" || code === "ENOTDIR" ? "missing" : "error";
  }
};
var signatureEquals = (left, right) => left === "missing" || right === "missing" ? left === right : left.mtimeMs === right.mtimeMs && left.size === right.size;
var readFreshness = (args, cwd) => {
  const target = args.path;
  if (typeof target !== "string" || target.length === 0) return void 0;
  const resolved = path3.resolve(cwd, target);
  const snapshot = statSignature(resolved);
  if (snapshot === "error") return void 0;
  return () => {
    const current = statSignature(resolved);
    return current !== "error" && signatureEquals(snapshot, current);
  };
};
var createFreshnessChecker = (ref, preparedArgs, cwd) => {
  if (ref === "pi.read") return readFreshness(preparedArgs, cwd);
  return void 0;
};

// src/speculation/store.ts
var FabricSpeculationStore = class _FabricSpeculationStore {
  #epoch = 0;
  #entries = /* @__PURE__ */ new Map();
  #stats = {
    launched: 0,
    served: 0,
    epochInvalidated: 0,
    freshnessInvalidated: 0,
    failed: 0,
    wasted: 0,
    skipped: 0
  };
  #maxConcurrent;
  #maxEntries;
  #entryTtlMs;
  constructor(config) {
    this.#maxConcurrent = config.maxConcurrent;
    this.#maxEntries = config.maxEntries;
    this.#entryTtlMs = config.entryTtlMs;
  }
  get epoch() {
    return this.#epoch;
  }
  stats() {
    return { ...this.#stats, pending: this.#entries.size };
  }
  bumpEpoch() {
    this.#epoch += 1;
  }
  static key(parentToolCallId, ref, preparedArgs, bindingToken) {
    return `${parentToolCallId}
${ref}
${stableJsonHash(preparedArgs)}
${bindingToken}`;
  }
  /**
   * Register and start a speculative invocation. Returns false when at
   * capacity; the candidate is dropped silently (a miss costs nothing, the
   * real call executes normally later).
   */
  launch(parentToolCallId, ref, preparedArgs, execute, freshness, replay, bindingToken) {
    this.#sweepExpired(Date.now());
    if (this.#entries.size >= this.#maxEntries || this.#inFlightCount() >= this.#maxConcurrent) {
      this.#stats.skipped += 1;
      return false;
    }
    const key = _FabricSpeculationStore.key(parentToolCallId, ref, preparedArgs, bindingToken);
    if (this.#entries.has(key)) {
      this.#stats.skipped += 1;
      return false;
    }
    const controller = new AbortController();
    const entry = {
      parentToolCallId,
      ref,
      birthEpoch: this.#epoch,
      createdAt: Date.now(),
      controller,
      freshness,
      replay,
      promise: Promise.resolve().then(() => execute(controller.signal)).catch(() => {
        entry.failed = true;
        return void 0;
      }),
      failed: false
    };
    this.#entries.set(key, entry);
    this.#stats.launched += 1;
    return true;
  }
  async tryServe(parentToolCallId, ref, preparedArgs, bindingToken) {
    const key = _FabricSpeculationStore.key(parentToolCallId, ref, preparedArgs, bindingToken);
    const entry = this.#entries.get(key);
    if (!entry || entry.parentToolCallId !== parentToolCallId) {
      return { hit: false, reason: "absent" };
    }
    this.#entries.delete(key);
    if (entry.birthEpoch !== this.#epoch) {
      this.#stats.epochInvalidated += 1;
      entry.controller.abort();
      return { hit: false, reason: "epoch" };
    }
    if (entry.freshness && !entry.freshness()) {
      this.#stats.freshnessInvalidated += 1;
      entry.controller.abort();
      return { hit: false, reason: "freshness" };
    }
    const value = await entry.promise;
    if (entry.failed) {
      this.#stats.failed += 1;
      return { hit: false, reason: "failed" };
    }
    this.#stats.served += 1;
    return { hit: true, value, replay: entry.replay };
  }
  /** Execution for this tool call finished: everything unserved is waste. */
  onInvocationEnd(parentToolCallId) {
    for (const [key, entry] of this.#entries) {
      if (entry.parentToolCallId !== parentToolCallId) continue;
      entry.controller.abort();
      this.#entries.delete(key);
      this.#stats.wasted += 1;
    }
  }
  /** Turn backstop: speculation never outlives a turn. */
  reset() {
    for (const entry of this.#entries.values()) entry.controller.abort();
    this.#entries.clear();
  }
  #inFlightCount() {
    let count = 0;
    for (const entry of this.#entries.values()) {
      if (!entry.failed) count += 1;
    }
    return count;
  }
  #sweepExpired(now) {
    for (const [key, entry] of this.#entries) {
      if (now - entry.createdAt <= this.#entryTtlMs) continue;
      entry.controller.abort();
      this.#entries.delete(key);
      this.#stats.wasted += 1;
    }
  }
};

// src/speculation/partial-json.ts
var CODE_KEY_PATTERN = /"code"\s*:\s*"/;
var ESCAPES = {
  '"': '"',
  "\\": "\\",
  "/": "/",
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "	"
};
var PartialCodeFieldExtractor = class {
  #raw = "";
  #codeStart = -1;
  #cursor = 0;
  #decoded = "";
  #complete = false;
  #failed = false;
  #maxBytes;
  constructor(maxBytes) {
    this.#maxBytes = maxBytes;
  }
  get complete() {
    return this.#complete;
  }
  /** Decoded `code` content so far, or undefined before the key appears. */
  get code() {
    return this.#codeStart === -1 ? void 0 : this.#decoded;
  }
  push(delta) {
    if (this.#complete || this.#failed) return;
    if (this.#raw.length + delta.length > this.#maxBytes) {
      this.#failed = true;
      return;
    }
    this.#raw += delta;
    if (this.#codeStart === -1) {
      const match = CODE_KEY_PATTERN.exec(this.#raw);
      if (!match) return;
      this.#codeStart = match.index + match[0].length;
      this.#cursor = this.#codeStart;
    }
    const raw = this.#raw;
    while (this.#cursor < raw.length) {
      const ch = raw[this.#cursor];
      if (ch === '"') {
        this.#complete = true;
        this.#cursor = raw.length;
        return;
      }
      if (ch === "\\") {
        if (this.#cursor + 1 >= raw.length) return;
        const esc = raw[this.#cursor + 1];
        if (esc === "u") {
          if (this.#cursor + 5 >= raw.length) return;
          const hex = raw.slice(this.#cursor + 2, this.#cursor + 6);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
            this.#failed = true;
            return;
          }
          this.#decoded += String.fromCharCode(parseInt(hex, 16));
          this.#cursor += 6;
          continue;
        }
        const mapped = ESCAPES[esc];
        if (mapped === void 0) {
          this.#failed = true;
          return;
        }
        this.#decoded += mapped;
        this.#cursor += 2;
        continue;
      }
      if (ch < " ") {
        this.#failed = true;
        return;
      }
      this.#decoded += ch;
      this.#cursor += 1;
    }
  }
};

// src/speculation/stream-tap.ts
var toolCallBlock = (partial, contentIndex) => {
  const content = partial?.content;
  if (!Array.isArray(content)) return {};
  const block = content[contentIndex];
  if (!block || typeof block !== "object") return {};
  const record = block;
  if (record.type !== "toolCall") return {};
  return {
    ...typeof record.name === "string" && record.name ? { name: record.name } : {},
    ...typeof record.id === "string" && record.id ? { id: record.id } : {}
  };
};
var PARSE_INTERVAL_MS = 50;
var FabricSpeculationStreamTap = class {
  #options;
  #streams = /* @__PURE__ */ new Map();
  // The scanner depends on the TypeScript compiler; the factory arrives through
  // a lazy dynamic import so session startup never pays for it. Streams opened
  // before the factory lands are caught up in full (extractors buffer the
  // whole decoded prefix, so no candidate is lost, only delayed).
  #createScanner;
  #lastParseAt = 0;
  constructor(options) {
    this.#options = options;
  }
  setScannerFactory(factory) {
    this.#createScanner = factory;
    for (const stream of this.#streams.values()) {
      if (stream.scanner) continue;
      stream.scanner = factory();
      const code = stream.extractor.code;
      if (!stream.isFabricExec || code === void 0) continue;
      try {
        for (const candidate of stream.scanner.push(code)) {
          if (this.#options.isEligible(candidate.ref)) {
            this.#pendingCatchUp.push({ stream, candidate });
          }
        }
      } catch {
      }
    }
  }
  #pendingCatchUp = [];
  /** Drain candidates recovered while the scanner module loaded. */
  flushCatchUp(context) {
    const pending = this.#pendingCatchUp.splice(0);
    for (const { stream, candidate } of pending) {
      this.#options.launch(stream.toolCallId, candidate, context);
    }
  }
  /** New assistant message: content indices restart. */
  reset() {
    this.#streams.clear();
  }
  handleMessageUpdate(event, context) {
    try {
      if (!this.#options.enabled()) return;
      if (this.#pendingCatchUp.length > 0) this.flushCatchUp(context);
      const assistantEvent = event.assistantMessageEvent;
      if (assistantEvent.type === "toolcall_start") {
        const block = toolCallBlock(assistantEvent.partial, assistantEvent.contentIndex);
        this.#streams.set(assistantEvent.contentIndex, {
          toolCallId: block.id ?? `index-${assistantEvent.contentIndex}`,
          isFabricExec: block.name !== void 0 ? block.name === "fabric_exec" : true,
          extractor: new PartialCodeFieldExtractor(this.#options.maxBufferBytes()),
          ...this.#createScanner ? { scanner: this.#createScanner() } : {}
        });
        return;
      }
      if (assistantEvent.type === "toolcall_delta") {
        const stream = this.#streams.get(assistantEvent.contentIndex);
        if (!stream) return;
        const block = toolCallBlock(assistantEvent.partial, assistantEvent.contentIndex);
        if (block.id) stream.toolCallId = block.id;
        if (block.name !== void 0) stream.isFabricExec = block.name === "fabric_exec";
        stream.extractor.push(assistantEvent.delta);
        const code = stream.extractor.code;
        if (!stream.isFabricExec || code === void 0) return;
        this.#scan(stream, code, context, false);
        return;
      }
      if (assistantEvent.type === "toolcall_end") {
        const stream = this.#streams.get(assistantEvent.contentIndex);
        if (!stream) return;
        this.#streams.delete(assistantEvent.contentIndex);
        const block = toolCallBlock(assistantEvent.toolCall, assistantEvent.contentIndex);
        if (block.id) stream.toolCallId = block.id;
        if (block.name !== void 0) stream.isFabricExec = block.name === "fabric_exec";
        const code = stream.extractor.code;
        if (stream.isFabricExec && code !== void 0) {
          this.#scan(stream, code, context, true);
        }
      }
    } catch {
    }
  }
  #scan(stream, code, context, force) {
    const now = Date.now();
    if (!force && now - this.#lastParseAt < PARSE_INTERVAL_MS) return;
    this.#lastParseAt = now;
    if (!stream.scanner) return;
    const candidates = stream.scanner.push(code);
    for (const candidate of candidates) {
      if (this.#options.isEligible(candidate.ref)) {
        this.#options.launch(stream.toolCallId, candidate, context);
      }
    }
  }
};

// src/lifecycle/delivery-scheduler.ts
var DEFAULT_LIFECYCLE_COALESCE_MS = 2e3;
var LifecycleDeliveryScheduler = class {
  constructor(coalesceMs, deliver, onError = () => {
  }) {
    this.deliver = deliver;
    this.onError = onError;
    this.#coalesceMs = Math.max(0, coalesceMs);
  }
  #coalesceMs;
  #buffers = /* @__PURE__ */ new Map();
  #timers = /* @__PURE__ */ new Map();
  #inFlight = /* @__PURE__ */ new Map();
  #closed = false;
  schedule(target, delivery) {
    if (this.#closed) return;
    if (delivery.subscription.delivery === "steer") {
      void this.#dispatch(target, [delivery]);
      return;
    }
    const buffer = this.#buffers.get(target);
    if (buffer) buffer.push(delivery);
    else this.#buffers.set(target, [delivery]);
    if (this.#timers.has(target)) return;
    const timer = setTimeout(() => void this.flush(target), this.#coalesceMs);
    timer.unref();
    this.#timers.set(target, timer);
  }
  async flush(target) {
    const timer = this.#timers.get(target);
    if (timer) {
      clearTimeout(timer);
      this.#timers.delete(target);
    }
    const batch = this.#buffers.get(target);
    if (!batch || batch.length === 0) return;
    this.#buffers.delete(target);
    await this.#dispatch(target, batch);
  }
  async flushAll() {
    for (const timer of this.#timers.values()) clearTimeout(timer);
    this.#timers.clear();
    const targets = [...this.#buffers.keys()];
    await Promise.all(targets.map((target) => this.flush(target)));
    await Promise.all(this.#inFlight.values());
  }
  async dispose() {
    this.#closed = true;
    for (const timer of this.#timers.values()) clearTimeout(timer);
    this.#timers.clear();
    this.#buffers.clear();
    await Promise.all(this.#inFlight.values());
  }
  async #dispatch(target, batch) {
    const previous = this.#inFlight.get(target);
    const operation = (async () => {
      await previous?.catch(() => void 0);
      try {
        await this.deliver(target, batch);
      } catch (error) {
        this.onError(target, batch, error);
      }
    })();
    this.#inFlight.set(
      target,
      operation.finally(() => {
        if (this.#inFlight.get(target) === operation) this.#inFlight.delete(target);
      })
    );
    await operation;
  }
};

// src/core/model-usage.ts
import { readFileSync } from "node:fs";
import path4 from "node:path";
var MODEL_USAGE_FILENAME = "pi-model-sort.json";
var loadModelUsage = (agentDir = resolveAgentDir()) => {
  try {
    const raw = JSON.parse(
      readFileSync(path4.join(agentDir, "extensions", MODEL_USAGE_FILENAME), "utf8")
    );
    const lastUsed = raw?.lastUsed;
    if (typeof lastUsed !== "object" || lastUsed === null) return {};
    const usage = {};
    for (const [key, value] of Object.entries(lastUsed)) {
      if (typeof value === "number" && Number.isFinite(value)) usage[key] = value;
    }
    return usage;
  } catch {
    return {};
  }
};

// src/providers/agents-actions.ts
var runProperties = {
  task: { type: "string", description: "A self-contained task for the child agent" },
  name: { type: "string" },
  runner: {
    type: "string",
    enum: ["pi", "claude", "veda"],
    description: "Execution harness. Defaults to agents.runner."
  },
  transport: {
    type: "string",
    enum: ["auto", "process", "tmux", "screen", "localterm", "herdr"]
  },
  model: {
    type: "string",
    description: "Pi provider/id, a configured models.aliases name, or a search term resolved to the closest authenticated model (recency from pi-model-sort breaks ties); Claude runtime value or Veda backend model/alias are forwarded verbatim."
  },
  persona: {
    type: "string",
    description: "Veda persona name for this run, such as frontend, reviewer, worker, or a custom persona."
  },
  thinking: {
    type: "string",
    enum: ["off", "minimal", "low", "medium", "high", "xhigh", "max"]
  },
  tools: { type: "array", items: { type: "string" } },
  timeoutMs: {
    type: "number",
    description: "Optional longer wall-clock limit in milliseconds. Omit to use agents.timeoutMs (60 minutes by default); values below the configured default are ignored."
  },
  extensions: { type: "boolean" },
  recursive: { type: "boolean" },
  cwd: {
    type: "string",
    description: "Filesystem execution directory; relative paths resolve from the parent Fabric agent cwd."
  },
  worktree: { type: "boolean" },
  schema: { type: "object", description: "Optional JSON Schema for validated structured output" }
};
var runSchema = {
  type: "object",
  properties: runProperties,
  required: ["task"],
  additionalProperties: false
};
var residencySchema = {
  type: "string",
  enum: ["session", "durable"],
  description: "session stops with the current Pi host; durable transfers execution to Fabric's hidden resident host."
};
var actorBindingScopeSchema = {
  type: "string",
  enum: ["session", "project"],
  description: "session (default) changes only this Pi session; project pins the shared actor default and requires ownership."
};
var actorInvocationProperties = {
  id: { type: "string" },
  message: { type: "string" },
  data: {},
  model: {
    ...runProperties.model,
    description: "Optional model pinned only for this actor activation."
  },
  thinking: runProperties.thinking
};
var spawnSchema = {
  ...runSchema,
  properties: { ...runProperties, residency: residencySchema }
};
var handoffCompactionSchema = {
  anyOf: [
    { type: "boolean" },
    {
      type: "object",
      properties: {
        instructions: {
          type: "string",
          maxLength: MAX_COMPACTION_INSTRUCTIONS_CHARS,
          description: "Custom compaction instructions for the inherited trajectory"
        },
        preserve: {
          type: "array",
          items: { type: "string", maxLength: MAX_PRESERVE_ITEM_CHARS },
          maxItems: MAX_PRESERVE_ITEMS,
          description: "Explicit bounded facts the trajectory summary must preserve"
        }
      },
      additionalProperties: false
    }
  ],
  description: "Compact the inherited trajectory with Fabric's deterministic compactor before the executor resumes it. `true` applies the default summary; an object customizes instructions and bounded preserve facts. Omitted keeps the full raw trajectory."
};
var handoffSchema = {
  type: "object",
  properties: {
    task: {
      type: "string",
      description: "Optional instructions for the executor in addition to the inherited trajectory"
    },
    name: runProperties.name,
    transport: runProperties.transport,
    model: {
      ...runProperties.model,
      description: "Explicit Pi provider/id target that will continue the inherited trajectory"
    },
    thinking: runProperties.thinking,
    tools: runProperties.tools,
    timeoutMs: runProperties.timeoutMs,
    extensions: runProperties.extensions,
    recursive: runProperties.recursive,
    schema: runProperties.schema,
    compact: handoffCompactionSchema
  },
  required: ["model"],
  additionalProperties: false
};
var idSchema = {
  type: "object",
  properties: { id: { type: "string" } },
  required: ["id"],
  additionalProperties: false
};
var lifecycleEventSchema = {
  type: "string",
  enum: [...FABRIC_LIFECYCLE_EVENTS]
};
var AGENTS_ACTION_DESCRIPTORS = [
  {
    name: "run",
    description: "Run a child agent through Pi or Claude Code and wait for its final result",
    inputSchema: runSchema,
    risk: "agent"
  },
  {
    name: "handoff",
    description: "Schedule a Pi trajectory handoff after the current outer fabric_exec result, then wait for implementation at that boundary",
    inputSchema: handoffSchema,
    risk: "agent"
  },
  {
    name: "spawn",
    description: "Start a child agent through Pi or Claude Code and return a handle immediately. Detached runs send Main a follow-up on terminal completion when agents.notifyOnComplete is enabled; use wait when this Fabric program needs the result and status only for progress inspection.",
    inputSchema: spawnSchema,
    risk: "agent"
  },
  {
    name: "wait",
    description: "Wait for a previously spawned child agent",
    inputSchema: idSchema,
    risk: "read"
  },
  {
    name: "status",
    description: "Get the latest status of any known project participant",
    inputSchema: idSchema,
    risk: "read"
  },
  {
    name: "list",
    description: "List agent participants locally, across the current lineage, or across the project",
    inputSchema: {
      type: "object",
      properties: { scope: { type: "string", enum: ["local", "lineage", "project"] } },
      additionalProperties: false
    },
    risk: "read"
  },
  {
    name: "members",
    description: "List the unified project topology of roots, agents, and actors",
    inputSchema: {
      type: "object",
      properties: {
        scope: { type: "string", enum: ["local", "lineage", "project"] },
        kinds: {
          type: "array",
          items: { type: "string", enum: ["root", "agent", "actor"] }
        },
        includeStale: { type: "boolean" }
      },
      additionalProperties: false
    },
    risk: "read"
  },
  {
    name: "self",
    description: "Return this caller's intrinsic participant identity in the unified topology",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    risk: "read"
  },
  {
    name: "main",
    description: "Return the root user-facing Main Pi agent target. The stable alias main is also accepted by agents.steer and agents.followUp.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    risk: "read"
  },
  {
    name: "peers",
    description: "List other live root Pi sessions sharing this project mesh. The dashboard-owning session remains Main; these targets are named peers.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    risk: "read"
  },
  {
    name: "subscribe",
    description: "Create a durable source-qualified participant lifecycle subscription. Events are delivered to Main by default or to another participant through steer/follow-up routing.",
    inputSchema: {
      type: "object",
      properties: {
        from: { type: "string", description: "Exact source participant id; main means this lineage root" },
        events: { type: "array", minItems: 1, items: lifecycleEventSchema },
        to: { type: "string", description: "Target participant id; defaults to main" },
        delivery: { type: "string", enum: ["steer", "followUp"] },
        triggerTurn: { type: "boolean" },
        once: { type: "boolean" }
      },
      required: ["from", "events", "delivery", "triggerTurn"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "subscriptions",
    description: "List durable participant lifecycle subscriptions, optionally filtered by source or target",
    inputSchema: {
      type: "object",
      properties: { from: { type: "string" }, to: { type: "string" } },
      additionalProperties: false
    },
    risk: "read"
  },
  {
    name: "unsubscribe",
    description: "Remove a participant lifecycle subscription",
    inputSchema: idSchema,
    risk: "agent"
  },
  {
    name: "models",
    description: "List models exposed by the selected runner. Claude models are enumerated from the installed Claude Code runtime, not hard-coded.",
    inputSchema: {
      type: "object",
      properties: {
        runner: { type: "string", enum: ["pi", "claude", "veda"] },
        refresh: { type: "boolean" }
      },
      additionalProperties: false
    },
    risk: "execute"
  },
  {
    name: "switchModel",
    description: "Switch Main's live Pi session model in place. The model selector accepts an exact provider/id, a configured models.aliases name (alias chains try each target in order until one is authenticated), an exact model id, or a search term; inexact terms resolve to the closest match, preferring recently used models (via pi-model-sort usage, when present).",
    inputSchema: {
      type: "object",
      properties: {
        model: {
          type: "string",
          description: "provider/id, alias name, or search term"
        },
        provider: { type: "string" }
      },
      required: ["model"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "stop",
    description: "Stop a local or remotely owned agent or actor that advertises the stop capability",
    inputSchema: idSchema,
    risk: "agent"
  },
  {
    name: "cleanup",
    description: "Remove a completed agent's run files and optional Git worktree",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        deleteBranch: { type: "boolean" }
      },
      required: ["id"],
      additionalProperties: false
    },
    risk: "write"
  },
  {
    name: "create",
    description: 'Create a persistent actor with a mailbox and optional subscriptions to any session-bound Pi event or mesh topic. Image-bearing events attach images to the actor model automatically while persistent event data stays redacted. Use scope "global" to save a reusable project-independent template to the global registry instead of a live project actor; global templates are not live and carry no history.',
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        instructions: { type: "string" },
        events: {
          type: "array",
          items: {
            type: "string",
            enum: [...FABRIC_ACTOR_HOST_EVENTS]
          }
        },
        topics: { type: "array", items: { type: "string" } },
        delivery: {
          type: "string",
          enum: ["mailbox", "steer", "followUp", "nextTurn"]
        },
        responseMode: { type: "string", enum: ["text", "directive"] },
        triggerTurn: { type: "boolean" },
        coalesce: { type: "boolean" },
        residency: residencySchema,
        runner: runProperties.runner,
        model: runProperties.model,
        thinking: runProperties.thinking,
        tools: runProperties.tools,
        transport: runProperties.transport,
        timeoutMs: runProperties.timeoutMs,
        extensions: runProperties.extensions,
        requires: {
          type: "array",
          maxItems: 128,
          description: "Exact Fabric provider.action refs committed before every actor run. Object entries may be optional.",
          items: {
            oneOf: [
              { type: "string", minLength: 3, maxLength: 256 },
              {
                type: "object",
                properties: {
                  ref: { type: "string", minLength: 3, maxLength: 256 },
                  optional: { type: "boolean" }
                },
                required: ["ref"],
                additionalProperties: false
              }
            ]
          }
        },
        validWhile: {
          type: "object",
          properties: { version: { const: 1 }, source: { type: "string" } },
          required: ["version", "source"],
          additionalProperties: false
        },
        scope: { type: "string", enum: ["project", "global"] }
      },
      required: ["name", "instructions"],
      oneOf: [
        {
          properties: {
            delivery: { const: "mailbox" },
            triggerTurn: { const: false }
          }
        },
        {
          properties: {
            delivery: { const: "nextTurn" },
            triggerTurn: { const: false }
          },
          required: ["delivery"]
        },
        {
          properties: { delivery: { enum: ["steer", "followUp"] } },
          required: ["delivery", "triggerTurn"]
        }
      ],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "ask",
    description: "Send a message to a persistent actor through its live owner and wait for its next response. Optional model/thinking values apply only to this activation.",
    inputSchema: {
      type: "object",
      properties: actorInvocationProperties,
      required: ["id", "message"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "tell",
    description: "Queue a message through a persistent actor's live owner without waiting. Optional model/thinking values apply only to this activation.",
    inputSchema: {
      type: "object",
      properties: actorInvocationProperties,
      required: ["id", "message"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "steer",
    description: "Steer Main, a running one-shot agent between turns, or a persistent actor through its mailbox. The stable id alias main targets the root user-facing Pi session. Non-local targets route over the project mesh.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, message: { type: "string" }, data: {} },
      required: ["id", "message"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "followUp",
    description: "Queue a follow-up for Main or a running one-shot agent, or enqueue a persistent actor mailbox message. The stable id alias main targets the root user-facing Pi session. Non-local targets route over the project mesh.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, message: { type: "string" }, data: {} },
      required: ["id", "message"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "setSteeringMode",
    description: "Set how queued steer messages are delivered to a running one-shot agent: all at once after the current turn, or one per turn (default). Local agent only.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        mode: { type: "string", enum: ["all", "one-at-a-time"] }
      },
      required: ["id", "mode"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "setFollowUpMode",
    description: "Set how queued follow-up messages are delivered to a one-shot agent: all when it finishes, or one per completion (default). Local agent only.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        mode: { type: "string", enum: ["all", "one-at-a-time"] }
      },
      required: ["id", "mode"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "compact",
    description: "Request an advisory compaction of a running Pi-runner child agent's context at its next safe boundary (between its own turns), preserving the child's accumulated context. Rejected for Claude-runner children. The child pi core applies the compaction; Fabric only forwards the intent.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        instructions: {
          type: "string",
          description: "Optional custom compaction instructions forwarded to the child pi"
        }
      },
      required: ["id"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "actorStatus",
    description: "Read one persistent actor's status",
    inputSchema: idSchema,
    risk: "read"
  },
  {
    name: "actors",
    description: 'List persistent actors. Default scope "project" lists live actors in this Fabric session; scope "global" lists project-independent templates in the global registry.',
    inputSchema: {
      type: "object",
      properties: { scope: { type: "string", enum: ["project", "global"] } },
      additionalProperties: false
    },
    risk: "read"
  },
  {
    name: "messages",
    description: "Read a persistent actor's bounded inbox and outbox history",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, limit: { type: "number", minimum: 1 } },
      required: ["id"],
      additionalProperties: false
    },
    risk: "read"
  },
  {
    name: "setModel",
    description: "Change or clear a persistent actor model binding. Session scope is the default; project scope explicitly pins the shared definition default.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        model: { type: "string" },
        scope: actorBindingScopeSchema
      },
      required: ["id"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "setThinking",
    description: "Change or clear a persistent actor reasoning-effort binding. Session scope is the default; project scope explicitly pins the shared definition default.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        thinking: runProperties.thinking,
        scope: actorBindingScopeSchema
      },
      required: ["id"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "setTools",
    description: "Replace a persistent actor's tool allowlist. Takes effect on its next queued message; an empty list disables optional tools.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        tools: runProperties.tools,
        scope: { type: "string", enum: ["project", "global"] }
      },
      required: ["id", "tools"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "setEvents",
    description: "Replace a persistent actor's session-bound Pi and synthetic tool_error event subscriptions",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        events: {
          type: "array",
          items: {
            type: "string",
            enum: [...FABRIC_ACTOR_HOST_EVENTS]
          }
        }
      },
      required: ["id", "events"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "setDeliveryPolicy",
    description: "Replace a project actor or global template delivery policy. steer/followUp require an explicit triggerTurn choice; mailbox/nextTurn require false.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        delivery: {
          type: "string",
          enum: ["mailbox", "steer", "followUp", "nextTurn"]
        },
        triggerTurn: { type: "boolean" },
        scope: { type: "string", enum: ["project", "global"] }
      },
      required: ["id", "delivery", "triggerTurn"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "clearMessages",
    description: "Clear a persistent actor's recorded message history",
    inputSchema: idSchema,
    risk: "write"
  },
  {
    name: "remove",
    description: 'Stop and remove a persistent actor. Default scope "project" removes a live project actor; scope "global" removes a project-independent template from the global registry.',
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        scope: { type: "string", enum: ["project", "global"] }
      },
      required: ["id"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "setInstructions",
    description: `Replace an actor's default instruction (its persona / system-prompt body). Default scope "project" edits a live project actor; scope "global" edits a project-independent template. Takes effect on the actor's next queued message.`,
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        instructions: { type: "string" },
        scope: { type: "string", enum: ["project", "global"] }
      },
      required: ["id", "instructions"],
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "import",
    description: 'Import a project-independent template from the global registry into the current project as a fresh live actor with no inherited history (no messages, session, or run logs). Identify the template by id or name; optionally rename the imported actor with "as" to avoid colliding with a live actor.',
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Template id or name (one of id/name required)" },
        name: { type: "string", description: "Template name (one of id/name required)" },
        as: { type: "string", description: "Optional new name for the imported live actor" }
      },
      additionalProperties: false
    },
    risk: "agent"
  },
  {
    name: "export",
    description: "Export a live project actor's definition to the global registry as a project-independent template, without any history (no messages, session, or run logs). Throws on a name collision unless overwrite is true.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        overwrite: { type: "boolean" }
      },
      required: ["id"],
      additionalProperties: false
    },
    risk: "write"
  },
  {
    name: "log",
    description: "Read an actor or agent run's LLM/agent log: the actor's session transcript (session.jsonl) and/or a retained run's event stream (events.jsonl: tool calls, model responses, usage). Actors retain their last runs so logs survive after success.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Actor ID/name or agent run ID" },
        type: {
          type: "string",
          enum: ["session", "run", "all"],
          description: "session = actor session transcript (default for actors); run = last retained run's events; all = both"
        },
        lines: { type: "number", minimum: 1, description: "Page line limit (default 200)" },
        before: {
          type: "number",
          minimum: 0,
          description: "Exclusive line cursor returned by a previous page to load older entries"
        },
        runId: { type: "string", description: "Specific retained run (default: actor's last run)" }
      },
      required: ["id"],
      additionalProperties: false
    },
    risk: "read"
  }
];

// src/residency/client.ts
import { randomUUID as randomUUID3 } from "node:crypto";
import fs4 from "node:fs";
import path5 from "node:path";
import { fileURLToPath } from "node:url";
var STARTUP_TIMEOUT_MS = 3e4;
var COMMAND_TIMEOUT_MS = 3e4;
var STATUS_POLL_MS = 100;
var AGENT_ID_PATTERN = /^[a-f0-9]{32}$/;
var delay = (ms) => new Promise((resolve2) => setTimeout(resolve2, ms));
var atomicWrite2 = (filePath, value) => {
  writeJsonAtomic(filePath, value, { space: 2 });
};
var readJson = (filePath) => {
  try {
    return JSON.parse(fs4.readFileSync(filePath, "utf8"));
  } catch {
    return void 0;
  }
};
var terminal = (status) => status === "completed" || status === "failed" || status === "stopped" || status === "timed_out";
var samePath = (left, right) => {
  try {
    return path5.relative(fs4.realpathSync.native(left), fs4.realpathSync.native(right)) === "";
  } catch {
    return false;
  }
};
var registeredWorktree = async (gitRoot, worktreePath) => {
  let output;
  try {
    output = (await executeFile("git", ["worktree", "list", "--porcelain"], {
      cwd: gitRoot,
      timeoutMs: 3e4
    })).stdout;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot validate durable worktree ${JSON.stringify(worktreePath)}: ${reason}`);
  }
  const registered = output.split(/\r?\n/).filter((line) => line.startsWith("worktree ")).map((line) => line.slice("worktree ".length));
  const match = registered.find((candidate) => samePath(candidate, worktreePath));
  if (!match) {
    throw new Error(
      `Refusing durable worktree cleanup: ${JSON.stringify(worktreePath)} is not registered by ${JSON.stringify(gitRoot)}`
    );
  }
  return match;
};
var ResidencyClient = class {
  constructor(options) {
    this.options = options;
    this.hostId = residentHostId(options.config.rootId);
    this.#configPath = path5.join(options.config.residencyRoot, "config.json");
    this.#ownerPath = path5.join(options.config.residencyRoot, "owner.json");
    this.#errorPath = path5.join(options.config.residencyRoot, "error.json");
    this.#requestsPath = path5.join(options.config.residencyRoot, "requests");
    this.#responsesPath = path5.join(options.config.residencyRoot, "responses");
    this.#agentsPath = path5.join(options.config.residencyRoot, "agents");
    this.#deliveryPrefix = residentDeliveryPrefix(options.config.rootId);
    this.#hostPath = options.hostPath ?? fileURLToPath(new URL("./launcher.js", import.meta.url));
  }
  hostId;
  #configPath;
  #ownerPath;
  #errorPath;
  #requestsPath;
  #responsesPath;
  #agentsPath;
  #deliveryPrefix;
  #hostPath;
  #deliveryTimer;
  #modelGuidanceJson;
  #drainingDeliveries = false;
  #closed = false;
  start() {
    if (this.#deliveryTimer || this.#closed || !this.options.mainAgent.local) return;
    this.#deliveryTimer = setInterval(
      () => void this.#drainDeliveries().catch(() => void 0),
      Math.max(20, this.options.config.mesh.actorPollMs)
    );
    this.#deliveryTimer.unref();
    void this.#drainDeliveries().catch(() => void 0);
  }
  async close() {
    this.#closed = true;
    if (this.#deliveryTimer) clearInterval(this.#deliveryTimer);
    this.#deliveryTimer = void 0;
    while (this.#drainingDeliveries) await delay(10);
  }
  updateModelGuidance(guidance) {
    const snapshot = structuredClone([...guidance]);
    const serialized = JSON.stringify(snapshot);
    if (serialized === this.#modelGuidanceJson) return;
    this.#modelGuidanceJson = serialized;
    this.options.config.modelGuidance = snapshot;
    if (fs4.existsSync(this.options.config.residencyRoot)) {
      atomicWrite2(this.#configPath, this.options.config);
    }
  }
  async ensureHost() {
    if (this.#closed) throw new Error("Fabric residency client is closed");
    atomicWrite2(this.#configPath, this.options.config);
    const existing = this.#liveOwner();
    if (existing) return existing;
    fs4.rmSync(this.#errorPath, { force: true });
    await spawnDetached(
      this.#hostPath,
      ["--config", this.#configPath],
      this.options.config.cwd
    );
    const deadline = Date.now() + STARTUP_TIMEOUT_MS;
    while (Date.now() < deadline) {
      const owner = this.#liveOwner();
      if (owner) return owner;
      const failure = readJson(this.#errorPath);
      if (typeof failure?.error === "string") {
        throw new Error(`Fabric resident host failed to start: ${failure.error}`);
      }
      await delay(STATUS_POLL_MS);
    }
    const readIfPresent = (name) => {
      try {
        return fs4.readFileSync(path5.join(this.options.config.residencyRoot, name), "utf8").trim();
      } catch {
        return "";
      }
    };
    const childOutput = readIfPresent("child-stderr.log");
    const launcherLog = readIfPresent("launcher.log").split("\n").slice(-6).join("\n");
    const ownerState = readIfPresent("owner.json").slice(0, 300);
    const diagnostics = [
      childOutput ? `Child output: ${childOutput.slice(-500)}` : "",
      launcherLog ? `Launcher log: ${launcherLog}` : "",
      ownerState ? `Owner state: ${ownerState}` : "Owner state: absent"
    ].filter(Boolean).join(" | ");
    throw new Error(`Timed out starting Fabric resident host ${this.hostId}. ${diagnostics}`);
  }
  async ensureActor(id) {
    await this.ensureHost();
    await this.#waitForParticipant(id, "actor");
  }
  async spawnAgent(request, signal) {
    validateAgentCwdRequest(request);
    const resolvedRequest = request.cwd === void 0 ? request : { ...request, cwd: resolveAgentCwd(this.options.config.cwd, request.cwd) };
    await this.ensureHost();
    const response = await this.#command(
      {
        format: RESIDENT_HOST_FORMAT,
        operation: "spawn",
        requestId: randomUUID3(),
        rootId: this.options.config.rootId,
        request: { ...resolvedRequest, residency: "durable" },
        createdAt: Date.now()
      },
      signal
    );
    if (!response.handle) throw new Error("Fabric resident host returned no agent handle");
    await this.#waitForParticipant(response.handle.id, "agent");
    return response.handle;
  }
  hasAgent(id) {
    return AGENT_ID_PATTERN.test(id) && fs4.existsSync(this.#metadataPath(id));
  }
  statusAgent(id) {
    const metadata = this.#metadata(id);
    if (!metadata) throw new Error(`Unknown durable Fabric agent: ${id}`);
    const record = readJson(path5.join(metadata.runDirectory, "status.json"));
    if (!record || record.id !== metadata.id) return structuredClone(metadata.handle);
    return {
      ...record,
      cwd: metadata.handle.cwd,
      residency: "durable",
      logFile: path5.join(metadata.runDirectory, "events.jsonl"),
      ...metadata.handle.sessionId ? { sessionId: metadata.handle.sessionId } : {},
      ...metadata.handle.attachCommand ? { attachCommand: metadata.handle.attachCommand } : {}
    };
  }
  listAgents() {
    let entries;
    try {
      entries = fs4.readdirSync(this.#agentsPath);
    } catch {
      return [];
    }
    return entries.filter((entry) => entry.endsWith(".json")).flatMap((entry) => {
      try {
        return [this.statusAgent(entry.slice(0, -5))];
      } catch {
        return [];
      }
    });
  }
  async waitAgent(id, signal) {
    if (this.#liveOwner()) {
      await this.#command({
        format: RESIDENT_HOST_FORMAT,
        operation: "foreground",
        requestId: randomUUID3(),
        rootId: this.options.config.rootId,
        id,
        createdAt: Date.now()
      }, signal).catch(() => void 0);
    }
    while (true) {
      if (signal?.aborted) throw new Error(`Waiting for durable Fabric agent ${id} was aborted`);
      const status = this.statusAgent(id);
      if (terminal(status.status) && "startedAt" in status) return status;
      await delay(STATUS_POLL_MS);
    }
  }
  readAgentLog(id, options = {}) {
    const metadata = this.#metadata(id);
    if (!metadata) throw new Error(`Unknown durable Fabric agent: ${id}`);
    const logFile = path5.join(metadata.runDirectory, "events.jsonl");
    const page = readJsonlPage(logFile, Math.max(1, Math.min(options.lines ?? 200, 5e3)), options.before);
    const status = readJson(path5.join(metadata.runDirectory, "status.json"));
    return {
      id,
      runDirectory: metadata.runDirectory,
      logFile,
      ...status ? { status: { ...status, cwd: metadata.handle.cwd, residency: "durable" } } : {},
      events: page.lines,
      hasMore: page.hasMore,
      ...page.before !== void 0 ? { before: page.before } : {}
    };
  }
  async removeActor(id) {
    await this.ensureHost();
    await this.#command({
      format: RESIDENT_HOST_FORMAT,
      operation: "removeActor",
      requestId: randomUUID3(),
      rootId: this.options.config.rootId,
      id,
      createdAt: Date.now()
    });
    return { removed: true };
  }
  async cleanupAgent(id, deleteBranch = false) {
    const metadata = this.#metadata(id);
    if (!metadata) throw new Error(`Unknown durable Fabric agent: ${id}`);
    if (!this.#liveOwner()) return this.#cleanupTerminalFiles(metadata, deleteBranch);
    let response;
    try {
      response = await this.#command({
        format: RESIDENT_HOST_FORMAT,
        operation: "cleanup",
        requestId: randomUUID3(),
        rootId: this.options.config.rootId,
        id,
        deleteBranch,
        createdAt: Date.now()
      });
    } catch (error) {
      if (error instanceof Error && /Unknown Fabric agent/.test(error.message)) {
        return this.#cleanupTerminalFiles(metadata, deleteBranch);
      }
      throw error;
    }
    if (!response.ok) throw new Error(response.error ?? `Failed to clean durable Fabric agent ${id}`);
    return { cleaned: true };
  }
  async #cleanupTerminalFiles(metadata, deleteBranch) {
    const status = this.statusAgent(metadata.id);
    if (!("startedAt" in status) || !terminal(status.status)) {
      throw new Error(`Cannot clean up running durable Fabric agent ${metadata.id}`);
    }
    if (metadata.handle.worktree) {
      const gitRoot = metadata.worktreeGitRoot ?? this.options.config.projectRoot;
      const worktree = await registeredWorktree(gitRoot, metadata.handle.worktree);
      await executeFile(
        "git",
        ["worktree", "remove", "--force", worktree],
        { cwd: gitRoot, timeoutMs: 6e4 }
      );
      if (deleteBranch && metadata.handle.branch) {
        await executeFile(
          "git",
          ["branch", "-D", metadata.handle.branch],
          { cwd: gitRoot, timeoutMs: 3e4 }
        );
      }
    } else if (deleteBranch) {
      throw new Error(`Durable Fabric agent ${metadata.id} has no worktree branch to delete`);
    }
    fs4.rmSync(metadata.runDirectory, { recursive: true, force: true });
    fs4.rmSync(this.#metadataPath(metadata.id), { force: true });
    return { cleaned: true };
  }
  async #command(command, signal) {
    const responsePath = path5.join(this.#responsesPath, `${command.requestId}.json`);
    atomicWrite2(path5.join(this.#requestsPath, `${command.requestId}.json`), command);
    const deadline = Date.now() + COMMAND_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (signal?.aborted) throw new Error("Fabric residency request was aborted");
      const response = readJson(responsePath);
      if (response?.format === RESIDENT_HOST_FORMAT && response.requestId === command.requestId) {
        fs4.rmSync(responsePath, { force: true });
        if (!response.ok) throw new Error(response.error ?? "Fabric resident host rejected request");
        return response;
      }
      const owner = this.#liveOwner();
      if (!owner) throw new Error("Fabric resident host exited while processing a request");
      await delay(STATUS_POLL_MS);
    }
    throw new Error(`Timed out waiting for Fabric residency request ${command.requestId}`);
  }
  async #waitForParticipant(id, kind) {
    const deadline = Date.now() + STARTUP_TIMEOUT_MS;
    while (Date.now() < deadline) {
      const participant = this.options.participants.get(id);
      if (participant?.kind === kind && participant.ownerHostId === this.hostId && participant.residency === "durable" && !participant.stale) {
        return;
      }
      await delay(STATUS_POLL_MS);
    }
    throw new Error(`Timed out publishing durable Fabric ${kind} ${id} from ${this.hostId}`);
  }
  #metadataPath(id) {
    return path5.join(this.#agentsPath, `${id}.json`);
  }
  #metadata(id) {
    if (!AGENT_ID_PATTERN.test(id)) return void 0;
    const metadata = readJson(this.#metadataPath(id));
    if (metadata?.format !== RESIDENT_HOST_FORMAT || metadata.rootId !== this.options.config.rootId || metadata.id !== id || metadata.handle.id !== id || metadata.worktreeGitRoot !== void 0 && typeof metadata.worktreeGitRoot !== "string" || path5.resolve(metadata.runDirectory) !== path5.resolve(this.options.config.residencyRoot, "runs", id)) {
      return void 0;
    }
    if (metadata.handle.worktree && !isFabricWorktreePath(metadata.handle.worktree, id)) {
      return void 0;
    }
    if (metadata.handle.branch && (!metadata.handle.branch.startsWith("pi-fabric/") || !metadata.handle.branch.endsWith(`-${id.slice(0, 8)}`))) {
      return void 0;
    }
    return metadata;
  }
  #liveOwner() {
    const owner = readJson(this.#ownerPath);
    if (owner?.format !== RESIDENT_HOST_FORMAT || owner.hostId !== this.hostId || !Number.isSafeInteger(owner.pid) || !processIsAlive(owner.pid)) {
      return void 0;
    }
    return owner;
  }
  async #drainDeliveries() {
    if (this.#drainingDeliveries || this.#closed || !this.options.mainAgent.local) return;
    this.#drainingDeliveries = true;
    try {
      const entries = this.options.mesh.listAll(this.#deliveryPrefix);
      for (const entry of entries) await this.#deliver(entry);
    } finally {
      this.#drainingDeliveries = false;
    }
  }
  async #deliver(entry) {
    if (typeof entry.value !== "object" || entry.value === null || Array.isArray(entry.value)) return;
    const value = entry.value;
    if (value.format !== RESIDENT_HOST_FORMAT || value.rootId !== this.options.config.rootId || typeof value.id !== "string" || typeof value.message !== "string" || value.delivery !== "steer" && value.delivery !== "followUp" || typeof value.triggerTurn !== "boolean" || typeof value.from !== "object" || value.from === null || entry.updatedBy.id !== this.hostId) {
      return;
    }
    this.options.mainAgent.deliverAgent({
      from: value.from,
      message: value.message,
      delivery: value.delivery,
      triggerTurn: value.triggerTurn,
      ...value.data === void 0 ? {} : { data: value.data }
    });
    await this.options.mesh.delete({ key: entry.key, ifVersion: entry.version });
  }
};

// src/providers/agents-provider.ts
var REMOTE_ASK_ACK_GRACE_MS = 3e4;
var MAX_ACTIVITY_CWD_CHARS = 240;
var displaySafeCwd = (cwd) => {
  const safe = cwd.replace(
    /[\u0000-\u001f\u007f]/g,
    (character) => `\\u${character.codePointAt(0).toString(16).padStart(4, "0")}`
  );
  if (safe.length <= MAX_ACTIVITY_CWD_CHARS) return safe;
  return `\u2026${safe.slice(-(MAX_ACTIVITY_CWD_CHARS - 1))}`;
};
var agentStartedMessage = (handle) => `Agent ${handle.name} started via ${handle.runner}/${handle.transport}${handle.attachCommand ? ` \xB7 ${handle.attachCommand}` : ""} \xB7 cwd ${displaySafeCwd(handle.cwd)}`;
var resolveThinkingTransfer = (extensionContext, targetKey2, sourceModel) => {
  const separator = targetKey2.indexOf("/");
  if (separator <= 0 || separator === targetKey2.length - 1) return void 0;
  const registry = extensionContext?.modelRegistry;
  if (!registry) return void 0;
  const target = registry.find(targetKey2.slice(0, separator), targetKey2.slice(separator + 1));
  if (!target) return void 0;
  const source = sourceModel ? {
    provider: sourceModel.provider,
    modelId: sourceModel.modelId,
    api: registry.find(sourceModel.provider, sourceModel.modelId)?.api
  } : void 0;
  return {
    ...source ? { source } : {},
    target: {
      provider: target.provider,
      modelId: target.id,
      api: target.api,
      reasoning: target.reasoning,
      ...target.compat?.requiresThinkingAsText !== void 0 ? {
        requiresThinkingAsText: target.compat.requiresThinkingAsText
      } : {}
    }
  };
};
var AGENT_PROGRESS_INTERVAL_MS = 1e3;
var AGENT_PREVIEW_TEXT_CODE_POINTS = 2e3;
var AGENT_PREVIEW_TOOL_LIMIT = 8;
var AGENT_PREVIEW_TREE_MAX_DEPTH = 4;
var AGENT_PREVIEW_TREE_MAX_NODES = 24;
var tailCodePoints = (value, limit) => {
  if (value.length <= limit) return value;
  return Array.from(value.slice(-limit * 2)).slice(-limit).join("");
};
var stringArray = (value) => Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : void 0;
var actorRunBinding = (args) => ({
  ...typeof args.model === "string" && args.model.trim() ? { model: args.model.trim() } : {},
  ...isFabricThinking(args.thinking) ? { thinking: args.thinking } : {}
});
var longerTimeoutOverride = (value, manager) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return void 0;
  const effective = effectiveAgentTimeoutMs(manager.config.timeoutMs, value);
  return effective > manager.config.timeoutMs ? effective : void 0;
};
var runRequest = (args, context, manager, options = {}) => {
  const transport = args.transport === "auto" || args.transport === "process" || args.transport === "tmux" || args.transport === "screen" || args.transport === "localterm" || args.transport === "herdr" ? args.transport : void 0;
  const thinking = isFabricThinking(args.thinking) ? args.thinking : void 0;
  const tools = stringArray(args.tools);
  const timeoutMs = longerTimeoutOverride(args.timeoutMs, manager);
  const runner = args.runner === "pi" || args.runner === "claude" || args.runner === "veda" ? args.runner : manager.config.runner;
  const inheritedModel = runner === "pi" && !manager.config.model && context.extensionContext.model ? `${context.extensionContext.model.provider}/${context.extensionContext.model.id}` : void 0;
  return {
    task: String(args.task),
    runner,
    ...typeof args.name === "string" ? { name: args.name } : {},
    ...transport ? { transport } : {},
    ...typeof args.model === "string" ? { model: args.model } : inheritedModel ? { model: inheritedModel } : {},
    ...typeof args.persona === "string" && args.persona.trim() ? { persona: args.persona.trim() } : {},
    ...thinking ? { thinking } : {},
    ...tools ? { tools } : {},
    ...timeoutMs !== void 0 ? { timeoutMs } : {},
    ...typeof args.extensions === "boolean" ? { extensions: args.extensions } : {},
    ...typeof args.recursive === "boolean" ? { recursive: args.recursive } : {},
    ...options.allowCwd !== false && typeof args.cwd === "string" ? { cwd: args.cwd } : {},
    ...typeof args.worktree === "boolean" ? { worktree: args.worktree } : {},
    ...args.residency === "session" || args.residency === "durable" ? { residency: args.residency } : {},
    ...typeof args.schema === "object" && args.schema !== null && !Array.isArray(args.schema) ? { schema: args.schema } : {}
  };
};
var handoffTask = (args) => {
  const task = typeof args.task === "string" ? args.task.trim() : "";
  const lines = [
    "Continue and complete the current user task from the inherited conversation trajectory and current workspace.",
    "The caller has handed implementation to you and is blocked awaiting this run. Do the remaining work; do not merely advise the caller or restate the plan.",
    "Treat the inherited conversation, completed outer Fabric result, and current workspace as grounded context. Inspect again only where the workspace or a failed check makes it necessary.",
    "Keep the change scoped, run the relevant full test module or equivalent verification, and report the implementation plus checks honestly."
  ];
  if (task) lines.push("Additional continuation task:", task);
  return lines.join("\n\n");
};
var compactHandoffResult = (result) => ({
  handedOff: true,
  completed: result.status === "completed",
  status: result.status,
  agent: {
    id: result.id,
    name: result.name,
    runner: result.runner,
    transport: result.transport,
    ...result.model ? { model: result.model } : {},
    ...result.thinking ? { thinking: result.thinking } : {},
    turns: result.turns,
    toolCalls: result.toolCalls,
    usage: result.usage
  },
  implementation: result.value ?? result.text,
  ...result.error ? { error: result.error } : {}
});
var actorRequest = (args, context, manager, inheritModel = true) => {
  const events = Array.isArray(args.events) ? args.events.filter(
    (event) => isFabricActorHostEvent(event)
  ) : void 0;
  const topics = stringArray(args.topics);
  const tools = stringArray(args.tools);
  const requires = Array.isArray(args.requires) ? args.requires.reduce(
    (result, requirement) => {
      if (typeof requirement === "string") result.push(requirement);
      else if (typeof requirement === "object" && requirement !== null && !Array.isArray(requirement) && typeof requirement.ref === "string") {
        result.push({
          ref: requirement.ref,
          ...requirement.optional === true ? { optional: true } : {}
        });
      }
      return result;
    },
    []
  ) : void 0;
  const timeoutMs = longerTimeoutOverride(args.timeoutMs, manager);
  const validWhile = typeof args.validWhile === "object" && args.validWhile !== null && !Array.isArray(args.validWhile) && args.validWhile.version === 1 && typeof args.validWhile.source === "string" ? { version: 1, source: args.validWhile.source } : void 0;
  const runner = args.runner === "pi" || args.runner === "claude" || args.runner === "veda" ? args.runner : manager.config.runner;
  if (runner === "veda") {
    throw new Error(
      'The Veda runner does not support persistent actors: Veda executes one headless prompt per invocation. Use a Pi or Claude actor, or agents.run({ runner: "veda" }).'
    );
  }
  const inheritedModel = inheritModel && runner === "pi" && !manager.config.model && context.extensionContext.model ? `${context.extensionContext.model.provider}/${context.extensionContext.model.id}` : void 0;
  return {
    name: String(args.name),
    instructions: String(args.instructions),
    runner,
    ...events ? { events } : {},
    ...topics ? { topics } : {},
    ...args.delivery === "mailbox" || args.delivery === "steer" || args.delivery === "followUp" || args.delivery === "nextTurn" ? { delivery: args.delivery } : {},
    ...args.responseMode === "text" || args.responseMode === "directive" ? { responseMode: args.responseMode } : {},
    ...typeof args.triggerTurn === "boolean" ? { triggerTurn: args.triggerTurn } : {},
    ...typeof args.coalesce === "boolean" ? { coalesce: args.coalesce } : {},
    ...args.residency === "session" || args.residency === "durable" ? { residency: args.residency } : {},
    ...typeof args.model === "string" ? { model: args.model } : inheritedModel ? { model: inheritedModel } : {},
    ...isFabricThinking(args.thinking) ? { thinking: args.thinking } : {},
    ...tools ? { tools } : {},
    ...args.transport === "auto" || args.transport === "process" || args.transport === "tmux" || args.transport === "screen" || args.transport === "localterm" || args.transport === "herdr" ? { transport: args.transport } : {},
    ...timeoutMs !== void 0 ? { timeoutMs } : {},
    ...typeof args.extensions === "boolean" ? { extensions: args.extensions } : {},
    ...requires ? { requires } : {},
    ...validWhile ? { validWhile } : {}
  };
};
var collectAgentToolPreviewNodes = (records, options, depth = 0, budget = { remaining: options.maxNodes ?? AGENT_PREVIEW_TREE_MAX_NODES }) => {
  const maxDepth = options.maxDepth ?? AGENT_PREVIEW_TREE_MAX_DEPTH;
  const nodes = [];
  for (const record of records) {
    if (budget.remaining <= 0) break;
    budget.remaining -= 1;
    const descendants = Array.isArray(record.nestedAgents) ? record.nestedAgents : [];
    const agents = depth + 1 < maxDepth && descendants.length > 0 && budget.remaining > 0 ? collectAgentToolPreviewNodes(descendants, options, depth + 1, budget) : [];
    nodes.push({
      id: record.id,
      name: record.actorName ?? record.name,
      status: record.status,
      ...record.runner === "pi" || record.runner === "claude" || record.runner === "veda" ? { runner: record.runner } : {},
      owner: record.actorId ? "actor" : "agent",
      ...record.currentTool ? { currentTool: record.currentTool } : {},
      ...record.text ? { text: tailCodePoints(record.text, AGENT_PREVIEW_TEXT_CODE_POINTS) } : {},
      tools: options.tools(record),
      ...agents.length > 0 ? { agents } : {},
      ...descendants.length > agents.length ? { agentsTruncated: true } : {}
    });
  }
  return nodes;
};
var attachAgentToolPreview = (status, transcripts, context, enabled, previousRevision) => {
  if (!context.attachPreview) return agentProgressRevision(status);
  const previewTools = (source) => {
    if (!enabled() || !source.logFile) return [];
    try {
      return recentTranscriptTools(
        transcripts.read({ id: source.id, status: source.status, logFile: source.logFile }),
        AGENT_PREVIEW_TOOL_LIMIT
      );
    } catch {
      return [];
    }
  };
  try {
    const nestedRecords = "nestedAgents" in status && Array.isArray(status.nestedAgents) ? status.nestedAgents : [];
    const descendants = collectAgentToolPreviewNodes(nestedRecords, { tools: previewTools });
    const preview = {
      kind: "fabric-agent-tools",
      id: status.id,
      name: status.actorName ?? status.name,
      status: status.status,
      runner: status.runner,
      owner: status.actorId ? "actor" : "agent",
      ..."text" in status && status.text ? { text: tailCodePoints(status.text, AGENT_PREVIEW_TEXT_CODE_POINTS) } : {},
      tools: previewTools(status),
      ...descendants.length > 0 ? { agents: descendants } : {},
      ...nestedRecords.length > descendants.length ? { agentsTruncated: true } : {}
    };
    const revision = JSON.stringify(preview);
    if (revision !== previousRevision) context.attachPreview(preview);
    return revision;
  } catch {
    return previousRevision ?? agentProgressRevision(status);
  }
};
var waitForResultWithProgress = (result, onProgress) => new Promise((resolve2, reject) => {
  let settled = false;
  const finish = (complete) => {
    if (settled) return;
    settled = true;
    clearInterval(progressTimer);
    complete();
  };
  const progressTimer = setInterval(() => {
    if (settled) return;
    try {
      onProgress();
    } catch (error) {
      finish(() => reject(error));
    }
  }, AGENT_PROGRESS_INTERVAL_MS);
  progressTimer.unref?.();
  result.then(
    (value) => finish(() => resolve2(value)),
    (error) => finish(() => reject(error))
  );
});
var actorWorker = (manager, actorId, includeTerminal) => {
  const candidates = manager.list().filter((candidate) => candidate.actorId === actorId);
  const active = candidates.find((candidate) => candidate.status === "running");
  if (active || !includeTerminal) return active;
  return candidates.at(-1);
};
var agentProgressRevision = (status) => [
  status.status,
  "updatedAt" in status ? status.updatedAt : 0,
  "currentTool" in status ? status.currentTool : "",
  "toolCalls" in status ? status.toolCalls : 0,
  "turns" in status ? status.turns : 0
].join(":");
var waitWithProgress = async (manager, transcripts, id, context, agentToolPreviewEnabled) => {
  const result = manager.wait(id);
  let lastPreviewRevision;
  try {
    const settled = await waitForResultWithProgress(result, () => {
      const status = manager.status(id);
      const revision = attachAgentToolPreview(
        status,
        transcripts,
        context,
        agentToolPreviewEnabled,
        lastPreviewRevision
      );
      if (revision === lastPreviewRevision) return;
      lastPreviewRevision = revision;
      const currentTool = "currentTool" in status && status.currentTool ? ` \xB7 ${status.currentTool}` : "";
      const displayName = status.actorName ?? status.name;
      context.update(`Agent ${displayName}: ${status.status}${currentTool}`);
      if ("usage" in status) {
        context.activity?.({
          type: "metrics",
          tokens: status.usage.input + status.usage.output,
          toolCalls: status.toolCalls,
          cost: status.usage.cost
        });
      }
    });
    context.activity?.({
      type: "metrics",
      tokens: settled.usage.input + settled.usage.output,
      toolCalls: settled.toolCalls,
      cost: settled.usage.cost
    });
    return settled;
  } finally {
    try {
      const status = manager.status(id);
      attachAgentToolPreview(status, transcripts, context, agentToolPreviewEnabled);
      const displayName = status.actorName ?? status.name;
      context.update(`Agent ${displayName}: ${status.status}`);
    } catch {
    }
  }
};
var waitWithActorProgress = async (manager, transcripts, actorId, actorName, result, context, agentToolPreviewEnabled) => {
  let lastPreviewRevision;
  try {
    return await waitForResultWithProgress(result, () => {
      const worker = actorWorker(manager, actorId, false);
      const revision = worker ? attachAgentToolPreview(
        worker,
        transcripts,
        context,
        agentToolPreviewEnabled,
        lastPreviewRevision
      ) : "queued";
      if (revision === lastPreviewRevision) return;
      lastPreviewRevision = revision;
      const currentTool = worker && "currentTool" in worker && worker.currentTool ? ` \xB7 ${worker.currentTool}` : "";
      context.update(
        worker ? `Actor ${actorName}: ${worker.status}${currentTool}` : `Actor ${actorName}: queued`
      );
    });
  } finally {
    const worker = actorWorker(manager, actorId, true);
    if (worker) attachAgentToolPreview(worker, transcripts, context, agentToolPreviewEnabled);
  }
};
var normalizeAgentsArgs = actionArgNormalizer(() => AGENTS_ACTION_DESCRIPTORS);
var AgentsProvider = class {
  constructor(manager, actorManager, globalActors, mainAgent, participants, control, lifecycle, agentToolPreviewEnabled = () => true, residency, ownsRuntime = true, modelsConfig = () => DEFAULT_FABRIC_CONFIG.models) {
    this.manager = manager;
    this.actorManager = actorManager;
    this.globalActors = globalActors;
    this.mainAgent = mainAgent;
    this.participants = participants;
    this.control = control;
    this.lifecycle = lifecycle;
    this.agentToolPreviewEnabled = agentToolPreviewEnabled;
    this.residency = residency;
    this.ownsRuntime = ownsRuntime;
    this.modelsConfig = modelsConfig;
    this.#lifecycleScheduler = new LifecycleDeliveryScheduler(
      DEFAULT_LIFECYCLE_COALESCE_MS,
      (target, batch) => this.#routeLifecycleBatch(target, batch),
      (target, batch, error) => {
        console.warn(
          `[pi-fabric] lifecycle delivery to ${target} failed for ${batch.length} event(s): ` + (error instanceof Error ? error.message : String(error))
        );
      }
    );
  }
  #transcripts = new AgentTranscriptReader();
  name = "agents";
  description = "The user-facing Main target, one-shot Pi or Claude Code agents, and persistent mailbox actors over process, tmux, screen, LocalTerm, or Herdr";
  #lifecycleScheduler;
  #lifecycleMessage(event) {
    const status = event.status ? ` with status ${event.status}` : "";
    const run = event.runId ? ` (run ${event.runId.slice(0, 8)})` : "";
    return `Fabric lifecycle ${event.event} from ${event.source.name} (${event.source.id})${run}${status}.`;
  }
  async #routeLifecycleBatch(target, batch) {
    const first = batch[0];
    const single = batch.length === 1;
    const message2 = single ? this.#lifecycleMessage(first.event) : `Fabric lifecycle events (${batch.length}):
` + batch.map((delivery) => `- ${this.#lifecycleMessage(delivery.event)}`).join("\n");
    const data = single ? first.event : batch.map((delivery) => delivery.event);
    const last = batch[batch.length - 1];
    await this.routeMessage(
      target,
      message2,
      data,
      first.subscription.delivery,
      void 0,
      {
        from: single ? lifecycleSourceIdentity(first.event.source) : lifecycleSourceIdentity(last.event.source),
        triggerTurn: batch.some((delivery) => delivery.subscription.triggerTurn)
      }
    );
  }
  /**
   * Resolve an explicit Pi-runner model selector against the authenticated
   * registry, honoring models.aliases and pi-model-sort recency for inexact
   * terms. Unresolvable selectors pass through verbatim: the child Pi runtime
   * resolves catalog refresh state and custom ids itself and reports its own
   * error when nothing matches.
   */
  #resolvePiModelArgs(args, context) {
    const runner = args.runner === "pi" || args.runner === "claude" || args.runner === "veda" ? args.runner : this.manager.config.runner;
    if (runner !== "pi") return args;
    const model = typeof args.model === "string" ? args.model.trim() : "";
    if (!model) return args;
    let available = [];
    try {
      available = context.extensionContext.modelRegistry.getAvailable().map((candidate) => ({
        provider: String(candidate.provider),
        id: String(candidate.id),
        ...typeof candidate.name === "string" ? { name: candidate.name } : {}
      }));
    } catch {
      available = [];
    }
    if (available.length === 0) return args;
    const resolution = resolveFabricModel(model, {
      aliases: this.modelsConfig().aliases,
      available,
      lastUsed: loadModelUsage()
    });
    if (resolution.kind !== "resolved" && resolution.kind !== "already-active") return args;
    const key = `${resolution.model.provider}/${resolution.model.id}`;
    return key === model ? args : { ...args, model: key };
  }
  async list(request, _context) {
    const query = request.query?.toLowerCase();
    return query ? AGENTS_ACTION_DESCRIPTORS.filter(
      (descriptor) => `${descriptor.name} ${descriptor.description}`.toLowerCase().includes(query)
    ) : AGENTS_ACTION_DESCRIPTORS;
  }
  async describe(actionName, _context) {
    return AGENTS_ACTION_DESCRIPTORS.find((descriptor) => descriptor.name === actionName);
  }
  prepareArguments(actionName, args) {
    return normalizeAgentsArgs(actionName, args);
  }
  async handoff(args, context) {
    const model = typeof args.model === "string" ? args.model.trim() : "";
    if (!model) throw new Error("agents.handoff requires an explicit Pi target model");
    checkedHandoffCompaction(args.compact);
    if (!context.deferHandoff) {
      throw new Error(
        "agents.handoff must be scheduled from inside fabric_exec and completed at its outer result boundary"
      );
    }
    const handoffArgs = { ...args };
    delete handoffArgs.cwd;
    return context.deferHandoff({ ...handoffArgs, model });
  }
  async executeHandoff(args, context, sessionSeed) {
    const model = typeof args.model === "string" ? args.model.trim() : "";
    if (!model) throw new Error("agents.handoff requires an explicit Pi target model");
    const request = runRequest(
      this.#resolvePiModelArgs(
        {
          ...args,
          task: handoffTask(args),
          name: typeof args.name === "string" && args.name.trim() ? args.name : "Trajectory handoff",
          runner: "pi",
          model
        },
        context
      ),
      context,
      this.manager,
      { allowCwd: false }
    );
    request.runner = "pi";
    request.sessionSeed = sessionSeed;
    const handoffCompaction = checkedHandoffCompaction(args.compact);
    if (handoffCompaction) request.handoffCompact = handoffCompaction;
    request.thinkingTransfer = resolveThinkingTransfer(
      context.extensionContext,
      model,
      sessionSeed.sourceModel
    );
    const handle = await this.manager.spawn(request, context.signal);
    context.activity?.({
      type: "entity",
      id: handle.id,
      kind: "agent",
      name: handle.name
    });
    context.update(
      `Trajectory handed off to ${handle.name} (${model}); caller is waiting for implementation`
    );
    const completed = await waitWithProgress(
      this.manager,
      this.#transcripts,
      handle.id,
      context,
      this.agentToolPreviewEnabled
    );
    context.update(
      completed.status === "completed" ? `Handoff ${handle.name} completed implementation` : `Handoff ${handle.name} ended with ${completed.status}`
    );
    return compactHandoffResult(completed);
  }
  async invoke(actionName, args, context) {
    switch (actionName) {
      case "run": {
        const handle = await this.manager.spawn(
          runRequest(this.#resolvePiModelArgs(args, context), context, this.manager),
          context.signal
        );
        this.participants.scheduleRefresh();
        context.activity?.({
          type: "entity",
          id: handle.id,
          kind: "agent",
          name: handle.name
        });
        context.update(agentStartedMessage(handle));
        return waitWithProgress(
          this.manager,
          this.#transcripts,
          handle.id,
          context,
          this.agentToolPreviewEnabled
        );
      }
      case "handoff":
        return this.handoff(args, context);
      case "spawn": {
        const request = runRequest(this.#resolvePiModelArgs(args, context), context, this.manager);
        validateAgentCwdRequest(request);
        const durableRequest = request.residency === "durable" && request.cwd !== void 0 ? { ...request, cwd: this.manager.resolveCwd(request.cwd) } : request;
        const handle = durableRequest.residency === "durable" ? await this.#resident().spawnAgent(durableRequest, context.signal) : await this.manager.spawn(durableRequest, context.signal);
        if (request.residency !== "durable") this.manager.detachSignal(handle.id);
        this.participants.scheduleRefresh();
        context.activity?.({
          type: "entity",
          id: handle.id,
          kind: "agent",
          name: handle.name
        });
        context.update(agentStartedMessage(handle));
        return handle;
      }
      case "wait": {
        const id = String(args.id);
        if (this.residency?.hasAgent(id)) {
          const status2 = this.residency.statusAgent(id);
          context.activity?.({ type: "entity", id, kind: "agent", name: status2.name });
          context.update(`Waiting for durable agent ${status2.name}`);
          return this.residency.waitAgent(id, context.signal);
        }
        const status = this.manager.status(id);
        context.activity?.({ type: "entity", id, kind: "agent", name: status.name });
        return waitWithProgress(
          this.manager,
          this.#transcripts,
          id,
          context,
          this.agentToolPreviewEnabled
        );
      }
      case "status": {
        const id = String(args.id);
        if (this.mainAgent.matches(id)) {
          if (this.mainAgent.local) return this.mainAgent.info(context.extensionContext);
          const root = this.participants.get(this.mainAgent.id);
          if (!root) throw new Error(`Unknown Fabric Main participant: ${this.mainAgent.id}`);
          return root;
        }
        try {
          return this.manager.status(id);
        } catch (error) {
          if (!(error instanceof Error && /Unknown Fabric agent/.test(error.message))) throw error;
        }
        if (this.residency?.hasAgent(id)) return this.residency.statusAgent(id);
        const known = this.participants.get(id);
        if (known && !known.local) return known;
        try {
          return this.actorManager.status(id);
        } catch (error) {
          if (!(error instanceof Error && /Unknown Fabric actor/.test(error.message))) throw error;
        }
        const participant = this.participants.get(id);
        if (!participant) throw new Error(`Unknown Fabric participant: ${id}`);
        return participant;
      }
      case "list":
        return this.#listAgents(args.scope);
      case "members": {
        const kinds = Array.isArray(args.kinds) ? args.kinds.filter(
          (kind) => kind === "root" || kind === "agent" || kind === "actor"
        ) : void 0;
        return this.participants.list({
          scope: this.#participantScope(args.scope, "project"),
          ...kinds ? { kinds } : {},
          ...args.includeStale === true ? { includeStale: true } : {}
        });
      }
      case "self":
        return this.participants.self();
      case "main":
        return this.mainAgent.info(context.extensionContext);
      case "peers":
        return this.participants.peers();
      case "subscribe": {
        const events = Array.isArray(args.events) ? args.events.filter(isFabricLifecycleEventType) : [];
        if (typeof args.triggerTurn !== "boolean") {
          throw new Error("Lifecycle subscriptions require explicit triggerTurn: true or false");
        }
        const delivery = args.delivery === "steer" || args.delivery === "followUp" ? args.delivery : void 0;
        if (!delivery) throw new Error("Invalid lifecycle subscription delivery");
        const subscription = await this.lifecycle.subscribe({
          from: this.#participantAlias(String(args.from)),
          events,
          to: this.#participantAlias(typeof args.to === "string" ? args.to : "main"),
          delivery,
          triggerTurn: args.triggerTurn,
          ...args.once === true ? { once: true } : {}
        });
        context.update(
          `Subscribed ${subscription.to.slice(0, 8)} to ${subscription.events.join(", ")} from ${subscription.from.slice(0, 8)}`
        );
        return subscription;
      }
      case "subscriptions":
        return this.lifecycle.list({
          ...typeof args.from === "string" ? { from: this.#participantAlias(args.from) } : {},
          ...typeof args.to === "string" ? { to: this.#participantAlias(args.to) } : {}
        });
      case "unsubscribe":
        return this.lifecycle.unsubscribe(String(args.id));
      case "models": {
        const runner = args.runner === "pi" || args.runner === "claude" ? args.runner : this.manager.config.runner;
        if (runner === "veda") {
          return [];
        }
        if (runner === "claude") {
          const models = await this.manager.claudeModels(args.refresh === true);
          return models.map((model) => ({
            runner: "claude",
            provider: "claude",
            id: model.value,
            name: model.displayName,
            key: `claude/${model.value}`,
            ...model
          }));
        }
        try {
          const available = context.extensionContext.modelRegistry.getAvailable();
          return available.map((model) => ({
            runner: "pi",
            provider: String(model.provider),
            id: String(model.id),
            name: String(model.name ?? model.id),
            key: `${model.provider}/${model.id}`
          }));
        } catch {
          return [];
        }
      }
      case "switchModel": {
        const query = typeof args.model === "string" ? args.model.trim() : "";
        if (!query) {
          throw new Error(
            "agents.switchModel requires a model selector: provider/id, models.aliases name, or search term"
          );
        }
        const registry = context.extensionContext.modelRegistry;
        let available = [];
        try {
          available = registry.getAvailable().map((model) => ({
            provider: String(model.provider),
            id: String(model.id),
            ...typeof model.name === "string" ? { name: model.name } : {}
          }));
        } catch {
          available = [];
        }
        if (available.length === 0) {
          throw new Error(
            "agents.switchModel found no authenticated models; configure a provider key or check agents.models()"
          );
        }
        const currentModel = context.extensionContext.model ?? void 0;
        const resolution = resolveFabricModel(query, {
          aliases: this.modelsConfig().aliases,
          available,
          lastUsed: loadModelUsage(),
          ...currentModel ? { current: { provider: currentModel.provider, id: currentModel.id } } : {},
          ...typeof args.provider === "string" && args.provider.trim() ? { provider: args.provider.trim() } : {}
        });
        if (resolution.kind === "already-active") {
          return {
            switched: false,
            reason: "already-active",
            model: `${resolution.model.provider}/${resolution.model.id}`,
            ...resolution.model.name ? { name: resolution.model.name } : {}
          };
        }
        if (resolution.kind === "ambiguous") {
          throw new Error(
            `agents.switchModel: "${query}" matches multiple models: ${resolution.candidates.map((candidate) => `${candidate.provider}/${candidate.id}`).join(", ")}. Pass an exact provider/id.`
          );
        }
        if (resolution.kind === "not-found") {
          throw new Error(
            resolution.tried !== void 0 ? `agents.switchModel: alias "${query}" has no available target. Tried: ${resolution.tried.join(", ")}` : `agents.switchModel: no available model matching "${query}"`
          );
        }
        if (typeof this.mainAgent.switchModel !== "function") {
          throw new Error("agents.switchModel requires a local Main session");
        }
        const previous = currentModel ? `${currentModel.provider}/${currentModel.id}` : void 0;
        const outcome = await this.mainAgent.switchModel(
          { provider: resolution.model.provider, id: resolution.model.id },
          context.extensionContext
        );
        if (!outcome.ok) {
          throw new Error(`agents.switchModel: ${outcome.error ?? "switch failed"}`);
        }
        context.activity?.({
          type: "progress",
          message: `Main model ${previous ? `${previous} \u2192 ` : ""}${resolution.model.provider}/${resolution.model.id}`
        });
        return {
          switched: true,
          model: `${resolution.model.provider}/${resolution.model.id}`,
          ...resolution.model.name ? { name: resolution.model.name } : {},
          ...previous ? { previous } : {},
          ...resolution.via !== void 0 ? { via: resolution.via } : {},
          ...resolution.via !== void 0 && !FUZZY_RESOLUTION_MARKERS.includes(resolution.via) ? { alias: resolution.via } : {}
        };
      }
      case "stop":
        return this.stopParticipant(String(args.id));
      case "cleanup": {
        const id = String(args.id);
        return this.residency?.hasAgent(id) ? this.residency.cleanupAgent(id, args.deleteBranch === true) : this.manager.cleanup(id, args.deleteBranch === true);
      }
      case "create": {
        const createArgs = this.#resolvePiModelArgs(args, context);
        if (createArgs.scope === "global") {
          return this.globalActors.create(actorRequest(createArgs, context, this.manager, false));
        }
        const request = actorRequest(createArgs, context, this.manager);
        if (request.residency === "durable" && !this.residency) {
          const client = this.#residentActorClient();
          const actor2 = await client.createActor(request);
          context.activity?.({ type: "entity", id: actor2.id, kind: "actor", name: actor2.name });
          return actor2;
        }
        if (request.residency === "durable") {
          await this.#resident().ensureHost();
          let actor2;
          try {
            actor2 = await this.actorManager.create(request);
            if (actor2.residency === "durable") await this.#activateDurableActor(actor2);
          } catch (error) {
            if (!(error instanceof Error) || !error.message.includes("registry is owned by another host")) {
              throw error;
            }
            const config = this.#resident().options.config;
            const client = new ResidentActorClient(config.meshRoot, config.rootId);
            actor2 = await client.createActor(request);
          }
          this.participants.scheduleRefresh();
          context.activity?.({ type: "entity", id: actor2.id, kind: "actor", name: actor2.name });
          return actor2;
        }
        const actor = await this.actorManager.create(request);
        this.participants.scheduleRefresh();
        context.activity?.({ type: "entity", id: actor.id, kind: "actor", name: actor.name });
        return actor;
      }
      case "ask": {
        const id = String(args.id);
        const message2 = String(args.message);
        this.actorManager.validateDirectMessage(message2, args.data);
        const overrides = actorRunBinding(args);
        const { actor, participant } = this.#resolveActorTarget(id);
        context.activity?.({
          type: "entity",
          id: actor?.id ?? participant.id,
          kind: "actor",
          name: actor?.name ?? participant.name
        });
        if (actor && this.actorManager.owns(actor.id)) {
          return waitWithActorProgress(
            this.manager,
            this.#transcripts,
            actor.id,
            actor.name,
            this.actorManager.ask(actor.id, message2, args.data, context.signal, { overrides }),
            context,
            this.agentToolPreviewEnabled
          );
        }
        if (!participant) throw new Error(`Fabric actor ${actor.id} has no live execution owner`);
        if (!participant.capabilities.includes("ask")) {
          throw new Error(`Fabric actor owner ${participant.ownerHostId} does not support remote ask`);
        }
        const binding = actor ? this.actorManager.resolveBinding(actor.id, overrides) : overrides;
        const needsBinding = Boolean(binding.model || binding.thinking);
        if (needsBinding && !participant.capabilities.includes("actor-bindings")) {
          throw new Error(`Fabric actor owner ${participant.ownerHostId} does not support session bindings`);
        }
        if (!this.control || participant.controlProtocol === "legacy") {
          throw new Error(`Fabric actor owner ${participant.ownerHostId} has no result control channel`);
        }
        return this.control.requestResult(
          participant.ownerHostId,
          participant.id,
          "ask",
          {
            message: message2,
            ...args.data === void 0 ? {} : { data: args.data },
            ...needsBinding ? { binding } : {}
          },
          participant.ownerIdentityId,
          {
            timeoutMs: (actor?.timeoutMs ?? this.manager.config.timeoutMs) + REMOTE_ASK_ACK_GRACE_MS,
            ...context.signal ? { signal: context.signal } : {}
          }
        );
      }
      case "tell":
        return this.routeMessage(
          String(args.id),
          String(args.message),
          args.data,
          "followUp",
          context,
          { binding: actorRunBinding(args) }
        );
      case "steer":
        return this.routeMessage(
          String(args.id),
          String(args.message),
          args.data,
          "steer",
          context
        );
      case "followUp":
        return this.routeMessage(
          String(args.id),
          String(args.message),
          args.data,
          "followUp",
          context
        );
      case "setSteeringMode":
        return this.manager.setSteeringMode(String(args.id), this.#steeringMode(args.mode));
      case "setFollowUpMode":
        return this.manager.setFollowUpMode(String(args.id), this.#steeringMode(args.mode));
      case "compact": {
        const id = String(args.id);
        const status = this.manager.status(id);
        context.activity?.({ type: "entity", id, kind: "agent", name: status.name });
        const instructions = typeof args.instructions === "string" ? args.instructions : void 0;
        const result = this.manager.compact(id, instructions);
        context.activity?.({
          type: "progress",
          message: `Compaction enqueued for agent ${id.slice(0, 8)} (advisory; commits at the child's next turn boundary)`
        });
        return result;
      }
      case "actorStatus":
        return this.actorManager.status(String(args.id));
      case "actors":
        return args.scope === "global" ? this.globalActors.list() : this.actorManager.list();
      case "messages": {
        const actor = this.actorManager.status(String(args.id));
        return this.actorManager.messages(
          actor.id,
          typeof args.limit === "number" ? args.limit : 50
        );
      }
      case "setModel":
        return this.actorManager.setModel(
          String(args.id),
          typeof args.model === "string" ? args.model : void 0,
          args.scope === "project" ? "project" : "session"
        );
      case "setThinking":
        return this.actorManager.setThinking(
          String(args.id),
          typeof args.thinking === "string" ? args.thinking : void 0,
          args.scope === "project" ? "project" : "session"
        );
      case "setTools": {
        const tools = stringArray(args.tools) ?? [];
        if (args.scope === "global") {
          return this.globalActors.update(String(args.id), { tools });
        }
        return this.actorManager.setTools(String(args.id), tools);
      }
      case "setEvents": {
        const events = Array.isArray(args.events) ? args.events.filter(
          (event) => isFabricActorHostEvent(event)
        ) : [];
        return this.actorManager.setEvents(String(args.id), events);
      }
      case "setDeliveryPolicy": {
        const delivery = args.delivery;
        if (typeof args.triggerTurn !== "boolean") {
          throw new Error("setDeliveryPolicy requires explicit triggerTurn: true or false");
        }
        const triggerTurn = args.triggerTurn;
        if (args.scope === "global") {
          return this.globalActors.update(String(args.id), { delivery, triggerTurn });
        }
        return this.actorManager.setDeliveryPolicy(String(args.id), delivery, triggerTurn);
      }
      case "clearMessages":
        return this.actorManager.clearMessages(String(args.id));
      case "remove": {
        if (args.scope === "global") return this.globalActors.remove(String(args.id));
        const { actor, participant } = this.#resolveActorTarget(String(args.id));
        if (actor && this.actorManager.owns(actor.id)) return this.actorManager.remove(actor.id);
        const residency = actor?.residency ?? participant?.residency;
        if (residency !== "durable") throw new Error("Only the owning host can remove this actor");
        const id = actor?.id ?? participant.id;
        return this.residency ? this.residency.removeActor(id) : this.#residentActorClient().removeActor(id);
      }
      case "setInstructions": {
        const id = String(args.id);
        const instructions = String(args.instructions);
        if (args.scope === "global") {
          return this.globalActors.update(id, { instructions });
        }
        return this.actorManager.setInstructions(id, instructions);
      }
      case "import": {
        const key = typeof args.id === "string" && args.id.trim() ? args.id.trim() : typeof args.name === "string" && args.name.trim() ? args.name.trim() : "";
        if (!key) throw new Error("Import requires a template id or name");
        const def = this.globalActors.resolve(key);
        if (!def) throw new Error(`Unknown global actor: ${key}`);
        const as = typeof args.as === "string" && args.as.trim() ? args.as.trim() : void 0;
        const request = this.globalActors.toRequest(def, as);
        if (request.residency === "durable") await this.#resident().ensureHost();
        const actor = await this.actorManager.create(request);
        if (actor.residency === "durable") await this.#activateDurableActor(actor);
        context.activity?.({ type: "entity", id: actor.id, kind: "actor", name: actor.name });
        return actor;
      }
      case "export": {
        const actor = this.actorManager.status(String(args.id));
        const overwrite = args.overwrite === true;
        const def = this.actorManager.definition(actor.id);
        return this.globalActors.create(def, overwrite);
      }
      case "log": {
        const id = String(args.id);
        const type = args.type === "run" || args.type === "all" ? args.type : "session";
        const lines = typeof args.lines === "number" ? args.lines : 200;
        const runId = typeof args.runId === "string" ? args.runId : void 0;
        const before = typeof args.before === "number" ? args.before : void 0;
        try {
          const actor = this.actorManager.status(id);
          return this.actorManager.readLog(actor.id, {
            type,
            lines,
            ...runId ? { runId } : {},
            ...before !== void 0 ? { before } : {}
          });
        } catch (error) {
          if (!(error instanceof Error && /Unknown Fabric actor/.test(error.message))) throw error;
        }
        if (this.residency?.hasAgent(id)) {
          return this.residency.readAgentLog(id, {
            lines,
            ...before !== void 0 ? { before } : {}
          });
        }
        return this.manager.readLog(id, { lines, ...before !== void 0 ? { before } : {} });
      }
      default:
        throw new Error(`Unknown agents action: ${actionName}`);
    }
  }
  async routeMessage(id, message2, data, kind, context, options = {}) {
    if (this.mainAgent.matches(id)) {
      if (this.mainAgent.local) {
        context?.activity?.({
          type: "entity",
          id: this.mainAgent.id,
          kind: "agent",
          name: "Main"
        });
        return this.mainAgent.deliverAgent({
          from: options.from ?? this.actorManager.identity,
          message: message2,
          delivery: kind,
          ...typeof options.triggerTurn === "boolean" ? { triggerTurn: options.triggerTurn } : {},
          ...data === void 0 ? {} : { data }
        });
      }
      const participant2 = this.participants.get(this.mainAgent.id);
      if (!participant2) throw new Error(`Unknown Fabric Main participant: ${this.mainAgent.id}`);
      if (!participant2.capabilities.includes(kind)) {
        throw new Error(`Fabric participant ${participant2.id} does not support ${kind}`);
      }
      if (!this.control || participant2.controlProtocol === "legacy") {
        return this.actorManager.steerRemote(this.mainAgent.id, message2, kind, data);
      }
      return this.control.request(
        participant2.ownerHostId,
        participant2.id,
        kind,
        {
          message: message2,
          data,
          ...typeof options.triggerTurn === "boolean" ? { triggerTurn: options.triggerTurn } : {}
        },
        participant2.ownerIdentityId
      );
    }
    try {
      const status = this.manager.status(id);
      context?.activity?.({ type: "entity", id, kind: "agent", name: status.name });
      const result = kind === "steer" ? this.manager.steer(id, message2, data) : this.manager.followUp(id, message2, data);
      return { queued: true, messageId: result.messageId, routed: "local" };
    } catch (error) {
      if (!(error instanceof Error && /Unknown Fabric agent/.test(error.message))) throw error;
    }
    this.actorManager.validateDirectMessage(message2, data);
    let target;
    try {
      target = this.#resolveActorTarget(id);
    } catch (error) {
      if (error instanceof Error && /Unknown Fabric actor/.test(error.message)) {
        throw new Error(`Unknown Fabric participant: ${id}`);
      }
      throw error;
    }
    const { actor, participant } = target;
    if (actor && (!participant || participant.local)) {
      context?.activity?.({ type: "entity", id: actor.id, kind: "actor", name: actor.name });
      const result = this.actorManager.tell(actor.id, message2, data, {
        ...options.binding ? { overrides: options.binding } : {}
      });
      return { queued: true, messageId: result.messageId, routed: "local" };
    }
    if (!participant) throw new Error(`Fabric actor ${actor.id} has no live execution owner`);
    if (!participant.capabilities.includes(kind)) {
      throw new Error(`Fabric participant ${participant.id} does not support ${kind}`);
    }
    const sessionBinding = actor?.binding;
    const binding = actor ? this.actorManager.resolveBinding(actor.id, options.binding) : options.binding;
    const needsBinding = Boolean(
      binding?.model || binding?.thinking || sessionBinding?.model || sessionBinding?.thinking
    );
    if (needsBinding && !participant.capabilities.includes("actor-bindings")) {
      throw new Error(`Fabric actor owner ${participant.ownerHostId} does not support session bindings`);
    }
    if (!this.control || participant.controlProtocol === "legacy") {
      if (needsBinding) {
        throw new Error(`Fabric actor owner ${participant.ownerHostId} has no binding control channel`);
      }
      return this.actorManager.steerRemote(participant.id, message2, kind, data);
    }
    return this.control.request(
      participant.ownerHostId,
      participant.id,
      kind,
      {
        message: message2,
        data,
        ...typeof options.triggerTurn === "boolean" ? { triggerTurn: options.triggerTurn } : {},
        ...needsBinding && binding ? { binding } : {}
      },
      participant.ownerIdentityId
    );
  }
  /** Flush pending coalesced lifecycle deliveries; used by tests and shutdown. */
  flushLifecycleDeliveries() {
    return this.#lifecycleScheduler.flushAll();
  }
  async deliverLifecycle(subscription, event) {
    this.#lifecycleScheduler.schedule(subscription.to, { subscription, event });
  }
  async acceptControl(command, from, signal) {
    if (command.operation === "cancel") {
      return { accepted: false, error: "Cancel commands are handled by the control plane" };
    }
    if (command.operation === "stop") {
      try {
        await this.manager.stop(command.targetId);
        this.participants.scheduleRefresh();
        return { accepted: true, messageId: command.commandId };
      } catch (error) {
        if (!(error instanceof Error && /Unknown Fabric agent/.test(error.message))) {
          return { accepted: false, error: error instanceof Error ? error.message : String(error) };
        }
      }
      try {
        const actor = this.actorManager.status(command.targetId);
        const ownership = this.participants.get(actor.id);
        if (ownership && !ownership.local) {
          return { accepted: false, error: `Participant ${actor.id} is owned by ${ownership.ownerHostId}` };
        }
        await this.actorManager.stop(actor.id);
        this.participants.scheduleRefresh();
        return { accepted: true, messageId: command.commandId };
      } catch (error) {
        if (!(error instanceof Error && /Unknown Fabric actor/.test(error.message))) {
          return { accepted: false, error: error instanceof Error ? error.message : String(error) };
        }
      }
      return { accepted: false, error: `Owner does not control Fabric participant ${command.targetId}` };
    }
    const message2 = command.message?.trim();
    if (!message2) return { accepted: false, error: "Fabric control message must not be empty" };
    if (command.operation === "ask") {
      try {
        const actor = this.actorManager.status(command.targetId);
        const ownership = this.participants.get(actor.id);
        if (ownership && !ownership.local) {
          return {
            accepted: false,
            error: `Participant ${actor.id} is owned by ${ownership.ownerHostId}`
          };
        }
        const result = await this.actorManager.ask(
          actor.id,
          message2,
          command.data,
          signal,
          command.binding !== void 0 ? { binding: command.binding } : {}
        );
        return { accepted: true, messageId: result.id, result };
      } catch (error) {
        return {
          accepted: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
    if (this.mainAgent.local && this.mainAgent.matches(command.targetId)) {
      const result = this.mainAgent.deliverAgent({
        from,
        message: message2,
        delivery: command.operation,
        ...typeof command.triggerTurn === "boolean" ? { triggerTurn: command.triggerTurn } : {},
        ...command.data === void 0 ? {} : { data: command.data }
      });
      return { accepted: true, messageId: result.messageId };
    }
    try {
      this.manager.status(command.targetId);
      const result = command.operation === "steer" ? this.manager.steer(command.targetId, message2, command.data) : this.manager.followUp(command.targetId, message2, command.data);
      return { accepted: true, messageId: result.messageId };
    } catch (error) {
      if (!(error instanceof Error && /Unknown Fabric agent/.test(error.message))) {
        return { accepted: false, error: error instanceof Error ? error.message : String(error) };
      }
    }
    try {
      const actor = this.actorManager.status(command.targetId);
      const ownership = this.participants.get(actor.id);
      if (ownership && !ownership.local) {
        return { accepted: false, error: `Participant ${actor.id} is owned by ${ownership.ownerHostId}` };
      }
      const result = this.actorManager.tell(
        actor.id,
        message2,
        command.data,
        command.binding !== void 0 ? { binding: command.binding } : {}
      );
      return { accepted: true, messageId: result.messageId };
    } catch (error) {
      if (!(error instanceof Error && /Unknown Fabric actor/.test(error.message))) {
        return { accepted: false, error: error instanceof Error ? error.message : String(error) };
      }
    }
    return { accepted: false, error: `Owner does not control Fabric participant ${command.targetId}` };
  }
  #resolveActorTarget(id) {
    let actor;
    try {
      actor = this.actorManager.status(id);
    } catch (error) {
      if (!(error instanceof Error && /Unknown Fabric actor/.test(error.message))) throw error;
    }
    const participant = this.participants.get(actor?.id ?? id);
    if (!actor && (!participant || participant.kind !== "actor")) {
      throw new Error(`Unknown Fabric actor: ${id}`);
    }
    return {
      ...actor ? { actor } : {},
      ...participant?.kind === "actor" ? { participant } : {}
    };
  }
  #residentActorClient() {
    const client = ResidentActorClient.fromEnv();
    if (client) return client;
    throw new Error(
      "Durable residency requires a trusted project with Fabric mesh persistence enabled"
    );
  }
  #resident() {
    if (!this.residency) {
      throw new Error(
        "Durable residency requires a trusted project with Fabric mesh persistence enabled"
      );
    }
    return this.residency;
  }
  async #activateDurableActor(actor) {
    const residency = this.#resident();
    await this.actorManager.cede(actor.id);
    await this.participants.refresh();
    try {
      await residency.ensureActor(actor.id);
    } catch (error) {
      try {
        await residency.removeActor(actor.id);
      } catch {
        this.actorManager.reclaim(actor.id);
      }
      await this.participants.refresh().catch(() => void 0);
      throw error;
    }
  }
  #listAgents(scopeValue) {
    const scope = this.#participantScope(scopeValue, "local");
    if (scope === "local") return this.manager.list();
    const local = /* @__PURE__ */ new Map();
    const append = (record) => {
      local.set(record.id, record);
      if ("nestedAgents" in record) {
        for (const nested of record.nestedAgents ?? []) append(nested);
      }
    };
    for (const record of this.manager.list()) append(record);
    for (const record of this.residency?.listAgents() ?? []) append(record);
    const listed = this.participants.list({ scope, kinds: ["agent"] }).map((participant) => local.get(participant.id) ?? participant);
    const seen = new Set(listed.map((record) => record.id));
    for (const record of this.residency?.listAgents() ?? []) {
      if (!seen.has(record.id)) listed.push(record);
    }
    return listed;
  }
  #participantAlias(value) {
    const id = value.trim();
    return id === "main" ? this.mainAgent.id : id;
  }
  #participantScope(value, fallback) {
    return value === "local" || value === "lineage" || value === "project" ? value : fallback;
  }
  async stopParticipant(id) {
    try {
      const result = await this.manager.stop(id);
      this.participants.scheduleRefresh();
      return result;
    } catch (error) {
      if (!(error instanceof Error && /Unknown Fabric agent/.test(error.message))) throw error;
    }
    try {
      const actor = this.actorManager.status(id);
      const ownership = this.participants.get(actor.id);
      if (!ownership || ownership.local) {
        const result = await this.actorManager.stop(actor.id);
        this.participants.scheduleRefresh();
        return result;
      }
    } catch (error) {
      if (!(error instanceof Error && /Unknown Fabric actor/.test(error.message))) throw error;
    }
    const participant = this.participants.get(id);
    if (!participant) throw new Error(`Unknown Fabric participant: ${id}`);
    if (!participant.capabilities.includes("stop")) {
      throw new Error(`Fabric participant ${id} cannot be stopped`);
    }
    if (!this.control) throw new Error("Fabric control plane is unavailable");
    return this.control.request(
      participant.ownerHostId,
      participant.id,
      "stop",
      {},
      participant.ownerIdentityId
    );
  }
  #steeringMode(mode) {
    if (mode === "all" || mode === "one-at-a-time") return mode;
    throw new Error(
      `Invalid steering mode: ${String(mode)} (expected "all" or "one-at-a-time")`
    );
  }
  async close() {
    this.#transcripts.clear();
    if (!this.ownsRuntime) return;
    await this.lifecycle.close();
    try {
      await this.actorManager.close();
    } finally {
      await this.manager.close();
    }
  }
};

// src/providers/captured-tools-provider.ts
import path6 from "node:path";
var textFromContent2 = (content) => content.filter((part) => part.type === "text").map((part) => part.text).join("\n");
var sourceLabel = (sourceInfo) => {
  if (sourceInfo.path.startsWith("<")) return sourceInfo.source;
  const segments = sourceInfo.path.split(/[\\/]/);
  const packageSegment = [...segments].reverse().find((segment) => segment.startsWith("pi-"));
  if (packageSegment) return packageSegment;
  const filename = path6.basename(sourceInfo.path).replace(/\.[^.]+$/, "");
  if (filename && filename !== "index") return filename;
  return path6.basename(path6.dirname(sourceInfo.path)) || sourceInfo.source;
};
var capturedToolNamespace = (entry) => `extension:${sourceLabel(entry.sourceInfo)}`;
var descriptorFrom = (entry) => ({
  name: entry.name,
  description: `${entry.definition.description} (captured from ${sourceLabel(entry.sourceInfo)})`,
  inputSchema: entry.definition.parameters,
  risk: entry.risk,
  namespace: capturedToolNamespace(entry)
});
var asInvocationResult = (entry, result, isError) => ({
  content: result.content,
  text: textFromContent2(result.content),
  ...result.details !== void 0 ? { details: result.details } : {},
  isError,
  ...result.terminate !== void 0 ? { terminate: result.terminate } : {},
  source: entry.sourceInfo
});
var CapturedToolScheduler = class {
  #sequentialTail = Promise.resolve();
  #parallel = /* @__PURE__ */ new Set();
  run(mode, operation) {
    if (mode === "sequential") {
      const precedingParallel = [...this.#parallel];
      const result2 = this.#sequentialTail.then(() => Promise.allSettled(precedingParallel)).then(operation);
      this.#sequentialTail = result2.then(
        () => void 0,
        () => void 0
      );
      return result2;
    }
    const result = this.#sequentialTail.then(operation);
    this.#parallel.add(result);
    void result.then(
      () => this.#parallel.delete(result),
      () => this.#parallel.delete(result)
    );
    return result;
  }
};
var CapturedToolsProvider = class {
  constructor(catalog) {
    this.catalog = catalog;
  }
  name = "extensions";
  description = "Tools captured from other Pi extensions and invoked lazily through Fabric";
  #scheduler = new CapturedToolScheduler();
  async list(request, _context) {
    const query = request.query?.trim().toLowerCase();
    const descriptors6 = this.catalog.list().map(descriptorFrom);
    if (!query) return descriptors6;
    return descriptors6.filter(
      (descriptor) => `${descriptor.name} ${descriptor.description} ${descriptor.namespace ?? ""}`.toLowerCase().includes(query)
    );
  }
  async describe(actionName, _context) {
    const entry = this.catalog.get(actionName);
    return entry ? descriptorFrom(entry) : void 0;
  }
  prepareArguments(actionName, args) {
    const prepare = this.catalog.require(actionName).wrappedTool.prepareArguments;
    if (!prepare) return args;
    const prepared = prepare(args);
    if (typeof prepared !== "object" || prepared === null || Array.isArray(prepared)) {
      throw new Error(`Captured tool ${actionName} prepared non-object arguments`);
    }
    return prepared;
  }
  async invoke(actionName, args, context) {
    const entry = this.catalog.require(actionName);
    return this.#scheduler.run(
      entry.definition.executionMode,
      () => runAbortable(context.signal, () => this.#invokeCaptured(entry, args, context))
    );
  }
  async #invokeCaptured(entry, args, context) {
    const { runner, wrappedTool } = entry;
    const toolCallId = context.nestedToolCallId;
    await runAbortable(context.signal, () => runner.emit({
      type: "tool_execution_start",
      toolCallId,
      toolName: entry.name,
      args
    }));
    let result;
    let isError = false;
    let thrown;
    let executionStarted = false;
    let updateTail = Promise.resolve();
    try {
      const preflight = await runAbortable(context.signal, () => runner.emitToolCall({
        type: "tool_call",
        toolName: entry.name,
        toolCallId,
        input: args
      }));
      context.updateArguments?.(args);
      if (preflight?.block) {
        throw new Error(preflight.reason || `Captured tool ${entry.name} was blocked`);
      }
      executionStarted = true;
      result = await runAbortable(
        context.signal,
        () => wrappedTool.execute(toolCallId, args, context.signal, (partialResult) => {
          const progress = textFromContent2(partialResult.content).trim();
          if (progress) context.update(`${entry.name}: ${progress.slice(0, 500)}`);
          updateTail = updateTail.then(
            () => runAbortable(context.signal, () => runner.emit({
              type: "tool_execution_update",
              toolCallId,
              toolName: entry.name,
              args,
              partialResult
            }))
          ).catch(() => void 0);
        })
      );
    } catch (error) {
      thrown = entry.name === "bash" && executionStarted ? classifyPiBashError(error) : error;
      isError = true;
      result = {
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : String(error)
          }
        ],
        details: { capturedToolError: true }
      };
    }
    await updateTail;
    throwIfAborted(context.signal);
    const patch = await runAbortable(context.signal, () => runner.emitToolResult({
      type: "tool_result",
      toolName: entry.name,
      toolCallId,
      input: args,
      content: result.content,
      details: result.details,
      isError
    }));
    if (patch) {
      result = {
        ...result,
        content: patch.content ?? result.content,
        ...patch.details !== void 0 ? { details: patch.details } : {}
      };
      isError = patch.isError ?? isError;
    }
    await runAbortable(context.signal, () => runner.emit({
      type: "tool_execution_end",
      toolCallId,
      toolName: entry.name,
      result,
      isError
    }));
    if (isError) {
      if (entry.name === "bash") throw piBashResultError(thrown, textFromContent2(result.content));
      const text = textFromContent2(result.content).trim();
      throw new Error(
        text || (thrown instanceof Error ? thrown.message : `Captured tool ${entry.name} failed`)
      );
    }
    return asInvocationResult(entry, result, false);
  }
};

// src/providers/compact-provider.ts
import { Type } from "typebox";
import { Value } from "typebox/value";
var requestSchema = Type.Object({
  reason: Type.Optional(Type.String({
    maxLength: 1024,
    description: "Short human-readable reason for the compaction"
  })),
  instructions: Type.Optional(Type.String({
    maxLength: MAX_COMPACTION_INSTRUCTIONS_CHARS,
    description: "Custom compaction instructions forwarded to Pi core"
  })),
  preserve: Type.Optional(Type.Array(
    Type.String({ maxLength: MAX_PRESERVE_ITEM_CHARS }),
    {
      maxItems: MAX_PRESERVE_ITEMS,
      description: "Explicit bounded facts to preserve, encoded as a typed Fabric compaction request"
    }
  )),
  requestedBy: Type.Optional(Type.String({
    maxLength: 256,
    description: "Who requested the compaction (default: model)"
  }))
}, { additionalProperties: false });
var checkedRequestArguments = (args) => {
  if (!Value.Check(requestSchema, args)) {
    const message2 = [...Value.Errors(requestSchema, args)].slice(0, 5).map((error) => error.message).join("; ");
    throw new Error(`Invalid compact.request arguments: ${message2}`);
  }
  const input = args;
  const boundsError = compactionRequestBoundsError({
    ...input.instructions !== void 0 ? { instructions: input.instructions } : {},
    ...input.preserve !== void 0 ? { preserve: input.preserve } : {}
  });
  if (boundsError) throw new Error(`Invalid compact.request arguments: ${boundsError.message}`);
  if (input.preserve !== void 0) {
    encodeCompactionRequest({
      ...input.instructions !== void 0 ? { instructions: input.instructions } : {},
      preserve: input.preserve
    });
  }
  return input;
};
var emptySchema = {
  type: "object",
  properties: {},
  additionalProperties: false
};
var descriptors = [
  {
    name: "request",
    description: "Request an advisory compaction of the host session's context at the next safe boundary (agent_settled). The host commits it only between turns, never mid-turn. A new request replaces any pending one.",
    inputSchema: requestSchema,
    risk: "write"
  },
  {
    name: "status",
    description: "Read the pending compaction intent and the last compaction outcome",
    inputSchema: emptySchema,
    risk: "read"
  },
  {
    name: "cancel",
    description: "Clear a pending compaction intent before the host commits it",
    inputSchema: emptySchema,
    // Cancel mutates the compaction controller; it is not a read. The "read"
    // label predates effect tracking and would have let speculative PTC
    // pre-fire a control action that may never execute in the real program.
    risk: "write"
  }
];
var normalizeCompactArgs = actionArgNormalizer(() => descriptors);
var CompactProvider = class {
  constructor(controller) {
    this.controller = controller;
  }
  name = "compact";
  description = "Programmatic, advisory-then-committed context compaction for the host Pi session";
  async list(request, _context) {
    const query = request.query?.toLowerCase();
    return query ? descriptors.filter(
      (descriptor) => `${descriptor.name} ${descriptor.description}`.toLowerCase().includes(query)
    ) : descriptors;
  }
  async describe(actionName, _context) {
    return descriptors.find((descriptor) => descriptor.name === actionName);
  }
  prepareArguments(actionName, args) {
    return normalizeCompactArgs(actionName, args);
  }
  async invoke(actionName, args, context) {
    switch (actionName) {
      case "request": {
        const input = checkedRequestArguments(args);
        const intent = this.controller.request({
          ...input.reason !== void 0 ? { reason: input.reason } : {},
          ...input.instructions !== void 0 ? { instructions: input.instructions } : {},
          ...input.preserve !== void 0 ? { preserve: input.preserve } : {},
          ...input.requestedBy !== void 0 ? { requestedBy: input.requestedBy } : {}
        });
        context.activity?.({
          type: "entity",
          id: "host-compact",
          kind: "custom",
          name: "Context compaction"
        });
        context.activity?.({
          type: "progress",
          message: intent.reason ? `Compaction requested: ${intent.reason}` : "Compaction requested (advisory; commits at next agent_settled)"
        });
        return { requested: true, intent };
      }
      case "status":
        return this.controller.status();
      case "cancel":
        this.controller.cancel();
        context.activity?.({ type: "progress", message: "Compaction request cancelled" });
        return { cancelled: true };
      default:
        throw new Error(`Unknown compact action: ${actionName}`);
    }
  }
};

// src/providers/components-provider.ts
var descriptors2 = [
  {
    name: "list",
    description: "List registered component definitions and configured component instances.",
    inputSchema: { type: "object", additionalProperties: false },
    risk: "read",
    effect: { kind: "none", resources: ["fabric:components"], ordering: "commutative" }
  },
  {
    name: "status",
    description: "Inspect one component's lifecycle state, committed capability target, and cleanup diagnostics.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", minLength: 1 } },
      required: ["id"],
      additionalProperties: false
    },
    risk: "read",
    effect: { kind: "none", resources: ["fabric:components"], ordering: "commutative" }
  },
  {
    name: "graph",
    description: "Inspect component requirement/provision edges and detected dependency cycles.",
    inputSchema: { type: "object", additionalProperties: false },
    risk: "read",
    effect: { kind: "none", resources: ["fabric:components"], ordering: "commutative" }
  },
  {
    name: "reload",
    description: "Restart one component, or all loaded components, with rollback to the previous revision on activation failure.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", minLength: 1 } },
      additionalProperties: false
    },
    risk: "execute",
    effect: { kind: "transactional", resources: ["fabric:components"], ordering: "ordered" }
  }
];
var ComponentsProvider = class {
  constructor(loader) {
    this.loader = loader;
  }
  name = "components";
  description = "Supervised component lifecycle, exact capability dependencies, effect cleanup, and reload diagnostics.";
  async list(request, _context) {
    const query = request.query?.normalize("NFKC").trim().toLowerCase();
    const filtered = query ? descriptors2.filter(
      (descriptor) => `${descriptor.name} ${descriptor.description}`.toLowerCase().includes(query)
    ) : descriptors2;
    return filtered.slice(0, Math.max(1, Math.min(request.limit ?? 100, 100)));
  }
  async describe(actionName, _context) {
    return descriptors2.find((descriptor) => descriptor.name === actionName);
  }
  async invoke(actionName, args, _context) {
    switch (actionName) {
      case "list":
        return {
          definitions: this.loader.definitions(),
          components: this.loader.list()
        };
      case "status": {
        const id = args.id;
        if (typeof id !== "string" || !id.trim()) throw new Error("components.status requires id");
        return this.loader.status(id);
      }
      case "graph":
        return this.loader.graph();
      case "reload": {
        const id = args.id;
        if (id !== void 0 && (typeof id !== "string" || !id.trim())) {
          throw new Error("components.reload id must be a non-empty string");
        }
        return {
          components: await this.loader.reload(typeof id === "string" ? id : void 0)
        };
      }
      default:
        throw new Error(`Unknown components action: ${actionName}`);
    }
  }
};

// src/providers/mcp-descriptor-cache.ts
import fs5 from "node:fs/promises";
import fsSync from "node:fs";
import os from "node:os";
import path7 from "node:path";
var MCP_DESCRIPTOR_CACHE_VERSION = 1;
var expandHome = (input) => {
  if (!input.startsWith("~")) return input;
  const home = os.homedir();
  if (input === "~") return home;
  if (input.startsWith("~/") || input.startsWith("~\\")) {
    return path7.join(home, input.slice(2));
  }
  return input;
};
var legacyMcporterDir = () => path7.join(os.homedir(), ".mcporter");
var mcporterConfigDir = () => {
  const raw = process.env.XDG_CONFIG_HOME;
  if (raw && raw.trim().length > 0) {
    const resolved = expandHome(raw.trim());
    if (path7.isAbsolute(resolved)) return path7.join(resolved, "mcporter");
  }
  return legacyMcporterDir();
};
var mcporterConfigCandidates = () => {
  const base = mcporterConfigDir();
  const candidates = [path7.join(base, "mcporter.json"), path7.join(base, "mcporter.jsonc")];
  const legacy = legacyMcporterDir();
  if (base !== legacy) {
    candidates.push(path7.join(legacy, "mcporter.json"), path7.join(legacy, "mcporter.jsonc"));
  }
  return candidates;
};
var pathExists = (filePath) => {
  try {
    fsSync.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
};
var mcpConfigLayerPaths = (rootDir, configPath) => {
  const explicitRaw = configPath ?? process.env.MCPORTER_CONFIG;
  if (explicitRaw && explicitRaw.trim().length > 0) {
    return [path7.resolve(expandHome(explicitRaw.trim()))];
  }
  const paths = [];
  const home = mcporterConfigCandidates().find(pathExists);
  if (home) paths.push(home);
  const projectPath = path7.resolve(rootDir, "config", "mcporter.json");
  if (pathExists(projectPath)) paths.push(projectPath);
  return paths;
};
var statConfigLayers = async (rootDir, configPath) => {
  const stats = await Promise.all(
    mcpConfigLayerPaths(rootDir, configPath).map(async (layerPath) => {
      try {
        const stat2 = await fs5.stat(layerPath);
        return { path: layerPath, mtimeMs: stat2.mtimeMs, size: stat2.size };
      } catch {
        return void 0;
      }
    })
  );
  return stats.filter((stat2) => stat2 !== void 0);
};
var sameConfigLayers = (left, right) => left.length === right.length && left.every((layer, index) => {
  const other = right[index];
  return other !== void 0 && layer.path === other.path && layer.size === other.size && Math.abs(layer.mtimeMs - other.mtimeMs) <= 1;
});
var hashServerDefinition = (definition) => stableJsonHash(definition);
var isRecord2 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var parseCachedServer = (value) => {
  if (!isRecord2(value)) return void 0;
  const tools = Array.isArray(value.tools) ? value.tools.filter(
    (tool) => isRecord2(tool) && typeof tool.name === "string"
  ) : void 0;
  if (typeof value.definitionHash !== "string" || tools === void 0) return void 0;
  return {
    definitionHash: value.definitionHash,
    transport: typeof value.transport === "string" ? value.transport : "unknown",
    description: typeof value.description === "string" ? value.description : null,
    fetchedAt: typeof value.fetchedAt === "string" ? value.fetchedAt : "",
    stale: value.stale === true,
    tools
  };
};
var parseCacheFile = (value) => {
  if (!isRecord2(value) || value.version !== MCP_DESCRIPTOR_CACHE_VERSION) return void 0;
  if (!Array.isArray(value.layers) || !isRecord2(value.servers)) return void 0;
  const layers = value.layers.filter(
    (layer) => isRecord2(layer) && typeof layer.path === "string" && typeof layer.mtimeMs === "number" && typeof layer.size === "number"
  );
  return {
    version: MCP_DESCRIPTOR_CACHE_VERSION,
    layers,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : "",
    servers: value.servers
  };
};
var tempCounter = 0;
var McpDescriptorCacheStore = class {
  constructor(filePath) {
    this.filePath = filePath;
  }
  async load() {
    try {
      const raw = await fs5.readFile(this.filePath, "utf8");
      return parseCacheFile(JSON.parse(raw));
    } catch {
      return void 0;
    }
  }
  // Atomic-ish write: temp file then rename, so a concurrent reader either
  // sees the previous cache or the next one, never a torn document.
  async save(file) {
    const directory = path7.dirname(this.filePath);
    await fs5.mkdir(directory, { recursive: true });
    const tempPath = path7.join(
      directory,
      `.mcp-cache-${process.pid}-${Date.now()}-${tempCounter++}.tmp`
    );
    await fs5.writeFile(tempPath, JSON.stringify(file, null, 2));
    try {
      await fs5.rename(tempPath, this.filePath);
    } catch (error) {
      await fs5.rm(tempPath, { force: true }).catch(() => void 0);
      throw error;
    }
  }
};

// src/providers/mcp-provider.ts
import path8 from "node:path";
var TOOL_METADATA_TTL_MS = 6e4;
var REVALIDATE_CONCURRENCY = 3;
var REVALIDATE_SERVER_TIMEOUT_MS = 2e4;
var MIN_REVALIDATE_SERVER_TIMEOUT_MS = 5e3;
var NOTIFY_DEBOUNCE_MS = 100;
var PERSIST_DEBOUNCE_MS = 150;
var emptyObjectSchema = {
  type: "object",
  properties: {},
  additionalProperties: false
};
var managementDescriptors = [
  {
    name: "$servers",
    description: "List MCP servers discovered by mcporter",
    inputSchema: emptyObjectSchema,
    risk: "read",
    namespace: "management"
  },
  {
    name: "$reload",
    description: "Close MCP connections and reload mcporter configuration",
    inputSchema: emptyObjectSchema,
    risk: "network",
    namespace: "management"
  },
  {
    name: "$register",
    description: "Register an ephemeral MCP server in the pooled mcporter runtime",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        command: { type: "string" },
        args: { type: "array", items: { type: "string" } },
        cwd: { type: "string" },
        baseUrl: { type: "string" },
        headers: { type: "object", additionalProperties: { type: "string" } },
        env: { type: "object", additionalProperties: { type: "string" } },
        overwrite: { type: "boolean" }
      },
      required: ["name"],
      additionalProperties: false
    },
    risk: "execute",
    namespace: "management"
  },
  {
    name: "$call",
    description: "Call an MCP tool by explicit server and tool name",
    inputSchema: {
      type: "object",
      properties: {
        server: { type: "string" },
        tool: { type: "string" },
        args: { type: "object", additionalProperties: true }
      },
      required: ["server", "tool"],
      additionalProperties: false
    },
    risk: "network",
    namespace: "management"
  }
];
var normalizeSchema = (schema) => typeof schema === "object" && schema !== null && !Array.isArray(schema) ? schema : emptyObjectSchema;
var normalizeMcpResult = (result) => {
  if (typeof result !== "object" || result === null || Array.isArray(result)) return result;
  const record = result;
  if (!Array.isArray(record.content)) return result;
  const text = record.content.filter(
    (part) => typeof part === "object" && part !== null && part.type === "text" && typeof part.text === "string"
  ).map((part) => part.text).join("\n");
  if (record.isError === true) throw new Error(text || "MCP tool returned an error");
  return {
    text,
    content: record.content,
    structuredContent: record.structuredContent ?? null
  };
};
var withTimeout = (operation, timeoutMs, onTimeout) => new Promise((resolve2, reject) => {
  const timer = setTimeout(() => {
    onTimeout?.();
    reject(new Error(`MCP server listing timed out after ${timeoutMs}ms`));
  }, timeoutMs);
  timer.unref?.();
  operation.then(
    (value) => {
      clearTimeout(timer);
      resolve2(value);
    },
    (error) => {
      clearTimeout(timer);
      reject(error);
    }
  );
});
var McpProvider = class {
  constructor(cwd, config, options = {}) {
    this.cwd = cwd;
    this.config = config;
    this.#store = options.cache;
    this.#hooks = options.hooks ?? {};
  }
  name = "mcp";
  description = "External MCP tools discovered and pooled by mcporter";
  #runtime;
  #runtimeCreation;
  #toolMetadata = /* @__PURE__ */ new Map();
  #store;
  #hooks;
  #generation = 0;
  #closed = false;
  #hydration;
  #layerStats = [];
  #servers = /* @__PURE__ */ new Map();
  #pending = /* @__PURE__ */ new Map();
  #revalidateQueue = [];
  #revalidateQueued = /* @__PURE__ */ new Set();
  #recontacted = /* @__PURE__ */ new Set();
  #revalidating;
  #autoKicked = false;
  #dirtyPersist = false;
  #dirtyNotify = false;
  #persistTimer;
  #notifyTimer;
  get #cacheOn() {
    return this.config.cache.enabled;
  }
  async list(request, context) {
    if (!this.config.enabled) return [];
    if (!this.#cacheOn) return this.#listLegacy(request, context);
    await this.#hydrate();
    this.#kickRevalidation();
    const query = request.query?.toLowerCase();
    const filterQuery = (descriptors6) => query ? descriptors6.filter(
      (descriptor) => `${descriptor.name} ${descriptor.description}`.toLowerCase().includes(query)
    ) : descriptors6;
    if (request.namespace) {
      const server = await this.#resolveKnownServer(request.namespace);
      if (!server) return [];
      let entry = this.#servers.get(server);
      if (!entry) {
        entry = await this.#fetchServerTools(server).catch(() => void 0);
        if (!entry) return [];
      }
      return filterQuery(entry.tools.map((tool) => this.#toolDescriptor(server, tool)));
    }
    return [
      ...managementDescriptors,
      ...filterQuery(this.sliceDescriptors())
    ];
  }
  async describe(actionName, context) {
    const management = managementDescriptors.find((descriptor) => descriptor.name === actionName);
    if (management) return management;
    if (!this.config.enabled) return void 0;
    if (!this.#cacheOn) return this.#describeLegacy(actionName, context);
    const parsed = this.#parseToolName(actionName);
    if (!parsed) return void 0;
    await this.#hydrate();
    const server = await this.#resolveKnownServer(parsed.server);
    if (!server) return void 0;
    let entry = this.#servers.get(server);
    let tool = entry ? this.#resolveTool(entry.tools, parsed.tool) : void 0;
    if (!tool) {
      entry = await this.#fetchServerTools(server).catch(() => void 0);
      tool = entry ? this.#resolveTool(entry.tools, parsed.tool) : void 0;
    }
    if (entry?.stale) this.#scheduleRevalidate([server]);
    return tool ? this.#toolDescriptor(server, tool) : void 0;
  }
  async invoke(actionName, args, context) {
    if (!this.config.enabled) throw new Error("MCP support is disabled in Fabric configuration");
    if (actionName === "$servers") {
      const runtime = await this.#getRuntime();
      return runtime.listServers().map((server) => {
        const definition = runtime.getDefinition(server);
        if (!this.#cacheOn) {
          return {
            name: server,
            description: definition.description ?? null,
            transport: definition.command.kind
          };
        }
        const entry = this.#servers.get(server);
        return {
          name: server,
          description: definition.description ?? null,
          transport: definition.command.kind,
          tools: entry?.tools.length ?? 0,
          stale: entry === void 0 || entry.stale
        };
      });
    }
    if (actionName === "$reload") {
      await this.#resetRuntime();
      if (this.#cacheOn) {
        this.#servers.clear();
        this.#pending.clear();
        this.#recontacted.clear();
        this.#hydration = void 0;
        await this.#hydrate();
        this.#kickRevalidation(true);
      }
      return { servers: (await this.#getRuntime()).listServers() };
    }
    if (actionName === "$register") {
      if (!this.config.allowDynamicServers) {
        throw new Error("Dynamic MCP server registration is disabled in Fabric configuration");
      }
      const definition = this.#serverDefinition(args);
      const runtime = await this.#getRuntime();
      runtime.registerDefinition(definition, { overwrite: args.overwrite === true });
      this.#toolMetadata.delete(definition.name);
      if (this.#cacheOn) {
        void this.#hydrate().then(() => {
          this.#servers.delete(definition.name);
          this.#pending.set(definition.name, {
            definitionHash: hashServerDefinition(definition),
            transport: definition.command.kind,
            description: definition.description ?? null,
            ephemeral: true
          });
          this.#scheduleRevalidate([definition.name]);
        }).catch(() => void 0);
      }
      return { registered: definition.name };
    }
    if (actionName === "$call") {
      const server = String(args.server);
      const tool = String(args.tool);
      const toolArgs = typeof args.args === "object" && args.args !== null && !Array.isArray(args.args) ? args.args : {};
      return this.#call(server, tool, toolArgs, context.signal);
    }
    const parsed = this.#parseToolName(actionName);
    if (!parsed) throw new Error(`Invalid MCP action: ${actionName}`);
    return this.#call(parsed.server, parsed.tool, args, context.signal);
  }
  async close() {
    this.#closed = true;
    this.#revalidateQueue.length = 0;
    this.#revalidateQueued.clear();
    if (this.#notifyTimer) clearTimeout(this.#notifyTimer);
    if (this.#persistTimer) clearTimeout(this.#persistTimer);
    this.#notifyTimer = void 0;
    this.#persistTimer = void 0;
    if (this.#dirtyPersist) await this.#persistNow().catch(() => void 0);
    await this.#resetRuntime();
  }
  // Fire-and-forget session warm-up: hydrate from the descriptor cache, then
  // start the background revalidation policy. Never awaited by session start.
  warmup() {
    if (!this.config.enabled || !this.#cacheOn) return;
    void this.#hydrate().then(() => this.#kickRevalidation()).catch(() => void 0);
  }
  // Provider-fidelity descriptors for everything currently known, cached or
  // ephemeral.
  sliceDescriptors() {
    const descriptors6 = [];
    for (const [server, entry] of this.#servers) {
      for (const tool of entry.tools) descriptors6.push(this.#toolDescriptor(server, tool));
    }
    return descriptors6;
  }
  // Test/ops hook: await hydration and any in-flight background revalidation,
  // then flush pending persistence and notifications.
  async settle() {
    await this.#hydrate();
    while (this.#revalidating) await this.#revalidating;
    if (this.#notifyTimer) {
      clearTimeout(this.#notifyTimer);
      this.#notifyTimer = void 0;
    }
    if (this.#dirtyNotify) this.#notifyNow();
    if (this.#persistTimer) {
      clearTimeout(this.#persistTimer);
      this.#persistTimer = void 0;
    }
    if (this.#dirtyPersist) await this.#persistNow().catch(() => void 0);
  }
  async #call(serverName, toolName, args, signal) {
    if (!this.#cacheOn) return this.#callLegacy(serverName, toolName, args, signal);
    if (signal?.aborted) throw new Error("MCP call cancelled");
    await this.#hydrate();
    const server = await this.#resolveKnownServer(serverName);
    if (!server) throw new Error(`Unknown MCP server: ${serverName}`);
    let entry = this.#servers.get(server);
    let tool = entry ? this.#resolveTool(entry.tools, toolName) : void 0;
    if (!tool) {
      entry = await this.#fetchServerTools(server).catch(() => void 0);
      tool = entry ? this.#resolveTool(entry.tools, toolName) : void 0;
    }
    if (signal?.aborted) throw new Error("MCP call cancelled");
    if (!tool) throw new Error(`Unknown MCP tool: ${serverName}.${toolName}`);
    const runtime = await this.#getRuntime();
    const firstContact = !this.#recontacted.has(server);
    if (firstContact) this.#recontacted.add(server);
    const operation = runtime.callTool(server, tool.name, {
      args,
      timeoutMs: this.config.callTimeoutMs,
      disableOAuth: this.config.disableOAuth
    });
    try {
      const result = await this.#withAbort(operation, signal, () => runtime.close(server));
      return normalizeMcpResult(result);
    } catch (error) {
      const existing = this.#servers.get(server);
      if (existing) {
        existing.stale = true;
        this.#schedulePersist();
        this.#scheduleNotify();
      }
      this.#scheduleRevalidate([server]);
      throw error;
    } finally {
      if (firstContact) this.#scheduleRevalidate([server]);
    }
  }
  async #withAbort(operation, signal, abort) {
    if (!signal) return operation;
    if (signal.aborted) throw new Error("MCP call cancelled");
    return new Promise((resolve2, reject) => {
      const onAbort = () => {
        void Promise.resolve(abort()).catch(() => void 0);
        reject(new Error("MCP call cancelled"));
      };
      signal.addEventListener("abort", onAbort, { once: true });
      void operation.then(
        (value) => {
          signal.removeEventListener("abort", onAbort);
          resolve2(value);
        },
        (error) => {
          signal.removeEventListener("abort", onAbort);
          reject(error);
        }
      );
    });
  }
  // Session-opening hydration: adopt the persisted descriptor cache. Never
  // spawns a server — config-only operations at worst.
  #hydrate() {
    if (!this.#cacheOn) return Promise.resolve();
    this.#hydration ??= this.#hydrateInternal().catch(() => void 0);
    return this.#hydration;
  }
  async #hydrateInternal() {
    const generation = this.#generation;
    const snapshot = this.#store ? await this.#store.load().catch(() => void 0) : void 0;
    this.#layerStats = await statConfigLayers(this.cwd, this.config.configPath);
    if (generation !== this.#generation) return;
    if (snapshot && sameConfigLayers(snapshot.layers, this.#layerStats)) {
      for (const [name, raw] of Object.entries(snapshot.servers)) {
        const parsed = parseCachedServer(raw);
        if (parsed) this.#servers.set(name, this.#toWorking(parsed, false));
      }
      this.#scheduleNotify();
      return;
    }
    try {
      const runtime = await this.#getRuntime();
      for (const definition of runtime.getDefinitions()) {
        const hash = hashServerDefinition(definition);
        const recorded = snapshot?.servers[definition.name];
        const parsed = recorded ? parseCachedServer(recorded) : void 0;
        if (parsed && parsed.definitionHash === hash) {
          this.#servers.set(definition.name, this.#toWorking(parsed, false));
        } else {
          const existing = this.#pending.get(definition.name);
          this.#pending.set(definition.name, {
            definitionHash: hash,
            transport: definition.command.kind,
            description: definition.description ?? null,
            ephemeral: existing?.ephemeral ?? false
          });
        }
      }
      this.#dirtyPersist = true;
      this.#schedulePersist();
    } catch {
      if (snapshot) {
        for (const [name, raw] of Object.entries(snapshot.servers)) {
          const parsed = parseCachedServer(raw);
          if (parsed && !this.#servers.has(name)) {
            this.#servers.set(name, this.#toWorking(parsed, false));
          }
        }
        console.warn(
          "[pi-fabric] MCP config could not be parsed; serving last-known cached MCP tools."
        );
      }
    }
    this.#scheduleNotify();
  }
  #toWorking(cached, ephemeral) {
    return {
      definitionHash: cached.definitionHash,
      transport: cached.transport,
      description: cached.description,
      fetchedAt: cached.fetchedAt,
      stale: cached.stale,
      ephemeral,
      tools: cached.tools.map((tool) => ({ ...tool }))
    };
  }
  #kickRevalidation(forceAll = false) {
    if (this.#closed || !this.#cacheOn) return;
    if (!forceAll && this.#autoKicked) return;
    this.#autoKicked = true;
    const policy = this.config.cache.revalidate;
    if (policy === "off" && !forceAll) return;
    const targets = forceAll || policy === "all" ? [...this.#servers.keys(), ...this.#pending.keys()] : [...this.#pending.keys()];
    this.#scheduleRevalidate(targets);
  }
  #scheduleRevalidate(servers) {
    if (this.#closed || !this.#cacheOn) return;
    for (const server of servers) {
      if (this.#revalidateQueued.has(server)) continue;
      this.#revalidateQueued.add(server);
      this.#revalidateQueue.push(server);
    }
    if (this.#revalidating || this.#revalidateQueue.length === 0) return;
    this.#revalidating = this.#drainRevalidation().catch(() => void 0).finally(() => {
      this.#revalidating = void 0;
      if (this.#revalidateQueue.length > 0 && !this.#closed) this.#scheduleRevalidate([]);
    });
    void this.#revalidating;
  }
  async #drainRevalidation() {
    const generation = this.#generation;
    const deadline = Date.now() + Math.max(1e3, this.config.cache.revalidateBudgetMs);
    const perServerTimeout = Math.max(
      MIN_REVALIDATE_SERVER_TIMEOUT_MS,
      Math.min(REVALIDATE_SERVER_TIMEOUT_MS, this.config.cache.revalidateBudgetMs)
    );
    while (!this.#closed && generation === this.#generation) {
      if (Date.now() > deadline) break;
      const batch = [];
      while (batch.length < REVALIDATE_CONCURRENCY && this.#revalidateQueue.length > 0) {
        const next = this.#revalidateQueue.shift();
        if (next === void 0) break;
        this.#revalidateQueued.delete(next);
        batch.push(next);
      }
      if (batch.length === 0) break;
      const results = await Promise.allSettled(
        batch.map((server) => this.#fetchServerTools(server, perServerTimeout))
      );
      results.forEach((result, index) => {
        if (result.status !== "rejected") return;
        const server = batch[index];
        if (server === void 0) return;
        const existing = this.#servers.get(server);
        if (existing) {
          existing.stale = true;
          this.#schedulePersist();
          this.#scheduleNotify();
        }
      });
    }
  }
  // Live tool listing for exactly one server; on success updates the working
  // copy and persistence. Used by the background revalidator and by explicit
  // single-server fetches.
  async #fetchServerTools(server, timeoutMs) {
    const generation = this.#generation;
    const runtime = await this.#getRuntime();
    const listing = runtime.listTools(server, {
      includeSchema: true,
      disableOAuth: this.config.disableOAuth
    });
    const tools = timeoutMs === void 0 ? await listing : await withTimeout(listing, timeoutMs, () => {
      void runtime.close(server).catch(() => void 0);
    });
    if (generation !== this.#generation || this.#closed) {
      throw new Error(`MCP server listing superseded: ${server}`);
    }
    let definition;
    try {
      definition = runtime.getDefinition(server);
    } catch {
      this.#pending.delete(server);
      this.#servers.delete(server);
      this.#schedulePersist();
      this.#scheduleNotify();
      throw new Error(`Unknown MCP server: ${server}`);
    }
    const pending = this.#pending.get(server);
    const entry = {
      definitionHash: hashServerDefinition(definition),
      transport: definition.command.kind,
      description: definition.description ?? null,
      fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
      stale: false,
      ephemeral: pending?.ephemeral ?? false,
      tools
    };
    this.#servers.set(server, entry);
    this.#pending.delete(server);
    this.#schedulePersist();
    this.#scheduleNotify();
    return entry;
  }
  // Resolve a requested (possibly sanitized) name to the raw server name
  // across the working copy, pending set, and — as a config-only fallback —
  // the runtime's definition list.
  async #resolveKnownServer(requested) {
    if (this.#servers.has(requested) || this.#pending.has(requested)) return requested;
    const known = [...this.#servers.keys(), ...this.#pending.keys()];
    const matches = known.filter((name) => sanitizeMcpRefPart(name) === requested);
    if (matches.length === 1) return matches[0];
    const runtime = await this.#getRuntime();
    const servers = runtime.listServers();
    if (servers.includes(requested)) return requested;
    const sanitized = servers.filter((name) => sanitizeMcpRefPart(name) === requested);
    return sanitized.length === 1 ? sanitized[0] : void 0;
  }
  #schedulePersist() {
    if (!this.#store || this.#closed) return;
    this.#dirtyPersist = true;
    if (this.#persistTimer) return;
    this.#persistTimer = setTimeout(() => {
      this.#persistTimer = void 0;
      void this.#persistNow().catch(() => void 0);
    }, PERSIST_DEBOUNCE_MS);
    this.#persistTimer.unref?.();
  }
  #persistNow() {
    this.#dirtyPersist = false;
    if (!this.#store) return Promise.resolve();
    const servers = {};
    for (const [name, entry] of this.#servers) {
      if (entry.ephemeral) continue;
      servers[name] = {
        definitionHash: entry.definitionHash,
        transport: entry.transport,
        description: entry.description,
        fetchedAt: entry.fetchedAt,
        stale: entry.stale,
        tools: entry.tools.map((tool) => {
          const annotations = tool.annotations;
          return {
            name: tool.name,
            ...tool.description !== void 0 ? { description: tool.description } : {},
            ...tool.inputSchema !== void 0 ? { inputSchema: tool.inputSchema } : {},
            ...tool.outputSchema !== void 0 ? { outputSchema: tool.outputSchema } : {},
            ...annotations !== void 0 ? { annotations: { ...annotations } } : {}
          };
        })
      };
    }
    return this.#store.save({
      version: MCP_DESCRIPTOR_CACHE_VERSION,
      layers: this.#layerStats,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      servers
    });
  }
  #scheduleNotify() {
    if (this.#closed) return;
    this.#dirtyNotify = true;
    if (this.#notifyTimer) return;
    this.#notifyTimer = setTimeout(() => {
      this.#notifyTimer = void 0;
      this.#notifyNow();
    }, NOTIFY_DEBOUNCE_MS);
    this.#notifyTimer.unref?.();
  }
  #notifyNow() {
    if (!this.#dirtyNotify || this.#closed) return;
    this.#dirtyNotify = false;
    try {
      this.#hooks.onSliceChanged?.(this.sliceDescriptors());
    } catch {
    }
  }
  async #getRuntime() {
    if (this.#closed) throw new Error("MCP provider is closed");
    if (this.#runtime) return this.#runtime;
    const generation = this.#generation;
    if (this.#runtimeCreation?.generation === generation) {
      return this.#runtimeCreation.promise;
    }
    const promise = import("mcporter").then(({ createRuntime }) => createRuntime({
      rootDir: this.cwd,
      ...this.config.configPath ? { configPath: this.config.configPath } : {},
      clientInfo: { name: "pi-fabric", version: "0.1.0" }
    })).then(async (runtime) => {
      if (this.#closed || generation !== this.#generation) {
        await runtime.close().catch(() => void 0);
        throw new Error("MCP runtime creation was superseded");
      }
      this.#runtime = runtime;
      return runtime;
    });
    const creation = { generation, promise };
    this.#runtimeCreation = creation;
    void promise.finally(() => {
      if (this.#runtimeCreation === creation) this.#runtimeCreation = void 0;
    }).catch(() => void 0);
    return promise;
  }
  async #resetRuntime() {
    this.#generation += 1;
    const runtime = this.#runtime;
    const creation = this.#runtimeCreation?.promise;
    this.#runtime = void 0;
    this.#runtimeCreation = void 0;
    this.#toolMetadata.clear();
    await Promise.allSettled([
      runtime?.close() ?? Promise.resolve(),
      creation?.then(() => void 0, () => void 0) ?? Promise.resolve()
    ]);
  }
  #serverDefinition(args) {
    const name = String(args.name ?? "").trim();
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name)) {
      throw new Error("Dynamic MCP server names may contain letters, numbers, dots, underscores, and hyphens");
    }
    const description = typeof args.description === "string" ? args.description : void 0;
    const env = this.#stringRecord(args.env);
    if (typeof args.command === "string" && args.command.trim()) {
      const commandArgs = Array.isArray(args.args) ? args.args.filter((value) => typeof value === "string") : [];
      return {
        name,
        ...description ? { description } : {},
        command: {
          kind: "stdio",
          command: args.command,
          args: commandArgs,
          cwd: path8.resolve(this.cwd, typeof args.cwd === "string" ? args.cwd : ".")
        },
        ...env ? { env } : {}
      };
    }
    if (typeof args.baseUrl === "string" && args.baseUrl.trim()) {
      const headers = this.#stringRecord(args.headers);
      return {
        name,
        ...description ? { description } : {},
        command: {
          kind: "http",
          url: new URL(args.baseUrl),
          ...headers ? { headers } : {}
        },
        ...env ? { env } : {}
      };
    }
    throw new Error("Dynamic MCP registration requires either command or baseUrl");
  }
  #stringRecord(value) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
    const entries = Object.entries(value);
    if (entries.some((entry) => typeof entry[1] !== "string")) {
      throw new Error("MCP environment and header values must be strings");
    }
    return Object.fromEntries(entries);
  }
  #resolveServerName(runtime, requested) {
    const servers = runtime.listServers();
    if (servers.includes(requested)) return requested;
    const matches = servers.filter((server) => sanitizeMcpRefPart(server) === requested);
    return matches.length === 1 ? matches[0] : void 0;
  }
  #resolveTool(tools, requested) {
    return tools.find((tool) => tool.name === requested) ?? tools.find((tool) => sanitizeMcpRefPart(tool.name) === requested);
  }
  #parseToolName(actionName) {
    const separator = actionName.indexOf(".");
    if (separator <= 0 || separator === actionName.length - 1) return void 0;
    return { server: actionName.slice(0, separator), tool: actionName.slice(separator + 1) };
  }
  #toolDescriptor(server, tool) {
    const annotations = tool.annotations;
    return {
      name: `${server}.${tool.name}`,
      description: tool.description ?? `${tool.name} on MCP server ${server}`,
      inputSchema: normalizeSchema(tool.inputSchema),
      ...tool.outputSchema ? { outputSchema: normalizeSchema(tool.outputSchema) } : {},
      risk: "network",
      namespace: server,
      ...annotations ? { annotations: { ...annotations } } : {}
    };
  }
  // Live-everything path preserved for mcp.cache.enabled: false — the
  // pre-cache behavior with its 60s in-process metadata TTL.
  async #listLegacy(request, _context) {
    const runtime = await this.#getRuntime();
    const servers = request.namespace ? [request.namespace] : runtime.listServers();
    const settled = await Promise.allSettled(
      servers.map(async (server) => {
        const tools = await this.#listToolsLegacy(runtime, server);
        return tools.map((tool) => this.#toolDescriptor(server, tool));
      })
    );
    const descriptors6 = settled.flatMap(
      (entry) => entry.status === "fulfilled" ? entry.value : []
    );
    const query = request.query?.toLowerCase();
    const filtered = query ? descriptors6.filter(
      (descriptor) => `${descriptor.name} ${descriptor.description}`.toLowerCase().includes(query)
    ) : descriptors6;
    return request.namespace ? filtered : [...managementDescriptors, ...filtered];
  }
  async #describeLegacy(actionName, _context) {
    const parsed = this.#parseToolName(actionName);
    if (!parsed) return void 0;
    const runtime = await this.#getRuntime();
    const server = this.#resolveServerName(runtime, parsed.server);
    if (!server) return void 0;
    const tool = await this.#findToolLegacy(runtime, server, parsed.tool);
    return tool ? this.#toolDescriptor(server, tool) : void 0;
  }
  async #callLegacy(serverName, toolName, args, signal) {
    if (signal?.aborted) throw new Error("MCP call cancelled");
    const runtime = await this.#getRuntime();
    const server = this.#resolveServerName(runtime, serverName);
    if (!server) throw new Error(`Unknown MCP server: ${serverName}`);
    const tool = await this.#findToolLegacy(runtime, server, toolName);
    if (signal?.aborted) throw new Error("MCP call cancelled");
    if (!tool) throw new Error(`Unknown MCP tool: ${serverName}.${toolName}`);
    const operation = runtime.callTool(server, tool.name, {
      args,
      timeoutMs: this.config.callTimeoutMs,
      disableOAuth: this.config.disableOAuth
    });
    try {
      const result = await this.#withAbort(operation, signal, () => runtime.close(server));
      return normalizeMcpResult(result);
    } catch (error) {
      this.#toolMetadata.delete(server);
      throw error;
    }
  }
  async #listToolsLegacy(runtime, server, refresh = false) {
    const cached = this.#toolMetadata.get(server);
    if (!refresh && cached && cached.expiresAt > Date.now()) return cached.promise;
    const promise = runtime.listTools(server, {
      includeSchema: true,
      disableOAuth: this.config.disableOAuth
    });
    const entry = { expiresAt: Date.now() + TOOL_METADATA_TTL_MS, promise };
    this.#toolMetadata.set(server, entry);
    try {
      return await promise;
    } catch (error) {
      if (this.#toolMetadata.get(server) === entry) this.#toolMetadata.delete(server);
      throw error;
    }
  }
  async #findToolLegacy(runtime, server, requested) {
    const cached = this.#resolveTool(await this.#listToolsLegacy(runtime, server), requested);
    if (cached) return cached;
    return this.#resolveTool(await this.#listToolsLegacy(runtime, server, true), requested);
  }
};

// src/providers/mesh-provider.ts
var emptySchema2 = { type: "object", properties: {}, additionalProperties: false };
var INTERNAL_STATE_PREFIXES = ["topology/", "sessions/", "actors/", "residency/"];
var PRIVATE_STATE_PREFIXES = ["residency/"];
var INTERNAL_CONTROL_PREFIX = "fabric.control.";
var INTERNAL_HOST_EVENT_TOPIC = "fabric.actor.host-event";
var assertPublicStateKey = (key) => {
  if (INTERNAL_STATE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
    throw new Error(`Fabric mesh key is reserved for host coordination: ${key}`);
  }
};
var assertReadableStateKey = (key) => {
  if (PRIVATE_STATE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
    throw new Error(`Fabric mesh key is private host state: ${key}`);
  }
};
var descriptors3 = [
  {
    name: "self",
    description: "Return this Fabric participant's mesh identity",
    inputSchema: emptySchema2,
    risk: "read",
    namespace: "coordination"
  },
  {
    name: "publish",
    description: "Append a durable event to a mesh topic, optionally addressed to one actor",
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string" },
        kind: { type: "string" },
        to: { type: "string" },
        text: { type: "string" },
        data: {}
      },
      required: ["topic"],
      additionalProperties: false
    },
    risk: "agent",
    namespace: "coordination"
  },
  {
    name: "read",
    description: "Read durable mesh events after a sequence cursor",
    inputSchema: {
      type: "object",
      properties: {
        after: { type: "number", minimum: 0 },
        topic: { type: "string" },
        to: { type: "string" },
        limit: { type: "number", minimum: 1 }
      },
      additionalProperties: false
    },
    risk: "read",
    namespace: "coordination"
  },
  {
    name: "members",
    description: "List roots, agents, and actors in the unified project participant directory",
    inputSchema: {
      type: "object",
      properties: {
        scope: { type: "string", enum: ["local", "lineage", "project"] },
        kinds: {
          type: "array",
          items: { type: "string", enum: ["root", "agent", "actor"] }
        },
        includeStale: { type: "boolean" },
        limit: { type: "number", minimum: 1 }
      },
      additionalProperties: false
    },
    risk: "read",
    namespace: "coordination"
  },
  {
    name: "get",
    description: "Read a versioned value from shared mesh state",
    inputSchema: {
      type: "object",
      properties: { key: { type: "string" } },
      required: ["key"],
      additionalProperties: false
    },
    risk: "read",
    namespace: "coordination"
  },
  {
    name: "list",
    description: "List shared mesh state by key prefix",
    inputSchema: {
      type: "object",
      properties: {
        prefix: { type: "string" },
        limit: { type: "number", minimum: 1 }
      },
      additionalProperties: false
    },
    risk: "read",
    namespace: "coordination"
  },
  {
    name: "put",
    description: "Write shared mesh state, optionally with compare-and-swap version checking",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string" },
        value: {},
        ifVersion: { type: "number", minimum: 0 }
      },
      required: ["key", "value"],
      additionalProperties: false
    },
    risk: "agent",
    namespace: "coordination"
  },
  {
    name: "delete",
    description: "Delete shared mesh state, optionally with compare-and-swap version checking",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string" },
        ifVersion: { type: "number", minimum: 0 }
      },
      required: ["key"],
      additionalProperties: false
    },
    risk: "agent",
    namespace: "coordination"
  }
];
var normalizeMeshArgs = actionArgNormalizer(() => descriptors3);
var MeshProvider = class {
  constructor(store, identity, participants) {
    this.store = store;
    this.identity = identity;
    this.participants = participants;
  }
  name = "mesh";
  description = "Durable topics and compare-and-swap shared state for emergent agent coordination";
  async list(request, _context) {
    const query = request.query?.toLowerCase();
    return query ? descriptors3.filter(
      (descriptor) => `${descriptor.name} ${descriptor.description}`.toLowerCase().includes(query)
    ) : descriptors3;
  }
  async describe(actionName, _context) {
    return descriptors3.find((descriptor) => descriptor.name === actionName);
  }
  prepareArguments(actionName, args) {
    return normalizeMeshArgs(actionName, args);
  }
  async invoke(actionName, args, _context) {
    switch (actionName) {
      case "self":
        return this.identity;
      case "publish": {
        const topic = String(args.topic);
        if (topic.startsWith(INTERNAL_CONTROL_PREFIX) || topic === INTERNAL_HOST_EVENT_TOPIC || topic === FABRIC_PARTICIPANT_LIFECYCLE_TOPIC) {
          throw new Error(`Fabric mesh topic is reserved for host coordination: ${topic}`);
        }
        return this.store.publish({
          topic,
          from: this.identity,
          ...typeof args.kind === "string" ? { kind: args.kind } : {},
          ...typeof args.to === "string" ? { to: args.to } : {},
          ...typeof args.text === "string" ? { text: args.text } : {},
          ...args.data !== void 0 ? { data: args.data } : {}
        });
      }
      case "read":
        return this.store.read({
          ...typeof args.after === "number" ? { after: args.after } : {},
          ...typeof args.topic === "string" ? { topic: args.topic } : {},
          ...typeof args.to === "string" ? { to: args.to } : {},
          ...typeof args.limit === "number" ? { limit: args.limit } : {}
        });
      case "members": {
        const kinds = Array.isArray(args.kinds) ? args.kinds.filter(
          (kind) => kind === "root" || kind === "agent" || kind === "actor"
        ) : void 0;
        const scope = args.scope === "local" || args.scope === "lineage" || args.scope === "project" ? args.scope : "project";
        const limit = Math.max(1, Math.floor(typeof args.limit === "number" ? args.limit : 100));
        return this.participants.list({
          scope,
          ...kinds ? { kinds } : {},
          ...args.includeStale === true ? { includeStale: true } : {}
        }).slice(0, limit);
      }
      case "get": {
        const key = String(args.key);
        assertReadableStateKey(key);
        return this.store.get(key) ?? null;
      }
      case "list": {
        const prefix = typeof args.prefix === "string" ? args.prefix : "";
        assertReadableStateKey(prefix);
        const limit = Math.max(
          1,
          Math.min(
            Math.floor(typeof args.limit === "number" ? args.limit : 100),
            this.store.maxReadEvents
          )
        );
        return this.store.listAll(prefix).filter(
          (entry) => !PRIVATE_STATE_PREFIXES.some(
            (privatePrefix) => entry.key.startsWith(privatePrefix)
          )
        ).slice(0, limit);
      }
      case "put": {
        const key = String(args.key);
        assertPublicStateKey(key);
        return this.store.put({
          key,
          value: args.value,
          identity: this.identity,
          ...typeof args.ifVersion === "number" ? { ifVersion: args.ifVersion } : {}
        });
      }
      case "delete": {
        const key = String(args.key);
        assertPublicStateKey(key);
        return this.store.delete({
          key,
          ...typeof args.ifVersion === "number" ? { ifVersion: args.ifVersion } : {}
        });
      }
      default:
        throw new Error(`Unknown mesh action: ${actionName}`);
    }
  }
};

// src/providers/pi-tools-provider.ts
import { readFileSync as readFileSync2 } from "node:fs";
import path11 from "node:path";
import {
  createBashToolDefinition as createBashToolDefinition2,
  createEditToolDefinition,
  createFindToolDefinition,
  createGrepToolDefinition,
  createLsToolDefinition,
  createReadToolDefinition
} from "@earendil-works/pi-coding-agent";

// src/agents/bash-worktree-add.ts
import fs6 from "node:fs";
import path9 from "node:path";
var BARE_SAFE = /^[A-Za-z0-9_./:@%+=,-]+$/;
var parseGitWorktreeAdd = (command) => {
  const trimmed = command.trim();
  if (!trimmed || /[|&;()\n]/.test(trimmed)) return void 0;
  const tokens = trimmed.split(/\s+/);
  if (tokens[0] !== "git") return void 0;
  if (tokens.some((token) => !BARE_SAFE.test(token))) return void 0;
  let index = 1;
  let gitCwd;
  if (tokens[index] === "-C") {
    gitCwd = tokens[index + 1];
    if (!gitCwd) return void 0;
    index += 2;
  }
  if (tokens[index] !== "worktree" || tokens[index + 1] !== "add") return void 0;
  index += 2;
  let branch;
  let detach = false;
  let quiet = false;
  let flagsEnded = false;
  const positionals = [];
  while (index < tokens.length) {
    const token = tokens[index++];
    if (token === void 0) break;
    if (!flagsEnded && token === "--") {
      flagsEnded = true;
      continue;
    }
    if (!flagsEnded && (token === "-b" || token === "-B")) {
      if (branch) return void 0;
      const name = tokens[index++];
      if (!name) return void 0;
      branch = { flag: token, name };
      continue;
    }
    if (!flagsEnded && (token === "--detach" || token === "-d")) {
      detach = true;
      continue;
    }
    if (!flagsEnded && (token === "-q" || token === "--quiet")) {
      quiet = true;
      continue;
    }
    if (!flagsEnded && token.startsWith("-")) return void 0;
    positionals.push(token);
  }
  if (detach && branch) return void 0;
  if (positionals.length < 1 || positionals.length > 2) return void 0;
  return {
    ...gitCwd ? { gitCwd } : {},
    ...branch ? { branch } : {},
    detach,
    quiet,
    dest: positionals[0],
    ...positionals[1] ? { startPoint: positionals[1] } : {}
  };
};
var tryExecuteGitWorktreeAdd = async (args, sessionCwd) => {
  const command = args.command;
  if (typeof command !== "string") return void 0;
  const parsed = parseGitWorktreeAdd(command);
  if (!parsed) return void 0;
  const gitCwd = parsed.gitCwd ? path9.resolve(sessionCwd, parsed.gitCwd) : typeof args.cwd === "string" ? args.cwd : sessionCwd;
  const dest = path9.resolve(gitCwd, parsed.dest);
  let gitRoot;
  try {
    const root = await executeFile("git", ["rev-parse", "--show-toplevel"], {
      cwd: gitCwd,
      timeoutMs: 1e4
    });
    const output = root.stdout.trim();
    if (!output) return void 0;
    gitRoot = fs6.realpathSync(output);
  } catch {
    return void 0;
  }
  const result = await addCloneFirstWorktree({
    gitRoot,
    dest,
    ...parsed.branch ? { branch: parsed.branch } : {},
    detach: parsed.detach,
    quiet: parsed.quiet,
    ...parsed.startPoint ? { startPoint: parsed.startPoint } : {}
  });
  return {
    content: [{ type: "text", text: result.message || `Preparing worktree (${dest})` }],
    details: { exitCode: 0, cloned: result.cloned }
  };
};

// src/providers/pi-bash-cwd.ts
import { accessSync, constants, statSync } from "node:fs";
import path10 from "node:path";
import { createBashToolDefinition } from "@earendil-works/pi-coding-agent";
import { Type as Type2 } from "typebox";
var PI_BASH_CWD_KEY = "cwd";
var resolvePiBashCwd = (sessionCwd, requested) => {
  if (typeof requested !== "string" || requested.trim().length === 0) {
    throw new Error(
      `Invalid pi.bash cwd ${JSON.stringify(requested)}: path must be a non-empty string`
    );
  }
  const resolved = path10.isAbsolute(requested) ? path10.resolve(requested) : path10.resolve(sessionCwd, requested);
  try {
    if (!statSync(resolved).isDirectory()) throw new Error("path is not a directory");
    accessSync(resolved, constants.R_OK | constants.X_OK);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid pi.bash cwd ${JSON.stringify(requested)} (${resolved}): ${reason}`);
  }
  return resolved;
};
var resolveBashCwdArgument = (sessionCwd, args) => Object.hasOwn(args, PI_BASH_CWD_KEY) ? { ...args, [PI_BASH_CWD_KEY]: resolvePiBashCwd(sessionCwd, args[PI_BASH_CWD_KEY]) } : args;
var CWD_PROPERTY = Type2.Optional(
  Type2.String({
    description: "Execution directory for this command; relative paths resolve from the session cwd."
  })
);
var isRecord3 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var withBashCwdSchema = (schema) => {
  if (!isRecord3(schema) || !isRecord3(schema.properties)) return schema;
  if (Object.hasOwn(schema.properties, PI_BASH_CWD_KEY)) return schema;
  const { type: _type, properties, required, ...rest } = schema;
  return Type2.Object(
    { ...properties, [PI_BASH_CWD_KEY]: CWD_PROPERTY },
    { ...rest, ...Array.isArray(required) ? { required } : {} }
  );
};
var MAX_CACHED_DEFINITIONS = 16;
var BashCwdDefinitions = class {
  #cache = /* @__PURE__ */ new Map();
  /** A bash definition bound to `cwd`, reusing a recent one when possible. */
  get(cwd) {
    const cached = this.#cache.get(cwd);
    if (cached) {
      this.#cache.delete(cwd);
      this.#cache.set(cwd, cached);
      return cached;
    }
    const definition = createBashToolDefinition(cwd);
    this.#cache.set(cwd, definition);
    if (this.#cache.size > MAX_CACHED_DEFINITIONS) {
      const oldest = this.#cache.keys().next();
      if (!oldest.done) this.#cache.delete(oldest.value);
    }
    return definition;
  }
};

// src/providers/write-preview.ts
import { homedir } from "node:os";
import { dirname, isAbsolute, resolve } from "node:path";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import {
  createWriteToolDefinition,
  withFileMutationQueue
} from "@earendil-works/pi-coding-agent";
var resolvePreviewPath = (filePath, cwd) => {
  let expanded = filePath.startsWith("@") ? filePath.slice(1) : filePath;
  expanded = expanded.replace(/[\u00a0\u2000-\u200a\u202f\u205f\u3000]/g, " ");
  if (expanded === "~") expanded = homedir();
  else if (expanded.startsWith("~/")) expanded = homedir() + expanded.slice(1);
  return isAbsolute(expanded) ? expanded : resolve(cwd, expanded);
};
var skipped = (reason, byteLength, sizeExceeded = false) => ({
  kind: "skipped",
  reason,
  ...byteLength !== void 0 ? { byteLength } : {},
  maxBytes: MAX_WRITE_DIFF_BYTES,
  ...sizeExceeded ? { sizeExceeded: true } : {}
});
var isMissing = (error) => typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
var readExistingFileForPreview = async (filePath, cwd, nextContent) => {
  const absolutePath = resolvePreviewPath(filePath, cwd);
  const nextBytes = Buffer.byteLength(nextContent, "utf8");
  if (writeContentForPreview(nextContent) === void 0) {
    return skipped("new content too large", nextBytes, true);
  }
  let fileStat;
  try {
    fileStat = await stat(absolutePath);
  } catch (error) {
    return isMissing(error) ? void 0 : skipped("previous content unavailable", void 0);
  }
  if (!fileStat.isFile()) return skipped("previous path is not a regular file", fileStat.size);
  if (fileStat.size > MAX_WRITE_DIFF_BYTES) {
    return skipped("previous file too large", fileStat.size, true);
  }
  try {
    const content = await readFile(absolutePath, "utf8");
    const bytes = Buffer.byteLength(content, "utf8");
    return bytes > MAX_WRITE_DIFF_BYTES ? skipped("previous file too large", bytes, true) : { kind: "content", content };
  } catch {
    return skipped("previous content unavailable", fileStat.size);
  }
};
var createPreviewWriteToolDefinition = (cwd) => {
  const original = createWriteToolDefinition(cwd);
  return {
    ...original,
    async execute(_toolCallId, params, signal) {
      const { path: path17, content } = params;
      const absolutePath = resolvePreviewPath(path17, cwd);
      return withFileMutationQueue(absolutePath, async () => {
        const throwIfAborted2 = () => {
          if (signal?.aborted) throw new Error("Operation aborted");
        };
        throwIfAborted2();
        const before = await readExistingFileForPreview(path17, cwd, content);
        throwIfAborted2();
        await mkdir(dirname(absolutePath), { recursive: true });
        throwIfAborted2();
        await writeFile(absolutePath, content, "utf8");
        throwIfAborted2();
        return {
          content: [
            {
              type: "text",
              text: `Successfully wrote ${Buffer.byteLength(content, "utf8")} bytes to ${path17}`
            }
          ],
          details: { codePreviewBeforeWrite: before }
        };
      });
    }
  };
};

// src/providers/pi-tools-provider.ts
var MAX_RENDERER_ARGUMENT_CHARS = 2e5;
var MAX_REPLACE_ALL_FILE_CHARS = 2e6;
var expandReplaceAllEdit = (cwd, args, allForEveryEdit) => {
  const filePath = args.path;
  if (typeof filePath !== "string") {
    throw new Error("pi.edit all:true requires a path");
  }
  const edits = Array.isArray(args.edits) ? args.edits : [{ oldText: args.oldText, newText: args.newText }];
  if (edits.length === 0) throw new Error("pi.edit all:true requires at least one edit");
  const normalized = edits.map((edit, index) => {
    if (typeof edit !== "object" || edit === null || Array.isArray(edit)) {
      throw new Error(`pi.edit all:true edits[${index}] must be an object`);
    }
    const record = edit;
    const { oldText, newText } = record;
    if (typeof oldText !== "string" || typeof newText !== "string") {
      throw new Error(`pi.edit all:true edits[${index}] requires oldText and newText strings`);
    }
    if (oldText.length === 0) {
      throw new Error(`pi.edit all:true edits[${index}] oldText cannot be empty`);
    }
    return { oldText, newText, all: allForEveryEdit || record.all === true };
  });
  const resolvedPath = path11.resolve(
    cwd,
    filePath.startsWith("@") ? filePath.slice(1) : filePath
  );
  const current = readFileSync2(resolvedPath, "utf8");
  if (current.length > MAX_REPLACE_ALL_FILE_CHARS) {
    throw new Error(
      `pi.edit all:true refuses files over ${MAX_REPLACE_ALL_FILE_CHARS} characters; use scoped unique edits`
    );
  }
  let next = current;
  for (const [index, edit] of normalized.entries()) {
    const occurrences = next.split(edit.oldText).length - 1;
    if (occurrences === 0) {
      throw new Error(`pi.edit all:true edits[${index}] oldText was not found`);
    }
    if (!edit.all && occurrences !== 1) {
      throw new Error(
        `pi.edit edits[${index}] found ${occurrences} occurrences; add all:true or use a unique anchor`
      );
    }
    next = edit.all ? next.replaceAll(edit.oldText, edit.newText) : next.replace(edit.oldText, edit.newText);
  }
  return { path: filePath, edits: [{ oldText: current, newText: next }] };
};
var readTools = /* @__PURE__ */ new Set(["read", "grep", "find", "ls"]);
var writeTools = /* @__PURE__ */ new Set(["edit", "write"]);
var riskForTool = (name) => {
  if (readTools.has(name)) return "read";
  if (writeTools.has(name)) return "write";
  return "execute";
};
var textContent = (content) => content.filter((part) => part.type === "text").map((part) => part.text).join("\n");
var imageBlocks = (content) => {
  if (!Array.isArray(content)) return [];
  const blocks = [];
  for (const part of content) {
    if (typeof part === "object" && part !== null && part.type === "image" && typeof part.data === "string" && typeof part.mimeType === "string") {
      blocks.push({
        type: "image",
        data: part.data,
        mimeType: part.mimeType
      });
    }
  }
  return blocks;
};
var normalizeResult = (name, result) => {
  const text = textContent(result.content);
  if (result.isError) throw new Error(text || `${name} failed`);
  if (name === "read" || name === "grep" || name === "find" || name === "ls") {
    return text;
  }
  let details = result.details;
  if (name === "bash" && details && typeof details === "object" && !Array.isArray(details)) {
    const detailRecord = details;
    const truncation = detailRecord.truncation;
    if (truncation && typeof truncation === "object" && !Array.isArray(truncation)) {
      const { content, ...truncationMetadata } = truncation;
      if (typeof content === "string" && text.includes(content)) {
        details = { ...detailRecord, truncation: truncationMetadata };
      }
    }
  }
  if (name === "write" && details && typeof details === "object" && !Array.isArray(details)) {
    const { codePreviewBeforeWrite: _before, ...publicDetails } = details;
    details = Object.keys(publicDetails).length > 0 ? publicDetails : void 0;
  }
  return {
    ok: true,
    output: text,
    details: details ?? null
  };
};
var PiToolsProvider = class {
  name = "pi";
  description = "Pi's built-in coding tools";
  #tools;
  #catalog;
  #capturedTools;
  #cwd;
  #bashDefinitions = new BashCwdDefinitions();
  constructor(cwd, catalog, capturedTools) {
    this.#cwd = cwd;
    this.#tools = {
      read: createReadToolDefinition(cwd),
      bash: createBashToolDefinition2(cwd),
      edit: createEditToolDefinition(cwd),
      write: createPreviewWriteToolDefinition(cwd),
      grep: createGrepToolDefinition(cwd),
      find: createFindToolDefinition(cwd),
      ls: createLsToolDefinition(cwd)
    };
    this.#catalog = catalog;
    this.#capturedTools = capturedTools;
  }
  async list(request, _context) {
    const query = request.query?.toLowerCase();
    const descriptors6 = await Promise.all(
      PI_CORE_TOOL_NAMES.map((name) => this.describe(name, _context))
    );
    return descriptors6.filter((descriptor) => descriptor !== void 0).filter(
      (descriptor) => query ? `${descriptor.name} ${descriptor.description}`.toLowerCase().includes(query) : true
    );
  }
  async describe(actionName, _context) {
    if (!(actionName in this.#tools)) return void 0;
    const name = actionName;
    const override = await this.#capturedTools?.describe(name, _context);
    if (override) return { ...override, namespace: "extension-override" };
    const tool = this.#tools[name];
    return this.#descriptor(name, tool);
  }
  prepareArguments(actionName, args) {
    if (this.#catalog?.get(actionName)) {
      return this.#capturedTools.prepareArguments(actionName, args);
    }
    if (!(actionName in this.#tools)) return args;
    const input = actionName === "edit" && Object.hasOwn(args, "all") ? Object.fromEntries(Object.entries(args).filter(([key]) => key !== "all")) : args;
    const prepare = this.#tools[actionName].prepareArguments;
    const prepared = prepare ? prepare(input) : input;
    if (typeof prepared !== "object" || prepared === null || Array.isArray(prepared)) {
      throw new Error(`Pi tool ${actionName} prepared non-object arguments`);
    }
    const record = prepared;
    if (actionName === "bash") return resolveBashCwdArgument(this.#cwd, record);
    const hasPerEditAll = actionName === "edit" && Array.isArray(record.edits) && record.edits.some(
      (edit) => typeof edit === "object" && edit !== null && !Array.isArray(edit) && edit.all === true
    );
    return actionName === "edit" && (args.all === true || hasPerEditAll) ? expandReplaceAllEdit(this.#cwd, record, args.all === true) : record;
  }
  // The tool definition carrying this call's execution directory. Read-only:
  // `cwd` stays in the arguments so events, approval, and previews see it, and
  // pi's bash ignores the extra key.
  #definitionFor(name, args) {
    if (name !== "bash") return this.#tools[name];
    const cwd = args[PI_BASH_CWD_KEY];
    return typeof cwd === "string" ? this.#bashDefinitions.get(cwd) : this.#tools.bash;
  }
  async invoke(actionName, args, context) {
    if (!(actionName in this.#tools)) throw new Error(`Unknown Pi tool: ${actionName}`);
    const name = actionName;
    if (name === "bash") {
      const intercepted = await tryExecuteGitWorktreeAdd(args, this.#cwd);
      if (intercepted) {
        this.#attachPreview(name, intercepted, args, context);
        return this.#normalizeResult(name, intercepted, args);
      }
    }
    if (this.#catalog?.get(name)) {
      const result = await this.#capturedTools.invoke(name, args, context);
      this.#attachReadMedia(name, result, context);
      this.#attachReadNote(name, result, context);
      this.#attachPreview(name, result, args, context);
      return this.#normalizeResult(name, result, args);
    }
    const tool = this.#definitionFor(name, args);
    const runner = this.#catalog?.runner;
    if (!runner) {
      const result = await runAbortable(
        context.signal,
        () => tool.execute(
          context.nestedToolCallId,
          args,
          context.signal,
          (partialResult) => this.#attachPartialPreview(name, partialResult, args, context),
          context.extensionContext
        )
      ).catch((error) => {
        throwIfAborted(context.signal);
        throw name === "bash" ? classifyPiBashError(error) : error;
      });
      this.#attachReadMedia(name, result, context);
      this.#attachReadNote(name, result, context);
      this.#attachPreview(name, result, args, context);
      return this.#normalizeResult(name, result, args);
    }
    return this.#invokeWithEvents(name, tool, args, context, runner);
  }
  // Replay the agent-core tool-execution lifecycle for a nested pi.* call, so
  // extensions that hook tool_call / tool_result / tool_execution_* see pi
  // core tools invoked through fabric_exec in full-code mode — exactly as
  // they would for a top-level call in the normal (non-codemode) flow, and
  // exactly as CapturedToolsProvider already does for captured extension
  // tools. tool_result patches (content/details/isError) are applied, so
  // extensions like pi-vision-handoff can replace image blocks with text
  // descriptions before the result returns to the sandbox.
  async #invokeWithEvents(name, tool, args, context, runner) {
    const toolCallId = context.nestedToolCallId;
    await runAbortable(context.signal, () => runner.emit({
      type: "tool_execution_start",
      toolCallId,
      toolName: name,
      args
    }));
    let result;
    let isError = false;
    let thrown;
    let executionStarted = false;
    let updateTail = Promise.resolve();
    try {
      const preflight = await runAbortable(context.signal, () => runner.emitToolCall({
        type: "tool_call",
        toolName: name,
        toolCallId,
        input: args
      }));
      context.updateArguments?.(args);
      if (preflight?.block) {
        throw new Error(preflight.reason || `Pi tool ${name} was blocked`);
      }
      executionStarted = true;
      result = await runAbortable(context.signal, () => tool.execute(
        toolCallId,
        args,
        context.signal,
        (partialResult) => {
          this.#attachPartialPreview(name, partialResult, args, context);
          updateTail = updateTail.then(
            () => runAbortable(context.signal, () => runner.emit({
              type: "tool_execution_update",
              toolCallId,
              toolName: name,
              args,
              partialResult
            }))
          ).catch(() => void 0);
        },
        context.extensionContext
      ));
    } catch (error) {
      thrown = name === "bash" && executionStarted ? classifyPiBashError(error) : error;
      isError = true;
      result = {
        content: [
          { type: "text", text: error instanceof Error ? error.message : String(error) }
        ],
        details: void 0
      };
    }
    await updateTail;
    throwIfAborted(context.signal);
    this.#attachReadMedia(name, result, context);
    const patch = await runAbortable(context.signal, () => runner.emitToolResult({
      type: "tool_result",
      toolName: name,
      toolCallId,
      input: args,
      content: result.content,
      details: result.details,
      isError
    }));
    if (patch) {
      result = {
        ...result,
        content: patch.content ?? result.content,
        ...patch.details !== void 0 ? { details: patch.details } : {}
      };
      isError = patch.isError ?? isError;
    }
    this.#attachReadNote(name, result, context);
    await runAbortable(context.signal, () => runner.emit({
      type: "tool_execution_end",
      toolCallId,
      toolName: name,
      result,
      isError
    }));
    if (isError) {
      if (name === "bash") throw piBashResultError(thrown, textContent(result.content));
      const text = textContent(result.content).trim();
      throw new Error(text || (thrown instanceof Error ? thrown.message : `Pi tool ${name} failed`));
    }
    this.#attachPreview(name, result, args, context);
    return this.#normalizeResult(name, result, args);
  }
  // Schema-enforce and early-startup calls may have no ExtensionRunner, so the
  // top-level tool_result marker middleware cannot run. Expand again at the
  // provider boundary; replacement is idempotent when middleware already ran.
  #normalizeResult(name, result, args) {
    const normalized = normalizeResult(name, result);
    if (name !== "read" || typeof normalized !== "string") return normalized;
    return expandSkillDirMarkersForRead(normalized, args, this.#cwd);
  }
  #attachPartialPreview(name, partialResult, args, context) {
    const progress = textContent(partialResult.content).trim();
    const boundedProgress = Array.from(progress).slice(-4e3).join("");
    const bashCommand = name === "bash" && typeof args.command === "string" && args.command.length <= MAX_RENDERER_ARGUMENT_CHARS ? args.command : void 0;
    context.attachPreview?.({
      result: boundedProgress,
      ...bashCommand !== void 0 ? { bashCommand } : {}
    });
    context.update(`${name}: ${boundedProgress.slice(-500) || "running"}`);
  }
  #attachPreview(name, result, args, context) {
    if (result.isError) return;
    const details = result.details;
    const detailRecord = typeof details === "object" && details !== null && !Array.isArray(details) ? details : void 0;
    const bashCommand = name === "bash" && typeof args.command === "string" && args.command.length <= MAX_RENDERER_ARGUMENT_CHARS ? args.command : void 0;
    const writeInput = name === "write" && typeof args.content === "string" ? args.content : void 0;
    const writeContent = writeInput !== void 0 ? writeContentForPreview(writeInput) : void 0;
    const writeByteLength = writeInput !== void 0 ? Buffer.byteLength(writeInput, "utf8") : void 0;
    const writeLineCount = writeInput !== void 0 ? countContentLines(writeInput) : void 0;
    const hasWriteBefore = name === "write" && detailRecord !== void 0 && Object.prototype.hasOwnProperty.call(detailRecord, "codePreviewBeforeWrite");
    context.attachPreview?.({
      result: normalizeResult(name, result),
      ...bashCommand !== void 0 ? { bashCommand } : {},
      ...writeContent !== void 0 ? { writeContent } : {},
      ...writeByteLength !== void 0 ? { writeByteLength } : {},
      ...writeLineCount !== void 0 ? { writeLineCount } : {},
      ...details !== void 0 ? { details } : {},
      ...hasWriteBefore ? {
        codePreviewBeforeWrite: detailRecord?.codePreviewBeforeWrite,
        writeBeforeCaptured: true
      } : {}
    });
  }
  // `pi.read` of an image file returns `{ type: "image" }` content blocks.
  // normalizeResult strips them — the sandbox holds text only and the model
  // return is a string — but the single-call render wants them re-attached so
  // pi core's ToolExecutionComponent renders the kitty image preview, the same
  // path a native `read` takes. Hand them out-of-band via context.attachMedia,
  // which the ActionRegistry stashes on the call audit; this bypasses the
  // result char bound that would otherwise truncate the base64 payload.
  //
  // Must run BEFORE any tool_result patch: pi-vision-handoff SWAPS image blocks
  // for text descriptions here (so the description becomes the sandbox value),
  // which would leave no image to capture. Capturing the original blocks lets
  // the single-call render show the kitty image, and the handoff's `context`
  // hook supplies the description to the model — exactly how a native `read`
  // keeps its image for kitty and swaps it only on the LLM-bound clone.
  #attachReadMedia(name, result, context) {
    if (name !== "read") return;
    const blocks = imageBlocks(result?.content);
    if (blocks.length > 0) context.attachMedia?.(blocks);
  }
  // The read tool's own text note (e.g. "Read image file [image/png]"), captured
  // AFTER any tool_result patch — pi-vision-handoff swaps image→description and
  // strips pi's "[Current model does not support images…]" note there, so the
  // first surviving text block is the clean note. Used as the single-call body
  // and content text so the preview shows the kitty image + the clean note
  // instead of the handoff's verbose description; the model still receives the
  // description via the handoff's `context` hook swapping the image block.
  #attachReadNote(name, result, context) {
    if (name !== "read") return;
    const content = result?.content;
    if (!Array.isArray(content)) return;
    for (const block of content) {
      if (typeof block === "object" && block !== null && block.type === "text" && typeof block.text === "string") {
        context.attachMedia?.([], block.text);
        return;
      }
    }
  }
  #descriptor(name, tool) {
    const inputSchema = name === "bash" ? withBashCwdSchema(tool.parameters) : tool.parameters;
    return {
      name,
      description: tool.description,
      inputSchema,
      risk: riskForTool(name),
      namespace: "builtin"
    };
  }
};

// src/schema/controller.ts
import { spawn } from "node:child_process";
import { createHash as createHash3, randomBytes, randomUUID as randomUUID4 } from "node:crypto";
import fs8 from "node:fs";
import path13 from "node:path";

// src/schema/types.ts
var stateBinding = (head) => head ? { transitionId: head.transitionId, version: head.version, to: head.to } : null;

// src/schema/workspace.ts
import { execFileSync } from "node:child_process";
import { createHash as createHash2 } from "node:crypto";
import fs7 from "node:fs";
import path12 from "node:path";
var SNAPSHOT_MAX_FILES = 2e4;
var SNAPSHOT_MAX_BYTES = 512 * 1024 * 1024;
var FALLBACK_SKIPPED_DIRECTORIES = /* @__PURE__ */ new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".cache"
]);
var digest = (value) => createHash2("sha256").update(value).digest("hex");
var git = (cwd, args) => execFileSync("git", ["-C", cwd, ...args], {
  encoding: "buffer",
  maxBuffer: 128 * 1024 * 1024,
  stdio: ["ignore", "pipe", "ignore"]
});
var nulPaths = (buffer) => buffer.toString("utf8").split("\0").filter((item) => item.length > 0);
var normalizeRelative = (value) => value.split(path12.sep).join("/");
var isInside = (root, candidate) => {
  const relative = path12.relative(root, candidate);
  return relative === "" || !path12.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path12.sep}`);
};
var excluded = (absolute, exclusions) => exclusions.some((root) => isInside(root, absolute));
var entryDigest = (absolute) => {
  let stat2;
  try {
    stat2 = fs7.lstatSync(absolute);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { marker: "absent", bytes: 0 };
    }
    throw error;
  }
  if (stat2.isSymbolicLink()) {
    return { marker: `symlink:${digest(fs7.readlinkSync(absolute))}`, bytes: 0 };
  }
  if (!stat2.isFile()) {
    throw new Error(`Schema workspace snapshot does not support non-file entry: ${absolute}`);
  }
  return { marker: `file:${stat2.mode & 511}:${digest(fs7.readFileSync(absolute))}`, bytes: stat2.size };
};
var buildSnapshot = (cwd, paths, metadata, exclusions) => {
  const entries = {};
  let bytes = 0;
  const unique = [...new Set(paths)].sort((left, right) => left.localeCompare(right));
  for (const relativeInput of unique) {
    const absolute = path12.resolve(cwd, relativeInput);
    if (!isInside(cwd, absolute) || excluded(absolute, exclusions)) continue;
    if (Object.keys(entries).length >= SNAPSHOT_MAX_FILES) {
      throw new Error(`Schema workspace snapshot exceeds ${SNAPSHOT_MAX_FILES} files`);
    }
    const relative = normalizeRelative(path12.relative(cwd, absolute));
    const entry = entryDigest(absolute);
    bytes += entry.bytes;
    if (bytes > SNAPSHOT_MAX_BYTES) {
      throw new Error(`Schema workspace snapshot exceeds ${SNAPSHOT_MAX_BYTES} bytes`);
    }
    entries[relative] = entry.marker;
  }
  const fingerprint = `sha256:${digest(JSON.stringify({
    format: 1,
    git: metadata.git,
    head: metadata.head,
    indexDigest: metadata.indexDigest,
    entries
  }))}`;
  return {
    fingerprint,
    ...metadata,
    entries,
    files: Object.keys(entries).length,
    bytes
  };
};
var fallbackPaths = (cwd, exclusions) => {
  const paths = [];
  const visit = (directory) => {
    const entries = fs7.readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      if (FALLBACK_SKIPPED_DIRECTORIES.has(entry.name)) continue;
      const absolute = path12.join(directory, entry.name);
      if (excluded(absolute, exclusions)) continue;
      const relative = normalizeRelative(path12.relative(cwd, absolute));
      if (entry.isDirectory()) visit(absolute);
      else paths.push(relative);
      if (paths.length > SNAPSHOT_MAX_FILES) {
        throw new Error(`Schema workspace snapshot exceeds ${SNAPSHOT_MAX_FILES} files`);
      }
    }
  };
  visit(cwd);
  return paths;
};
var snapshotWorkspace = (cwdInput, excludedRoots = []) => {
  const cwd = fs7.realpathSync(cwdInput);
  const exclusions = excludedRoots.map((root) => {
    const absolute = path12.resolve(root);
    try {
      return fs7.realpathSync(absolute);
    } catch {
      return absolute;
    }
  }).filter((root) => isInside(cwd, root));
  let worktreePrefix;
  try {
    worktreePrefix = git(cwd, ["rev-parse", "--show-prefix"]).toString("utf8").trim();
  } catch {
    return buildSnapshot(
      cwd,
      fallbackPaths(cwd, exclusions),
      { git: false, head: null, indexDigest: null },
      exclusions
    );
  }
  if (worktreePrefix !== "") {
    throw new Error("Schema enforce mode requires cwd to be the Git worktree root");
  }
  let head = null;
  try {
    head = git(cwd, ["rev-parse", "--verify", "HEAD"]).toString("utf8").trim() || null;
  } catch {
    head = null;
  }
  const index = git(cwd, ["ls-files", "--stage", "-z"]);
  const tracked = nulPaths(git(cwd, ["ls-files", "-z"]));
  const untracked = nulPaths(git(cwd, ["ls-files", "--others", "--exclude-standard", "-z"]));
  return buildSnapshot(
    cwd,
    [...tracked, ...untracked],
    { git: true, head, indexDigest: `sha256:${digest(index)}` },
    exclusions
  );
};
var resolveWorkspaceFile = (cwdInput, requestedPath, options) => {
  if (!requestedPath.trim() || path12.isAbsolute(requestedPath)) {
    throw new Error(`Schema paths must be non-empty project-relative paths: ${requestedPath}`);
  }
  const cwd = fs7.realpathSync(cwdInput);
  const absolute = path12.resolve(cwd, requestedPath);
  if (!isInside(cwd, absolute) || absolute === cwd) {
    throw new Error(`Schema path escapes the project workspace: ${requestedPath}`);
  }
  const relativeParts = path12.relative(cwd, absolute).split(path12.sep);
  let cursor = cwd;
  for (let index = 0; index < relativeParts.length; index++) {
    cursor = path12.join(cursor, relativeParts[index]);
    let stat2;
    try {
      stat2 = fs7.lstatSync(cursor);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        if (index !== relativeParts.length - 1 || !options.allowAbsent) {
          throw new Error(`Schema path does not exist: ${requestedPath}`);
        }
        const parentReal = fs7.realpathSync(path12.dirname(cursor));
        if (!isInside(cwd, parentReal)) throw new Error(`Schema path parent escapes the workspace: ${requestedPath}`);
        return { absolute, relative: normalizeRelative(path12.relative(cwd, absolute)), exists: false };
      }
      throw error;
    }
    if (stat2.isSymbolicLink()) throw new Error(`Schema path may not traverse a symbolic link: ${requestedPath}`);
    if (index < relativeParts.length - 1 && !stat2.isDirectory()) {
      throw new Error(`Schema path parent is not a directory: ${requestedPath}`);
    }
    if (index === relativeParts.length - 1 && !stat2.isFile()) {
      throw new Error(`Schema transaction paths must name regular files: ${requestedPath}`);
    }
  }
  return { absolute, relative: normalizeRelative(path12.relative(cwd, absolute)), exists: true };
};
var sha256File = (absolute) => `sha256:${digest(fs7.readFileSync(absolute))}`;

// src/schema/controller.ts
var SCHEMA_TOPIC = "fabric.schema";
var WORKSPACE_KEY = "schema/workspace";
var HYPOTHESIS_PREFIX = "schema/hypothesis/";
var CERTIFICATE_PREFIX = "schema/certificate/";
var OUTPUT_LIMIT = 64 * 1024;
var hashToken = (token) => createHash3("sha256").update(token).digest("hex");
var sameBinding = (left, right) => JSON.stringify(left) === JSON.stringify(right);
var errorMessage4 = (error) => error instanceof Error ? error.message : String(error);
var atomicJsonWrite = (filePath, value) => {
  writeJsonAtomic(filePath, value, { newline: true });
};
var allowedEnforceRefs = /* @__PURE__ */ new Set([
  "pi.read",
  "pi.grep",
  "pi.find",
  "pi.ls",
  "memory.recall",
  "memory.expand",
  "memory.sessions",
  "state.get",
  "state.history",
  "state.complexity",
  "mesh.self",
  "mesh.read",
  "mesh.members",
  "mesh.get",
  "mesh.list",
  "compact.status",
  "components.list",
  "components.status",
  "components.graph",
  "schema.status",
  "schema.hypothesize",
  "schema.verify",
  "schema.commit",
  "schema.abort"
]);
var operationPath = (operation) => operation.path;
var SchemaController = class {
  constructor(cwd, config, mesh, identity, state) {
    this.cwd = cwd;
    this.config = config;
    this.mesh = mesh;
    this.identity = identity;
    this.state = state;
    this.cwd = fs8.realpathSync(cwd);
    this.#journalRoot = path13.join(mesh.root, "schema-transactions");
    this.#lockPath = path13.join(this.#journalRoot, ".commit.lock");
    this.#recoverJournals();
  }
  #activeHypotheses = /* @__PURE__ */ new Map();
  #activeCertificates = /* @__PURE__ */ new Map();
  #journalRoot;
  #lockPath;
  async authorize(ref, parentToolCallId) {
    if (this.config.mode === "off" || allowedEnforceRefs.has(ref)) return;
    const message2 = `Schema ${this.config.mode} policy would block ${ref}: protected workspace mutations and external effects must use schema.commit`;
    if (this.config.mode === "audit") {
      try {
        await this.#publish("would_block", { ref, parentToolCallId, message: message2 });
      } catch {
      }
      return;
    }
    try {
      await this.#publish("blocked", { ref, parentToolCallId, message: message2 });
    } catch {
    }
    throw new FabricTraceSafeError(message2);
  }
  status(parentToolCallId) {
    const workspace = this.#workspaceEntry();
    const hypotheses = this.mesh.list(HYPOTHESIS_PREFIX, this.mesh.maxReadEvents).map((entry) => entry.value).filter((record) => !parentToolCallId || record.parentToolCallId === parentToolCallId).map((record) => ({
      id: record.id,
      label: record.label,
      status: record.status,
      generation: record.generation,
      updatedAt: record.updatedAt
    }));
    return {
      mode: this.config.mode,
      certificateTtlMs: this.config.certificateTtlMs,
      maxFiles: this.config.maxFiles,
      maxBytes: this.config.maxBytes,
      trustedCommands: Object.keys(this.config.trustedCommands).sort(),
      generation: workspace?.value?.generation ?? 0,
      lastOutcome: workspace?.value?.lastOutcome ?? null,
      hypotheses
    };
  }
  async hypothesize(input, context) {
    if (!input.label.trim() || !input.summary.trim()) throw new Error("Schema hypothesis label and summary must not be empty");
    if (!Array.isArray(input.evidence) || input.evidence.length === 0) {
      throw new Error("Schema hypothesis requires nonempty typed evidence");
    }
    if (input.evidence.length > this.config.maxFiles) {
      throw new Error(`Schema hypothesis exceeds ${this.config.maxFiles} evidence items`);
    }
    this.#assertPayloadBound(input);
    const snapshot = snapshotWorkspace(this.cwd, [this.mesh.root]);
    const generation = this.#generation();
    const now = Date.now();
    const record = {
      id: randomUUID4(),
      label: input.label,
      summary: input.summary,
      evidence: input.evidence,
      complexityReduction: input.complexityReduction === true,
      parentToolCallId: context.parentToolCallId,
      state: stateBinding(this.state?.getHead() ?? null),
      fingerprint: snapshot.fingerprint,
      generation,
      status: "active",
      createdAt: now,
      updatedAt: now
    };
    await this.#publish("hypothesized", record);
    await this.mesh.put({
      key: `${HYPOTHESIS_PREFIX}${record.id}`,
      value: record,
      ifVersion: 0,
      identity: this.identity
    });
    this.#activeHypotheses.set(record.id, context.parentToolCallId);
    context.update(`Schema hypothesis recorded: ${record.label}`);
    return {
      hypothesisId: record.id,
      status: record.status,
      state: record.state,
      fingerprint: record.fingerprint,
      generation
    };
  }
  async verify(hypothesisId, context) {
    const entry = this.#requireHypothesis(hypothesisId);
    const record = entry.value;
    this.#assertInvocation(record.parentToolCallId, context.parentToolCallId);
    if (record.status !== "active") throw new Error(`Schema hypothesis is not active: ${record.status}`);
    if (record.evidence.length === 0) return this.#failedVerification(record, [], "missing evidence");
    let before;
    try {
      before = snapshotWorkspace(this.cwd, [this.mesh.root]);
    } catch (error) {
      return this.#failedVerification(record, [], `workspace snapshot failed: ${errorMessage4(error)}`);
    }
    const currentState = stateBinding(this.state?.getHead() ?? null);
    if (!sameBinding(record.state, currentState)) {
      return this.#failedVerification(record, [], "state head changed since hypothesis");
    }
    if (record.generation !== this.#generation()) {
      return this.#failedVerification(record, [], "workspace generation changed since hypothesis");
    }
    if (record.fingerprint !== before.fingerprint) {
      return this.#failedVerification(record, [], "workspace fingerprint changed since hypothesis");
    }
    const results = await this.#verifyEvidence(record.evidence, context);
    let after;
    try {
      after = snapshotWorkspace(this.cwd, [this.mesh.root]);
    } catch (error) {
      return this.#failedVerification(record, results, `post-evidence snapshot failed: ${errorMessage4(error)}`);
    }
    const allConfirmed = results.length > 0 && results.every((result) => result.status === "confirmed");
    if (!allConfirmed || before.fingerprint !== after.fingerprint) {
      const reason = before.fingerprint !== after.fingerprint ? "workspace fingerprint changed while evidence ran" : "one or more evidence items were not confirmed";
      return this.#failedVerification(record, results, reason);
    }
    const certificate = randomBytes(32).toString("hex");
    const issuedAt = Date.now();
    const certificateRecord = {
      tokenHash: hashToken(certificate),
      hypothesisId: record.id,
      parentToolCallId: context.parentToolCallId,
      state: record.state,
      fingerprint: record.fingerprint,
      generation: record.generation,
      issuedAt,
      expiresAt: issuedAt + this.config.certificateTtlMs,
      status: "active"
    };
    const certificateKey = `${CERTIFICATE_PREFIX}${certificateRecord.tokenHash}`;
    await this.mesh.put({
      key: certificateKey,
      value: certificateRecord,
      ifVersion: 0,
      identity: this.identity
    });
    try {
      await this.mesh.put({
        key: entry.key,
        value: { ...record, status: "verified", updatedAt: Date.now() },
        ifVersion: entry.version,
        identity: this.identity
      });
    } catch (error) {
      const certificateEntry = this.mesh.get(certificateKey);
      if (certificateEntry) {
        await this.mesh.put({
          key: certificateKey,
          value: { ...certificateRecord, status: "aborted" },
          ifVersion: certificateEntry.version,
          identity: this.identity
        });
      }
      throw error;
    }
    this.#activeCertificates.set(certificateRecord.tokenHash, context.parentToolCallId);
    try {
      await this.#publish("verified", {
        hypothesisId: record.id,
        tokenHash: certificateRecord.tokenHash,
        results: results.map((result) => ({
          kind: result.evidence.kind,
          status: result.status,
          detail: result.detail
        })),
        state: record.state,
        fingerprint: record.fingerprint,
        generation: record.generation,
        issuedAt,
        expiresAt: certificateRecord.expiresAt
      });
    } catch {
    }
    context.update(`Schema evidence confirmed; certificate expires in ${this.config.certificateTtlMs}ms`);
    return {
      verified: true,
      hypothesisId: record.id,
      certificate,
      issuedAt,
      expiresAt: certificateRecord.expiresAt,
      results
    };
  }
  async commit(input, context) {
    if (input.operations.length === 0) throw new Error("Schema commit requires at least one file operation");
    if (input.postconditions.length === 0) throw new Error("Schema commit requires nonempty typed postconditions");
    if (input.operations.length > this.config.maxFiles) {
      throw new Error(`Schema transaction exceeds ${this.config.maxFiles} operations`);
    }
    if (input.postconditions.length > this.config.maxFiles) {
      throw new Error(`Schema transaction exceeds ${this.config.maxFiles} postconditions`);
    }
    this.#assertPayloadBound(input);
    const release = this.#acquireCommitLock();
    const transactionId = randomUUID4();
    const journalPath = path13.join(this.#journalRoot, `${transactionId}.json`);
    let journal;
    let consumed = false;
    let committed = false;
    try {
      const tokenHash = hashToken(input.certificate);
      const certificateEntry = this.mesh.get(`${CERTIFICATE_PREFIX}${tokenHash}`);
      if (!certificateEntry) throw new Error("Unknown Schema certificate");
      const certificate = certificateEntry.value;
      if (certificate.status !== "active") throw new Error(`Schema certificate is ${certificate.status}`);
      if (certificate.hypothesisId !== input.hypothesisId) throw new Error("Schema certificate is bound to a different hypothesis");
      this.#assertInvocation(certificate.parentToolCallId, context.parentToolCallId);
      if (Date.now() > certificate.expiresAt) throw new Error("Schema certificate expired");
      const hypothesisEntry = this.#requireHypothesis(input.hypothesisId);
      const hypothesis = hypothesisEntry.value;
      if (hypothesis.status !== "verified") throw new Error(`Schema hypothesis is not verified: ${hypothesis.status}`);
      if (!sameBinding(certificate.state, stateBinding(this.state?.getHead() ?? null))) {
        throw new Error("Schema state head changed after verification");
      }
      if (certificate.generation !== this.#generation()) throw new Error("Schema workspace generation is stale");
      const baseline = snapshotWorkspace(this.cwd, [this.mesh.root]);
      if (baseline.fingerprint !== certificate.fingerprint) throw new Error("Schema workspace fingerprint is stale");
      const declared = /* @__PURE__ */ new Map();
      let payloadBytes = 0;
      for (const operation of input.operations) {
        const resolved = resolveWorkspaceFile(this.cwd, operationPath(operation), {
          allowAbsent: true
        });
        declared.set(resolved.relative, resolved);
        if (operation.kind === "write") payloadBytes += Buffer.byteLength(operation.content);
        if (operation.kind === "edit") payloadBytes += Buffer.byteLength(operation.newText);
      }
      if (declared.size > this.config.maxFiles) throw new Error(`Schema transaction exceeds ${this.config.maxFiles} files`);
      const before = [];
      let beforeBytes = 0;
      for (const resolved of declared.values()) {
        if (!resolved.exists) {
          before.push({ path: resolved.relative, absolute: resolved.absolute, existed: false });
          continue;
        }
        const content = fs8.readFileSync(resolved.absolute);
        beforeBytes += content.byteLength;
        before.push({
          path: resolved.relative,
          absolute: resolved.absolute,
          existed: true,
          content: content.toString("base64"),
          mode: fs8.statSync(resolved.absolute).mode & 511
        });
      }
      if (payloadBytes + beforeBytes > this.config.maxBytes) {
        throw new Error(`Schema transaction exceeds ${this.config.maxBytes} bytes`);
      }
      journal = { format: 1, id: transactionId, status: "prepared", before, createdAt: Date.now() };
      atomicJsonWrite(journalPath, journal);
      await this.mesh.put({
        key: certificateEntry.key,
        value: { ...certificate, status: "consumed", consumedAt: Date.now() },
        ifVersion: certificateEntry.version,
        identity: this.identity
      });
      consumed = true;
      journal.status = "applying";
      atomicJsonWrite(journalPath, journal);
      const afterConsume = snapshotWorkspace(this.cwd, [this.mesh.root]);
      if (afterConsume.fingerprint !== certificate.fingerprint) {
        throw new Error("Schema workspace drifted while consuming the certificate");
      }
      for (const operation of input.operations) this.#applyOperation(operation);
      const applied = snapshotWorkspace(this.cwd, [this.mesh.root]);
      this.#assertNoOutsideDrift(baseline, applied, new Set(declared.keys()));
      const postconditionResults = await this.#verifyEvidence(input.postconditions, context);
      const afterPostconditions = snapshotWorkspace(this.cwd, [this.mesh.root]);
      if (applied.fingerprint !== afterPostconditions.fingerprint) {
        throw new Error("Schema workspace changed while postconditions ran");
      }
      if (!postconditionResults.every((result) => result.status === "confirmed")) {
        throw new Error("Schema commit postconditions were not all confirmed");
      }
      const workspaceEntry = this.#workspaceEntry();
      const nextGeneration = certificate.generation + 1;
      await this.mesh.put({
        key: WORKSPACE_KEY,
        value: {
          generation: nextGeneration,
          lastOutcome: "committed",
          lastTransactionId: transactionId,
          updatedAt: Date.now()
        },
        ifVersion: workspaceEntry?.version ?? 0,
        identity: this.identity
      });
      committed = true;
      journal.status = "committed";
      try {
        atomicJsonWrite(journalPath, journal);
      } catch {
      }
      let stateTransition = null;
      try {
        stateTransition = this.state ? await this.state.transition(
          {
            label: `schema:${hypothesis.label}`,
            ...certificate.state ? { from: certificate.state.to } : {},
            to: `schema-commit-${nextGeneration}`,
            summary: hypothesis.summary
          },
          this.identity,
          this.cwd
        ) : null;
      } catch (error) {
        stateTransition = { error: errorMessage4(error) };
      }
      try {
        await this.mesh.put({
          key: hypothesisEntry.key,
          value: { ...hypothesis, status: "committed", updatedAt: Date.now() },
          ifVersion: hypothesisEntry.version,
          identity: this.identity
        });
      } catch {
      }
      try {
        await this.#publish("committed", {
          transactionId,
          hypothesisId: hypothesis.id,
          generation: nextGeneration,
          paths: [...declared.keys()],
          postconditions: postconditionResults.map((result) => ({
            kind: result.evidence.kind,
            status: result.status,
            detail: result.detail
          })),
          complexityReductionCertified: hypothesis.complexityReduction,
          stateTransition
        });
      } catch {
      }
      this.#activeHypotheses.delete(hypothesis.id);
      this.#activeCertificates.delete(tokenHash);
      context.update(`Schema transaction committed at generation ${nextGeneration}`);
      return {
        outcome: "committed",
        transactionId,
        generation: nextGeneration,
        paths: [...declared.keys()],
        postconditions: postconditionResults,
        complexityReductionCertified: hypothesis.complexityReduction,
        stateTransition
      };
    } catch (error) {
      if (!consumed) throw error;
      if (committed) throw error;
      const rollbackError = journal ? this.#restoreBeforeImages(journal.before) : void 0;
      const outcome = rollbackError ? "quarantined" : "rolled_back";
      if (journal) {
        journal.status = outcome;
        journal.error = rollbackError ? `${errorMessage4(error)}; rollback failed: ${rollbackError}` : errorMessage4(error);
        try {
          atomicJsonWrite(journalPath, journal);
        } catch {
        }
      }
      await this.#recordFailedOutcome(outcome, transactionId, errorMessage4(error), rollbackError);
      context.update(`Schema transaction ${outcome}`);
      return {
        outcome,
        transactionId,
        error: errorMessage4(error),
        ...rollbackError ? { rollbackError } : {}
      };
    } finally {
      release();
    }
  }
  async abort(input, context) {
    const hypothesisEntry = this.#requireHypothesis(input.hypothesisId);
    const hypothesis = hypothesisEntry.value;
    this.#assertInvocation(hypothesis.parentToolCallId, context.parentToolCallId);
    if (hypothesis.status === "committed") throw new Error("Committed Schema hypotheses cannot be aborted");
    if (input.certificate) {
      const tokenHash = hashToken(input.certificate);
      const certificateEntry = this.mesh.get(`${CERTIFICATE_PREFIX}${tokenHash}`);
      if (!certificateEntry) throw new Error("Unknown Schema certificate");
      const certificate = certificateEntry.value;
      this.#assertInvocation(certificate.parentToolCallId, context.parentToolCallId);
      if (certificate.status !== "active") throw new Error(`Schema certificate is ${certificate.status}`);
      await this.mesh.put({
        key: certificateEntry.key,
        value: { ...certificate, status: "aborted" },
        ifVersion: certificateEntry.version,
        identity: this.identity
      });
      this.#activeCertificates.delete(tokenHash);
    }
    await this.mesh.put({
      key: hypothesisEntry.key,
      value: { ...hypothesis, status: "aborted", updatedAt: Date.now() },
      ifVersion: hypothesisEntry.version,
      identity: this.identity
    });
    this.#activeHypotheses.delete(hypothesis.id);
    await this.#publish("aborted", { hypothesisId: hypothesis.id, parentToolCallId: context.parentToolCallId });
    return { aborted: true, hypothesisId: hypothesis.id };
  }
  async endInvocation(parentToolCallId) {
    for (const [tokenHash, invocation] of [...this.#activeCertificates]) {
      if (invocation !== parentToolCallId) continue;
      const entry = this.mesh.get(`${CERTIFICATE_PREFIX}${tokenHash}`);
      if (entry) {
        const record = entry.value;
        if (record.status === "active") {
          try {
            await this.mesh.put({
              key: entry.key,
              value: { ...record, status: "abandoned" },
              ifVersion: entry.version,
              identity: this.identity
            });
          } catch {
          }
        }
      }
      this.#activeCertificates.delete(tokenHash);
    }
    for (const [hypothesisId, invocation] of [...this.#activeHypotheses]) {
      if (invocation !== parentToolCallId) continue;
      const entry = this.mesh.get(`${HYPOTHESIS_PREFIX}${hypothesisId}`);
      if (entry) {
        const record = entry.value;
        if (record.status === "active" || record.status === "verified") {
          try {
            await this.mesh.put({
              key: entry.key,
              value: { ...record, status: "abandoned", updatedAt: Date.now() },
              ifVersion: entry.version,
              identity: this.identity
            });
          } catch {
          }
        }
      }
      this.#activeHypotheses.delete(hypothesisId);
    }
  }
  async #failedVerification(record, results, reason) {
    try {
      await this.#publish("verification_failed", {
        hypothesisId: record.id,
        reason,
        results: results.map((result) => ({ kind: result.evidence.kind, status: result.status, detail: result.detail }))
      });
    } catch {
    }
    return { verified: false, hypothesisId: record.id, reason, results };
  }
  async #verifyEvidence(evidence, context) {
    if (evidence.length === 0) return [];
    const results = [];
    for (const item of evidence) {
      if (context.signal?.aborted) {
        results.push({ evidence: item, status: "error", detail: "cancelled" });
        continue;
      }
      try {
        if (item.kind === "trusted_command") {
          const command = this.config.trustedCommands[item.name];
          if (!command) {
            results.push({ evidence: item, status: "nonconfirmed", detail: `trusted command is not configured: ${item.name}` });
          } else {
            results.push(await this.#runTrustedCommand(item, command, context.signal));
          }
          continue;
        }
        const resolved = resolveWorkspaceFile(this.cwd, item.path, {
          allowAbsent: item.kind === "file_absent"
        });
        if (item.kind === "file_absent") {
          results.push({
            evidence: item,
            status: resolved.exists ? "nonconfirmed" : "confirmed",
            detail: resolved.exists ? "file exists" : "file is absent"
          });
        } else if (item.kind === "file_exists") {
          results.push({
            evidence: item,
            status: "confirmed",
            detail: "file exists",
            observedSha256: sha256File(resolved.absolute)
          });
        } else if (item.kind === "file_contains") {
          const confirmed = fs8.readFileSync(resolved.absolute, "utf8").includes(item.literal);
          results.push({
            evidence: item,
            status: confirmed ? "confirmed" : "nonconfirmed",
            detail: confirmed ? "literal found" : "literal not found",
            observedSha256: sha256File(resolved.absolute)
          });
        } else {
          const actual = sha256File(resolved.absolute);
          results.push({
            evidence: item,
            status: actual === item.sha256 ? "confirmed" : "nonconfirmed",
            detail: actual,
            observedSha256: actual
          });
        }
      } catch (error) {
        results.push({ evidence: item, status: "error", detail: errorMessage4(error) });
      }
    }
    return results;
  }
  #runTrustedCommand(evidence, command, signal) {
    return new Promise((resolve2) => {
      let output = "";
      let settled = false;
      const finish = (status, detail, exitCode) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve2({ evidence, status, detail, exitCode, output });
      };
      let child;
      try {
        child = spawn(command.command, command.shell ? [] : command.args, {
          cwd: this.cwd,
          shell: command.shell,
          stdio: ["ignore", "pipe", "pipe"],
          ...signal ? { signal } : {}
        });
      } catch (error) {
        resolve2({ evidence, status: "error", detail: errorMessage4(error), exitCode: null });
        return;
      }
      const append = (chunk) => {
        if (output.length < OUTPUT_LIMIT) output += chunk.toString().slice(0, OUTPUT_LIMIT - output.length);
      };
      child.stdout.on("data", append);
      child.stderr.on("data", append);
      child.on("error", (error) => finish("error", error.message, null));
      child.on("close", (code) => {
        const exitCode = typeof code === "number" ? code : null;
        finish(exitCode === 0 ? "confirmed" : exitCode === null ? "error" : "nonconfirmed", exitCode === 0 ? "exit 0" : `exit ${exitCode ?? "signal"}`, exitCode);
      });
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        finish("error", `timeout after ${command.timeoutMs}ms`, null);
      }, command.timeoutMs);
      timer.unref?.();
    });
  }
  #applyOperation(operation) {
    const resolved = resolveWorkspaceFile(this.cwd, operation.path, { allowAbsent: operation.kind === "write" });
    if (operation.kind === "write") {
      if ("absent" in operation.expected) {
        if (resolved.exists) throw new Error(`Schema precondition failed; expected absent: ${operation.path}`);
      } else {
        if (!resolved.exists || sha256File(resolved.absolute) !== operation.expected.sha256) {
          throw new Error(`Schema precondition SHA-256 mismatch: ${operation.path}`);
        }
      }
      fs8.writeFileSync(resolved.absolute, operation.content, "utf8");
      return;
    }
    if (sha256File(resolved.absolute) !== operation.expectedSha256) {
      throw new Error(`Schema precondition SHA-256 mismatch: ${operation.path}`);
    }
    if (operation.kind === "delete") {
      fs8.unlinkSync(resolved.absolute);
      return;
    }
    const content = fs8.readFileSync(resolved.absolute, "utf8");
    const first = content.indexOf(operation.oldText);
    if (first < 0 || content.indexOf(operation.oldText, first + operation.oldText.length) >= 0) {
      throw new Error(`Schema edit requires oldText to occur exactly once: ${operation.path}`);
    }
    fs8.writeFileSync(resolved.absolute, `${content.slice(0, first)}${operation.newText}${content.slice(first + operation.oldText.length)}`, "utf8");
  }
  #assertNoOutsideDrift(before, after, declared) {
    if (before.git !== after.git || before.head !== after.head || before.indexDigest !== after.indexDigest) {
      throw new Error("Schema detected Git HEAD or index drift during commit");
    }
    const paths = /* @__PURE__ */ new Set([...Object.keys(before.entries), ...Object.keys(after.entries)]);
    for (const file of paths) {
      if (declared.has(file)) continue;
      if (before.entries[file] !== after.entries[file]) {
        throw new Error(`Schema detected undeclared workspace drift: ${file}`);
      }
    }
  }
  #restoreBeforeImages(images) {
    const errors = [];
    for (const image of [...images].reverse()) {
      try {
        const resolved = resolveWorkspaceFile(this.cwd, image.path, { allowAbsent: true });
        if (!image.existed) {
          if (resolved.exists) fs8.unlinkSync(resolved.absolute);
        } else {
          fs8.writeFileSync(resolved.absolute, Buffer.from(image.content ?? "", "base64"));
          if (image.mode !== void 0) fs8.chmodSync(resolved.absolute, image.mode);
        }
      } catch (error) {
        errors.push(`${image.path}: ${errorMessage4(error)}`);
      }
    }
    return errors.length > 0 ? errors.join("; ") : void 0;
  }
  async #recordFailedOutcome(outcome, transactionId, error, rollbackError) {
    try {
      const entry = this.#workspaceEntry();
      await this.mesh.put({
        key: WORKSPACE_KEY,
        value: {
          generation: entry?.value?.generation ?? 0,
          lastOutcome: outcome,
          lastTransactionId: transactionId,
          updatedAt: Date.now()
        },
        ifVersion: entry?.version ?? 0,
        identity: this.identity
      });
      await this.#publish(outcome, { transactionId, error, ...rollbackError ? { rollbackError } : {} });
    } catch {
    }
  }
  #generation() {
    return this.#workspaceEntry()?.value?.generation ?? 0;
  }
  #workspaceEntry() {
    return this.mesh.get(WORKSPACE_KEY);
  }
  #requireHypothesis(id) {
    const entry = this.mesh.get(`${HYPOTHESIS_PREFIX}${id}`);
    if (!entry) throw new Error(`Unknown Schema hypothesis: ${id}`);
    return entry;
  }
  #assertInvocation(expected, actual) {
    if (expected !== actual) throw new Error("Schema artifact belongs to a different fabric_exec invocation");
  }
  #assertPayloadBound(value) {
    const bytes = Buffer.byteLength(JSON.stringify(value));
    if (bytes > this.config.maxBytes) throw new Error(`Schema request exceeds ${this.config.maxBytes} bytes`);
  }
  #publish(kind, data) {
    return this.mesh.publish({ topic: SCHEMA_TOPIC, kind, from: this.identity, data });
  }
  #acquireCommitLock() {
    fs8.mkdirSync(this.#journalRoot, { recursive: true, mode: 448 });
    try {
      const descriptor = fs8.openSync(this.#lockPath, "wx", 384);
      fs8.writeFileSync(descriptor, `${process.pid}
${Date.now()}
`);
      fs8.closeSync(descriptor);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "EEXIST") {
        throw new Error("Another Schema transaction is in progress");
      }
      throw error;
    }
    return () => fs8.rmSync(this.#lockPath, { force: true });
  }
  #recoverJournals() {
    fs8.mkdirSync(this.#journalRoot, { recursive: true, mode: 448 });
    try {
      const [pidText] = fs8.readFileSync(this.#lockPath, "utf8").split("\n");
      const pid = Number(pidText);
      if (Number.isSafeInteger(pid) && pid > 0) {
        try {
          process.kill(pid, 0);
          return;
        } catch {
        }
      }
      fs8.rmSync(this.#lockPath, { force: true });
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    }
    for (const name of fs8.readdirSync(this.#journalRoot)) {
      if (!name.endsWith(".json")) continue;
      const filePath = path13.join(this.#journalRoot, name);
      try {
        const journal = JSON.parse(fs8.readFileSync(filePath, "utf8"));
        if (journal.format !== 1 || journal.status !== "applying" || !Array.isArray(journal.before)) continue;
        const workspace = this.#workspaceEntry()?.value;
        if (workspace?.lastOutcome === "committed" && workspace.lastTransactionId === journal.id) {
          journal.status = "committed";
          atomicJsonWrite(filePath, journal);
          continue;
        }
        const rollbackError = this.#restoreBeforeImages(journal.before);
        journal.status = rollbackError ? "quarantined" : "rolled_back";
        journal.error = rollbackError ? `crash recovery failed: ${rollbackError}` : "recovered incomplete transaction";
        atomicJsonWrite(filePath, journal);
      } catch {
      }
    }
  }
};

// src/providers/schema-provider.ts
var pathProperty = { type: "string", minLength: 1 };
var evidenceSchema = {
  oneOf: [
    {
      type: "object",
      properties: { kind: { const: "file_exists" }, path: pathProperty },
      required: ["kind", "path"],
      additionalProperties: false
    },
    {
      type: "object",
      properties: { kind: { const: "file_absent" }, path: pathProperty },
      required: ["kind", "path"],
      additionalProperties: false
    },
    {
      type: "object",
      properties: {
        kind: { const: "file_contains" },
        path: pathProperty,
        literal: { type: "string", minLength: 1 }
      },
      required: ["kind", "path", "literal"],
      additionalProperties: false
    },
    {
      type: "object",
      properties: {
        kind: { const: "file_sha256" },
        path: pathProperty,
        sha256: { type: "string", pattern: "^sha256:[a-f0-9]{64}$" }
      },
      required: ["kind", "path", "sha256"],
      additionalProperties: false
    },
    {
      type: "object",
      properties: {
        kind: { const: "trusted_command" },
        name: { type: "string", minLength: 1 }
      },
      required: ["kind", "name"],
      additionalProperties: false
    }
  ]
};
var expectedSchema = {
  oneOf: [
    {
      type: "object",
      properties: { absent: { const: true } },
      required: ["absent"],
      additionalProperties: false
    },
    {
      type: "object",
      properties: { sha256: { type: "string", pattern: "^sha256:[a-f0-9]{64}$" } },
      required: ["sha256"],
      additionalProperties: false
    }
  ]
};
var operationSchema = {
  oneOf: [
    {
      type: "object",
      properties: {
        kind: { const: "write" },
        path: pathProperty,
        content: { type: "string" },
        expected: expectedSchema
      },
      required: ["kind", "path", "content", "expected"],
      additionalProperties: false
    },
    {
      type: "object",
      properties: {
        kind: { const: "edit" },
        path: pathProperty,
        oldText: { type: "string", minLength: 1 },
        newText: { type: "string" },
        expectedSha256: { type: "string", pattern: "^sha256:[a-f0-9]{64}$" }
      },
      required: ["kind", "path", "oldText", "newText", "expectedSha256"],
      additionalProperties: false
    },
    {
      type: "object",
      properties: {
        kind: { const: "delete" },
        path: pathProperty,
        expectedSha256: { type: "string", pattern: "^sha256:[a-f0-9]{64}$" }
      },
      required: ["kind", "path", "expectedSha256"],
      additionalProperties: false
    }
  ]
};
var descriptors4 = [
  {
    name: "status",
    description: "Read the fixed session Schema mode, transaction bounds, generation, and invocation hypotheses",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    risk: "read",
    namespace: "schema"
  },
  {
    name: "hypothesize",
    description: "Durably bind a falsifiable hypothesis and nonempty typed evidence to the current state and workspace",
    inputSchema: {
      type: "object",
      properties: {
        label: { type: "string", minLength: 1 },
        summary: { type: "string", minLength: 1 },
        evidence: { type: "array", minItems: 1, items: evidenceSchema },
        complexityReduction: { type: "boolean" }
      },
      required: ["label", "summary", "evidence"],
      additionalProperties: false
    },
    risk: "write",
    namespace: "schema"
  },
  {
    name: "verify",
    description: "Fail-closed verification that may issue one fresh invocation-bound single-use certificate",
    inputSchema: {
      type: "object",
      properties: { hypothesisId: { type: "string", minLength: 1 } },
      required: ["hypothesisId"],
      additionalProperties: false
    },
    risk: "execute",
    namespace: "schema"
  },
  {
    name: "commit",
    description: "Consume one same-invocation certificate and atomically attempt bounded declared-file operations with rollback and postconditions",
    inputSchema: {
      type: "object",
      properties: {
        hypothesisId: { type: "string", minLength: 1 },
        certificate: { type: "string", minLength: 1 },
        operations: { type: "array", minItems: 1, items: operationSchema },
        postconditions: { type: "array", minItems: 1, items: evidenceSchema }
      },
      required: ["hypothesisId", "certificate", "operations", "postconditions"],
      additionalProperties: false
    },
    risk: "execute",
    namespace: "schema"
  },
  {
    name: "abort",
    description: "Abort an uncommitted same-invocation hypothesis and optionally its active certificate",
    inputSchema: {
      type: "object",
      properties: {
        hypothesisId: { type: "string", minLength: 1 },
        certificate: { type: "string", minLength: 1 }
      },
      required: ["hypothesisId"],
      additionalProperties: false
    },
    risk: "write",
    namespace: "schema"
  }
];
var normalizeSchemaArgs = actionArgNormalizer(() => descriptors4);
var SchemaProvider = class {
  constructor(controller) {
    this.controller = controller;
  }
  name = "schema";
  description = "Host-owned, opt-in Schema verification and bounded local-file transaction control plane";
  async list(request, _context) {
    const query = request.query?.toLowerCase();
    return query ? descriptors4.filter(
      (descriptor) => `${descriptor.name} ${descriptor.description}`.toLowerCase().includes(query)
    ) : descriptors4;
  }
  async describe(actionName, _context) {
    return descriptors4.find((descriptor) => descriptor.name === actionName);
  }
  prepareArguments(actionName, args) {
    return normalizeSchemaArgs(actionName, args);
  }
  async invoke(actionName, args, context) {
    switch (actionName) {
      case "status":
        return this.controller.status(context.parentToolCallId);
      case "hypothesize":
        return this.controller.hypothesize(
          {
            label: String(args.label),
            summary: String(args.summary),
            evidence: args.evidence,
            ...args.complexityReduction === true ? { complexityReduction: true } : {}
          },
          context
        );
      case "verify":
        return this.controller.verify(String(args.hypothesisId), context);
      case "commit":
        return this.controller.commit(
          {
            hypothesisId: String(args.hypothesisId),
            certificate: String(args.certificate),
            operations: args.operations,
            postconditions: args.postconditions
          },
          context
        );
      case "abort":
        return this.controller.abort(
          {
            hypothesisId: String(args.hypothesisId),
            ...typeof args.certificate === "string" ? { certificate: args.certificate } : {}
          },
          context
        );
      default:
        throw new Error(`Unknown schema action: ${actionName}`);
    }
  }
  async invocationEnded(parentToolCallId) {
    await this.controller.endInvocation(parentToolCallId);
  }
};

// src/state/store.ts
import { createHash as createHash5 } from "node:crypto";
import path15 from "node:path";

// src/state/complexity.ts
import fs9 from "node:fs";
import path14 from "node:path";
var isWordStart = (character) => character !== void 0 && (character >= "a" && character <= "z" || character >= "A" && character <= "Z" || character === "_" || character === "$");
var isWordPart = (character) => isWordStart(character) || character !== void 0 && character >= "0" && character <= "9";
var regularExpressionPrefixWords = /* @__PURE__ */ new Set([
  "await",
  "case",
  "delete",
  "do",
  "else",
  "in",
  "instanceof",
  "of",
  "return",
  "throw",
  "typeof",
  "void",
  "yield"
]);
var canStartRegularExpression = (previous) => {
  if (!previous) return true;
  if (previous.kind === "punctuation") {
    return "([{=,:;!&|?+-*%^~<>".includes(previous.value);
  }
  return regularExpressionPrefixWords.has(previous.value);
};
var tokenize = (source) => {
  const tokens = [];
  let scan;
  const skipQuoted = (start) => {
    const quote = source[start];
    let index = start + 1;
    while (index < source.length) {
      if (source[index] === "\\") {
        index += 2;
      } else if (source[index] === quote) {
        return index + 1;
      } else {
        index++;
      }
    }
    return index;
  };
  const scanJsx = (start) => {
    let index = start + 1;
    let selfClosing = false;
    while (index < source.length) {
      if (source[index] === "'" || source[index] === '"') {
        index = skipQuoted(index);
      } else if (source[index] === "{") {
        tokens.push({ value: "{", kind: "punctuation" });
        index = scan(index + 1, true);
        tokens.push({ value: "}", kind: "punctuation" });
      } else if (source[index] === ">") {
        let previous = index - 1;
        while (previous > start && source[previous]?.trim().length === 0) previous--;
        selfClosing = source[previous] === "/";
        index++;
        break;
      } else {
        index++;
      }
    }
    if (selfClosing) return index;
    while (index < source.length) {
      if (source[index] === "{") {
        tokens.push({ value: "{", kind: "punctuation" });
        index = scan(index + 1, true);
        tokens.push({ value: "}", kind: "punctuation" });
      } else if (source[index] === "<" && source[index + 1] === "/") {
        index += 2;
        while (index < source.length && source[index] !== ">") index++;
        return Math.min(source.length, index + 1);
      } else if (source[index] === "<") {
        index = scanJsx(index);
      } else {
        index++;
      }
    }
    return index;
  };
  const canStartJsx = (next) => {
    if (next !== ">" && !isWordStart(next)) return false;
    const previous = tokens[tokens.length - 1];
    if (!previous) return true;
    if (previous.kind === "word") return previous.value === "return";
    return ["(", "[", "{", "=", ",", ":", "?", "=>", "&&", "||"].includes(
      previous.value
    );
  };
  scan = (start, stopAtClosingBrace) => {
    let index = start;
    while (index < source.length) {
      const character = source[index];
      const next = source[index + 1];
      if (stopAtClosingBrace && character === "}") return index + 1;
      if (character === "<" && canStartJsx(next)) {
        index = scanJsx(index);
        continue;
      }
      if (character === "{") {
        tokens.push({ value: "{", kind: "punctuation" });
        index = scan(index + 1, true);
        tokens.push({ value: "}", kind: "punctuation" });
        continue;
      }
      if (character === "/" && next === "/") {
        index += 2;
        while (index < source.length && source[index] !== "\n") index++;
        continue;
      }
      if (character === "/" && next === "*") {
        index += 2;
        while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
          index++;
        }
        index = Math.min(source.length, index + 2);
        continue;
      }
      if (character === "'" || character === '"') {
        index = skipQuoted(index);
        continue;
      }
      if (character === "`") {
        index++;
        while (index < source.length) {
          if (source[index] === "\\") {
            index += 2;
          } else if (source[index] === "`") {
            index++;
            break;
          } else if (source[index] === "$" && source[index + 1] === "{") {
            tokens.push({ value: "{", kind: "punctuation" });
            index = scan(index + 2, true);
            tokens.push({ value: "}", kind: "punctuation" });
          } else {
            index++;
          }
        }
        continue;
      }
      if (character === "/" && next !== "=" && canStartRegularExpression(tokens[tokens.length - 1])) {
        index++;
        let inCharacterClass = false;
        while (index < source.length) {
          if (source[index] === "\\") {
            index += 2;
          } else if (source[index] === "[") {
            inCharacterClass = true;
            index++;
          } else if (source[index] === "]") {
            inCharacterClass = false;
            index++;
          } else if (source[index] === "/" && !inCharacterClass) {
            index++;
            while (isWordPart(source[index])) index++;
            break;
          } else {
            index++;
          }
        }
        continue;
      }
      if (isWordStart(character)) {
        const wordStart = index;
        index++;
        while (isWordPart(source[index])) index++;
        tokens.push({ value: source.slice(wordStart, index), kind: "word" });
        continue;
      }
      if (character !== void 0 && character.trim().length > 0) {
        const twoCharacters = `${character}${next ?? ""}`;
        if (["?.", "??", "&&", "||", "=>"].includes(twoCharacters)) {
          tokens.push({ value: twoCharacters, kind: "punctuation" });
          index += 2;
        } else {
          tokens.push({ value: character, kind: "punctuation" });
          index++;
        }
        continue;
      }
      index++;
    }
    return index;
  };
  scan(0, false);
  return tokens;
};
var followedBy = (tokens, index, value) => tokens[index + 1]?.value === value;
var countTypeScriptJavaScript = (source) => {
  const tokens = tokenize(source);
  const switchBodies = [];
  let waitingForSwitchBody = false;
  let count = 0;
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]?.value;
    if (token === "switch") waitingForSwitchBody = true;
    if (token === "{") {
      switchBodies.push(waitingForSwitchBody);
      waitingForSwitchBody = false;
      continue;
    }
    if (token === "}") {
      switchBodies.pop();
      continue;
    }
    if ((token === "if" || token === "for" || token === "while") && followedBy(tokens, index, "(")) {
      count++;
      continue;
    }
    if (token === "catch" && (followedBy(tokens, index, "(") || followedBy(tokens, index, "{"))) {
      count++;
      continue;
    }
    if (switchBodies[switchBodies.length - 1] === true) {
      if (token === "default" && followedBy(tokens, index, ":")) {
        count++;
      } else if (token === "case") {
        count++;
      }
    }
  }
  return count;
};
var typeScriptJavaScriptComplexity = {
  language: "typescript/javascript",
  extensions: [".ts", ".js", ".tsx", ".jsx"],
  count: countTypeScriptJavaScript
};
var languageComplexities = [
  typeScriptJavaScriptComplexity
];
var complexityForFile = (file, languages = languageComplexities) => {
  const extension = path14.extname(file).toLowerCase();
  return languages.find((language) => language.extensions.includes(extension));
};
var countFileComplexity = (file) => {
  const language = complexityForFile(file);
  if (!language) return void 0;
  return {
    file,
    language: language.language,
    count: language.count(fs9.readFileSync(file, "utf8"))
  };
};

// src/state/evidence-runner.ts
import { spawn as spawn2 } from "node:child_process";
import { createHash as createHash4 } from "node:crypto";
var COMMAND_OUTPUT_MAX_BYTES = 32 * 1024;
var errorMessage5 = (error) => error instanceof Error ? error.message : String(error);
var truncateUtf8 = (value, maxBytes) => {
  const bytes = Buffer.from(value, "utf8");
  if (bytes.length <= maxBytes) return { value, omittedBytes: 0 };
  let end = maxBytes;
  while (end > 0 && (bytes[end] & 192) === 128) end--;
  const bounded = bytes.subarray(0, end).toString("utf8");
  return { value: bounded, omittedBytes: bytes.length - end };
};
var terminateWindowsTree = (child) => new Promise((resolve2) => {
  if (child.pid === void 0) {
    resolve2();
    return;
  }
  let settled = false;
  let timeout;
  const finish = () => {
    if (settled) return;
    settled = true;
    if (timeout) clearTimeout(timeout);
    resolve2();
  };
  const treeKillCommand = ["task", "kill"].join("");
  const killer = spawn2(treeKillCommand, ["/pid", String(child.pid), "/T", "/F"], {
    windowsHide: true,
    stdio: "ignore"
  });
  killer.once("error", () => {
    try {
      child.kill("SIGKILL");
    } catch {
    }
    finish();
  });
  killer.once("close", finish);
  timeout = setTimeout(() => {
    try {
      killer.kill("SIGKILL");
      child.kill("SIGKILL");
    } catch {
    }
    finish();
  }, 1e3);
  timeout.unref?.();
});
var terminateProcessTree = async (child) => {
  if (process.platform === "win32") {
    await terminateWindowsTree(child);
    return;
  }
  if (child.pid === void 0) return;
  try {
    process.kill(-child.pid, "SIGKILL");
  } catch {
    try {
      child.kill("SIGKILL");
    } catch {
    }
  }
};
var runCommand = (command, options) => new Promise((resolve2) => {
  let settled = false;
  let outputBytes = 0;
  const outputChunks = [];
  let retainedBytes = 0;
  const outputHash = createHash4("sha256");
  let timer;
  let terminationReason;
  let termination;
  let child;
  const collect = (chunk) => {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    outputBytes += bytes.length;
    outputHash.update(bytes);
    if (retainedBytes >= COMMAND_OUTPUT_MAX_BYTES) return;
    const retained = bytes.subarray(
      0,
      Math.min(bytes.length, COMMAND_OUTPUT_MAX_BYTES - retainedBytes)
    );
    outputChunks.push(retained);
    retainedBytes += retained.length;
  };
  const finish = (status, exitCode, error) => {
    if (settled) return;
    settled = true;
    if (timer) clearTimeout(timer);
    if (options.signal) options.signal.removeEventListener("abort", abort);
    const retained = Buffer.concat(outputChunks);
    const boundedOutput = truncateUtf8(retained.toString("utf8"), retained.length);
    resolve2({
      status,
      exitCode,
      output: boundedOutput.value,
      outputBytes,
      outputOmittedBytes: outputBytes - Buffer.byteLength(boundedOutput.value, "utf8"),
      outputDigest: `sha256:${outputHash.digest("hex")}`,
      ...error !== void 0 ? { error } : {}
    });
  };
  const terminate = (reason) => {
    if (terminationReason !== void 0) return;
    terminationReason = reason;
    if (timer) clearTimeout(timer);
    termination = terminateProcessTree(child);
    if (process.platform === "win32") {
      void termination.then(() => {
        const fallback = setTimeout(() => {
          child.stdout?.removeListener("data", collect);
          child.stderr?.removeListener("data", collect);
          child.stdout?.destroy();
          child.stderr?.destroy();
          finish("error", null, reason);
        }, 100);
        fallback.unref?.();
      });
    }
  };
  const abort = () => terminate("aborted");
  try {
    child = spawn2(command, {
      shell: true,
      cwd: options.cwd,
      detached: process.platform !== "win32",
      windowsHide: true
    });
  } catch (error) {
    finish("error", null, errorMessage5(error));
    return;
  }
  child.stdout?.on("data", collect);
  child.stderr?.on("data", collect);
  child.once("error", (error) => finish("error", null, errorMessage5(error)));
  child.once("close", (code) => {
    void (async () => {
      if (termination) await termination;
      if (terminationReason !== void 0) {
        finish("error", null, terminationReason);
        return;
      }
      const exitCode = typeof code === "number" ? code : null;
      if (exitCode === null) {
        finish("error", null, "process terminated by signal");
        return;
      }
      finish(exitCode === 0 ? "confirmed" : "violated", exitCode);
    })();
  });
  if (options.timeoutMs > 0) {
    timer = setTimeout(
      () => terminate(`timeout after ${options.timeoutMs}ms`),
      options.timeoutMs
    );
    timer.unref?.();
  }
  if (options.signal) {
    options.signal.addEventListener("abort", abort, { once: true });
    if (options.signal.aborted) abort();
  }
});

// src/state/store.ts
var STATE_TOPIC = "fabric.state";
var CURRENT_KEY = "state/current";
var GOAL_KEY = "state/goal";
var COMPLEXITY_KEY_PREFIX = "state/complexity/";
var CAS_RETRY_LIMIT = 8;
var REPORT_TEXT_MAX_BYTES = 8 * 1024;
var EVENT_TEXT_MAX_BYTES = 1024;
var EVENT_OUTPUT_MAX_BYTES = 4 * 1024;
var EVENT_RESULT_LIMIT = 8;
var EVENT_TARGET_LIMIT = 16;
var EVENT_ROLLBACK_LIMIT = 8;
var TRANSITION_PROTOCOL_VERSION = 1;
var DURABLE_HEAD_PROTOCOL_VERSION = 2;
var HEAD_COMMIT_PROOF_VERSION = 1;
var errorMessage6 = (error) => error instanceof Error ? error.message : String(error);
var isCasError = (error) => error instanceof Error && /compare-and-swap failed/.test(error.message);
var toStringArray = (value) => {
  if (!Array.isArray(value)) return void 0;
  const items = [];
  for (const item of value) {
    if (typeof item === "string" && item.trim()) items.push(item);
  }
  return items.length > 0 ? items : void 0;
};
var digest2 = (value) => `sha256:${createHash5("sha256").update(JSON.stringify(value)).digest("hex")}`;
var truncateUtf82 = (value, maxBytes) => {
  const bytes = Buffer.from(value, "utf8");
  if (bytes.length <= maxBytes) return { value, omittedBytes: 0 };
  let end = maxBytes;
  while (end > 0 && (bytes[end] & 192) === 128) end--;
  const bounded = bytes.subarray(0, end).toString("utf8");
  return { value: bounded, omittedBytes: bytes.length - end };
};
var boundedError = (error) => truncateUtf82(errorMessage6(error), REPORT_TEXT_MAX_BYTES).value;
var casActualVersion = (error) => {
  const match = errorMessage6(error).match(/found (\d+)$/);
  return match ? Number(match[1]) : void 0;
};
var toComplexityRecord = (value) => {
  if (!value || typeof value !== "object") return void 0;
  const raw = value;
  if (!Array.isArray(raw.files) || typeof raw.netDelta !== "number") {
    return void 0;
  }
  const files = [];
  for (const item of raw.files) {
    if (!item || typeof item !== "object") continue;
    const delta = item;
    if (typeof delta.file !== "string" || typeof delta.supported !== "boolean") {
      continue;
    }
    files.push({
      file: delta.file,
      supported: delta.supported,
      ...typeof delta.language === "string" ? { language: delta.language } : {},
      ...typeof delta.previous === "number" ? { previous: delta.previous } : {},
      ...typeof delta.current === "number" ? { current: delta.current } : {},
      ...typeof delta.delta === "number" ? { delta: delta.delta } : {},
      ...typeof delta.baseline === "boolean" ? { baseline: delta.baseline } : {}
    });
  }
  return { files, netDelta: raw.netDelta };
};
var transitionReference = (event) => {
  const data = event.data;
  return data && typeof data.transitionId === "string" ? data.transitionId : void 0;
};
var committedTransitionIds = (events) => {
  const committed = /* @__PURE__ */ new Set();
  const rejected = /* @__PURE__ */ new Set();
  for (const event of events) {
    const transitionId = transitionReference(event);
    if (!transitionId) continue;
    if (event.kind === "transition.committed") committed.add(transitionId);
    if (event.kind === "transition.rejected") rejected.add(transitionId);
  }
  for (const transitionId of rejected) committed.delete(transitionId);
  return committed;
};
var toRecord = (event, committedIds) => {
  if (event.kind !== "transition") return void 0;
  const data = event.data;
  if (!data || typeof data !== "object") return void 0;
  if (data.phase === "proposed" && (committedIds === void 0 || !committedIds.has(event.id))) {
    return void 0;
  }
  if (data.phase === "rejected") return void 0;
  const label = typeof data.label === "string" ? data.label : "";
  const to = typeof data.to === "string" ? data.to : "";
  const summary = typeof data.summary === "string" ? data.summary : "";
  const kind = data.kind === "representation" ? "representation" : "state";
  const ts = typeof data.ts === "number" ? data.ts : event.createdAt;
  const from = typeof data.from === "string" ? data.from : void 0;
  const evidence = toStringArray(data.evidence);
  const tags = toStringArray(data.tags);
  const complexity = toComplexityRecord(data.complexity);
  const certificationStatus = data.certificationStatus === "pending" ? "pending" : void 0;
  if (!label || !to) return void 0;
  return {
    transitionId: event.id,
    sequence: event.sequence,
    label,
    ...from !== void 0 ? { from } : {},
    to,
    summary,
    ...evidence !== void 0 ? { evidence } : {},
    ...tags !== void 0 ? { tags } : {},
    kind,
    ...complexity !== void 0 ? { complexity } : {},
    ...certificationStatus !== void 0 ? { certificationStatus } : {},
    ts
  };
};
var toHeadRecord = (head) => {
  if (typeof head.transitionSequence !== "number" || !Number.isSafeInteger(head.transitionSequence) || head.transitionSequence < 1) {
    return void 0;
  }
  return {
    transitionId: head.transitionId,
    sequence: head.transitionSequence,
    label: head.label,
    ...head.from !== void 0 ? { from: head.from } : {},
    to: head.to,
    summary: head.summary,
    ...head.evidence !== void 0 ? { evidence: head.evidence } : {},
    ...head.tags !== void 0 ? { tags: head.tags } : {},
    kind: head.kind,
    ...head.complexity !== void 0 ? { complexity: head.complexity } : {},
    ...head.certificationStatus !== void 0 ? { certificationStatus: head.certificationStatus } : {},
    ts: head.ts
  };
};
var toCertificationTarget = (value) => {
  if (!value || typeof value !== "object") return void 0;
  const target = value;
  if (typeof target.transitionId !== "string" || typeof target.label !== "string" || typeof target.to !== "string") {
    return void 0;
  }
  return {
    transitionId: target.transitionId,
    label: target.label,
    to: target.to
  };
};
var toCertificationHead = (value) => {
  if (value === null) return null;
  if (!value || typeof value !== "object") return null;
  const head = value;
  if (typeof head.transitionId !== "string" || typeof head.label !== "string" || typeof head.to !== "string" || typeof head.version !== "number") {
    return null;
  }
  return {
    transitionId: head.transitionId,
    label: head.label,
    ...typeof head.labelDigest === "string" ? { labelDigest: head.labelDigest } : {},
    ...typeof head.labelOmittedBytes === "number" ? { labelOmittedBytes: head.labelOmittedBytes } : {},
    to: head.to,
    ...typeof head.toDigest === "string" ? { toDigest: head.toDigest } : {},
    ...typeof head.toOmittedBytes === "number" ? { toOmittedBytes: head.toOmittedBytes } : {},
    version: head.version
  };
};
var verificationTargets = (event) => {
  if (event.kind !== "state.certified" && event.kind !== "state.violated") return [];
  const data = event.data;
  if (!data || !Array.isArray(data.targets)) return [];
  return data.targets.map(toCertificationTarget).filter((target) => target !== void 0);
};
var latestTransitionOutcomes = (events) => {
  const latest = /* @__PURE__ */ new Map();
  for (const event of events) {
    if (event.kind !== "state.certified" && event.kind !== "state.violated") continue;
    for (const target of verificationTargets(event)) {
      latest.set(target.transitionId, {
        event,
        phase: event.kind === "state.certified" ? "certified" : "violated"
      });
    }
  }
  return latest;
};
var toCertificate = (event, currentHead, latestOutcomes) => {
  if (event.kind !== "state.certified") return void 0;
  const data = event.data;
  if (!data || !Array.isArray(data.targets) || typeof data.evidenceDigest !== "string" || typeof data.resultDigest !== "string") {
    return void 0;
  }
  const targets = data.targets.map(toCertificationTarget).filter((target) => target !== void 0);
  if (targets.length === 0) return void 0;
  const head = toCertificationHead(data.head);
  const currentTarget = currentHead === null ? void 0 : targets.find((target) => target.transitionId === currentHead.transitionId);
  const latestCurrentOutcome = currentTarget ? latestOutcomes?.get(currentTarget.transitionId) : void 0;
  const current = head !== null && currentHead !== null && currentTarget !== void 0 && head.transitionId === currentHead.transitionId && (head.labelDigest ? head.labelDigest === digest2(currentHead.label) : head.label === currentHead.label) && (head.toDigest ? head.toDigest === digest2(currentHead.to) : head.to === currentHead.to) && head.version === currentHead.version && (latestCurrentOutcome === void 0 || latestCurrentOutcome.phase === "certified" && latestCurrentOutcome.event.sequence === event.sequence);
  return {
    certificateId: event.id,
    sequence: event.sequence,
    certificationStatus: "certified",
    targets,
    head,
    evidenceDigest: data.evidenceDigest,
    resultDigest: data.resultDigest,
    ts: typeof data.ts === "number" ? data.ts : event.createdAt,
    current
  };
};
var durableCurrentCertificate = (head, latestOutcomes) => {
  const certificate = head.certificate;
  if (!certificate || certificate.certificationStatus !== "certified" || typeof certificate.certificateId !== "string" || typeof certificate.sequence !== "number" || !Array.isArray(certificate.targets) || typeof certificate.evidenceDigest !== "string" || typeof certificate.resultDigest !== "string" || typeof certificate.ts !== "number") {
    return void 0;
  }
  const certificateHead = toCertificationHead(certificate.head);
  const targets = certificate.targets.map(toCertificationTarget).filter((target2) => target2 !== void 0);
  const target = targets.find(
    (item) => item.transitionId === head.transitionId && item.label === head.label && item.to === head.to
  );
  const latestOutcome = latestOutcomes?.get(head.transitionId);
  if (!target || certificateHead === null || certificateHead.transitionId !== head.transitionId || (certificateHead.labelDigest ? certificateHead.labelDigest !== digest2(head.label) : certificateHead.label !== head.label) || (certificateHead.toDigest ? certificateHead.toDigest !== digest2(head.to) : certificateHead.to !== head.to) || certificateHead.version !== head.version || latestOutcome !== void 0 && (latestOutcome.phase !== "certified" || latestOutcome.event.sequence !== certificate.sequence)) {
    return void 0;
  }
  return {
    ...certificate,
    targets,
    head: certificateHead,
    current: true
  };
};
var toVerifyResult = (claim, command, result) => {
  const boundedClaim = truncateUtf82(claim, REPORT_TEXT_MAX_BYTES);
  const boundedCommand = truncateUtf82(command, REPORT_TEXT_MAX_BYTES);
  const boundedResultError = result.error ? truncateUtf82(result.error, REPORT_TEXT_MAX_BYTES) : void 0;
  return {
    claim: boundedClaim.value,
    claimDigest: digest2(claim),
    ...boundedClaim.omittedBytes > 0 ? { claimOmittedBytes: boundedClaim.omittedBytes } : {},
    command: boundedCommand.value,
    commandDigest: digest2(command),
    ...boundedCommand.omittedBytes > 0 ? { commandOmittedBytes: boundedCommand.omittedBytes } : {},
    status: result.status,
    exitCode: result.exitCode,
    output: result.output,
    outputBytes: result.outputBytes,
    outputOmittedBytes: result.outputOmittedBytes,
    outputDigest: result.outputDigest,
    ...boundedResultError ? {
      error: boundedResultError.value,
      errorDigest: digest2(result.error),
      ...boundedResultError.omittedBytes > 0 ? { errorOmittedBytes: boundedResultError.omittedBytes } : {}
    } : {}
  };
};
var toEventResult = (result) => {
  const claim = truncateUtf82(result.claim, EVENT_TEXT_MAX_BYTES);
  const command = truncateUtf82(result.command, EVENT_TEXT_MAX_BYTES);
  const output = truncateUtf82(result.output, EVENT_OUTPUT_MAX_BYTES);
  const error = result.error ? truncateUtf82(result.error, EVENT_TEXT_MAX_BYTES) : void 0;
  return {
    ...result,
    claim: claim.value,
    claimOmittedBytes: (result.claimOmittedBytes ?? 0) + claim.omittedBytes,
    command: command.value,
    commandOmittedBytes: (result.commandOmittedBytes ?? 0) + command.omittedBytes,
    output: output.value,
    outputOmittedBytes: result.outputOmittedBytes + output.omittedBytes,
    ...error ? {
      error: error.value,
      errorOmittedBytes: (result.errorOmittedBytes ?? 0) + error.omittedBytes
    } : {}
  };
};
var toEventFailure = (failure) => {
  const message2 = truncateUtf82(failure.message, EVENT_TEXT_MAX_BYTES).value;
  const transitionId = failure.transitionId ? truncateUtf82(failure.transitionId, EVENT_TEXT_MAX_BYTES).value : void 0;
  const label = failure.label ? truncateUtf82(failure.label, EVENT_TEXT_MAX_BYTES).value : void 0;
  const command = failure.command ? truncateUtf82(failure.command, EVENT_TEXT_MAX_BYTES).value : void 0;
  const error = failure.error ? truncateUtf82(failure.error, EVENT_TEXT_MAX_BYTES).value : void 0;
  return {
    ...failure,
    message: message2,
    ...transitionId !== void 0 ? { transitionId } : {},
    ...label !== void 0 ? { label } : {},
    ...command !== void 0 ? { command } : {},
    ...error !== void 0 ? { error } : {}
  };
};
var StateStore = class {
  constructor(store) {
    this.store = store;
  }
  toHead(entry) {
    const value = entry.value;
    return { ...value, version: entry.version };
  }
  get() {
    const storedHead = this.getHead();
    const goalEntry = this.store.get(GOAL_KEY);
    const goal = goalEntry ? goalEntry.value : null;
    const ledgers = this.complexityLedgers();
    const history = this.history({});
    const lastComplexity = history.transitions.filter((transition) => transition.complexity !== void 0).at(-1)?.complexity;
    const headRecord = storedHead ? history.transitions.find(
      (transition) => transition.transitionId === storedHead.transitionId
    ) : void 0;
    const head = storedHead ? (() => {
      const { certificate: _storedCertificate, ...baseHead } = storedHead;
      return headRecord?.certificate ? {
        ...baseHead,
        certificationStatus: "certified",
        certificate: headRecord.certificate
      } : baseHead;
    })() : null;
    const complexity = {
      files: ledgers.length,
      decisionPoints: ledgers.reduce((total, ledger) => total + ledger.count, 0),
      lastNetDelta: lastComplexity?.netDelta ?? 0
    };
    return {
      head,
      goal,
      complexity,
      certification: {
        current: history.certifications.find((certificate) => certificate.current) ?? null,
        recent: history.certifications.slice(0, 20)
      }
    };
  }
  getHead() {
    const entry = this.store.get(CURRENT_KEY);
    if (!entry) return null;
    const head = this.toHead(entry);
    if (head.protocolVersion === DURABLE_HEAD_PROTOCOL_VERSION) {
      const proof = head.commitProof;
      const hasValidSequence = typeof head.transitionSequence === "number" && Number.isSafeInteger(head.transitionSequence) && head.transitionSequence > 0;
      if (!hasValidSequence || proof?.version !== HEAD_COMMIT_PROOF_VERSION) {
        return null;
      }
      if (proof.status === "committed") return head;
      if (proof.status !== "pending") return null;
      return committedTransitionIds(this.stateEvents()).has(head.transitionId) ? head : null;
    }
    const events = this.stateEvents();
    const committedIds = committedTransitionIds(events);
    if (head.protocolVersion === TRANSITION_PROTOCOL_VERSION) {
      return committedIds.has(head.transitionId) ? head : null;
    }
    const proposal = events.find(
      (event) => event.kind === "transition" && event.id === head.transitionId
    );
    if (!proposal) return head;
    const data = proposal.data;
    return data?.phase === "proposed" && !committedIds.has(proposal.id) ? null : head;
  }
  async transition(input, identity, cwd = process.cwd()) {
    const physicalCurrent = this.store.get(CURRENT_KEY);
    const current = this.getHead();
    const expectedVersion = physicalCurrent?.version ?? this.lastDeletedVersion(CURRENT_KEY);
    if (physicalCurrent && !current) {
      throw new Error(
        "State contention: current head belongs to an uncommitted or quarantined proposal"
      );
    }
    const currentTo = current?.to;
    const force = input.force === true;
    if (!force && currentTo !== void 0 && input.from !== void 0) {
      if (input.from !== currentTo) {
        throw new Error(
          `State from-mismatch: head is at "${currentTo}", but transition declares from "${input.from}"`
        );
      }
    }
    const ts = Date.now();
    const preparedComplexity = input.complexity ? this.prepareComplexity(input.complexity.files, cwd, ts) : void 0;
    const isComplexityReduction = preparedComplexity !== void 0 && preparedComplexity.record.netDelta < 0;
    if (isComplexityReduction && !input.evidence?.some((command) => command.trim().length > 0)) {
      throw new Error(
        `State complexity reduction rejected: net decision-point delta is ${preparedComplexity.record.netDelta}. Reducing branches is also achievable by deleting error handling; attach at least one replayable behavior-preservation evidence command to separate abstraction from vandalism. The reduction remains pending until a later state.verify() succeeds.`
      );
    }
    const kind = input.kind ?? "state";
    const data = {
      protocolVersion: TRANSITION_PROTOCOL_VERSION,
      phase: "proposed",
      label: input.label,
      to: input.to,
      summary: input.summary,
      kind,
      ts,
      ...input.from !== void 0 ? { from: input.from } : {},
      ...input.evidence ? { evidence: input.evidence } : {},
      ...input.tags ? { tags: input.tags } : {},
      ...preparedComplexity ? { complexity: preparedComplexity.record } : {},
      ...isComplexityReduction ? { certificationStatus: "pending" } : {}
    };
    const event = await this.store.publish({
      topic: STATE_TOPIC,
      kind: "transition",
      from: identity,
      text: input.summary,
      data
    });
    const applied = [];
    let headWrite;
    let commitMarkerPublished = false;
    try {
      for (const update of preparedComplexity?.updates ?? []) {
        const written = await this.store.put({
          key: update.key,
          value: update.value,
          ifVersion: update.expectedVersion,
          identity
        });
        applied.push({ key: update.key, before: update.before, written });
      }
      const payload = {
        protocolVersion: DURABLE_HEAD_PROTOCOL_VERSION,
        commitProof: {
          version: HEAD_COMMIT_PROOF_VERSION,
          status: "pending"
        },
        transitionSequence: event.sequence,
        label: input.label,
        ...input.from !== void 0 ? { from: input.from } : {},
        to: input.to,
        summary: input.summary,
        kind,
        ...preparedComplexity ? { complexity: preparedComplexity.record } : {},
        transitionId: event.id,
        ts,
        ...input.evidence ? { evidence: input.evidence } : {},
        ...input.tags ? { tags: input.tags } : {},
        ...isComplexityReduction ? { certificationStatus: "pending" } : {}
      };
      const advanced = await this.advanceHeadWithBefore({
        payload,
        from: input.from,
        force,
        expectedVersion,
        identity
      });
      headWrite = {
        key: CURRENT_KEY,
        before: advanced.before,
        written: advanced.entry
      };
      await this.store.publish({
        topic: STATE_TOPIC,
        kind: "transition.committed",
        from: identity,
        text: "state transition committed",
        data: {
          protocolVersion: TRANSITION_PROTOCOL_VERSION,
          phase: "committed",
          transitionId: event.id,
          ts: Date.now()
        }
      });
      commitMarkerPublished = true;
      const committedHead = await this.markHeadCommitted(advanced.entry, identity);
      return { event, head: this.toHead(committedHead) };
    } catch (error) {
      if (commitMarkerPublished) {
        throw new Error(
          `State transition committed, but its durable head proof remains pending: ${boundedError(error)}`,
          { cause: error }
        );
      }
      const rollback = await this.rollbackWrites(
        [...headWrite ? [headWrite] : [], ...applied.reverse()],
        identity
      );
      let reportingError;
      try {
        const deletedChunks = [];
        for (let index = 0; index < rollback.deleted.length; index += EVENT_ROLLBACK_LIMIT) {
          deletedChunks.push(
            rollback.deleted.slice(index, index + EVENT_ROLLBACK_LIMIT).map((item) => ({
              key: truncateUtf82(item.key, REPORT_TEXT_MAX_BYTES).value,
              version: item.version
            }))
          );
        }
        if (deletedChunks.length === 0) deletedChunks.push([]);
        for (let index = 0; index < deletedChunks.length; index++) {
          await this.store.publish({
            topic: STATE_TOPIC,
            kind: "transition.rejected",
            from: identity,
            text: rollback.errors.length > 0 ? "state transition quarantined" : "state transition rejected",
            data: {
              protocolVersion: TRANSITION_PROTOCOL_VERSION,
              phase: "rejected",
              transitionId: event.id,
              error: truncateUtf82(errorMessage6(error), EVENT_TEXT_MAX_BYTES).value,
              rollback: {
                restored: rollback.errors.length === 0,
                deleted: deletedChunks[index],
                errors: index === 0 ? rollback.errors.slice(0, EVENT_ROLLBACK_LIMIT).map((item) => truncateUtf82(item, EVENT_TEXT_MAX_BYTES).value) : [],
                omittedErrorCount: Math.max(
                  0,
                  rollback.errors.length - EVENT_ROLLBACK_LIMIT
                ),
                chunk: { index, count: deletedChunks.length }
              },
              quarantine: rollback.errors.length > 0,
              ts: Date.now()
            }
          });
        }
      } catch (publishError) {
        reportingError = boundedError(publishError);
      }
      const detail = [
        `State transition rejected: ${boundedError(error)}`,
        ...rollback.errors.length > 0 ? [`rollback quarantine: ${rollback.errors.join("; ")}`] : [],
        ...reportingError ? [`rejection reporting failed: ${reportingError}`] : []
      ].join("; ");
      throw new Error(detail, { cause: error });
    }
  }
  async markHeadCommitted(pending, identity) {
    const value = pending.value;
    try {
      return await this.store.put({
        key: CURRENT_KEY,
        value: {
          ...value,
          commitProof: {
            version: HEAD_COMMIT_PROOF_VERSION,
            status: "committed"
          }
        },
        ifVersion: pending.version,
        identity
      });
    } catch (error) {
      if (!isCasError(error)) throw error;
      const current = this.store.get(CURRENT_KEY);
      if (current && current.value.transitionId === value.transitionId && current.value.commitProof?.version === HEAD_COMMIT_PROOF_VERSION && current.value.commitProof?.status === "committed") {
        return current;
      }
      return pending;
    }
  }
  // Advance the compare-and-swap head pointer for a durable proposal. The
  // proposal remains invisible until its commit marker. On CAS contention we
  // re-read, re-validate `from` against the new head, and retry — a bounded
  // number of times. If `from` no longer chains from the current head, the
  // transition is rejected with the actual current label (Schema's surprise:
  // the plan's assumed state was voided by a concurrent writer).
  async advanceHead(input) {
    return (await this.advanceHeadWithBefore(input)).entry;
  }
  async advanceHeadWithBefore(input) {
    let version = input.expectedVersion;
    for (let attempt = 0; attempt < CAS_RETRY_LIMIT; attempt++) {
      const before = this.store.get(CURRENT_KEY);
      try {
        const entry = await this.store.put({
          key: CURRENT_KEY,
          value: input.payload,
          ifVersion: version,
          identity: input.identity
        });
        return { entry, before };
      } catch (error) {
        if (!isCasError(error)) throw error;
        const current = this.store.get(CURRENT_KEY);
        const actualTo = current ? current.value.to : void 0;
        if (!input.force) {
          if (current && input.from !== void 0 && actualTo !== void 0) {
            if (input.from !== actualTo) {
              throw new Error(
                `State contention: head is at "${actualTo}", cannot transition from "${input.from}"`
              );
            }
          } else if (current && input.from === void 0) {
            throw new Error(
              `State contention: head advanced to "${actualTo ?? "<unknown>"}" before transition`
            );
          }
        }
        version = current?.version ?? casActualVersion(error) ?? 0;
      }
    }
    throw new Error(
      `State contention: compare-and-swap retries exhausted after ${CAS_RETRY_LIMIT} attempts`
    );
  }
  async rollbackWrites(writes, identity) {
    const deleted = [];
    const errors = [];
    for (const write of writes) {
      try {
        if (write.before) {
          await this.store.put({
            key: write.key,
            value: write.before.value,
            ifVersion: write.written.version,
            identity
          });
        } else {
          const result = await this.store.delete({
            key: write.key,
            ifVersion: write.written.version
          });
          if (result.deleted && result.version !== void 0) {
            deleted.push({ key: write.key, version: result.version });
          }
        }
      } catch (error) {
        errors.push(`${write.key}: ${boundedError(error)}`);
      }
    }
    return { deleted, errors };
  }
  stateEvents() {
    return this.store.read({ topic: STATE_TOPIC, limit: this.store.maxReadEvents });
  }
  lastDeletedVersion(key) {
    const events = this.stateEvents();
    for (let index = events.length - 1; index >= 0; index--) {
      const event = events[index];
      if (event?.kind !== "transition.rejected") continue;
      const data = event.data;
      const rollback = data?.rollback;
      if (!rollback || !Array.isArray(rollback.deleted)) continue;
      for (const item of rollback.deleted) {
        if (!item || typeof item !== "object") continue;
        const deleted = item;
        if (deleted.key === key && typeof deleted.version === "number") {
          return deleted.version;
        }
      }
    }
    return 0;
  }
  history(input = {}) {
    const events = this.stateEvents();
    const committedIds = committedTransitionIds(events);
    const currentHead = this.getHead();
    const records = [];
    for (const event of events) {
      const record = toRecord(event, committedIds);
      if (record) records.push(record);
    }
    if (currentHead && !records.some((record) => record.transitionId === currentHead.transitionId)) {
      const currentRecord = toHeadRecord(currentHead);
      if (currentRecord) records.push(currentRecord);
    }
    records.sort((left, right) => left.sequence - right.sequence);
    let lastRepresentation = -1;
    for (let index = records.length - 1; index >= 0; index--) {
      if (records[index]?.kind === "representation") {
        lastRepresentation = index;
        break;
      }
    }
    const visibleRecords = input.includeArchived || lastRepresentation < 0 ? records : records.slice(lastRepresentation);
    const visibleIds = new Set(visibleRecords.map((record) => record.transitionId));
    const latestOutcomes = latestTransitionOutcomes(events);
    const eventCertifications = events.map((event) => toCertificate(event, currentHead, latestOutcomes)).filter((certificate) => certificate !== void 0).filter(
      (certificate) => certificate.targets.every((target) => visibleIds.has(target.transitionId))
    ).reverse();
    const durableCertificate = currentHead ? durableCurrentCertificate(currentHead, latestOutcomes) : void 0;
    const certifications = durableCertificate ? [
      durableCertificate,
      ...eventCertifications.filter(
        (certificate) => certificate.certificateId !== durableCertificate.certificateId
      )
    ] : eventCertifications;
    const certificatesBySequence = new Map(
      certifications.map((certificate) => [certificate.sequence, certificate])
    );
    const latestCertificate = /* @__PURE__ */ new Map();
    for (const record of visibleRecords) {
      const outcome = latestOutcomes.get(record.transitionId);
      if (outcome?.phase !== "certified") continue;
      const certificate = certificatesBySequence.get(outcome.event.sequence);
      if (certificate) latestCertificate.set(record.transitionId, certificate);
    }
    if (durableCertificate) {
      latestCertificate.set(currentHead.transitionId, durableCertificate);
    }
    const archiveBoundaryId = input.includeArchived !== true && lastRepresentation > 0 ? records[lastRepresentation]?.transitionId : void 0;
    const filtered = (input.label ? visibleRecords.filter(
      (record) => record.label === input.label || record.to === input.label || record.from === input.label && record.transitionId !== archiveBoundaryId
    ) : visibleRecords).map((record) => {
      const certificate = latestCertificate.get(record.transitionId);
      return certificate ? { ...record, certificationStatus: "certified", certificate } : record;
    });
    const limited = input.limit !== void 0 && input.limit > 0 ? filtered.slice(0, input.limit) : filtered;
    const labelSet = /* @__PURE__ */ new Set();
    const limitedIds = /* @__PURE__ */ new Set();
    for (const record of limited) {
      limitedIds.add(record.transitionId);
      if (record.from && record.transitionId !== archiveBoundaryId) {
        labelSet.add(record.from);
      }
      labelSet.add(record.to);
      labelSet.add(record.label);
    }
    return {
      transitions: limited,
      labels: [...labelSet],
      certifications: certifications.filter(
        (certificate) => certificate.targets.some((target) => limitedIds.has(target.transitionId))
      )
    };
  }
  complexity(input) {
    const requestedFiles = input.files ?? this.complexityLedgers().map((entry) => entry.file);
    const files = [];
    let netDelta = 0;
    for (const file of this.normalizeComplexityFiles(requestedFiles, input.cwd)) {
      const measured = countFileComplexity(path15.resolve(input.cwd, file));
      if (!measured) {
        files.push({ file, supported: false });
        continue;
      }
      const ledger = this.readComplexityLedger(file);
      const delta = ledger ? measured.count - ledger.count : 0;
      netDelta += delta;
      files.push({
        file,
        supported: true,
        language: measured.language,
        current: measured.count,
        ...ledger ? {
          recorded: ledger.count,
          delta,
          recordedDelta: ledger.lastDelta
        } : { delta: 0 }
      });
    }
    return { files, netDelta };
  }
  prepareComplexity(files, cwd, ts) {
    const deltas = [];
    const updates = [];
    let netDelta = 0;
    for (const file of this.normalizeComplexityFiles(files, cwd)) {
      const measured = countFileComplexity(path15.resolve(cwd, file));
      if (!measured) {
        deltas.push({ file, supported: false });
        continue;
      }
      const entry = this.store.get(this.complexityKey(file));
      const previous = entry ? entry.value.count : void 0;
      const delta = previous === void 0 ? 0 : measured.count - previous;
      netDelta += delta;
      deltas.push({
        file,
        supported: true,
        language: measured.language,
        ...previous !== void 0 ? { previous } : {},
        current: measured.count,
        delta,
        baseline: previous === void 0
      });
      const key = this.complexityKey(file);
      updates.push({
        key,
        value: {
          file,
          language: measured.language,
          count: measured.count,
          lastDelta: delta,
          ts
        },
        expectedVersion: entry?.version ?? this.lastDeletedVersion(key),
        before: entry
      });
    }
    return { record: { files: deltas, netDelta }, updates };
  }
  complexityLedgers() {
    return this.store.list(COMPLEXITY_KEY_PREFIX, this.store.maxReadEvents).map((entry) => entry.value).filter(
      (value) => typeof value.file === "string" && typeof value.language === "string" && typeof value.count === "number" && typeof value.lastDelta === "number"
    );
  }
  readComplexityLedger(file) {
    const entry = this.store.get(this.complexityKey(file));
    return entry ? entry.value : void 0;
  }
  complexityKey(file) {
    return `${COMPLEXITY_KEY_PREFIX}${file}`;
  }
  normalizeComplexityFiles(files, cwd) {
    const normalized = /* @__PURE__ */ new Set();
    for (const file of files) {
      if (!file.trim()) continue;
      const relative = path15.relative(cwd, path15.resolve(cwd, file));
      if (relative === ".." || relative.startsWith(`..${path15.sep}`) || path15.isAbsolute(relative)) {
        throw new Error(`State complexity file must be inside the project cwd: ${file}`);
      }
      normalized.add(relative.split(path15.sep).join("/"));
    }
    return [...normalized];
  }
  async goal(input, identity) {
    const value = {
      check: input.check,
      ...input.description !== void 0 ? { description: input.description } : {}
    };
    return this.store.put({
      key: GOAL_KEY,
      value,
      identity
    });
  }
  async checkGoal(input) {
    const entry = this.store.get(GOAL_KEY);
    if (!entry) throw new Error("No goal set");
    const goal = entry.value;
    const result = await runCommand(goal.check, {
      cwd: input.cwd,
      timeoutMs: input.timeoutMs ?? 3e4,
      ...input.signal ? { signal: input.signal } : {}
    });
    const passed = result.status === "confirmed";
    if (passed) {
      const check = truncateUtf82(goal.check, EVENT_TEXT_MAX_BYTES);
      const output = truncateUtf82(result.output, EVENT_OUTPUT_MAX_BYTES);
      await this.store.publish({
        topic: STATE_TOPIC,
        kind: "state.goal.met",
        from: input.identity,
        text: "goal met",
        data: {
          check: check.value,
          checkDigest: digest2(goal.check),
          checkOmittedBytes: check.omittedBytes,
          output: output.value,
          outputBytes: result.outputBytes,
          outputOmittedBytes: result.outputOmittedBytes + output.omittedBytes,
          outputDigest: result.outputDigest,
          exitCode: result.exitCode
        }
      });
    }
    return {
      passed,
      output: result.output,
      exitCode: result.exitCode,
      ...result.error !== void 0 ? { error: result.error } : {}
    };
  }
  async persistCurrentCertificate(certificate, verificationHead, identity) {
    const current = this.store.get(CURRENT_KEY);
    const currentValue = current?.value;
    if (!current || current.version !== verificationHead.version || currentValue?.transitionId !== verificationHead.transitionId || currentValue.label !== verificationHead.label || currentValue.to !== verificationHead.to) {
      return { ...certificate, current: false };
    }
    const certificateHead = certificate.head;
    if (certificateHead === null) return { ...certificate, current: false };
    const nextVersion = current.version + 1;
    const durableCertificate = {
      ...certificate,
      head: { ...certificateHead, version: nextVersion },
      current: true
    };
    try {
      const written = await this.store.put({
        key: CURRENT_KEY,
        value: {
          ...currentValue,
          certificate: durableCertificate
        },
        ifVersion: current.version,
        identity
      });
      return written.version === nextVersion ? durableCertificate : { ...durableCertificate, current: false };
    } catch (error) {
      if (isCasError(error)) return { ...certificate, current: false };
      throw error;
    }
  }
  async revokeCurrentCertificate(verificationHead, identity) {
    const current = this.store.get(CURRENT_KEY);
    const currentValue = current?.value;
    if (!current || current.version !== verificationHead.version || currentValue?.transitionId !== verificationHead.transitionId || currentValue.label !== verificationHead.label || currentValue.to !== verificationHead.to || currentValue.certificate === void 0) {
      return;
    }
    const { certificate: _certificate, ...withoutCertificate } = currentValue;
    try {
      await this.store.put({
        key: CURRENT_KEY,
        value: withoutCertificate,
        ifVersion: current.version,
        identity
      });
    } catch (error) {
      if (!isCasError(error)) throw error;
    }
  }
  async verify(input) {
    const verificationHead = this.getHead();
    const boundedHeadLabel = verificationHead ? truncateUtf82(verificationHead.label, EVENT_TEXT_MAX_BYTES) : void 0;
    const boundedHeadTo = verificationHead ? truncateUtf82(verificationHead.to, EVENT_TEXT_MAX_BYTES) : void 0;
    const headIdentity = verificationHead && boundedHeadLabel && boundedHeadTo ? {
      transitionId: verificationHead.transitionId,
      label: boundedHeadLabel.value,
      labelDigest: digest2(verificationHead.label),
      ...boundedHeadLabel.omittedBytes > 0 ? { labelOmittedBytes: boundedHeadLabel.omittedBytes } : {},
      to: boundedHeadTo.value,
      toDigest: digest2(verificationHead.to),
      ...boundedHeadTo.omittedBytes > 0 ? { toOmittedBytes: boundedHeadTo.omittedBytes } : {},
      version: verificationHead.version
    } : null;
    let targets;
    if (input.labels !== void 0) {
      const matches = /* @__PURE__ */ new Map();
      for (const label of input.labels.filter((item) => item.trim().length > 0)) {
        const { transitions } = this.history({
          label,
          includeArchived: input.includeArchived === true
        });
        for (const transition of transitions) {
          matches.set(transition.transitionId, transition);
        }
      }
      targets = [...matches.values()].sort(
        (left, right) => left.sequence - right.sequence
      );
    } else if (verificationHead) {
      const { transitions } = this.history({
        includeArchived: input.includeArchived === true
      });
      const match = transitions.find(
        (record) => record.transitionId === verificationHead.transitionId
      );
      targets = match ? [match] : [];
    } else {
      targets = [];
    }
    const certificationTargets = targets.map((target) => ({
      transitionId: target.transitionId,
      label: target.label,
      to: target.to
    }));
    const evidenceDigest = digest2(
      targets.map((target) => ({
        transitionId: target.transitionId,
        label: target.label,
        to: target.to,
        evidence: target.evidence ?? []
      }))
    );
    const results = [];
    const failures = [];
    if (targets.length === 0) {
      failures.push({
        reason: "missing-target",
        message: input.labels === void 0 ? "No current state transition is available to verify" : "No active state transitions matched the requested labels"
      });
    }
    for (const target of targets) {
      const evidence = target.evidence ?? [];
      if (evidence.length === 0) {
        failures.push({
          reason: "missing-evidence",
          message: `Transition "${target.label}" has no executable evidence`,
          transitionId: target.transitionId,
          label: target.label
        });
      }
      for (const command of evidence) {
        const result = input.signal?.aborted ? {
          status: "error",
          exitCode: null,
          output: "",
          outputBytes: 0,
          outputOmittedBytes: 0,
          outputDigest: digest2(""),
          error: "aborted before execution"
        } : await runCommand(command, {
          cwd: input.cwd,
          timeoutMs: input.timeoutMs ?? 3e4,
          ...input.signal ? { signal: input.signal } : {}
        });
        results.push(toVerifyResult(target.summary, command, result));
      }
    }
    for (const result of results) {
      if (result.status === "confirmed") continue;
      failures.push({
        reason: result.status === "violated" ? "nonzero-exit" : "execution-error",
        message: result.status === "violated" ? `Evidence exited nonzero (${result.exitCode ?? "unknown"}): ${result.command}` : `Evidence could not be confirmed: ${result.command}${result.error ? ` (${result.error})` : ""}`,
        command: result.command,
        status: result.status,
        exitCode: result.exitCode,
        ...result.error !== void 0 ? { error: result.error } : {}
      });
    }
    let certified = results.length > 0 && failures.length === 0 && results.every((result) => result.status === "confirmed");
    let resultDigest = digest2({ results, failures });
    const boundedTargets = certificationTargets.map((target) => ({
      transitionId: truncateUtf82(target.transitionId, EVENT_TEXT_MAX_BYTES).value,
      label: truncateUtf82(target.label, EVENT_TEXT_MAX_BYTES).value,
      to: truncateUtf82(target.to, EVENT_TEXT_MAX_BYTES).value
    }));
    const targetChunks = [];
    for (let index = 0; index < boundedTargets.length; index += EVENT_TARGET_LIMIT) {
      targetChunks.push(boundedTargets.slice(index, index + EVENT_TARGET_LIMIT));
    }
    if (targetChunks.length === 0) targetChunks.push([]);
    const targetsCurrentHead = verificationHead !== null && certificationTargets.some(
      (target) => target.transitionId === verificationHead.transitionId
    );
    const publishViolation = async () => {
      const nonConfirmed = results.filter((result) => result.status !== "confirmed");
      try {
        for (let index = 0; index < targetChunks.length; index++) {
          await this.store.publish({
            topic: STATE_TOPIC,
            kind: "state.violated",
            from: input.identity,
            text: "state certification blocked",
            data: {
              certified: false,
              head: headIdentity,
              evidenceDigest,
              resultDigest,
              targets: targetChunks[index],
              targetChunk: { index, count: targetChunks.length },
              results: index === 0 ? nonConfirmed.slice(0, EVENT_RESULT_LIMIT).map(toEventResult) : [],
              omittedResultCount: Math.max(0, nonConfirmed.length - EVENT_RESULT_LIMIT),
              reasons: index === 0 ? failures.slice(0, EVENT_RESULT_LIMIT).map(toEventFailure) : [],
              omittedReasonCount: Math.max(0, failures.length - EVENT_RESULT_LIMIT),
              ts: Date.now()
            }
          });
        }
        return void 0;
      } catch (error) {
        return boundedError(error);
      }
    };
    const recordViolation = async () => {
      let revocationError;
      if (targetsCurrentHead && verificationHead) {
        try {
          await this.revokeCurrentCertificate(verificationHead, input.identity);
        } catch (error) {
          revocationError = `current certificate revocation failed: ${boundedError(error)}`;
        }
      }
      const publishError = await publishViolation();
      return [revocationError, publishError].filter((value) => value !== void 0).join("; ") || void 0;
    };
    if (!certified) {
      const reportingError = await recordViolation();
      return {
        results,
        certified: false,
        violated: true,
        certificationStatus: "failed",
        evidenceDigest,
        resultDigest,
        failures,
        ...reportingError ? { reportingError } : {}
      };
    }
    const ts = Date.now();
    try {
      let certificateEvent;
      for (let index = 0; index < targetChunks.length; index++) {
        const event = await this.store.publish({
          topic: STATE_TOPIC,
          kind: "state.certified",
          from: input.identity,
          text: "state certified",
          data: {
            certificationStatus: "certified",
            targets: targetChunks[index],
            targetChunk: { index, count: targetChunks.length },
            head: headIdentity,
            evidenceDigest,
            resultDigest,
            ts
          }
        });
        if (certificateEvent === void 0 || targetChunks[index]?.some(
          (target) => target.transitionId === headIdentity?.transitionId
        )) {
          certificateEvent = event;
        }
      }
      if (!certificateEvent) throw new Error("State certificate event was not recorded");
      const certificate = toCertificate(certificateEvent, this.getHead());
      if (!certificate) throw new Error("State certificate event was malformed");
      const durableCertificate = verificationHead && certificate.current ? await this.persistCurrentCertificate(
        certificate,
        verificationHead,
        input.identity
      ) : certificate;
      return {
        results,
        certified: true,
        violated: false,
        certificationStatus: "certified",
        evidenceDigest,
        resultDigest,
        failures,
        certificate: durableCertificate
      };
    } catch (error) {
      certified = false;
      const certificationReportingError = boundedError(error);
      failures.push({
        reason: "reporting-error",
        message: `Certification could not be recorded: ${certificationReportingError}`,
        error: certificationReportingError
      });
      resultDigest = digest2({ results, failures });
      const violationReportingError = await recordViolation();
      const reportingError = violationReportingError ? `${certificationReportingError}; violation reporting failed: ${violationReportingError}` : certificationReportingError;
      return {
        results,
        certified,
        violated: true,
        certificationStatus: "failed",
        evidenceDigest,
        resultDigest,
        failures,
        reportingError
      };
    }
  }
};

// src/providers/state-provider.ts
var STATE_ENTITY_ID = "fabric-state";
var transitionSchema = {
  type: "object",
  properties: {
    label: {
      type: "string",
      description: 'Name of this transition (the move), e.g. "applied auth patch"'
    },
    from: {
      type: "string",
      description: "State label this transition moves from. Must equal the current head's to-label when a head exists; rejected on mismatch unless force is set."
    },
    to: {
      type: "string",
      description: "Resulting state label (the new world-model version)"
    },
    summary: { type: "string", description: "Short human-readable claim this transition asserts" },
    evidence: {
      type: "array",
      items: { type: "string" },
      description: "Trusted shell commands attached as evidence. Attachment is not certification; state.verify must run at least one command and confirm every result."
    },
    tags: { type: "array", items: { type: "string" } },
    kind: {
      type: "string",
      enum: ["state", "representation"],
      description: 'Default "state". "representation" revises the state schema and archives all earlier labels.'
    },
    complexity: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: { type: "string" },
          description: "Project-relative TS/JS/TSX/JSX files whose decision points this transition changes."
        }
      },
      required: ["files"],
      additionalProperties: false
    },
    force: {
      type: "boolean",
      description: "Override the from-mismatch and contention guards."
    }
  },
  required: ["label", "to", "summary"],
  additionalProperties: false
};
var verifySchema = {
  type: "object",
  properties: {
    labels: {
      type: "array",
      items: { type: "string" },
      description: "Verify transitions matching these labels (by transition.label, from, or to). Omit to verify the current head; an empty or unmatched selection fails closed."
    },
    includeArchived: {
      type: "boolean",
      description: "Also replay evidence from labels before the last representation transition."
    },
    timeoutMs: { type: "number", minimum: 1, description: "Per-command timeout (default 30s)" }
  },
  additionalProperties: false
};
var historySchema = {
  type: "object",
  properties: {
    label: { type: "string", description: "Filter transitions by label, from, or to" },
    limit: { type: "number", minimum: 1 },
    includeArchived: {
      type: "boolean",
      description: "Reveal labels before the last representation transition."
    }
  },
  additionalProperties: false
};
var complexitySchema = {
  type: "object",
  properties: {
    files: {
      type: "array",
      items: { type: "string" },
      description: "Project-relative files to count. Omit to inspect all recorded files."
    }
  },
  additionalProperties: false
};
var goalSchema = {
  type: "object",
  properties: {
    check: {
      type: "string",
      description: "Executable shell predicate; exit 0 means the goal is met."
    },
    description: { type: "string" }
  },
  required: ["check"],
  additionalProperties: false
};
var checkGoalSchema = {
  type: "object",
  properties: { timeoutMs: { type: "number", minimum: 1 } },
  additionalProperties: false
};
var emptySchema3 = { type: "object", properties: {}, additionalProperties: false };
var descriptors5 = [
  {
    name: "transition",
    description: "Append a labeled, validated state transition and compare-and-swap advance the head",
    inputSchema: transitionSchema,
    risk: "write",
    namespace: "state"
  },
  {
    name: "get",
    description: "Return the current state head, goal, compact complexity summary, recent labels, and current/recent certification state",
    inputSchema: emptySchema3,
    risk: "read",
    namespace: "state"
  },
  {
    name: "history",
    description: "Fold the transition log from its representation archive boundary into an ordered label graph",
    inputSchema: historySchema,
    risk: "read",
    namespace: "state"
  },
  {
    name: "complexity",
    description: "Count current structural decision points and compare them with the complexity ledger",
    inputSchema: complexitySchema,
    risk: "read",
    namespace: "state"
  },
  {
    name: "verify",
    description: "Re-run evidence for the current head (or given labels); fail closed unless at least one command runs and every result is confirmed",
    inputSchema: verifySchema,
    risk: "execute",
    namespace: "state"
  },
  {
    name: "goal",
    description: "Set the executable goal predicate (Schema's is_goal)",
    inputSchema: goalSchema,
    risk: "write",
    namespace: "state"
  },
  {
    name: "checkGoal",
    description: "Run the goal predicate and report pass/fail; publishes state.goal.met when it passes",
    inputSchema: checkGoalSchema,
    risk: "execute",
    namespace: "state"
  }
];
var normalizeStateArgs = actionArgNormalizer(() => descriptors5);
var StateProvider = class {
  name = "state";
  description = "Schema-style labeled transition layer: an append-only timeline of validated transitions with a compare-and-swap head and evidence-based certification over mesh storage";
  #store;
  #identity;
  constructor(store, identity) {
    this.#store = new StateStore(store);
    this.#identity = identity;
  }
  get state() {
    return this.#store;
  }
  async list(request, _context) {
    const query = request.query?.toLowerCase();
    return query ? descriptors5.filter(
      (descriptor) => `${descriptor.name} ${descriptor.description}`.toLowerCase().includes(query)
    ) : descriptors5;
  }
  async describe(actionName, _context) {
    return descriptors5.find((descriptor) => descriptor.name === actionName);
  }
  prepareArguments(actionName, args) {
    return normalizeStateArgs(actionName, args);
  }
  async invoke(actionName, args, context) {
    switch (actionName) {
      case "transition": {
        const label = String(args.label);
        const to = String(args.to);
        const summary = String(args.summary);
        const from = typeof args.from === "string" ? args.from : void 0;
        const evidence = Array.isArray(args.evidence) ? args.evidence.filter((item) => typeof item === "string") : void 0;
        const tags = Array.isArray(args.tags) ? args.tags.filter((item) => typeof item === "string") : void 0;
        const kind = args.kind === "representation" || args.kind === "state" ? args.kind : void 0;
        const complexityFiles = typeof args.complexity === "object" && args.complexity !== null && Array.isArray(args.complexity.files) ? args.complexity.files.filter(
          (item) => typeof item === "string"
        ) : void 0;
        const force = args.force === true;
        const { event, head } = await this.#store.transition(
          {
            label,
            ...from !== void 0 ? { from } : {},
            to,
            summary,
            ...evidence ? { evidence } : {},
            ...tags ? { tags } : {},
            ...kind ? { kind } : {},
            ...complexityFiles ? { complexity: { files: complexityFiles } } : {},
            force
          },
          this.#identity,
          context.cwd
        );
        context.activity?.({
          type: "entity",
          id: STATE_ENTITY_ID,
          kind: "mesh",
          name: `${label} \u2192 ${to}`
        });
        context.update(`State transitioned to "${to}" via "${label}"`);
        return { event, head };
      }
      case "get": {
        const { head, goal, complexity, certification } = this.#store.get();
        const { labels } = this.#store.history({ limit: 20 });
        return { head, goal, complexity, certification, recentLabels: labels };
      }
      case "history": {
        const label = typeof args.label === "string" ? args.label : void 0;
        const limit = typeof args.limit === "number" ? args.limit : void 0;
        const includeArchived = args.includeArchived === true;
        return this.#store.history({
          ...label !== void 0 ? { label } : {},
          ...limit !== void 0 ? { limit } : {},
          includeArchived
        });
      }
      case "complexity": {
        const files = Array.isArray(args.files) ? args.files.filter((item) => typeof item === "string") : void 0;
        return this.#store.complexity({
          ...files ? { files } : {},
          cwd: context.cwd
        });
      }
      case "verify": {
        const labels = Array.isArray(args.labels) ? args.labels.filter((item) => typeof item === "string") : void 0;
        const timeoutMs = typeof args.timeoutMs === "number" ? args.timeoutMs : void 0;
        const includeArchived = args.includeArchived === true;
        context.activity?.({
          type: "entity",
          id: STATE_ENTITY_ID,
          kind: "mesh",
          name: "verify"
        });
        const result = await this.#store.verify({
          ...labels ? { labels } : {},
          includeArchived,
          cwd: context.cwd,
          ...timeoutMs !== void 0 ? { timeoutMs } : {},
          ...context.signal ? { signal: context.signal } : {},
          identity: this.#identity
        });
        context.update(
          result.certified ? `State certified: ${result.results.length} evidence command(s) confirmed` : result.reportingError ? `State certification blocked; violation reporting failed: ${result.reportingError}` : "State certification blocked; violation details were published"
        );
        return result;
      }
      case "goal": {
        const check = String(args.check);
        const description = typeof args.description === "string" ? args.description : void 0;
        const entry = await this.#store.goal(
          { check, ...description !== void 0 ? { description } : {} },
          this.#identity
        );
        context.activity?.({
          type: "entity",
          id: STATE_ENTITY_ID,
          kind: "mesh",
          name: "goal"
        });
        return entry;
      }
      case "checkGoal": {
        const timeoutMs = typeof args.timeoutMs === "number" ? args.timeoutMs : void 0;
        const result = await this.#store.checkGoal({
          cwd: context.cwd,
          ...timeoutMs !== void 0 ? { timeoutMs } : {},
          ...context.signal ? { signal: context.signal } : {},
          identity: this.#identity
        });
        context.update(
          result.passed ? "Goal met" : "Goal not met"
        );
        return result;
      }
      default:
        throw new Error(`Unknown state action: ${actionName}`);
    }
  }
};

// src/fabric-runtime-state.ts
var BACKGROUND_COMPLETION_MAX_CHARS = 8e3;
var inheritedCapabilityRequirements = () => {
  const source = process.env.PI_FABRIC_CAPABILITY_REQUIREMENTS;
  if (!source) return [];
  const parsed = JSON.parse(source);
  if (!Array.isArray(parsed) || parsed.length > 128) {
    throw new Error("PI_FABRIC_CAPABILITY_REQUIREMENTS must be an array of at most 128 refs");
  }
  const refs = parsed.filter((value) => typeof value === "string");
  if (refs.length !== parsed.length || refs.some((ref) => ref.length > 256 || !ref.includes("."))) {
    throw new Error("PI_FABRIC_CAPABILITY_REQUIREMENTS contains an invalid provider.action ref");
  }
  return [...new Set(refs)];
};
var escapeXmlText = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
var FabricRuntimeState = class {
  constructor(pi, capturedTools, options = {}) {
    this.pi = pi;
    this.capturedTools = capturedTools;
    this.activity = options.activity ?? new FabricActivityStore();
    this.prewalk = options.prewalk ?? new PrewalkController();
    this.prewalkDrift = options.prewalkDrift ?? new PrewalkDriftTracker();
    this.sessionApprovals = options.sessionApprovals ?? new FabricSessionApprovals();
    this.#paths = options.paths;
  }
  #registry;
  #mcpProvider;
  #config;
  #execution;
  #repairs;
  #speculationStore;
  #speculationTap;
  #agents;
  #actors;
  #globalActors;
  #mesh;
  #identity;
  #mainAgent;
  #participants;
  #control;
  #lifecycle;
  #residency;
  #agentsProvider;
  #compact;
  #schema;
  #componentSupervisor;
  #componentLoader;
  #componentTransitionSignatures = /* @__PURE__ */ new Map();
  #componentTransitionPublications = /* @__PURE__ */ new Set();
  #sessionCapabilityLease;
  #unsubscribeCapturedCatalog;
  #cwd;
  #externalProviders = /* @__PURE__ */ new Map();
  #builtinComponentNames = /* @__PURE__ */ new Set();
  componentCatalog = new FabricComponentCatalog();
  activity;
  prewalk;
  prewalkDrift;
  sessionApprovals;
  #paths;
  #widgetDismissedAt = 0;
  #suppressResidentGuidanceSync = false;
  get initialized() {
    return Boolean(this.#execution);
  }
  get widgetDismissedAt() {
    return this.#widgetDismissedAt;
  }
  set widgetDismissedAt(value) {
    this.#widgetDismissedAt = value;
  }
  get cwd() {
    return this.#cwd;
  }
  get config() {
    if (!this.#config) throw new Error("Pi Fabric has not initialized");
    return this.#config;
  }
  /** Stream tap for speculative PTC; undefined when speculation is disabled. */
  get speculationTap() {
    return this.#speculationTap;
  }
  /** Turn-boundary backstop: tap state and unserved entries never outlive a turn. */
  resetSpeculation() {
    this.#speculationTap?.reset();
    this.#speculationStore?.reset();
  }
  // Speculative PTC: the store is the epoch-checked promise cache consumed by
  // ActionRegistry.invoke; the tap watches fabric_exec argument streaming and
  // launches literal-args Tier-A calls early (docs/speculation.md).
  #wireSpeculation() {
    const config = this.#config;
    const registry = this.#registry;
    if (!config || !registry || !config.speculation.enabled) return;
    const { speculation } = config;
    const store = new FabricSpeculationStore(speculation);
    registry.setSpeculation(store, (action) => isSpeculationEligible(
      {
        ref: action.ref,
        provider: action.provider,
        risk: action.risk,
        effectKind: action.effect?.kind,
        ...action.annotations ? { annotations: action.annotations } : {}
      },
      speculation.mcpAllowlist
    ));
    this.#speculationStore = store;
    this.#speculationTap = new FabricSpeculationStreamTap({
      enabled: () => this.#config?.speculation.enabled === true,
      maxBufferBytes: () => this.#config?.speculation.maxBufferBytes ?? 2 * 1024 * 1024,
      isEligible: (ref) => TIER_A_SPECULATION_REFS.has(ref) || ref.startsWith("mcp.") && mcpAllowlistMatch(
        ref.slice("mcp.".length),
        this.#config?.speculation.mcpAllowlist ?? []
      ),
      launch: (toolCallId, candidate, extensionContext) => {
        void this.#launchSpeculation(toolCallId, candidate, extensionContext).catch(
          () => void 0
        );
      }
    });
    void import("./scanner-3RUZ7Z7K.js").then(
      (module) => {
        this.#speculationTap?.setScannerFactory(() => new module.LiteralCallScanner());
      },
      () => void 0
    );
  }
  async #launchSpeculation(toolCallId, candidate, context) {
    const registry = this.#registry;
    const store = this.#speculationStore;
    if (!registry || !store || this.#config?.speculation.enabled !== true) return;
    const replay = {};
    const lightContext = {
      cwd: context.cwd,
      signal: void 0,
      parentToolCallId: toolCallId,
      nestedToolCallId: "fabric-speculation",
      extensionContext: context,
      update() {
      },
      ...this.#sessionCapabilityLease?.view ? { capabilityView: this.#sessionCapabilityLease.view } : {}
    };
    const speculation = await registry.speculate(
      candidate.ref,
      candidate.args,
      lightContext,
      replay
    );
    if (!speculation) return;
    store.launch(
      toolCallId,
      candidate.ref,
      speculation.preparedArgs,
      speculation.execute,
      createFreshnessChecker(candidate.ref, speculation.preparedArgs, context.cwd),
      replay,
      speculation.bindingToken
    );
  }
  get registry() {
    if (!this.#registry) throw new Error("Pi Fabric has not initialized");
    return this.#registry;
  }
  get components() {
    if (!this.#componentLoader) throw new Error("Pi Fabric has not initialized");
    return this.#componentLoader;
  }
  get execution() {
    if (!this.#execution) throw new Error("Pi Fabric has not initialized");
    return this.#execution;
  }
  get agents() {
    if (!this.#agents) throw new Error("Pi Fabric has not initialized");
    return this.#agents;
  }
  get actors() {
    if (!this.#actors) throw new Error("Pi Fabric has not initialized");
    return this.#actors;
  }
  get globalActors() {
    if (!this.#globalActors) throw new Error("Pi Fabric has not initialized");
    return this.#globalActors;
  }
  get mesh() {
    if (!this.#mesh) throw new Error("Pi Fabric has not initialized");
    return this.#mesh;
  }
  mainAgentInfo(context) {
    if (!this.#mainAgent) throw new Error("Pi Fabric has not initialized");
    return this.#mainAgent.info(context);
  }
  peerInfos() {
    return this.#participants?.peers() ?? [];
  }
  componentGraph() {
    return this.#componentLoader?.graph() ?? { components: [], edges: [], cycles: [] };
  }
  modelGuidance() {
    return this.#componentSupervisor?.guidance() ?? [];
  }
  participantInfos(options = {}) {
    return this.#participants?.list(options) ?? [];
  }
  async queueUserMessage(targetId, message2, delivery) {
    if (!this.#mainAgent || !this.#agentsProvider) {
      throw new Error("Pi Fabric has not initialized");
    }
    if (this.#mainAgent.matches(targetId) && this.#mainAgent.local) {
      return this.#mainAgent.deliverUser(message2, delivery);
    }
    return this.#agentsProvider.routeMessage(targetId, message2, void 0, delivery);
  }
  async stopParticipant(targetId) {
    if (!this.#agentsProvider) throw new Error("Pi Fabric has not initialized");
    return this.#agentsProvider.stopParticipant(targetId);
  }
  get compact() {
    if (!this.#compact) throw new Error("Pi Fabric has not initialized");
    return this.#compact;
  }
  get repairs() {
    if (!this.#repairs) throw new Error("Pi Fabric has not initialized");
    return this.#repairs;
  }
  async initialize(context, bootstrapConfig) {
    this.#suppressResidentGuidanceSync = true;
    try {
      await this.#closeInternal();
    } finally {
      this.#suppressResidentGuidanceSync = false;
    }
    for (const name of this.#builtinComponentNames) this.componentCatalog.unregister(name);
    this.#builtinComponentNames.clear();
    this.prewalk.cancel();
    this.prewalkDrift.clear();
    context.ui.setStatus("fabric-prewalk", void 0);
    this.#speculationTap?.reset();
    this.#speculationStore?.reset();
    this.#speculationTap = void 0;
    this.#speculationStore = void 0;
    this.activity.reset();
    this.sessionApprovals.approvedRisks.clear();
    this.#cwd = context.cwd;
    const projectTrusted = context.isProjectTrusted();
    this.#config = bootstrapConfig ?? loadFabricConfig({
      cwd: context.cwd,
      agentDir: resolveAgentDir(),
      projectTrusted
    });
    this.#registry = new ActionRegistry(
      new FabricToolResultProxy(() => this.capturedTools.runner)
    );
    this.#wireSpeculation();
    this.#unsubscribeCapturedCatalog?.();
    this.#unsubscribeCapturedCatalog = this.capturedTools.subscribe(() => {
      this.#registry?.notifyCatalogChanged("extensions");
      this.#refreshRepairCatalog();
    });
    this.#componentSupervisor = new FabricComponentSupervisor(this.#registry, {
      invocationContext: () => ({
        cwd: context.cwd,
        signal: void 0,
        parentToolCallId: "fabric-component",
        nestedToolCallId: "fabric-component",
        extensionContext: context,
        update() {
        }
      }),
      maxResultChars: this.#config.executor.maxNestedResultChars,
      acquire: async (ref, args, invocation) => {
        const action = await this.#registry.describe(ref, invocation);
        await this.#schema?.authorize(action.ref, invocation.parentToolCallId);
        return this.#registry.acquireScoped(ref, args, invocation);
      },
      invoke: (ref, args, invocation) => this.#registry.invoke(ref, args, {
        ...invocation,
        ...this.#schema ? { authorize: (action) => this.#schema.authorize(action.ref, invocation.parentToolCallId) } : {},
        approve: async () => {
        },
        audits: [],
        maxResultChars: this.#config.executor.maxNestedResultChars
      })
    });
    this.#componentSupervisor.subscribe(
      (componentId) => this.#observeComponentTransitions(componentId)
    );
    this.#componentLoader = new FabricComponentLoader(
      this.componentCatalog,
      this.#componentSupervisor
    );
    this.#registry.register(new ComponentsProvider(this.#componentLoader));
    const builtinManifest = new FabricProviderComponentManifest(
      this.componentCatalog,
      this.#componentLoader
    );
    const installBuiltin = async (component) => {
      await builtinManifest.install(component);
      this.#builtinComponentNames.add(component.definition.name);
    };
    const enforceSchema = this.#config.schema.mode === "enforce";
    const effectiveFullCodeMode = this.#config.fullCodeMode || enforceSchema;
    const capturedToolsProvider = effectiveFullCodeMode && (this.#config.capture.enabled || enforceSchema) ? new CapturedToolsProvider(this.capturedTools) : void 0;
    if (effectiveFullCodeMode) {
      await installBuiltin(createProviderComponent({
        provider: "pi",
        description: "Pi core tools adapter",
        create: () => new PiToolsProvider(
          context.cwd,
          this.capturedTools,
          capturedToolsProvider
        )
      }));
    }
    await installBuiltin(createProviderComponent({
      provider: "mcp",
      description: "MCP runtime and descriptor cache",
      create: () => new McpProvider(context.cwd, this.#config.mcp, {
        ...this.#config.mcp.cache.enabled ? {
          cache: new McpDescriptorCacheStore(
            path16.join(
              process.env.PI_FABRIC_PROJECT_ROOT ?? context.cwd,
              ".pi",
              "fabric",
              "mcp-cache.json"
            )
          )
        } : {},
        hooks: {
          onSliceChanged: () => {
            this.#registry?.notifyCatalogChanged("mcp");
          }
        }
      }),
      mounted: (provider) => {
        this.#mcpProvider = provider;
      },
      unmounted: (provider) => {
        if (this.#mcpProvider === provider) this.#mcpProvider = void 0;
      },
      start: (provider) => {
        provider.warmup();
      }
    }));
    if (capturedToolsProvider && !enforceSchema) {
      await installBuiltin(createProviderComponent({
        provider: "extensions",
        description: "Captured extension tool catalog",
        create: () => capturedToolsProvider
      }));
    }
    const sessionId = context.sessionManager.getSessionId();
    const { identity, mainAgentId } = resolveFabricIdentity(sessionId);
    const ownsPersistentActorRegistry = identity.kind === "main" && !enforceSchema && projectTrusted && this.#config.mesh.enabled;
    const mainAgent = new MainAgentController(
      this.pi,
      mainAgentId,
      identity.kind === "main" && identity.id === mainAgentId,
      context.cwd,
      identity.kind === "main" ? sessionId : void 0
    );
    this.#mainAgent = mainAgent;
    const projectRoot = process.env.PI_FABRIC_PROJECT_ROOT ?? context.cwd;
    const configuredMeshRoot = this.#config.mesh.root;
    const meshRoot = process.env.PI_FABRIC_MESH_ROOT ?? (configuredMeshRoot ? path16.resolve(projectRoot, configuredMeshRoot) : path16.join(projectRoot, ".pi", "fabric", "mesh"));
    this.#mesh = new MeshStore(
      meshRoot,
      this.#config.mesh.maxEventBytes,
      this.#config.mesh.maxReadEvents
    );
    const hostId = identity.kind === "main" ? mainAgentId : `runtime:${sessionId}`;
    this.#participants = new ParticipantDirectory(this.#mesh, {
      enabled: this.#config.mesh.enabled,
      hostId,
      rootId: mainAgentId,
      identity,
      ...process.env.PI_FABRIC_OWNER_HOST_ID ? { selfOwnerHostId: process.env.PI_FABRIC_OWNER_HOST_ID } : {},
      ...process.env.PI_FABRIC_OWNER_IDENTITY_ID ? { selfOwnerIdentityId: process.env.PI_FABRIC_OWNER_IDENTITY_ID } : {}
    });
    this.#control = new FabricControlPlane(this.#mesh, identity, {
      enabled: this.#config.mesh.enabled,
      hostId,
      pollMs: this.#config.mesh.actorPollMs
    });
    if (this.#config.mesh.enabled) {
      await installBuiltin(createProviderComponent({
        provider: "mesh",
        description: "Project mesh and participant directory",
        create: () => new MeshProvider(this.#mesh, identity, this.#participants)
      }));
      await installBuiltin(createProviderComponent({
        provider: "state",
        description: "Labeled world state over the project mesh",
        requires: ["mesh.get"],
        create: () => new StateProvider(this.#mesh, identity)
      }));
    } else {
      const meshDisabled = 'disabled by configuration (mesh.enabled=false); set "mesh": { "enabled": true } in .pi/fabric.json or the agent fabric.json';
      this.#registry.markUnavailable("mesh", `${meshDisabled} to enable mesh.* actions`);
      this.#registry.markUnavailable("state", `${meshDisabled}; state.* actions run on the mesh`);
    }
    this.#schema = new SchemaController(
      context.cwd,
      this.#config.schema,
      this.#mesh,
      identity,
      new StateStore(this.#mesh)
    );
    await installBuiltin(createProviderComponent({
      provider: "schema",
      description: "Schema verification and workspace transactions",
      create: () => new SchemaProvider(this.#schema)
    }));
    this.#identity = identity;
    this.#compact = new CompactController({
      onRequest: (intent) => void this.#publishCompactEvent("requested", intent),
      onCommit: (info) => void this.#publishCompactEvent(info.status, info)
    });
    await installBuiltin(createProviderComponent({
      provider: "compact",
      description: "Host context compaction controller",
      create: () => new CompactProvider(this.#compact)
    }));
    const agentConfig = enforceSchema ? { ...this.#config.agents, enabled: false } : this.#config.agents;
    this.#agents = new AgentManager(context.cwd, agentConfig, {
      fullCodeMode: this.#config.fullCodeMode,
      mainAgentId,
      meshRoot,
      projectRoot,
      hostId,
      identityId: identity.id,
      retention: this.#config.retention,
      ...this.#paths ? {
        workerPath: this.#paths.worker,
        fabricExtensionPath: this.#paths.extension
      } : {},
      resolveParticipantGuidance: ({ model, runner }) => {
        const targetModel = model ?? (runner === "pi" && context.model ? `${context.model.provider}/${context.model.id}` : void 0);
        if (!targetModel) return void 0;
        return resolveFabricModelGuidance(this.modelGuidance(), {
          model: targetModel,
          target: "participant",
          includeSlots: false
        }).appendText || void 0;
      },
      preparePiModel: async (modelKey) => {
        const separator = modelKey.indexOf("/");
        if (separator <= 0 || separator === modelKey.length - 1) return;
        const model = context.modelRegistry.find(
          modelKey.slice(0, separator),
          modelKey.slice(separator + 1)
        );
        if (!model) return;
        const auth = await context.modelRegistry.getApiKeyAndHeaders(model);
        if (!auth.ok) throw new Error(auth.error);
      },
      onLifecycle: (event) => {
        const lifecycle = this.#lifecycle;
        if (lifecycle) void lifecycle.publish(event).catch(() => void 0);
      },
      onBackgroundComplete: (result) => {
        const durationMs = Math.max(0, (result.finishedAt ?? Date.now()) - result.startedAt);
        const duration = durationMs < 6e4 ? `${Math.round(durationMs / 1e3)}s` : `${(durationMs / 6e4).toFixed(1)}m`;
        const summary = result.text || result.error || "no result";
        const clippedSummary = summary.length > BACKGROUND_COMPLETION_MAX_CHARS ? `${summary.slice(0, BACKGROUND_COMPLETION_MAX_CHARS)}
[completion truncated]` : summary;
        this.pi.sendMessage(
          {
            customType: "pi-fabric-agent-complete",
            content: `Fabric agent ${result.id.slice(0, 8)} ${result.status} after ${duration}: ${clippedSummary}`,
            display: true,
            details: result
          },
          { deliverAs: "followUp", triggerTurn: true }
        );
      }
    });
    const canManageActor = (actorId) => {
      const participant = this.#participants?.get(actorId);
      return participant ? participant.ownerHostId === hostId : void 0;
    };
    const lineageAlive = (rootId) => this.#participants?.get(rootId) !== void 0;
    const persistentActorRoot = this.#config.mesh.actorScope === "session" ? path16.join(meshRoot, "actors", sessionId) : path16.join(meshRoot, "actors");
    const acquireActorCapabilityView = (requirements, signal) => this.#registry.acquireCapabilityView(requirements, {
      cwd: context.cwd,
      signal,
      parentToolCallId: "fabric-actor-capability",
      nestedToolCallId: "fabric-actor-capability",
      extensionContext: context,
      update() {
      }
    });
    this.#actors = new ActorManager(
      sessionId,
      identity,
      this.#mesh,
      enforceSchema ? { ...this.#config.mesh, enabled: false } : this.#config.mesh,
      this.#agents,
      ({ actor, message: message2, delivery, triggerTurn }) => {
        const text = message2.text ?? "";
        if (!text) return;
        const deliveryNotice = actorDeliveryNotice(delivery, triggerTurn);
        this.pi.sendMessage(
          {
            customType: "pi-fabric-actor",
            content: [
              `<fabric-actor name=${JSON.stringify(actor.name)} id=${JSON.stringify(actor.id)}>
${escapeXmlText(text)}
</fabric-actor>`,
              deliveryNotice
            ].filter((line) => Boolean(line)).join("\n"),
            display: true,
            details: {
              actor,
              message: message2,
              delivery: { mode: delivery, triggerTurn, passive: Boolean(deliveryNotice) }
            }
          },
          { deliverAs: delivery, triggerTurn }
        );
      },
      ownsPersistentActorRegistry ? {
        actorRoot: persistentActorRoot,
        persistent: true,
        mainAgent,
        canManageActor,
        lineageAlive,
        claimResidency: "session",
        rootId: mainAgentId,
        retention: this.#config.retention,
        acquireCapabilityView: acquireActorCapabilityView
      } : {
        persistent: false,
        mainAgent,
        canManageActor,
        lineageAlive,
        claimResidency: "session",
        rootId: mainAgentId,
        retention: this.#config.retention,
        acquireCapabilityView: acquireActorCapabilityView
      }
    );
    this.#registry.subscribeProviderChanges(() => {
      this.#actors?.retryCapabilityWaiters();
      this.#refreshRepairCatalog();
    });
    this.#lifecycle = new LifecycleBroker(
      this.#mesh,
      identity,
      this.#participants,
      {
        enabled: this.#config.mesh.enabled && !enforceSchema,
        pollMs: this.#config.mesh.actorPollMs,
        maxReadEvents: this.#config.mesh.maxReadEvents
      },
      async (subscription, event) => {
        if (!this.#agentsProvider) throw new Error("Fabric agents provider is unavailable");
        await this.#agentsProvider.deliverLifecycle(subscription, event);
      }
    );
    this.#globalActors = new GlobalActorRegistry(resolveAgentDir(), this.#config.mesh.maxEventBytes);
    this.#residency = ownsPersistentActorRegistry ? new ResidencyClient({
      config: {
        format: RESIDENT_HOST_FORMAT,
        rootId: mainAgentId,
        sessionId,
        cwd: context.cwd,
        projectRoot,
        meshRoot,
        actorRoot: persistentActorRoot,
        residencyRoot: residentRoot(meshRoot, mainAgentId),
        fullCodeMode: this.#config.fullCodeMode,
        agents: structuredClone(this.#config.agents),
        mesh: structuredClone(this.#config.mesh),
        retention: structuredClone(this.#config.retention),
        workerPath: this.#paths?.worker ?? fileURLToPath2(new URL("./worker.js", import.meta.url)),
        fabricExtensionPath: this.#paths?.extension ?? fileURLToPath2(new URL("./index.js", import.meta.url)),
        piBinary: resolvePiBinary(),
        claudeBinary: process.env.PI_FABRIC_CLAUDE_BINARY ?? this.#config.agents.claude.binary,
        vedaBinary: process.env.PI_FABRIC_VEDA_BINARY ?? this.#config.agents.veda.binary,
        modelGuidance: []
      },
      mesh: this.#mesh,
      participants: this.#participants,
      mainAgent,
      ...this.#paths ? { hostPath: this.#paths.residentHost } : {}
    }) : void 0;
    const firstSeenAgents = /* @__PURE__ */ new Map();
    if (mainAgent.local) {
      this.#participants.registerSource(() => [
        this.#participants.root(mainAgent.info(context))
      ]);
    }
    this.#participants.registerSource(
      () => agentParticipantRecords(
        this.#agents.listForUi(),
        mainAgentId,
        hostId,
        identity.id,
        identity.id,
        firstSeenAgents
      )
    );
    this.#participants.registerSource(
      () => this.#actors.listOwned().map(
        (actor) => actorParticipantRecord(actor, mainAgentId, hostId, identity.id, identity.id)
      )
    );
    this.#agents.subscribeUi(() => this.#participants?.scheduleRefresh());
    this.#actors.subscribe(() => this.#participants?.scheduleRefresh());
    const agentsProvider = new AgentsProvider(
      this.#agents,
      this.#actors,
      this.#globalActors,
      mainAgent,
      this.#participants,
      this.#control,
      this.#lifecycle,
      () => this.#config?.ui.showAgentToolPreview ?? true,
      this.#residency,
      false,
      () => this.#config?.models ?? DEFAULT_FABRIC_CONFIG.models
    );
    this.#agentsProvider = agentsProvider;
    this.#control.start((command, from, signal) => agentsProvider.acceptControl(command, from, signal));
    try {
      await this.#participants.start();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.warn(
        `[pi-fabric] Initial mesh publish failed (${detail}); the participant heartbeat will keep retrying.`
      );
      if (context.hasUI) {
        context.ui.notify(
          `Pi Fabric could not reach the mesh (${detail}); retrying in the background.`,
          "warning"
        );
      }
    }
    this.#lifecycle.start();
    this.#residency?.start();
    await installBuiltin(createProviderComponent({
      provider: "agents",
      description: "Agents, actors, lifecycle delivery, and residency control",
      create: () => agentsProvider
    }));
    if (this.#config.memory.enabled) {
      const sessionFile = context.sessionManager.getSessionFile();
      const memoryContext = {
        agentDir: resolveAgentDir(),
        cwd: context.cwd,
        config: this.#config.memory,
        sessionId,
        ...sessionFile ? { sessionFile } : {},
        getLiveBranch: () => ({
          entries: context.sessionManager.getBranch(),
          leafId: context.sessionManager.getLeafId()
        })
      };
      await installBuiltin(createProviderComponent({
        provider: "memory",
        description: "Session memory index and source hydration",
        create: () => new MemoryProvider(memoryContext)
      }));
    } else {
      this.#registry.markUnavailable(
        "memory",
        'disabled by configuration (memory.enabled=false); set "memory": { "enabled": true } in .pi/fabric.json or the agent fabric.json to enable memory.* actions'
      );
    }
    const expectedBuiltinProviders = /* @__PURE__ */ new Set([
      ...effectiveFullCodeMode ? ["pi"] : [],
      ...capturedToolsProvider ? ["extensions"] : [],
      "mcp",
      ...this.#config.mesh.enabled ? ["mesh", "state"] : [],
      "schema",
      "compact",
      "agents",
      ...this.#config.memory.enabled ? ["memory"] : []
    ]);
    builtinManifest.assertActive(expectedBuiltinProviders, this.#registry);
    for (const provider of this.#externalProviders.values()) {
      this.#registry.register(provider);
    }
    this.#execution = new FabricExecutionService(
      this.#registry,
      this.#config,
      this.activity,
      this.#schema,
      void 0,
      this.sessionApprovals,
      this.capturedTools
    );
    const discovery = {
      version: 1,
      register: (provider, options) => this.registerExternal(provider, options)
    };
    this.pi.events.emit(FABRIC_PROVIDER_DISCOVER_EVENT, discovery);
    const componentDiscovery = {
      version: 1,
      register: (component, options) => this.registerExternalComponent(component, options)
    };
    this.pi.events.emit(FABRIC_COMPONENT_DISCOVER_EVENT, componentDiscovery);
    await this.#componentLoader.reconcile(enforceSchema ? [] : this.#config.components);
    const inheritedRequirements = inheritedCapabilityRequirements();
    const inheritedDigest = process.env.PI_FABRIC_CAPABILITY_DIGEST;
    const hasInheritedCommit = process.env.PI_FABRIC_CAPABILITY_REQUIREMENTS !== void 0 && Boolean(inheritedDigest);
    if (inheritedRequirements.length > 0 || hasInheritedCommit) {
      const lease = await this.#registry.acquireCapabilityView(inheritedRequirements, {
        cwd: context.cwd,
        signal: void 0,
        parentToolCallId: "fabric-capability-commit",
        nestedToolCallId: "fabric-capability-commit",
        extensionContext: context,
        update() {
        }
      });
      if (!lease.satisfied || !lease.view) {
        await lease.release();
        throw new Error(
          `Required Fabric capabilities are unavailable: ${lease.missing.join(", ")}`
        );
      }
      const expectedDigest = inheritedDigest;
      if (expectedDigest && lease.view.semanticDigest !== expectedDigest) {
        await lease.release();
        throw new Error(
          `Fabric capability commitment mismatch: expected ${expectedDigest}, resolved ${lease.view.semanticDigest}`
        );
      }
      this.#sessionCapabilityLease = lease;
      this.#execution.setCapabilityView(lease.view);
    }
    this.#repairs = new RepairCompiler({
      agentDir: resolveAgentDir(),
      enabled: this.#config.repairs.enabled
    });
    this.#refreshRepairCatalog();
    setActiveRepairCompiler(this.#repairs);
  }
  async ensure(context) {
    if (!this.initialized || this.#cwd !== context.cwd) await this.initialize(context);
  }
  // Accepts the config FabricState just loaded so a /fabric settings save
  // costs one loadFabricConfig instead of two. The runtime still stamps
  // schema.mode from its own previous config, preserving the existing
  // in-memory override chain (state and runtime share the same preserved
  // mode by construction: the runtime's config originates from FabricState).
  // Ephemeral schema mode override: mutates the live config in place so the
  // per-call readers (SchemaController.authorize, the top-level tool gate,
  // ExecutionService's runtime selection) see the change immediately without
  // a provider-topology rebuild. FabricState owns the coupling rules.
  setSchemaMode(mode, executorRuntime) {
    if (!this.#config) return;
    this.#config.schema.mode = mode;
    this.#config.executor.runtime = executorRuntime;
  }
  reloadConfig(context, next) {
    if (!this.#config || !this.#cwd) return;
    next.schema.mode = this.#config.schema.mode;
    const previousComponents = structuredClone(this.#config.components);
    deepAssign(this.#config, next);
    if (next.prewalk.enabled === false && this.prewalk.status().state !== "idle") {
      this.prewalk.cancel();
      this.prewalkDrift.drop(context.sessionManager.getSessionId());
      if (context.hasUI) context.ui.setStatus("fabric-prewalk", void 0);
    }
    void this.#componentLoader?.reconcile(next.components).catch((error) => {
      if (this.#config) this.#config.components = previousComponents;
      const detail = error instanceof Error ? error.message : String(error);
      if (context.hasUI) context.ui.notify(`Pi Fabric component reload failed: ${detail}`, "error");
    });
  }
  async claimHandoff(execution, sessionId, resultFormat, outerToolCallId) {
    if (this.#config?.prewalk.enabled === false) return void 0;
    let pending = claimFabricHandoff(this.prewalk, execution, sessionId, resultFormat);
    if (!pending && this.#config?.prewalk.detectShellWrites) {
      pending = await this.#claimShellWriteHandoff(execution, sessionId, resultFormat);
    }
    if (pending) {
      this.activity.resume(outerToolCallId);
      this.activity.beginCall(outerToolCallId, {
        callId: pending.audit.nestedToolCallId,
        ref: pending.audit.ref,
        args: pending.args
      });
    }
    return pending;
  }
  // Filesystem fallback for writes audits cannot attribute (shell heredocs,
  // sed -i, formatter binaries). Gated on a successful pi.bash in the program
  // so read-only scans never pay the stat walk, and external saves can only
  // mis-fire inside a bash-running window. The tracker refreshes its baseline
  // on every evaluation, claimed or not, so one change never fires twice.
  async #claimShellWriteHandoff(execution, sessionId, resultFormat) {
    if (!this.prewalk.isArmed(sessionId) || !this.#cwd) return void 0;
    if (!execution.audits.some((audit) => audit.ref === "pi.bash" && audit.success === true)) {
      return void 0;
    }
    const drift = await this.prewalkDrift.evaluate(sessionId, this.#cwd);
    if (!drift || drift.files.length === 0) return void 0;
    return claimFabricFsDriftHandoff(this.prewalk, execution, sessionId, drift, resultFormat);
  }
  async runHandoffAtBoundary(pending, outerToolResult, context) {
    if (!this.#agentsProvider) throw new Error("Pi Fabric has not initialized");
    const runId = outerToolResult.toolCallId;
    const callId = pending.audit.nestedToolCallId;
    const result = await runFabricHandoffAtBoundary(
      this.prewalk,
      this.#agentsProvider,
      this.pi,
      pending,
      outerToolResult,
      context,
      (update) => this.activity.updateCall(runId, callId, update)
    );
    const succeeded = result.completed === true || result.continued === true;
    const error = typeof result.error === "string" ? result.error : void 0;
    this.activity.finishCall(runId, callId, {
      success: succeeded,
      result,
      ...pending.audit.preview !== void 0 ? { preview: pending.audit.preview } : {},
      ...error ? { error } : {}
    });
    this.activity.finish(runId, succeeded, error);
    return result;
  }
  noteMainActivity(context) {
    this.#actors?.noteMainActivity(context.isIdle());
    this.#participants?.scheduleRefresh();
  }
  dispatchHostEvent(event, payload, context) {
    if (!this.#actors || !this.#config?.mesh.enabled || this.#config.schema.mode === "enforce") return 0;
    const idle = context.isIdle();
    if (!this.#actors.observeHostEvent(event, idle)) return 0;
    const branch = context.sessionManager.getBranch();
    const { digest: digest3, transcript } = buildActorContext(
      branch,
      this.#config.mesh.actorContextEntries,
      this.#config.mesh.eventContextChars
    );
    const prepared = prepareFabricActorHostPayload(
      payload,
      this.#config.mesh.eventContextChars
    );
    const preparedContext = prepareFabricActorHostPayload(
      { digest: digest3, transcript },
      this.#config.mesh.eventContextChars
    ).payload;
    const safeContext = isPlainObject(preparedContext) ? preparedContext : { digest: {}, transcript: [String(preparedContext)] };
    return this.#actors.dispatchObservedHostEvent(
      event,
      {
        event,
        session: { id: context.sessionManager.getSessionId(), cwd: context.cwd },
        digest: safeContext.digest ?? {},
        transcript: safeContext.transcript ?? [],
        signal: {
          payload: prepared.payload,
          ...prepared.media.length > 0 ? { media: prepared.media } : {},
          idle,
          observedAt: Date.now()
        }
      },
      prepared.images
    );
  }
  #observeComponentTransitions(componentId) {
    if (!this.#suppressResidentGuidanceSync) {
      this.#residency?.updateModelGuidance(this.modelGuidance());
    }
    let components;
    if (componentId) {
      try {
        components = this.#componentSupervisor ? [this.#componentSupervisor.status(componentId)] : [];
      } catch {
        this.#componentTransitionSignatures.delete(componentId);
        return;
      }
    } else {
      components = this.#componentSupervisor?.list() ?? [];
    }
    const visible = componentId ? void 0 : /* @__PURE__ */ new Set();
    for (const component of components) {
      visible?.add(component.id);
      const signature = [
        component.state,
        component.revision,
        component.targetDigest ?? "",
        component.missing.join("\0"),
        component.optionalMissing.join("\0"),
        component.error ?? "",
        component.cleanupErrors?.join("\0") ?? "",
        JSON.stringify(component.guidance ?? [])
      ].join("");
      if (this.#componentTransitionSignatures.get(component.id) === signature) continue;
      this.#componentTransitionSignatures.set(component.id, signature);
      const publication = this.publishHostLifecycle("component.state", component).catch(() => void 0);
      this.#componentTransitionPublications.add(publication);
      void publication.finally(() => this.#componentTransitionPublications.delete(publication));
    }
    if (visible) {
      for (const id of this.#componentTransitionSignatures.keys()) {
        if (!visible.has(id)) this.#componentTransitionSignatures.delete(id);
      }
    }
  }
  async publishHostLifecycle(event, payload) {
    if (!this.#lifecycle || !this.#identity || this.#identity.kind !== "main" || !this.#participants) return;
    const self = this.#participants.self();
    const metadata = lifecycleMetadata(event, payload);
    await this.#lifecycle.publish({
      source: {
        id: self.id,
        name: self.name,
        kind: self.kind,
        rootId: self.rootId,
        runner: self.runner,
        ownerHostId: self.ownerHostId,
        ownerIdentityId: self.ownerIdentityId
      },
      event,
      occurredAt: lifecycleObservedAt(payload),
      ...metadata !== void 0 ? { data: metadata } : {}
    });
  }
  registerExternal(provider, options = {}) {
    if (provider.name === "fabric" || provider.name === "components" || FABRIC_COMPONENT_PROVIDER_NAMES.some((name) => name === provider.name)) {
      throw new Error(`Reserved Fabric provider name: ${provider.name}`);
    }
    if (this.#externalProviders.has(provider.name) && !options.overwrite) {
      throw new Error(`Fabric provider already registered: ${provider.name}`);
    }
    this.#externalProviders.set(provider.name, provider);
    if (this.#registry) this.#registry.register(provider, options);
  }
  registerExternalComponent(component, options = {}) {
    if (component.name.startsWith(FABRIC_PROVIDER_COMPONENT_PREFIX)) {
      throw new Error(`Reserved Fabric component name: ${component.name}`);
    }
    this.componentCatalog.register(component, options);
  }
  async settleComponents() {
    await this.#componentLoader?.settle();
  }
  async shutdown() {
    this.#suppressResidentGuidanceSync = true;
    this.#deactivateRepairs();
    await this.#participants?.quiesce().catch(() => void 0);
    await this.#componentLoader?.close();
    await Promise.allSettled([...this.#componentTransitionPublications]);
    await this.#sessionCapabilityLease?.release().catch(() => void 0);
    this.#sessionCapabilityLease = void 0;
    await this.#lifecycle?.close();
    await this.#control?.close();
    await this.#residency?.close();
    await this.#actors?.close();
    await this.#agents?.close();
    try {
      await this.#registry?.close();
    } finally {
      await this.#participants?.close();
    }
    this.#registry = void 0;
    this.#mcpProvider = void 0;
    this.#config = void 0;
    this.#execution = void 0;
    this.#agents = void 0;
    this.#actors = void 0;
    this.#globalActors = void 0;
    this.#mesh = void 0;
    this.#identity = void 0;
    this.#mainAgent = void 0;
    this.#participants = void 0;
    this.#control = void 0;
    this.#lifecycle = void 0;
    this.#residency = void 0;
    this.#agentsProvider = void 0;
    this.#compact = void 0;
    this.#schema = void 0;
    this.#componentSupervisor = void 0;
    this.#componentLoader = void 0;
    this.#componentTransitionSignatures.clear();
    this.#componentTransitionPublications.clear();
    this.#sessionCapabilityLease = void 0;
    this.#unsubscribeCapturedCatalog?.();
    this.#unsubscribeCapturedCatalog = void 0;
    this.componentCatalog.clear();
    this.#builtinComponentNames.clear();
    this.#cwd = void 0;
    this.activity.reset();
    this.#widgetDismissedAt = 0;
    this.#externalProviders.clear();
    this.prewalk.cancel();
    this.prewalkDrift.clear();
  }
  // Publish a best-effort mesh event to the durable `fabric.compact` topic so
  // other roots, agents, and actors can observe compaction transitions.
  // Activity-only sessions (mesh disabled) silently skip this.
  #publishCompactEvent(kind, data) {
    if (!this.#mesh || !this.#identity || !this.#config?.mesh.enabled) return;
    try {
      void this.#mesh.publish({
        topic: "fabric.compact",
        kind,
        from: this.#identity,
        data
      });
    } catch {
    }
  }
  #refreshRepairCatalog() {
    if (!this.#repairs || !this.#registry) return;
    if (this.capturedTools.suspended) return;
    this.#repairs.setCatalogSurface({
      providers: this.#registry.providers().map((provider) => provider.name),
      capturedTools: this.capturedTools.list().map((entry) => entry.name)
    });
  }
  #deactivateRepairs() {
    const repairs = this.#repairs;
    this.#repairs = void 0;
    clearActiveRepairCompiler(repairs);
  }
  async #closeInternal() {
    this.#deactivateRepairs();
    if (!this.#registry) return;
    await this.#participants?.quiesce().catch(() => void 0);
    await this.#componentLoader?.close();
    await Promise.allSettled([...this.#componentTransitionPublications]);
    await this.#sessionCapabilityLease?.release().catch(() => void 0);
    this.#sessionCapabilityLease = void 0;
    await this.#lifecycle?.close();
    await this.#control?.close();
    await this.#residency?.close();
    await this.#actors?.close();
    await this.#agents?.close();
    const externalNames = new Set(this.#externalProviders.keys());
    try {
      await this.#registry.close(externalNames);
    } finally {
      await this.#participants?.close();
    }
    this.#registry = void 0;
    this.#mcpProvider = void 0;
    this.#execution = void 0;
    this.#agents = void 0;
    this.#actors = void 0;
    this.#mesh = void 0;
    this.#identity = void 0;
    this.#mainAgent = void 0;
    this.#participants = void 0;
    this.#control = void 0;
    this.#lifecycle = void 0;
    this.#residency = void 0;
    this.#agentsProvider = void 0;
    this.#compact = void 0;
    this.#schema = void 0;
    this.#componentSupervisor = void 0;
    this.#componentLoader = void 0;
    this.#componentTransitionSignatures.clear();
    this.#componentTransitionPublications.clear();
    this.#sessionCapabilityLease = void 0;
    this.#unsubscribeCapturedCatalog?.();
    this.#unsubscribeCapturedCatalog = void 0;
  }
};
var scalarMetadata = (value, keys) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
  const source = value;
  const metadata = {};
  for (const key of keys) {
    const nested = source[key];
    if (typeof nested === "string" || typeof nested === "number" || typeof nested === "boolean" || nested === null) metadata[key] = nested;
  }
  return Object.keys(metadata).length > 0 ? metadata : void 0;
};
var lifecycleMetadata = (event, payload) => {
  switch (event) {
    case "pi.input":
      return scalarMetadata(payload, ["source", "streamingBehavior"]);
    case "pi.agent_end":
      return scalarMetadata(payload, ["willRetry"]);
    case "pi.turn_end":
      return scalarMetadata(payload, ["turnIndex", "timestamp"]);
    case "pi.tool_error":
      return scalarMetadata(payload, ["toolCallId", "toolName"]);
    case "pi.session_compact":
      return scalarMetadata(payload, ["reason", "willRetry"]);
    case "component.state":
      return scalarMetadata(payload, [
        "id",
        "component",
        "parentId",
        "state",
        "guarantee",
        "revision",
        "targetDigest"
      ]);
    default:
      return void 0;
  }
};
var lifecycleObservedAt = (payload) => {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return Date.now();
  const timestamp = payload.timestamp;
  return typeof timestamp === "number" && Number.isFinite(timestamp) ? timestamp : Date.now();
};
var isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var deepAssign = (target, source) => {
  for (const key of Object.keys(target)) {
    if (!(key in source)) delete target[key];
  }
  for (const [key, value] of Object.entries(source)) {
    const targetValue = target[key];
    if (isPlainObject(value) && isPlainObject(targetValue)) {
      deepAssign(targetValue, value);
    } else {
      target[key] = value;
    }
  }
};
export {
  FabricRuntimeState
};
//# sourceMappingURL=fabric-runtime-state-DMGM5HF3.js.map
