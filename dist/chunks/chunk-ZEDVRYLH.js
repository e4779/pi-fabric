// src/core/pi-bash-error.ts
var PiBashExitError = class extends Error {
  constructor(message, exitCode, output) {
    super(message);
    this.exitCode = exitCode;
    this.output = output;
  }
};
function classifyPiBashError(error) {
  if (!(error instanceof Error)) return error;
  const match = /(?:^|\n\n)Command exited with code (\d+)$/.exec(error.message);
  if (!match) return error;
  const exitCode = Number(match[1]);
  if (!Number.isSafeInteger(exitCode) || exitCode <= 0) return error;
  return new PiBashExitError(error.message, exitCode, error.message.slice(0, match.index));
}
function bashResultOutput(original, text) {
  const index = text.indexOf(original.message);
  if (index >= 0) {
    return text.slice(0, index + original.output.length) + text.slice(index + original.message.length);
  }
  const marker = new RegExp(`(?:^|\\r?\\n\\r?\\n)Command exited with code ${original.exitCode}(?=\\r?\\n|$)`, "g");
  const match = marker.exec(text);
  if (!match || marker.exec(text)) return text;
  return text.slice(0, match.index) + text.slice(match.index + match[0].length);
}
function piBashResultError(original, text) {
  if (original instanceof PiBashExitError) {
    return new PiBashExitError(text, original.exitCode, bashResultOutput(original, text));
  }
  return new Error(text.trim() || "Pi bash failed");
}
function piBashExitMetadata(error) {
  return error instanceof PiBashExitError ? { exitCode: error.exitCode, output: error.output } : void 0;
}

export {
  classifyPiBashError,
  piBashResultError,
  piBashExitMetadata
};
//# sourceMappingURL=chunk-ZEDVRYLH.js.map
