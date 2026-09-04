import {
  readJsonlPageFromDescriptor
} from "./chunk-QOOWAB5D.js";

// src/core/call-preview.ts
var HEADLINE_ARG_KEYS = [
  "task",
  "path",
  "query",
  "message",
  "search",
  "pattern",
  "command",
  "text",
  "prompt",
  "question",
  "input",
  "content",
  "expression",
  "url",
  "topic",
  "key",
  "filter",
  "name",
  "q"
];
var HEADLINE_SKIP_KEYS = /* @__PURE__ */ new Set([
  "label",
  "title",
  "type",
  "kind",
  "mode",
  "format",
  "resultFormat",
  "limit",
  "max",
  "offset",
  "start",
  "concurrency",
  "overwrite",
  "id",
  "provider",
  "namespace",
  "server",
  "tool",
  "ref",
  "recursive",
  "synthesize",
  "commandDigest"
]);
var cleanOneLine = (value, max) => {
  const single = value.replace(/\s+/g, " ").trim();
  if (!single) return "";
  return single.length <= max ? single : `${single.slice(0, Math.max(1, max - 1))}\u2026`;
};
var headlineArg = (args, max = 96) => {
  if (!args) return void 0;
  for (const key of HEADLINE_ARG_KEYS) {
    const value = args[key];
    if (typeof value === "string") {
      const cleaned = cleanOneLine(value, max);
      if (cleaned) return cleaned;
    }
  }
  for (const [key, value] of Object.entries(args)) {
    if (HEADLINE_SKIP_KEYS.has(key)) continue;
    if (typeof value === "string") {
      const cleaned = cleanOneLine(value, max);
      if (cleaned) return cleaned;
    }
  }
  return void 0;
};

// src/ui/preview-lines.ts
function countContentLines(content) {
  if (!content) return 0;
  let terminators = 0;
  for (let index = 0; index < content.length; index++) {
    const code = content.charCodeAt(index);
    if (code === 13) {
      terminators++;
      if (content.charCodeAt(index + 1) === 10) index++;
    } else if (code === 10) {
      terminators++;
    }
  }
  const finalCode = content.charCodeAt(content.length - 1);
  return terminators + (finalCode === 10 || finalCode === 13 ? 0 : 1);
}
function selectPreviewTextLines(text, limit) {
  if (!Number.isInteger(limit)) {
    const lines = collectPreviewTextLines(text);
    return { ...selectPreviewLines(lines, limit), total: lines.length };
  }
  const entries = [];
  const split = limit >= 8;
  const head = split ? Math.ceil(limit * 0.65) : limit;
  const tailLimit = split ? Math.max(1, limit - head - 1) : 0;
  const tail = [];
  let tailSize = 0;
  let tailCursor = 0;
  let total = 0;
  forEachPreviewTextLine(text, (line, index) => {
    total++;
    if (limit <= 0 || index < limit) entries.push({ kind: "line", line, index });
    if (!split || index < head) return;
    tail[tailCursor] = line;
    if (++tailCursor === tailLimit) tailCursor = 0;
    if (tailSize < tailLimit) tailSize++;
  });
  if (limit <= 0 || total <= limit) return { entries, shown: total, hidden: 0, total };
  if (!split) return { entries, shown: limit, hidden: total - limit, total };
  const hidden = total - head - tailLimit;
  const selected = entries.slice(0, head);
  selected.push({ kind: "hidden", hidden });
  let tailSlot = tailSize === tailLimit ? tailCursor : 0;
  for (let offset = 0; offset < tailSize; offset++) {
    const line = tail[tailSlot];
    if (line === void 0) throw new RangeError(`Missing preview tail line ${offset}`);
    selected.push({ kind: "line", line, index: total - tailSize + offset });
    if (++tailSlot === tailLimit) tailSlot = 0;
  }
  return { entries: selected, shown: head + tailLimit, hidden, total };
}
function selectPreviewLines(lines, limit) {
  if (lines.length <= limit || limit <= 0) {
    return {
      entries: lines.map((line, index) => ({ kind: "line", line, index })),
      shown: lines.length,
      hidden: 0
    };
  }
  if (limit < 8) {
    return {
      entries: lines.slice(0, limit).map((line, index) => ({ kind: "line", line, index })),
      shown: limit,
      hidden: lines.length - limit
    };
  }
  const head = Math.ceil(limit * 0.65);
  const tail = Math.max(1, limit - head - 1);
  const hidden = lines.length - head - tail;
  return {
    entries: [
      ...lines.slice(0, head).map((line, index) => ({ kind: "line", line, index })),
      { kind: "hidden", hidden },
      ...lines.slice(-tail).map((line, offset) => ({
        kind: "line",
        line,
        index: lines.length - tail + offset
      }))
    ],
    shown: head + tail,
    hidden
  };
}
function collectPreviewTextLines(text) {
  const lines = [];
  forEachPreviewTextLine(text, (line) => lines.push(line));
  return lines;
}
function forEachPreviewTextLine(text, callback) {
  let index = 0;
  let pendingEmpty = 0;
  forEachRawTextLine(text, (line) => {
    if (line === "") {
      pendingEmpty++;
      return;
    }
    while (pendingEmpty > 0) {
      callback("", index++);
      pendingEmpty--;
    }
    callback(line, index++);
  });
  if (index === 0 && pendingEmpty > 0 && text.length > 0) callback("", index);
}
function forEachRawTextLine(text, callback) {
  let start = 0;
  while (start <= text.length) {
    const newline = text.indexOf("\n", start);
    if (newline < 0) {
      callback(text.slice(start));
      break;
    }
    callback(text.slice(start, newline));
    start = newline + 1;
  }
}

