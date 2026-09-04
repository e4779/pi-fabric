import {
  fabricExecTitleHint
} from "./chunk-4IZKKHJM.js";
import {
  FABRIC_BRANCH_RUN_DESCRIPTION_MAX_BYTES,
  FABRIC_BRANCH_RUN_NAME_MAX_BYTES,
  FABRIC_BRANCH_SUMMARY_KIND,
  FABRIC_BRANCH_SUMMARY_MAX_BYTES,
  FABRIC_BRANCH_SUMMARY_MAX_FACTS,
  FABRIC_BRANCH_SUMMARY_VERSION,
  readFabricBranchSummaryDetails,
  readFabricProjectionTrace
} from "./chunk-Y2TSC4OL.js";

// src/compaction/hook.ts
import "@earendil-works/pi-coding-agent";

// src/core/token-math.ts
var ESTIMATED_IMAGE_CHARS = 4800;
var DEFAULT_COMPACTION_SETTINGS = {
  enabled: true,
  reserveTokens: 16384,
  keepRecentTokens: 2e4
};
var contentParts = (content) => {
  if (typeof content !== "string") return content ?? [];
  return [];
};
var estimateTextAndImageContentChars = (content) => {
  if (typeof content === "string") {
    return content.length;
  }
  let chars = 0;
  for (const block of contentParts(content)) {
    if (block.type === "text" && block.text) {
      chars += block.text.length;
    } else if (block.type === "image") {
      chars += ESTIMATED_IMAGE_CHARS;
    }
  }
  return chars;
};
var textLength = (value) => typeof value === "string" ? value.length : 0;
var estimateTokens = (message) => {
  let chars = 0;
  switch (message.role) {
    case "user": {
      chars = estimateTextAndImageContentChars(message.content);
      return Math.ceil(chars / 4);
    }
    case "assistant": {
      for (const block of contentParts(message.content)) {
        if (block.type === "text") {
          chars += textLength(block.text);
        } else if (block.type === "thinking") {
          chars += textLength(block.thinking);
        } else if (block.type === "toolCall") {
          chars += textLength(block.name) + JSON.stringify(block.arguments).length;
        }
      }
      return Math.ceil(chars / 4);
    }
    case "custom":
    case "toolResult": {
      chars = estimateTextAndImageContentChars(message.content);
      return Math.ceil(chars / 4);
    }
    case "bashExecution": {
      chars = textLength(message.command) + textLength(message.output);
      return Math.ceil(chars / 4);
    }
    case "branchSummary":
    case "compactionSummary": {
      chars = textLength(message.summary);
      return Math.ceil(chars / 4);
    }
  }
  return 0;
};
var calculateContextTokens = (usage) => {
  if (typeof usage !== "object" || usage === null) return 0;
  const record = usage;
  const totalTokens = record.totalTokens;
  if (typeof totalTokens === "number" && totalTokens > 0) return totalTokens;
  const count = (value) => typeof value === "number" ? value : 0;
  return count(record.input) + count(record.output) + count(record.cacheRead) + count(record.cacheWrite);
};

// src/core/session-context.ts
var buildEntryIndex = (entries, byId) => {
  if (byId) return byId;
  const index = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    index.set(entry.id, entry);
  }
  return index;
};
var buildSessionPath = (entries, leafId, byId) => {
  const index = buildEntryIndex(entries, byId);
  let leaf = void 0;
  if (leafId !== void 0) {
    leaf = index.get(leafId);
  }
  leaf = leaf ?? entries[entries.length - 1];
  if (!leaf) {
    return [];
  }
  const path = [];
  let current = leaf;
  while (current) {
    path.push(current);
    const parent = current;
    current = parent.parentId ? index.get(parent.parentId) : void 0;
  }
  path.reverse();
  return path;
};
var getSessionContextSettings = (path) => {
  let thinkingLevel = "off";
  let model = null;
  for (const entry of path) {
    if (entry.type === "thinking_level_change") {
      thinkingLevel = entry.thinkingLevel;
    } else if (entry.type === "model_change") {
      model = { provider: entry.provider, modelId: entry.modelId };
    } else if (entry.type === "message" && entry.message.role === "assistant") {
      model = { provider: entry.message.provider, modelId: entry.message.model };
    }
  }
  return { thinkingLevel, model };
};
var createBranchSummaryMessage = (summary, fromId, timestamp) => ({
  role: "branchSummary",
  summary,
  fromId,
  timestamp: new Date(timestamp).getTime()
});
var createCompactionSummaryMessage = (summary, tokensBefore, timestamp) => ({
  role: "compactionSummary",
  summary,
  tokensBefore,
  timestamp: new Date(timestamp).getTime()
});
var createCustomMessage = (customType, content, display, details, timestamp) => ({
  role: "custom",
  customType,
  content,
  display,
  details,
  timestamp: new Date(timestamp).getTime()
});
var sessionEntryToContextMessages = (entry) => {
  if (entry.type === "message") {
    const message = entry.message;
    if ((message.role === "user" || message.role === "assistant" || message.role === "toolResult") && message.content == null) {
      return [{ ...message, content: [] }];
    }
    return [message];
  }
  if (entry.type === "custom_message") {
    return [
      createCustomMessage(entry.customType, entry.content ?? [], entry.display, entry.details, entry.timestamp)
    ];
  }
  if (entry.type === "branch_summary" && entry.summary) {
    return [createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp)];
  }
  if (entry.type === "compaction") {
    return [createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp)];
  }
  return [];
};
var buildContextEntries = (entries, leafId, byId) => {
  const path = buildSessionPath(entries, leafId, byId);
  let compaction = void 0;
  for (const entry of path) {
    if (entry.type === "compaction") {
      compaction = entry;
    }
  }
  if (!compaction) {
    return path;
  }
  const compactionIdx = [...path].findIndex(
    (entry) => entry.id === compaction?.id
  );
  if (compactionIdx < 0) {
    return path;
  }
  const contextEntries = [compaction];
  let foundFirstKept = false;
  for (let i = 0; i < compactionIdx; i++) {
    const entry = path[i];
    if (!entry) continue;
    if (entry.id === compaction.firstKeptEntryId) {
      foundFirstKept = true;
    }
    if (foundFirstKept) {
      contextEntries.push(entry);
    }
  }
  contextEntries.push(...path.slice(compactionIdx + 1));
  return contextEntries;
};
var buildSessionContext = (entries, leafId, byId) => {
  const path = buildSessionPath(entries, leafId, byId);
  const { thinkingLevel, model } = getSessionContextSettings(path);
  const messages = buildContextEntries(entries, leafId, byId).flatMap(sessionEntryToContextMessages);
  return { messages, thinkingLevel, model };
};

// src/compaction/bounds.ts
var MAX_SUMMARY_BYTES = 32 * 1024;
var MAX_REQUEST_SOURCE_BYTES = 8 * 1024;
var encoder = new TextEncoder();
var utf8Bytes = (text) => encoder.encode(text).byteLength;
var clipUtf8 = (text, maxBytes, suffix = "\u2026") => {
  if (maxBytes <= 0) return "";
  if (utf8Bytes(text) <= maxBytes) return text;
  const suffixBytes = utf8Bytes(suffix);
  if (suffixBytes >= maxBytes) return "";
  let output = "";
  let used = 0;
  const available = maxBytes - suffixBytes;
  for (const character of text) {
    const bytes = utf8Bytes(character);
    if (used + bytes > available) break;
    output += character;
    used += bytes;
  }
  return `${output}${suffix}`;
};
var canonicalizeText = (input, maxBytes = MAX_REQUEST_SOURCE_BYTES) => {
  const canonical = input.trim().split(/\s+/u).filter(Boolean).join(" ");
  const sourceBytes = utf8Bytes(canonical);
  return {
    text: clipUtf8(canonical, maxBytes),
    truncated: sourceBytes > maxBytes,
    sourceBytes
  };
};
var sampleAddressedFrom = (source, maxValues) => {
  const earliestLimit = Math.ceil(maxValues / 2);
  const latestLimit = Math.floor(maxValues / 2);
  const earliest = [];
  const latest = [];
  let omitted = 0;
  let omittedFirstEntryId;
  let omittedLastEntryId;
  for (const value of source) {
    if (earliest.length < earliestLimit) {
      earliest.push(value);
      continue;
    }
    latest.push(value);
    if (latest.length <= latestLimit) continue;
    const displaced = latest.shift();
    omitted += 1;
    omittedFirstEntryId ??= displaced.entryId;
    omittedLastEntryId = displaced.entryId;
  }
  return {
    values: [...earliest, ...latest],
    omitted,
    ...omittedFirstEntryId !== void 0 ? { omittedFirstEntryId } : {},
    ...omittedLastEntryId !== void 0 ? { omittedLastEntryId } : {},
    splitIndex: earliest.length
  };
};
var sampleAddressed = (values, maxValues) => sampleAddressedFrom(values, maxValues);
var omissionLine = (count, firstEntryId, lastEntryId, noun) => {
  const range = firstEntryId || lastEntryId ? `${firstEntryId || "(start)"} \u2192 ${lastEntryId || "(end)"}` : "(unknown range)";
  return `\u2026 omitted ${count} ${noun}; source entries ${range}`;
};

// src/compaction/threshold.ts
var modelCompactionKey = (model) => model ? `${model.provider}/${model.id}` : void 0;
var configuredCompactionTokenThreshold = (config, modelKey) => modelKey === void 0 ? void 0 : config.compaction.tokenThresholds[modelKey];
var configuredCompactionThreshold = (config, modelKey) => modelKey === void 0 ? void 0 : config.compaction.thresholds[modelKey];
var runThresholdCompact = (context) => new Promise((resolve) => {
  context.compact({
    onComplete: () => resolve(true),
    onError: (error) => {
      if (context.hasUI) {
        context.ui.notify(`Fabric threshold compaction failed: ${error.message}`, "warning");
      }
      resolve(false);
    }
  });
});
var compactAtConfiguredThreshold = async (context, config) => {
  const modelKey = modelCompactionKey(context.model);
  const usage = context.getContextUsage();
  if (usage === void 0) return false;
  const tokenThreshold = configuredCompactionTokenThreshold(config, modelKey);
  if (tokenThreshold !== void 0) {
    if (usage.tokens === null || usage.tokens < tokenThreshold) return false;
    return runThresholdCompact(context);
  }
  const threshold = configuredCompactionThreshold(config, modelKey);
  if (threshold === void 0 || usage.percent === null) return false;
  if (usage.percent / 100 < threshold) return false;
  return runThresholdCompact(context);
};

// src/compaction/enrichers.ts
var NO_BUILTIN_ENRICHERS = Object.freeze([]);
var runEnrichers = (enrichers, events, sections) => {
  for (const enricher of enrichers) {
    if (!enricher.applies(events)) continue;
    enricher.contribute(events, sections);
  }
};

