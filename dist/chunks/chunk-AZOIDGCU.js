// src/audit/projection.ts
var emptyProjection = (args) => ({
  value: {},
  droppedValues: topLevelKeyCount(args)
});
var topLevelKeyCount = (value) => {
  try {
    return Object.keys(value).length;
  } catch {
    return 1;
  }
};
var finiteNumber = (value) => typeof value === "number" && Number.isFinite(value) ? value : void 0;
var stringValue = (value) => typeof value === "string" ? value : void 0;
var isWindowsDrivePath = (value) => {
  if (value.length < 3 || value[1] !== ":" || value[2] !== "\\" && value[2] !== "/") {
    return false;
  }
  const drive = value.charCodeAt(0);
  return drive >= 65 && drive <= 90 || drive >= 97 && drive <= 122;
};
var localPath = (value) => {
  if (typeof value !== "string" || value.includes("\0")) return void 0;
  if (!isWindowsDrivePath(value)) {
    try {
      const absolute = new URL(value);
      if (absolute.protocol) return void 0;
    } catch {
    }
    try {
      const based = new URL(value, "https://fabric.invalid/");
      if (based.hostname !== "fabric.invalid") return void 0;
    } catch {
      return void 0;
    }
  }
  const query = value.indexOf("?");
  const fragment = value.indexOf("#");
  const end = Math.min(
    query < 0 ? value.length : query,
    fragment < 0 ? value.length : fragment
  );
  return value.slice(0, end) || void 0;
};
var copyString = (output, args, key) => {
  const value = stringValue(args[key]);
  if (value !== void 0) output[key] = value;
};
var copyNumber = (output, args, key) => {
  const value = finiteNumber(args[key]);
  if (value !== void 0) output[key] = value;
};
var structuralIdentifier = (value) => {
  if (typeof value !== "string" || value.length === 0) return void 0;
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    const alphanumeric = code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122;
    if (alphanumeric) continue;
    if (index > 0 && (code === 45 || code === 46 || code === 47 || code === 58 || code === 95)) {
      continue;
    }
    return void 0;
  }
  return value;
};
var copyIdentifier = (output, args, key) => {
  const value = structuralIdentifier(args[key]);
  if (value !== void 0) output[key] = value;
};
var copyPath = (output, args) => {
  const value = localPath(args.path);
  if (value !== void 0) output.path = value;
};
var projected = (args, build) => {
  const value = {};
  try {
    build(value);
  } catch {
    return emptyProjection(args);
  }
  return {
    value,
    droppedValues: Math.max(0, topLevelKeyCount(args) - Object.keys(value).length)
  };
};
var idOnlyAgentActions = /* @__PURE__ */ new Set([
  "agents.wait",
  "agents.status",
  "agents.stop",
  "agents.cleanup",
  "agents.ask",
  "agents.tell",
  "agents.steer",
  "agents.followUp",
  "agents.setSteeringMode",
  "agents.setFollowUpMode",
  "agents.compact",
  "agents.actorStatus",
  "agents.setModel",
  "agents.setThinking",
  "agents.setTools",
  "agents.setEvents",
  "agents.setDeliveryPolicy",
  "agents.clearMessages",
  "agents.setInstructions",
  "agents.messages",
  "agents.remove",
  "agents.import",
  "agents.export",
  "agents.log"
]);
var projectFabricAuditArgs = (ref, args) => {
  switch (ref) {
    case "fabric.discovery.providers":
    case "fabric.discovery.models":
    case "fabric.workflow.progress":
      return emptyProjection(args);
    case "fabric.approval.auto":
      return projected(args, (output) => {
        copyIdentifier(output, args, "action");
        copyIdentifier(output, args, "risk");
      });
    case "fabric.discovery.catalog":
      return projected(args, (output) => {
        copyIdentifier(output, args, "provider");
        copyNumber(output, args, "limit");
      });
    case "fabric.discovery.list":
      return projected(args, (output) => {
        copyIdentifier(output, args, "provider");
        copyIdentifier(output, args, "namespace");
        copyNumber(output, args, "limit");
      });
    case "fabric.discovery.search":
      return projected(args, (output) => copyNumber(output, args, "limit"));
    case "fabric.discovery.describe":
      return projected(args, (output) => copyIdentifier(output, args, "ref"));
    case "fabric.workflow.configure":
      return projected(args, (output) => copyString(output, args, "name"));
    case "agents.switchModel":
      return projected(args, (output) => {
        copyIdentifier(output, args, "model");
        copyIdentifier(output, args, "provider");
      });
    case "fabric.workflow.phase":
      return projected(args, (output) => {
        copyString(output, args, "name");
        copyIdentifier(output, args, "id");
        copyNumber(output, args, "total");
      });
    case "fabric.workflow.item":
      return projected(args, (output) => {
        copyIdentifier(output, args, "id");
        copyIdentifier(output, args, "status");
        copyIdentifier(output, args, "phase");
        copyIdentifier(output, args, "kind");
        copyNumber(output, args, "total");
        copyNumber(output, args, "completed");
      });
    case "fabric.workflow.event":
      return projected(args, (output) => copyIdentifier(output, args, "level"));
    case "fabric.workflow.parallel":
    case "fabric.workflow.pipeline":
      return projected(args, (output) => {
        copyIdentifier(output, args, "kind");
        copyNumber(output, args, "itemCount");
        copyNumber(output, args, "stageCount");
        copyNumber(output, args, "concurrency");
      });
    case "pi.read":
      return projected(args, (output) => {
        copyPath(output, args);
        copyNumber(output, args, "offset");
        copyNumber(output, args, "limit");
      });
    case "pi.grep":
      return projected(args, (output) => {
        copyPath(output, args);
        copyNumber(output, args, "context");
        copyNumber(output, args, "limit");
      });
    case "pi.find":
    case "pi.ls":
      return projected(args, (output) => {
        copyPath(output, args);
        copyNumber(output, args, "limit");
      });
    case "pi.edit":
    case "pi.write":
      return projected(args, (output) => copyPath(output, args));
    case "pi.bash":
      return projected(args, (output) => copyString(output, args, "command"));
    case "mesh.publish":
      return projected(args, (output) => {
        copyString(output, args, "topic");
        copyString(output, args, "to");
      });
    case "mesh.read":
      return projected(args, (output) => {
        copyString(output, args, "topic");
        copyString(output, args, "to");
        copyNumber(output, args, "after");
        copyNumber(output, args, "limit");
      });
    case "mesh.get":
    case "mesh.put":
    case "mesh.delete":
      return projected(args, (output) => copyString(output, args, "key"));
    case "mesh.list":
      return projected(args, (output) => {
        copyString(output, args, "prefix");
        copyNumber(output, args, "limit");
      });
    default:
      if (idOnlyAgentActions.has(ref)) {
        return projected(args, (output) => copyString(output, args, "id"));
      }
      return emptyProjection(args);
  }
};
var projectFabricAuditResult = (ref, result) => {
  if (typeof result !== "object" || result === null || Array.isArray(result)) {
    return void 0;
  }
  const record = result;
  if (ref === "fabric.approval.auto") {
    return projected(record, (output) => {
      copyIdentifier(output, record, "action");
      copyIdentifier(output, record, "risk");
      copyIdentifier(output, record, "decision");
      copyIdentifier(output, record, "model");
      copyNumber(output, record, "at");
    });
  }
  if (ref !== "pi.write") return void 0;
  const details = typeof record.details === "object" && record.details !== null && !Array.isArray(record.details) ? record.details : void 0;
  if (record.created !== true && details?.created !== true) return void 0;
  return {
    value: { created: true },
    droppedValues: Math.max(0, topLevelKeyCount(record) - 1)
  };
};

