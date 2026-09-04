import {
  compareLexical,
  foldSessionDigest,
  lexicalTermCounts,
  planMemoryQuery,
  tokenizeLexical
} from "./chunk-E2LYJAID.js";
import {
  DEFAULT_MEMORY_INDEX_PRIVACY,
  normalizeSession
} from "./chunk-4OXEXLH6.js";

// src/memory/index.ts
import crypto2 from "node:crypto";
import fs2 from "node:fs";
import path from "node:path";

// src/memory/lineage.ts
import crypto from "node:crypto";
import fs from "node:fs";
var fingerprint = (branches, leafId, ids) => crypto.createHash("sha256").update(JSON.stringify({ branches, leafId, ids })).digest("hex");
var readPersistedNodes = (sessionFile) => {
  let content;
  try {
    content = fs.readFileSync(sessionFile, "utf8");
  } catch {
    return [];
  }
  const nodes = [];
  let ordinal = 0;
  for (const line of content.split("\n")) {
    if (!line.trim()) continue;
    let raw;
    try {
      raw = JSON.parse(line);
    } catch {
      continue;
    }
    if (raw.type === "session") continue;
    if (typeof raw.id === "string" && (raw.parentId === null || typeof raw.parentId === "string")) {
      nodes.push({ id: raw.id, parentId: raw.parentId, ordinal });
    }
    ordinal += 1;
  }
  return nodes;
};
var allLineage = () => ({
  branches: "all",
  leafId: null,
  entryOrdinals: null,
  fingerprint: fingerprint("all", null, []),
  coverageReasons: []
});
var reconstructSessionLineage = (sessionFile, branches, liveBranch) => {
  if (branches === "all") return allLineage();
  const nodes = readPersistedNodes(sessionFile);
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const liveIds = liveBranch?.entries.flatMap((entry) => {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) return [];
    const id = entry.id;
    return typeof id === "string" ? [id] : [];
  });
  const leafId = liveBranch ? liveBranch.leafId : nodes[nodes.length - 1]?.id ?? null;
  const path2 = [];
  const reasons = /* @__PURE__ */ new Set();
  if (liveIds) {
    for (const id of liveIds) {
      const node = byId.get(id);
      if (node) path2.push(node);
    }
  } else {
    const seen = /* @__PURE__ */ new Set();
    let current = leafId ? byId.get(leafId) : void 0;
    while (current) {
      if (seen.has(current.id)) {
        reasons.add("invalid_parent_graph");
        break;
      }
      seen.add(current.id);
      path2.push(current);
      current = current.parentId ? byId.get(current.parentId) : void 0;
    }
    path2.reverse();
  }
  const ids = liveIds ?? path2.map((node) => node.id);
  return {
    branches: "active",
    leafId,
    entryOrdinals: new Set(path2.map((node) => node.ordinal)),
    fingerprint: fingerprint("active", leafId, ids),
    coverageReasons: [...reasons].sort()
  };
};