// src/providers/write-diff-limits.ts
var configuredMaxBytes = Number.parseInt(
  process.env.CODE_PREVIEW_MAX_WRITE_DIFF_BYTES ?? "",
  10
);
var MAX_WRITE_DIFF_BYTES = Number.isFinite(configuredMaxBytes) && configuredMaxBytes > 0 ? configuredMaxBytes : 2e5;
var configuredMaxChangedLineCells = Number.parseInt(
  process.env.CODE_PREVIEW_MAX_WRITE_DIFF_CHANGED_LINE_CELLS ?? "",
  10
);
var MAX_WRITE_DIFF_CHANGED_LINE_CELLS = Number.isFinite(configuredMaxChangedLineCells) && configuredMaxChangedLineCells > 0 ? configuredMaxChangedLineCells : 1e6;
var writeContentForPreview = (content) => Buffer.byteLength(content, "utf8") <= MAX_WRITE_DIFF_BYTES ? content : void 0;
var shouldSkipWriteDiffBytes = (...texts) => {
  let total = 0;
  for (const text of texts) {
    total += Buffer.byteLength(text, "utf8");
    if (total > MAX_WRITE_DIFF_BYTES) return true;
  }
  return false;
};
var shouldSkipWriteDiffComplexity = (before, after) => {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const sharedLimit = Math.min(beforeLines.length, afterLines.length);
  let prefix = 0;
  while (prefix < sharedLimit && beforeLines[prefix] === afterLines[prefix]) prefix++;
  let suffix = 0;
  const suffixLimit = sharedLimit - prefix;
  while (suffix < suffixLimit && beforeLines[beforeLines.length - suffix - 1] === afterLines[afterLines.length - suffix - 1]) {
    suffix++;
  }
  const changedBefore = beforeLines.length - prefix - suffix;
  const changedAfter = afterLines.length - prefix - suffix;
  return changedBefore * changedAfter > MAX_WRITE_DIFF_CHANGED_LINE_CELLS;
};

// src/ui/transcript-reader.ts
import fs from "node:fs";

// src/ui/transcript-sanitization.ts
var MAX_TOOL_SUMMARY_CHARS = 500;
var MAX_ENCODED_STRING_CHARS = 160;
var MAX_TRANSCRIPT_VALUE_CHARS = 4e4;
var MAX_TRANSCRIPT_STRING_CHARS = 12e3;
var MAX_TRANSCRIPT_VALUE_NODES = 400;
var secretKey = /authorization|api[-_]?key|token|password|secret|cookie|credential|private[-_]?key/i;
var recordOf = (value) => typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
var terminalSafe = (value, trim = true) => {
  const safe = value.replace(/\x1b\][^\x07]*(?:\x07|\x1b\\)/g, "").replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "").replace(/[\u202a-\u202e\u2066-\u2069\u200e\u200f]/gi, "").replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, " ").replace(/\r\n?/g, "\n");
  return trim ? safe.trim() : safe;
};
var graphemeSegmenter = Intl.Segmenter ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : void 0;
var graphemes = (value) => graphemeSegmenter ? [...graphemeSegmenter.segment(value)].map((entry) => entry.segment) : Array.from(value);
var clip = (value, max, trim = true) => {
  const normalized = terminalSafe(value, trim);
  if (normalized.length <= max) return normalized;
  const parts = graphemes(normalized);
  if (parts.length <= max) return normalized;
  const tail = Math.min(1e3, Math.floor(max * 0.25));
  return `${parts.slice(0, max - tail - 2).join("")}\u2026
${parts.slice(-tail).join("")}`;
};
var contentText = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map((part) => {
      const record2 = recordOf(part);
      return record2?.type === "text" && typeof record2.text === "string" ? record2.text : "";
    }).filter(Boolean).join("");
  }
  const record = recordOf(value);
  if (!record) return "";
  if (typeof record.text === "string") return record.text;
  if (record.content !== void 0) return contentText(record.content);
  return "";
};
var messageError = (message) => {
  if (message.role !== "assistant" || message.stopReason !== "error") return "";
  const details = [];
  if (typeof message.errorMessage === "string") details.push(message.errorMessage);
  else if (typeof message.error === "string") details.push(message.error);
  if (Array.isArray(message.diagnostics)) {
    for (const value of message.diagnostics) {
      const diagnostic = recordOf(value);
      const nested = recordOf(diagnostic?.error);
      const detail = typeof nested?.message === "string" ? nested.message : typeof diagnostic?.message === "string" ? diagnostic.message : void 0;
      if (detail) details.push(detail);
    }
  }
  return clip([...new Set(details)].join(" \xB7 ") || "Agent response failed", MAX_TOOL_SUMMARY_CHARS);
};
var redactInlineSecrets = (value) => value.replace(/\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi, "Bearer [redacted]").replace(/\bBasic\s+[A-Za-z0-9+/=]{8,}/gi, "Basic [redacted]").replace(/\b(?:sk|pk|ghp|github_pat|xox[baprs])[-_][A-Za-z0-9_-]{12,}\b/g, "[redacted]").replace(
  /\b(Authorization|Proxy-Authorization|Cookie|Set-Cookie|X-Api-Key)\s*:\s*[^\r\n;]+/gi,
  "$1: [redacted]"
).replace(
  /\b([A-Z0-9_]*(?:PASSWORD|PASSWD|TOKEN|SECRET|API_KEY|ACCESS_KEY|PRIVATE_KEY|CREDENTIAL|COOKIE)[A-Z0-9_]*)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s;&|]+)/gi,
  "$1=[redacted]"
).replace(
  /(--?(?:password|passwd|token|secret|api[-_]?key|access[-_]?key|credential|cookie))(?:=|\s+)(?:"[^"]*"|'[^']*'|[^\s;&|]+)/gi,
  "$1=[redacted]"
).replace(/(https?:\/\/)[^\s/:@]+:[^\s/@]+@/gi, "$1[redacted]@");
var redact = (value, key = "", depth = 0, budget = {
  chars: MAX_TRANSCRIPT_VALUE_CHARS,
  nodes: MAX_TRANSCRIPT_VALUE_NODES
}) => {
  if (secretKey.test(key)) return "[redacted]";
  if (depth > 12) return "[nested value]";
  if (budget.nodes <= 0) return "[value omitted]";
  budget.nodes--;
  if (typeof value === "string") {
    const safe = terminalSafe(value, false);
    if (safe.length >= MAX_ENCODED_STRING_CHARS && /^[A-Za-z0-9+/=_-]+$/.test(safe)) {
      return `[large encoded value \xB7 ${safe.length} chars]`;
    }
    const available = Math.max(0, Math.min(MAX_TRANSCRIPT_STRING_CHARS, budget.chars));
    if (available === 0) return "[text omitted]";
    const hidden = redactInlineSecrets(clip(safe, available, false));
    budget.chars = Math.max(0, budget.chars - hidden.length);
    return hidden;
  }
  if (Array.isArray(value)) {
    const entries2 = [];
    for (const entry of value) {
      if (budget.nodes <= 0) {
        entries2.push(`[${value.length - entries2.length} entries omitted]`);
        break;
      }
      entries2.push(redact(entry, key, depth + 1, budget));
    }
    return entries2;
  }
  const record = recordOf(value);
  if (!record) return value;
  const entries = Object.entries(record);
  const redacted = {};
  for (let index = 0; index < entries.length; index++) {
    if (budget.nodes <= 0) {
      redacted["\u2026"] = `[${entries.length - index} fields omitted]`;
      break;
    }
    const [name, entry] = entries[index];
    redacted[name] = redact(entry, name, depth + 1, budget);
  }
  return redacted;
};
var redactRecord = (value) => {
  const record = recordOf(value);
  if (!record) return void 0;
  return recordOf(redact(record));
};
var compactRedactedValue = (value) => {
  try {
    return clip(JSON.stringify(value).replace(/\s+/g, " "), MAX_TOOL_SUMMARY_CHARS);
  } catch {
    return clip(String(value ?? "").replace(/\s+/g, " "), MAX_TOOL_SUMMARY_CHARS);
  }
};

