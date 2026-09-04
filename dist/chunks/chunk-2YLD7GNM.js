// src/ref-names.ts
var sanitizeMcpRefPart = (value) => {
  const sanitized = value.replace(/[^A-Za-z0-9_$]/g, "_");
  return /^[A-Za-z_$]/.test(sanitized) ? sanitized : `_${sanitized}`;
};

export {
  sanitizeMcpRefPart
};
//# sourceMappingURL=chunk-2YLD7GNM.js.map
