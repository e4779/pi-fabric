import {
  DEFAULT_HOT_SESSIONS,
  DEFAULT_REGEX_MAX_HAYSTACK_BYTES,
  DEFAULT_REGEX_MAX_HAYSTACK_TERMS,
  DEFAULT_REGEX_MAX_PATTERN_BYTES,
  DEFAULT_REGEX_TIMEOUT_MS,
  fingerprintSource,
  formatSearchResult,
  loadTieredIndex,
  reconstructSessionLineage,
  searchMemoryIndex
} from "./chunk-HG7D6AOD.js";
import {
  AmbiguousSessionError,
  enumerateAllSessions,
  resolveScope,
  resolveSessionTarget
} from "./chunk-VWSJJK3M.js";
import {
  expandSessionEntriesChecked,
  normalizeSession
} from "./chunk-4OXEXLH6.js";

// src/providers/memory-provider.ts
import path from "node:path";

// src/providers/arg-normalization.ts
var normalizeForm = (key) => key.toLowerCase().replace(/[^a-z0-9]/g, "");
var KEY_SYNONYM_CLASSES = [
  ["session", "sessionId", "id", "file", "path"],
  ["hypothesisId", "id"],
  ["id", "agentId", "actorId", "runId"],
  ["query", "q"],
  ["limit", "max", "pageSize"],
  ["task", "prompt", "instructions"],
  ["label", "labels", "name", "title"],
  ["summary", "description"],
  ["text", "message", "body"],
  ["check", "command", "cmd", "script", "predicate"],
  ["files", "paths"],
  ["ifVersion", "versionRef", "version"],
  ["indices", "index"]
];
var KEY_CLASS_FORMS = KEY_SYNONYM_CLASSES.map(
  (cls) => new Set(cls.map(normalizeForm))
);
var ENUM_VALUE_CLASSES = [
  ["project", "cwd", "repo", "repository", "workspace", "checkout", "tree"],
  ["global", "all"],
  ["permanent", "pinned", "sticky", "durable"]
];
var VALUE_CLASS_FORMS = ENUM_VALUE_CLASSES.map(
  (cls) => new Set(cls.map(normalizeForm))
);
var numericKind = (property) => {
  if (!property || typeof property !== "object") return void 0;
  const schema = property;
  if (schema.type === "number" || schema.type === "integer") return "scalar";
  if (schema.type === "array") {
    const items = schema.items;
    if (items && typeof items === "object" && (items.type === "number" || items.type === "integer")) {
      return "array";
    }
  }
  return void 0;
};
var stringEnumValues = (property) => {
  if (!property || typeof property !== "object") return void 0;
  const schema = property;
  if (Array.isArray(schema.enum)) {
    const values = schema.enum.filter(
      (entry) => typeof entry === "string"
    );
    return values.length > 0 ? values : void 0;
  }
  for (const branch of [schema.oneOf, schema.anyOf]) {
    if (!Array.isArray(branch)) continue;
    const consts = branch.map(
      (entry) => entry && typeof entry === "object" ? entry.const : void 0
    ).filter((entry) => typeof entry === "string");
    if (consts.length > 0) return consts;
  }
  return void 0;
};
var deriveEnumValueMap = (values) => {
  const map = /* @__PURE__ */ new Map();
  const seen = /* @__PURE__ */ new Map();
  for (const value of values) {
    const form = normalizeForm(value);
    seen.set(form, seen.has(form) ? void 0 : value);
  }
  for (const [form, value] of seen) if (value !== void 0) map.set(form, value);
  for (const classForms of VALUE_CLASS_FORMS) {
    const members = values.filter((value) => classForms.has(normalizeForm(value)));
    if (members.length !== 1) continue;
    const [hit] = members;
    for (const form of classForms) {
      if (form !== normalizeForm(hit) && !map.has(form)) map.set(form, hit);
    }
  }
  return map;
};
var deriveAction = (inputSchema, explicit) => {
  const properties = inputSchema && typeof inputSchema === "object" && inputSchema.properties && typeof inputSchema.properties === "object" ? inputSchema.properties : void 0;
  const declared = new Set(Object.keys(properties ?? {}));
  const declaredForms = /* @__PURE__ */ new Map();
  const ambiguousForms = /* @__PURE__ */ new Set();
  for (const key of declared) {
    const form = normalizeForm(key);
    if (declaredForms.has(form)) {
      ambiguousForms.add(form);
      declaredForms.delete(form);
    } else if (!ambiguousForms.has(form)) {
      declaredForms.set(form, key);
    }
  }
  const singulars = /* @__PURE__ */ new Map();
  for (const key of declared) {
    const form = normalizeForm(key);
    if (!form.endsWith("s")) continue;
    const singular = form.slice(0, -1);
    if (!singular || declaredForms.has(singular) || singular === form) continue;
    if (singulars.get(singular) !== void 0) singulars.delete(singular);
    else singulars.set(singular, key);
  }
  for (const form of ambiguousForms) singulars.delete(form);
  const numerics = new Set(explicit?.numerics ?? []);
  const numericArrays = new Set(explicit?.numericArrays ?? []);
  const values = /* @__PURE__ */ new Map();
  if (properties) {
    for (const [key, property] of Object.entries(properties)) {
      const kind = numericKind(property);
      if (kind === "scalar") numerics.add(key);
      else if (kind === "array") numericArrays.add(key);
      const enumValues = stringEnumValues(property);
      if (enumValues) values.set(key, new Map(deriveEnumValueMap(enumValues)));
    }
  }
  for (const [key, remaps] of Object.entries(explicit?.values ?? {})) {
    const map = values.get(key) ?? /* @__PURE__ */ new Map();
    for (const [spelling, target] of Object.entries(remaps)) {
      map.set(normalizeForm(spelling), target);
    }
    values.set(key, map);
  }
  return { declared, declaredForms, singulars, numerics, numericArrays, values, aliases: explicit?.aliases };
};
var lexiconRepair = (form, declaredForms) => {
  const candidates = /* @__PURE__ */ new Set();
  for (const classForms of KEY_CLASS_FORMS) {
    if (!classForms.has(form)) continue;
    for (const [declaredForm, declaredKey] of declaredForms) {
      if (declaredForm !== form && classForms.has(declaredForm)) {
        candidates.add(declaredKey);
      }
    }
  }
  return candidates.size === 1 ? [...candidates][0] : void 0;
};
var uniqueDeclaredKeyForSpelling = (spilled, declared) => {
  if (declared.includes(spilled)) return void 0;
  const derived = deriveAction(
    {
      type: "object",
      properties: Object.fromEntries(declared.map((key) => [key, {}]))
    },
    void 0
  );
  const form = normalizeForm(spilled);
  const canonical = derived.declaredForms.get(form) ?? derived.singulars.get(form) ?? lexiconRepair(form, derived.declaredForms);
  return canonical && canonical !== spilled ? canonical : void 0;
};
var applyDerived = (args, derived) => {
  const out = { ...args };
  const repair = (alias, canonical) => {
    if (!(alias in out) || alias === canonical) return;
    if (!(canonical in out)) out[canonical] = out[alias];
    delete out[alias];
  };
  for (const [alias, canonical] of Object.entries(derived.aliases ?? {})) {
    repair(alias, canonical);
  }
  for (const key of [...Object.keys(out)]) {
    if (derived.declared.has(key)) continue;
    const form = normalizeForm(key);
    const canonical = derived.declaredForms.get(form) ?? derived.singulars.get(form) ?? lexiconRepair(form, derived.declaredForms);
    if (canonical && canonical !== key) repair(key, canonical);
  }
  for (const key of derived.numerics) {
    const value = out[key];
    if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
      out[key] = Number(value);
    }
  }
  for (const key of derived.numericArrays) {
    const value = out[key];
    if (Array.isArray(value)) {
      out[key] = value.map(
        (entry) => typeof entry === "string" && entry.trim() !== "" && !Number.isNaN(Number(entry)) ? Number(entry) : entry
      );
    }
  }
  for (const [key, remaps] of derived.values) {
    const value = out[key];
    if (typeof value === "string") {
      const next = remaps.get(normalizeForm(value));
      if (next !== void 0) out[key] = next;
    }
  }
  if (derived.declared.size > 0) {
    for (const key of Object.keys(out)) {
      if (derived.declared.has(key) && (out[key] === null || out[key] === void 0)) {
        delete out[key];
      }
    }
  }
  return out;
};
var actionArgNormalizer = (describeActions, table = {}) => {
  const derived = /* @__PURE__ */ new Map();
  for (const descriptor of describeActions()) {
    derived.set(
      descriptor.name,
      deriveAction(
        descriptor.inputSchema,
        table[descriptor.name]
      )
    );
  }
  return (actionName, args) => {
    if (!args || typeof args !== "object" || Array.isArray(args)) return args;
    const action = derived.get(actionName);
    return action ? applyDerived(args, action) : args;
  };
};