// src/ui/transcript-parser.ts
var MAX_TOOL_SUMMARY_CHARS2 = 500;
var MAX_TRANSCRIPT_MESSAGE_CHARS = 4e4;
var TRANSCRIPT_ENTRY_LIMIT = 80;
var TranscriptAccumulator = class {
  entries = [];
  #tools = /* @__PURE__ */ new Map();
  #anonymousTools = /* @__PURE__ */ new Map();
  #activeTools = [];
  #assistant;
  #retry;
  #compaction;
  #sequence = 0;
  append(events) {
    for (const event of events) this.#append(event);
  }
  snapshot(olderAvailable = false, updatedAt, maxEntries = TRANSCRIPT_ENTRY_LIMIT) {
    const entries = maxEntries > 0 && this.entries.length > maxEntries ? this.entries.slice(-maxEntries) : this.entries;
    const omitted = entries.length < this.entries.length;
    return {
      entries: entries.map((entry) => ({ ...entry })),
      truncated: olderAvailable || omitted,
      hasMore: olderAvailable || omitted,
      ...updatedAt !== void 0 ? { updatedAt } : {}
    };
  }
  #nextId(event, prefix = "event") {
    if (typeof event.toolCallId === "string") return event.toolCallId;
    if (typeof event.uuid === "string") return event.uuid;
    if (typeof event.id === "string") return event.id;
    return `${prefix}-${this.#sequence++}`;
  }
  #finishAssistant(status) {
    if (!this.#assistant) return;
    this.#assistant.status = status;
    this.#assistant = void 0;
  }
  #pushMessage(kind, id, text, status = "completed", label = kind === "assistant" ? "Agent" : "User") {
    const safe = clip(text, MAX_TRANSCRIPT_MESSAGE_CHARS);
    if (!safe) return;
    this.entries.push({ id, kind, label, text: safe, status });
  }
  #toolParent(id) {
    if (!id.startsWith("fabric_")) return void 0;
    for (let index = this.#activeTools.length - 1; index >= 0; index--) {
      const candidate = this.#activeTools[index];
      if (candidate?.toolName === "fabric_exec" && candidate.status === "running") return candidate;
    }
    return void 0;
  }
  #startTool(id, label, args) {
    const existing = this.#tools.get(id);
    const safeArgs = args === void 0 ? void 0 : redactRecord(args);
    if (existing) {
      if (safeArgs !== void 0) existing.args = safeArgs;
      if (args !== void 0) existing.text = compactRedactedValue(safeArgs ?? redact(args));
      return existing;
    }
    const parent = this.#toolParent(id);
    const safeLabel = terminalSafe(label) || "tool";
    const entry = {
      id,
      kind: "tool",
      label: safeLabel,
      toolName: safeLabel,
      status: "running",
      ...safeArgs !== void 0 ? { args: safeArgs } : {},
      ...args !== void 0 ? { text: compactRedactedValue(safeArgs ?? redact(args)) } : {},
      ...parent ? { parentId: parent.id, depth: (parent.depth ?? 0) + 1 } : {}
    };
    this.entries.push(entry);
    this.#tools.set(id, entry);
    this.#activeTools.push(entry);
    return entry;
  }
  #finishTool(id, label, result, failed) {
    const safeLabel = terminalSafe(label) || "tool";
    const anonymous = this.#anonymousTools.get(safeLabel);
    const entry = id ? this.#tools.get(id) : anonymous?.shift();
    if (anonymous?.length === 0) this.#anonymousTools.delete(safeLabel);
    const safeResult = result === void 0 ? void 0 : redact(result);
    if (entry) {
      entry.status = failed ? "failed" : "completed";
      if (safeResult !== void 0) entry.result = safeResult;
      if (failed && result !== void 0) {
        const failure = compactRedactedValue(safeResult);
        entry.text = clip(
          `${entry.text ? `${entry.text} \xB7 ` : ""}error: ${failure}`,
          MAX_TOOL_SUMMARY_CHARS2
        );
      }
      this.#tools.delete(entry.id);
      const activeIndex = this.#activeTools.indexOf(entry);
      if (activeIndex >= 0) this.#activeTools.splice(activeIndex, 1);
      return;
    }
    this.entries.push({
      id: id ?? `tool-${this.#sequence++}`,
      kind: "tool",
      label: safeLabel,
      toolName: safeLabel,
      status: failed ? "failed" : "completed",
      ...safeResult !== void 0 ? { result: safeResult } : {},
      ...failed && safeResult !== void 0 ? { text: compactRedactedValue(safeResult) } : {}
    });
  }
  #appendSessionMessage(event, message) {
    const id = this.#nextId(event, "message");
    if (message.role === "user") {
      this.#pushMessage("user", id, contentText(message.content));
      return;
    }
    if (message.role === "assistant") {
      const error = messageError(message);
      const text = contentText(message.content);
      if (text) this.#pushMessage("assistant", id, text, error ? "failed" : "completed");
      if (error) {
        this.entries.push({
          id: `${id}-error`,
          kind: "error",
          label: "Agent error",
          text: error,
          status: "failed"
        });
      }
      if (Array.isArray(message.content)) {
        for (const value of message.content) {
          const part = recordOf(value);
          if (part?.type !== "toolCall" || typeof part.name !== "string") continue;
          const toolId = typeof part.id === "string" ? part.id : `session-tool-${this.#sequence++}`;
          this.#startTool(toolId, part.name, part.arguments);
        }
      }
      return;
    }
    if (message.role === "toolResult") {
      const toolId = typeof message.toolCallId === "string" ? message.toolCallId : void 0;
      const label = typeof message.toolName === "string" ? message.toolName : "tool";
      this.#finishTool(
        toolId,
        label,
        { content: message.content, ...message.details !== void 0 ? { details: message.details } : {} },
        message.isError === true
      );
    }
  }
  #append(event) {
    if (typeof event.type !== "string") return;
    const id = this.#nextId(event);
    if (event.type === "message") {
      const message = recordOf(event.message);
      if (message) this.#appendSessionMessage(event, message);
      return;
    }
    if (event.type === "model_change") {
      const provider = typeof event.provider === "string" ? event.provider : "";
      const model = typeof event.modelId === "string" ? event.modelId : "";
      this.entries.push({
        id,
        kind: "status",
        label: "Model changed",
        ...provider || model ? { text: [provider, model].filter(Boolean).join("/") } : {},
        status: "completed"
      });
      return;
    }
    if (event.type === "thinking_level_change") {
      this.entries.push({
        id,
        kind: "status",
        label: "Thinking changed",
        ...typeof event.thinkingLevel === "string" ? { text: event.thinkingLevel } : {},
        status: "completed"
      });
      return;
    }
    if (event.type === "compaction") {
      this.entries.push({
        id,
        kind: "status",
        label: "Compacted context",
        ...typeof event.summary === "string" ? { text: terminalSafe(event.summary) } : {},
        status: "completed"
      });
      return;
    }
    if (event.type === "stream_event") {
      const stream = recordOf(event.event);
      const delta = recordOf(stream?.delta);
      if (stream?.type === "content_block_delta" && delta?.type === "text_delta") {
        const text = typeof delta.text === "string" ? terminalSafe(delta.text, false) : "";
        if (!text) return;
        if (!this.#assistant) {
          this.#assistant = {
            id,
            kind: "assistant",
            label: "Claude",
            text: clip(text, MAX_TRANSCRIPT_MESSAGE_CHARS, false),
            status: "running"
          };
          this.entries.push(this.#assistant);
        } else {
          this.#assistant.text = clip(
            `${this.#assistant.text ?? ""}${text}`,
            MAX_TRANSCRIPT_MESSAGE_CHARS,
            false
          );
        }
      }
      return;
    }
    if (event.type === "assistant") {
      const message = recordOf(event.message);
      if (!message || message.role !== "assistant") return;
      if (Array.isArray(message.content)) {
        for (const value of message.content) {
          const part = recordOf(value);
          if (part?.type !== "tool_use") continue;
          const toolId = typeof part.id === "string" ? part.id : `claude-tool-${this.#sequence++}`;
          const label = typeof part.name === "string" ? part.name : "tool";
          this.#startTool(toolId, label, part.input);
        }
      }
      const text = terminalSafe(contentText(message.content));
      if (text) {
        if (this.#assistant) {
          this.#assistant.text = clip(text, MAX_TRANSCRIPT_MESSAGE_CHARS);
          this.#finishAssistant("completed");
        } else {
          this.#pushMessage("assistant", id, text, "completed", "Claude");
        }
      }
      if (typeof event.error === "string") {
        this.entries.push({
          id: `${id}-error`,
          kind: "error",
          label: "Claude error",
          text: clip(event.error, MAX_TOOL_SUMMARY_CHARS2),
          status: "failed"
        });
      }
      return;
    }
    if (event.type === "user") {
      const message = recordOf(event.message);
      if (!message || !Array.isArray(message.content)) return;
      let hasToolResult = false;
      for (const value of message.content) {
        const part = recordOf(value);
        if (part?.type !== "tool_result" || typeof part.tool_use_id !== "string") continue;
        hasToolResult = true;
        this.#finishTool(part.tool_use_id, "tool", part.content, part.is_error === true);
      }
      if (!hasToolResult) this.#pushMessage("user", id, contentText(message.content));
      return;
    }
    if (event.type === "result") {
      this.#finishAssistant(event.is_error === true ? "failed" : "completed");
      if (event.is_error === true || event.subtype !== "success") {
        const errors = Array.isArray(event.errors) ? event.errors.filter((value) => typeof value === "string").join(" \xB7 ") : "";
        const text = errors || (typeof event.result === "string" ? event.result : "Claude run failed");
        this.entries.push({
          id,
          kind: "error",
          label: "Claude result",
          text: clip(text, MAX_TOOL_SUMMARY_CHARS2),
          status: "failed"
        });
      }
      return;
    }
    if (event.type === "system" && event.subtype === "api_retry") {
      this.entries.push({
        id,
        kind: "status",
        label: "Claude API retry",
        status: "running",
        ...typeof event.error === "string" ? { text: clip(event.error, MAX_TOOL_SUMMARY_CHARS2) } : {}
      });
      return;
    }
    if (event.type === "message_start") this.#finishAssistant("completed");
    if (event.type === "message_start" || event.type === "message_update") {
      const message = recordOf(event.message);
      if (!message) return;
      if (message.role === "user") {
        if (event.type === "message_start") this.#pushMessage("user", id, contentText(message.content));
        return;
      }
      if (message.role !== "assistant") return;
      const text = terminalSafe(contentText(message.content));
      if (!text) return;
      if (!this.#assistant) {
        this.#assistant = {
          id,
          kind: "assistant",
          label: "Agent",
          text: clip(text, MAX_TRANSCRIPT_MESSAGE_CHARS),
          status: "running"
        };
        this.entries.push(this.#assistant);
      } else {
        this.#assistant.text = clip(text, MAX_TRANSCRIPT_MESSAGE_CHARS);
        if (!this.entries.includes(this.#assistant)) this.entries.push(this.#assistant);
      }
      return;
    }
    if (event.type === "message_end") {
      const message = recordOf(event.message);
      if (!message) return;
      if (message.role === "user") {
        this.#pushMessage("user", id, contentText(message.content));
        return;
      }
      if (message.role !== "assistant") return;
      const error = messageError(message);
      if (error) {
        this.#finishAssistant("failed");
        this.entries.push({ id, kind: "error", label: "Agent error", text: error, status: "failed" });
        return;
      }
      const text = terminalSafe(contentText(message.content));
      if (!text) {
        this.#finishAssistant("completed");
        return;
      }
      if (!this.#assistant) this.#pushMessage("assistant", id, text);
      else {
        this.#assistant.text = clip(text, MAX_TRANSCRIPT_MESSAGE_CHARS);
        this.#finishAssistant("completed");
      }
      return;
    }
    if (event.type === "response" && event.command === "prompt" && event.success === false) {
      const text = typeof event.error === "string" ? event.error : "Pi rejected the prompt";
      this.entries.push({
        id,
        kind: "error",
        label: "Prompt rejected",
        text: clip(text, MAX_TOOL_SUMMARY_CHARS2),
        status: "failed"
      });
      return;
    }
    if (event.type === "tool_execution_start") {
      const label = typeof event.toolName === "string" ? event.toolName : "tool";
      const entry = this.#startTool(id, label, event.args);
      if (typeof event.toolCallId !== "string") {
        const key = terminalSafe(label) || "tool";
        this.#tools.delete(entry.id);
        this.#anonymousTools.set(key, [...this.#anonymousTools.get(key) ?? [], entry]);
      }
      return;
    }
    if (event.type === "tool_execution_end") {
      const label = typeof event.toolName === "string" ? event.toolName : "tool";
      this.#finishTool(
        typeof event.toolCallId === "string" ? event.toolCallId : void 0,
        label,
        event.result,
        event.isError === true
      );
      return;
    }
    if (event.type === "auto_retry_start") {
      const attempt = typeof event.attempt === "number" ? ` ${event.attempt}` : "";
      this.#retry = {
        id,
        kind: "status",
        label: `Retry${attempt}`,
        status: "running",
        ...typeof event.errorMessage === "string" ? { text: clip(event.errorMessage, MAX_TOOL_SUMMARY_CHARS2) } : {}
      };
      this.entries.push(this.#retry);
      return;
    }
    if (event.type === "auto_retry_end") {
      const failed = event.success === false;
      if (this.#retry) {
        this.#retry.status = failed ? "failed" : "completed";
        if (failed && typeof event.finalError === "string") {
          this.#retry.text = clip(event.finalError, MAX_TOOL_SUMMARY_CHARS2);
        }
        this.#retry = void 0;
      }
      return;
    }
    if (event.type === "compaction_start") {
      this.#compaction = {
        id,
        kind: "status",
        label: "Compacting context",
        status: "running"
      };
      this.entries.push(this.#compaction);
      return;
    }
    if (event.type === "compaction_end") {
      if (this.#compaction) {
        const failed = event.aborted === true || typeof event.errorMessage === "string";
        this.#compaction.status = failed ? "failed" : "completed";
        if (typeof event.errorMessage === "string") {
          this.#compaction.text = clip(event.errorMessage, MAX_TOOL_SUMMARY_CHARS2);
        }
        this.#compaction = void 0;
      }
      return;
    }
    if (event.type === "extension_error" || event.type === "worker_stderr") {
      const text = typeof event.error === "string" ? event.error : typeof event.text === "string" ? event.text : "Extension error";
      this.entries.push({
        id,
        kind: "error",
        label: event.type === "worker_stderr" ? "Worker stderr" : "Error",
        text: clip(text, MAX_TOOL_SUMMARY_CHARS2),
        status: "failed"
      });
    }
  }
};
var parseRaw = (raw) => {
  try {
    return recordOf(JSON.parse(raw));
  } catch {
    return void 0;
  }
};
var parsedEvents = (lines) => lines.map((line) => recordOf(line.parsed) ?? parseRaw(line.raw)).filter((event) => event !== void 0);
var normalizedToolStarts = (event) => {
  if (event.type === "tool_execution_start" && typeof event.toolCallId === "string") {
    return [{ id: event.toolCallId, event }];
  }
  const starts = [];
  const appendContentStarts = (content, type) => {
    if (!Array.isArray(content)) return;
    for (const value of content) {
      const part = recordOf(value);
      if (part?.type !== type || typeof part.id !== "string") continue;
      const name = typeof part.name === "string" ? part.name : "tool";
      starts.push({
        id: part.id,
        event: {
          type: "tool_execution_start",
          toolCallId: part.id,
          toolName: name,
          args: type === "toolCall" ? part.arguments : part.input
        }
      });
    }
  };
  if (event.type === "message") {
    const message = recordOf(event.message);
    if (message?.role === "assistant") appendContentStarts(message.content, "toolCall");
  } else if (event.type === "assistant") {
    const message = recordOf(event.message);
    if (message?.role === "assistant") appendContentStarts(message.content, "tool_use");
  }
  return starts;
};
var toolLifecycleEndIds = (event) => {
  if (event.type === "tool_execution_end" && typeof event.toolCallId === "string") {
    return [event.toolCallId];
  }
  if (event.type === "message") {
    const message2 = recordOf(event.message);
    return message2?.role === "toolResult" && typeof message2.toolCallId === "string" ? [message2.toolCallId] : [];
  }
  if (event.type !== "user") return [];
  const message = recordOf(event.message);
  if (!Array.isArray(message?.content)) return [];
  return message.content.flatMap((value) => {
    const part = recordOf(value);
    return part?.type === "tool_result" && typeof part.tool_use_id === "string" ? [part.tool_use_id] : [];
  });
};
var missingToolStartIds = (events) => {
  const active = /* @__PURE__ */ new Set();
  const missing = /* @__PURE__ */ new Set();
  for (const event of events) {
    for (const start of normalizedToolStarts(event)) active.add(start.id);
    for (const id of toolLifecycleEndIds(event)) {
      if (active.has(id)) active.delete(id);
      else missing.add(id);
    }
  }
  return missing;
};

