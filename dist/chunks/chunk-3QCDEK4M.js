import {
  compactionRequestBoundsError,
  compileFabricSummary,
  encodeCompactionRequest,
  rawContextTokens
} from "./chunk-7B4MWJK4.js";

// src/agents/thinking-transfer.ts
var REASONING_CONTENT_SIGNATURE = "reasoning_content";
var OPENAI_COMPLETIONS_API = "openai-completions";
var thinkingTransferPolicy = (input) => {
  const { source, target } = input;
  if (source && source.provider === target.provider && (source.api === void 0 || target.api === void 0 || source.api === target.api)) {
    return "preserved";
  }
  if (target.api === OPENAI_COMPLETIONS_API && target.reasoning === true && target.requiresThinkingAsText !== true) {
    return "re-signed";
  }
  return "stripped";
};
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var isThinkingPart = (part) => isRecord(part) && part.type === "thinking";
var translateThinkingForExecutor = (entries, policy) => {
  if (policy === "preserved") {
    return { entries, report: { policy, translated: 0, dropped: 0 } };
  }
  const clone = structuredClone(entries);
  let translated = 0;
  let dropped = 0;
  for (const entry of clone) {
    if (entry.type !== "message") continue;
    const message = entry.message;
    if (message.role !== "assistant" || !Array.isArray(message.content)) continue;
    const kept = [];
    for (const part of message.content) {
      if (isRecord(part) && part.type === "toolCall") {
        delete part.thoughtSignature;
        kept.push(part);
        continue;
      }
      if (!isThinkingPart(part)) {
        kept.push(part);
        continue;
      }
      const text = typeof part.thinking === "string" ? part.thinking : "";
      if (policy === "re-signed" && part.redacted !== true && text.trim().length > 0) {
        part.thinkingSignature = REASONING_CONTENT_SIGNATURE;
        translated += 1;
        kept.push(part);
        continue;
      }
      dropped += 1;
    }
    message.content = kept;
  }
  return { entries: clone, report: { policy, translated, dropped } };
};
var THINKING_DIGEST_CUSTOM_TYPE = "pi-fabric-handoff-thinking";
var MAX_DIGEST_BLOCKS = 8;
var MAX_DIGEST_LINE = 80;
var MAX_DIGEST_BYTES = 2048;
var firstLineOf = (text) => {
  const end = text.indexOf("\n");
  return end === -1 ? text : text.slice(0, end);
};
var truncate = (text, max) => text.length > max ? text.slice(0, max) : text;
var clipUtf8 = (text, maxBytes) => {
  if (Buffer.byteLength(text, "utf8") <= maxBytes) return text;
  let out = "";
  let bytes = 0;
  for (const char of text) {
    const size = Buffer.byteLength(char, "utf8");
    if (bytes + size > maxBytes) break;
    out += char;
    bytes += size;
  }
  return out;
};
var buildThinkingDigest = (entries, input) => {
  const blocks = [];
  for (const entry of entries) {
    if (entry.type !== "message") continue;
    const message = entry.message;
    if (message.role !== "assistant" || !Array.isArray(message.content)) continue;
    for (const part of message.content) {
      if (!isThinkingPart(part)) continue;
      const text = typeof part.thinking === "string" ? part.thinking : "";
      const line = truncate(firstLineOf(text).trim(), MAX_DIGEST_LINE);
      if (line) blocks.push({ entryId: entry.id, line });
    }
  }
  if (blocks.length === 0) return void 0;
  const recent = blocks.slice(-MAX_DIGEST_BLOCKS);
  const omitted = blocks.length - recent.length;
  const sourceId = input.source ? `${input.source.provider}/${input.source.modelId}` : "the prior model";
  const targetId = `${input.target.provider}/${input.target.modelId}`;
  const lines = [
    "Prewalk handoff continuity digest (deliberation, not commitments).",
    `Thinking from ${sourceId} was not transferred: ${targetId} cannot replay it (incompatible reasoning channels). Most recent lines:`,
    ...recent.map((block) => `- [entry ${block.entryId}] ${block.line}`)
  ];
  if (omitted > 0) lines.push(`(omitted ${omitted} older thinking blocks)`);
  lines.push("Full thinking remains addressable in the source session by entry id.");
  return {
    content: clipUtf8(lines.join("\n"), MAX_DIGEST_BYTES),
    citedBlocks: recent.length
  };
};