// src/audit/trace.ts
var FABRIC_EXECUTION_TRACE_KIND = "pi-fabric.execution";
var FABRIC_EXECUTION_TRACE_VERSION = 1;
var FABRIC_EXECUTION_TRACE_MAX_BYTES = 512 * 1024;
var MAX_IDENTIFIER_BYTES = 1024;
var MAX_PHASE_BYTES = 1024;
var MAX_STRING_BYTES = 16 * 1024;
var MAX_ERROR_BYTES = 8 * 1024;
var MAX_ARGS_BYTES = 64 * 1024;
var MAX_RESULT_BYTES = 64 * 1024;
var MAX_DEPTH = 12;
var MAX_KEYS = 128;
var MAX_ARRAY_ITEMS = 128;
var MAX_NODES = 8192;
var MAX_RECORDED_OPERATIONS = 2048;
var MAX_PHASES = 512;
var DROP = Symbol("drop");
var emptyCounts = () => ({
  droppedValues: 0,
  truncatedValues: 0,
  redactedValues: 0
});
var byteLength = (value) => Buffer.byteLength(value, "utf8");
var serializedBytes = (value) => byteLength(JSON.stringify(value));
var truncateUtf8 = (value, maxBytes) => {
  if (byteLength(value) <= maxBytes) return value;
  const suffix = "\u2026[truncated]";
  const available = Math.max(0, maxBytes - byteLength(suffix));
  let low = 0;
  let high = value.length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (byteLength(value.slice(0, middle)) <= available) low = middle;
    else high = middle - 1;
  }
  return `${value.slice(0, low)}${suffix}`;
};
var truncateUtf8Middle = (value, maxBytes) => {
  if (byteLength(value) <= maxBytes) return value;
  const marker = "\n\u2026[truncated]\n";
  const available = Math.max(0, maxBytes - byteLength(marker));
  const headBytes = Math.floor(available / 2);
  const tailBytes = available - headBytes;
  const head = truncateUtf8(value, headBytes + byteLength("\u2026[truncated]")).replace(/…\[truncated\]$/, "");
  let tailStart = value.length;
  while (tailStart > 0 && byteLength(value.slice(tailStart - 1)) <= tailBytes) tailStart--;
  return `${head}${marker}${value.slice(tailStart)}`;
};
var boundedIdentifier = (value, maxBytes = MAX_IDENTIFIER_BYTES) => truncateUtf8(value, maxBytes);
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
var isMediaKey = (key) => ["media", "image", "images", "audio", "video", "base64"].includes(normalizedKey(key));
var isMediaObject = (value) => {
  if (value.type === "image" || value.type === "audio" || value.type === "video") return true;
  const mimeType = value.mimeType ?? value.mime_type;
  return typeof mimeType === "string" && (mimeType.startsWith("image/") || mimeType.startsWith("audio/") || mimeType.startsWith("video/"));
};
var looksLikeBase64 = (value) => {
  if (value.startsWith("data:") && value.includes(";base64,")) return true;
  if (value.length < 1024 || value.length % 4 !== 0) return false;
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    const valid = code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 47 || code === 61 || code === 10 || code === 13;
    if (!valid) return false;
  }
  return true;
};
var sanitize = (input, maxBytes) => {
  const counts = emptyCounts();
  const ancestors = /* @__PURE__ */ new Set();
  let nodes = 0;
  const visit = (value2, depth, key) => {
    nodes++;
    if (nodes > MAX_NODES) {
      counts.droppedValues++;
      return DROP;
    }
    if (key !== void 0 && isSensitiveKey(key)) {
      counts.redactedValues++;
      return "[REDACTED]";
    }
    if (key !== void 0 && isMediaKey(key)) {
      counts.droppedValues++;
      return DROP;
    }
    if (value2 === null || typeof value2 === "boolean") return value2;
    if (typeof value2 === "number") {
      if (Number.isFinite(value2)) return value2;
      counts.truncatedValues++;
      return `[non-finite:${String(value2)}]`;
    }
    if (typeof value2 === "string") {
      if (looksLikeBase64(value2)) {
        counts.droppedValues++;
        return "[OMITTED_BASE64]";
      }
      const bounded = truncateUtf8(value2, MAX_STRING_BYTES);
      if (bounded !== value2) counts.truncatedValues++;
      return bounded;
    }
    if (typeof value2 === "bigint") {
      counts.truncatedValues++;
      return `${String(value2)}n`;
    }
    if (typeof value2 === "undefined" || typeof value2 === "function" || typeof value2 === "symbol") {
      counts.droppedValues++;
      return DROP;
    }
    if (typeof value2 !== "object") {
      counts.droppedValues++;
      return DROP;
    }
    if (depth >= MAX_DEPTH) {
      counts.truncatedValues++;
      return "[MAX_DEPTH]";
    }
    if (ancestors.has(value2)) {
      counts.droppedValues++;
      return "[CIRCULAR]";
    }
    const record = value2;
    if (!Array.isArray(value2) && isMediaObject(record)) {
      counts.droppedValues++;
      return "[OMITTED_MEDIA]";
    }
    ancestors.add(value2);
    if (Array.isArray(value2)) {
      const output2 = [];
      const limit2 = Math.min(value2.length, MAX_ARRAY_ITEMS);
      for (let index = 0; index < limit2; index++) {
        const item = visit(value2[index], depth + 1);
        output2.push(item === DROP ? "[DROPPED]" : item);
      }
      if (value2.length > limit2) {
        counts.droppedValues += value2.length - limit2;
        counts.truncatedValues++;
      }
      ancestors.delete(value2);
      return output2;
    }
    const output = {};
    const keys = Object.keys(record).sort();
    const limit = Math.min(keys.length, MAX_KEYS);
    for (let index = 0; index < limit; index++) {
      const childKey = keys[index];
      const child = visit(record[childKey], depth + 1, childKey);
      if (child !== DROP) output[childKey] = child;
    }
    if (keys.length > limit) {
      counts.droppedValues += keys.length - limit;
      counts.truncatedValues++;
    }
    ancestors.delete(value2);
    return output;
  };
  let value = visit(input, 0);
  if (value === DROP) value = "[DROPPED]";
  const originalBytes = serializedBytes(value);
  if (originalBytes > maxBytes) {
    counts.truncatedValues++;
    if (Array.isArray(value)) {
      const output = [];
      for (const item of value) {
        const next = [...output, item];
        if (serializedBytes(next) > maxBytes - 128) break;
        output.push(item);
      }
      counts.droppedValues += value.length - output.length;
      value = output;
    } else if (typeof value === "object" && value !== null) {
      const output = {};
      const entries = Object.entries(value);
      let included = 0;
      for (const [childKey, child] of entries) {
        const next = { ...output, [childKey]: child };
        if (serializedBytes(next) > maxBytes - 128) break;
        output[childKey] = child;
        included++;
      }
      counts.droppedValues += entries.length - included;
      value = output;
    }
  }
  return { value, counts };
};
var sanitizeObject = (value, droppedValues = 0) => {
  const sanitized = sanitize(value, MAX_ARGS_BYTES);
  sanitized.counts.droppedValues += droppedValues;
  if (typeof sanitized.value === "object" && sanitized.value !== null && !Array.isArray(sanitized.value)) {
    return sanitized;
  }
  sanitized.counts.droppedValues++;
  return { value: {}, counts: sanitized.counts };
};
var projectedArgs = (ref, args) => {
  const projection = projectFabricAuditArgs(ref, args);
  return sanitizeObject(projection.value, projection.droppedValues);
};
var sanitizeString = (value, maxBytes) => {
  const bounded = truncateUtf8(value, maxBytes);
  return {
    value: bounded,
    counts: {
      ...emptyCounts(),
      truncatedValues: bounded === value ? 0 : 1
    }
  };
};
var addCounts = (target, source) => {
  target.droppedValues += source.droppedValues;
  target.truncatedValues += source.truncatedValues;
  target.redactedValues += source.redactedValues;
};
var lexicalIdentity = (ref) => {
  const separator = ref.indexOf(".");
  if (separator <= 0 || separator === ref.length - 1) return {};
  return {
    provider: ref.slice(0, separator),
    action: ref.slice(separator + 1)
  };
};
var FabricTraceSafeError = class extends Error {
};
var FabricResolutionError = class extends FabricTraceSafeError {
};
var errorCause = (error) => {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : void 0;
  const trimmed = message?.trim();
  return trimmed ? truncateUtf8Middle(trimmed, MAX_ERROR_BYTES - 256) : void 0;
};
var failureMessage = (stage, outcome, cause) => {
  if (outcome === "timed_out") return "Call timed out";
  if (outcome === "aborted") return "Call aborted";
  const summary = `Call failed during ${stage}`;
  return cause ? `${summary}: ${cause}` : summary;
};
var executionErrorMessage = (outcome) => {
  if (outcome === "succeeded") return void 0;
  if (outcome === "timed_out") return "Execution timed out";
  if (outcome === "aborted") return "Execution aborted";
  return "Execution failed";
};
var FabricExecutionTraceOperationHandle = class {
  constructor(recorder, operation) {
    this.recorder = recorder;
    this.operation = operation;
  }
  resolved(provider, action) {
    if (!this.operation || this.recorder.sealed) return;
    const boundedProvider = boundedIdentifier(provider);
    const boundedAction = boundedIdentifier(action);
    if (this.operation.provider !== boundedProvider) {
      this.operation.provider = this.recorder.snapshotIdentifier(provider);
    }
    if (this.operation.action !== boundedAction) {
      this.operation.action = this.recorder.snapshotIdentifier(action);
    }
  }
  prepared(args) {
    if (!this.operation || this.recorder.sealed) return;
    this.operation.args = projectedArgs(this.operation.projectionRef, args);
  }
  succeed(result, meta) {
    if (!this.operation || this.recorder.sealed) return;
    const projected2 = projectFabricAuditResult(this.operation.projectionRef, result);
    if (projected2 !== void 0) {
      this.operation.result = sanitize(projected2.value, MAX_RESULT_BYTES);
      this.operation.result.counts.droppedValues += projected2.droppedValues;
    } else if (result !== void 0) {
      this.operation.droppedResultValues++;
    }
    this.operation.outcome = "succeeded";
    if (meta?.resultTruncated === true) this.operation.resultTruncated = true;
  }
  fail(stage, error, outcome = "failed", result, meta) {
    if (!this.operation || this.recorder.sealed) return;
    this.operation.failureStage = stage;
    if (error instanceof FabricTraceSafeError) this.operation.causeSafe = true;
    const cause = outcome === "failed" && (this.operation.causeSafe === true || this.operation.projectionRef === "pi.bash" && stage === "invoke") ? errorCause(error) : void 0;
    this.operation.error = sanitizeString(
      failureMessage(stage, outcome, cause),
      MAX_ERROR_BYTES
    );
    this.operation.outcome = outcome;
    if (meta?.resultTruncated === true) this.operation.resultTruncated = true;
    const projected2 = projectFabricAuditResult(this.operation.projectionRef, result);
    if (projected2 !== void 0) {
      this.operation.result = sanitize(projected2.value, MAX_RESULT_BYTES);
      this.operation.result.counts.droppedValues += projected2.droppedValues;
    } else if (result !== void 0) {
      this.operation.droppedResultValues++;
    }
  }
};
var FabricExecutionTraceRecorder = class {
  #operations = [];
  #nextSequence = 0;
  #droppedOperations = 0;
  #truncatedIdentifiers = 0;
  sealed = false;
  snapshotIdentifier(value, maxBytes = MAX_IDENTIFIER_BYTES) {
    const bounded = boundedIdentifier(value, maxBytes);
    if (bounded !== value) this.#truncatedIdentifiers++;
    return bounded;
  }
  issueCall(ref, args) {
    const sequence = this.#nextSequence++;
    if (this.sealed || this.#operations.length >= MAX_RECORDED_OPERATIONS) {
      this.#droppedOperations++;
      return new FabricExecutionTraceOperationHandle(this, void 0);
    }
    const identity = lexicalIdentity(ref);
    const operation = {
      type: "call",
      sequence,
      ref: this.snapshotIdentifier(ref),
      projectionRef: ref,
      ...identity.provider ? { provider: this.snapshotIdentifier(identity.provider) } : {},
      ...identity.action ? { action: this.snapshotIdentifier(identity.action) } : {},
      args: projectedArgs(ref, args),
      droppedResultValues: 0
    };
    this.#operations.push(operation);
    return new FabricExecutionTraceOperationHandle(this, operation);
  }
  // safeError must contain no guest source text, tool output, or argument
  // payloads — callers pass it only for Fabric-generated failure summaries
  // (for example the type-check stage). Guest and provider error text is
  // deliberately not persisted here.
  seal(outcome, phases, safeError) {
    this.sealed = true;
    for (const operation of this.#operations) {
      if (!operation.outcome) {
        operation.outcome = outcome === "timed_out" ? "timed_out" : outcome === "aborted" ? "aborted" : "failed";
        operation.failureStage ??= "invoke";
      } else if (operation.outcome === "aborted" && outcome === "timed_out") {
        operation.outcome = "timed_out";
      }
      if (operation.outcome !== "succeeded") {
        const preserveCause = operation.error !== void 0 && (operation.causeSafe === true || operation.projectionRef === "pi.bash" && operation.outcome === "failed");
        if (!preserveCause) {
          operation.error = sanitizeString(
            failureMessage(operation.failureStage ?? "invoke", operation.outcome),
            MAX_ERROR_BYTES
          );
        }
      }
    }
    const counts = {
      droppedValues: 0,
      truncatedValues: this.#truncatedIdentifiers,
      redactedValues: 0,
      droppedOperations: this.#droppedOperations
    };
    const operations = this.#operations.map((operation) => {
      addCounts(counts, operation.args.counts);
      counts.droppedValues += operation.droppedResultValues;
      if (operation.error) addCounts(counts, operation.error.counts);
      if (operation.result) addCounts(counts, operation.result.counts);
      return {
        type: "call",
        sequence: operation.sequence,
        ref: operation.ref,
        ...operation.provider ? { provider: operation.provider } : {},
        ...operation.action ? { action: operation.action } : {},
        args: operation.args.value,
        outcome: operation.outcome,
        ...operation.failureStage ? { failureStage: operation.failureStage } : {},
        ...operation.error ? { error: operation.error.value } : {},
        ...operation.result ? { result: operation.result.value } : {},
        ...operation.resultTruncated === true ? { resultTruncated: true } : {}
      };
    });
    const boundedPhases = phases.slice(0, MAX_PHASES).map((phase) => {
      const bounded = boundedIdentifier(phase, MAX_PHASE_BYTES);
      if (bounded !== phase) counts.truncatedValues++;
      return bounded;
    });
    if (phases.length > boundedPhases.length) {
      counts.droppedValues += phases.length - boundedPhases.length;
      counts.truncatedValues++;
    }
    const safeRunError = safeError?.trim() || executionErrorMessage(outcome);
    const runError = safeRunError ? sanitizeString(safeRunError, MAX_ERROR_BYTES) : void 0;
    if (runError) addCounts(counts, runError.counts);
    const trace = {
      kind: FABRIC_EXECUTION_TRACE_KIND,
      version: FABRIC_EXECUTION_TRACE_VERSION,
      outcome,
      phases: boundedPhases,
      operations,
      counts,
      ...runError ? { error: runError.value } : {}
    };
    let traceBytes = serializedBytes(trace);
    const adjustMutation = (beforeValueBytes, afterValueBytes, beforeCountsBytes) => {
      traceBytes += afterValueBytes - beforeValueBytes + serializedBytes(trace.counts) - beforeCountsBytes;
    };
    for (let index = trace.operations.length - 1; traceBytes > FABRIC_EXECUTION_TRACE_MAX_BYTES && index >= 0; index--) {
      const operation = trace.operations[index];
      if (operation.result === void 0) continue;
      const beforeOperationBytes = serializedBytes(operation);
      const beforeCountsBytes = serializedBytes(trace.counts);
      delete operation.result;
      trace.counts.droppedValues++;
      adjustMutation(
        beforeOperationBytes,
        serializedBytes(operation),
        beforeCountsBytes
      );
    }
    for (let index = trace.operations.length - 1; traceBytes > FABRIC_EXECUTION_TRACE_MAX_BYTES && index >= 0; index--) {
      const operation = trace.operations[index];
      if (Object.keys(operation.args).length === 0) continue;
      const beforeOperationBytes = serializedBytes(operation);
      const beforeCountsBytes = serializedBytes(trace.counts);
      operation.args = {};
      trace.counts.droppedValues++;
      trace.counts.truncatedValues++;
      adjustMutation(
        beforeOperationBytes,
        serializedBytes(operation),
        beforeCountsBytes
      );
    }
    while (traceBytes > FABRIC_EXECUTION_TRACE_MAX_BYTES && trace.operations.length > 0) {
      const beforeCountsBytes = serializedBytes(trace.counts);
      const operation = trace.operations.pop();
      traceBytes -= serializedBytes(operation);
      if (trace.operations.length > 0) traceBytes--;
      trace.counts.droppedOperations++;
      traceBytes += serializedBytes(trace.counts) - beforeCountsBytes;
    }
    while (traceBytes > FABRIC_EXECUTION_TRACE_MAX_BYTES && trace.phases.length > 0) {
      const beforeCountsBytes = serializedBytes(trace.counts);
      const phase = trace.phases.pop();
      traceBytes -= serializedBytes(phase);
      if (trace.phases.length > 0) traceBytes--;
      trace.counts.droppedValues++;
      traceBytes += serializedBytes(trace.counts) - beforeCountsBytes;
    }
    return trace;
  }
};
var executionOutcomeFromError = (error, signal) => {
  if (signal?.aborted) return "aborted";
  return error === void 0 ? "succeeded" : "failed";
};
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var hasOnlyKeys = (value, keys) => Object.keys(value).every((key) => keys.includes(key));
var outcomes = /* @__PURE__ */ new Set(["succeeded", "failed", "aborted", "timed_out"]);
var stages = /* @__PURE__ */ new Set(["resolve", "prepare", "validate", "approve", "invoke", "guard"]);
var isJsonValue = (value, ancestors = /* @__PURE__ */ new Set(), depth = 0) => {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || depth > MAX_DEPTH + 2 || ancestors.has(value)) return false;
  ancestors.add(value);
  const valid = Array.isArray(value) ? value.every((item) => isJsonValue(item, ancestors, depth + 1)) : Object.values(value).every((item) => isJsonValue(item, ancestors, depth + 1));
  ancestors.delete(value);
  return valid;
};
var isFabricExecutionTraceOperationV1Unchecked = (value) => {
  if (!isRecord(value)) return false;
  if (!hasOnlyKeys(value, ["type", "sequence", "ref", "provider", "action", "args", "outcome", "failureStage", "error", "result", "resultTruncated"])) return false;
  if (value.type !== "call" || !Number.isSafeInteger(value.sequence) || value.sequence < 0) return false;
  if (typeof value.ref !== "string" || !isRecord(value.args) || !isJsonValue(value.args)) return false;
  if (!outcomes.has(value.outcome)) return false;
  if (value.provider !== void 0 && typeof value.provider !== "string") return false;
  if (value.action !== void 0 && typeof value.action !== "string") return false;
  if (value.failureStage !== void 0 && !stages.has(value.failureStage)) return false;
  if (value.error !== void 0 && typeof value.error !== "string") return false;
  if (value.resultTruncated !== void 0 && typeof value.resultTruncated !== "boolean") return false;
  return value.result === void 0 || isJsonValue(value.result);
};
var isFabricExecutionTraceOperationV1 = (value) => {
  try {
    return isFabricExecutionTraceOperationV1Unchecked(value);
  } catch {
    return false;
  }
};
var isFabricExecutionTraceV1Unchecked = (value) => {
  if (!isRecord(value)) return false;
  if (!hasOnlyKeys(value, ["kind", "version", "outcome", "phases", "operations", "counts", "error"])) return false;
  if (value.kind !== FABRIC_EXECUTION_TRACE_KIND || value.version !== FABRIC_EXECUTION_TRACE_VERSION) return false;
  if (!outcomes.has(value.outcome)) return false;
  if (!Array.isArray(value.phases) || !value.phases.every((phase) => typeof phase === "string")) return false;
  if (!Array.isArray(value.operations) || !value.operations.every(isFabricExecutionTraceOperationV1)) return false;
  if (!isRecord(value.counts) || !hasOnlyKeys(value.counts, ["droppedValues", "truncatedValues", "redactedValues", "droppedOperations"])) return false;
  const counts = value.counts;
  if (!["droppedValues", "truncatedValues", "redactedValues", "droppedOperations"].every((key) => Number.isSafeInteger(counts[key]) && counts[key] >= 0)) return false;
  if (value.error !== void 0 && typeof value.error !== "string") return false;
  for (let index = 1; index < value.operations.length; index++) {
    if (value.operations[index].sequence <= value.operations[index - 1].sequence) return false;
  }
  return serializedBytes(value) <= FABRIC_EXECUTION_TRACE_MAX_BYTES;
};
var isFabricExecutionTraceV1 = (value) => {
  try {
    return isFabricExecutionTraceV1Unchecked(value);
  } catch {
    return false;
  }
};
var readFabricExecutionTraceV1 = (value) => isFabricExecutionTraceV1(value) ? value : void 0;

export {
  projectFabricAuditArgs,
  projectFabricAuditResult,
  FABRIC_EXECUTION_TRACE_KIND,
  FABRIC_EXECUTION_TRACE_VERSION,
  FABRIC_EXECUTION_TRACE_MAX_BYTES,
  FabricTraceSafeError,
  FabricResolutionError,
  FabricExecutionTraceOperationHandle,
  FabricExecutionTraceRecorder,
  executionOutcomeFromError,
  isFabricExecutionTraceOperationV1,
  isFabricExecutionTraceV1,
  readFabricExecutionTraceV1
};
//# sourceMappingURL=chunk-AZOIDGCU.js.map
