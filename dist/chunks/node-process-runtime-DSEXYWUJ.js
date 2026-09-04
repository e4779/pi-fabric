import {
  GUEST_SETUP,
  createGuestStackMap,
  remapGuestErrorText
} from "./chunk-MZPIJ7A3.js";
import {
  piBashExitMetadata
} from "./chunk-ZEDVRYLH.js";
import {
  transpileFabricCodeWithSourceMap
} from "./chunk-E2UU2MT4.js";
import {
  runAbortable,
  settleWithin
} from "./chunk-JRJ77EGR.js";
import {
  resolveScriptRuntime,
  resolveScriptRuntimeSync
} from "./chunk-OANJNIWI.js";

// src/runtime/node-process-runtime.ts
import { spawn } from "node:child_process";

// src/runtime/node-process-child-source.ts
var NODE_PROCESS_CHILD_SOURCE = String.raw`
import vm from "node:vm";

const pending = new Map();
let nextCallId = 0;

const send = (message) => {
  if (process.connected) process.send?.(message);
};

const formatValue = (value) => {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.stack ?? value.message;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const jsonCompatible = (value) => {
  if (value === undefined) return undefined;
  const serialized = JSON.stringify(value);
  return serialized === undefined ? undefined : JSON.parse(serialized);
};

const run = async (message) => {
  const logs = [];
  let logChars = 0;
  let logsTruncated = false;
  const hostCall = (ref, args) => {
    const id = nextCallId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      send({
        type: "call",
        id,
        ref: String(ref),
        args:
          typeof args === "object" && args !== null && !Array.isArray(args)
            ? args
            : {},
      });
    });
  };
  const print = (...values) => {
    if (logsTruncated) return;
    const line = values.map(formatValue).join(" ");
    const remaining = message.maxLogChars - logChars;
    if (line.length > remaining) {
      if (remaining > 0) logs.push(line.slice(0, remaining));
      logs.push("[Pi Fabric log output truncated]");
      logsTruncated = true;
      return;
    }
    logs.push(line);
    logChars += line.length;
  };
  const sandbox = {
    __fabricHostCall: hostCall,
    __fabricTokenBudget: message.tokenBudget ?? Number.POSITIVE_INFINITY,
    print,
    π: jsonCompatible(message.strings),
  };
  const context = vm.createContext(sandbox, {
    name: "pi-fabric-node-process",
    codeGeneration: { strings: true, wasm: false },
  });

  try {
    vm.runInContext(message.setup, context, { filename: "pi-fabric-setup.js" });
    const promise = vm.runInContext(message.code + "\n__piFabricMain()", context, {
      filename: "pi-fabric-guest.js",
    });
    const value = jsonCompatible(await promise);
    send({ type: "result", result: { value, logs, terminationReason: "completed" } });
  } catch (error) {
    send({
      type: "result",
      result: {
        logs,
        terminationReason: "runtime_error",
        error: error?.stack ?? error?.message ?? String(error),
      },
    });
  }
};

process.on("message", (message) => {
  if (typeof message !== "object" || message === null) return;
  if (message.type === "execute") {
    void run(message);
    return;
  }
  if (message.type !== "response") return;
  const operation = pending.get(message.id);
  if (!operation) return;
  pending.delete(message.id);
  if (message.ok) operation.resolve(message.value);
  else {
    const error = new Error(message.error ?? "Host call failed");
    if (message.bashExit) error.__fabricBashExit = message.bashExit;
    operation.reject(error);
  }
});
`;