// src/providers/memory-provider.ts
var RECALL_DEFAULT_PAGE_SIZE = 25;
var RECALL_MAX_PAGE_SIZE = 200;
var SESSIONS_MAX = 500;
var descriptors = [
  {
    name: "recall",
    description: "Search hot session entries and cold session digests. Use scope session:<id-or-path> to hydrate a cold session and search its entries.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        queryMode: {
          type: "string",
          enum: ["literal", "regex"],
          description: "Literal canonical-token matching (default) or explicitly bounded regex."
        },
        expectedSourceHash: {
          type: "string",
          description: "SHA-256 from a prior pointer; stale sources are refused."
        },
        expectedLineageFingerprint: {
          type: "string",
          description: "Active-lineage fingerprint from a prior pointer; changed leaves are refused."
        },
        branches: {
          type: "string",
          enum: ["active", "all"],
          description: "Search the active parent-linked path (default) or every branch."
        },
        scope: {
          type: "string",
          description: "session | project | global | session:<id-or-path>. Defaults to session."
        },
        page: { type: "number", minimum: 1 },
        pageSize: { type: "number", minimum: 1, maximum: RECALL_MAX_PAGE_SIZE },
        role: { type: "string" },
        tool: { type: "string" },
        ref: {
          type: "string",
          minLength: 1,
          description: "Exact persisted Fabric action ref, such as pi.grep. This is structural selection, not lexical expansion."
        },
        provider: {
          type: "string",
          minLength: 1,
          description: "Exact persisted Fabric provider identity."
        },
        action: {
          type: "string",
          minLength: 1,
          description: "Exact persisted Fabric action name."
        },
        outcome: {
          type: "string",
          enum: ["succeeded", "failed", "aborted", "timed_out"],
          description: "Exact persisted Fabric execution outcome."
        },
        since: { type: "number" },
        until: { type: "number" },
        entryRange: {
          type: "object",
          description: "Inclusive normalized-entry range for an explicit session:<id> hydration.",
          properties: {
            first: { type: "number", minimum: 0 },
            last: { type: "number", minimum: 0 }
          },
          required: ["first", "last"],
          additionalProperties: false
        }
      },
      additionalProperties: false
    },
    risk: "read",
    namespace: "memory"
  },
  {
    name: "expand",
    description: "Re-read full text or a bounded structured Fabric operation by index, entry id, operation address, or inclusive range.",
    inputSchema: {
      type: "object",
      properties: {
        session: { type: "string", description: "Exact session file path or unambiguous id." },
        expectedSourceHash: {
          type: "string",
          description: "SHA-256 from a prior pointer; stale sources are refused."
        },
        expectedLineageFingerprint: {
          type: "string",
          description: "Active-lineage fingerprint from a prior pointer; changed leaves are refused."
        },
        branches: {
          type: "string",
          enum: ["active", "all"],
          description: "Expand on the active parent-linked path (default) or across every branch."
        },
        indices: { type: "array", items: { type: "number", minimum: 0 } },
        entryIds: { type: "array", items: { type: "string" } },
        operationAddresses: { type: "array", items: { type: "string" } },
        entryRange: {
          type: "object",
          properties: {
            first: { type: "number", minimum: 0 },
            last: { type: "number", minimum: 0 }
          },
          required: ["first", "last"],
          additionalProperties: false
        }
      },
      required: ["session"],
      additionalProperties: false
    },
    risk: "read",
    namespace: "memory"
  },
  {
    name: "sessions",
    description: "List known sessions in scope with id, file, cwd, mtime, entry count, and hot/cold tier.",
    inputSchema: {
      type: "object",
      properties: {
        scope: { type: "string" },
        branches: {
          type: "string",
          enum: ["active", "all"],
          description: "Count the active parent-linked path (default) or every branch."
        },
        limit: {
          type: "number",
          minimum: 1,
          description: "Maximum sessions returned; capped at the internal session ceiling."
        }
      },
      additionalProperties: false
    },
    risk: "read",
    namespace: "memory"
  }
];
var MEMORY_SCOPE_VALUE_ALIASES = {
  cwd: "project",
  repo: "project",
  directory: "project",
  folder: "project",
  all: "global",
  current: "session"
};
var MEMORY_ARG_NORMALIZATION = {
  recall: { values: { scope: MEMORY_SCOPE_VALUE_ALIASES } },
  sessions: { values: { scope: MEMORY_SCOPE_VALUE_ALIASES } }
};
var normalizeMemoryArgs = actionArgNormalizer(
  () => descriptors,
  MEMORY_ARG_NORMALIZATION
);
var parseBranches = (value, action) => {
  if (value === void 0) return "active";
  if (value === "active" || value === "all") return value;
  throw new Error(`${action} branches must be "active" or "all"`);
};
var resolveIndexOptions = (config, agentDir, branches, liveBranchForFile) => ({
  indexDir: config.indexDir ?? `${agentDir}/fabric/memory-index`,
  maxEntryChars: config.maxEntryChars,
  branches,
  indexThinking: config.indexThinking ?? false,
  indexToolOutput: config.indexToolOutput ?? true,
  ...liveBranchForFile ? { liveBranchForFile } : {},
  hotSessions: config.hotSessions ?? DEFAULT_HOT_SESSIONS,
  digestTerms: config.digestTerms ?? 200,
  ...config.maxColdVocabularyBytes === void 0 ? {} : { maxColdVocabularyBytes: config.maxColdVocabularyBytes },
  ...config.maxColdCacheBytes === void 0 ? {} : { maxColdCacheBytes: config.maxColdCacheBytes },
  ...config.maxSyncSessions === void 0 ? {} : { maxSyncSessions: config.maxSyncSessions },
  ...config.maxSyncSourceBytes === void 0 ? {} : { maxSyncSourceBytes: config.maxSyncSourceBytes },
  ...config.maxCacheCleanupFiles === void 0 ? {} : { maxCacheCleanupFiles: config.maxCacheCleanupFiles }
});
var resolveTierRefs = (refs, context) => {
  const all = enumerateAllSessions(context.agentDir, Number.MAX_SAFE_INTEGER);
  const known = new Set(all.map((ref) => ref.file));
  for (const ref of refs) {
    if (!known.has(ref.file)) all.push(ref);
  }
  return all;
};
var resolveRefs = (scope, context, boundedBrowse) => {
  const effectiveScope = scope ?? "session";
  const input = {
    agentDir: context.agentDir,
    cwd: context.cwd,
    scope: effectiveScope,
    maxSessions: boundedBrowse ? context.config.maxSessions : Number.MAX_SAFE_INTEGER
  };
  if (context.sessionId) input.sessionId = context.sessionId;
  if (context.sessionFile) input.sessionFile = context.sessionFile;
  return resolveScope(input);
};
var liveBranchResolver = (context) => {
  if (!context.sessionFile || !context.getLiveBranch) return void 0;
  const current = path.resolve(context.sessionFile);
  return (sessionFile) => path.resolve(sessionFile) === current ? context.getLiveBranch?.() : void 0;
};
var stalePointerError = (sessionFile, expectedSourceHash, actualSourceHash, expectedLineageFingerprint, actualLineageFingerprint) => ({
  code: "stale_pointer",
  message: expectedLineageFingerprint !== void 0 && expectedLineageFingerprint !== actualLineageFingerprint ? "Session active lineage changed after the pointer was issued." : "Session source changed after the pointer was issued.",
  sessionFile,
  ...expectedSourceHash === void 0 ? {} : { expectedSourceHash },
  actualSourceHash,
  ...expectedLineageFingerprint === void 0 ? {} : { expectedLineageFingerprint },
  ...actualLineageFingerprint === void 0 ? {} : { actualLineageFingerprint }
});
var addressError = (message, entryCount) => ({
  code: "index_out_of_bounds",
  message,
  ...entryCount === void 0 ? {} : { entryCount }
});
var MemoryProvider = class {
  constructor(context) {
    this.context = context;
  }
  name = "memory";
  description = "Cross-session memory: a search engine over every Pi session timeline on this machine";
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
    return normalizeMemoryArgs(actionName, args);
  }
  async invoke(actionName, args, invocationContext) {
    try {
      switch (actionName) {
        case "recall":
          return await this.recall(args, invocationContext);
        case "expand":
          return await this.expand(args);
        case "sessions":
          return await this.sessions(args);
        default:
          throw new Error(`Unknown memory action: ${actionName}`);
      }
    } catch (error) {
      if (error instanceof AmbiguousSessionError) {
        return {
          error: {
            code: error.code,
            message: error.message,
            session: error.session,
            candidates: error.candidates
          }
        };
      }
      throw error;
    }
  }
  async recall(args, invocationContext) {
    const query = typeof args.query === "string" ? args.query : void 0;
    const rawQueryMode = args.queryMode;
    if (rawQueryMode !== void 0 && rawQueryMode !== "literal" && rawQueryMode !== "regex") {
      throw new Error('memory.recall queryMode must be "literal" or "regex"');
    }
    const queryMode = rawQueryMode === "regex" ? "regex" : "literal";
    const expectedSourceHash = typeof args.expectedSourceHash === "string" ? args.expectedSourceHash : void 0;
    const expectedLineageFingerprint = typeof args.expectedLineageFingerprint === "string" ? args.expectedLineageFingerprint : void 0;
    const branches = parseBranches(args.branches, "memory.recall");
    const scope = typeof args.scope === "string" ? args.scope : void 0;
    const role = typeof args.role === "string" ? args.role : void 0;
    const tool = typeof args.tool === "string" ? args.tool : void 0;
    const ref = typeof args.ref === "string" ? args.ref : void 0;
    const provider = typeof args.provider === "string" ? args.provider : void 0;
    const action = typeof args.action === "string" ? args.action : void 0;
    const rawOutcome = args.outcome;
    if (rawOutcome !== void 0 && rawOutcome !== "succeeded" && rawOutcome !== "failed" && rawOutcome !== "aborted" && rawOutcome !== "timed_out") {
      throw new Error("memory.recall outcome must be succeeded, failed, aborted, or timed_out");
    }
    const outcome = rawOutcome;
    const since = typeof args.since === "number" ? args.since : void 0;
    const until = typeof args.until === "number" ? args.until : void 0;
    const page = typeof args.page === "number" && args.page >= 1 ? Math.floor(args.page) : 1;
    const pageSize = typeof args.pageSize === "number" && args.pageSize >= 1 ? Math.min(Math.floor(args.pageSize), RECALL_MAX_PAGE_SIZE) : RECALL_DEFAULT_PAGE_SIZE;
    const refs = resolveRefs(scope, this.context, false);
    const liveResolver = liveBranchResolver(this.context);
    const options = resolveIndexOptions(
      this.context.config,
      this.context.agentDir,
      branches,
      liveResolver
    );
    const hydrate = scope?.trim().startsWith("session:") ?? false;
    if ((expectedSourceHash !== void 0 || expectedLineageFingerprint !== void 0) && !hydrate) {
      throw new Error("memory.recall integrity expectations require scope session:<id-or-path>");
    }
    if (hydrate && refs[0]) {
      const state = fingerprintSource(refs[0].file);
      const lineage = reconstructSessionLineage(
        refs[0].file,
        branches,
        liveResolver?.(refs[0].file)
      );
      const sourceChanged = expectedSourceHash !== void 0 && state?.sourceHash !== expectedSourceHash;
      const lineageChanged = expectedLineageFingerprint !== void 0 && lineage.fingerprint !== expectedLineageFingerprint;
      if (state && (sourceChanged || lineageChanged)) {
        return {
          scope: scope ?? "session",
          query: query ?? null,
          branches,
          error: stalePointerError(
            refs[0].file,
            expectedSourceHash,
            state.sourceHash,
            expectedLineageFingerprint,
            lineage.fingerprint
          ),
          segments: [],
          digestHits: [],
          items: []
        };
      }
    }
    const rawRange = args.entryRange;
    const entryRange = rawRange && typeof rawRange === "object" && !Array.isArray(rawRange) ? rawRange : void 0;
    const first = entryRange?.first;
    const last = entryRange?.last;
    if (first === void 0 !== (last === void 0)) {
      throw new Error("memory.recall entryRange requires both first and last");
    }
    if ((first !== void 0 || last !== void 0) && !hydrate) {
      throw new Error("memory.recall entryRange requires scope session:<id-or-path>");
    }
    if (first !== void 0 && (typeof first !== "number" || typeof last !== "number" || !Number.isSafeInteger(first) || !Number.isSafeInteger(last) || first < 0 || last < first)) {
      return {
        scope: scope ?? "session",
        query: query ?? null,
        error: addressError("Entry range requires safe integers with 0 <= first <= last."),
        segments: [],
        digestHits: [],
        items: []
      };
    }
    const selectedRange = typeof first === "number" && typeof last === "number" ? { first, last } : void 0;
    const index = loadTieredIndex(
      refs,
      resolveTierRefs(refs, this.context),
      options,
      hydrate,
      selectedRange
    );
    const hydratedShard = index.shards[0];
    const hydratedSourceChanged = expectedSourceHash !== void 0 && hydratedShard?.sourceHash !== expectedSourceHash;
    const hydratedLineageChanged = expectedLineageFingerprint !== void 0 && hydratedShard?.lineageFingerprint !== expectedLineageFingerprint;
    if (hydrate && hydratedShard && (hydratedSourceChanged || hydratedLineageChanged)) {
      return {
        scope: scope ?? "session",
        query: query ?? null,
        branches,
        error: stalePointerError(
          hydratedShard.sessionFile,
          expectedSourceHash,
          hydratedShard.sourceHash,
          expectedLineageFingerprint,
          hydratedShard.lineageFingerprint
        ),
        segments: [],
        digestHits: [],
        items: []
      };
    }
    if (hydrate && selectedRange && index.shards[0] && selectedRange.last >= index.shards[0].totalEntryCount) {
      return {
        scope: scope ?? "session",
        query: query ?? null,
        error: addressError(
          `Entry range ends at ${selectedRange.last}, but the session has ${index.shards[0].totalEntryCount} entries.`,
          index.shards[0].totalEntryCount
        ),
        segments: [],
        digestHits: [],
        items: []
      };
    }
    const filters = {};
    if (role) filters.role = role;
    if (tool) filters.tool = tool;
    if (ref) filters.ref = ref;
    if (provider) filters.provider = provider;
    if (action) filters.action = action;
    if (outcome) filters.outcome = outcome;
    if (since !== void 0) filters.since = since;
    if (until !== void 0) filters.until = until;
    const searchQuery = {
      ...query === void 0 ? {} : { query },
      queryMode,
      filters,
      regexLimits: {
        maxPatternBytes: this.context.config.regexMaxPatternBytes ?? DEFAULT_REGEX_MAX_PATTERN_BYTES,
        maxHaystackTerms: this.context.config.regexMaxHaystackTerms ?? DEFAULT_REGEX_MAX_HAYSTACK_TERMS,
        maxHaystackBytes: this.context.config.regexMaxHaystackBytes ?? DEFAULT_REGEX_MAX_HAYSTACK_BYTES,
        timeoutMs: this.context.config.regexTimeoutMs ?? DEFAULT_REGEX_TIMEOUT_MS
      }
    };
    const result = await searchMemoryIndex(index.shards, index.digests, searchQuery);
    const coverage = {
      ...index.coverage,
      complete: index.coverage.complete && result.queryCoverage.complete,
      reasons: [.../* @__PURE__ */ new Set([...index.coverage.reasons, ...result.queryCoverage.reasons])].sort(),
      ...result.queryCoverage.error ? { error: result.queryCoverage.error } : {}
    };
    const start = (page - 1) * pageSize;
    const pagedItems = result.items.slice(start, start + pageSize);
    const pagedSegments = pagedItems.filter((item) => item.kind === "entry").map((item) => item.segment);
    const pagedDigests = pagedItems.filter((item) => item.kind === "digest").map((item) => item.digest);
    const displayResult = {
      ...result,
      segments: pagedSegments,
      digestHits: pagedDigests,
      items: pagedItems
    };
    const pagedResult = {
      scope: scope ?? "session",
      branches,
      query: query ?? null,
      queryMode,
      matchMode: result.matchMode,
      structuralFilters: filters,
      matchedCount: result.matchedCount,
      totalMatches: result.totalMatches,
      totalItems: result.totalItems,
      segmentCount: result.segmentCount,
      segments: pagedSegments,
      digestHits: pagedDigests,
      items: pagedItems,
      page,
      pageSize,
      hasNext: start + pageSize < result.totalItems,
      coverage,
      text: formatSearchResult(displayResult, query, coverage, filters)
    };
    invocationContext.update(
      result.matchMode === "structural" ? `memory.recall: ${result.matchedCount} structural result items` : result.matchMode === "combined" ? `memory.recall: ${result.matchedCount} lexical matches within exact structural filters` : query ? `memory.recall: ${result.matchedCount} matches across ${result.segmentCount} segments` : `memory.recall: ${result.matchedCount} recent entries`
    );
    return pagedResult;
  }
  async expand(args) {
    const session = typeof args.session === "string" ? args.session : "";
    const expectedSourceHash = typeof args.expectedSourceHash === "string" ? args.expectedSourceHash : void 0;
    const expectedLineageFingerprint = typeof args.expectedLineageFingerprint === "string" ? args.expectedLineageFingerprint : void 0;
    const branches = parseBranches(args.branches, "memory.expand");
    const rawIndices = args.indices;
    if (rawIndices !== void 0 && !Array.isArray(rawIndices)) {
      throw new Error("memory.expand indices must be an array");
    }
    if (Array.isArray(rawIndices) && !rawIndices.every((index) => typeof index === "number" && Number.isSafeInteger(index) && index >= 0)) {
      return { session, error: addressError("Every entry index must be a non-negative safe integer."), expanded: [] };
    }
    const indices = rawIndices ?? [];
    const entryIds = Array.isArray(args.entryIds) ? args.entryIds.filter(
      (entryId) => typeof entryId === "string" && entryId.length > 0
    ) : [];
    const operationAddresses = Array.isArray(args.operationAddresses) ? args.operationAddresses.filter(
      (address) => typeof address === "string" && address.length > 0
    ) : [];
    const rawRange = args.entryRange;
    const rangeRecord = rawRange && typeof rawRange === "object" && !Array.isArray(rawRange) ? rawRange : void 0;
    const first = rangeRecord?.first;
    const last = rangeRecord?.last;
    if (!session) throw new Error("memory.expand requires a session");
    if (first === void 0 !== (last === void 0)) {
      throw new Error("memory.expand entryRange requires both first and last");
    }
    if (first !== void 0 && (typeof first !== "number" || typeof last !== "number" || !Number.isSafeInteger(first) || !Number.isSafeInteger(last) || first < 0 || last < first)) {
      return { session, error: addressError("Entry range requires safe integers with 0 <= first <= last."), expanded: [] };
    }
    const ref = resolveSessionTarget(this.context.agentDir, session);
    if (!ref) {
      return {
        session,
        error: { code: "session_not_found", message: `Session not found: ${session}` },
        expanded: []
      };
    }
    const liveResolver = liveBranchResolver(this.context);
    const initialState = fingerprintSource(ref.file);
    const initialLineage = reconstructSessionLineage(
      ref.file,
      branches,
      liveResolver?.(ref.file)
    );
    if (!initialState) {
      return {
        session: ref.file,
        error: { code: "source_unavailable", message: `Session source is unavailable: ${ref.file}` },
        expanded: []
      };
    }
    const sourceChanged = expectedSourceHash !== void 0 && initialState.sourceHash !== expectedSourceHash;
    const lineageChanged = expectedLineageFingerprint !== void 0 && initialLineage.fingerprint !== expectedLineageFingerprint;
    if (sourceChanged || lineageChanged) {
      return {
        session: ref.file,
        branches,
        error: stalePointerError(
          ref.file,
          expectedSourceHash,
          initialState.sourceHash,
          expectedLineageFingerprint,
          initialLineage.fingerprint
        ),
        expanded: []
      };
    }
    const expansionOptions = {
      lineage: initialLineage,
      indexThinking: true,
      indexToolOutput: true
    };
    const entryCount = normalizeSession(
      ref.file,
      Number.MAX_SAFE_INTEGER,
      expansionOptions
    ).entries.length;
    const outOfBounds = indices.find((index) => index >= entryCount);
    if (outOfBounds !== void 0) {
      return {
        session: ref.file,
        error: addressError(`Entry index ${outOfBounds} is outside 0..${Math.max(0, entryCount - 1)}.`, entryCount),
        expanded: []
      };
    }
    if (typeof last === "number" && last >= entryCount) {
      return {
        session: ref.file,
        error: addressError(`Entry range ends at ${last}, but the session has ${entryCount} entries.`, entryCount),
        expanded: []
      };
    }
    if (indices.length === 0 && entryIds.length === 0 && operationAddresses.length === 0 && (first === void 0 || last === void 0)) {
      return {
        session: ref.file,
        sourceHash: initialState.sourceHash,
        branches,
        lineageFingerprint: initialLineage.fingerprint,
        expanded: []
      };
    }
    const selection = {};
    if (indices.length > 0) selection.indices = indices;
    if (entryIds.length > 0) selection.entryIds = entryIds;
    if (operationAddresses.length > 0) selection.operationAddresses = operationAddresses;
    if (typeof first === "number" && typeof last === "number") {
      selection.entryRange = { first, last };
    }
    const expansion = expandSessionEntriesChecked(ref.file, selection, expansionOptions);
    const finalState = fingerprintSource(ref.file);
    const finalLineage = reconstructSessionLineage(
      ref.file,
      branches,
      liveResolver?.(ref.file)
    );
    if (!finalState || finalState.sourceHash !== initialState.sourceHash || finalLineage.fingerprint !== initialLineage.fingerprint) {
      return {
        session: ref.file,
        error: stalePointerError(
          ref.file,
          expectedSourceHash ?? initialState.sourceHash,
          finalState?.sourceHash ?? "",
          expectedLineageFingerprint ?? initialLineage.fingerprint,
          finalLineage.fingerprint
        ),
        expanded: []
      };
    }
    if ("error" in expansion) {
      return {
        session: ref.file,
        sourceHash: finalState.sourceHash,
        branches,
        lineageFingerprint: finalLineage.fingerprint,
        error: expansion.error,
        expanded: []
      };
    }
    return {
      session: ref.file,
      sourceHash: finalState.sourceHash,
      branches,
      lineageFingerprint: finalLineage.fingerprint,
      expanded: expansion.expanded
    };
  }
  async sessions(args) {
    const scope = typeof args.scope === "string" ? args.scope : void 0;
    const branches = parseBranches(args.branches, "memory.sessions");
    const limit = typeof args.limit === "number" && Number.isSafeInteger(args.limit) && args.limit >= 1 ? Math.min(args.limit, SESSIONS_MAX) : SESSIONS_MAX;
    const refs = resolveRefs(scope, this.context, true).slice(0, limit);
    const options = resolveIndexOptions(
      this.context.config,
      this.context.agentDir,
      branches,
      liveBranchResolver(this.context)
    );
    const index = loadTieredIndex(refs, resolveTierRefs(refs, this.context), options);
    const shards = new Map(index.shards.map((shard) => [shard.sessionFile, shard]));
    const digests = new Map(index.digests.map((digest) => [digest.file, digest]));
    const sessions = refs.map((ref) => {
      const tier = index.tiers.get(ref.file) ?? "cold";
      const shard = shards.get(ref.file);
      const digest = digests.get(ref.file);
      return {
        id: shard?.sessionId ?? digest?.sessionId ?? ref.id,
        file: ref.file,
        cwd: digest?.cwd ?? ref.cwd,
        mtime: ref.mtime,
        entryCount: shard?.entries.length ?? digest?.entryCount ?? 0,
        tier,
        branches,
        lineageFingerprint: shard?.lineageFingerprint ?? digest?.lineageFingerprint ?? null
      };
    });
    return { scope: scope ?? "session", branches, sessions };
  }
};

export {
  uniqueDeclaredKeyForSpelling,
  actionArgNormalizer,
  normalizeMemoryArgs,
  MemoryProvider
};
//# sourceMappingURL=chunk-76CXVOZC.js.map