// src/compaction/instructions.ts
var FABRIC_COMPACTION_REQUEST_PREFIX = "__pi_fabric_compact_request_v1__:";
var MAX_COMPACTION_INSTRUCTIONS_CHARS = 8 * 1024;
var MAX_COMPACTION_INSTRUCTIONS_BYTES = 8 * 1024;
var MAX_PRESERVE_ITEMS = 16;
var MAX_PRESERVE_ITEM_CHARS = 2 * 1024;
var MAX_PRESERVE_ITEM_BYTES = 2 * 1024;
var MAX_TYPED_COMPACTION_SOURCE_BYTES = 16 * 1024;
var rejection = (code, message, sourceBytes) => ({
  ok: false,
  requestLines: [],
  error: { code, message, sourceBytes }
});
var isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var hasPairedSurrogates = (value) => {
  for (let index = 0; index < value.length; index++) {
    const unit = value.charCodeAt(index);
    if (unit >= 55296 && unit <= 56319) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 56320 && next <= 57343)) return false;
      index += 1;
    } else if (unit >= 56320 && unit <= 57343) {
      return false;
    }
  }
  return true;
};
var compactionRequestBoundsError = (request) => {
  if (request.instructions !== void 0) {
    if (!hasPairedSurrogates(request.instructions)) {
      return {
        code: "invalid-unicode",
        message: "typed compaction instructions contain an unpaired UTF-16 surrogate"
      };
    }
    if (request.instructions.length > MAX_COMPACTION_INSTRUCTIONS_CHARS || utf8Bytes(request.instructions) > MAX_COMPACTION_INSTRUCTIONS_BYTES) {
      return {
        code: "instructions-too-large",
        message: `typed compaction instructions exceed ${MAX_COMPACTION_INSTRUCTIONS_CHARS} characters or ${MAX_COMPACTION_INSTRUCTIONS_BYTES} UTF-8 bytes`
      };
    }
  }
  if (request.preserve !== void 0) {
    if (request.preserve.length > MAX_PRESERVE_ITEMS) {
      return {
        code: "preserve-too-many",
        message: `typed compaction preserve exceeds ${MAX_PRESERVE_ITEMS} items`
      };
    }
    for (const item of request.preserve) {
      if (!hasPairedSurrogates(item)) {
        return {
          code: "invalid-unicode",
          message: "typed compaction preserve item contains an unpaired UTF-16 surrogate"
        };
      }
      if (item.length > MAX_PRESERVE_ITEM_CHARS || utf8Bytes(item) > MAX_PRESERVE_ITEM_BYTES) {
        return {
          code: "preserve-item-too-large",
          message: `typed compaction preserve item exceeds ${MAX_PRESERVE_ITEM_CHARS} characters or ${MAX_PRESERVE_ITEM_BYTES} UTF-8 bytes`
        };
      }
    }
  }
  return void 0;
};
var encodeCompactionRequest = (request) => {
  const boundsError = compactionRequestBoundsError(request);
  if (boundsError) throw new Error(boundsError.message);
  const payload = {
    version: 1,
    ...request.instructions !== void 0 ? { instructions: request.instructions } : {},
    ...request.preserve !== void 0 ? { preserve: request.preserve } : {}
  };
  const encoded = `${FABRIC_COMPACTION_REQUEST_PREFIX}${JSON.stringify(payload)}`;
  if (utf8Bytes(encoded) > MAX_TYPED_COMPACTION_SOURCE_BYTES) {
    throw new Error(`typed compaction request exceeds ${MAX_TYPED_COMPACTION_SOURCE_BYTES} encoded UTF-8 bytes`);
  }
  return encoded;
};
var plainInstructions = (source) => {
  const canonical = canonicalizeText(source);
  return {
    ok: true,
    requestLines: canonical.text ? [canonical.text] : [],
    policy: {
      mode: "plain",
      canonicalized: canonical.text !== source,
      sourceBytes: canonical.sourceBytes,
      truncated: canonical.truncated,
      preserveCount: 0,
      omittedPreserveCount: 0
    }
  };
};
var StrictJsonError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
var MAX_TYPED_JSON_DEPTH = 32;
var MAX_TYPED_JSON_NODES = 4096;
var StrictJsonParser = class {
  constructor(source) {
    this.source = source;
  }
  index = 0;
  nodes = 0;
  parse() {
    this.skipWhitespace();
    const value = this.parseValue(0);
    this.skipWhitespace();
    if (this.index !== this.source.length) this.malformed();
    return value;
  }
  parseValue(depth) {
    if (depth > MAX_TYPED_JSON_DEPTH) {
      throw new StrictJsonError("structure-too-complex", "typed compaction JSON exceeds the structural depth limit");
    }
    this.nodes += 1;
    if (this.nodes > MAX_TYPED_JSON_NODES) {
      throw new StrictJsonError("structure-too-complex", "typed compaction JSON exceeds the structural node limit");
    }
    const character = this.source[this.index];
    if (character === "{") return this.parseObject(depth + 1);
    if (character === "[") return this.parseArray(depth + 1);
    if (character === '"') return this.parseString();
    if (character === "t") return this.parseLiteral("true", true);
    if (character === "f") return this.parseLiteral("false", false);
    if (character === "n") return this.parseLiteral("null", null);
    if (character === "-" || character !== void 0 && character >= "0" && character <= "9") {
      return this.parseNumber();
    }
    return this.malformed();
  }
  parseObject(depth) {
    this.index += 1;
    this.skipWhitespace();
    const output = /* @__PURE__ */ Object.create(null);
    const keys = /* @__PURE__ */ new Set();
    if (this.source[this.index] === "}") {
      this.index += 1;
      return output;
    }
    while (this.index < this.source.length) {
      if (this.source[this.index] !== '"') this.malformed();
      const key = this.parseString();
      if (keys.has(key)) {
        throw new StrictJsonError("duplicate-field", `typed compaction request contains duplicate field ${JSON.stringify(key)}`);
      }
      keys.add(key);
      this.skipWhitespace();
      if (this.source[this.index] !== ":") this.malformed();
      this.index += 1;
      this.skipWhitespace();
      output[key] = this.parseValue(depth);
      this.skipWhitespace();
      const delimiter = this.source[this.index];
      if (delimiter === "}") {
        this.index += 1;
        return output;
      }
      if (delimiter !== ",") this.malformed();
      this.index += 1;
      this.skipWhitespace();
    }
    return this.malformed();
  }
  parseArray(depth) {
    this.index += 1;
    this.skipWhitespace();
    const output = [];
    if (this.source[this.index] === "]") {
      this.index += 1;
      return output;
    }
    while (this.index < this.source.length) {
      output.push(this.parseValue(depth));
      this.skipWhitespace();
      const delimiter = this.source[this.index];
      if (delimiter === "]") {
        this.index += 1;
        return output;
      }
      if (delimiter !== ",") this.malformed();
      this.index += 1;
      this.skipWhitespace();
    }
    return this.malformed();
  }
  parseString() {
    this.index += 1;
    let output = "";
    while (this.index < this.source.length) {
      const unit = this.source.charCodeAt(this.index);
      if (unit === 34) {
        this.index += 1;
        if (!hasPairedSurrogates(output)) {
          throw new StrictJsonError("invalid-unicode", "typed compaction JSON string contains an unpaired UTF-16 surrogate");
        }
        return output;
      }
      if (unit <= 31) this.malformed();
      if (unit !== 92) {
        output += this.source[this.index];
        this.index += 1;
        continue;
      }
      this.index += 1;
      const escape = this.source[this.index];
      this.index += 1;
      if (escape === '"' || escape === "\\" || escape === "/") output += escape;
      else if (escape === "b") output += "\b";
      else if (escape === "f") output += "\f";
      else if (escape === "n") output += "\n";
      else if (escape === "r") output += "\r";
      else if (escape === "t") output += "	";
      else if (escape === "u") {
        let value = 0;
        for (let offset = 0; offset < 4; offset++) {
          const digit = this.hexValue(this.source.charCodeAt(this.index + offset));
          if (digit < 0) this.malformed();
          value = value * 16 + digit;
        }
        this.index += 4;
        output += String.fromCharCode(value);
      } else {
        this.malformed();
      }
    }
    return this.malformed();
  }
  parseNumber() {
    const start = this.index;
    if (this.source[this.index] === "-") this.index += 1;
    if (this.source[this.index] === "0") {
      this.index += 1;
      if (this.isDigit(this.source.charCodeAt(this.index))) this.malformed();
    } else {
      if (!this.isDigitOneToNine(this.source.charCodeAt(this.index))) this.malformed();
      while (this.isDigit(this.source.charCodeAt(this.index))) this.index += 1;
    }
    if (this.source[this.index] === ".") {
      this.index += 1;
      if (!this.isDigit(this.source.charCodeAt(this.index))) this.malformed();
      while (this.isDigit(this.source.charCodeAt(this.index))) this.index += 1;
    }
    const exponent = this.source[this.index];
    if (exponent === "e" || exponent === "E") {
      this.index += 1;
      const sign = this.source[this.index];
      if (sign === "+" || sign === "-") this.index += 1;
      if (!this.isDigit(this.source.charCodeAt(this.index))) this.malformed();
      while (this.isDigit(this.source.charCodeAt(this.index))) this.index += 1;
    }
    const value = Number(this.source.slice(start, this.index));
    if (!Number.isFinite(value)) this.malformed();
    return value;
  }
  parseLiteral(literal, value) {
    if (!this.source.startsWith(literal, this.index)) this.malformed();
    this.index += literal.length;
    return value;
  }
  skipWhitespace() {
    while (this.index < this.source.length) {
      const unit = this.source.charCodeAt(this.index);
      if (unit !== 32 && unit !== 9 && unit !== 10 && unit !== 13) return;
      this.index += 1;
    }
  }
  hexValue(unit) {
    if (unit >= 48 && unit <= 57) return unit - 48;
    if (unit >= 65 && unit <= 70) return unit - 65 + 10;
    if (unit >= 97 && unit <= 102) return unit - 97 + 10;
    return -1;
  }
  isDigit(unit) {
    return unit >= 48 && unit <= 57;
  }
  isDigitOneToNine(unit) {
    return unit >= 49 && unit <= 57;
  }
  malformed() {
    throw new StrictJsonError("malformed-json", "typed compaction request contains malformed JSON");
  }
};
var decodeCompactionInstructions = (source) => {
  if (source === void 0 || source === "") {
    return {
      ok: true,
      requestLines: [],
      policy: {
        mode: "none",
        canonicalized: false,
        sourceBytes: 0,
        truncated: false,
        preserveCount: 0,
        omittedPreserveCount: 0
      }
    };
  }
  if (!source.startsWith(FABRIC_COMPACTION_REQUEST_PREFIX)) return plainInstructions(source);
  const encodedSourceBytes = utf8Bytes(source);
  if (encodedSourceBytes > MAX_TYPED_COMPACTION_SOURCE_BYTES) {
    return rejection(
      "encoded-source-too-large",
      `typed compaction request exceeds ${MAX_TYPED_COMPACTION_SOURCE_BYTES} encoded UTF-8 bytes`,
      encodedSourceBytes
    );
  }
  let parsed;
  try {
    parsed = new StrictJsonParser(source.slice(FABRIC_COMPACTION_REQUEST_PREFIX.length)).parse();
  } catch (error) {
    if (error instanceof StrictJsonError) {
      return rejection(error.code, error.message, encodedSourceBytes);
    }
    return rejection("malformed-json", "typed compaction request contains malformed JSON", encodedSourceBytes);
  }
  if (!isRecord(parsed)) {
    return rejection("invalid-object", "typed compaction request must be a JSON object", encodedSourceBytes);
  }
  const keys = Object.keys(parsed);
  const unknownField = keys.find((key) => key !== "version" && key !== "instructions" && key !== "preserve");
  if (unknownField !== void 0) {
    return rejection("unknown-field", `typed compaction request contains unknown field ${JSON.stringify(unknownField)}`, encodedSourceBytes);
  }
  if (parsed.version !== 1) {
    return rejection("unsupported-version", "typed compaction request version must be 1", encodedSourceBytes);
  }
  if (parsed.instructions !== void 0 && typeof parsed.instructions !== "string") {
    return rejection("invalid-type", "typed compaction request instructions must be a string", encodedSourceBytes);
  }
  if (parsed.preserve !== void 0 && !Array.isArray(parsed.preserve)) {
    return rejection("invalid-type", "typed compaction request preserve must be an array", encodedSourceBytes);
  }
  const preserve = parsed.preserve;
  if (preserve !== void 0 && preserve.length > MAX_PRESERVE_ITEMS) {
    return rejection(
      "preserve-too-many",
      `typed compaction preserve exceeds ${MAX_PRESERVE_ITEMS} items`,
      encodedSourceBytes
    );
  }
  if (preserve !== void 0 && !preserve.every((item) => typeof item === "string")) {
    return rejection("invalid-type", "typed compaction preserve items must be strings", encodedSourceBytes);
  }
  const request = {
    ...parsed.instructions !== void 0 ? { instructions: parsed.instructions } : {},
    ...preserve !== void 0 ? { preserve } : {}
  };
  const boundsError = compactionRequestBoundsError(request);
  if (boundsError) return rejection(boundsError.code, boundsError.message, encodedSourceBytes);
  const requestLines = [];
  let valueSourceBytes = 0;
  let truncated = false;
  let canonicalized = false;
  if (request.instructions !== void 0) {
    const instructions = canonicalizeText(request.instructions, MAX_COMPACTION_INSTRUCTIONS_BYTES);
    valueSourceBytes += instructions.sourceBytes;
    truncated ||= instructions.truncated;
    canonicalized ||= instructions.text !== request.instructions;
    if (instructions.text) requestLines.push(instructions.text);
  }
  for (let index = 0; index < (request.preserve?.length ?? 0); index++) {
    const sourceItem = request.preserve[index];
    const item = canonicalizeText(sourceItem, MAX_PRESERVE_ITEM_BYTES);
    valueSourceBytes += item.sourceBytes;
    truncated ||= item.truncated;
    canonicalized ||= item.text !== sourceItem;
    if (item.text) requestLines.push(`- ${item.text} [preserve:${index}]`);
  }
  return {
    ok: true,
    requestLines,
    policy: {
      mode: "typed-v1",
      canonicalized,
      sourceBytes: valueSourceBytes,
      truncated,
      preserveCount: request.preserve?.length ?? 0,
      omittedPreserveCount: 0
    }
  };
};