// src/memory/index.ts
var MEMORY_CACHE_VERSION = 6;
var DEFAULT_HOT_SESSIONS = 50;
var DEFAULT_MAX_COLD_VOCABULARY_BYTES = 512 * 1024;
var DEFAULT_MAX_COLD_CACHE_BYTES = 1024 * 1024;
var DEFAULT_MAX_SYNC_SESSIONS = 1e4;
var DEFAULT_MAX_SYNC_SOURCE_BYTES = 512 * 1024 * 1024;
var DEFAULT_MAX_CACHE_CLEANUP_FILES = 1e5;
var cacheBaseName = (sessionFile) => {
  const hash = crypto2.createHash("sha1").update(sessionFile).digest("hex").slice(0, 16);
  const safeBase = path.basename(sessionFile).replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${hash}-${safeBase}`;
};
var cacheModeSuffix = (branches) => branches === "all" ? ".all" : "";
var shardPathForSession = (sessionFile, indexDir, branches = "active") => path.join(indexDir, `${cacheBaseName(sessionFile)}${cacheModeSuffix(branches)}.json`);
var digestPathForSession = (sessionFile, indexDir, branches = "active") => path.join(indexDir, `${cacheBaseName(sessionFile)}${cacheModeSuffix(branches)}.digest.json`);
var policyPrivacy = (options) => `thinking:${options.indexThinking ?? DEFAULT_MEMORY_INDEX_PRIVACY.indexThinking};tool-output:${options.indexToolOutput ?? DEFAULT_MEMORY_INDEX_PRIVACY.indexToolOutput}`;
var shardPolicy = (options, lineage) => `entry:${options.maxEntryChars};branches:${lineage.branches};lineage:${lineage.fingerprint};${policyPrivacy(options)}`;
var digestPolicy = (options, lineage) => `vocab:${options.maxColdVocabularyBytes ?? DEFAULT_MAX_COLD_VOCABULARY_BYTES};cache:${options.maxColdCacheBytes ?? DEFAULT_MAX_COLD_CACHE_BYTES};branches:${lineage.branches};lineage:${lineage.fingerprint};${policyPrivacy(options)}`;
var resolveLineage = (sessionFile, options) => reconstructSessionLineage(
  sessionFile,
  options.branches ?? "active",
  options.liveBranchForFile?.(sessionFile)
);
var normalizationOptions = (options, lineage) => ({
  lineage,
  indexThinking: options.indexThinking ?? DEFAULT_MEMORY_INDEX_PRIVACY.indexThinking,
  indexToolOutput: options.indexToolOutput ?? DEFAULT_MEMORY_INDEX_PRIVACY.indexToolOutput
});
var readShardFile = (filePath, maxBytes = DEFAULT_MAX_SYNC_SOURCE_BYTES) => {
  try {
    const stat = fs2.statSync(filePath);
    if (!stat.isFile() || stat.size > maxBytes) return null;
    const parsed = JSON.parse(fs2.readFileSync(filePath, "utf8"));
    if (parsed.cacheVersion !== MEMORY_CACHE_VERSION || parsed.kind !== "shard" || typeof parsed.sessionFile !== "string" || typeof parsed.sessionId !== "string" || typeof parsed.sourceHash !== "string" || parsed.sourceHash.length !== 64 || parsed.branches !== "active" && parsed.branches !== "all" || typeof parsed.lineageFingerprint !== "string" || parsed.lineageFingerprint.length !== 64 || typeof parsed.policy !== "string" || typeof parsed.cacheBytes !== "number" || parsed.cacheBytes !== stat.size || typeof parsed.cacheSourceRatio !== "number" || typeof parsed.totalEntryCount !== "number" || typeof parsed.indexCoverage !== "object" || parsed.indexCoverage === null || typeof parsed.indexCoverage.complete !== "boolean" || !Array.isArray(parsed.indexCoverage.reasons) || !parsed.indexCoverage.reasons.every((reason) => typeof reason === "string") || !Array.isArray(parsed.entries) || !parsed.entries.every((entry) => entry !== null && typeof entry === "object" && typeof entry.index === "number" && typeof entry.sessionFile === "string" && typeof entry.text === "string")) return null;
    return parsed;
  } catch {
    return null;
  }
};
var readDigestFile = (filePath, maxBytes = DEFAULT_MAX_COLD_CACHE_BYTES) => {
  try {
    const stat = fs2.statSync(filePath);
    if (!stat.isFile() || stat.size > maxBytes) return null;
    const parsed = JSON.parse(fs2.readFileSync(filePath, "utf8"));
    if (parsed.cacheVersion !== MEMORY_CACHE_VERSION || parsed.kind !== "digest" || typeof parsed.sessionId !== "string" || typeof parsed.file !== "string" || typeof parsed.sourceHash !== "string" || parsed.sourceHash.length !== 64 || parsed.branches !== "active" && parsed.branches !== "all" || typeof parsed.lineageFingerprint !== "string" || parsed.lineageFingerprint.length !== 64 || typeof parsed.policy !== "string" || typeof parsed.cacheBytes !== "number" || parsed.cacheBytes !== stat.size || typeof parsed.cacheSourceRatio !== "number" || !Array.isArray(parsed.filesTouched) || !Array.isArray(parsed.vocabulary) || !parsed.vocabulary.every((term, index) => typeof term === "string" && (index === 0 || parsed.vocabulary[index - 1] < term)) || !Array.isArray(parsed.addresses) || !parsed.addresses.every((address) => Array.isArray(address) && address.length === 10 && typeof address[0] === "number" && (address[1] === null || typeof address[1] === "string") && (address[2] === null || typeof address[2] === "string") && (address[3] === null || typeof address[3] === "string") && (address[4] === null || typeof address[4] === "string") && (address[5] === null || typeof address[5] === "number") && (address[6] === null || typeof address[6] === "string") && (address[7] === null || typeof address[7] === "string") && (address[8] === null || typeof address[8] === "string") && (address[9] === null || address[9] === "succeeded" || address[9] === "failed" || address[9] === "aborted" || address[9] === "timed_out")) || typeof parsed.indexCoverage !== "object" || parsed.indexCoverage === null || typeof parsed.indexCoverage.complete !== "boolean" || typeof parsed.indexCoverage.vocabularyBytes !== "number" || !Array.isArray(parsed.indexCoverage.reasons) || !parsed.indexCoverage.reasons.every((reason) => typeof reason === "string") || typeof parsed.mtime !== "number" || typeof parsed.size !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
};
var serializedBytes = (value) => Buffer.byteLength(JSON.stringify(value), "utf8");
var applyCacheMetrics = (value) => {
  let previous = -1;
  for (let iteration = 0; iteration < 5; iteration += 1) {
    const bytes = serializedBytes(value);
    value.cacheBytes = bytes;
    value.cacheSourceRatio = value.size === 0 ? 0 : Number((bytes / value.size).toFixed(6));
    if (bytes === previous) break;
    previous = bytes;
  }
  value.cacheBytes = serializedBytes(value);
  value.cacheSourceRatio = value.size === 0 ? 0 : Number((value.cacheBytes / value.size).toFixed(6));
  return value;
};
var writeCacheFile = (filePath, value) => {
  try {
    fs2.mkdirSync(path.dirname(filePath), { recursive: true, mode: 448 });
    try {
      fs2.chmodSync(path.dirname(filePath), 448);
    } catch {
    }
    fs2.writeFileSync(filePath, JSON.stringify(value), { encoding: "utf8", mode: 384 });
    try {
      fs2.chmodSync(filePath, 384);
    } catch {
    }
    return true;
  } catch {
    return false;
  }
};
var removeCacheFile = (filePath) => {
  try {
    fs2.rmSync(filePath, { force: true, recursive: true });
  } catch {
  }
};
var fingerprintSource = (file) => {
  try {
    const content = fs2.readFileSync(file);
    const stat = fs2.statSync(file);
    if (!stat.isFile()) return null;
    return {
      mtime: stat.mtimeMs,
      size: stat.size,
      sourceHash: crypto2.createHash("sha256").update(content).digest("hex")
    };
  } catch {
    return null;
  }
};
var isCacheFresh = (cache, state, policy) => cache !== null && cache.mtime === state.mtime && cache.size === state.size && cache.sourceHash === state.sourceHash && cache.policy === policy;
var missingShard = (ref, lineage, reason = "source_unavailable") => ({
  cacheVersion: MEMORY_CACHE_VERSION,
  kind: "shard",
  sessionFile: ref.file,
  sessionId: ref.id,
  mtime: 0,
  size: 0,
  sourceHash: "",
  branches: lineage.branches,
  lineageFingerprint: lineage.fingerprint,
  policy: reason,
  cacheBytes: 0,
  cacheSourceRatio: 0,
  entries: [],
  totalEntryCount: 0,
  indexCoverage: { complete: false, reasons: [reason] },
  tier: "hot",
  indexReason: reason
});
var loadShard = (ref, options) => {
  const lineage = resolveLineage(ref.file, options);
  const filePath = shardPathForSession(ref.file, options.indexDir, lineage.branches);
  const state = fingerprintSource(ref.file);
  if (!state) {
    removeCacheFile(filePath);
    return missingShard(ref, lineage);
  }
  const policy = shardPolicy(options, lineage);
  const cached = readShardFile(
    filePath,
    options.maxSyncSourceBytes ?? DEFAULT_MAX_SYNC_SOURCE_BYTES
  );
  if (isCacheFresh(cached, state, policy) && cached?.sessionFile === ref.file) return cached;
  if (fs2.existsSync(filePath)) removeCacheFile(filePath);
  const { entries, header, indexCoverage } = normalizeSession(
    ref.file,
    options.maxEntryChars,
    normalizationOptions(options, lineage)
  );
  const finalState = fingerprintSource(ref.file);
  const finalLineage = resolveLineage(ref.file, options);
  if (!finalState || finalState.sourceHash !== state.sourceHash || finalLineage.fingerprint !== lineage.fingerprint) {
    removeCacheFile(filePath);
    return missingShard(
      ref,
      finalLineage,
      finalState?.sourceHash === state.sourceHash ? "lineage_changed_during_index" : "source_changed_during_index"
    );
  }
  const shard = applyCacheMetrics({
    cacheVersion: MEMORY_CACHE_VERSION,
    kind: "shard",
    sessionFile: ref.file,
    sessionId: header?.sessionId ?? ref.id,
    ...state,
    branches: lineage.branches,
    lineageFingerprint: lineage.fingerprint,
    policy,
    cacheBytes: 0,
    cacheSourceRatio: 0,
    entries,
    totalEntryCount: entries.length,
    indexCoverage,
    tier: "hot"
  });
  writeCacheFile(filePath, shard);
  return shard;
};
var hydrateShard = (ref, options, entryRange) => {
  const lineage = resolveLineage(ref.file, options);
  const state = fingerprintSource(ref.file);
  if (!state) return { ...missingShard(ref, lineage), tier: "cold" };
  const { entries, header, indexCoverage } = normalizeSession(
    ref.file,
    options.maxEntryChars,
    normalizationOptions(options, lineage)
  );
  const finalState = fingerprintSource(ref.file);
  const finalLineage = resolveLineage(ref.file, options);
  if (!finalState || finalState.sourceHash !== state.sourceHash || finalLineage.fingerprint !== lineage.fingerprint) {
    return {
      ...missingShard(
        ref,
        finalLineage,
        finalState?.sourceHash === state.sourceHash ? "lineage_changed_during_index" : "source_changed_during_index"
      ),
      tier: "cold"
    };
  }
  const selected = entryRange ? entries.filter((entry) => entry.index >= entryRange.first && entry.index <= entryRange.last) : entries;
  return {
    cacheVersion: MEMORY_CACHE_VERSION,
    kind: "shard",
    sessionFile: ref.file,
    sessionId: header?.sessionId ?? ref.id,
    ...state,
    branches: lineage.branches,
    lineageFingerprint: lineage.fingerprint,
    policy: shardPolicy(options, lineage),
    cacheBytes: 0,
    cacheSourceRatio: 0,
    entries: selected,
    totalEntryCount: entries.length,
    indexCoverage,
    tier: "cold"
  };
};
var missingDigest = (ref, lineage, reason = "source_unavailable") => ({
  cacheVersion: MEMORY_CACHE_VERSION,
  kind: "digest",
  sessionId: ref.id,
  file: ref.file,
  cwd: ref.cwd,
  firstTs: null,
  lastTs: null,
  entryCount: 0,
  filesTouched: [],
  toolHistogram: {},
  errorCount: 0,
  vocabulary: [],
  addresses: [],
  indexCoverage: { complete: false, vocabularyBytes: 2, reasons: [reason] },
  mtime: 0,
  size: 0,
  sourceHash: "",
  branches: lineage.branches,
  lineageFingerprint: lineage.fingerprint,
  policy: reason,
  cacheBytes: 0,
  cacheSourceRatio: 0
});
var maxFittingPrefix = (values, fits) => {
  let low = 0;
  let high = values.length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (fits(values.slice(0, middle))) low = middle;
    else high = middle - 1;
  }
  return values.slice(0, low);
};
var fitDigestCache = (digest, maxBytes) => {
  applyCacheMetrics(digest);
  if (digest.cacheBytes <= maxBytes) return digest;
  digest.indexCoverage.complete = false;
  if (!digest.indexCoverage.reasons.includes("max_cold_cache_bytes")) {
    digest.indexCoverage.reasons.push("max_cold_cache_bytes");
  }
  digest.addresses = maxFittingPrefix(digest.addresses, (addresses) => {
    digest.addresses = addresses;
    applyCacheMetrics(digest);
    return digest.cacheBytes <= maxBytes;
  });
  applyCacheMetrics(digest);
  if (digest.cacheBytes <= maxBytes) return digest;
  digest.vocabulary = maxFittingPrefix(digest.vocabulary, (vocabulary) => {
    digest.vocabulary = vocabulary;
    digest.indexCoverage.vocabularyBytes = serializedBytes(vocabulary);
    applyCacheMetrics(digest);
    return digest.cacheBytes <= maxBytes;
  });
  digest.indexCoverage.vocabularyBytes = serializedBytes(digest.vocabulary);
  return applyCacheMetrics(digest);
};
var loadDigest = (ref, options) => {
  const lineage = resolveLineage(ref.file, options);
  const filePath = digestPathForSession(ref.file, options.indexDir, lineage.branches);
  const state = fingerprintSource(ref.file);
  if (!state) {
    removeCacheFile(filePath);
    return missingDigest(ref, lineage);
  }
  const policy = digestPolicy(options, lineage);
  const maxCacheBytes = options.maxColdCacheBytes ?? DEFAULT_MAX_COLD_CACHE_BYTES;
  const cached = readDigestFile(filePath, maxCacheBytes);
  if (isCacheFresh(cached, state, policy) && cached?.file === ref.file && serializedBytes(cached) <= maxCacheBytes) return cached;
  if (fs2.existsSync(filePath)) removeCacheFile(filePath);
  const { entries, header, indexCoverage } = normalizeSession(
    ref.file,
    Number.MAX_SAFE_INTEGER,
    normalizationOptions(options, lineage)
  );
  const finalState = fingerprintSource(ref.file);
  const finalLineage = resolveLineage(ref.file, options);
  if (!finalState || finalState.sourceHash !== state.sourceHash || finalLineage.fingerprint !== lineage.fingerprint) {
    removeCacheFile(filePath);
    return missingDigest(
      ref,
      finalLineage,
      finalState?.sourceHash === state.sourceHash ? "lineage_changed_during_index" : "source_changed_during_index"
    );
  }
  const digest = foldSessionDigest({
    sessionId: header?.sessionId ?? ref.id,
    file: ref.file,
    cwd: header?.cwd ?? ref.cwd,
    entries,
    maxVocabularyBytes: options.maxColdVocabularyBytes ?? DEFAULT_MAX_COLD_VOCABULARY_BYTES,
    normalizationCoverage: indexCoverage
  });
  const persisted = fitDigestCache({
    cacheVersion: MEMORY_CACHE_VERSION,
    kind: "digest",
    ...digest,
    ...state,
    branches: lineage.branches,
    lineageFingerprint: lineage.fingerprint,
    policy,
    cacheBytes: 0,
    cacheSourceRatio: 0
  }, maxCacheBytes);
  if (persisted.cacheBytes <= maxCacheBytes) writeCacheFile(filePath, persisted);
  return persisted;
};
var compareRefsByRecency = (left, right) => {
  if (right.mtime !== left.mtime) return right.mtime - left.mtime;
  return compareLexical(left.file, right.file);
};
var classifySessionTiers = (refs, hotSessions = DEFAULT_HOT_SESSIONS) => {
  const sorted = [...refs].sort(compareRefsByRecency);
  const hot = new Set(sorted.slice(0, Math.max(0, Math.floor(hotSessions))).map((ref) => ref.file));
  return new Map(sorted.map((ref) => [ref.file, hot.has(ref.file) ? "hot" : "cold"]));
};
var cleanupCacheDirectory = (indexDir, branchesToClean, maxFiles, maxBytes) => {
  let directory;
  try {
    directory = fs2.opendirSync(indexDir);
  } catch {
    return { complete: true, reasons: [] };
  }
  let inspected = 0;
  let inspectedBytes = 0;
  try {
    while (true) {
      const entry = directory.readSync();
      if (!entry) return { complete: true, reasons: [] };
      if (!entry.name.endsWith(".json")) continue;
      if (inspected >= maxFiles) {
        return { complete: false, reasons: ["cache_cleanup_budget"] };
      }
      inspected += 1;
      const cacheFile = path.join(indexDir, entry.name);
      if (!entry.isFile()) {
        removeCacheFile(cacheFile);
        continue;
      }
      let cacheBytes;
      try {
        cacheBytes = fs2.statSync(cacheFile).size;
      } catch {
        removeCacheFile(cacheFile);
        continue;
      }
      if (inspectedBytes + cacheBytes > maxBytes) {
        return { complete: false, reasons: ["cache_cleanup_budget"] };
      }
      inspectedBytes += cacheBytes;
      try {
        const parsed = JSON.parse(fs2.readFileSync(cacheFile, "utf8"));
        const kind = parsed.kind;
        const source = kind === "shard" && typeof parsed.sessionFile === "string" ? parsed.sessionFile : kind === "digest" && typeof parsed.file === "string" ? parsed.file : null;
        const branches = parsed.branches === "active" || parsed.branches === "all" ? parsed.branches : null;
        if (branches !== null && branches !== branchesToClean) continue;
        const expected = source && branches && kind === "shard" ? shardPathForSession(source, indexDir, branches) : source && branches && kind === "digest" ? digestPathForSession(source, indexDir, branches) : null;
        const structurallyValid = kind === "shard" ? readShardFile(cacheFile, cacheBytes) !== null : kind === "digest" ? readDigestFile(cacheFile, cacheBytes) !== null : false;
        if (parsed.cacheVersion !== MEMORY_CACHE_VERSION || source === null || expected !== cacheFile || !fs2.existsSync(source) || !structurallyValid) removeCacheFile(cacheFile);
      } catch {
        removeCacheFile(cacheFile);
      }
    }
  } finally {
    directory.closeSync();
  }
};
var sourceSize = (file) => {
  try {
    const stat = fs2.statSync(file);
    return stat.isFile() ? stat.size : null;
  } catch {
    return null;
  }
};
var loadTieredIndex = (refs, allRefs, options, hydrate = false, entryRange) => {
  const cleanup = cleanupCacheDirectory(
    options.indexDir,
    options.branches ?? "active",
    options.maxCacheCleanupFiles ?? DEFAULT_MAX_CACHE_CLEANUP_FILES,
    options.maxSyncSourceBytes ?? DEFAULT_MAX_SYNC_SOURCE_BYTES
  );
  const tierRefs = allRefs.length > 0 ? allRefs : refs;
  const tiers = classifySessionTiers(tierRefs, options.hotSessions ?? DEFAULT_HOT_SESSIONS);
  const maxSessions = options.maxSyncSessions ?? DEFAULT_MAX_SYNC_SESSIONS;
  const maxSourceBytes = options.maxSyncSourceBytes ?? DEFAULT_MAX_SYNC_SOURCE_BYTES;
  const shards = [];
  const digests = [];
  const reasons = new Set(cleanup.reasons);
  let indexedSessions = 0;
  let incompleteSessions = 0;
  let processedSessions = 0;
  let processedSourceBytes = 0;
  for (const ref of refs) {
    const size = sourceSize(ref.file);
    if (size === null) {
      reasons.add("source_unavailable");
      continue;
    }
    if (processedSessions >= maxSessions) {
      reasons.add("max_sync_sessions");
      continue;
    }
    const tier = tiers.get(ref.file) ?? "cold";
    const sourceWorkBytes = size * (hydrate && tier === "cold" ? 6 : 3);
    if (processedSourceBytes + sourceWorkBytes > maxSourceBytes) {
      reasons.add("max_sync_source_bytes");
      continue;
    }
    processedSessions += 1;
    processedSourceBytes += sourceWorkBytes;
    try {
      if (hydrate) {
        if (tier === "cold") loadDigest(ref, options);
        const shard = hydrateShard(ref, options, entryRange);
        shards.push(shard);
        if (shard.sourceHash) indexedSessions += 1;
        else reasons.add(shard.indexReason ?? "source_unavailable");
        if (shard.sourceHash && !shard.indexCoverage.complete) {
          incompleteSessions += 1;
          for (const reason of shard.indexCoverage.reasons) reasons.add(reason);
        }
      } else if (tier === "hot") {
        const shard = loadShard(ref, options);
        removeCacheFile(digestPathForSession(
          ref.file,
          options.indexDir,
          options.branches ?? "active"
        ));
        shards.push(shard);
        if (shard.sourceHash) indexedSessions += 1;
        else reasons.add(shard.indexReason ?? "source_unavailable");
        if (shard.sourceHash && !shard.indexCoverage.complete) {
          incompleteSessions += 1;
          for (const reason of shard.indexCoverage.reasons) reasons.add(reason);
        }
      } else {
        const digest = loadDigest(ref, options);
        removeCacheFile(shardPathForSession(
          ref.file,
          options.indexDir,
          options.branches ?? "active"
        ));
        digests.push(digest);
        if (digest.sourceHash) indexedSessions += 1;
        if (!digest.indexCoverage.complete) {
          incompleteSessions += 1;
          for (const reason of digest.indexCoverage.reasons) reasons.add(reason);
        }
      }
    } catch {
      reasons.add("index_error");
    }
  }
  const eligibleSessions = refs.length;
  const staleSessions = eligibleSessions - indexedSessions;
  return {
    shards,
    digests,
    refs,
    tiers,
    coverage: {
      complete: cleanup.complete && staleSessions === 0 && incompleteSessions === 0,
      indexedSessions,
      eligibleSessions,
      staleSessions,
      incompleteSessions,
      reasons: [...reasons].sort(compareLexical)
    }
  };
};
var matchesFilters = (entry, filters) => {
  if (filters.role !== void 0 && entry.role !== filters.role) return false;
  if (filters.tool !== void 0 && entry.toolName !== filters.tool) return false;
  if (filters.ref !== void 0 && entry.ref !== filters.ref) return false;
  if (filters.provider !== void 0 && entry.provider !== filters.provider) return false;
  if (filters.action !== void 0 && entry.action !== filters.action) return false;
  if (filters.outcome !== void 0 && entry.outcome !== filters.outcome) return false;
  if (filters.since !== void 0 && entry.timestamp !== null && entry.timestamp < filters.since) return false;
  if (filters.until !== void 0 && entry.timestamp !== null && entry.timestamp > filters.until) return false;
  return true;
};
var bm25Score = (shards, terms, filters, candidateLimit = Number.MAX_SAFE_INTEGER) => {
  const queryTerms = [...new Set(terms.flatMap((term) => tokenizeLexical(term)))];
  const matching = [];
  for (const shard of shards) {
    for (const entry of shard.entries) {
      if (matchesFilters(entry, filters) && matching.length < candidateLimit) {
        matching.push({ entry, mtime: shard.mtime, counts: lexicalTermCounts(entry.text) });
      }
    }
  }
  if (matching.length === 0 || queryTerms.length === 0) return [];
  const lengths = matching.map((item) => Math.max(1, [...item.counts.values()].reduce((a, b) => a + b, 0)));
  const averageLength = lengths.reduce((sum, length) => sum + length, 0) / matching.length;
  const documentFrequency = /* @__PURE__ */ new Map();
  for (const item of matching) {
    for (const term of queryTerms) {
      if ((item.counts.get(term) ?? 0) > 0) {
        documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
      }
    }
  }
  const K = 1.2;
  const B = 0.75;
  const results = [];
  for (let index = 0; index < matching.length; index += 1) {
    const item = matching[index];
    let score = 0;
    for (const term of queryTerms) {
      const tf = item.counts.get(term) ?? 0;
      if (tf === 0) continue;
      const df = documentFrequency.get(term) ?? 0;
      const idf = Math.log((matching.length - df + 0.5) / (df + 0.5) + 1);
      const normalized = tf * (K + 1) / (tf + K * (1 - B + B * (lengths[index] / averageLength)));
      score += idf * normalized;
    }
    if (score > 0) results.push({ entry: item.entry, sessionMtime: item.mtime, score });
  }
  results.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if (right.sessionMtime !== left.sessionMtime) return right.sessionMtime - left.sessionMtime;
    if (left.entry.index !== right.entry.index) return left.entry.index - right.entry.index;
    return compareLexical(left.entry.sessionFile, right.entry.sessionFile);
  });
  return results;
};
var recentEntries = (shards, filters, limit) => {
  const all = [];
  for (const shard of shards) {
    for (const entry of shard.entries) {
      if (matchesFilters(entry, filters)) all.push({ entry, sessionMtime: shard.mtime });
    }
  }
  all.sort((left, right) => {
    if (right.sessionMtime !== left.sessionMtime) return right.sessionMtime - left.sessionMtime;
    if (left.entry.index !== right.entry.index) return left.entry.index - right.entry.index;
    return compareLexical(left.entry.sessionFile, right.entry.sessionFile);
  });
  return all.slice(0, Math.max(0, limit));
};

// src/memory/regex.ts
import { Worker } from "node:worker_threads";
var WORKER_SOURCE = String.raw`
const { parentPort } = require("node:worker_threads");
parentPort.on("message", ({ pattern, haystacks }) => {
  try {
    const regex = new RegExp(pattern, "iu");
    const matched = [];
    for (let index = 0; index < haystacks.length; index += 1) {
      if (regex.test(haystacks[index])) matched.push(index);
    }
    parentPort.postMessage({ matched });
  } catch (error) {
    parentPort.postMessage({
      error: {
        code: "invalid_regex",
        message: error instanceof Error ? error.message : String(error),
      },
    });
  }
});
`;
var executeBoundedRegex = async (pattern, haystacks, limits) => {
  const patternBytes = Buffer.byteLength(pattern, "utf8");
  if (patternBytes > limits.maxPatternBytes) {
    return {
      complete: false,
      matched: [],
      error: {
        code: "regex_pattern_too_large",
        message: `Regex pattern is ${patternBytes} bytes; limit is ${limits.maxPatternBytes}.`
      }
    };
  }
  return new Promise((resolve) => {
    let worker;
    try {
      worker = new Worker(WORKER_SOURCE, {
        eval: true,
        resourceLimits: { maxOldGenerationSizeMb: 16, maxYoungGenerationSizeMb: 4 }
      });
    } catch (error) {
      resolve({
        complete: false,
        matched: [],
        error: {
          code: "regex_worker_error",
          message: error instanceof Error ? error.message : String(error)
        }
      });
      return;
    }
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      void worker.terminate();
      resolve(result);
    };
    const timer = setTimeout(() => {
      finish({
        complete: false,
        matched: [],
        error: {
          code: "regex_timeout",
          message: `Regex execution exceeded ${limits.timeoutMs} ms.`
        }
      });
    }, limits.timeoutMs);
    worker.once("message", (message) => {
      const record = message;
      if (record.error) {
        finish({ complete: false, matched: [], error: record.error });
        return;
      }
      if (Array.isArray(record.matched) && record.matched.every((value) => Number.isInteger(value))) {
        finish({ complete: true, matched: record.matched });
        return;
      }
      finish({
        complete: false,
        matched: [],
        error: { code: "regex_worker_error", message: "Regex worker returned an invalid result." }
      });
    });
    worker.once("error", (error) => {
      finish({
        complete: false,
        matched: [],
        error: {
          code: "regex_worker_error",
          message: error instanceof Error ? error.message : String(error)
        }
      });
    });
    worker.postMessage({ pattern, haystacks });
  });
};

// src/memory/search.ts
var DEFAULT_REGEX_MAX_PATTERN_BYTES = 1024;
var DEFAULT_REGEX_MAX_HAYSTACK_TERMS = 2e4;
var DEFAULT_REGEX_MAX_HAYSTACK_BYTES = 2 * 1024 * 1024;
var DEFAULT_REGEX_TIMEOUT_MS = 250;
var DEFAULT_SEARCH_MAX_CANDIDATE_ENTRIES = 5e4;
var DEFAULT_SEARCH_MAX_CANDIDATE_DIGESTS = 1e4;
var DEFAULT_SEARCH_MAX_CANDIDATE_ITEMS = 1e4;
var segmentStartRoles = /* @__PURE__ */ new Set(["user", "bashExecution", "compaction"]);
var matchesFilters2 = (entry, filters) => {
  if (filters.role !== void 0 && entry.role !== filters.role) return false;
  if (filters.tool !== void 0 && entry.toolName !== filters.tool) return false;
  if (filters.ref !== void 0 && entry.ref !== filters.ref) return false;
  if (filters.provider !== void 0 && entry.provider !== filters.provider) return false;
  if (filters.action !== void 0 && entry.action !== filters.action) return false;
  if (filters.outcome !== void 0 && entry.outcome !== filters.outcome) return false;
  if (filters.since !== void 0 && entry.timestamp !== null && entry.timestamp < filters.since) return false;
  if (filters.until !== void 0 && entry.timestamp !== null && entry.timestamp > filters.until) return false;
  return true;
};
var addressMatchesFilters = (address, filters) => {
  if (filters.role !== void 0 && address[3] !== filters.role) return false;
  if (filters.tool !== void 0 && address[4] !== filters.tool) return false;
  if (filters.ref !== void 0 && address[6] !== filters.ref) return false;
  if (filters.provider !== void 0 && address[7] !== filters.provider) return false;
  if (filters.action !== void 0 && address[8] !== filters.action) return false;
  if (filters.outcome !== void 0 && address[9] !== filters.outcome) return false;
  if (filters.since !== void 0 && address[5] !== null && address[5] < filters.since) return false;
  if (filters.until !== void 0 && address[5] !== null && address[5] > filters.until) return false;
  return true;
};
var hasFilters = (filters) => Object.keys(filters).length > 0;
var sortLocated = (located) => {
  located.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if (right.sessionMtime !== left.sessionMtime) return right.sessionMtime - left.sessionMtime;
    if (left.entry.index !== right.entry.index) return left.entry.index - right.entry.index;
    return compareLexical(left.entry.sessionFile, right.entry.sessionFile);
  });
};
var filteredEntryCount = (shards, filters) => {
  let count = 0;
  for (const shard of shards) {
    for (const entry of shard.entries) if (matchesFilters2(entry, filters)) count += 1;
  }
  return count;
};
var collectTermMatches = (shards, terms, filters, maxEntries) => {
  const scored = bm25Score(shards, terms, filters, maxEntries);
  return scored.map((item) => ({
    entry: item.entry,
    matched: true,
    sessionMtime: item.sessionMtime,
    score: item.score
  }));
};
var collectRecent = (shards, filters, maxEntries, score = 0) => recentEntries(shards, filters, maxEntries).map((item) => ({
  entry: item.entry,
  matched: true,
  sessionMtime: item.sessionMtime,
  score
}));
var digestStructuralMatchCount = (digest, filters) => hasFilters(filters) ? digest.addresses.filter((address) => addressMatchesFilters(address, filters)).length : 0;
var digestCanMatchFilters = (digest, filters) => !hasFilters(filters) || digestStructuralMatchCount(digest, filters) > 0;
var toDigestHit = (digest, score, matchedTerms, matchedStructuralEntries = 0) => ({
  sessionId: digest.sessionId,
  sessionFile: digest.file,
  sourceHash: digest.sourceHash,
  branches: digest.branches,
  lineageFingerprint: digest.lineageFingerprint,
  cwd: digest.cwd,
  lastTs: digest.lastTs,
  sessionMtime: digest.mtime,
  score,
  tier: "cold",
  matchedTerms,
  matchedStructuralEntries
});
var scoreDigestTerms = (digests, terms, filters, maxDigests) => {
  if (digests.length === 0 || terms.length === 0) return { hits: [], complete: true };
  const candidates = [];
  let matchingDigests = 0;
  for (const digest of digests) {
    if (!digestCanMatchFilters(digest, filters)) continue;
    const vocabulary = new Set(digest.vocabulary);
    const matches = terms.filter((term) => vocabulary.has(term));
    if (matches.length === 0) continue;
    matchingDigests += 1;
    if (candidates.length < maxDigests) {
      candidates.push({
        digest,
        matches,
        structuralMatches: digestStructuralMatchCount(digest, filters)
      });
    }
  }
  const documentFrequency = /* @__PURE__ */ new Map();
  for (const candidate of candidates) {
    for (const term of candidate.matches) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }
  const hits = candidates.map((candidate) => {
    const score = candidate.matches.reduce((total, term) => {
      const df = documentFrequency.get(term) ?? 0;
      return total + Math.log((candidates.length - df + 0.5) / (df + 0.5) + 1);
    }, 0);
    return toDigestHit(
      candidate.digest,
      score,
      candidate.matches.length,
      candidate.structuralMatches
    );
  });
  return { hits, complete: matchingDigests <= maxDigests };
};
var collectRegexTargets = (shards, digests, filters, maxTerms, maxBytes) => {
  const haystacks = [];
  const targets = [];
  let bytes = 0;
  let complete = true;
  const reasons = /* @__PURE__ */ new Set();
  const append = (haystack, target) => {
    const nextBytes = Buffer.byteLength(haystack, "utf8");
    if (haystacks.length >= maxTerms) {
      complete = false;
      reasons.add("regex_max_haystack_terms");
      return false;
    }
    if (bytes + nextBytes > maxBytes) {
      complete = false;
      reasons.add("regex_max_haystack_bytes");
      return false;
    }
    haystacks.push(haystack);
    targets.push(target);
    bytes += nextBytes;
    return true;
  };
  outer: for (const shard of shards) {
    for (const entry of shard.entries) {
      if (!matchesFilters2(entry, filters)) continue;
      if (!append(entry.text, { kind: "hot", shard, entry })) break outer;
    }
  }
  if (complete) {
    outer: for (const digest of digests) {
      if (!digestCanMatchFilters(digest, filters)) continue;
      for (const term of digest.vocabulary) {
        if (!append(term, { kind: "cold", digest })) break outer;
      }
    }
  }
  return { haystacks, targets, complete, reasons: [...reasons].sort(compareLexical) };
};
var searchRegex = async (shards, digests, pattern, filters, query) => {
  const limits = query.regexLimits ?? {
    maxPatternBytes: DEFAULT_REGEX_MAX_PATTERN_BYTES,
    maxHaystackTerms: DEFAULT_REGEX_MAX_HAYSTACK_TERMS,
    maxHaystackBytes: DEFAULT_REGEX_MAX_HAYSTACK_BYTES,
    timeoutMs: DEFAULT_REGEX_TIMEOUT_MS
  };
  const collected = collectRegexTargets(
    shards,
    digests,
    filters,
    limits.maxHaystackTerms,
    limits.maxHaystackBytes
  );
  const execution = await executeBoundedRegex(pattern, collected.haystacks, {
    maxPatternBytes: limits.maxPatternBytes,
    timeoutMs: limits.timeoutMs
  });
  if (!execution.complete) {
    return {
      located: [],
      digestHits: [],
      coverage: { complete: false, reasons: [execution.error.code], error: execution.error }
    };
  }
  const located = [];
  const coldMatches = /* @__PURE__ */ new Map();
  for (const index of execution.matched) {
    const target = collected.targets[index];
    if (!target) continue;
    if (target.kind === "hot") {
      located.push({
        entry: target.entry,
        matched: true,
        sessionMtime: target.shard.mtime,
        score: 1
      });
    } else {
      coldMatches.set(target.digest, (coldMatches.get(target.digest) ?? 0) + 1);
    }
  }
  const reasons = new Set(collected.reasons);
  if (coldMatches.size > 0 && hasFilters(filters)) {
    reasons.add("cold_structural_filter_requires_hydration");
  }
  return {
    located,
    digestHits: [...coldMatches].map(([digest, count]) => toDigestHit(digest, count, count, digestStructuralMatchCount(digest, filters))),
    coverage: {
      complete: collected.complete && reasons.size === 0,
      reasons: [...reasons].sort(compareLexical)
    }
  };
};
var sortDigestHits = (hits) => {
  hits.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if (right.sessionMtime !== left.sessionMtime) return right.sessionMtime - left.sessionMtime;
    return compareLexical(left.sessionFile, right.sessionFile);
  });
};
var searchMemoryIndex = async (shards, digests, query) => {
  const filters = query.filters ?? {};
  const plan = planMemoryQuery(query.query, query.queryMode ?? "literal");
  const limits = query.candidateLimits ?? {
    maxEntries: DEFAULT_SEARCH_MAX_CANDIDATE_ENTRIES,
    maxDigests: DEFAULT_SEARCH_MAX_CANDIDATE_DIGESTS,
    maxItems: DEFAULT_SEARCH_MAX_CANDIDATE_ITEMS
  };
  const maxEntries = Math.max(1, Math.floor(limits.maxEntries));
  const maxDigests = Math.max(1, Math.floor(limits.maxDigests));
  const maxItems = Math.max(1, Math.floor(limits.maxItems));
  let located;
  let digestHits = [];
  let queryCoverage = { complete: true, reasons: [] };
  const structurallyFiltered = hasFilters(filters);
  const matchMode = plan.kind === "browse" ? structurallyFiltered ? "structural" : "browse" : structurallyFiltered ? "combined" : plan.kind === "regex" ? "regex" : "lexical";
  const markOnlyMatches = plan.kind !== "browse" || structurallyFiltered;
  const coverageReasons = /* @__PURE__ */ new Set();
  if (plan.kind === "browse") {
    const eligibleEntries = filteredEntryCount(shards, filters);
    located = collectRecent(shards, filters, maxEntries, structurallyFiltered ? 1 : 0);
    if (eligibleEntries > maxEntries) coverageReasons.add("candidate_entry_budget");
    let eligibleDigests = 0;
    for (const digest of digests) {
      if (!digestCanMatchFilters(digest, filters)) continue;
      eligibleDigests += 1;
      if (digestHits.length < maxDigests) {
        const structuralMatches = digestStructuralMatchCount(digest, filters);
        digestHits.push(toDigestHit(
          digest,
          structurallyFiltered ? 1 : 0,
          0,
          structuralMatches
        ));
      }
    }
    if (eligibleDigests > maxDigests) coverageReasons.add("candidate_digest_budget");
  } else if (plan.kind === "regex") {
    const regexResult = await searchRegex(shards, digests, plan.pattern, filters, query);
    located = regexResult.located.slice(0, maxEntries);
    digestHits = regexResult.digestHits.slice(0, maxDigests);
    queryCoverage = regexResult.coverage;
    if (regexResult.located.length > maxEntries) coverageReasons.add("candidate_entry_budget");
    if (regexResult.digestHits.length > maxDigests) coverageReasons.add("candidate_digest_budget");
    sortLocated(located);
  } else {
    const eligibleEntries = filteredEntryCount(shards, filters);
    located = collectTermMatches(shards, plan.terms, filters, maxEntries);
    if (eligibleEntries > maxEntries) coverageReasons.add("candidate_entry_budget");
    const digestResult = scoreDigestTerms(digests, plan.terms, filters, maxDigests);
    digestHits = digestResult.hits;
    if (!digestResult.complete) coverageReasons.add("candidate_digest_budget");
    if (digestHits.length > 0 && hasFilters(filters)) {
      coverageReasons.add("cold_structural_filter_requires_hydration");
    }
  }
  sortDigestHits(digestHits);
  for (const reason of queryCoverage.reasons) coverageReasons.add(reason);
  queryCoverage = {
    ...queryCoverage,
    complete: queryCoverage.complete && coverageReasons.size === 0,
    reasons: [...coverageReasons].sort(compareLexical)
  };
  return groupIntoResults(
    shards,
    located,
    digestHits,
    markOnlyMatches,
    matchMode,
    maxItems,
    queryCoverage
  );
};
var searchShards = (shards, query) => searchMemoryIndex(shards, [], query);
var groupIntoResults = (shards, located, digestHits, markOnlyMatches, matchMode, maxItems, queryCoverage) => {
  if (located.length === 0 && digestHits.length === 0) {
    return {
      matchMode,
      matchedCount: 0,
      totalMatches: 0,
      totalItems: 0,
      segmentCount: 0,
      segments: [],
      digestHits: [],
      items: [],
      queryCoverage
    };
  }
  const shardsByFile = new Map(shards.map((shard) => [shard.sessionFile, shard]));
  const sessionOrder = [];
  const matchedBySession = /* @__PURE__ */ new Map();
  const scores = /* @__PURE__ */ new Map();
  for (const item of located) {
    if (!matchedBySession.has(item.entry.sessionFile)) sessionOrder.push(item.entry.sessionFile);
    const set = matchedBySession.get(item.entry.sessionFile) ?? /* @__PURE__ */ new Set();
    set.add(item.entry.index);
    matchedBySession.set(item.entry.sessionFile, set);
    scores.set(`${item.entry.sessionFile}\0${item.entry.index}`, item.score);
  }
  const segments = [];
  for (const file of sessionOrder) {
    const shard = shardsByFile.get(file);
    const matchedSet = matchedBySession.get(file);
    if (!shard || !matchedSet) continue;
    let current = [];
    let currentStart = 0;
    const flush = () => {
      if (current.length === 0) return;
      const entries = current.map((entry) => {
        const matched = matchedSet.has(entry.index);
        return { entry, matched, marker: markOnlyMatches ? matched ? ">" : " " : ">" };
      });
      const matchedEntries = entries.filter((entry) => entry.matched);
      if (markOnlyMatches && matchedEntries.length === 0) {
        current = [];
        return;
      }
      const lastIndex = current[current.length - 1].index;
      const range = lastIndex === currentStart ? `#${currentStart}` : `#${currentStart}-#${lastIndex}`;
      const score = Math.max(
        0,
        ...matchedEntries.map((item) => scores.get(`${file}\0${item.entry.index}`) ?? 0)
      );
      segments.push({
        sessionId: shard.sessionId,
        sessionFile: shard.sessionFile,
        sourceHash: shard.sourceHash,
        branches: shard.branches,
        lineageFingerprint: shard.lineageFingerprint,
        sessionMtime: shard.mtime,
        range,
        entryRange: { first: currentStart, last: lastIndex },
        entries,
        exactMatches: matchedEntries.map(({ entry }) => ({
          index: entry.index,
          entryId: entry.entryId,
          operationAddress: entry.operationAddress ?? null
        })),
        matchedCount: matchedEntries.length,
        score,
        tier: shard.tier ?? "hot"
      });
      current = [];
    };
    for (const entry of shard.entries) {
      if (current.length > 0 && entry.role !== null && segmentStartRoles.has(entry.role)) flush();
      if (current.length === 0) currentStart = entry.index;
      current.push(entry);
    }
    flush();
  }
  const items = [
    ...segments.map((segment) => ({ kind: "entry", segment })),
    ...digestHits.map((digest) => ({ kind: "digest", digest }))
  ];
  items.sort(compareSearchItems);
  const candidateItemsExceeded = items.length > maxItems;
  const limitedItems = items.slice(0, maxItems);
  const limitedSegments = limitedItems.filter((item) => item.kind === "entry").map((item) => item.segment);
  const limitedDigests = limitedItems.filter((item) => item.kind === "digest").map((item) => item.digest);
  const matchedCount = limitedSegments.reduce((sum, segment) => sum + segment.matchedCount, 0) + limitedDigests.length;
  const finalCoverage = candidateItemsExceeded ? {
    ...queryCoverage,
    complete: false,
    reasons: [.../* @__PURE__ */ new Set([...queryCoverage.reasons, "candidate_item_budget"])].sort(compareLexical)
  } : queryCoverage;
  return {
    matchMode,
    matchedCount,
    totalMatches: matchedCount,
    totalItems: limitedItems.length,
    segmentCount: limitedSegments.length,
    segments: limitedSegments,
    digestHits: limitedDigests,
    items: limitedItems,
    queryCoverage: finalCoverage
  };
};
var compareSearchItems = (left, right) => {
  const leftValue = left.kind === "entry" ? left.segment : left.digest;
  const rightValue = right.kind === "entry" ? right.segment : right.digest;
  if (rightValue.score !== leftValue.score) return rightValue.score - leftValue.score;
  if (rightValue.sessionMtime !== leftValue.sessionMtime) return rightValue.sessionMtime - leftValue.sessionMtime;
  if (left.kind !== right.kind) return left.kind === "entry" ? -1 : 1;
  if (left.kind === "entry" && right.kind === "entry") {
    const leftIndex = left.segment.entries[0]?.entry.index ?? 0;
    const rightIndex = right.segment.entries[0]?.entry.index ?? 0;
    if (leftIndex !== rightIndex) return leftIndex - rightIndex;
    return compareLexical(left.segment.sessionFile, right.segment.sessionFile);
  }
  if (left.kind === "digest" && right.kind === "digest") {
    return compareLexical(left.digest.sessionFile, right.digest.sessionFile);
  }
  return 0;
};
var structuralFilterLabel = (filters) => {
  const ordered = [
    ["ref", filters.ref],
    ["provider", filters.provider],
    ["action", filters.action],
    ["outcome", filters.outcome],
    ["role", filters.role],
    ["tool", filters.tool],
    ["since", filters.since],
    ["until", filters.until]
  ];
  return ordered.filter(([, value]) => value !== void 0).map(([key, value]) => `${key}=${JSON.stringify(value)}`).join(", ");
};
var formatSearchResult = (result, query, coverage, filters = {}) => {
  const filterLabel = structuralFilterLabel(filters);
  if (result.items.length === 0) {
    if (result.totalItems > 0) return "No results on this page.";
    if (result.matchMode === "structural") {
      if (coverage && !coverage.complete) {
        const reasons = coverage.reasons.length > 0 ? `; reasons: ${coverage.reasons.join(", ")}` : "";
        return `No indexed invocations selected by exact structural filters (${filterLabel}); coverage is incomplete (${coverage.indexedSessions}/${coverage.eligibleSessions} sessions indexed${reasons}).`;
      }
      return `No invocations selected by exact structural filters (${filterLabel}).`;
    }
    if (!query) return "No entries in scope.";
    if (coverage && !coverage.complete) {
      const reasons = coverage.reasons.length > 0 ? `; reasons: ${coverage.reasons.join(", ")}` : "";
      return `No indexed matches for "${query}"; coverage is incomplete (${coverage.indexedSessions}/${coverage.eligibleSessions} sessions indexed${reasons}).`;
    }
    if (!result.queryCoverage.complete) {
      const reasons = result.queryCoverage.reasons.join(", ");
      return `No indexed matches for "${query}"; query coverage is incomplete (${reasons}).`;
    }
    return `No matches for "${query}".`;
  }
  const coldSuffix = result.digestHits.length > 0 ? ` and ${result.digestHits.length} cold session${result.digestHits.length === 1 ? "" : "s"}` : "";
  const header = result.matchMode === "structural" ? `${result.matchedCount} structural result item${result.matchedCount === 1 ? "" : "s"} across ${result.segmentCount} segment${result.segmentCount === 1 ? "" : "s"}${coldSuffix} selected by exact filters (${filterLabel}):` : result.matchMode === "combined" ? `${result.matchedCount} lexical matches across ${result.segmentCount} segment${result.segmentCount === 1 ? "" : "s"}${coldSuffix} for "${query}" within exact structural filters (${filterLabel}):` : query ? `${result.matchedCount} matches across ${result.segmentCount} segment${result.segmentCount === 1 ? "" : "s"}${coldSuffix} for "${query}":` : `${result.matchedCount} most recent entries:`;
  const body = result.items.map(
    (item) => item.kind === "entry" ? formatSegment(item.segment) : formatDigestHit(item.digest, result.matchMode)
  ).join("\n\n");
  return `${header}

${body}`;
};
var formatDigestHit = (hit, matchMode) => {
  const timestamp = hit.lastTs === null ? "unknown time" : new Date(hit.lastTs).toISOString();
  const match = matchMode === "browse" ? "is available as a cold session pointer" : matchMode === "structural" ? `has ${hit.matchedStructuralEntries} retained entries selected by exact structural fields` : matchMode === "combined" ? `has ${hit.matchedTerms} matching lexical term${hit.matchedTerms === 1 ? "" : "s"} and ${hit.matchedStructuralEntries} independently matching structural entries; hydrate to establish entry-level co-location` : `has ${hit.matchedTerms} matching lexical term${hit.matchedTerms === 1 ? "" : "s"}`;
  return `> session ${hit.sessionId} (cold, ${hit.cwd}, ${timestamp}, branches=${hit.branches}) ${match} \u2014 hydrate exact file ${JSON.stringify(hit.sessionFile)} with branches ${JSON.stringify(hit.branches)}, expectedSourceHash ${JSON.stringify(hit.sourceHash)}, and expectedLineageFingerprint ${JSON.stringify(hit.lineageFingerprint)}.`;
};
var formatSegment = (segment) => {
  const lines = [];
  lines.push(`--- ${segment.range} (${segment.matchedCount}/${segment.entries.length} match) ---`);
  for (const item of segment.entries) lines.push(formatEntry(item));
  return lines.join("\n");
};
var formatEntry = (item) => {
  const entry = item.entry;
  const role = entry.role ?? entry.type;
  const toolSuffix = entry.toolName ? ` ${entry.toolName}` : "";
  const errorSuffix = entry.isError ? " [error]" : "";
  const truncatedSuffix = entry.truncated ? " \u2026[truncated]" : "";
  const body = item.matched ? entry.text : "";
  return `${item.marker} #${entry.index} [${role}${toolSuffix}]${errorSuffix} ${body}${truncatedSuffix}`;
};

export {
  reconstructSessionLineage,
  DEFAULT_HOT_SESSIONS,
  fingerprintSource,
  loadTieredIndex,
  DEFAULT_REGEX_MAX_PATTERN_BYTES,
  DEFAULT_REGEX_MAX_HAYSTACK_TERMS,
  DEFAULT_REGEX_MAX_HAYSTACK_BYTES,
  DEFAULT_REGEX_TIMEOUT_MS,
  searchMemoryIndex,
  searchShards,
  formatSearchResult
};
//# sourceMappingURL=chunk-HG7D6AOD.js.map