// src/ui/transcript-reader.ts
var PAGE_LINES = 40;
var TOOL_LIFECYCLE_CONTEXT_LINES = PAGE_LINES * 4;
var MAX_PAGE_BYTES = 512 * 1024;
var MAX_CACHE_ENTRIES = 32;
var FORWARD_READ_CHUNK_BYTES = 64 * 1024;
var completeLogEnd = (descriptor, size, fallback = 0) => {
  if (size <= 0) return 0;
  const scanFloor = Math.max(0, size - MAX_PAGE_BYTES);
  let scanEnd = size;
  while (scanEnd > scanFloor) {
    const scanStart = Math.max(scanFloor, scanEnd - FORWARD_READ_CHUNK_BYTES);
    const chunk = Buffer.allocUnsafe(scanEnd - scanStart);
    const bytesRead = fs.readSync(descriptor, chunk, 0, chunk.length, scanStart);
    if (bytesRead <= 0) return 0;
    for (let index = bytesRead - 1; index >= 0; index--) {
      if (chunk[index] === 10) return scanStart + index + 1;
    }
    scanEnd = scanStart;
  }
  return Math.min(fallback, size);
};
var readForwardPage = (descriptor, start, end) => {
  const lines = [];
  const readLimit = Math.min(end, Math.max(0, start) + MAX_PAGE_BYTES);
  let readOffset = Math.max(0, start);
  let pending = Buffer.alloc(0);
  let pendingOffset = readOffset;
  let pageEnd = readOffset;
  while (readOffset < readLimit && lines.length < PAGE_LINES) {
    const chunkSize = Math.min(FORWARD_READ_CHUNK_BYTES, readLimit - readOffset);
    const chunk = Buffer.allocUnsafe(chunkSize);
    const bytesRead = fs.readSync(descriptor, chunk, 0, chunkSize, readOffset);
    if (bytesRead <= 0) break;
    const data = pending.length > 0 ? Buffer.concat([pending, chunk.subarray(0, bytesRead)]) : chunk.subarray(0, bytesRead);
    const dataOffset = pending.length > 0 ? pendingOffset : readOffset;
    let lineStart = 0;
    for (let index = 0; index < data.length; index++) {
      if (data[index] !== 10) continue;
      const raw = data.subarray(lineStart, index).toString("utf8").replace(/\r$/, "");
      pageEnd = dataOffset + index + 1;
      if (raw) {
        const offset = dataOffset + lineStart;
        const parsed = parseRaw(raw);
        lines.push({ offset, raw, ...parsed ? { parsed } : {} });
        if (lines.length >= PAGE_LINES) return { lines, end: pageEnd };
      }
      lineStart = index + 1;
    }
    pending = Buffer.from(data.subarray(lineStart));
    pendingOffset = dataOffset + lineStart;
    readOffset += bytesRead;
  }
  return { lines, end: readOffset >= end ? end : pageEnd };
};
var AgentTranscriptReader = class {
  #cache = /* @__PURE__ */ new Map();
  read(source, followLatest = true) {
    const filePath = source.logFile;
    if (!filePath) {
      return { entries: [], truncated: false, hasMore: false, hasNewer: false };
    }
    const cached = this.#cache.get(filePath);
    let descriptor;
    try {
      const noFollow = typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
      descriptor = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow);
      const stat = fs.fstatSync(descriptor);
      if (!stat.isFile()) {
        return cached?.transcript ?? {
          entries: [],
          truncated: false,
          hasMore: false,
          hasNewer: false
        };
      }
      const sameFile = cached?.device === stat.dev && cached.inode === stat.ino;
      const sameSizeRewrite = sameFile && cached.offset === stat.size && cached.modifiedAt !== stat.mtimeMs;
      let state;
      if (!cached || !sameFile || stat.size < cached.offset || sameSizeRewrite) {
        state = this.#latestState(descriptor, stat);
      } else if (stat.size !== cached.offset || stat.mtimeMs !== cached.modifiedAt) {
        const wasAtTail = cached.pageEnd >= cached.completeEnd;
        const completeEnd = completeLogEnd(descriptor, stat.size, cached.completeEnd);
        if (cached.pageEnd > completeEnd || followLatest && wasAtTail && completeEnd > cached.completeEnd) {
          state = this.#latestState(descriptor, stat, completeEnd);
        } else {
          state = {
            ...cached,
            modifiedAt: stat.mtimeMs,
            offset: stat.size,
            completeEnd,
            transcript: {
              ...cached.transcript,
              hasNewer: cached.pageEnd < completeEnd,
              updatedAt: stat.mtimeMs
            }
          };
        }
      } else {
        state = cached;
      }
      this.#remember(filePath, state);
      return state.transcript;
    } catch {
      return cached?.transcript ?? {
        entries: [],
        truncated: false,
        hasMore: false,
        hasNewer: false
      };
    } finally {
      if (descriptor !== void 0) {
        try {
          fs.closeSync(descriptor);
        } catch {
        }
      }
    }
  }
  loadOlder(source) {
    const filePath = source.logFile;
    if (!filePath) return false;
    this.read(source, false);
    const cached = this.#cache.get(filePath);
    if (!cached?.hasMore || cached.pageStart <= 0) return false;
    let descriptor;
    try {
      const noFollow = typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
      descriptor = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow);
      const stat = fs.fstatSync(descriptor);
      if (!stat.isFile() || stat.dev !== cached.device || stat.ino !== cached.inode) return false;
      const completeEnd = completeLogEnd(descriptor, stat.size, cached.completeEnd);
      const pageEnd = Math.min(cached.pageStart, completeEnd);
      const page = readJsonlPageFromDescriptor(
        descriptor,
        PAGE_LINES,
        pageEnd,
        stat.size,
        MAX_PAGE_BYTES
      );
      const pageStart = page.lines[0]?.offset;
      if (pageStart === void 0) return false;
      const state = this.#stateForPage(
        descriptor,
        stat,
        completeEnd,
        page.lines,
        pageStart,
        pageEnd,
        page.hasMore
      );
      this.#remember(filePath, state);
      return true;
    } catch {
      return false;
    } finally {
      if (descriptor !== void 0) {
        try {
          fs.closeSync(descriptor);
        } catch {
        }
      }
    }
  }
  loadNewer(source) {
    const filePath = source.logFile;
    if (!filePath) return false;
    this.read(source, false);
    const cached = this.#cache.get(filePath);
    if (!cached || cached.pageEnd >= cached.completeEnd) return false;
    let descriptor;
    try {
      const noFollow = typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
      descriptor = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow);
      const stat = fs.fstatSync(descriptor);
      if (!stat.isFile() || stat.dev !== cached.device || stat.ino !== cached.inode) return false;
      const completeEnd = completeLogEnd(descriptor, stat.size, cached.completeEnd);
      const page = readForwardPage(descriptor, cached.pageEnd, completeEnd);
      if (page.lines.length === 0 || page.end <= cached.pageEnd) return false;
      const state = this.#stateForPage(
        descriptor,
        stat,
        completeEnd,
        page.lines,
        cached.pageEnd,
        page.end,
        cached.pageEnd > 0
      );
      this.#remember(filePath, state);
      return true;
    } catch {
      return false;
    } finally {
      if (descriptor !== void 0) {
        try {
          fs.closeSync(descriptor);
        } catch {
        }
      }
    }
  }
  loadLatest(source) {
    const filePath = source.logFile;
    if (!filePath) return false;
    this.read(source, false);
    const cached = this.#cache.get(filePath);
    let descriptor;
    try {
      const noFollow = typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
      descriptor = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow);
      const stat = fs.fstatSync(descriptor);
      if (!stat.isFile()) return false;
      if (cached && (stat.dev !== cached.device || stat.ino !== cached.inode)) return false;
      const completeEnd = completeLogEnd(descriptor, stat.size, cached?.completeEnd ?? 0);
      const state = this.#latestState(descriptor, stat, completeEnd);
      this.#remember(filePath, state);
      return true;
    } catch {
      return false;
    } finally {
      if (descriptor !== void 0) {
        try {
          fs.closeSync(descriptor);
        } catch {
        }
      }
    }
  }
  clear() {
    this.#cache.clear();
  }
  #latestState(descriptor, stat, knownCompleteEnd) {
    const completeEnd = knownCompleteEnd ?? completeLogEnd(descriptor, stat.size);
    const page = readJsonlPageFromDescriptor(
      descriptor,
      PAGE_LINES,
      completeEnd,
      stat.size,
      MAX_PAGE_BYTES
    );
    return this.#stateForPage(
      descriptor,
      stat,
      completeEnd,
      page.lines,
      page.lines[0]?.offset ?? completeEnd,
      completeEnd,
      page.hasMore
    );
  }
  #stateForPage(descriptor, stat, completeEnd, lines, pageStart, pageEnd, hasMore) {
    const events = parsedEvents(lines);
    const missingStarts = missingToolStartIds(events);
    const lifecycleContext = [];
    if (missingStarts.size > 0 && pageStart > 0) {
      const contextPage = readJsonlPageFromDescriptor(
        descriptor,
        TOOL_LIFECYCLE_CONTEXT_LINES,
        pageStart,
        stat.size,
        MAX_PAGE_BYTES
      );
      const contextEvents = parsedEvents(contextPage.lines);
      for (let index = contextEvents.length - 1; index >= 0 && missingStarts.size > 0; index--) {
        const starts = normalizedToolStarts(contextEvents[index]);
        for (let startIndex = starts.length - 1; startIndex >= 0; startIndex--) {
          const start = starts[startIndex];
          if (!missingStarts.delete(start.id)) continue;
          lifecycleContext.unshift(start.event);
        }
      }
    }
    const accumulator = new TranscriptAccumulator();
    accumulator.append([...lifecycleContext, ...events]);
    const transcript = {
      ...accumulator.snapshot(hasMore, stat.mtimeMs, Number.MAX_SAFE_INTEGER),
      hasNewer: pageEnd < completeEnd
    };
    return {
      device: stat.dev,
      inode: stat.ino,
      modifiedAt: stat.mtimeMs,
      offset: stat.size,
      completeEnd,
      pageStart,
      pageEnd,
      hasMore: transcript.hasMore ?? false,
      transcript
    };
  }
  #remember(filePath, state) {
    this.#cache.delete(filePath);
    this.#cache.set(filePath, state);
    while (this.#cache.size > MAX_CACHE_ENTRIES) {
      const oldest = this.#cache.keys().next().value;
      if (!oldest) break;
      this.#cache.delete(oldest);
    }
  }
};