// src/agents/handoff.ts
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  CURRENT_SESSION_VERSION,
  SessionManager
} from "@earendil-works/pi-coding-agent";
var isRecord2 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var checkedHandoffCompaction = (value) => {
  if (value === void 0 || value === false) return void 0;
  const input = value === true ? {} : value;
  if (!isRecord2(input)) {
    throw new Error(
      "Invalid agents.handoff compact arguments: compact must be true or an object with instructions/preserve"
    );
  }
  if (input.instructions !== void 0 && typeof input.instructions !== "string") {
    throw new Error("Invalid agents.handoff compact arguments: instructions must be a string");
  }
  if (input.preserve !== void 0 && (!Array.isArray(input.preserve) || input.preserve.some((item) => typeof item !== "string"))) {
    throw new Error(
      "Invalid agents.handoff compact arguments: preserve must be an array of strings"
    );
  }
  const request = {
    ...typeof input.instructions === "string" ? { instructions: input.instructions } : {},
    ...input.preserve !== void 0 ? { preserve: input.preserve } : {}
  };
  const boundsError = compactionRequestBoundsError(request);
  if (boundsError) {
    throw new Error(`Invalid agents.handoff compact arguments: ${boundsError.message}`);
  }
  return request;
};
var isToolCall = (value) => isRecord2(value) && value.type === "toolCall" && typeof value.id === "string" && typeof value.name === "string" && isRecord2(value.arguments);
var activeFabricTurn = (source, outerToolCallId) => {
  const leafId = source.getLeafId();
  const entry = leafId ? source.getEntry(leafId) : void 0;
  if (entry?.type !== "message" || entry.message.role !== "assistant") {
    throw new Error(
      "Trajectory handoff requires the active fabric_exec assistant turn to be the session leaf"
    );
  }
  const content = Array.isArray(entry.message.content) ? entry.message.content : [];
  const toolCalls = content.filter(isToolCall);
  if (!toolCalls.some((call) => call.id === outerToolCallId)) {
    throw new Error(
      "Trajectory handoff could not find the active fabric_exec assistant turn in the Pi session"
    );
  }
  if (toolCalls.length !== 1 || toolCalls[0]?.name !== "fabric_exec") {
    throw new Error(
      "Trajectory handoff requires fabric_exec to be the only top-level tool call in its assistant turn"
    );
  }
  return entry;
};
var snapshotHandoffSession = (source, currentModel, outerToolResult, outerToolCallId) => {
  if (outerToolResult.toolCallId !== outerToolCallId || outerToolResult.toolName !== "fabric_exec") {
    throw new Error("Trajectory handoff requires the finalized outer fabric_exec result");
  }
  const active = activeFabricTurn(source, outerToolCallId);
  const sourceSessionFile = source.getSessionFile();
  const branch = source.getBranch();
  let model = currentModel ? { provider: currentModel.provider, modelId: currentModel.id } : void 0;
  let thinkingLevel;
  for (let index = branch.length - 1; index >= 0; index--) {
    const entry = branch[index];
    if (!thinkingLevel && entry?.type === "thinking_level_change") {
      thinkingLevel = entry.thinkingLevel;
    }
    if (!model && entry?.type === "model_change") {
      model = { provider: entry.provider, modelId: entry.modelId };
    }
    if (model && thinkingLevel) break;
  }
  return {
    sourceSessionId: source.getSessionId(),
    ...sourceSessionFile ? { sourceSessionFile } : {},
    sourceBranchLeafId: active.id,
    ...!sourceSessionFile ? { sourceBranch: structuredClone(branch) } : {},
    ...model ? { sourceModel: model } : {},
    ...thinkingLevel ? { sourceThinkingLevel: thinkingLevel } : {},
    outerToolResult: structuredClone(outerToolResult)
  };
};
var materializeBranch = (seed, cwd, directory) => {
  if (!seed.sourceBranch) {
    throw new Error("In-memory trajectory handoff is missing its source branch");
  }
  const id = randomUUID();
  const sessionFile = path.join(directory, `handoff-${id}.jsonl`);
  const header = {
    type: "session",
    version: CURRENT_SESSION_VERSION,
    id,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    cwd,
    ...seed.sourceSessionFile ? { parentSession: seed.sourceSessionFile } : {}
  };
  fs.writeFileSync(
    sessionFile,
    `${[header, ...seed.sourceBranch].map((entry) => JSON.stringify(entry)).join("\n")}
`,
    { encoding: "utf8", mode: 384, flag: "wx" }
  );
  return SessionManager.open(sessionFile, directory, cwd);
};
var forkBranch = (seed, cwd, directory) => {
  if (!seed.sourceSessionFile) return materializeBranch(seed, cwd, directory);
  const fork = SessionManager.open(seed.sourceSessionFile, directory, cwd);
  if (!fork.getEntry(seed.sourceBranchLeafId)) {
    throw new Error(
      `Trajectory handoff branch point ${seed.sourceBranchLeafId} is missing from the persisted Pi session`
    );
  }
  const sessionFile = fork.createBranchedSession(seed.sourceBranchLeafId);
  if (!sessionFile) {
    throw new Error("Trajectory handoff could not create a persisted Pi session branch");
  }
  return fork;
};
var persistedBranch = (seed, cwd, directory) => {
  if (!seed.sourceSessionFile) {
    throw new Error("Persisted trajectory handoff is missing its source session file");
  }
  const source = SessionManager.open(seed.sourceSessionFile, directory, cwd);
  if (!source.getEntry(seed.sourceBranchLeafId)) {
    throw new Error(
      `Trajectory handoff branch point ${seed.sourceBranchLeafId} is missing from the persisted Pi session`
    );
  }
  return structuredClone(source.getBranch(seed.sourceBranchLeafId));
};
var synchronizeSourceSettings = (session, seed) => {
  const context = session.buildSessionContext();
  if (seed.sourceModel && (context.model?.provider !== seed.sourceModel.provider || context.model.modelId !== seed.sourceModel.modelId)) {
    session.appendModelChange(seed.sourceModel.provider, seed.sourceModel.modelId);
  }
  if (seed.sourceThinkingLevel && context.thinkingLevel !== seed.sourceThinkingLevel) {
    session.appendThinkingLevelChange(seed.sourceThinkingLevel);
  }
};
var writeHandoffSession = (seed, cwd, directory, transfer, compaction) => {
  fs.mkdirSync(directory, { recursive: true, mode: 448 });
  const policy = transfer ? thinkingTransferPolicy(transfer) : "preserved";
  let session;
  let report;
  let digest;
  if (!transfer || policy === "preserved") {
    session = forkBranch(seed, cwd, directory);
  } else {
    const rawBranch = seed.sourceSessionFile ? persistedBranch(seed, cwd, directory) : structuredClone(seed.sourceBranch ?? (() => {
      throw new Error("Trajectory handoff transfer is missing its source branch");
    })());
    if (policy === "stripped") digest = buildThinkingDigest(rawBranch, transfer);
    const translated = translateThinkingForExecutor(rawBranch, policy);
    report = translated.report;
    session = materializeBranch({ ...seed, sourceBranch: translated.entries }, cwd, directory);
  }
  let compactionOutcome;
  if (compaction) {
    const branchEntries = session.getBranch();
    const customInstructions = compaction.preserve ? encodeCompactionRequest({
      ...compaction.instructions !== void 0 ? { instructions: compaction.instructions } : {},
      preserve: compaction.preserve
    }) : compaction.instructions;
    const tokensBefore = rawContextTokens(branchEntries);
    const compiled = compileFabricSummary(branchEntries, tokensBefore, void 0, customInstructions);
    if ("cancel" in compiled) {
      compactionOutcome = { applied: false, reason: compiled.reason };
    } else {
      session.appendCompaction(
        compiled.compaction.summary,
        compiled.compaction.firstKeptEntryId,
        tokensBefore,
        compiled.compaction.details,
        true
      );
      compactionOutcome = {
        applied: true,
        sections: compiled.compaction.details?.sections ?? [],
        tokensBefore,
        firstKeptEntryId: compiled.compaction.firstKeptEntryId
      };
    }
  }
  synchronizeSourceSettings(session, seed);
  session.appendMessage(seed.outerToolResult);
  if (digest) {
    session.appendCustomMessageEntry(THINKING_DIGEST_CUSTOM_TYPE, digest.content, false, {
      policy,
      citedBlocks: digest.citedBlocks
    });
  }
  session.appendCustomEntry("pi-fabric-handoff", {
    sourceSessionId: seed.sourceSessionId,
    boundary: "fabric_exec_end",
    ...compactionOutcome ? {
      compaction: compactionOutcome.applied ? {
        applied: true,
        sections: compactionOutcome.sections,
        tokensBefore: compactionOutcome.tokensBefore,
        firstKeptEntryId: compactionOutcome.firstKeptEntryId
      } : { applied: false, reason: compactionOutcome.reason }
    } : {},
    ...transfer && report ? {
      thinkingTransfer: {
        policy: report.policy,
        translated: report.translated,
        dropped: report.dropped,
        target: `${transfer.target.provider}/${transfer.target.modelId}`
      }
    } : {}
  });
  const sessionFile = session.getSessionFile();
  if (!sessionFile) throw new Error("Trajectory handoff did not produce a Pi session file");
  fs.chmodSync(sessionFile, 384);
  return sessionFile;
};

