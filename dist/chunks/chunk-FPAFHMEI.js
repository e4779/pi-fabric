// src/ui/model-picker.ts
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
var buildModelKey = (provider, id) => `${provider}/${id}`;
var INHERIT_VALUE = "Inherit";
function readModelSortLastUsed(agentDir) {
  if (!agentDir) return {};
  try {
    const configPath = join(agentDir, "extensions", "pi-model-sort.json");
    if (!existsSync(configPath)) return {};
    const parsed = JSON.parse(readFileSync(configPath, "utf-8"));
    return parsed.lastUsed ?? {};
  } catch {
    return {};
  }
}
function sortByLastUsed(items, lastUsed, currentModelKey) {
  const sorted = [...items];
  sorted.sort((a, b) => {
    const aKey = buildModelKey(a.provider, a.id);
    const bKey = buildModelKey(b.provider, b.id);
    if (currentModelKey !== null) {
      const aIsCurrent = aKey === currentModelKey;
      const bIsCurrent = bKey === currentModelKey;
      if (aIsCurrent && !bIsCurrent) return -1;
      if (!aIsCurrent && bIsCurrent) return 1;
    }
    const aLast = lastUsed[aKey] ?? 0;
    const bLast = lastUsed[bKey] ?? 0;
    if (aLast !== bLast) return bLast - aLast;
    return a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id);
  });
  return sorted;
}
function buildModelSource(registry, agentDir) {
  let models;
  try {
    models = registry.getAvailable();
  } catch {
    models = [];
  }
  return { models, lastUsed: readModelSortLastUsed(agentDir) };
}
function buildClaudeModelSource(models) {
  return {
    models: models.map((model) => ({
      provider: "claude",
      id: model.value,
      name: model.displayName ?? model.resolvedModel ?? model.value
    })),
    lastUsed: {}
  };
}
var modelKey = buildModelKey;

export {
  INHERIT_VALUE,
  readModelSortLastUsed,
  sortByLastUsed,
  buildModelSource,
  buildClaudeModelSource,
  modelKey
};
//# sourceMappingURL=chunk-FPAFHMEI.js.map