// src/run-display.ts
var recordDisplay = (record) => {
  const display = {};
  if (typeof record.name === "string") display.name = record.name;
  if (typeof record.description === "string") display.description = record.description;
  return display.name !== void 0 || display.description !== void 0 ? display : void 0;
};
var parseObjectString = (text) => {
  if (!text.startsWith("{") || !text.endsWith("}")) return void 0;
  try {
    const parsed = JSON.parse(text);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed : void 0;
  } catch {
    return void 0;
  }
};
var normalizeRunDisplay = (input) => {
  if (typeof input === "string") {
    const text = input.trim();
    if (!text) return void 0;
    const parsed = text.startsWith("{") ? parseObjectString(text) : void 0;
    return (parsed && recordDisplay(parsed)) ?? { name: input };
  }
  if (typeof input === "object" && input !== null && !Array.isArray(input)) {
    return recordDisplay(input);
  }
  return void 0;
};

// src/ui/fabric-title-hint.ts
var TITLE_HINT_CACHE_MAX = 256;
var titleHintCache = /* @__PURE__ */ new Map();
var fabricExecTitleHintCached = (code) => {
  const hit = titleHintCache.get(code);
  if (hit !== void 0 || titleHintCache.has(code)) return hit;
  const hint = fabricExecTitleHint(code);
  if (titleHintCache.size >= TITLE_HINT_CACHE_MAX) {
    const oldest = titleHintCache.keys().next().value;
    if (oldest !== void 0) titleHintCache.delete(oldest);
  }
  titleHintCache.set(code, hint);
  return hint;
};

// src/compaction/normalize.ts
var isMessageEntry = (entry) => entry.type === "message";
var MAX_CUSTOM_DETAILS_DEPTH = 12;
var MAX_CUSTOM_DETAILS_NODES = 256;
var MAX_CUSTOM_DETAILS_COLLECTION = 64;
var MAX_CUSTOM_DETAILS_STRING_BYTES = 1024;
var MAX_CUSTOM_DETAILS_BYTES = 8 * 1024;
var boundedJsonValue = (value, state, depth = 0) => {
  state.nodes += 1;
  if (state.nodes > MAX_CUSTOM_DETAILS_NODES) return void 0;
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "string") return clipUtf8(value, MAX_CUSTOM_DETAILS_STRING_BYTES);
  if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
  if (typeof value !== "object" || depth > MAX_CUSTOM_DETAILS_DEPTH || state.ancestors.has(value)) return void 0;
  state.ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      const output2 = [];
      for (const item of value.slice(0, MAX_CUSTOM_DETAILS_COLLECTION)) {
        const sanitized = boundedJsonValue(item, state, depth + 1);
        if (sanitized === void 0) return void 0;
        output2.push(sanitized);
      }
      return output2;
    }
    const output = /* @__PURE__ */ Object.create(null);
    const keys = Object.keys(value).sort().slice(0, MAX_CUSTOM_DETAILS_COLLECTION);
    for (const key of keys) {
      const sanitized = boundedJsonValue(value[key], state, depth + 1);
      if (sanitized === void 0) return void 0;
      output[key] = sanitized;
    }
    return output;
  } finally {
    state.ancestors.delete(value);
  }
};
var customDetails = (value) => {
  if (value === void 0) return void 0;
  try {
    const sanitized = boundedJsonValue(value, { nodes: 0, ancestors: /* @__PURE__ */ new Set() });
    if (sanitized === void 0 || utf8Bytes(JSON.stringify(sanitized)) > MAX_CUSTOM_DETAILS_BYTES) return void 0;
    return sanitized;
  } catch {
    return void 0;
  }
};
var isTypedCustomContent = (content) => {
  if (typeof content === "string") return true;
  if (!Array.isArray(content)) return false;
  return content.every((part) => {
    if (part === null || typeof part !== "object") return false;
    const candidate = part;
    if (candidate.type === "text") return typeof candidate.text === "string";
    return candidate.type === "image";
  });
};
var isPiCustomMessageEntry = (entry) => {
  try {
    if (entry.type !== "custom_message") return false;
    const candidate = entry;
    return typeof candidate.customType === "string" && typeof candidate.display === "boolean" && isTypedCustomContent(candidate.content);
  } catch {
    return false;
  }
};
var textOfContent = (content) => {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const part of content) {
    if (part && typeof part === "object" && "type" in part) {
      if (part.type === "text" && typeof part.text === "string") parts.push(part.text);
    }
  }
  return parts.join("\n");
};
var firstLine = (text) => {
  const trimmed = text.trimStart();
  const nl = trimmed.indexOf("\n");
  return nl < 0 ? trimmed : trimmed.slice(0, nl);
};
var fabricRunIntent = (call) => {
  if (!call || call.name !== "fabric_exec") return void 0;
  const display = normalizeRunDisplay(call.args.display);
  const intentName = display?.name?.trim() ? display.name : typeof call.args.code === "string" ? fabricExecTitleHintCached(call.args.code) : void 0;
  if (intentName === void 0) return void 0;
  const name = clipUtf8(intentName.trim(), FABRIC_BRANCH_RUN_NAME_MAX_BYTES);
  if (!name) return void 0;
  const description = display?.description !== void 0 ? clipUtf8(display.description.trim(), FABRIC_BRANCH_RUN_DESCRIPTION_MAX_BYTES) : "";
  return { name, ...description ? { description } : {} };
};
var normalizeEntries = (entries) => {
  const events = [];
  const calls = /* @__PURE__ */ new Map();
  let index = 0;
  const push = (event) => {
    index += 1;
    events.push({ ...event, index });
  };
  const pushBranchFacts = (entry) => {
    const details = readFabricBranchSummaryDetails(entry.details);
    if (!details) return;
    for (const fact of details.facts) {
      if (fact.kind === "user") {
        push({ kind: "user", entryId: fact.entryId, sourceEntryId: entry.id, text: fact.text });
      } else if (fact.kind === "customMessage") {
        push({
          kind: "customMessage",
          entryId: fact.entryId,
          sourceEntryId: entry.id,
          customType: fact.customType,
          text: fact.text,
          display: fact.display,
          ...fact.details !== void 0 ? { details: fact.details } : {}
        });
      } else if (fact.kind === "phase") {
        push({
          kind: "fabricPhase",
          entryId: fact.entryId,
          sourceEntryId: entry.id,
          subordinal: fact.subordinal,
          address: fact.address,
          phase: fact.phase
        });
      } else if (fact.kind === "fabricRun") {
        push({
          kind: "fabricRun",
          entryId: fact.entryId,
          sourceEntryId: entry.id,
          toolCallId: fact.subordinal.startsWith("call:") ? fact.subordinal.slice("call:".length) : fact.subordinal,
          subordinal: fact.subordinal,
          address: fact.address,
          name: fact.name,
          ...fact.description !== void 0 ? { description: fact.description } : {},
          outcome: fact.outcome,
          source: "branch"
        });
      } else {
        push({
          kind: "fabricOperation",
          entryId: fact.entryId,
          sourceEntryId: entry.id,
          subordinal: fact.subordinal,
          address: fact.address,
          ref: fact.ref,
          ...fact.provider ? { provider: fact.provider } : {},
          ...fact.action ? { action: fact.action } : {},
          tool: fact.tool,
          args: fact.args,
          outcome: fact.outcome,
          ...fact.error !== void 0 ? { error: fact.error } : {},
          ...fact.result !== void 0 ? { result: fact.result } : {},
          source: "branch"
        });
      }
    }
  };
  for (const entry of entries) {
    if (entry.type === "branch_summary") {
      pushBranchFacts(entry);
      continue;
    }
    if (entry.type === "custom_message") {
      try {
        if (!isPiCustomMessageEntry(entry)) continue;
        const details = customDetails(entry.details);
        push({
          kind: "customMessage",
          entryId: entry.id,
          sourceEntryId: entry.id,
          customType: entry.customType,
          text: textOfContent(entry.content),
          display: entry.display,
          ...details !== void 0 ? { details } : {}
        });
      } catch {
      }
      continue;
    }
    if (!isMessageEntry(entry)) continue;
    const message = entry.message;
    if (!message || typeof message !== "object") continue;
    const role = message.role;
    const entryId = entry.id;
    if (role === "user") {
      push({ kind: "user", entryId, sourceEntryId: entryId, text: textOfContent(message.content) });
      continue;
    }
    if (role === "assistant") {
      const content = message.content;
      if (!Array.isArray(content)) continue;
      for (const part of content) {
        if (!part || typeof part !== "object" || !("type" in part)) continue;
        if (part.type === "text" && typeof part.text === "string") {
          push({ kind: "assistantText", entryId, sourceEntryId: entryId, text: part.text });
        } else if (part.type === "toolCall" && typeof part.id === "string" && typeof part.name === "string") {
          const args = part.arguments ?? {};
          calls.set(part.id, { entryId, name: part.name, args });
          push({ kind: "toolCall", entryId, sourceEntryId: entryId, toolCallId: part.id, name: part.name, args });
        }
      }
      continue;
    }
    if (role === "toolResult") {
      const toolResult = message;
      const toolCallId = typeof toolResult.toolCallId === "string" ? toolResult.toolCallId : "";
      const toolName = typeof toolResult.toolName === "string" ? toolResult.toolName : "";
      const isError = toolResult.isError === true;
      const text = textOfContent(toolResult.content);
      const pending = toolCallId ? calls.get(toolCallId) : void 0;
      if (toolName === "bash") {
        const command = pending && typeof pending.args.command === "string" ? pending.args.command : "";
        push({
          kind: "bash",
          entryId,
          sourceEntryId: entryId,
          toolCallId,
          command,
          isError,
          exitCode: null,
          ...isError && text ? { error: text } : {}
        });
      } else {
        push({ kind: "toolResult", entryId, sourceEntryId: entryId, toolCallId, toolName, isError, text });
      }
      if (toolName === "fabric_exec") {
        const nested = readFabricProjectionTrace(toolResult.details);
        const intent = fabricRunIntent(pending);
        if (intent && pending) {
          const subordinal = `call:${toolCallId}`;
          push({
            kind: "fabricRun",
            entryId: pending.entryId,
            sourceEntryId: entryId,
            toolCallId,
            subordinal,
            address: `${pending.entryId}/${subordinal}`,
            name: intent.name,
            ...intent.description !== void 0 ? { description: intent.description } : {},
            outcome: nested?.outcome ?? (isError ? "failed" : "succeeded"),
            source: nested?.source ?? "result"
          });
        }
        if (nested) {
          for (let phaseIndex = 0; phaseIndex < nested.phases.length; phaseIndex++) {
            const subordinal = `phase:${phaseIndex}`;
            push({
              kind: "fabricPhase",
              entryId,
              sourceEntryId: entryId,
              subordinal,
              address: `${entryId}/${subordinal}`,
              phase: nested.phases[phaseIndex]
            });
          }
          for (const operation of nested.operations) {
            const subordinal = String(operation.sequence);
            push({
              kind: "fabricOperation",
              entryId,
              sourceEntryId: entryId,
              subordinal,
              address: `${entryId}/${subordinal}`,
              ref: operation.ref,
              ...operation.provider ? { provider: operation.provider } : {},
              ...operation.action ? { action: operation.action } : {},
              tool: operation.tool,
              args: operation.args,
              outcome: operation.outcome,
              ...operation.error !== void 0 ? { error: operation.error } : {},
              ...operation.result !== void 0 ? { result: operation.result } : {},
              source: operation.source
            });
          }
        }
      }
      continue;
    }
    if (role === "bashExecution") {
      const bash = message;
      const exitCode = typeof bash.exitCode === "number" ? bash.exitCode : null;
      const isError = exitCode !== null && exitCode !== 0;
      push({
        kind: "bash",
        entryId,
        sourceEntryId: entryId,
        toolCallId: "",
        command: typeof bash.command === "string" ? bash.command : "",
        isError,
        exitCode,
        ...isError && typeof bash.output === "string" && bash.output ? { error: bash.output } : {}
      });
      continue;
    }
  }
  return events;
};
var countErasedThinkingBlocks = (entries) => {
  let count = 0;
  for (const entry of entries) {
    if (!isMessageEntry(entry)) continue;
    const message = entry.message;
    if (message.role !== "assistant" || !Array.isArray(message.content)) continue;
    for (const part of message.content) {
      if (!part || typeof part !== "object" || !("type" in part)) continue;
      if (part.type === "thinking" && typeof part.thinking === "string") count += 1;
    }
  }
  return count;
};

