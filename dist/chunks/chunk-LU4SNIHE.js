// src/core/atomic-write.ts
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
var RETRYABLE_RENAME_CODES = /* @__PURE__ */ new Set(["EPERM", "EACCES", "EEXIST", "EBUSY"]);
var errorCode = (error) => typeof error === "object" && error !== null && "code" in error ? String(error.code) : void 0;
var syncSleep = (() => {
  try {
    const buffer = new Int32Array(new SharedArrayBuffer(4));
    return (ms) => {
      Atomics.wait(buffer, 0, 0, ms);
    };
  } catch {
    return () => void 0;
  }
})();
var renameAtomic = (source, target, options) => {
  const attempts = Math.max(1, options?.renameRetries ?? 8);
  const delay = options?.renameRetryDelayMs ?? 25;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      fs.renameSync(source, target);
      return;
    } catch (error) {
      const code = errorCode(error);
      if (attempt === attempts || code === void 0 || !RETRYABLE_RENAME_CODES.has(code)) {
        throw error;
      }
      syncSleep(delay * attempt);
    }
  }
};
var writeFileAtomic = (filePath, contents, options) => {
  fs.mkdirSync(path.dirname(filePath), {
    recursive: true,
    mode: options?.dirMode ?? 448
  });
  const temporary = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporary, contents, {
      encoding: "utf8",
      mode: options?.mode ?? 384
    });
    renameAtomic(temporary, filePath, options);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
};
var writeJsonAtomic = (filePath, value, options) => {
  const space = options?.space;
  const serialized = JSON.stringify(value, null, space) + (options?.newline === true ? "\n" : "");
  writeFileAtomic(filePath, serialized, options);
};

export {
  renameAtomic,
  writeFileAtomic,
  writeJsonAtomic
};
//# sourceMappingURL=chunk-LU4SNIHE.js.map
