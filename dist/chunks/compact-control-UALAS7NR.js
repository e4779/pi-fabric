// src/agents/compact-control.ts
var ChildCompactControl = class {
  runId;
  hooks;
  #pending;
  #inFlight;
  #childSettled = false;
  #closed = false;
  #sequence = 0;
  #attempts = 0;
  #coalescedRequests = 0;
  constructor(runId, hooks) {
    this.runId = runId;
    this.hooks = hooks;
  }
  queue(instructions) {
    const requestedAt = this.#now();
    if (this.#pending) this.#coalescedRequests++;
    this.#pending = {
      requestedAt,
      ...typeof instructions === "string" && instructions ? { instructions } : {}
    };
    if (this.#inFlight) {
      this.#publish("in_flight", this.#inFlight.requestedAt, {
        startedAt: this.#inFlight.startedAt,
        queued: true
      });
      return;
    }
    if (this.#childSettled) this.#startPending();
    else this.#publish("queued", requestedAt);
  }
  childSettled() {
    this.#childSettled = true;
    if (this.#inFlight) return;
    if (this.#pending) this.#startPending();
    else this.#close();
  }
  observe(event) {
    const inFlight = this.#inFlight;
    if (!inFlight) return;
    if (event.type === "response" && event.command === "compact" && event.id === inFlight.id) {
      if (event.success !== true) {
        this.#finish(
          typeof event.error === "string" && event.error ? event.error : "Child Pi rejected the compact request"
        );
        return;
      }
      inFlight.responseSeen = true;
      this.#maybeFinish();
      return;
    }
    if (event.type !== "compaction_end") return;
    inFlight.endSeen = true;
    if (event.aborted === true) {
      inFlight.error = "Child Pi compaction was aborted";
    } else if (typeof event.errorMessage === "string" && event.errorMessage) {
      inFlight.error = event.errorMessage;
    }
    this.#maybeFinish();
  }
  #startPending() {
    const pending = this.#pending;
    if (!pending || this.#inFlight || this.#closed) return;
    this.#pending = void 0;
    const startedAt = this.#now();
    const id = `fabric-compact-${this.runId}-${++this.#sequence}`;
    const inFlight = {
      id,
      requestedAt: pending.requestedAt,
      startedAt,
      responseSeen: false,
      endSeen: false
    };
    this.#inFlight = inFlight;
    this.#attempts++;
    this.#publish("in_flight", pending.requestedAt, { startedAt });
    try {
      this.hooks.send({
        id,
        type: "compact",
        ...pending.instructions ? { customInstructions: pending.instructions } : {}
      });
    } catch (error) {
      this.#finish(error instanceof Error ? error.message : "Child Pi compact send failed");
    }
  }
  #maybeFinish() {
    const inFlight = this.#inFlight;
    if (!inFlight || !inFlight.responseSeen || !inFlight.endSeen) return;
    this.#finish(inFlight.error);
  }
  #finish(error) {
    const inFlight = this.#inFlight;
    if (!inFlight) return;
    this.#inFlight = void 0;
    const finishedAt = this.#now();
    this.#publish(error ? "failed" : "completed", inFlight.requestedAt, {
      startedAt: inFlight.startedAt,
      finishedAt,
      ...error ? { error } : {},
      ...this.#pending ? { queued: true } : {}
    });
    if (this.#pending) this.#startPending();
    else this.#close();
  }
  #publish(status, requestedAt, extra = {}) {
    this.hooks.update({
      status,
      requestedAt,
      updatedAt: this.#now(),
      attempts: this.#attempts,
      coalescedRequests: this.#coalescedRequests,
      ...extra
    });
  }
  #close() {
    if (this.#closed) return;
    this.#closed = true;
    this.hooks.close();
  }
  #now() {
    return this.hooks.now?.() ?? Date.now();
  }
};
export {
  ChildCompactControl
};
//# sourceMappingURL=compact-control-UALAS7NR.js.map