// src/compaction/projections.ts
var MAX_LINE = 140;
var FILE_TOOLS = /* @__PURE__ */ new Set(["read", "edit", "write", "grep", "find", "ls"]);
var MODIFYING_TOOLS = /* @__PURE__ */ new Set(["edit", "write"]);
var MAX_USER_GOAL_LINES = 3;
var MAX_USER_GOAL_LINE = 1024;
var MAX_USER_ONELINER = 120;
var MAX_EARLIER_USER = 80;
var MAX_STATUS_LINE = 140;
var MAX_TRANSCRIPT_LINE = 100;
var MAX_TRANSCRIPT_CMD = 80;
var MAX_FABRIC_RUN_NAME = 80;
var MAX_FABRIC_RUN_DESCRIPTION = 180;
var MAX_FABRIC_RUN_TRANSCRIPT_NAME = 60;
var MAX_FABRIC_RUN_EARLIER_NAME = 48;
var MAX_FABRIC_RUN_STATUS_NAME = 96;
var MAX_LATER_GOALS = 24;
var MAX_FILES_PER_KIND = 24;
var MAX_OUTSTANDING = 32;
var MAX_ACTIVITY = 48;
var MAX_UNRESOLVED = 24;
var MAX_RESOLVED = MAX_OUTSTANDING - MAX_UNRESOLVED;
var MAX_EARLIER_TURNS = 32;
var TRANSCRIPT_WINDOW = 40;
var truncate = (text, max) => {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}\u2026` : flat;
};
var quoted = (text, max) => JSON.stringify(truncate(text, max));
var customDetailsSuffix = (details, max = 160) => {
  if (details === void 0) return "";
  try {
    return ` details=${truncate(JSON.stringify(details), max)}`;
  } catch {
    return "";
  }
};
var customMessageLine = (event, maxText) => {
  const visibility = event.display ? "visible" : "hidden";
  return `custom ${quoted(event.customType, 80)} (${visibility}): ${quoted(event.text, maxText)}${customDetailsSuffix(event.details)}`;
};
var trailingEllipsis = (lines, max) => {
  if (lines.length <= max) return lines;
  return [...lines.slice(0, max), "\u2026"];
};
var pathOf = (args) => {
  const value = args.path ?? args.file ?? args.dir;
  return typeof value === "string" && value.trim() ? value : void 0;
};
var collectOperations = (events) => {
  const calls = /* @__PURE__ */ new Map();
  for (const event of events) {
    if (event.kind === "toolCall") calls.set(event.toolCallId, event);
  }
  const operations = [];
  for (const event of events) {
    if (event.kind === "fabricOperation") {
      operations.push({
        index: event.index,
        entryId: event.entryId,
        address: event.address,
        tool: event.tool,
        ref: event.ref,
        ...event.provider ? { provider: event.provider } : {},
        ...event.action ? { action: event.action } : {},
        args: event.args,
        outcome: event.outcome,
        ...event.error !== void 0 ? { error: event.error } : {},
        ...event.result !== void 0 ? { result: event.result } : {},
        nested: true
      });
      continue;
    }
    if (event.kind === "toolResult" && event.toolName !== "bash") {
      const call = event.toolCallId ? calls.get(event.toolCallId) : void 0;
      if (!call) continue;
      operations.push({
        index: event.index,
        entryId: call.entryId,
        address: call.entryId,
        tool: call.name,
        ref: call.name,
        args: call.args,
        outcome: event.isError ? "failed" : "succeeded",
        ...event.isError && event.text ? { error: event.text } : {},
        nested: false
      });
      continue;
    }
    if (event.kind === "bash") {
      operations.push({
        index: event.index,
        entryId: event.entryId,
        address: event.entryId,
        tool: "bash",
        ref: "bash",
        args: { command: event.command },
        outcome: event.isError ? "failed" : "succeeded",
        ...event.error ? { error: event.error } : {},
        nested: false
      });
    }
  }
  return operations.sort((left, right) => left.index - right.index);
};
var isFileOperation = (operation) => FILE_TOOLS.has(operation.tool) && (operation.ref === operation.tool || operation.ref === `pi.${operation.tool}`);
var isBashOperation = (operation) => operation.tool === "bash" && (operation.ref === "bash" || operation.ref === "pi.bash");
var resultProvesCreation = (result) => {
  if (!result || typeof result !== "object" || Array.isArray(result)) return false;
  const record = result;
  if (record.created === true) return true;
  const details = record.details;
  return Boolean(details && typeof details === "object" && !Array.isArray(details) && details.created === true);
};
var commonRoot = (paths) => {
  if (paths.length === 0) return "";
  const split = paths.map((p) => p.split(/[\\/]/).filter(Boolean));
  let common = 0;
  const first = split[0];
  loop: while (common < first.length) {
    const segment = first[common];
    for (let i = 1; i < split.length; i++) {
      if (split[i].length <= common || split[i][common] !== segment) break loop;
    }
    common += 1;
  }
  if (common === 0) return "";
  return `${first.slice(0, common).join("/")}/`;
};
var stripRoot = (root, path) => root ? path.replace(root, "") : path;
var projectGoal = (events) => {
  const first = events.find(
    (event) => event.kind === "user"
  );
  if (!first) return { lines: [], omitted: 0 };
  const firstLines = first.text.split("\n").filter(
    (line, i, arr) => line.trim() !== "" || i === 0 && arr.length === 1
  ).map((line) => truncate(line, MAX_USER_GOAL_LINE));
  const lines = [...trailingEllipsis(firstLines, MAX_USER_GOAL_LINES)];
  function* laterUsers() {
    let skippedFirst = false;
    for (const event of events) {
      if (event.kind !== "user") continue;
      if (!skippedFirst) {
        skippedFirst = true;
        continue;
      }
      yield event;
    }
  }
  const sampled = sampleAddressedFrom(laterUsers(), MAX_LATER_GOALS);
  for (let index = 0; index < sampled.values.length; index++) {
    if (sampled.omitted > 0 && index === sampled.splitIndex) {
      lines.push(omissionLine(
        sampled.omitted,
        sampled.omittedFirstEntryId,
        sampled.omittedLastEntryId,
        "user scope changes"
      ));
    }
    const user = sampled.values[index];
    const line = truncate(firstLine(user.text), MAX_USER_ONELINER);
    if (line) lines.push(`- ${line} [entry ${user.entryId}]`);
  }
  return { lines, omitted: sampled.omitted };
};
var projectFiles = (events) => {
  const read = /* @__PURE__ */ new Map();
  const modified = /* @__PURE__ */ new Map();
  const written = /* @__PURE__ */ new Map();
  const created = /* @__PURE__ */ new Map();
  for (const operation of collectOperations(events)) {
    if (!isFileOperation(operation) || operation.outcome !== "succeeded") continue;
    const path = pathOf(operation.args);
    if (!path) continue;
    const address = { path, entryId: operation.address };
    if (operation.tool === "write") {
      const target = resultProvesCreation(operation.result) ? created : written;
      if (!target.has(path)) target.set(path, address);
    } else if (operation.tool === "edit") {
      if (!modified.has(path)) modified.set(path, address);
    } else if (!read.has(path)) {
      read.set(path, address);
    }
  }
  const modifiedSet = /* @__PURE__ */ new Set();
  for (const path of modified.keys()) modifiedSet.add(path);
  for (const path of written.keys()) modifiedSet.add(path);
  for (const path of created.keys()) modifiedSet.add(path);
  function* filteredRead() {
    for (const item of read.values()) {
      if (!modifiedSet.has(item.path)) yield item;
    }
  }
  const sampledCreated = sampleAddressedFrom(created.values(), MAX_FILES_PER_KIND);
  const sampledWritten = sampleAddressedFrom(written.values(), MAX_FILES_PER_KIND);
  const sampledModified = sampleAddressedFrom(modified.values(), MAX_FILES_PER_KIND);
  const sampledRead = sampleAddressedFrom(filteredRead(), MAX_FILES_PER_KIND);
  const allSampled = [
    ...sampledCreated.values,
    ...sampledWritten.values,
    ...sampledModified.values,
    ...sampledRead.values
  ];
  if (allSampled.length === 0) return { lines: [], omitted: 0 };
  const root = commonRoot(allSampled.map((item) => item.path));
  const lines = [];
  let omitted = 0;
  if (root) lines.push(`(under ${root})`);
  const appendKind = (header, sampled) => {
    if (sampled.values.length === 0 && sampled.omitted === 0) return;
    lines.push(header);
    omitted += sampled.omitted;
    for (let index = 0; index < sampled.values.length; index++) {
      if (sampled.omitted > 0 && index === sampled.splitIndex) {
        lines.push(`  ${omissionLine(
          sampled.omitted,
          sampled.omittedFirstEntryId,
          sampled.omittedLastEntryId,
          "file addresses"
        )}`);
      }
      const item = sampled.values[index];
      lines.push(`  ${stripRoot(root, item.path)} [entry ${item.entryId}]`);
    }
  };
  appendKind("Created:", sampledCreated);
  appendKind("Written:", sampledWritten);
  appendKind("Modified:", sampledModified);
  appendKind("Read:", sampledRead);
  return { lines, omitted };
};
var fabricRunPointer = (event) => event.source === "branch" ? event.address : event.entryId;
var projectActivity = (events) => {
  const items = [];
  for (const event of events) {
    if (event.kind === "fabricRun") {
      const name = clipUtf8(truncate(event.name, MAX_FABRIC_RUN_NAME), 192);
      const description = event.description ? clipUtf8(truncate(event.description, MAX_FABRIC_RUN_DESCRIPTION), 512) : "";
      items.push({
        entryId: fabricRunPointer(event),
        line: `- ${name}${description ? ` \u2014 ${description}` : ""} \u2192 ${event.outcome}`
      });
    } else if (event.kind === "fabricPhase") {
      items.push({ entryId: event.address, line: `- Phase: ${truncate(event.phase, MAX_LINE)}` });
    } else if (event.kind === "fabricOperation") {
      if (FILE_TOOLS.has(event.tool) && (event.ref === event.tool || event.ref === `pi.${event.tool}`)) continue;
      const bash = event.tool === "bash" && (event.ref === "bash" || event.ref === "pi.bash");
      const primary = bash ? event.args.command : event.args.id ?? event.args.name ?? event.args.query ?? event.args.action;
      const detail = typeof primary === "string" && primary.trim() ? ` (${truncate(firstLine(primary), 72)})` : "";
      items.push({
        entryId: event.address,
        line: `- ${event.ref}${detail} \u2192 ${event.outcome}`
      });
    }
  }
  const sampled = sampleAddressed(items, MAX_ACTIVITY);
  const lines = [];
  for (let index = 0; index < sampled.values.length; index++) {
    if (sampled.omitted > 0 && index === sampled.splitIndex) {
      lines.push(omissionLine(
        sampled.omitted,
        sampled.omittedFirstEntryId,
        sampled.omittedLastEntryId,
        "Fabric activity records"
      ));
    }
    const item = sampled.values[index];
    lines.push(`${item.line} [entry ${item.entryId}]`);
  }
  return { lines, omitted: sampled.omitted };
};
var projectOutstandingWithMetadata = (events) => {
  const operations = collectOperations(events);
  const keyOf = (operation) => {
    const path = isFileOperation(operation) ? pathOf(operation.args) : void 0;
    if (path) return `file\0${operation.tool}\0${path}`;
    const command = isBashOperation(operation) && typeof operation.args.command === "string" ? operation.args.command : void 0;
    if (command !== void 0) return `bash\0${operation.tool}\0${command}`;
    return `generic\0${operation.ref}\0${JSON.stringify(operation.args)}`;
  };
  const successes = operations.filter((operation) => operation.outcome === "succeeded").map((operation) => ({ index: operation.index, key: keyOf(operation) }));
  const items = [];
  for (const operation of operations) {
    if (operation.outcome === "succeeded") continue;
    const path = isFileOperation(operation) ? pathOf(operation.args) : void 0;
    const command = isBashOperation(operation) && typeof operation.args.command === "string" ? operation.args.command : void 0;
    const subject = path ? `${operation.ref} ${path}` : command !== void 0 ? `${operation.ref}: ${truncate(firstLine(command), MAX_LINE)}` : operation.ref;
    const error = operation.error ? `: ${truncate(firstLine(operation.error), MAX_LINE)}` : `: ${operation.outcome}`;
    const key = keyOf(operation);
    const resolved2 = successes.some((success) => success.index > operation.index && success.key === key);
    items.push({
      index: operation.index,
      entryId: operation.address,
      description: `${subject}${error}`,
      resolved: resolved2
    });
  }
  if (items.length === 0) return { lines: [], omitted: 0 };
  const unresolved = items.filter((i) => !i.resolved).sort((a, b) => a.index - b.index);
  const resolved = items.filter((i) => i.resolved).sort((a, b) => a.index - b.index);
  const sampledUnresolved = sampleAddressed(unresolved, MAX_UNRESOLVED);
  const sampledResolved = sampleAddressed(resolved, MAX_RESOLVED);
  const lines = [];
  const append = (sampled, noun) => {
    for (let index = 0; index < sampled.values.length; index++) {
      if (sampled.omitted > 0 && index === sampled.splitIndex) {
        lines.push(omissionLine(
          sampled.omitted,
          sampled.omittedFirstEntryId,
          sampled.omittedLastEntryId,
          noun
        ));
      }
      const item = sampled.values[index];
      lines.push(`- ${item.description}${item.resolved ? " [RESOLVED]" : ""} [entry ${item.entryId}]`);
    }
  };
  append(sampledUnresolved, "open error records");
  append(sampledResolved, "resolved error records");
  return { lines, omitted: sampledUnresolved.omitted + sampledResolved.omitted };
};
var projectEarlierTurns = (events) => {
  function* earlierTurns() {
    let currentContext;
    let counts = /* @__PURE__ */ new Map();
    let order = [];
    let lastRun;
    const completed = () => {
      if (!currentContext) return void 0;
      return {
        entryId: currentContext.entryId,
        contextLine: currentContext.kind === "user" ? quoted(firstLine(currentContext.text), MAX_EARLIER_USER) : customMessageLine(currentContext, MAX_EARLIER_USER),
        tools: order.map((name) => `${name}:${counts.get(name) ?? 0}`).join(" "),
        run: lastRun ? `fabric:${quoted(clipUtf8(lastRun.name, 128), MAX_FABRIC_RUN_EARLIER_NAME)}\u2192${lastRun.outcome}` : ""
      };
    };
    for (const event of events) {
      if (event.kind === "user" || event.kind === "customMessage") {
        const turn = completed();
        if (turn) yield turn;
        currentContext = event;
        counts = /* @__PURE__ */ new Map();
        order = [];
        lastRun = void 0;
        continue;
      }
      if (!currentContext) continue;
      if (event.kind === "fabricRun") lastRun = event;
      const name = event.kind === "toolCall" ? event.name === "fabric_exec" ? void 0 : event.name : event.kind === "bash" ? "bash" : event.kind === "fabricOperation" ? event.tool : void 0;
      if (!name) continue;
      if (!counts.has(name)) order.push(name);
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  const sampled = sampleAddressedFrom(earlierTurns(), MAX_EARLIER_TURNS);
  const lines = [];
  for (let index = 0; index < sampled.values.length; index++) {
    if (sampled.omitted > 0 && index === sampled.splitIndex) {
      lines.push(omissionLine(
        sampled.omitted,
        sampled.omittedFirstEntryId,
        sampled.omittedLastEntryId,
        "earlier turns"
      ));
    }
    const turn = sampled.values[index];
    const metadata = [turn.tools, turn.run].filter(Boolean).join(" | ");
    lines.push(`${turn.contextLine}${metadata ? ` | ${metadata}` : ""} [entry ${turn.entryId}]`);
  }
  return { lines, omitted: sampled.omitted };
};
var projectStatus = (events) => {
  const lastContext = [...events].reverse().find(
    (event) => event.kind === "user" || event.kind === "customMessage"
  );
  const lines = [];
  if (lastContext?.kind === "user") {
    lines.push(`Last request: ${truncate(firstLine(lastContext.text), MAX_STATUS_LINE)}`);
  } else if (lastContext) {
    lines.push(`Last context: ${customMessageLine(lastContext, MAX_STATUS_LINE)}`);
  }
  let lastModify;
  for (const operation of collectOperations(events)) {
    if (isFileOperation(operation) && MODIFYING_TOOLS.has(operation.tool)) lastModify = operation;
  }
  if (lastModify) {
    const path = pathOf(lastModify.args) ?? "";
    lines.push(`Last change: ${lastModify.tool}${path ? ` ${path}` : ""}`);
  }
  const lastRun = [...events].reverse().find((event) => event.kind === "fabricRun");
  if (lastRun) {
    lines.push(
      `Last execution: ${clipUtf8(truncate(lastRun.name, MAX_FABRIC_RUN_STATUS_NAME), 256)} \u2192 ${lastRun.outcome} [entry ${fabricRunPointer(lastRun)}]`
    );
  }
  const lastAssistant = [...events].reverse().find((e) => e.kind === "assistantText");
  if (lastAssistant) {
    const text = truncate(firstLine(lastAssistant.text), MAX_STATUS_LINE);
    if (text) lines.push(`Last note: ${text}`);
  }
  return lines;
};
var summarizeArgs = (name, args) => {
  if (name === "fabric_exec") return "structured execution";
  const primary = name === "bash" ? args.command ?? args.cmd ?? args.shell : name === "grep" ? args.pattern ?? args.query ?? args.regex : name === "find" ? args.pattern : pathOf(args);
  if (typeof primary === "string" && primary.trim()) {
    return truncate(firstLine(primary), MAX_TRANSCRIPT_CMD);
  }
  const entries = Object.entries(args).slice(0, 2);
  return entries.map(([key, value]) => `${key}=${truncate(String(value), 40)}`).join(" ");
};
var projectTranscript = (events) => {
  const completedFabricCalls = new Set(
    events.filter((event) => event.kind === "fabricRun").map((event) => event.toolCallId)
  );
  const transcriptEvents = events.filter((event) => {
    if (event.kind === "toolCall") {
      return event.name !== "fabric_exec" || !completedFabricCalls.has(event.toolCallId);
    }
    if (event.kind === "toolResult") {
      return event.toolName !== "fabric_exec" || !completedFabricCalls.has(event.toolCallId);
    }
    return true;
  });
  const window = transcriptEvents.slice(-TRANSCRIPT_WINDOW);
  const lines = [];
  const omitted = transcriptEvents.length - window.length;
  if (omitted > 0) {
    lines.push(omissionLine(
      omitted,
      transcriptEvents[0]?.entryId,
      transcriptEvents[omitted - 1]?.entryId,
      "transcript events"
    ));
  }
  for (const e of window) {
    const ref = `(#${e.index})`;
    if (e.kind === "user") {
      lines.push(`${ref} user: ${truncate(firstLine(e.text), MAX_TRANSCRIPT_LINE)}`);
    } else if (e.kind === "assistantText") {
      lines.push(`${ref} assistant: ${truncate(firstLine(e.text), MAX_TRANSCRIPT_LINE)}`);
    } else if (e.kind === "customMessage") {
      lines.push(`${ref} ${customMessageLine(e, MAX_TRANSCRIPT_LINE)}`);
    } else if (e.kind === "toolCall") {
      lines.push(`${ref} ${e.name}(${summarizeArgs(e.name, e.args)})`);
    } else if (e.kind === "toolResult") {
      const status = e.isError ? "error" : "ok";
      lines.push(`${ref} \u2192 ${status}: ${truncate(firstLine(e.text), MAX_TRANSCRIPT_LINE)}`);
    } else if (e.kind === "bash") {
      const status = e.isError ? "error" : "ok";
      lines.push(`${ref} bash(${truncate(firstLine(e.command), MAX_TRANSCRIPT_CMD)}) \u2192 ${status}`);
    } else if (e.kind === "fabricRun") {
      lines.push(
        `${ref} fabric_exec ${quoted(clipUtf8(e.name, 160), MAX_FABRIC_RUN_TRANSCRIPT_NAME)} \u2192 ${e.outcome} [entry ${fabricRunPointer(e)}]`
      );
    } else if (e.kind === "fabricPhase") {
      lines.push(`${ref} phase(${truncate(e.phase, MAX_TRANSCRIPT_CMD)}) [${e.address}]`);
    } else if (e.kind === "fabricOperation") {
      lines.push(`${ref} ${e.ref}(${summarizeArgs(e.tool, e.args)}) \u2192 ${e.outcome} [${e.address}]`);
    }
  }
  return { lines, omitted };
};
var projectWithMetadata = (events) => {
  const goal = projectGoal(events);
  const files = projectFiles(events);
  const activity = projectActivity(events);
  const outstanding = projectOutstandingWithMetadata(events);
  const earlierTurns = projectEarlierTurns(events);
  const transcript = projectTranscript(events);
  return {
    sections: {
      goal: goal.lines,
      files: files.lines,
      activity: activity.lines,
      outstanding: outstanding.lines,
      earlierTurns: earlierTurns.lines,
      status: projectStatus(events),
      transcript: transcript.lines
    },
    omittedCounts: {
      goal: goal.omitted,
      files: files.omitted,
      activity: activity.omitted,
      outstanding: outstanding.omitted,
      earlierTurns: earlierTurns.omitted,
      transcript: transcript.omitted
    }
  };
};

