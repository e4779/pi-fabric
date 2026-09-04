// src/core/stable-hash.ts
import { createHash } from "node:crypto";
var stableJsonValue = (value) => {
  if (Array.isArray(value)) return value.map(stableJsonValue);
  if (value instanceof URL) return value.href;
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, nested]) => [key, stableJsonValue(nested)])
  );
};
var stableJsonHash = (value) => createHash("sha256").update(JSON.stringify(stableJsonValue(value))).digest("hex");

export {
  stableJsonHash
};
//# sourceMappingURL=chunk-2DGB2R4E.js.map