// src/topology/peer-settle.ts
var DEFAULT_PEER_SETTLED_FOR_MS = 3e3;
var PEER_SETTLE_POLL_MS = 500;
var peerLabelPrefix = (cwd) => {
  const base = cwd?.split(/[\\/]/).filter(Boolean).at(-1) ?? "";
  const words = base.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length === 0) return "P";
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 4).map((word) => word[0].toUpperCase()).join("");
};
var buildPeerCards = (peers) => [...peers].sort((left, right) => left.startedAt - right.startedAt || left.id.localeCompare(right.id)).map((peer) => ({
  id: peer.id,
  label: peer.label ?? peer.name,
  status: peer.status,
  ...peer.model ? { model: peer.model } : {},
  ...peer.cwd ? { cwd: peer.cwd } : {},
  startedAt: peer.startedAt,
  updatedAt: peer.updatedAt,
  pendingMessages: peer.pendingMessages
}));
var matchesSelector = (peer, selector) => {
  const target = selector.trim().toLowerCase();
  if (!target) return false;
  return peer.id.toLowerCase() === target || (peer.label ?? "").toLowerCase() === target || peer.name.toLowerCase() === target;
};
var awaitPeerSettle = (options) => {
  const now = options.now ?? (() => Date.now());
  const settledFor = Math.max(0, options.settledForMs ?? DEFAULT_PEER_SETTLED_FOR_MS);
  const pollMs = Math.max(10, options.pollMs ?? PEER_SETTLE_POLL_MS);
  const armedAt = now();
  const initial = options.poll();
  const targets = options.selector !== void 0 ? initial.filter((peer) => matchesSelector(peer, options.selector ?? "")) : [...initial];
  if (options.selector !== void 0 && targets.length === 0) {
    return Promise.resolve({
      ok: false,
      error: `No Fabric peer matches "${options.selector}" on this project mesh`
    });
  }
  if (targets.length === 0) return Promise.resolve({ ok: true });
  const watched = /* @__PURE__ */ new Map();
  for (const peer of targets) {
    watched.set(peer.id, {
      id: peer.id,
      label: peer.label ?? peer.name,
      running: peer.status === "running",
      lastRunningAt: peer.status === "running" ? armedAt : void 0,
      settled: false
    });
  }
  return new Promise((resolve) => {
    let timer;
    let done = false;
    const finish = (result) => {
      if (done) return;
      done = true;
      if (timer) clearInterval(timer);
      options.signal?.removeEventListener("abort", onAbort);
      resolve(result);
    };
    const onAbort = () => finish({ ok: false, error: "cancelled" });
    const tick = () => {
      const snapshot = options.poll();
      const byId = new Map(snapshot.map((peer) => [peer.id, peer]));
      const current = now();
      for (const entry of watched.values()) {
        if (entry.settled) continue;
        const peer = byId.get(entry.id);
        if (!peer) {
          entry.settled = true;
          continue;
        }
        entry.label = peer.label ?? peer.name;
        const running = peer.status === "running";
        if (running) {
          entry.lastRunningAt = current;
          entry.running = true;
          continue;
        }
        entry.running = false;
        const quietSince = entry.lastRunningAt ?? armedAt;
        if (current - quietSince >= settledFor) entry.settled = true;
      }
      const waiting = [...watched.values()].filter((entry) => !entry.settled).map((entry) => ({ label: entry.label, status: entry.running ? "running" : "idle" }));
      if (waiting.length === 0) {
        options.onUpdate?.({ waiting });
        finish({ ok: true });
        return;
      }
      options.onUpdate?.({ waiting });
    };
    if (options.signal) {
      if (options.signal.aborted) {
        finish({ ok: false, error: "cancelled" });
        return;
      }
      options.signal.addEventListener("abort", onAbort, { once: true });
    }
    timer = setInterval(tick, pollMs);
    tick();
  });
};

export {
  thinkingTransferPolicy,
  THINKING_DIGEST_CUSTOM_TYPE,
  buildThinkingDigest,
  checkedHandoffCompaction,
  snapshotHandoffSession,
  writeHandoffSession,
  peerLabelPrefix,
  buildPeerCards,
  awaitPeerSettle
};
//# sourceMappingURL=chunk-3QCDEK4M.js.map