// src/ui/transcript.ts
var PREVIEW_TREE_GUARD_MAX_DEPTH = 8;
var isFabricAgentToolPreviewNode = (value, depth) => {
  const record = recordOf(value);
  if (!record || typeof record.id !== "string" || typeof record.name !== "string" || record.text !== void 0 && typeof record.text !== "string" || record.currentTool !== void 0 && typeof record.currentTool !== "string" || !Array.isArray(record.tools)) {
    return false;
  }
  if (record.agents === void 0) return true;
  if (depth >= PREVIEW_TREE_GUARD_MAX_DEPTH || !Array.isArray(record.agents)) return false;
  return record.agents.every((child) => isFabricAgentToolPreviewNode(child, depth + 1));
};
var isFabricAgentToolPreview = (value) => recordOf(value)?.kind === "fabric-agent-tools" && isFabricAgentToolPreviewNode(value, 0);
var recentTranscriptTools = (transcript, limit = 2) => {
  const tools = transcript.entries.filter((entry) => entry.kind === "tool");
  const boundedLimit = Math.max(1, limit);
  const running = tools.filter((entry) => entry.status === "running");
  const completed = tools.filter((entry) => entry.status !== "running");
  const completedSlots = Math.max(0, boundedLimit - Math.min(running.length, boundedLimit));
  const retained = /* @__PURE__ */ new Set([
    ...running.slice(-boundedLimit),
    ...completed.slice(-completedSlots)
  ]);
  return tools.filter((entry) => retained.has(entry)).slice(-boundedLimit).map((entry) => ({ ...entry }));
};

export {
  headlineArg,
  countContentLines,
  selectPreviewTextLines,
  MAX_WRITE_DIFF_BYTES,
  writeContentForPreview,
  shouldSkipWriteDiffBytes,
  shouldSkipWriteDiffComplexity,
  AgentTranscriptReader,
  isFabricAgentToolPreview,
  recentTranscriptTools
};
//# sourceMappingURL=chunk-MJNWCLRJ.js.map
