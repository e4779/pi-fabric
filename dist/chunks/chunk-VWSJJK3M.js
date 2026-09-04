import {
  readSessionHeader
} from "./chunk-4OXEXLH6.js";

// src/memory/discovery.ts
import fs from "node:fs";
import path from "node:path";
var SESSIONS_SUBDIR = "sessions";
var isJsonlFile = (name) => name.endsWith(".jsonl");
var encodeCwdDir = (cwd) => `--${path.resolve(cwd).replace(/^[/\\]/, "").replace(/[/\\:]/g, "-")}--`;
var sessionDirForCwd = (cwd, agentDir) => path.join(agentDir, SESSIONS_SUBDIR, encodeCwdDir(cwd));
var listJsonlInDir = (dir) => {
  try {
    return fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isFile() && isJsonlFile(entry.name)).map((entry) => path.join(dir, entry.name));
  } catch {
    return [];
  }
};
var statMtime = (file) => {
  try {
    return fs.statSync(file).mtimeMs;
  } catch {
    return 0;
  }
};
var refFromFile = (file) => {
  const header = readSessionHeader(file);
  return {
    id: header?.sessionId ?? path.basename(file, ".jsonl"),
    file,
    cwd: header?.cwd ?? "",
    mtime: statMtime(file)
  };
};
var sessionsDirRoot = (agentDir) => path.join(agentDir, SESSIONS_SUBDIR);
var compareRefsByRecency = (left, right) => {
  if (right.mtime !== left.mtime) return right.mtime - left.mtime;
  return left.file < right.file ? -1 : left.file > right.file ? 1 : 0;
};
var enumerateAllSessions = (agentDir, maxSessions) => {
  const root = sessionsDirRoot(agentDir);
  let projectDirs = [];
  try {
    projectDirs = fs.readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => path.join(root, entry.name));
  } catch {
    return [];
  }
  const files = [];
  for (const dir of projectDirs) {
    for (const file of listJsonlInDir(dir)) files.push(file);
  }
  return files.map(refFromFile).sort(compareRefsByRecency).slice(0, Math.max(1, maxSessions));
};
var newestSessionInDir = (dir) => {
  const files = listJsonlInDir(dir);
  if (files.length === 0) return null;
  return files.map(refFromFile).sort(compareRefsByRecency)[0];
};
var AmbiguousSessionError = class extends Error {
  constructor(session, candidates) {
    super(`Session id ${JSON.stringify(session)} is ambiguous; use an exact session file path.`);
    this.session = session;
    this.candidates = candidates;
    this.name = "AmbiguousSessionError";
  }
  code = "ambiguous_session";
};
var resolveSessionTarget = (agentDir, target) => {
  if (target.endsWith(".jsonl") && fs.existsSync(target)) {
    return refFromFile(path.resolve(target));
  }
  const all = enumerateAllSessions(agentDir, Number.MAX_SAFE_INTEGER);
  const byId = all.filter((ref) => ref.id === target);
  if (byId.length > 1) throw new AmbiguousSessionError(target, byId.map((ref) => ref.file));
  if (byId.length === 1) return byId[0];
  const byStem = all.filter((ref) => path.basename(ref.file, ".jsonl") === target);
  if (byStem.length > 1) throw new AmbiguousSessionError(target, byStem.map((ref) => ref.file));
  return byStem[0] ?? null;
};
var resolveScope = (input) => {
  const scope = input.scope?.trim();
  if (scope.startsWith("session:")) {
    const target = scope.slice("session:".length).trim();
    const ref = resolveSessionTarget(input.agentDir, target);
    return ref ? [ref] : [];
  }
  if (scope === "global") {
    return enumerateAllSessions(input.agentDir, input.maxSessions);
  }
  if (scope === "project") {
    const dir2 = sessionDirForCwd(input.cwd, input.agentDir);
    return listJsonlInDir(dir2).map(refFromFile).sort(compareRefsByRecency).slice(0, Math.max(1, input.maxSessions));
  }
  if (input.sessionFile) {
    const ref = refFromFile(input.sessionFile);
    return [ref];
  }
  const dir = sessionDirForCwd(input.cwd, input.agentDir);
  const newest = newestSessionInDir(dir);
  return newest ? [newest] : [];
};

export {
  encodeCwdDir,
  enumerateAllSessions,
  AmbiguousSessionError,
  resolveSessionTarget,
  resolveScope
};
//# sourceMappingURL=chunk-VWSJJK3M.js.map
