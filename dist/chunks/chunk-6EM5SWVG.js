import {
  formatFabricEffectConflict
} from "./chunk-PM3ESBLM.js";
import {
  runAbortable,
  settleWithin
} from "./chunk-JRJ77EGR.js";
import {
  FABRIC_NESTED_TOOL_CALL_ID_PREFIX
} from "./chunk-CTG37A6U.js";
import {
  stableJsonHash
} from "./chunk-2DGB2R4E.js";
import {
  FabricResolutionError,
  FabricTraceSafeError,
  executionOutcomeFromError
} from "./chunk-AZOIDGCU.js";

// src/core/action-registry.ts
import { randomUUID as randomUUID2 } from "node:crypto";
import { Value } from "typebox/value";

// src/core/action-repair.ts
var ACTION_SYNONYM_CLASSES = [
  // memory.recall and its spilled search verbs.
  ["recall", "search", "find", "query", "lookup", "grep", "scan", "locate"],
  // memory.expand / read-one-entry verbs.
  ["expand", "get", "read", "fetch", "load", "view", "show", "hydrate"],
  // memory.sessions and list-style catalog reads.
  ["sessions", "list", "ls", "enumerate", "index"],
  // state.transition / mesh.put write verbs.
  ["transition", "write", "put", "set", "save", "update", "store", "upsert", "append", "post"],
  // agents.create family.
  ["create", "spawn", "new", "add", "make", "register"],
  // mesh.publish family ("post" deliberately also sits in the write class,
  // so mesh.post stays ambiguous between publish and put).
  ["publish", "send", "emit", "notify"],
  // teardown verbs.
  ["delete", "remove", "rm", "destroy", "drop", "clear"],
  // components.reload family.
  ["reload", "restart", "refresh", "rebuild", "reboot"],
  // status/introspection reads ("get" is deliberately shared with the
  // expand class: memory.get expands an entry, components.get is status).
  ["status", "info", "inspect", "health", "describe", "get"],
  // execution verbs.
  ["run", "execute", "exec", "invoke", "call", "start", "go"],
  // cancellation verbs.
  ["cancel", "abort", "stop", "kill", "terminate"],
  // verification verbs.
  ["verify", "check", "validate", "assert", "confirm", "certify"],
  // timeline reads.
  ["history", "log", "journal", "events", "timeline", "transitions"],
  // subscription verbs.
  ["subscribe", "watch", "listen", "observe", "follow"],
  // compact.request family.
  ["request", "begin", "initiate", "trigger", "schedule"],
  // schema.commit family.
  ["commit", "apply", "finalize"],
  // agents messaging pair (both declare, so spilled verbs here stay
  // ambiguous and the failure tier enumerates ask vs tell).
  ["ask", "tell", "say", "chat"]
];
var normalizeActionForm = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
var ACTION_CLASS_FORMS = ACTION_SYNONYM_CLASSES.map(
  (cls) => new Set(cls.map(normalizeActionForm))
);
var camelTokens = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 0);
var singularActionForm = (form) => form.length > 3 && form.endsWith("s") ? form.slice(0, -1) : form;
var levenshtein = (left, right) => {
  if (left === right) return 0;
  if (left.length === 0) return right.length;
  if (right.length === 0) return left.length;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i++) {
    const current = [i];
    for (let j = 1; j <= right.length; j++) {
      current.push(
        Math.min(
          previous[j] + 1,
          current[j - 1] + 1,
          previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1)
        )
      );
    }
    previous = current;
  }
  return previous[right.length];
};
var editThreshold = (form) => form.length <= 4 ? 1 : Math.max(2, Math.floor(form.length / 4));
var tokenAligned = (spilled, declared) => {
  if (spilled.length === 0 || spilled.length !== declared.length) return false;
  return spilled.every((token, index) => {
    const other = declared[index];
    if (token === other) return true;
    return token.length >= 3 && other.length >= 3 && (token.startsWith(other) || other.startsWith(token));
  });
};
var sortNames = (names) => [...new Set(names)].sort((left, right) => left.localeCompare(right));
var repairActionName = (declared, actionName) => {
  const spilledForm = normalizeActionForm(actionName);
  if (spilledForm.length === 0) return { suggestions: [] };
  const rest = declared.filter((name) => name !== actionName);
  if (rest.length === 0) return { suggestions: [] };
  const forms = rest.map((name) => ({ name, form: normalizeActionForm(name) }));
  const classCandidates = ACTION_CLASS_FORMS.filter((classForms) => classForms.has(spilledForm)).flatMap(
    (classForms) => forms.filter((entry) => classForms.has(entry.form)).map((entry) => entry.name)
  );
  if (classCandidates.length === 1) {
    return { repaired: classCandidates[0], suggestions: [classCandidates[0]] };
  }
  if (classCandidates.length > 1) {
    return { suggestions: sortNames(classCandidates) };
  }
  const spilledTokens = camelTokens(actionName);
  const derived = [];
  for (const entry of forms) {
    if (entry.form === spilledForm || singularActionForm(entry.form) === singularActionForm(spilledForm) || spilledTokens.length > 0 && tokenAligned(spilledTokens, camelTokens(entry.name)) || spilledForm.length >= 4 && entry.form.startsWith(spilledForm)) {
      derived.push(entry.name);
    }
  }
  if (derived.length === 1) return { repaired: derived[0], suggestions: [derived[0]] };
  if (derived.length > 1) return { suggestions: sortNames(derived) };
  const distances = forms.map((entry) => ({
    name: entry.name,
    distance: levenshtein(spilledForm, entry.form)
  }));
  const min = Math.min(...distances.map((entry) => entry.distance));
  const threshold = editThreshold(spilledForm);
  if (min <= threshold) {
    const nearest = sortNames(
      distances.filter((entry) => entry.distance === min).map((entry) => entry.name)
    );
    if (nearest.length === 1) return { repaired: nearest[0], suggestions: [nearest[0]] };
    return { suggestions: nearest };
  }
  const suggestions = distances.filter((entry) => entry.distance <= Math.max(3, Math.floor(spilledForm.length / 2))).sort(
    (left, right) => left.distance - right.distance || left.name.localeCompare(right.name)
  ).slice(0, 3).map((entry) => entry.name);
  return { suggestions: sortNames(suggestions) };
};
var formatUnknownActionMessage = (ref, suggestions) => suggestions.length > 0 ? `Unknown Fabric action: ${ref} (did you mean: ${suggestions.slice(0, 3).join(", ")}?)` : `Unknown Fabric action: ${ref}`;

// src/repairs/active.ts
var active;
var setActiveRepairCompiler = (compiler) => {
  active = compiler;
};
var clearActiveRepairCompiler = (compiler) => {
  if (compiler && active === compiler) active = void 0;
};
var getActiveRepairCompiler = () => active;
var applyActiveArgRepairs = (ref, args, schema) => active?.applyArgs(ref, args, schema) ?? args;
var applyActiveActionName = (provider, actionName, declared) => active?.applyActionName(provider, actionName, declared) ?? actionName;

