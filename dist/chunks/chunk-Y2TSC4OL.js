import {
  readFabricExecutionTraceV1
} from "./chunk-AZOIDGCU.js";

// src/compaction/branch-details.ts
var FABRIC_BRANCH_SUMMARY_KIND = "pi-fabric.branch-summary";
var FABRIC_BRANCH_SUMMARY_VERSION_V1 = 1;
var FABRIC_BRANCH_SUMMARY_VERSION = 2;
var FABRIC_BRANCH_SUMMARY_MAX_BYTES = 128 * 1024;
var FABRIC_BRANCH_SUMMARY_MAX_FACTS = 256;
var FABRIC_BRANCH_RUN_NAME_MAX_BYTES = 256;
var FABRIC_BRANCH_RUN_DESCRIPTION_MAX_BYTES = 1024;
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var hasOnlyKeys = (value, keys) => Object.keys(value).every((key) => keys.includes(key));
var MAX_DETAILS_JSON_NODES = 4096;
var MAX_DETAILS_JSON_COLLECTION = 256;
var isJsonValue = (value, state, depth = 0) => {
  state.nodes += 1;
  if (state.nodes > MAX_DETAILS_JSON_NODES) return false;
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || depth > 16 || state.ancestors.has(value)) return false;
  state.ancestors.add(value);
  let valid = false;
  try {
    if (Array.isArray(value)) {
      valid = value.length <= MAX_DETAILS_JSON_COLLECTION && value.every((item) => isJsonValue(item, state, depth + 1));
    } else {
      const keys = Object.keys(value);
      valid = keys.length <= MAX_DETAILS_JSON_COLLECTION && keys.every((key) => isJsonValue(value[key], state, depth + 1));
    }
  } finally {
    state.ancestors.delete(value);
  }
  return valid;
};
var outcomes = /* @__PURE__ */ new Set(["succeeded", "failed", "aborted", "timed_out"]);
var validBase = (fact) => typeof fact.entryId === "string" && typeof fact.subordinal === "string" && typeof fact.address === "string" && fact.address === `${fact.entryId}/${fact.subordinal}`;
var isFactV1 = (value, jsonState) => {
  if (!isRecord(value) || !validBase(value)) return false;
  if (value.kind === "user") {
    return hasOnlyKeys(value, ["kind", "entryId", "subordinal", "address", "text"]) && typeof value.text === "string";
  }
  if (value.kind === "customMessage") {
    return hasOnlyKeys(value, [
      "kind",
      "entryId",
      "subordinal",
      "address",
      "customType",
      "text",
      "display",
      "details"
    ]) && typeof value.customType === "string" && typeof value.text === "string" && typeof value.display === "boolean" && (value.details === void 0 || isJsonValue(value.details, jsonState));
  }
  if (value.kind === "phase") {
    return hasOnlyKeys(value, ["kind", "entryId", "subordinal", "address", "phase"]) && typeof value.phase === "string";
  }
  if (value.kind !== "operation") return false;
  if (!hasOnlyKeys(value, [
    "kind",
    "entryId",
    "subordinal",
    "address",
    "ref",
    "provider",
    "action",
    "tool",
    "args",
    "outcome",
    "error",
    "result"
  ])) return false;
  return typeof value.ref === "string" && (value.provider === void 0 || typeof value.provider === "string") && (value.action === void 0 || typeof value.action === "string") && typeof value.tool === "string" && isRecord(value.args) && isJsonValue(value.args, jsonState) && outcomes.has(value.outcome) && (value.error === void 0 || typeof value.error === "string") && (value.result === void 0 || isJsonValue(value.result, jsonState));
};
var isFactV2 = (value, jsonState) => {
  if (isRecord(value) && value.kind === "fabricRun") {
    return validBase(value) && typeof value.subordinal === "string" && value.subordinal.startsWith("call:") && value.subordinal.length > "call:".length && hasOnlyKeys(value, [
      "kind",
      "entryId",
      "subordinal",
      "address",
      "name",
      "description",
      "outcome"
    ]) && typeof value.name === "string" && value.name.trim().length > 0 && Buffer.byteLength(value.name, "utf8") <= FABRIC_BRANCH_RUN_NAME_MAX_BYTES && (value.description === void 0 || typeof value.description === "string" && Buffer.byteLength(value.description, "utf8") <= FABRIC_BRANCH_RUN_DESCRIPTION_MAX_BYTES) && outcomes.has(value.outcome);
  }
  return isFactV1(value, jsonState);
};
var serializedBytes = (value) => Buffer.byteLength(JSON.stringify(value), "utf8");
var validEnvelope = (value, version, factValidator) => {
  if (!hasOnlyKeys(value, [
    "kind",
    "version",
    "source",
    "facts",
    "omittedFacts",
    "sections",
    "request"
  ])) return false;
  if (value.kind !== FABRIC_BRANCH_SUMMARY_KIND || value.version !== version) return false;
  if (!isRecord(value.source) || !hasOnlyKeys(value.source, ["firstEntryId", "lastEntryId", "entryCount", "oldLeafId"])) return false;
  if (typeof value.source.firstEntryId !== "string" || typeof value.source.lastEntryId !== "string") return false;
  if (!Number.isSafeInteger(value.source.entryCount) || value.source.entryCount < 0) return false;
  if (value.source.oldLeafId !== void 0 && value.source.oldLeafId !== null && typeof value.source.oldLeafId !== "string") return false;
  const jsonState = { nodes: 0, ancestors: /* @__PURE__ */ new Set() };
  if (!Array.isArray(value.facts) || value.facts.length > FABRIC_BRANCH_SUMMARY_MAX_FACTS || !value.facts.every((fact) => factValidator(fact, jsonState))) return false;
  if (!Number.isSafeInteger(value.omittedFacts) || value.omittedFacts < 0) return false;
  if (!Array.isArray(value.sections) || value.sections.length > 64 || !value.sections.every((section) => typeof section === "string")) return false;
  if (!isRecord(value.request) || !hasOnlyKeys(value.request, ["text", "sourceBytes", "truncated"])) return false;
  if (typeof value.request.text !== "string" || typeof value.request.truncated !== "boolean") return false;
  if (!Number.isSafeInteger(value.request.sourceBytes) || value.request.sourceBytes < 0) return false;
  return serializedBytes(value) <= FABRIC_BRANCH_SUMMARY_MAX_BYTES;
};
var readFabricBranchSummaryDetailsV1 = (value) => {
  try {
    if (!isRecord(value) || !validEnvelope(value, FABRIC_BRANCH_SUMMARY_VERSION_V1, isFactV1)) {
      return void 0;
    }
    return value;
  } catch {
    return void 0;
  }
};
var readFabricBranchSummaryDetailsV2 = (value) => {
  try {
    if (!isRecord(value) || !validEnvelope(value, FABRIC_BRANCH_SUMMARY_VERSION, isFactV2)) {
      return void 0;
    }
    return value;
  } catch {
    return void 0;
  }
};
var readFabricBranchSummaryDetails = (value) => readFabricBranchSummaryDetailsV2(value) ?? readFabricBranchSummaryDetailsV1(value);