// src/compaction/render.ts
var SECTION_ORDER = [
  { key: "goal", header: "[Session Goal]", maxBytes: 4096 },
  { key: "files", header: "[Files And Changes]", maxBytes: 4608 },
  { key: "activity", header: "[Fabric Activity]", maxBytes: 2048 },
  { key: "outstanding", header: "[Outstanding Context]", maxBytes: 4608 },
  { key: "earlierTurns", header: "[Earlier Turns]", maxBytes: 3072 },
  { key: "status", header: "[Current Status]", maxBytes: 2048 }
];
var REQUEST_MAX_BYTES = 3072;
var TRANSCRIPT_MAX_BYTES = 5120;
var FOOTER_MAX_BYTES = 1536;
var MAX_INPUT_LINES_PER_SECTION = 128;
var MAX_RENDERED_LINE_BYTES = 1024;
var POINTER_LINE = "For exact pre-summary history, use memory.recall on this range, then memory.expand by stable entry or operation address.";
var sampledLines = (lines, keep) => {
  if (lines.length <= keep) return [...lines];
  const earliest = Math.ceil(keep / 2);
  const latest = Math.floor(keep / 2);
  return [
    ...lines.slice(0, earliest),
    `\u2026 omitted ${lines.length - keep} rendered lines`,
    ...lines.slice(lines.length - latest)
  ];
};
var boundedBlock = (header, sourceLines, maxBytes) => {
  const clipped = sourceLines.map((line) => clipUtf8(line, MAX_RENDERED_LINE_BYTES));
  const capped = sampledLines(clipped, Math.min(clipped.length, MAX_INPUT_LINES_PER_SECTION));
  for (let keep = capped.length; keep >= 0; keep--) {
    const lines = sampledLines(capped, keep);
    const block = [header, ...lines].join("\n");
    if (utf8Bytes(block) <= maxBytes) return block;
  }
  return clipUtf8(header, maxBytes);
};
var renderSummary = (sections, options) => {
  const blocks = [];
  for (const { key, header, maxBytes } of SECTION_ORDER) {
    const lines = sections[key];
    if (lines.length === 0) continue;
    blocks.push(boundedBlock(header, lines, maxBytes));
    if (key === "goal" && options.requestLines && options.requestLines.length > 0) {
      blocks.push(boundedBlock("[Compaction Request]", options.requestLines, REQUEST_MAX_BYTES));
    }
  }
  if (sections.goal.length === 0 && options.requestLines && options.requestLines.length > 0) {
    blocks.unshift(boundedBlock("[Compaction Request]", options.requestLines, REQUEST_MAX_BYTES));
  }
  if (sections.transcript.length > 0) {
    blocks.push(boundedBlock("---", sections.transcript, TRANSCRIPT_MAX_BYTES));
  }
  const timestamp = options.lastTimestamp || "(unknown time)";
  const range = options.firstEntryId || options.lastEntryId ? `${options.firstEntryId || "(start)"} \u2192 ${options.lastEntryId || "(end)"}` : "(no entries)";
  const footer = options.summaryKind === "branch" ? `[branch summarized ${timestamp}; structural source entries ${range}]` : `[compacted ${timestamp}; cumulative source entries ${range}]`;
  blocks.push(boundedBlock("---", [footer, POINTER_LINE], FOOTER_MAX_BYTES));
  const summary = `${blocks.join("\n\n")}
`;
  if (utf8Bytes(summary) <= MAX_SUMMARY_BYTES) return summary;
  return `${clipUtf8(summary, MAX_SUMMARY_BYTES - 1, "")}
`;
};