// src/core/provider-bindings.ts
import { randomUUID } from "node:crypto";
var snapshot = (binding) => ({
  ...binding,
  ...binding.closeTask ? { closeTask: binding.closeTask } : {}
});
var FabricProviderBindings = class {
  #current = /* @__PURE__ */ new Map();
  #staged = /* @__PURE__ */ new Map();
  #all = /* @__PURE__ */ new Map();
  #generations = /* @__PURE__ */ new Map();
  #listeners = /* @__PURE__ */ new Set();
  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
  current(name) {
    return this.#current.get(name);
  }
  binding(id) {
    const binding = this.#all.get(id);
    return binding?.state === "closed" ? void 0 : binding;
  }
  has(name) {
    return this.#current.has(name);
  }
  providers() {
    return [...this.#current.values()].map((binding) => binding.provider);
  }
  entries() {
    return [...this.#all.values()].filter((binding) => binding.state !== "closed");
  }
  mount(provider, options = {}) {
    const current = this.#current.get(provider.name);
    const staged = this.#staged.get(provider.name);
    if ((current || staged) && !options.overwrite) {
      throw new Error(`Fabric provider already registered: ${provider.name}`);
    }
    if (staged && options.overwrite) this.retire(staged.id);
    const generation = (this.#generations.get(provider.name) ?? 0) + 1;
    this.#generations.set(provider.name, generation);
    const binding = {
      id: randomUUID(),
      name: provider.name,
      generation,
      provider,
      state: options.staged ? "staged" : "active",
      ownerRetained: true,
      allowReplace: options.overwrite === true,
      retainers: 0,
      inFlight: 0
    };
    if (provider.subscribeCatalog) {
      binding.unsubscribeCatalog = provider.subscribeCatalog(
        () => this.notifyCatalogChanged(provider.name)
      );
    }
    this.#all.set(binding.id, binding);
    if (options.staged) {
      this.#staged.set(binding.name, binding);
      this.#emit({ type: "staged", binding: snapshot(binding) });
    } else {
      const replaced = this.#activateOne(binding);
      if (replaced && options.overwrite) void this.releaseOwner(replaced.id).catch(() => void 0);
    }
    let released = false;
    return {
      bindingId: binding.id,
      name: binding.name,
      generation: binding.generation,
      get active() {
        return binding.state === "active";
      },
      retire: () => this.retire(binding.id),
      release: async () => {
        if (released) return binding.closeTask;
        released = true;
        return this.releaseOwner(binding.id);
      }
    };
  }
  activate(bindingIds) {
    const bindings = bindingIds.map((id) => {
      const binding = this.#all.get(id);
      if (!binding || binding.state === "closed") {
        throw new Error(`Unknown Fabric provider binding: ${id}`);
      }
      if (binding.state !== "staged" && binding.state !== "active") {
        throw new Error(`Fabric provider binding is ${binding.state}: ${binding.name}`);
      }
      return binding;
    });
    const names = /* @__PURE__ */ new Set();
    for (const binding of bindings) {
      if (names.has(binding.name)) {
        throw new Error(`Cannot activate multiple Fabric bindings for provider ${binding.name}`);
      }
      names.add(binding.name);
      const current = this.#current.get(binding.name);
      if (current && current.id !== binding.id && !binding.allowReplace) {
        throw new Error(`Fabric provider already registered: ${binding.name}`);
      }
    }
    const replaced = [];
    for (const binding of bindings) {
      const previous = this.#activateOne(binding);
      if (previous && previous.id !== binding.id) {
        replaced.push(previous.id);
        if (binding.allowReplace) void this.releaseOwner(previous.id).catch(() => void 0);
      }
    }
    return replaced;
  }
  unregister(name) {
    const binding = this.#current.get(name);
    if (!binding) return void 0;
    this.retire(binding.id);
    void this.releaseOwner(binding.id).catch(() => void 0);
    return binding.provider;
  }
  retire(id) {
    const binding = this.#all.get(id);
    if (!binding || binding.state === "retiring" || binding.state === "closed") return;
    if (this.#current.get(binding.name)?.id === id) this.#current.delete(binding.name);
    if (this.#staged.get(binding.name)?.id === id) this.#staged.delete(binding.name);
    binding.state = "retiring";
    this.#emit({ type: "retiring", binding: snapshot(binding) });
    void this.#maybeClose(binding).catch(() => void 0);
  }
  retain(ids) {
    const retained = [];
    try {
      for (const id of new Set(ids)) {
        const binding = this.#all.get(id);
        if (!binding || binding.state === "closed") {
          throw new Error(`Unknown Fabric provider binding: ${id}`);
        }
        binding.retainers++;
        retained.push(binding);
      }
    } catch (error) {
      for (const binding of retained) binding.retainers--;
      throw error;
    }
    let released = false;
    return async () => {
      if (released) return;
      released = true;
      await Promise.all(retained.map(async (binding) => {
        binding.retainers = Math.max(0, binding.retainers - 1);
        await this.#maybeClose(binding);
      }));
    };
  }
  beginInvocation(id) {
    const binding = this.#all.get(id);
    if (!binding || binding.state === "closed") {
      throw new Error(`Unknown Fabric provider binding: ${id}`);
    }
    binding.inFlight++;
    let ended = false;
    return async () => {
      if (ended) return;
      ended = true;
      binding.inFlight = Math.max(0, binding.inFlight - 1);
      await this.#maybeClose(binding);
    };
  }
  notifyCatalogChanged(provider) {
    if (this.#current.has(provider)) this.#emit({ type: "catalog", provider });
  }
  async close(excludedProviderNames = /* @__PURE__ */ new Set()) {
    const tasks = [];
    for (const binding of this.#all.values()) {
      if (binding.state === "closed") continue;
      if (excludedProviderNames.has(binding.name)) {
        if (this.#current.get(binding.name)?.id === binding.id) this.#current.delete(binding.name);
        binding.unsubscribeCatalog?.();
        delete binding.unsubscribeCatalog;
        binding.state = "closed";
        this.#all.delete(binding.id);
        continue;
      }
      this.retire(binding.id);
      binding.ownerRetained = false;
      binding.retainers = 0;
      tasks.push(this.#maybeClose(binding));
    }
    await Promise.allSettled(tasks);
    this.#current.clear();
    this.#staged.clear();
  }
  #activateOne(binding) {
    const current = this.#current.get(binding.name);
    if (current?.id === binding.id && binding.state === "active") return current;
    if (current && current.id !== binding.id) this.retire(current.id);
    if (this.#staged.get(binding.name)?.id === binding.id) this.#staged.delete(binding.name);
    binding.state = "active";
    this.#current.set(binding.name, binding);
    this.#emit({ type: "activated", binding: snapshot(binding) });
    return current;
  }
  async releaseOwner(id) {
    const binding = this.#all.get(id);
    if (!binding) return;
    this.retire(id);
    binding.ownerRetained = false;
    await this.#maybeClose(binding);
  }
  async #maybeClose(binding) {
    if (binding.state !== "retiring" || binding.ownerRetained || binding.retainers > 0 || binding.inFlight > 0) {
      return;
    }
    if (binding.closeTask) return binding.closeTask;
    binding.closeTask = (async () => {
      binding.unsubscribeCatalog?.();
      delete binding.unsubscribeCatalog;
      try {
        await binding.provider.close?.();
      } catch (error) {
        binding.closeError = error instanceof Error ? error.message : String(error);
        throw error;
      } finally {
        binding.state = "closed";
        this.#all.delete(binding.id);
        this.#emit({ type: "closed", binding: snapshot(binding) });
      }
    })();
    return binding.closeTask;
  }
  #emit(event) {
    for (const listener of [...this.#listeners]) {
      try {
        listener(event);
      } catch {
      }
    }
  }
};

// src/core/action-registry.ts
var NESTED_TOOL_CALL_ID_PREFIX = FABRIC_NESTED_TOOL_CALL_ID_PREFIX;
var providerNamePattern = /^[a-z][a-z0-9_-]*$/;
var PREVIEW_ARG_CHARS = 2e3;
var WRITE_PREVIEW_CONTENT_CHARS = 16e3;
var PREVIEW_ARG_KEYS = 32;
var PREVIEW_RESULT_CHARS = 16e3;
var PREVIEW_NESTED_CHARS = 16e3;
var MAX_AUDIT_VALUE_CHARS = 64e3;
var MAX_VALIDATION_MESSAGE_CHARS = 2e3;
var truncateString = (value, max) => value.length <= max ? value : `${value.slice(0, max)}\u2026`;
var boundedPreviewValue = (value, maxChars) => {
  if (value === void 0 || value === null || typeof value !== "object") return value;
  try {
    const serialized = JSON.stringify(value);
    if (serialized.length <= maxChars) return JSON.parse(serialized);
    return {
      fabricTruncated: true,
      originalChars: serialized.length,
      preview: serialized.slice(0, Math.max(1, maxChars - 100))
    };
  } catch {
    return truncateString(String(value), maxChars);
  }
};
var previewArgs = (ref, args) => {
  const out = {};
  let count = 0;
  for (const [key, value] of Object.entries(args)) {
    if (count++ >= PREVIEW_ARG_KEYS) break;
    const maxChars = ref === "pi.write" && key === "content" ? WRITE_PREVIEW_CONTENT_CHARS : PREVIEW_ARG_CHARS;
    out[key] = typeof value === "string" ? truncateString(value, maxChars) : boundedPreviewValue(value, PREVIEW_NESTED_CHARS);
  }
  return out;
};
var previewResult = (value) => {
  if (typeof value === "string") return truncateString(value, PREVIEW_RESULT_CHARS);
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const out = {};
    let count = 0;
    for (const [key, val] of Object.entries(value)) {
      if (count++ >= PREVIEW_ARG_KEYS) break;
      out[key] = typeof val === "string" ? truncateString(val, PREVIEW_RESULT_CHARS) : boundedPreviewValue(val, PREVIEW_NESTED_CHARS);
    }
    return out;
  }
  return boundedPreviewValue(value, PREVIEW_RESULT_CHARS);
};
var failedResultError = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
  const record = value;
  const status = record.status;
  if (status !== "failed" && status !== "stopped" && status !== "timed_out") return void 0;
  const error = typeof record.error === "string" ? record.error.trim() : "";
  return error ? truncateString(error, PREVIEW_RESULT_CHARS) : `Fabric action returned ${status}`;
};
var failedResultOutcome = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return "failed";
  const status = value.status;
  return status === "timed_out" ? "timed_out" : status === "stopped" ? "aborted" : "failed";
};
var boundedResult = (value, maxChars) => {
  let serialized;
  try {
    const encoded = JSON.stringify(value);
    if (encoded === void 0 && value !== void 0) {
      throw new Error(`unsupported result type: ${typeof value}`);
    }
    serialized = encoded ?? "null";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Fabric action returned a non-JSON-serializable value: ${message}`);
  }
  if (serialized.length <= maxChars) {
    return { value, chars: serialized.length, truncated: false };
  }
  const previewChars = Math.max(1, maxChars - 200);
  return {
    value: {
      fabricTruncated: true,
      originalChars: serialized.length,
      preview: serialized.slice(0, previewChars)
    },
    chars: serialized.length,
    truncated: true
  };
};
var resolveDescriptor = (provider, descriptor) => ({
  ...descriptor,
  effect: descriptor.effect ?? (descriptor.risk === "read" ? { kind: "none", ordering: "commutative" } : { kind: "emission", ordering: "unknown" }),
  provider: provider.name,
  ref: `${provider.name}.${descriptor.name}`
});
var descriptorHash = stableJsonHash;
var actionDescriptorHash = (action) => descriptorHash({
  ref: action.ref,
  description: action.description,
  inputSchema: action.inputSchema,
  outputSchema: action.outputSchema,
  risk: action.risk,
  namespace: action.namespace,
  effect: action.effect
});
var discoveryTerms = (value) => [...value.normalize("NFKC").matchAll(/[\p{L}\p{N}_]+/gu)].map((match) => match[0].toLowerCase());
var conflictBetween = (left, right) => {
  if (left.kind === "none" || right.kind === "none") return void 0;
  const resources = (effect) => [...new Set((effect.resources ?? []).filter(
    (resource) => typeof resource === "string" && resource.length > 0
  ).map((resource) => resource.slice(0, 256)))].slice(0, 64);
  const leftResources = resources(left);
  const rightResources = resources(right);
  if (leftResources.length === 0 || rightResources.length === 0) {
    if (left.ordering === "commutative" && right.ordering === "commutative") return void 0;
    return { resources: ["*"], reason: "unknown_resource" };
  }
  const rightSet = new Set(rightResources);
  const overlap = leftResources.filter((resource) => rightSet.has(resource)).sort();
  if (overlap.length === 0) return void 0;
  if (left.ordering === "commutative" && right.ordering === "commutative") return void 0;
  return { resources: overlap, reason: "shared_resource" };
};
var unexpectedKeys = (schema, value) => {
  if (schema.type !== "object") return [];
  if (schema.additionalProperties !== false) return [];
  if (schema.patternProperties !== void 0) return [];
  const properties = schema.properties;
  if (!properties) return [];
  return Object.keys(value).filter((key) => !(key in properties));
};
var validationMessage = (schema, value) => {
  try {
    if (Value.Check(schema, value)) return void 0;
    const messages = [...Value.Errors(schema, value)].slice(0, 5).map((error) => {
      const at = error.path;
      return typeof at === "string" && at !== "" && at !== "/" ? `${at}: ${error.message}` : error.message;
    });
    for (const key of unexpectedKeys(schema, value).slice(0, 5)) {
      messages.push(`/${key}: must not have additional properties`);
    }
    return truncateString(
      messages.join("; ") || "Schema validation failed",
      MAX_VALIDATION_MESSAGE_CHARS
    );
  } catch {
    return "Schema validator failed";
  }
};
var declaredPropertyNames = (schema) => {
  const properties = schema.properties;
  return properties ? Object.keys(properties) : [];
};
var repairCatalogInput = (ref, schema, args) => {
  const extras = unexpectedKeys(schema, args).sort();
  const observedUnexpected = extras.length > 0 ? extras.join("\0") : void 0;
  if (extras.length > 0) {
    getActiveRepairCompiler()?.observeInvalidArgs(
      ref,
      args,
      declaredPropertyNames(schema),
      extras.join(","),
      { countError: false, extraKeys: extras }
    );
  }
  return {
    args: applyActiveArgRepairs(ref, args, schema),
    observedUnexpected
  };
};
var validateCatalogArgs = (ref, schema, args, observedUnexpected) => {
  const compiler = getActiveRepairCompiler();
  const first = applyActiveArgRepairs(ref, args, schema);
  const invalid = validationMessage(schema, first);
  if (!invalid) return { args: first };
  const extras = unexpectedKeys(schema, first).sort();
  if (observedUnexpected === void 0 || extras.join("\0") !== observedUnexpected) {
    compiler?.observeInvalidArgs(
      ref,
      first,
      declaredPropertyNames(schema),
      invalid,
      { countError: false, extraKeys: extras }
    );
  }
  const second = applyActiveArgRepairs(ref, first, schema);
  const stillInvalid = validationMessage(schema, second);
  if (stillInvalid) compiler?.recordInvocationError();
  return stillInvalid ? { args: second, invalid: stillInvalid } : { args: second };
};
var ActionRegistry = class {
  constructor(toolResultProxy) {
    this.toolResultProxy = toolResultProxy;
    this.#providerBindings.subscribe(() => this.#speculation?.reset?.());
  }
  #providerBindings = new FabricProviderBindings();
  #activeEffects = /* @__PURE__ */ new Map();
  #unavailable = /* @__PURE__ */ new Map();
  #speculation;
  #speculationEligibility;
  /**
   * Attach the speculative-PTC runtime. Eligibility is re-checked against the
   * resolved descriptor inside speculate(), so a config/captured-tool change
   * cannot sneak a side-effecting ref into the store after the fact.
   */
  setSpeculation(runtime, eligibility) {
    this.#speculation = runtime;
    this.#speculationEligibility = eligibility;
  }
  register(provider, options = {}) {
    this.mount(provider, options);
  }
  mount(provider, options = {}) {
    if (!providerNamePattern.test(provider.name)) {
      throw new Error(`Invalid Fabric provider name: ${provider.name}`);
    }
    const lease = this.#providerBindings.mount(provider, options);
    this.#unavailable.delete(provider.name);
    return lease;
  }
  activateProviderBindings(bindingIds) {
    return this.#providerBindings.activate(bindingIds);
  }
  subscribeProviderChanges(listener) {
    return this.#providerBindings.subscribe(listener);
  }
  notifyCatalogChanged(provider) {
    this.#providerBindings.notifyCatalogChanged(provider);
  }
  has(name) {
    return this.#providerBindings.has(name);
  }
  markUnavailable(name, reason) {
    if (!providerNamePattern.test(name)) {
      throw new Error(`Invalid Fabric provider name: ${name}`);
    }
    if (this.#providerBindings.has(name)) {
      throw new Error(`Cannot mark a registered Fabric provider unavailable: ${name}`);
    }
    this.#unavailable.set(name, reason);
  }
  unavailableProviders() {
    return [...this.#unavailable.entries()].map(([name, reason]) => ({ name, reason })).sort((left, right) => left.name.localeCompare(right.name));
  }
  unregister(name) {
    return this.#providerBindings.unregister(name);
  }
  providers() {
    return this.#providerBindings.providers().map((provider) => ({ name: provider.name, description: provider.description })).sort((left, right) => left.name.localeCompare(right.name));
  }
  async inspectCapabilities(requirements, context) {
    return this.#resolveCapabilities(requirements, context, false);
  }
  async acquireCapabilityView(requirements, context) {
    return this.#resolveCapabilities(requirements, context, true);
  }
  /**
   * Snapshot the tool schemas backing the dynamic guest surfaces (mcp and
   * extensions) so the type gate can reject argument-shape mistakes before
   * the sandbox runs. Side-effect-free by construction: MCP data comes from
   * the provider's cache-warm descriptor slice (listing would schedule
   * background revalidation), extension data from the captured-tool catalog.
   * Providers that cannot supply data yet simply contribute no section and
   * the loose declarations stand for that execution.
   */
  async guestTypeSources(context) {
    const sources = {};
    if (context.capabilityView) {
      const actions = await this.list({ limit: 1e3 }, context);
      const byServer = /* @__PURE__ */ new Map();
      for (const action of actions.filter((candidate) => candidate.provider === "mcp")) {
        const server = action.namespace;
        if (!server || server === "management" || action.name.startsWith("$")) continue;
        const prefix = `${server}.`;
        const name = action.name.startsWith(prefix) ? action.name.slice(prefix.length) : action.name;
        const tools = byServer.get(server) ?? [];
        tools.push({ name, inputSchema: action.inputSchema });
        byServer.set(server, tools);
      }
      if (byServer.size > 0) {
        sources.mcpServers = [...byServer.entries()].map(([server, tools]) => ({
          server,
          tools
        }));
      }
      const extensionTools = actions.filter((action) => action.provider === "extensions").map((action) => ({ name: action.name, inputSchema: action.inputSchema }));
      if (extensionTools.length > 0) sources.extensionTools = extensionTools;
      return sources;
    }
    const mcp = this.#providerBindings.current("mcp")?.provider;
    const mcpDescriptors = mcp?.sliceDescriptors?.();
    if (mcpDescriptors && mcpDescriptors.length > 0) {
      const byServer = /* @__PURE__ */ new Map();
      for (const descriptor of mcpDescriptors) {
        const server = descriptor.namespace;
        if (!server || server === "management" || descriptor.name.startsWith("$")) continue;
        const prefix = `${server}.`;
        const toolName = descriptor.name.startsWith(prefix) ? descriptor.name.slice(prefix.length) : descriptor.name;
        let tools = byServer.get(server);
        if (!tools) {
          tools = /* @__PURE__ */ new Map();
          byServer.set(server, tools);
        }
        tools.set(toolName, { name: toolName, inputSchema: descriptor.inputSchema });
      }
      if (byServer.size > 0) {
        sources.mcpServers = [...byServer.entries()].map(([server, tools]) => ({
          server,
          tools: [...tools.values()]
        }));
      }
    }
    const extensions = this.#providerBindings.current("extensions")?.provider;
    if (extensions) {
      try {
        const descriptors = await extensions.list({}, context);
        if (descriptors.length > 0) {
          sources.extensionTools = descriptors.map((descriptor) => ({
            name: descriptor.name,
            inputSchema: descriptor.inputSchema
          }));
        }
      } catch {
      }
    }
    return sources;
  }
  async list(request, context) {
    if (context.capabilityView) {
      const refs = Object.keys(context.capabilityView.bindings).filter((ref) => !request.provider || ref.startsWith(`${request.provider}.`)).sort();
      const actions = await Promise.all(refs.map((ref) => this.describe(ref, context)));
      const query = request.query?.normalize("NFKC").trim().toLowerCase();
      return actions.filter((action) => !request.namespace || action.namespace === request.namespace).filter(
        (action) => !query || `${action.ref} ${action.description}`.toLowerCase().includes(query)
      ).slice(0, Math.max(1, Math.min(request.limit ?? 100, 1e3)));
    }
    const providers = request.provider ? [this.#requireProvider(request.provider)] : this.#providerBindings.providers();
    const lists = await Promise.all(
      providers.map(async (provider) => {
        const descriptors = await provider.list(request, context);
        return descriptors.map((descriptor) => resolveDescriptor(provider, descriptor));
      })
    );
    const limit = Math.max(1, Math.min(request.limit ?? 100, 1e3));
    return lists.flat().slice(0, limit);
  }
  async catalog(context, options = {}) {
    const providers = (context.capabilityView ? [...new Map(
      Object.values(context.capabilityView.bindings).flatMap((pinned) => {
        const binding = this.#providerBindings.binding(pinned.providerBindingId);
        return binding ? [[binding.name, binding.provider]] : [];
      })
    ).values()] : options.provider ? [this.#requireProvider(options.provider)] : this.#providerBindings.providers()).filter((provider) => !options.provider || provider.name === options.provider).filter((provider) => options.includeProvider?.(provider.name) ?? true).sort((left, right) => left.name.localeCompare(right.name));
    const lists = await Promise.all(
      providers.map(async (provider) => ({
        provider,
        actions: context.capabilityView ? await this.list({ provider: provider.name, limit: 1e3 }, context) : (await provider.list({}, context)).map((descriptor) => resolveDescriptor(provider, descriptor))
      }))
    );
    const allActions = lists.flatMap(({ actions }) => actions).sort((left, right) => left.ref.localeCompare(right.ref));
    const limit = Math.max(1, Math.min(Math.floor(options.limit ?? 1e3), 1e3));
    const retainedRefs = new Set(allActions.slice(0, limit).map((action) => action.ref));
    const providerHeads = lists.map(({ provider, actions }) => {
      const actionHeads = actions.filter((action) => retainedRefs.has(action.ref)).sort((left, right) => left.ref.localeCompare(right.ref)).map((action) => ({
        key: `action:${action.ref}`,
        parentKey: `provider:${provider.name}`,
        ref: action.ref,
        name: action.name,
        description: action.description,
        descriptorHash: actionDescriptorHash(action),
        risk: action.risk,
        ...action.namespace === void 0 ? {} : { namespace: action.namespace },
        ...action.effect === void 0 ? {} : { effect: action.effect }
      }));
      return {
        key: `provider:${provider.name}`,
        parentKey: "capability:fabric",
        name: provider.name,
        description: provider.description,
        descriptorHash: descriptorHash({
          name: provider.name,
          description: provider.description,
          actions: actionHeads.map((action) => action.descriptorHash)
        }),
        actions: actionHeads
      };
    });
    const indexedActions = providerHeads.reduce((total, provider) => total + provider.actions.length, 0);
    const rootHash = descriptorHash(providerHeads.map((provider) => provider.descriptorHash));
    return {
      kind: "pi-fabric.capability-catalog",
      version: 1,
      root: {
        key: "capability:fabric",
        name: "Fabric capabilities",
        description: context.capabilityView ? "Committed provider and action metadata for this execution; not historical session evidence." : "Current registered provider and action metadata for navigation; not historical session evidence.",
        descriptorHash: rootHash
      },
      providers: providerHeads,
      totalActions: allActions.length,
      indexedActions,
      complete: indexedActions === allActions.length,
      reasons: indexedActions === allActions.length ? [] : ["action_limit"]
    };
  }
  async search(query, context, limit = 30) {
    const normalizedQuery = query.normalize("NFKC").trim().toLowerCase();
    if (!normalizedQuery) return [];
    const queryTerms = [...new Set(discoveryTerms(normalizedQuery))];
    const listed = await this.list({ limit: 1e3 }, context);
    return listed.map((action) => {
      const providerDescription = this.#providerBindings.current(action.provider)?.provider.description ?? "";
      const ref = action.ref.normalize("NFKC").toLowerCase();
      const name = action.name.normalize("NFKC").toLowerCase();
      const description = action.description.normalize("NFKC").toLowerCase();
      const provider = action.provider.normalize("NFKC").toLowerCase();
      const providerBody = providerDescription.normalize("NFKC").toLowerCase();
      const namespace = (action.namespace ?? "").normalize("NFKC").toLowerCase();
      const schema = JSON.stringify(action.inputSchema).normalize("NFKC").toLowerCase();
      const tokenSets = {
        ref: new Set(discoveryTerms(ref)),
        name: new Set(discoveryTerms(name)),
        description: new Set(discoveryTerms(description)),
        provider: new Set(discoveryTerms(provider)),
        providerBody: new Set(discoveryTerms(providerBody)),
        namespace: new Set(discoveryTerms(namespace)),
        schema: new Set(discoveryTerms(schema))
      };
      const fields = Object.values(tokenSets);
      let score = 0;
      if (ref === normalizedQuery) score += 1e3;
      if (name === normalizedQuery) score += 800;
      if (ref.startsWith(normalizedQuery)) score += 300;
      else if (ref.includes(normalizedQuery)) score += 120;
      if (description.includes(normalizedQuery)) score += 40;
      if (providerBody.includes(normalizedQuery)) score += 20;
      if (schema.includes(normalizedQuery)) score += 10;
      let matchedTerms = 0;
      for (const term of queryTerms) {
        const matched = fields.some((field) => field.has(term));
        if (!matched) continue;
        matchedTerms += 1;
        if (tokenSets.ref.has(term) || tokenSets.name.has(term)) score += 30;
        if (tokenSets.provider.has(term)) score += 20;
        if (tokenSets.description.has(term)) score += 8;
        if (tokenSets.providerBody.has(term)) score += 4;
        if (tokenSets.namespace.has(term)) score += 6;
        if (tokenSets.schema.has(term)) score += 2;
      }
      if (queryTerms.length > 0 && matchedTerms === queryTerms.length) score += 15;
      return { action, score };
    }).filter((entry) => entry.score > 0).sort(
      (left, right) => right.score - left.score || left.action.ref.localeCompare(right.action.ref)
    ).slice(0, Math.max(1, Math.min(limit, 100))).map((entry) => entry.action);
  }
  async describe(ref, context) {
    if (ref.includes(".")) {
      const { provider, actionName, expectedDescriptorHash } = this.#parseRef(
        ref,
        context.capabilityView
      );
      const resolved = await this.#resolveActionDescriptor(
        provider,
        actionName,
        context,
        context.capabilityView === void 0
      );
      if (!resolved.action) {
        throw new FabricResolutionError(formatUnknownActionMessage(ref, resolved.suggestions));
      }
      const action = resolved.action;
      if (expectedDescriptorHash && actionDescriptorHash(action) !== expectedDescriptorHash) {
        throw new FabricResolutionError(`Fabric capability descriptor changed: ${ref}`);
      }
      return action;
    }
    if (context.capabilityView) {
      const pinned = await Promise.all(
        Object.keys(context.capabilityView.bindings).map(
          (candidate) => this.describe(candidate, context)
        )
      );
      const matches2 = pinned.filter((action) => action.name === ref);
      if (matches2.length === 1) return matches2[0];
      if (matches2.length > 1) {
        throw new Error(
          `"${ref}" matches ${matches2.length} committed Fabric actions; qualify with provider.action: ` + matches2.map((match) => match.ref).sort().join(", ")
        );
      }
      throw new FabricResolutionError(`Unknown Fabric action in committed view: ${ref}`);
    }
    const matches = [];
    const declaredNames = [];
    for (const provider of this.#providerBindings.providers()) {
      let descriptors;
      try {
        descriptors = await provider.list({}, context);
      } catch {
        continue;
      }
      for (const descriptor of descriptors) {
        declaredNames.push(descriptor.name);
        if (descriptor.name === ref) matches.push(resolveDescriptor(provider, descriptor));
      }
    }
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      throw new Error(
        `"${ref}" matches ${matches.length} Fabric actions; qualify with provider.action: ` + matches.map((match) => match.ref).sort().join(", ")
      );
    }
    const repair = repairActionName(declaredNames, ref);
    throw new FabricResolutionError(formatUnknownActionMessage(ref, repair.suggestions));
  }
  async acquireScoped(ref, args, context) {
    const { binding, provider, actionName, expectedDescriptorHash } = this.#parseRef(
      ref,
      context.capabilityView
    );
    const endInvocation = this.#providerBindings.beginInvocation(binding.id);
    const releaseBinding = this.#providerBindings.retain([binding.id]);
    let retentionTransferred = false;
    try {
      const resolved = await this.#resolveActionDescriptor(
        provider,
        actionName,
        context,
        context.capabilityView === void 0
      );
      if (!resolved.action) {
        throw new FabricResolutionError(formatUnknownActionMessage(ref, resolved.suggestions));
      }
      const action = resolved.action;
      const providerActionName = resolved.repairedFrom === void 0 ? actionName : action.name;
      if (expectedDescriptorHash && actionDescriptorHash(action) !== expectedDescriptorHash) {
        throw new FabricResolutionError(`Fabric capability descriptor changed: ${ref}`);
      }
      if (action.effect?.kind !== "scoped") {
        throw new Error(`Fabric action is not a scoped acquisition: ${ref}`);
      }
      if (!provider.acquire) {
        throw new Error(`Fabric provider does not implement scoped acquisition: ${provider.name}`);
      }
      const catalogInput = repairCatalogInput(action.ref, action.inputSchema, args);
      const preparedArgs = provider.prepareArguments ? await runAbortable(
        context.signal,
        () => provider.prepareArguments(providerActionName, catalogInput.args, context)
      ) : catalogInput.args;
      if (typeof preparedArgs !== "object" || preparedArgs === null || Array.isArray(preparedArgs)) {
        throw new Error(`Argument preparation for ${ref} did not return an object`);
      }
      const catalog = validateCatalogArgs(
        action.ref,
        action.inputSchema,
        preparedArgs,
        catalogInput.observedUnexpected
      );
      if (catalog.invalid) throw new Error(`Invalid arguments for ${ref}: ${catalog.invalid}`);
      const acquired = await runAbortable(
        context.signal,
        () => provider.acquire(providerActionName, catalog.args, context)
      );
      if (!acquired || typeof acquired.dispose !== "function") {
        throw new Error(`Scoped acquisition ${ref} did not return a disposer`);
      }
      let disposal;
      retentionTransferred = true;
      return {
        value: acquired.value,
        dispose: () => {
          disposal ??= (async () => {
            try {
              await acquired.dispose();
            } finally {
              await releaseBinding();
            }
          })();
          return disposal;
        }
      };
    } finally {
      await endInvocation().catch(() => void 0);
      if (!retentionTransferred) await releaseBinding().catch(() => void 0);
    }
  }
  async invoke(ref, args, context) {
    const traceOperation = context.traceOperation ?? context.trace?.issueCall(ref, args);
    let failureStage = "resolve";
    let audit;
    let invocationActive = false;
    let endBindingInvocation;
    try {
      const { binding, provider, actionName, expectedDescriptorHash } = this.#parseRef(
        ref,
        context.capabilityView
      );
      endBindingInvocation = this.#providerBindings.beginInvocation(binding.id);
      const resolved = await this.#resolveActionDescriptor(
        provider,
        actionName,
        context,
        context.capabilityView === void 0
      );
      if (!resolved.action) {
        throw new FabricResolutionError(formatUnknownActionMessage(ref, resolved.suggestions));
      }
      const action = resolved.action;
      const providerActionName = resolved.repairedFrom === void 0 ? actionName : action.name;
      if (expectedDescriptorHash && actionDescriptorHash(action) !== expectedDescriptorHash) {
        throw new FabricResolutionError(`Fabric capability descriptor changed: ${ref}`);
      }
      traceOperation?.resolved(action.provider, action.name);
      failureStage = "guard";
      if (action.effect?.kind === "scoped") {
        throw new FabricTraceSafeError(
          `Fabric scoped action ${ref} requires a supervised acquisition context`
        );
      }
      if (context.authorize) {
        await runAbortable(context.signal, () => context.authorize(action));
      }
      failureStage = "prepare";
      const catalogInput = repairCatalogInput(action.ref, action.inputSchema, args);
      const preparedArgs = provider.prepareArguments ? await runAbortable(
        context.signal,
        () => provider.prepareArguments(providerActionName, catalogInput.args, context)
      ) : catalogInput.args;
      if (typeof preparedArgs !== "object" || preparedArgs === null || Array.isArray(preparedArgs)) {
        throw new FabricTraceSafeError(`Argument preparation for ${ref} did not return an object`);
      }
      failureStage = "validate";
      const catalog = validateCatalogArgs(
        action.ref,
        action.inputSchema,
        preparedArgs,
        catalogInput.observedUnexpected
      );
      traceOperation?.prepared(catalog.args);
      if (catalog.invalid) {
        throw new FabricTraceSafeError(`Invalid arguments for ${ref}: ${catalog.invalid}`);
      }
      failureStage = "approve";
      await runAbortable(context.signal, () => context.approve(action, catalog.args));
      failureStage = "invoke";
      const nestedToolCallId = `${NESTED_TOOL_CALL_ID_PREFIX}${randomUUID2()}`;
      const effect = action.effect;
      const effectConflicts = [...this.#activeEffects.values()].flatMap((active2) => {
        const conflict = conflictBetween(effect, active2.effect);
        return conflict ? [{ withRef: active2.ref, ...conflict }] : [];
      }).slice(0, 32);
      if (effectConflicts.length > 0 && context.effectPolicy === "strict") {
        failureStage = "guard";
        throw new FabricTraceSafeError(
          `Fabric effect conflict for ${ref}: ${effectConflicts.map((conflict) => formatFabricEffectConflict(
            conflict.withRef,
            conflict.resources,
            conflict.reason
          )).join("; ")}`
        );
      }
      const argsPreview = previewArgs(ref, catalog.args);
      const activeAudit = {
        ref,
        nestedToolCallId,
        startedAt: Date.now(),
        tool: action.name,
        provider: action.provider,
        args: boundedPreviewValue(
          argsPreview,
          MAX_AUDIT_VALUE_CHARS
        ),
        ...effectConflicts.length > 0 ? { effectConflicts } : {},
        ...resolved.repairedFrom !== void 0 ? { repairedFrom: resolved.repairedFrom } : {}
      };
      audit = activeAudit;
      invocationActive = true;
      context.audits.push(activeAudit);
      context.observeInvocation?.({
        type: "call_start",
        callId: nestedToolCallId,
        ref,
        args: argsPreview
      });
      context.update(`Calling ${ref}`);
      this.#activeEffects.set(nestedToolCallId, { ref, effect });
      let servedFromSpeculation = false;
      let providerValue;
      if (this.#speculation && effect.kind === "none") {
        const served = await runAbortable(context.signal, () => this.#speculation.tryServe(context.parentToolCallId, ref, catalog.args, binding.id));
        if (served.hit) {
          servedFromSpeculation = true;
          activeAudit.speculated = true;
          providerValue = served.value;
          if (served.replay.updatedArgs !== void 0) {
            const replayedPreview = previewArgs(ref, served.replay.updatedArgs);
            activeAudit.args = boundedPreviewValue(
              replayedPreview,
              MAX_AUDIT_VALUE_CHARS
            );
            traceOperation?.prepared(served.replay.updatedArgs);
            context.observeInvocation?.({
              type: "call_args",
              callId: nestedToolCallId,
              args: replayedPreview
            });
          }
          if (served.replay.media?.length) {
            activeAudit.media = [...activeAudit.media ?? [], ...served.replay.media];
            if (served.replay.mediaNote) activeAudit.mediaNote = served.replay.mediaNote;
          }
          if (served.replay.preview !== void 0) activeAudit.preview = served.replay.preview;
        }
      }
      let providerInvoked = false;
      try {
        if (!servedFromSpeculation) {
          providerInvoked = true;
          providerValue = await runAbortable(
            context.signal,
            () => provider.invoke(providerActionName, catalog.args, {
              ...context,
              nestedToolCallId,
              update(message) {
                if (!invocationActive) return;
                context.update(message);
                context.observeInvocation?.({
                  type: "call_update",
                  callId: nestedToolCallId,
                  update: { type: "progress", message }
                });
              },
              activity(update) {
                if (!invocationActive) return;
                context.activity?.(update);
                context.observeInvocation?.({
                  type: "call_update",
                  callId: nestedToolCallId,
                  update
                });
              },
              attachMedia(blocks, note) {
                if (!invocationActive) return;
                if (!activeAudit.media) activeAudit.media = [];
                for (const block of blocks) activeAudit.media.push(block);
                if (note) activeAudit.mediaNote = note;
              },
              updateArguments(updatedArgs) {
                if (!invocationActive) return;
                const updatedPreview = previewArgs(ref, updatedArgs);
                activeAudit.args = boundedPreviewValue(
                  updatedPreview,
                  MAX_AUDIT_VALUE_CHARS
                );
                traceOperation?.prepared(updatedArgs);
                context.observeInvocation?.({
                  type: "call_args",
                  callId: nestedToolCallId,
                  args: updatedPreview
                });
              },
              attachPreview(preview) {
                if (!invocationActive) return;
                activeAudit.preview = preview;
              }
            })
          );
        }
      } finally {
        if (providerInvoked && effect.kind !== "none") this.#speculation?.bumpEpoch();
        this.#activeEffects.delete(nestedToolCallId);
      }
      const value = this.toolResultProxy ? await runAbortable(context.signal, () => this.toolResultProxy.proxy({
        action,
        args: catalog.args,
        toolCallId: nestedToolCallId,
        value: providerValue,
        ...context.signal ? { signal: context.signal } : {}
      })) : providerValue;
      const bounded = boundedResult(value, context.maxResultChars);
      const resultError = failedResultError(value);
      activeAudit.success = resultError === void 0;
      if (resultError) activeAudit.error = resultError;
      activeAudit.resultChars = bounded.chars;
      activeAudit.resultTruncated = bounded.truncated;
      const resultPreview = previewResult(bounded.value);
      activeAudit.result = boundedPreviewValue(resultPreview, MAX_AUDIT_VALUE_CHARS);
      activeAudit.endedAt = Date.now();
      context.observeInvocation?.({
        type: "call_end",
        callId: nestedToolCallId,
        success: resultError === void 0,
        result: resultPreview,
        ...activeAudit.preview !== void 0 ? { preview: activeAudit.preview } : {},
        ...resultError ? { error: resultError } : {}
      });
      if (resultError) {
        traceOperation?.fail("invoke", resultError, failedResultOutcome(value), bounded.value, {
          resultTruncated: bounded.truncated
        });
      } else {
        traceOperation?.succeed(bounded.value, { resultTruncated: bounded.truncated });
      }
      return bounded.value;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      traceOperation?.fail(failureStage, error, executionOutcomeFromError(error, context.signal));
      if (audit) {
        audit.success = false;
        audit.error = message;
        audit.endedAt = Date.now();
        context.observeInvocation?.({
          type: "call_end",
          callId: audit.nestedToolCallId,
          success: false,
          error: audit.error
        });
      }
      throw error;
    } finally {
      invocationActive = false;
      if (audit) audit.endedAt ??= Date.now();
      await endBindingInvocation?.().catch(() => void 0);
    }
  }
  /**
   * Prepare + pre-launch a speculative call discovered in a partially
   * streamed program (see src/speculation). Pure pipeline only: descriptor
   * resolution, the eligibility gate on the resolved action, argument
   * preparation, and schema validation. authorize/approve/audits are skipped
   * because the eligibility gate restricts this path to actions that never
   * prompt, and the real call re-runs the full pipeline on a serve miss.
   * Side-channel outputs are captured into `replay` so the serve path can
   * project them into the real audit.
   */
  async speculate(ref, args, context, replay) {
    if (!this.#speculationEligibility) return void 0;
    try {
      const { binding, provider, actionName, expectedDescriptorHash } = this.#parseRef(
        ref,
        context.capabilityView
      );
      const descriptor = await runAbortable(context.signal, () => provider.describe(actionName, context));
      if (!descriptor) return void 0;
      const action = resolveDescriptor(provider, descriptor);
      if (expectedDescriptorHash && actionDescriptorHash(action) !== expectedDescriptorHash) {
        return void 0;
      }
      if (!this.#speculationEligibility(action)) return void 0;
      const catalogInput = applyActiveArgRepairs(action.ref, args, action.inputSchema);
      const preparedArgs = provider.prepareArguments ? await runAbortable(context.signal, () => provider.prepareArguments(actionName, catalogInput, context)) : catalogInput;
      if (typeof preparedArgs !== "object" || preparedArgs === null || Array.isArray(preparedArgs)) {
        return void 0;
      }
      const repairedArgs = applyActiveArgRepairs(
        action.ref,
        preparedArgs,
        action.inputSchema
      );
      if (validationMessage(action.inputSchema, repairedArgs)) return void 0;
      const nestedToolCallId = `${NESTED_TOOL_CALL_ID_PREFIX}spec-${randomUUID2()}`;
      return {
        preparedArgs: repairedArgs,
        bindingToken: binding.id,
        execute: async (signal) => {
          const endBindingInvocation = this.#providerBindings.beginInvocation(binding.id);
          try {
            return await runAbortable(
              signal,
              () => provider.invoke(actionName, repairedArgs, {
                ...context,
                signal,
                nestedToolCallId,
                update() {
                },
                activity() {
                },
                attachMedia(blocks, note) {
                  replay.media = [...replay.media ?? [], ...blocks];
                  if (note) replay.mediaNote = note;
                },
                updateArguments(updatedArgs) {
                  replay.updatedArgs = updatedArgs;
                },
                attachPreview(preview) {
                  replay.preview = preview;
                }
              })
            );
          } finally {
            await endBindingInvocation().catch(() => void 0);
          }
        }
      };
    } catch {
      return void 0;
    }
  }
  async endInvocation(parentToolCallId, timeoutMs = 1e3) {
    this.#speculation?.onInvocationEnd?.(parentToolCallId);
    const providers = new Set(
      this.#providerBindings.entries().map((binding) => binding.provider)
    );
    const finalizers = [...providers].flatMap(
      (provider) => provider.invocationEnded ? [Promise.resolve().then(() => provider.invocationEnded(parentToolCallId))] : []
    );
    await settleWithin(finalizers, timeoutMs);
  }
  async close(excludedProviderNames = /* @__PURE__ */ new Set()) {
    await this.#providerBindings.close(excludedProviderNames);
  }
  async #resolveCapabilities(requirements, context, retain) {
    const normalized = /* @__PURE__ */ new Map();
    for (const requirement of requirements) {
      const ref = (typeof requirement === "string" ? requirement : requirement.ref).trim();
      if (!ref || ref.length > 256 || !ref.includes(".")) {
        throw new Error(`Fabric capability requirements must use provider.action: ${ref || "<empty>"}`);
      }
      const optional = typeof requirement === "string" ? false : requirement.optional === true;
      normalized.set(ref, (normalized.get(ref) ?? true) && optional);
    }
    const missing = [];
    const optionalMissing = [];
    const resolved = /* @__PURE__ */ new Map();
    const temporaryReleases = [];
    let permanentRelease;
    try {
      for (const [ref, optional] of [...normalized].sort(
        ([left], [right]) => left.localeCompare(right)
      )) {
        try {
          const { binding, provider, actionName } = this.#parseRef(ref);
          const release = this.#providerBindings.retain([binding.id]);
          temporaryReleases.push(release);
          const descriptor = await runAbortable(
            context.signal,
            () => provider.describe(actionName, context)
          );
          if (!descriptor) throw new FabricResolutionError(`Unknown Fabric action: ${ref}`);
          const action = resolveDescriptor(provider, descriptor);
          resolved.set(ref, {
            ref,
            provider: provider.name,
            providerBindingId: binding.id,
            generation: binding.generation,
            descriptorHash: actionDescriptorHash(action)
          });
        } catch (error) {
          if (!(error instanceof FabricResolutionError)) throw error;
          (optional ? optionalMissing : missing).push(ref);
        }
      }
      let view;
      if (missing.length === 0) {
        const bindings = Object.fromEntries(resolved);
        const values = [...resolved.values()];
        if (retain) permanentRelease = this.#providerBindings.retain(
          values.map((binding) => binding.providerBindingId)
        );
        view = {
          id: randomUUID2(),
          digest: descriptorHash(values),
          semanticDigest: descriptorHash(
            values.map(({ ref, provider, descriptorHash: hash }) => ({
              ref,
              provider,
              descriptorHash: hash
            }))
          ),
          bindings
        };
      }
      return {
        satisfied: missing.length === 0,
        missing,
        optionalMissing,
        ...view ? { view } : {},
        release: async () => {
          const release = permanentRelease;
          permanentRelease = void 0;
          await release?.();
        }
      };
    } finally {
      await Promise.allSettled(temporaryReleases.map((release) => release()));
    }
  }
  async #declaredActionNames(provider, context) {
    try {
      const descriptors = await runAbortable(context.signal, () => provider.list({}, context));
      return descriptors.map((descriptor) => descriptor.name);
    } catch {
      return [];
    }
  }
  // Resolve a provider action descriptor, repairing a near-miss action name
  // (mirroring arg-normalization's prepare-stage argument repair) when the
  // caller is not pinned to a committed capability view. Committed views are
  // exact contracts: a pinned miss keeps the plain resolution error.
  async #resolveActionDescriptor(provider, actionName, context, allowRepair) {
    const descriptor = await runAbortable(
      context.signal,
      () => provider.describe(actionName, context)
    );
    if (descriptor) {
      return {
        action: resolveDescriptor(provider, descriptor),
        suggestions: []
      };
    }
    if (!allowRepair) return { suggestions: [] };
    const declared = await this.#declaredActionNames(provider, context);
    const catalogName = applyActiveActionName(provider.name, actionName, declared);
    if (catalogName !== actionName) {
      const catalogDescriptor = await runAbortable(
        context.signal,
        () => provider.describe(catalogName, context)
      );
      if (catalogDescriptor) {
        return {
          action: resolveDescriptor(provider, catalogDescriptor),
          suggestions: [],
          repairedFrom: actionName
        };
      }
    }
    const repair = repairActionName(declared, actionName);
    const compiler = getActiveRepairCompiler();
    if (repair.repaired !== void 0) {
      compiler?.observeUnknownAction(provider.name, actionName, declared, {
        countError: false
      });
      const repairedDescriptor = await runAbortable(
        context.signal,
        () => provider.describe(repair.repaired, context)
      );
      if (repairedDescriptor) {
        return {
          action: resolveDescriptor(provider, repairedDescriptor),
          suggestions: [],
          repairedFrom: actionName
        };
      }
      compiler?.recordInvocationError();
    } else {
      compiler?.observeUnknownAction(provider.name, actionName, declared);
    }
    return {
      suggestions: repair.suggestions.map((name) => `${provider.name}.${name}`)
    };
  }
  #parseRef(ref, view) {
    const separator = ref.indexOf(".");
    if (separator <= 0 || separator === ref.length - 1) {
      throw new Error(`Fabric action references must use provider.action: ${ref}`);
    }
    const providerName = ref.slice(0, separator);
    const pinned = view?.bindings[ref];
    if (view && !pinned) {
      throw new FabricResolutionError(`Fabric capability is outside the committed view: ${ref}`);
    }
    const binding = pinned ? this.#providerBindings.binding(pinned.providerBindingId) : this.#providerBindings.current(providerName);
    if (!binding || binding.name !== providerName) {
      if (pinned) {
        throw new FabricResolutionError(
          `Fabric capability binding is no longer available: ${ref} (${pinned.providerBindingId})`
        );
      }
      this.#requireProvider(providerName);
      throw new FabricResolutionError(`Unknown Fabric provider: ${providerName}`);
    }
    return {
      binding,
      provider: binding.provider,
      actionName: ref.slice(separator + 1),
      ...pinned ? { expectedDescriptorHash: pinned.descriptorHash } : {}
    };
  }
  #requireProvider(name) {
    const provider = this.#providerBindings.current(name)?.provider;
    if (provider) return provider;
    const unavailableReason = this.#unavailable.get(name);
    if (unavailableReason) {
      throw new FabricResolutionError(
        `Fabric provider "${name}" is unavailable: ${unavailableReason}`
      );
    }
    const registered = this.#providerBindings.providers().map((provider2) => provider2.name).sort((left, right) => left.localeCompare(right));
    throw new FabricResolutionError(
      `Unknown Fabric provider: ${name}` + (registered.length > 0 ? ` (registered providers: ${registered.join(", ")})` : "")
    );
  }
};

export {
  repairActionName,
  setActiveRepairCompiler,
  clearActiveRepairCompiler,
  getActiveRepairCompiler,
  NESTED_TOOL_CALL_ID_PREFIX,
  ActionRegistry
};
//# sourceMappingURL=chunk-6EM5SWVG.js.map