// src/runtime/node-process-runtime.ts
var HOST_TASK_SETTLE_GRACE_MS = 250;
var send = (child, message) => {
  if (!child.connected) return;
  child.send(message, () => void 0);
};
var NodeProcessRuntime = class {
  #interpreter;
  constructor(interpreter = "node") {
    this.#interpreter = interpreter;
  }
  async execute(code, hostCall, options) {
    if (options.signal?.aborted) {
      return {
        value: void 0,
        logs: [],
        terminationReason: "aborted",
        error: "Execution cancelled"
      };
    }
    if (!Number.isSafeInteger(options.memoryLimitBytes) || options.memoryLimitBytes < 1) {
      return {
        value: void 0,
        logs: [],
        terminationReason: "runtime_error",
        error: "Process memory limit must be a positive safe integer"
      };
    }
    const runtimeOptions = this.#interpreter === "bun" ? { requireBun: true } : { requireNode: true };
    const interpreterPath = this.#interpreter === "bun" ? await resolveScriptRuntime(runtimeOptions) : resolveScriptRuntimeSync(runtimeOptions);
    const child = spawn(
      interpreterPath,
      this.#interpreter === "bun" ? ["--eval", NODE_PROCESS_CHILD_SOURCE] : [
        `--max-old-space-size=${Math.max(16, Math.floor(options.memoryLimitBytes / (1024 * 1024)))}`,
        "--input-type=module",
        "--eval",
        NODE_PROCESS_CHILD_SOURCE
      ],
      { stdio: ["ignore", "ignore", "ignore", "ipc"] }
    );
    if (options.signal?.aborted) {
      return {
        value: void 0,
        logs: [],
        terminationReason: "aborted",
        error: "Execution cancelled"
      };
    }
    const hostAbortController = new AbortController();
    const startedAt = Date.now();
    let effectiveTimeoutMs = options.timeoutMs;
    let deadlineAt = startedAt + effectiveTimeoutMs;
    let deadline;
    let abortHandler;
    let settled = false;
    let finishing = false;
    const hostTasks = /* @__PURE__ */ new Set();
    const guestBundle = options.transpiledCode === void 0 ? transpileFabricCodeWithSourceMap(code) : { code: options.transpiledCode, sourceMap: options.transpiledSourceMap };
    const guestStackMap = createGuestStackMap(guestBundle.sourceMap);
    const guestLineCount = guestBundle.code.split("\n").length;
    return new Promise((resolve) => {
      const finish = (result) => {
        if (settled) return;
        settled = true;
        if (deadline) clearTimeout(deadline);
        if (abortHandler) options.signal?.removeEventListener("abort", abortHandler);
        if (!hostAbortController.signal.aborted && hostTasks.size > 0) {
          hostAbortController.abort(new Error(result.error ?? "Process execution stopped"));
        }
        child.removeAllListeners();
        if (child.connected) child.disconnect();
        if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
        resolve(result);
      };
      const scheduleDeadline = () => {
        if (deadline) clearTimeout(deadline);
        deadline = setTimeout(() => {
          const error = `Execution timed out after ${effectiveTimeoutMs}ms`;
          finish({ value: void 0, logs: [], terminationReason: "timed_out", error });
        }, Math.max(0, deadlineAt - Date.now()));
        deadline.unref?.();
      };
      const extendDeadline = (ref, args) => {
        const requested = options.minimumTimeoutMsForHostCall?.(ref, args);
        if (typeof requested !== "number" || !Number.isFinite(requested)) return;
        const nextDeadlineAt = Date.now() + Math.max(1, Math.floor(requested));
        if (nextDeadlineAt <= deadlineAt) return;
        deadlineAt = nextDeadlineAt;
        effectiveTimeoutMs = deadlineAt - startedAt;
        scheduleDeadline();
      };
      abortHandler = () => {
        finish({
          value: void 0,
          logs: [],
          terminationReason: "aborted",
          error: "Execution cancelled"
        });
      };
      options.signal?.addEventListener("abort", abortHandler, { once: true });
      child.on("message", (raw) => {
        if (settled || finishing || typeof raw !== "object" || raw === null) return;
        const message = raw;
        if (message.type === "result") {
          finishing = true;
          if (deadline) clearTimeout(deadline);
          if (message.result.terminationReason !== "completed" && !hostAbortController.signal.aborted) {
            hostAbortController.abort(new Error(message.result.error ?? "Process execution stopped"));
          }
          void (async () => {
            const completed = await settleWithin(hostTasks, HOST_TASK_SETTLE_GRACE_MS);
            if (!completed && !hostAbortController.signal.aborted) {
              hostAbortController.abort(
                new Error("Fabric guest execution ended before its host calls settled")
              );
              await settleWithin(hostTasks, HOST_TASK_SETTLE_GRACE_MS);
            }
            finish(
              message.result.error === void 0 ? message.result : {
                ...message.result,
                error: remapGuestErrorText(message.result.error, guestStackMap, guestLineCount)
              }
            );
          })();
          return;
        }
        if (message.type !== "call") return;
        extendDeadline(message.ref, message.args);
        const task = runAbortable(
          hostAbortController.signal,
          () => hostCall(message.ref, message.args, hostAbortController.signal)
        ).then(
          (value) => send(child, { type: "response", id: message.id, ok: true, value }),
          (error) => send(child, {
            type: "response",
            id: message.id,
            ok: false,
            error: error instanceof Error ? error.message : String(error),
            bashExit: message.ref === "pi.bash" ? piBashExitMetadata(error) : void 0
          })
        );
        hostTasks.add(task);
        void task.finally(() => hostTasks.delete(task));
      });
      child.once("error", (error) => {
        finish({
          value: void 0,
          logs: [],
          terminationReason: "runtime_error",
          error: `Process executor failed: ${error.message}`
        });
      });
      child.once("exit", (exitCode, signal) => {
        if (settled) return;
        const detail = signal ? `signal ${signal}` : `exit code ${exitCode ?? "unknown"}`;
        finish({
          value: void 0,
          logs: [],
          terminationReason: "runtime_error",
          error: `Process executor exited before returning a result (${detail}); it may have exceeded its memory limit`
        });
      });
      scheduleDeadline();
      send(child, {
        type: "execute",
        setup: GUEST_SETUP,
        code: guestBundle.code,
        strings: options.strings ?? {},
        tokenBudget: options.tokenBudget,
        maxLogChars: options.maxLogChars ?? 1e5
      });
    });
  }
};
var BunProcessRuntime = class extends NodeProcessRuntime {
  constructor() {
    super("bun");
  }
};
export {
  BunProcessRuntime,
  NodeProcessRuntime
};
//# sourceMappingURL=node-process-runtime-DSEXYWUJ.js.map