// src/compaction/branch-summary.ts
var SECTION_HEADERS = [
  { key: "goal", header: "[Session Goal]" },
  { key: "files", header: "[Files And Changes]" },
  { key: "activity", header: "[Fabric Activity]" },
  { key: "outstanding", header: "[Outstanding Context]" },
  { key: "earlierTurns", header: "[Earlier Turns]" },
  { key: "status", header: "[Current Status]" }
];
var asJsonObject = (value) => {
  try {
    const cloned = JSON.parse(JSON.stringify(value));
    return cloned && typeof cloned === "object" && !Array.isArray(cloned) ? cloned : void 0;
  } catch {
    return void 0;
  }
};
var directOperationFact = (call, outcome, error) => {
  if (call.name === "fabric_exec") return void 0;
  const args = asJsonObject(call.args);
  if (!args) return void 0;
  const subordinal = `call:${call.toolCallId}`;
  return {
    kind: "operation",
    entryId: call.entryId,
    subordinal,
    address: `${call.entryId}/${subordinal}`,
    ref: call.name,
    action: call.name,
    tool: call.name,
    args,
    outcome,
    ...error ? { error: clipUtf8(error, 8 * 1024) } : {}
  };
};
var factsFromEvents = (events) => {
  const facts = [];
  const calls = /* @__PURE__ */ new Map();
  for (const event of events) {
    if (event.kind === "toolCall") calls.set(event.toolCallId, event);
  }
  for (const event of events) {
    if (event.kind === "user") {
      facts.push({
        kind: "user",
        entryId: event.entryId,
        subordinal: "user",
        address: `${event.entryId}/user`,
        text: clipUtf8(event.text, 2 * 1024)
      });
    } else if (event.kind === "customMessage") {
      facts.push({
        kind: "customMessage",
        entryId: event.entryId,
        subordinal: "custom-message",
        address: `${event.entryId}/custom-message`,
        customType: clipUtf8(event.customType, 256),
        text: clipUtf8(event.text, 4 * 1024),
        display: event.display,
        ...event.details !== void 0 ? { details: event.details } : {}
      });
    } else if (event.kind === "fabricPhase") {
      facts.push({
        kind: "phase",
        entryId: event.entryId,
        subordinal: event.subordinal,
        address: event.address,
        phase: event.phase
      });
    } else if (event.kind === "fabricRun") {
      facts.push({
        kind: "fabricRun",
        entryId: event.entryId,
        subordinal: event.subordinal,
        address: event.address,
        name: clipUtf8(event.name, FABRIC_BRANCH_RUN_NAME_MAX_BYTES),
        ...event.description !== void 0 ? { description: clipUtf8(event.description, FABRIC_BRANCH_RUN_DESCRIPTION_MAX_BYTES) } : {},
        outcome: event.outcome
      });
    } else if (event.kind === "fabricOperation") {
      facts.push({
        kind: "operation",
        entryId: event.entryId,
        subordinal: event.subordinal,
        address: event.address,
        ref: event.ref,
        ...event.provider ? { provider: event.provider } : {},
        ...event.action ? { action: event.action } : {},
        tool: event.tool,
        args: event.args,
        outcome: event.outcome,
        ...event.error !== void 0 ? { error: event.error } : {},
        ...event.result !== void 0 ? { result: event.result } : {}
      });
    } else if (event.kind === "toolResult" && event.toolName !== "bash") {
      const call = event.toolCallId ? calls.get(event.toolCallId) : void 0;
      if (!call) continue;
      const fact = directOperationFact(call, event.isError ? "failed" : "succeeded", event.isError ? event.text : void 0);
      if (fact) facts.push(fact);
    } else if (event.kind === "bash") {
      const call = event.toolCallId ? calls.get(event.toolCallId) : void 0;
      if (call) {
        const fact = directOperationFact(call, event.isError ? "failed" : "succeeded", event.error);
        if (fact) facts.push(fact);
      } else {
        const subordinal = "bash";
        facts.push({
          kind: "operation",
          entryId: event.entryId,
          subordinal,
          address: `${event.entryId}/${subordinal}`,
          ref: "bash",
          action: "bash",
          tool: "bash",
          args: { command: event.command },
          outcome: event.isError ? "failed" : "succeeded",
          ...event.error ? { error: clipUtf8(event.error, 8 * 1024) } : {}
        });
      }
    }
  }
  return facts;
};
var serializedBytes = (value) => Buffer.byteLength(JSON.stringify(value), "utf8");
var boundedDetails = (sourceEntries, facts, sections, request, oldLeafId) => {
  const sampled = sampleAddressed(facts, FABRIC_BRANCH_SUMMARY_MAX_FACTS);
  const details = {
    kind: FABRIC_BRANCH_SUMMARY_KIND,
    version: FABRIC_BRANCH_SUMMARY_VERSION,
    source: {
      firstEntryId: sourceEntries[0]?.id ?? "",
      lastEntryId: sourceEntries.at(-1)?.id ?? "",
      entryCount: sourceEntries.length,
      oldLeafId
    },
    facts: sampled.values,
    omittedFacts: sampled.omitted,
    sections,
    request: {
      text: request.text,
      sourceBytes: request.sourceBytes,
      truncated: request.truncated
    }
  };
  for (let index = details.facts.length - 1; serializedBytes(details) > FABRIC_BRANCH_SUMMARY_MAX_BYTES && index >= 0; index--) {
    const fact = details.facts[index];
    if (fact.kind === "operation" && fact.result !== void 0) delete fact.result;
  }
  while (serializedBytes(details) > FABRIC_BRANCH_SUMMARY_MAX_BYTES && details.facts.length > 0) {
    const middle = Math.floor(details.facts.length / 2);
    details.facts.splice(middle, 1);
    details.omittedFacts += 1;
  }
  return details;
};
var compileFabricBranchSummary = (entriesToSummarize, customInstructions, enrichers = NO_BUILTIN_ENRICHERS, oldLeafId = null) => {
  const instructions = decodeCompactionInstructions(customInstructions);
  if (!instructions.ok) return void 0;
  const events = normalizeEntries(entriesToSummarize);
  if (events.length === 0) return void 0;
  const projected = projectWithMetadata(events);
  runEnrichers(enrichers, events, projected.sections);
  const request = {
    text: instructions.requestLines.join("\n"),
    sourceBytes: instructions.policy.sourceBytes,
    truncated: instructions.policy.truncated
  };
  const sections = SECTION_HEADERS.filter(({ key }) => projected.sections[key].length > 0).map(({ header }) => header);
  if (request.text) sections.splice(1, 0, "[Compaction Request]");
  const summary = renderSummary(projected.sections, {
    firstEntryId: entriesToSummarize[0]?.id ?? "",
    lastEntryId: entriesToSummarize.at(-1)?.id ?? "",
    lastTimestamp: entriesToSummarize.at(-1)?.timestamp ?? "",
    ...instructions.requestLines.length > 0 ? { requestLines: instructions.requestLines } : {},
    summaryKind: "branch"
  });
  return {
    summary,
    details: boundedDetails(entriesToSummarize, factsFromEvents(events), sections, request, oldLeafId)
  };
};

