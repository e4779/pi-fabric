// src/core/effect-conflict.ts
var reasonText = (reason) => reason === "unknown_resource" ? "unknown resource footprint; declare resources and ordering" : "shared noncommutative resource";
var formatFabricEffectConflict = (target, resources, reason) => `${target} [${resources.join(", ")}] (${reasonText(reason)})`;

export {
  formatFabricEffectConflict
};
//# sourceMappingURL=chunk-PM3ESBLM.js.map