// src/compaction/trace-events.ts
var isRecord2 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var isJsonValue2 = (value, ancestors = /* @__PURE__ */ new Set(), depth = 0) => {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || depth > 16 || ancestors.has(value)) return false;
  ancestors.add(value);
  const valid = Array.isArray(value) ? value.every((item) => isJsonValue2(item, ancestors, depth + 1)) : Object.values(value).every((item) => isJsonValue2(item, ancestors, depth + 1));
  ancestors.delete(value);
  return valid;
};
var lexicalIdentity = (ref) => {
  const separator = ref.indexOf(".");
  if (separator <= 0 || separator === ref.length - 1) return {};
  return { provider: ref.slice(0, separator), action: ref.slice(separator + 1) };
};
var toolOf = (ref, provider, action) => {
  if (provider === "pi" && action) return action;
  return action ?? ref;
};
var readLegacyAudits = (value) => {
  if (!Array.isArray(value)) return void 0;
  const operations = [];
  for (let sequence = 0; sequence < value.length; sequence++) {
    const audit = value[sequence];
    if (!isRecord2(audit) || typeof audit.ref !== "string" || !isRecord2(audit.args) || !isJsonValue2(audit.args)) return void 0;
    if (typeof audit.success !== "boolean") return void 0;
    if (audit.error !== void 0 && typeof audit.error !== "string") return void 0;
    const identity = lexicalIdentity(audit.ref);
    operations.push({
      sequence,
      ref: audit.ref,
      ...identity.provider ? { provider: identity.provider } : {},
      ...identity.action ? { action: identity.action } : {},
      tool: toolOf(audit.ref, identity.provider, identity.action),
      args: audit.args,
      outcome: audit.success ? "succeeded" : "failed",
      ...audit.error !== void 0 ? { error: audit.error } : {},
      source: "legacy"
    });
  }
  return { source: "legacy", phases: [], operations };
};
var readFabricProjectionTrace = (details) => {
  if (!isRecord2(details)) return void 0;
  if (Object.prototype.hasOwnProperty.call(details, "trace")) {
    const trace = readFabricExecutionTraceV1(details.trace);
    if (!trace) return void 0;
    return {
      source: "trace",
      outcome: trace.outcome,
      phases: [...trace.phases],
      operations: trace.operations.map((operation) => {
        const lexical = lexicalIdentity(operation.ref);
        const provider = operation.provider ?? lexical.provider;
        const action = operation.action ?? lexical.action;
        return {
          sequence: operation.sequence,
          ref: operation.ref,
          ...provider ? { provider } : {},
          ...action ? { action } : {},
          tool: toolOf(operation.ref, provider, action),
          args: operation.args,
          outcome: operation.outcome,
          ...operation.error !== void 0 ? { error: operation.error } : {},
          ...operation.result !== void 0 ? { result: operation.result } : {},
          source: "trace"
        };
      })
    };
  }
  return readLegacyAudits(details.audits);
};

export {
  FABRIC_BRANCH_SUMMARY_KIND,
  FABRIC_BRANCH_SUMMARY_VERSION,
  FABRIC_BRANCH_SUMMARY_MAX_BYTES,
  FABRIC_BRANCH_SUMMARY_MAX_FACTS,
  FABRIC_BRANCH_RUN_NAME_MAX_BYTES,
  FABRIC_BRANCH_RUN_DESCRIPTION_MAX_BYTES,
  readFabricBranchSummaryDetails,
  readFabricProjectionTrace
};
//# sourceMappingURL=chunk-Y2TSC4OL.js.map