// src/compaction/hook.ts
var SUMMARY_RAW_TOKEN_BUDGET = Math.ceil(MAX_SUMMARY_BYTES / 4);
var HARD_CEILING_SAFETY_RATIO = 0.9;
var MAX_PRECOMPACTION_RATIO = 0.95;
var OVERFLOW_WINDOW_EVIDENCE_RATIO = 0.9;
var isMessageEntry2 = (entry) => entry.type === "message";
var isHiddenEmptyCustom = (message) => {
  if (!message || typeof message !== "object") return false;
  const candidate = message;
  if (candidate.role !== "custom" || candidate.display !== false) return false;
  const content = candidate.content;
  return content === "" || Array.isArray(content) && content.length === 0;
};
var toolCallIdsOf = (message) => {
  const content = message.content;
  if (!Array.isArray(content)) return [];
  const ids = [];
  for (const part of content) {
    if (!part || typeof part !== "object" || !("type" in part) || part.type !== "toolCall") continue;
    const id = part.id;
    if (typeof id === "string") ids.push(id);
  }
  return ids;
};
var contextMessages = (entry) => {
  try {
    return sessionEntryToContextMessages(entry);
  } catch {
    return [];
  }
};
var findLastCompaction = (entries) => {
  for (let index = entries.length - 1; index >= 0; index--) {
    const entry = entries[index];
    if (entry.type === "compaction") {
      return { index, firstKeptEntryId: entry.firstKeptEntryId };
    }
  }
  return void 0;
};
var collectContextEntries = (entries, startIndex) => {
  const contextEntries = [];
  for (let index = Math.max(0, startIndex); index < entries.length; index++) {
    const entry = entries[index];
    if (entry.type === "compaction") continue;
    if (entry.type === "custom_message" && !isPiCustomMessageEntry(entry)) continue;
    if (isMessageEntry2(entry) && isHiddenEmptyCustom(entry.message)) continue;
    const messages = contextMessages(entry);
    if (messages.length === 0) continue;
    const roles = messages.map((message) => message.role);
    const rawMessage = isMessageEntry2(entry) ? entry.message : void 0;
    contextEntries.push({
      entry,
      branchIndex: index,
      turnBoundary: roles.some((role) => role === "user" || role === "custom" || role === "bashExecution" || role === "branchSummary" || role === "compactionSummary"),
      cutPoint: roles.some((role) => role !== "toolResult"),
      estimatedTokens: messages.reduce((total, message) => total + estimateTokens(message), 0),
      ...rawMessage ? { message: rawMessage } : {}
    });
  }
  return contextEntries;
};
var collectLive = (entries) => {
  const last = findLastCompaction(entries);
  if (!last) return collectContextEntries(entries, 0);
  if (last.firstKeptEntryId) {
    const keptIndex = entries.findIndex((entry) => entry.id === last.firstKeptEntryId);
    if (keptIndex >= 0) return collectContextEntries(entries, keptIndex);
  }
  return collectContextEntries(entries, last.index + 1);
};
var previousBoundaryAtOrBefore = (live, branchIndex) => {
  for (let index = live.length - 1; index >= 0; index--) {
    const item = live[index];
    if (item.branchIndex <= branchIndex && item.turnBoundary) return index;
  }
  return -1;
};
var lastBoundaryIndex = (live) => {
  for (let index = live.length - 1; index >= 0; index--) {
    if (live[index].turnBoundary) return index;
  }
  return -1;
};
var callResultSpans = (entries) => {
  const spans = /* @__PURE__ */ new Map();
  const record = (id, index, kind) => {
    if (!id) return;
    const span = spans.get(id) ?? {
      first: index,
      last: index,
      hasCall: false,
      hasResult: false
    };
    span.first = Math.min(span.first, index);
    span.last = Math.max(span.last, index);
    if (kind === "call") span.hasCall = true;
    else span.hasResult = true;
    spans.set(id, span);
  };
  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index];
    if (!isMessageEntry2(entry)) continue;
    const message = entry.message;
    for (const id of toolCallIdsOf(message)) record(id, index, "call");
    if (message.role === "toolResult" && typeof message.toolCallId === "string") {
      record(message.toolCallId, index, "result");
    }
  }
  return spans;
};
var spanCrosses = (span, boundaryIndex) => span.hasCall && span.hasResult && span.first < boundaryIndex && span.last >= boundaryIndex;
var closureSafe = (spans, boundaryIndex) => [...spans.values()].every((span) => !spanCrosses(span, boundaryIndex));
var closeCut = (branchEntries, live, candidateLiveIndex) => {
  const spans = callResultSpans(branchEntries);
  let liveIndex = candidateLiveIndex;
  while (liveIndex > 0) {
    const boundaryIndex = live[liveIndex].branchIndex;
    let earliestCrossing = boundaryIndex;
    for (const span of spans.values()) {
      if (spanCrosses(span, boundaryIndex)) {
        earliestCrossing = Math.min(earliestCrossing, span.first);
      }
    }
    if (earliestCrossing === boundaryIndex) return liveIndex;
    const closed = previousBoundaryAtOrBefore(live, earliestCrossing);
    if (closed < 0 || closed >= liveIndex) return 0;
    liveIndex = closed;
  }
  return 0;
};
var rawContextTokens = (branchEntries) => buildSessionContext(branchEntries).messages.reduce(
  (total, message) => total + estimateTokens(message),
  0
);
var usageCheckpoints = (branchEntries) => {
  const lastCompaction = findLastCompaction(branchEntries);
  const startIndex = lastCompaction ? lastCompaction.index + 1 : 0;
  let rawTokens = lastCompaction ? rawContextTokens(branchEntries.slice(0, lastCompaction.index + 1)) : 0;
  const checkpoints = [];
  for (let index = startIndex; index < branchEntries.length; index++) {
    for (const message of contextMessages(branchEntries[index])) {
      rawTokens += estimateTokens(message);
      if (message.role !== "assistant") continue;
      const contextTokens = calculateContextTokens(message.usage);
      if (Number.isFinite(contextTokens) && contextTokens > 0) {
        checkpoints.push({ rawTokens, contextTokens });
      }
    }
  }
  return checkpoints;
};
var tokenCalibration = (branchEntries, tokensBefore, rawTokensBefore) => {
  const minimumDelta = Math.max(4096, Math.floor(rawTokensBefore * 0.1));
  const checkpoints = usageCheckpoints(branchEntries).filter(
    (checkpoint) => checkpoint.rawTokens < rawTokensBefore && checkpoint.contextTokens <= tokensBefore
  );
  const slopes = checkpoints.flatMap((checkpoint) => {
    const rawDelta = rawTokensBefore - checkpoint.rawTokens;
    const contextDelta = tokensBefore - checkpoint.contextTokens;
    return rawDelta >= minimumDelta && contextDelta >= 0 ? [contextDelta / rawDelta] : [];
  }).filter((slope) => Number.isFinite(slope) && slope >= 0);
  if (slopes.length === 0) {
    return {
      tokenScale: 1,
      fixedOverheadTokens: Math.max(0, tokensBefore - rawTokensBefore)
    };
  }
  const tokenScale = Math.max(1, ...slopes);
  const fixedOverheadTokens = Math.max(
    0,
    tokensBefore - tokenScale * rawTokensBefore,
    ...checkpoints.map(
      (checkpoint) => checkpoint.contextTokens - tokenScale * checkpoint.rawTokens
    )
  );
  return { tokenScale, fixedOverheadTokens };
};
var continuityCutPlan = (branchEntries, tokensBefore, budget) => {
  if (!Number.isFinite(budget.contextWindow) || budget.contextWindow <= 0) return void 0;
  const contextWindow = Math.floor(budget.contextWindow);
  const reserveTokens = Math.max(0, Math.floor(budget.reserveTokens));
  const keepRecentTokens = Math.max(0, Math.floor(budget.keepRecentTokens));
  const targetContextRatio = Math.max(0.25, Math.min(0.85, budget.targetContextRatio));
  const rawTokensBefore = rawContextTokens(branchEntries);
  const { tokenScale, fixedOverheadTokens } = tokenCalibration(
    branchEntries,
    tokensBefore,
    rawTokensBefore
  );
  const continuityTargetTokens = Math.max(1, Math.ceil(
    fixedOverheadTokens + (keepRecentTokens + SUMMARY_RAW_TOKEN_BUDGET) * tokenScale
  ));
  const occupancyCeilingTokens = Math.max(1, Math.floor(contextWindow * targetContextRatio));
  const hardCeiling = Math.max(1, contextWindow - reserveTokens);
  const safeCeilingTokens = Math.max(1, Math.floor(hardCeiling * HARD_CEILING_SAFETY_RATIO));
  const reductionCeilingTokens = Math.max(1, Math.floor(tokensBefore * MAX_PRECOMPACTION_RATIO));
  const constraints = [
    { binding: "continuity", tokens: continuityTargetTokens },
    { binding: "occupancy", tokens: occupancyCeilingTokens },
    { binding: "reserve", tokens: safeCeilingTokens },
    { binding: "reduction", tokens: reductionCeilingTokens }
  ];
  const targetContextTokens = Math.min(...constraints.map(({ tokens }) => tokens));
  const bindingConstraint = constraints.find(
    ({ tokens }) => tokens === targetContextTokens
  ).binding;
  const rawPostBudget = Math.max(
    0,
    Math.floor((targetContextTokens - fixedOverheadTokens) / tokenScale)
  );
  return {
    contextWindow,
    targetContextRatio,
    targetContextTokens,
    reserveTokens,
    keepRecentTokens,
    rawTokensBefore,
    tokenScale,
    fixedOverheadTokens,
    continuityTargetTokens,
    occupancyCeilingTokens,
    safeCeilingTokens,
    reductionCeilingTokens,
    rawTailTokenBudget: Math.max(0, rawPostBudget - SUMMARY_RAW_TOKEN_BUDGET),
    bindingConstraint
  };
};
var boundary = (summarized, firstKeptEntryId, budget) => {
  if (summarized.length === 0) return { ok: false, reason: "empty" };
  const first = summarized[0];
  const last = summarized.at(-1);
  return {
    ok: true,
    summarized,
    firstKeptEntryId,
    firstSummarizedEntryId: first.id,
    lastSummarizedEntryId: last.id,
    lastTimestamp: last.timestamp,
    ...budget ? { budget } : {}
  };
};
var computeContinuityCut = (branchEntries, live, plan) => {
  const suffixTokens = new Array(live.length + 1).fill(0);
  for (let index = live.length - 1; index >= 0; index--) {
    suffixTokens[index] = suffixTokens[index + 1] + live[index].estimatedTokens;
  }
  const spans = callResultSpans(branchEntries);
  const previousCompactionIndex = findLastCompaction(branchEntries)?.index ?? -1;
  let cutIndex = live.length;
  for (let index = 1; index < live.length; index++) {
    const item = live[index];
    if (item.branchIndex <= previousCompactionIndex) continue;
    if (!item.cutPoint || suffixTokens[index] > plan.rawTailTokenBudget) continue;
    if (!closureSafe(spans, item.branchIndex)) continue;
    cutIndex = index;
    break;
  }
  const retainedRawTokens = suffixTokens[cutIndex] ?? 0;
  const details = {
    strategy: "continuity",
    contextWindow: plan.contextWindow,
    targetContextRatio: plan.targetContextRatio,
    targetContextTokens: plan.targetContextTokens,
    reserveTokens: plan.reserveTokens,
    keepRecentTokens: plan.keepRecentTokens,
    rawTokensBefore: plan.rawTokensBefore,
    tokenScale: plan.tokenScale,
    fixedOverheadTokens: plan.fixedOverheadTokens,
    retainedRawTokens,
    continuityTargetTokens: plan.continuityTargetTokens,
    occupancyCeilingTokens: plan.occupancyCeilingTokens,
    safeCeilingTokens: plan.safeCeilingTokens,
    reductionCeilingTokens: plan.reductionCeilingTokens,
    rawTailTokenBudget: plan.rawTailTokenBudget,
    bindingConstraint: plan.bindingConstraint
  };
  if (cutIndex >= live.length) {
    return boundary(live.map((item) => item.entry), "", details);
  }
  return boundary(
    live.slice(0, cutIndex).map((item) => item.entry),
    live[cutIndex].entry.id,
    details
  );
};
var computeCut = (branchEntries, options) => {
  const live = collectLive(branchEntries);
  if (live.length === 0) return { ok: false, reason: "empty" };
  if (options) {
    const plan = continuityCutPlan(branchEntries, options.tokensBefore, options.budget);
    if (plan) return computeContinuityCut(branchEntries, live, plan);
  }
  const lastBoundary = lastBoundaryIndex(live);
  if (lastBoundary <= 0) return boundary(live.map((item) => item.entry), "");
  const closed = closeCut(branchEntries, live, lastBoundary);
  const previousCompactionIndex = findLastCompaction(branchEntries)?.index ?? -1;
  if (closed <= 0 || live[closed].branchIndex <= previousCompactionIndex) {
    return boundary(live.map((item) => item.entry), "");
  }
  return boundary(
    live.slice(0, closed).map((item) => item.entry),
    live[closed].entry.id
  );
};
var isRecord2 = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var isEntryRange = (value) => isRecord2(value) && typeof value.first === "string" && typeof value.last === "string";
var isStringArray = (value) => Array.isArray(value) && value.every((item) => typeof item === "string");
var isFabricV1Details = (value) => isStringArray(value.sections) && isEntryRange(value.summarizedEntryRange) && typeof value.sourceEntryCount === "number" && Number.isFinite(value.sourceEntryCount) && typeof value.firstKeptEntryId === "string" && typeof value.timestamp === "string";
var hasFiniteNumbers = (value, keys) => keys.every((key) => typeof value[key] === "number" && Number.isFinite(value[key]));
var isCompactionBudgetDetails = (value) => {
  if (!isRecord2(value) || value.strategy !== "adaptive" && value.strategy !== "continuity") {
    return false;
  }
  if (!hasFiniteNumbers(value, [
    "contextWindow",
    "targetContextRatio",
    "targetContextTokens",
    "reserveTokens",
    "keepRecentTokens",
    "rawTokensBefore",
    "tokenScale",
    "fixedOverheadTokens",
    "retainedRawTokens",
    "projectedTokensAfter"
  ])) {
    return false;
  }
  if (value.strategy === "adaptive") return true;
  return hasFiniteNumbers(value, [
    "continuityTargetTokens",
    "occupancyCeilingTokens",
    "safeCeilingTokens",
    "reductionCeilingTokens",
    "rawTailTokenBudget"
  ]) && (value.bindingConstraint === "continuity" || value.bindingConstraint === "occupancy" || value.bindingConstraint === "reserve" || value.bindingConstraint === "reduction");
};
var isFabricV2Details = (value) => {
  if (!isStringArray(value.sections) || !isRecord2(value.coverage) || !isRecord2(value.counts)) return false;
  if (!isRecord2(value.omittedCounts) || !isRecord2(value.instructionPolicy) || !isRecord2(value.stableAddresses)) {
    return false;
  }
  const instructionModes = /* @__PURE__ */ new Set(["none", "plain", "typed-v1", "malformed-typed-prefix"]);
  return isEntryRange(value.coverage.cumulativeSourceRange) && isEntryRange(value.coverage.liveCutRange) && hasFiniteNumbers(value.counts, [
    "branchEntries",
    "cumulativeSourceEntries",
    "sourceEvents",
    "liveCutEntries",
    "priorFabricV1",
    "priorFabricV2"
  ]) && hasFiniteNumbers(value.omittedCounts, [
    "goal",
    "files",
    "outstanding",
    "earlierTurns",
    "transcript",
    "preserve"
  ]) && (value.omittedCounts.activity === void 0 || typeof value.omittedCounts.activity === "number" && Number.isFinite(value.omittedCounts.activity)) && (value.omittedCounts.commits === void 0 || typeof value.omittedCounts.commits === "number" && Number.isFinite(value.omittedCounts.commits)) && (value.omittedCounts.thinking === void 0 || typeof value.omittedCounts.thinking === "number" && Number.isFinite(value.omittedCounts.thinking)) && typeof value.instructionPolicy.mode === "string" && instructionModes.has(value.instructionPolicy.mode) && typeof value.instructionPolicy.canonicalized === "boolean" && typeof value.instructionPolicy.truncated === "boolean" && hasFiniteNumbers(value.instructionPolicy, [
    "sourceBytes",
    "preserveCount",
    "omittedPreserveCount"
  ]) && typeof value.stableAddresses.firstKeptEntryId === "string" && isEntryRange(value.stableAddresses.cumulativeSourceRange) && value.stableAddresses.recall === "session-entry-id-range" && (value.budget === void 0 || isCompactionBudgetDetails(value.budget)) && typeof value.timestamp === "string";
};
var fabricCompactionVersion = (details) => {
  if (!isRecord2(details) || details.compactor !== "fabric") return void 0;
  if (details.version === 1 && isFabricV1Details(details)) return 1;
  if (details.version === 2 && isFabricV2Details(details)) return 2;
  return void 0;
};
var cumulativeSource = (branchEntries, firstKeptEntryId) => {
  const boundaryIndex = firstKeptEntryId ? branchEntries.findIndex((entry) => entry.id === firstKeptEntryId) : branchEntries.length;
  const prefix = branchEntries.slice(0, boundaryIndex >= 0 ? boundaryIndex : branchEntries.length);
  const events = normalizeEntries(prefix);
  const contentEntryIds = new Set(events.map((event) => event.sourceEntryId));
  const entries = prefix.filter((entry) => contentEntryIds.has(entry.id));
  return {
    entries,
    prefixEntries: prefix,
    events,
    range: {
      first: entries[0]?.id ?? "",
      last: entries.at(-1)?.id ?? ""
    },
    timestamp: entries.at(-1)?.timestamp ?? ""
  };
};
var priorFabricVersions = (entries) => {
  let v1 = 0;
  let v2 = 0;
  for (const entry of entries) {
    if (entry.type !== "compaction") continue;
    const version = fabricCompactionVersion(entry.details);
    if (version === 1) v1 += 1;
    if (version === 2) v2 += 1;
  }
  return { v1, v2 };
};
var compileFabricSummary = (branchEntries, tokensBefore, enrichers = NO_BUILTIN_ENRICHERS, customInstructions, budget) => {
  const instructions = decodeCompactionInstructions(customInstructions);
  if (!instructions.ok) {
    return {
      cancel: true,
      reason: `fabric: ${instructions.error.code}: ${instructions.error.message}`,
      instructionError: instructions.error
    };
  }
  const cut = computeCut(
    branchEntries,
    budget ? { tokensBefore, budget } : void 0
  );
  if (!cut.ok) return { cancel: true, reason: "fabric: nothing to compact" };
  const source = cumulativeSource(branchEntries, cut.firstKeptEntryId);
  if (source.events.length === 0) return { cancel: true, reason: "fabric: no raw cumulative source" };
  const projected = projectWithMetadata(source.events);
  const sections = projected.sections;
  runEnrichers(enrichers, source.events, sections);
  const summary = renderSummary(sections, {
    firstEntryId: source.range.first,
    lastEntryId: source.range.last,
    lastTimestamp: source.timestamp,
    requestLines: instructions.requestLines
  });
  const projectedTokensAfter = cut.budget ? Math.ceil(
    cut.budget.fixedOverheadTokens + (cut.budget.retainedRawTokens + Math.ceil(summary.length / 4)) * cut.budget.tokenScale
  ) : void 0;
  const budgetDetails = cut.budget && projectedTokensAfter !== void 0 ? { ...cut.budget, projectedTokensAfter } : void 0;
  if (budgetDetails && budgetDetails.projectedTokensAfter > budgetDetails.targetContextTokens) {
    return {
      cancel: true,
      reason: "fabric: no deterministic summary fits the continuity context target"
    };
  }
  const versions = priorFabricVersions(branchEntries);
  const sectionHeaders = SECTION_HEADERS2.filter(({ key }) => sections[key].length > 0).map(({ header }) => header);
  if (instructions.requestLines.length > 0) sectionHeaders.splice(1, 0, "[Compaction Request]");
  const details = {
    compactor: "fabric",
    version: 2,
    sections: sectionHeaders,
    coverage: {
      cumulativeSourceRange: source.range,
      liveCutRange: {
        first: cut.firstSummarizedEntryId,
        last: cut.lastSummarizedEntryId
      }
    },
    counts: {
      branchEntries: branchEntries.length,
      cumulativeSourceEntries: source.entries.length,
      sourceEvents: source.events.length,
      liveCutEntries: cut.summarized.length,
      priorFabricV1: versions.v1,
      priorFabricV2: versions.v2
    },
    omittedCounts: {
      ...projected.omittedCounts,
      preserve: instructions.policy.omittedPreserveCount,
      // Thinking parts never survive normalization into a rendered summary;
      // the structural count keeps that erasure auditable against the raw
      // prefix instead of letting deliberation vanish untracked.
      thinking: countErasedThinkingBlocks(source.prefixEntries)
    },
    instructionPolicy: instructions.policy,
    stableAddresses: {
      firstKeptEntryId: cut.firstKeptEntryId,
      cumulativeSourceRange: source.range,
      recall: "session-entry-id-range"
    },
    ...budgetDetails ? { budget: budgetDetails } : {},
    timestamp: source.timestamp
  };
  return {
    compaction: {
      summary,
      firstKeptEntryId: cut.firstKeptEntryId,
      tokensBefore,
      details
    }
  };
};
var SECTION_HEADERS2 = [
  { key: "goal", header: "[Session Goal]" },
  { key: "files", header: "[Files And Changes]" },
  { key: "activity", header: "[Fabric Activity]" },
  { key: "outstanding", header: "[Outstanding Context]" },
  { key: "earlierTurns", header: "[Earlier Turns]" },
  { key: "status", header: "[Current Status]" }
];
var notifyInstructionError = (context, error) => {
  if (!context?.hasUI) return;
  context.ui.notify(clipUtf8(`Fabric compaction rejected: ${error.code}: ${error.message}`, 512), "error");
};
var registerCompactionHook = (pi, options) => {
  pi.on("session_before_compact", (event, context) => {
    if (event.customInstructions === "__pi_vcc__") return;
    const { preparation, branchEntries } = event;
    const contextWindow = context?.model?.contextWindow;
    const modelKey = modelCompactionKey(context?.model);
    const thresholdTokens = modelKey === void 0 ? void 0 : options.getThresholdTokens?.(modelKey);
    if (event.reason === "threshold" && typeof thresholdTokens === "number" && preparation.tokensBefore < thresholdTokens) {
      return { cancel: true };
    }
    const threshold = modelKey === void 0 || typeof thresholdTokens === "number" ? void 0 : options.getThresholdContextRatio?.(modelKey);
    if (event.reason === "threshold" && typeof threshold === "number" && typeof contextWindow === "number" && preparation.tokensBefore / contextWindow < threshold) {
      return { cancel: true };
    }
    if (options.getEngine() !== "fabric") return;
    const targetContextRatio = options.getTargetContextRatio?.();
    const settings = preparation.settings ?? DEFAULT_COMPACTION_SETTINGS;
    const tokensBefore = preparation.tokensBefore;
    const evidenceWindow = event.reason === "overflow" && typeof tokensBefore === "number" && Number.isFinite(tokensBefore) && tokensBefore > 0 ? Math.max(1, Math.floor(tokensBefore * OVERFLOW_WINDOW_EVIDENCE_RATIO)) : void 0;
    const advertisedWindow = typeof contextWindow === "number" && Number.isFinite(contextWindow) && contextWindow > 0 ? contextWindow : void 0;
    const effectiveWindow = evidenceWindow === void 0 ? advertisedWindow : advertisedWindow === void 0 ? evidenceWindow : Math.min(advertisedWindow, evidenceWindow);
    const budget = effectiveWindow !== void 0 && typeof targetContextRatio === "number" && Number.isFinite(targetContextRatio) ? {
      contextWindow: effectiveWindow,
      targetContextRatio,
      reserveTokens: settings.reserveTokens,
      keepRecentTokens: settings.keepRecentTokens
    } : void 0;
    const result = compileFabricSummary(
      branchEntries ?? [],
      preparation.tokensBefore,
      options.enrichers,
      event.customInstructions,
      budget
    );
    if ("cancel" in result) {
      if (result.instructionError) {
        notifyInstructionError(context, result.instructionError);
        return { cancel: true };
      }
      if (event._piVccOverriding) {
        return;
      }
      return { cancel: true };
    }
    event._fabricCompaction = true;
    return { compaction: result.compaction };
  });
  pi.on("session_before_tree", (event, context) => {
    if (options.getEngine() !== "fabric") return;
    const { preparation } = event;
    if (!preparation.userWantsSummary) return;
    if (preparation.replaceInstructions === true) return;
    const instructions = decodeCompactionInstructions(preparation.customInstructions);
    if (!instructions.ok) {
      notifyInstructionError(context, instructions.error);
      return { cancel: true };
    }
    const compiled = compileFabricBranchSummary(
      preparation.entriesToSummarize,
      preparation.customInstructions,
      options.enrichers,
      preparation.oldLeafId
    );
    if (!compiled) return;
    return { summary: compiled };
  });
};

export {
  compactAtConfiguredThreshold,
  MAX_COMPACTION_INSTRUCTIONS_CHARS,
  MAX_PRESERVE_ITEMS,
  MAX_PRESERVE_ITEM_CHARS,
  compactionRequestBoundsError,
  encodeCompactionRequest,
  normalizeRunDisplay,
  fabricExecTitleHintCached,
  rawContextTokens,
  computeCut,
  fabricCompactionVersion,
  compileFabricSummary,
  registerCompactionHook
};
//# sourceMappingURL=chunk-7B4MWJK4.js.map
