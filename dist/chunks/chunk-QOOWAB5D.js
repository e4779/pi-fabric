// src/actors/types.ts
var defineFabricActorPiHostEvents = (events) => events;
var FABRIC_ACTOR_PI_HOST_EVENTS = defineFabricActorPiHostEvents([
  "resources_discover",
  "session_start",
  "session_info_changed",
  "session_before_switch",
  "session_before_fork",
  "session_before_compact",
  "session_compact",
  "session_compact_failed",
  "session_shutdown",
  "session_before_tree",
  "session_tree",
  "input",
  "before_agent_start",
  "agent_start",
  "agent_end",
  "agent_settled",
  "turn_start",
  "turn_end",
  "message_start",
  "message_update",
  "message_end",
  "ui_prompt_start",
  "ui_prompt_end",
  "context",
  "before_provider_headers",
  "before_provider_request",
  "after_provider_response",
  "tool_execution_start",
  "tool_call",
  "tool_execution_update",
  "tool_result",
  "tool_execution_end",
  "model_select",
  "thinking_level_select",
  "user_bash"
]);
var FABRIC_ACTOR_HOST_EVENTS = [
  ...FABRIC_ACTOR_PI_HOST_EVENTS,
  "tool_error"
];
var FABRIC_ACTOR_HOST_EVENT_SET = new Set(FABRIC_ACTOR_HOST_EVENTS);
var isFabricActorHostEvent = (value) => typeof value === "string" && FABRIC_ACTOR_HOST_EVENT_SET.has(value);

// src/log-tail.ts
import fs from "node:fs";
var READ_CHUNK_BYTES = 64 * 1024;
var DEFAULT_READ_MAX_BYTES = 8 * 1024 * 1024;
var parseLine = (offset, raw) => {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { offset, raw };
  }
  return { offset, raw, parsed };
};
var completeLines = (buffer, bufferStart, fileEnd) => {
  const lines = [];
  let start = 0;
  let first = true;
  for (let index = 0; index < buffer.length; index++) {
    if (buffer[index] !== 10) continue;
    if (!first || bufferStart === 0) {
      const raw = buffer.subarray(start, index).toString("utf8").replace(/\r$/, "");
      if (raw) lines.push({ offset: bufferStart + start, raw });
    }
    first = false;
    start = index + 1;
  }
  if (fileEnd === bufferStart + buffer.length && start < buffer.length) {
    if (!first || bufferStart === 0) {
      const raw = buffer.subarray(start).toString("utf8").replace(/\r$/, "");
      if (raw) lines.push({ offset: bufferStart + start, raw });
    }
  }
  return lines;
};
var readJsonlPageFromDescriptor = (descriptor, limit, before, knownSize, maxBytes) => {
  try {
    const size = knownSize ?? fs.fstatSync(descriptor).size;
    const fileEnd = typeof before === "number" && Number.isSafeInteger(before) ? Math.max(0, Math.min(before, size)) : size;
    const boundedLimit = Math.max(1, Math.trunc(limit));
    const boundedBytes = Math.max(
      1,
      Math.trunc(maxBytes ?? DEFAULT_READ_MAX_BYTES)
    );
    const chunks = [];
    let bufferStart = fileEnd;
    let bufferedBytes = 0;
    let newlineCount = 0;
    while (bufferStart > 0 && newlineCount <= boundedLimit && bufferedBytes < boundedBytes) {
      const length = Math.min(READ_CHUNK_BYTES, bufferStart, boundedBytes - bufferedBytes);
      const chunkStart = bufferStart - length;
      const chunk = Buffer.allocUnsafe(length);
      const bytesRead = fs.readSync(descriptor, chunk, 0, length, chunkStart);
      if (bytesRead <= 0) break;
      const captured = chunk.subarray(0, bytesRead);
      chunks.push(captured);
      for (const byte of captured) {
        if (byte === 10) newlineCount += 1;
      }
      bufferedBytes += bytesRead;
      bufferStart = chunkStart;
    }
    const buffer = Buffer.concat(chunks.reverse(), bufferedBytes);
    const records = completeLines(buffer, bufferStart, fileEnd);
    const selected = records.slice(-boundedLimit);
    const hasMore = selected.length > 0 && (records.length > selected.length || bufferStart > 0);
    return {
      lines: selected.map((line) => parseLine(line.offset, line.raw)),
      hasMore,
      ...hasMore ? { before: selected[0].offset } : {}
    };
  } catch {
    return { lines: [], hasMore: false };
  }
};
var readJsonlPage = (filePath, limit, before, maxBytes) => {
  let descriptor;
  try {
    descriptor = fs.openSync(filePath, "r");
    return readJsonlPageFromDescriptor(descriptor, limit, before, void 0, maxBytes);
  } catch {
    return { lines: [], hasMore: false };
  } finally {
    if (descriptor !== void 0) {
      try {
        fs.closeSync(descriptor);
      } catch {
      }
    }
  }
};

export {
  FABRIC_ACTOR_PI_HOST_EVENTS,
  FABRIC_ACTOR_HOST_EVENTS,
  isFabricActorHostEvent,
  readJsonlPageFromDescriptor,
  readJsonlPage
};
//# sourceMappingURL=chunk-QOOWAB5D.js.map
