// src/memory/tokenize.ts
var compareLexical = (left, right) => left < right ? -1 : left > right ? 1 : 0;
var tokenizeLexical = (text) => [...text.normalize("NFKC").matchAll(/[\p{L}\p{N}_]+/gu)].map(
  (match) => match[0].toLowerCase()
);
var lexicalTermCounts = (text) => {
  const counts = /* @__PURE__ */ new Map();
  for (const term of tokenizeLexical(text)) counts.set(term, (counts.get(term) ?? 0) + 1);
  return counts;
};
var planMemoryQuery = (query, queryMode = "literal") => {
  if (query === void 0 || query.trim().length === 0) return { kind: "browse" };
  if (queryMode === "regex") return { kind: "regex", pattern: query };
  return { kind: "terms", terms: [...new Set(tokenizeLexical(query))] };
};

// src/memory/digest.ts
var DEFAULT_FILES_TOUCHED_LIMIT = 50;
var vocabularyJsonBytes = (terms) => Buffer.byteLength(JSON.stringify(terms), "utf8");
var foldSessionDigest = (input) => {
  let firstTs = null;
  let lastTs = null;
  let errorCount = 0;
  const filesTouched = [];
  const seenFiles = /* @__PURE__ */ new Set();
  const tools = /* @__PURE__ */ new Map();
  const vocabulary = /* @__PURE__ */ new Set();
  const filesLimit = Math.max(0, input.filesTouchedLimit ?? DEFAULT_FILES_TOUCHED_LIMIT);
  const maxVocabularyBytes = Math.max(2, input.maxVocabularyBytes ?? Number.MAX_SAFE_INTEGER);
  let vocabularyLimitReached = false;
  let estimatedVocabularyBytes = 2;
  for (const entry of input.entries) {
    if (entry.timestamp !== null) {
      firstTs = firstTs === null ? entry.timestamp : Math.min(firstTs, entry.timestamp);
      lastTs = lastTs === null ? entry.timestamp : Math.max(lastTs, entry.timestamp);
    }
    if (entry.isError) errorCount += 1;
    if (entry.toolName) tools.set(entry.toolName, (tools.get(entry.toolName) ?? 0) + 1);
    for (const file of entry.filesTouched ?? []) {
      if (filesTouched.length >= filesLimit) break;
      const normalized = file.trim();
      if (!normalized || seenFiles.has(normalized)) continue;
      seenFiles.add(normalized);
      filesTouched.push(normalized);
    }
    if (!vocabularyLimitReached) {
      for (const term of tokenizeLexical(entry.text)) {
        if (vocabulary.has(term)) continue;
        const termBytes = Buffer.byteLength(JSON.stringify(term), "utf8") + (vocabulary.size === 0 ? 0 : 1);
        if (estimatedVocabularyBytes + termBytes > maxVocabularyBytes) {
          vocabularyLimitReached = true;
          break;
        }
        vocabulary.add(term);
        estimatedVocabularyBytes += termBytes;
      }
    }
  }
  const sortedVocabulary = [...vocabulary].sort(compareLexical);
  const toolHistogram = Object.fromEntries(
    [...tools.entries()].sort(([left], [right]) => compareLexical(left, right))
  );
  const addresses = input.entries.map((entry) => [
    entry.index,
    entry.entryId,
    entry.operationAddress ?? null,
    entry.role,
    entry.toolName,
    entry.timestamp,
    entry.ref ?? null,
    entry.provider ?? null,
    entry.action ?? null,
    entry.outcome ?? null
  ]);
  const reasons = new Set(input.normalizationCoverage?.reasons ?? []);
  if (vocabularyLimitReached) reasons.add("max_cold_vocabulary_bytes");
  const sortedReasons = [...reasons].sort(compareLexical);
  return {
    sessionId: input.sessionId,
    file: input.file,
    cwd: input.cwd,
    firstTs,
    lastTs,
    entryCount: input.entries.length,
    filesTouched,
    toolHistogram,
    errorCount,
    vocabulary: sortedVocabulary,
    addresses,
    indexCoverage: {
      complete: sortedReasons.length === 0,
      vocabularyBytes: vocabularyJsonBytes(sortedVocabulary),
      reasons: sortedReasons
    }
  };
};

export {
  compareLexical,
  tokenizeLexical,
  lexicalTermCounts,
  planMemoryQuery,
  foldSessionDigest
};
//# sourceMappingURL=chunk-E2LYJAID.js.map
