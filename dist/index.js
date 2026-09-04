import {
  ApprovalController,
  CapturedToolCatalog,
  FABRIC_COMPONENT_PROVIDER_NAMES,
  FABRIC_PROVIDER_COMPONENT_PREFIX,
  FabricActivityStore,
  FabricAutoApprovalClassifier,
  FabricSessionApprovals,
  PREWALK_ARMED_MESSAGE_TYPE,
  PrewalkController,
  PrewalkDriftTracker,
  expandSkillDirMarkersForRead,
  expandSkillDirMarkersInSkillBlock,
  filterPrewalkContinuationMessages,
  formatSkillsForPrompt,
  hasPrewalkArmedPrompt,
  prewalkArmedPrompt,
  repairFabricGuestCode,
  resolveFabricIdentity,
  settleInPlacePrewalk,
  withTrajectoryRearmDirective
} from "./chunks/chunk-YFGTAQC5.js";
import {
  activeStatuses,
  arcItemStyled,
  captureFabricAgentPreviews,
  captureFabricCallHeadlinePreviews,
  captureFabricCoreToolPreviews,
  captureFabricWritePreviews,
  configureHighlighting,
  continueArcGroup,
  coreToolPreviewEnabled,
  coreToolRendererEnabled,
  countNewlines,
  expandHint,
  fabricMulticallCallLimit,
  formatCost,
  formatDuration,
  formatFabricValue,
  formatTokens,
  highlightCode,
  inheritComponentBackground,
  isActiveStatus,
  isCoreToolAudit,
  modelReadHint,
  nestedCallBody,
  nestedCallTitle,
  observePiTheme,
  orderAgentsByCreation,
  renderAgentToolPreviewLines,
  renderBoundedLines,
  renderCoreToolBody,
  renderFabricMulticallPartial,
  renderFabricWriteArgumentPreview,
  restoreFabricAgentPreviews,
  restoreFabricCallHeadlinePreviews,
  restoreFabricCoreToolPreviews,
  restoreFabricWritePreviews,
  restoreLegacyBashCommands,
  safeTerminalText,
  safeText,
  singleCallProgressLine,
  spinnerFrame,
  truncateMiddle,
  updateSpinner
} from "./chunks/chunk-USXAEFZ2.js";
import {
  AgentTranscriptReader
} from "./chunks/chunk-MJNWCLRJ.js";
import {
  GUEST_TYPE_DECLARATIONS,
  PI_CORE_COMPATIBILITY_ARGUMENT_TYPE_NAMES
} from "./chunks/chunk-6EXGGNJ6.js";
import {
  NESTED_TOOL_CALL_ID_PREFIX,
  getActiveRepairCompiler
} from "./chunks/chunk-6EM5SWVG.js";
import "./chunks/chunk-PM3ESBLM.js";
import "./chunks/chunk-JRJ77EGR.js";
import {
  resolveAgentDir
} from "./chunks/chunk-JGPLMHJR.js";
import {
  FABRIC_COMPONENT_DISCOVER_EVENT,
  FABRIC_COMPONENT_REGISTER_EVENT,
  FABRIC_NESTED_TOOL_CALL_ID_PREFIX,
  FABRIC_PEER_AWAIT_SETTLE_EVENT,
  FABRIC_PEER_CARDS_EVENT,
  FABRIC_PREWALK_REQUEST_EVENT,
  FABRIC_PROVIDER_DISCOVER_EVENT,
  FABRIC_PROVIDER_REGISTER_EVENT,
  FABRIC_TOOL_RESULT_PROXY_KIND,
  readFabricPeerAwaitSettleRequestV1,
  readFabricPeerCardsRequestV1,
  readFabricPrewalkRequestV1,
  readFabricToolResultProxyDetailsV1
} from "./chunks/chunk-CTG37A6U.js";
import {
  awaitPeerSettle,
  buildPeerCards
} from "./chunks/chunk-3QCDEK4M.js";
import {
  FABRIC_ACTOR_PI_HOST_EVENTS
} from "./chunks/chunk-QOOWAB5D.js";
import {
  DEFAULT_FABRIC_CONFIG,
  effectiveToolCaptureConfig,
  loadFabricConfig,
  loadFabricConfigForScope,
  saveFabricConfig
} from "./chunks/chunk-LXRYXUTG.js";
import {
  defaultCodePreviewSettings
} from "./chunks/chunk-XCYTQGH2.js";
import {
  PI_CORE_TOOL_NAMES,
  PI_CORE_TOOL_NAME_SET
} from "./chunks/chunk-XHM55LMF.js";
import {
  FABRIC_EXECUTION_GUIDANCE_SLOT,
  MAX_FABRIC_MODEL_GUIDANCE_CONTENT_CHARS,
  MAX_FABRIC_MODEL_GUIDANCE_PER_COMPONENT,
  MAX_FABRIC_MODEL_GUIDANCE_REGISTRATIONS,
  MAX_FABRIC_MODEL_GUIDANCE_SNAPSHOT_CHARS,
  MAX_FABRIC_MODEL_GUIDANCE_TOTAL_CHARS,
  resolveFabricModelGuidance
} from "./chunks/chunk-BH2VUB62.js";
import "./chunks/chunk-2DGB2R4E.js";
import "./chunks/chunk-LU4SNIHE.js";
import {
  compactAtConfiguredThreshold,
  fabricExecTitleHintCached,
  normalizeRunDisplay,
  registerCompactionHook
} from "./chunks/chunk-7B4MWJK4.js";
import {
  fabricWriteBindings
} from "./chunks/chunk-4IZKKHJM.js";
import "./chunks/chunk-Y2TSC4OL.js";
import {
  FABRIC_EXECUTION_TRACE_KIND,
  FABRIC_EXECUTION_TRACE_MAX_BYTES,
  FABRIC_EXECUTION_TRACE_VERSION,
  FabricExecutionTraceOperationHandle,
  FabricExecutionTraceRecorder,
  executionOutcomeFromError,
  isFabricExecutionTraceOperationV1,
  isFabricExecutionTraceV1,
  projectFabricAuditArgs,
  projectFabricAuditResult,
  readFabricExecutionTraceV1
} from "./chunks/chunk-AZOIDGCU.js";

// src/ui/code-preview-shell.ts
import {
  Container,
  Text,
  truncateToWidth,
  visibleWidth
} from "@earendil-works/pi-tui";
var timingState = (context) => context?.state;
var isTimingOnlyRender = (state) => state?.codePreviewTimingOnlyRenderToken !== void 0;
var unwrapTimingComponent = (component) => component instanceof TimingPreservedComponent ? component.component : component;
var clearTimingInterval = (state) => {
  if (!state.codePreviewTimingInterval) return;
  clearInterval(state.codePreviewTimingInterval);
  delete state.codePreviewTimingInterval;
  delete state.codePreviewTimingOnlyRenderToken;
};
var ensureTimingInterval = (state, invalidate) => {
  state.codePreviewTimingInterval ??= setInterval(() => {
    const token = (state.codePreviewTimingOnlyRenderToken ?? 0) + 1;
    state.codePreviewTimingOnlyRenderToken = token;
    try {
      invalidate();
    } finally {
      queueMicrotask(() => {
        if (state.codePreviewTimingOnlyRenderToken === token) {
          delete state.codePreviewTimingOnlyRenderToken;
        }
      });
    }
  }, 100);
};
var formatDuration2 = (milliseconds) => {
  const ms = Math.max(0, Math.round(milliseconds));
  if (ms < 1e3) return `${ms}ms`;
  if (ms < 6e4) return `${(ms / 1e3).toFixed(1)}s`;
  const seconds = Math.round(ms / 1e3);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds % 60}s`;
};
var updateTiming = (context, enabled, options = {}) => {
  const state = timingState(context);
  if (!state) return void 0;
  if (!enabled) {
    clearTimingInterval(state);
    return void 0;
  }
  if (context.executionStarted && state.codePreviewTimingStartedAt === void 0 && context.isPartial !== false) {
    state.codePreviewTimingStartedAt = Date.now();
    delete state.codePreviewTimingEndedAt;
  }
  const startedAt = state.codePreviewTimingStartedAt;
  if (startedAt === void 0) return void 0;
  if (context.isPartial && options.animate !== false) {
    ensureTimingInterval(state, context.invalidate);
  } else if (!context.isPartial) {
    state.codePreviewTimingEndedAt ??= Date.now();
    clearTimingInterval(state);
  }
  if (options.formatLabel === false) return void 0;
  const running = context.isPartial;
  const endedAt = running ? Date.now() : state.codePreviewTimingEndedAt ?? Date.now();
  return `${running ? "Elapsed" : "Took"} ${formatDuration2(endedAt - startedAt)}`;
};
var TimingPreservedComponent = class {
  constructor(component, state) {
    this.component = component;
    this.state = state;
  }
  render(width) {
    return this.component.render(width);
  }
  invalidate() {
    if (!isTimingOnlyRender(this.state)) this.component.invalidate?.();
  }
};
var TimingFooter = class {
  constructor(component, footer, state) {
    this.component = component;
    this.footer = footer;
    this.state = state;
  }
  render(width) {
    return [
      ...continueArcGroup(this.component.render(width)),
      truncateToWidth(this.footer, width, "")
    ];
  }
  invalidate() {
    if (!isTimingOnlyRender(this.state)) this.component.invalidate?.();
  }
};
var renderTimedResult = (context, theme, render, label) => {
  const state = timingState(context);
  if (!state) return render(context);
  const reused = isTimingOnlyRender(state) ? state.codePreviewTimingResultComponent : void 0;
  const component = reused ?? render({
    ...context,
    lastComponent: unwrapTimingComponent(
      state.codePreviewTimingResultComponent ?? context.lastComponent
    )
  });
  state.codePreviewTimingResultComponent = component;
  return label ? new TimingFooter(component, theme.fg("muted", `\u2570\u2500 ${label}`), state) : component;
};
var borderState = (context) => context.state;
var borderColor = (context) => {
  if (context.isError) return "error";
  return context.isPartial ? "warning" : "success";
};
var BorderedToolCall = class {
  constructor(theme, state) {
    this.theme = theme;
    this.state = state;
  }
  callComponent;
  resultComponent;
  color = "borderMuted";
  timingLabel;
  cachedWidth;
  cachedRows;
  setCall(component) {
    this.callComponent = component;
    this.invalidateCache();
  }
  setResult(component) {
    this.resultComponent = component;
    this.invalidateCache();
  }
  setColor(color) {
    if (color === this.color) return;
    this.color = color;
    this.invalidateCache();
  }
  setTimingLabel(label) {
    if (label === this.timingLabel) return;
    this.timingLabel = label;
    this.invalidateCache();
  }
  render(width) {
    if (width === this.cachedWidth && this.cachedRows) return this.cachedRows;
    const rows = this.renderUncached(width);
    this.cachedWidth = width;
    this.cachedRows = rows;
    return rows;
  }
  invalidate() {
    this.invalidateCache();
    if (isTimingOnlyRender(this.state)) return;
    this.callComponent?.invalidate?.();
    this.resultComponent?.invalidate?.();
  }
  invalidateCache() {
    this.cachedWidth = void 0;
    this.cachedRows = void 0;
  }
  renderUncached(width) {
    const body = [
      ...this.callComponent?.render(Math.max(1, width - 4)) ?? [],
      ...this.resultComponent?.render(Math.max(1, width - 4)) ?? []
    ];
    if (width < 4) return body;
    const innerWidth = width - 4;
    const border = (value) => this.theme.fg(this.color, value);
    const label = this.timingLabel ? ` ${this.theme.fg("muted", this.timingLabel)} ` : "";
    const labelWidth = visibleWidth(label);
    const top = labelWidth > 0 && labelWidth <= width - 2 ? `${border("\u256D")}${border("\u2500".repeat(width - 2 - labelWidth))}${label}${border("\u256E")}` : border(`\u256D${"\u2500".repeat(width - 2)}\u256E`);
    return [
      top,
      ...body.map((line) => this.frameLine(line, innerWidth, border)),
      border(`\u2570${"\u2500".repeat(width - 2)}\u256F`)
    ];
  }
  frameLine(line, innerWidth, border) {
    const text = truncateToWidth(line, innerWidth, "");
    const padding = " ".repeat(Math.max(0, innerWidth - visibleWidth(text)));
    const hasDiffBackground = /^\x1b\[48;2;\d+;\d+;\d+m/.test(text);
    return hasDiffBackground ? `${border("\u2502")} ${text}${padding} \x1B[49m${border("\u2502")}\x1B[0m` : `${border("\u2502")} ${text}\x1B[0m${padding} ${border("\u2502")}`;
  }
};
var shouldRenderResultSeparately = (state, isPartial) => state.codePreviewBorderLastCallPartial === void 0 || state.codePreviewBorderLastCallPartial !== isPartial && state.codePreviewBorderLastCallExecutionStarted === true;
var withCodePreviewShell = (tool, options = {}) => {
  const mode = options.mode ?? "on";
  const timingEnabled = options.toolCallTiming ?? true;
  if ((options.preserveSelfShell ?? true) && tool.renderShell === "self") return tool;
  const originalRenderCall = tool.renderCall;
  const originalRenderResult = tool.renderResult;
  const renderCall = (args, theme, context) => originalRenderCall ? originalRenderCall.call(tool, args, theme, context) : new Text(theme.fg("toolTitle", theme.bold(tool.label || tool.name)), 0, 0);
  const renderResult = (result, resultOptions, theme, context) => originalRenderResult ? originalRenderResult.call(tool, result, resultOptions, theme, context) : new Container();
  return {
    ...tool,
    renderShell: mode === "on" ? "default" : "self",
    renderCall(args, theme, rawContext) {
      if (!rawContext) {
        return originalRenderCall ? originalRenderCall.call(tool, args, theme, rawContext) : new Text(theme.fg("toolTitle", theme.bold(tool.label || tool.name)), 0, 0);
      }
      const context = rawContext;
      if (mode !== "border") {
        const state2 = timingState(context);
        if (context.isPartial && isTimingOnlyRender(state2) && state2?.codePreviewTimingCallComponent) {
          updateTiming(context, timingEnabled, { animate: false, formatLabel: false });
          return state2.codePreviewTimingCallComponent;
        }
        const component2 = renderCall(args, theme, {
          ...context,
          lastComponent: unwrapTimingComponent(context.lastComponent)
        });
        const wrapped = state2 ? new TimingPreservedComponent(component2, state2) : component2;
        if (state2) state2.codePreviewTimingCallComponent = wrapped;
        updateTiming(context, timingEnabled, { animate: false, formatLabel: false });
        return wrapped;
      }
      const state = borderState(context);
      const timingOnly = context.isPartial && isTimingOnlyRender(state);
      const component = timingOnly && state.codePreviewBorderCallComponent ? state.codePreviewBorderCallComponent : renderCall(args, theme, {
        ...context,
        lastComponent: state.codePreviewBorderCallComponent
      });
      const label = updateTiming(context, timingEnabled);
      state.codePreviewBorderCallComponent = component;
      state.codePreviewBorderLastCallExecutionStarted = context.executionStarted;
      state.codePreviewBorderLastCallPartial = context.isPartial;
      const shell = state.codePreviewBorderShell instanceof BorderedToolCall && state.codePreviewBorderTheme === theme ? state.codePreviewBorderShell : new BorderedToolCall(theme, state);
      shell.setCall(component);
      shell.setResult(state.codePreviewBorderResultComponent);
      shell.setColor(borderColor(context));
      shell.setTimingLabel(label);
      state.codePreviewBorderShell = shell;
      state.codePreviewBorderTheme = theme;
      return shell;
    },
    renderResult(result, resultOptions, theme, rawContext) {
      const context = rawContext;
      const optionsRecord = resultOptions;
      const label = updateTiming(context, timingEnabled);
      if (mode !== "border") {
        return renderTimedResult(
          context,
          theme,
          (next) => renderResult(result, resultOptions, theme, next),
          label
        );
      }
      const state = borderState(context);
      const timingOnly = context.isPartial && isTimingOnlyRender(state);
      const component = timingOnly && state.codePreviewBorderResultComponent ? state.codePreviewBorderResultComponent : renderResult(result, resultOptions, theme, {
        ...context,
        lastComponent: state.codePreviewBorderResultComponent
      });
      state.codePreviewBorderResultComponent = component;
      const shell = state.codePreviewBorderShell instanceof BorderedToolCall && state.codePreviewBorderTheme === theme ? state.codePreviewBorderShell : new BorderedToolCall(theme, state);
      shell.setCall(state.codePreviewBorderCallComponent);
      shell.setResult(component);
      shell.setColor(borderColor(context));
      shell.setTimingLabel(label);
      state.codePreviewBorderShell = shell;
      state.codePreviewBorderTheme = theme;
      return shouldRenderResultSeparately(state, optionsRecord.isPartial) ? component : new Container();
    }
  };
};

// src/actors/host-event-observer.ts
var registerFabricActorHostEventObservers = (pi, observer) => {
  const observable = pi;
  for (const eventName of FABRIC_ACTOR_PI_HOST_EVENTS) {
    observable.on(eventName, (event, context) => observer(eventName, event, context));
  }
};

// src/capture/interceptor.ts
import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
var HUB_SYMBOL = Symbol.for("pi-fabric.registered-tool-capture.v1");
var ANCHOR_SYMBOL = Symbol.for("pi-fabric.registered-tool-anchor.v1");
var definitionDelegatesTo = (definition, target) => {
  let current = definition;
  while (current) {
    if (current === target) return true;
    current = Object.getPrototypeOf(current);
  }
  return false;
};
var clonePolicy = (config) => ({
  enabled: config.enabled,
  hideFromModel: config.hideFromModel,
  keepVisible: [...config.keepVisible],
  defaultRisk: config.defaultRisk,
  risks: { ...config.risks }
});
var isExtensionRunnerConstructor = (value) => typeof value === "function" && typeof value.prototype === "object" && typeof value.prototype.getAllRegisteredTools === "function";
var bundleExtensionRunnerConstructors = async (bundleDir) => {
  const chunksDir = path.join(bundleDir, "chunks");
  if (!existsSync(chunksDir)) return [];
  let files;
  try {
    files = readdirSync(chunksDir);
  } catch {
    return [];
  }
  const constructors = /* @__PURE__ */ new Set();
  for (const file of files) {
    if (!file.endsWith(".js")) continue;
    try {
      const module = await import(pathToFileURL(path.join(chunksDir, file)).href);
      for (const exported of Object.values(module)) {
        if (isExtensionRunnerConstructor(exported)) constructors.add(exported);
      }
    } catch {
    }
  }
  return [...constructors];
};
var captureHub = (Runner) => {
  const prototype = Runner.prototype;
  const existing = prototype[HUB_SYMBOL];
  if (existing) return existing;
  const original = prototype.getAllRegisteredTools;
  if (typeof original !== "function") {
    throw new Error("Pi Fabric could not intercept ExtensionRunner.getAllRegisteredTools");
  }
  const hub = { listeners: /* @__PURE__ */ new Set() };
  Object.defineProperty(prototype, HUB_SYMBOL, {
    value: hub,
    configurable: false,
    enumerable: false,
    writable: false
  });
  prototype.getAllRegisteredTools = function getFabricVisibleTools() {
    let tools = original.call(this);
    for (const listener of [...hub.listeners]) tools = listener(tools, this);
    return tools;
  };
  return hub;
};
var hostPackageRoot = () => {
  const cliPath = process.argv[1];
  if (!cliPath) return void 0;
  let directory;
  try {
    directory = path.dirname(realpathSync(cliPath));
  } catch {
    return void 0;
  }
  while (directory !== path.dirname(directory)) {
    const manifestPath = path.join(directory, "package.json");
    if (existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
        if (manifest.name === "@earendil-works/pi-coding-agent") return directory;
      } catch {
      }
    }
    directory = path.dirname(directory);
  }
  return void 0;
};
var extensionRunnerConstructors = async () => {
  const constructors = /* @__PURE__ */ new Set();
  const packageRoots = new Set(
    [process.env.PI_PACKAGE_DIR, hostPackageRoot()].filter(
      (root) => typeof root === "string" && Boolean(root)
    )
  );
  for (const packageRoot of packageRoots) {
    try {
      const hostEntry = path.join(packageRoot, "dist", "index.js");
      const hostModule = await import(pathToFileURL(hostEntry).href);
      if (hostModule.ExtensionRunner) constructors.add(hostModule.ExtensionRunner);
    } catch {
    }
    for (const Runner of await bundleExtensionRunnerConstructors(
      path.join(packageRoot, "dist", "bundle")
    )) {
      constructors.add(Runner);
    }
  }
  if (constructors.size === 0) {
    try {
      const hostModule = await import("@earendil-works/pi-coding-agent");
      if (hostModule.ExtensionRunner) constructors.add(hostModule.ExtensionRunner);
    } catch {
    }
  }
  return [...constructors];
};
var installRegisteredToolCapture = async (options) => {
  const hubs = (await extensionRunnerConstructors()).map(captureHub);
  const anchorToken = {};
  Object.defineProperty(options.anchorDefinition, ANCHOR_SYMBOL, {
    value: anchorToken,
    configurable: false,
    enumerable: true,
    writable: false
  });
  let policy = clonePolicy(options.initialPolicy ?? DEFAULT_FABRIC_CONFIG.capture);
  let disposed = false;
  const listener = (tools, runner) => {
    if (disposed) return tools;
    const anchor = tools.find(
      (tool) => tool.definition[ANCHOR_SYMBOL] === anchorToken || definitionDelegatesTo(tool.definition, options.anchorDefinition)
    );
    if (!anchor) return tools;
    options.catalog.replace(tools, runner, policy, anchor.sourceInfo.path);
    options.onCatalogRefresh?.();
    return tools;
  };
  for (const hub of hubs) hub.listeners.add(listener);
  return {
    setPolicy(config) {
      policy = clonePolicy(config);
      if (!policy.enabled) options.catalog.clear();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const hub of hubs) hub.listeners.delete(listener);
      options.catalog.clear();
    }
  };
};

// src/commands/fabric.ts
import "@earendil-works/pi-coding-agent";

// src/prewalk/arm.ts
var armFabricPrewalkSession = async (state, context, pi, input) => {
  const { prewalk } = state.config;
  const sessionId = context.sessionManager.getSessionId();
  state.prewalk.arm({
    model: input.model,
    mode: prewalk.mode,
    sessionId,
    ...input.task ? { task: input.task } : {},
    ...prewalk.thinking ? { thinking: prewalk.thinking } : {},
    alwaysRearm: prewalk.alwaysRearm
  });
  if (prewalk.detectShellWrites) {
    await state.prewalkDrift.captureBaseline(sessionId, context.cwd);
  }
  const armedPrompt = prewalkArmedPrompt(prewalk.mode, input.model);
  if (!hasPrewalkArmedPrompt(context.sessionManager.getBranch(), armedPrompt)) {
    pi.sendMessage(
      {
        customType: PREWALK_ARMED_MESSAGE_TYPE,
        content: armedPrompt,
        display: false,
        details: { mode: prewalk.mode, model: input.model }
      },
      { deliverAs: "nextTurn" }
    );
  }
  context.ui.setStatus("fabric-prewalk", `armed (${prewalk.mode}) \u2192 ${input.model}`);
};
var autoArmFabricPrewalk = async (state, context, pi) => {
  const { prewalk } = state.config;
  if (prewalk.enabled === false || !prewalk.alwaysRearm) return void 0;
  if (state.prewalk.status().state !== "idle") return void 0;
  if (!state.config.fullCodeMode || state.config.schema.mode === "enforce") {
    return "Fabric prewalk auto-arm skipped: requires full code mode with Schema enforce mode disabled.";
  }
  if (prewalk.mode === "trajectory" && !state.config.agents.enabled) {
    return "Fabric prewalk auto-arm skipped: trajectory mode requires agents.enabled.";
  }
  const model = prewalk.model?.trim();
  if (!model || !model.includes("/")) {
    return "Fabric prewalk auto-arm skipped: set prewalk.model (provider/model) in /fabric settings so sessions arm without the interactive picker.";
  }
  await armFabricPrewalkSession(state, context, pi, { model });
  return void 0;
};

// src/commands/fabric.ts
import fs from "node:fs";
import path2 from "node:path";
var extractContentText = (content) => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((part) => {
      if (typeof part !== "object" || part === null) return "";
      const p = part;
      return typeof p.text === "string" ? p.text : typeof p.type === "string" ? p.type : "";
    }).filter(Boolean).join(" ");
  }
  return "";
};
var summarizeLogLine = (entry) => {
  if (typeof entry !== "object" || entry === null) return truncateMiddle(String(entry), 200);
  const record = entry;
  const type = typeof record.type === "string" ? record.type : void 0;
  const tool = typeof record.toolName === "string" ? record.toolName : void 0;
  const msg = record.message;
  if (typeof msg === "object" && msg !== null && !Array.isArray(msg)) {
    const m = msg;
    const role = typeof m.role === "string" ? m.role : "message";
    const model = typeof m.model === "string" ? m.model : void 0;
    const text = extractContentText(m.content);
    const body = (text || JSON.stringify(m)).replace(/\s+/g, " ");
    return `${role}${model ? ` [${model}]` : ""}: ${truncateMiddle(body, 160)}`;
  }
  if (type) {
    const bits = [type];
    if (tool) bits.push(tool);
    const model = typeof record.modelId === "string" ? record.modelId : void 0;
    const provider = typeof record.provider === "string" && !model ? record.provider : void 0;
    if (provider) bits.push(provider);
    if (model) bits.push(model);
    return bits.join(" ");
  }
  return truncateMiddle(JSON.stringify(record), 160);
};
var resolvePrewalkModel = async (state, context) => {
  const configured = state.config.prewalk.model?.trim();
  if (configured) {
    if (configured.includes("/")) return configured;
    context.ui.notify(
      "prewalk.model must use provider/model form.",
      "error"
    );
    return void 0;
  }
  let models = [];
  try {
    models = context.modelRegistry.getAvailable();
  } catch {
    models = [];
  }
  const keys = models.map((model) => `${model.provider}/${model.id}`).sort((left, right) => left.localeCompare(right));
  if (keys.length === 0) {
    context.ui.notify(
      "Prewalk needs an explicit Pi executor model. Configure prewalk.model in /fabric settings.",
      "error"
    );
    return void 0;
  }
  if (!context.hasUI) {
    context.ui.notify(
      "Prewalk needs prewalk.model in non-interactive mode.",
      "error"
    );
    return void 0;
  }
  return context.ui.select("Prewalk executor model", keys);
};
var armPrewalk = async (state, context, pi, task = "") => {
  if (state.config.prewalk.enabled === false) {
    const error = "Fabric prewalk is disabled; re-enable with /fabric prewalk --enable or /fabric settings.";
    context.ui.notify(error, "error");
    return { ok: false, error };
  }
  if (!state.config.fullCodeMode || state.config.schema.mode === "enforce") {
    const error = "Fabric prewalk requires full code mode and Schema enforce mode disabled.";
    context.ui.notify(error, "error");
    return { ok: false, error };
  }
  if (state.config.prewalk.mode === "trajectory" && !state.config.agents.enabled) {
    const error = "Trajectory prewalk requires enabled agents. Choose in-place mode or enable agents.";
    context.ui.notify(error, "error");
    return { ok: false, error };
  }
  const model = await resolvePrewalkModel(state, context);
  if (!model) return { ok: false, error: "Fabric prewalk was not armed." };
  await armFabricPrewalkSession(state, context, pi, {
    model,
    ...task ? { task } : {}
  });
  const modeLabel = state.config.prewalk.mode === "in-place" ? "Main will continue in place" : "the trajectory will move to a visible child executor";
  context.ui.notify(
    task ? `Fabric prewalk armed for the next matching Fabric boundary; ${modeLabel} with ${model}${state.config.prewalk.alwaysRearm ? "; always re-arm enabled" : ""}` : `Fabric prewalk armed for the next task; ${modeLabel} with ${model}${state.config.prewalk.alwaysRearm ? "; always re-arm enabled" : ""}`,
    "info"
  );
  if (task) pi.sendUserMessage(task);
  return { ok: true };
};
function registerFabricCommand(pi, deps) {
  const { state, fabricUi, capturedTools, applyFabricMode, suspendToolCapture } = deps;
  const unsubscribePrewalkRequests = pi.events?.on?.(FABRIC_PREWALK_REQUEST_EVENT, (value) => {
    const request = readFabricPrewalkRequestV1(value);
    if (!request || !request.claim()) return;
    void (async () => {
      try {
        await state.ensure(request.context);
        request.respond(await armPrewalk(state, request.context, pi));
      } catch (error) {
        request.respond({
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    })();
  });
  if (unsubscribePrewalkRequests) {
    pi.on("session_shutdown", () => unsubscribePrewalkRequests());
  }
  const unsubscribePeerCards = pi.events?.on?.(FABRIC_PEER_CARDS_EVENT, (value) => {
    const request = readFabricPeerCardsRequestV1(value);
    if (!request || !request.claim()) return;
    void (async () => {
      try {
        await state.ensure(request.context);
        request.respond({ ok: true, cards: buildPeerCards(state.peerInfos()) });
      } catch (error) {
        request.respond({
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    })();
  });
  const unsubscribePeerAwait = pi.events?.on?.(FABRIC_PEER_AWAIT_SETTLE_EVENT, (value) => {
    const request = readFabricPeerAwaitSettleRequestV1(value);
    if (!request || !request.claim()) return;
    void (async () => {
      try {
        await state.ensure(request.context);
        if (!state.config.mesh.enabled) {
          request.respond({ ok: false, error: "Fabric mesh is disabled; peers cannot be observed" });
          return;
        }
        request.respond(await awaitPeerSettle({
          poll: () => state.peerInfos(),
          ...request.selector !== void 0 ? { selector: request.selector } : {},
          ...request.settledForMs !== void 0 ? { settledForMs: request.settledForMs } : {},
          ...request.signal ? { signal: request.signal } : {},
          ...request.update ? { onUpdate: request.update } : {}
        }));
      } catch (error) {
        request.respond({
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    })();
  });
  if (unsubscribePeerCards || unsubscribePeerAwait) {
    pi.on("session_shutdown", () => {
      unsubscribePeerCards?.();
      unsubscribePeerAwait?.();
    });
  }
  const formatRepairStatus = (status) => {
    const top = status.fingerprints.slice(0, 8).map((entry) => `  ${entry.count}\xD7 ${entry.fingerprint}`).join("\n");
    const rows = status.repairs.slice(0, 12).map(
      (repair) => repair.kind === "keyAlias" ? `  ${repair.ref}: ${repair.from} \u2192 ${repair.to}` : `  ${repair.provider}.${repair.from} \u2192 ${repair.to}`
    ).join("\n");
    return [
      `repairs: ${status.enabled ? "on" : "off"} \xB7 digest ${status.catalogDigest.slice(0, 12) || "none"}`,
      `table: ${status.repairCount} \xB7 apply hits ${status.applyHits} \xB7 invocation ${status.invocationErrors} \xB7 effect dropped ${status.effectDropped}`,
      status.repairs.length > 0 ? `current:
${rows}` : "current: (empty)",
      ...status.storeError ? [`store: ${status.storeError}`] : [],
      top ? `fingerprints:
${top}` : "fingerprints: (none this session)"
    ].join("\n");
  };
  pi.registerCommand("fabric", {
    description: "Open Fabric, arm prewalk, reload, or manage agents and actors",
    getArgumentCompletions: (argumentPrefix) => {
      const subcommands = [
        "status",
        "dashboard",
        "settings",
        "schema",
        "prewalk",
        "reload",
        "providers",
        "agents",
        "actors",
        "messages",
        "clear-messages",
        "events",
        "log",
        "export-log",
        "attach",
        "stop",
        "remove",
        "global",
        "import",
        "export",
        "kill",
        "repairs"
      ];
      const idCommands = /* @__PURE__ */ new Set([
        "messages",
        "clear-messages",
        "events",
        "log",
        "export-log",
        "attach",
        "stop",
        "remove",
        "kill"
      ]);
      const firstSpace = argumentPrefix.indexOf(" ");
      if (firstSpace < 0) {
        const matches = subcommands.filter((name) => name.startsWith(argumentPrefix));
        return matches.length > 0 ? matches.map((name) => ({ value: name, label: name })) : null;
      }
      const subcommand = argumentPrefix.slice(0, firstSpace);
      const idPrefix = argumentPrefix.slice(firstSpace + 1);
      if (!state.initialized) return null;
      if (subcommand === "schema") {
        const modes = ["off", "audit", "enforce"].filter((mode) => mode.startsWith(idPrefix));
        return modes.length > 0 ? modes.map((value) => ({ value, label: value })) : null;
      }
      if (subcommand === "import") {
        const items2 = [];
        try {
          for (const template of state.globalActors.list()) {
            items2.push({
              value: template.name,
              label: template.name,
              description: `global ${template.runner} template \xB7 ${template.id.slice(0, 8)}`
            });
          }
        } catch {
        }
        const filtered2 = items2.filter((item) => item.value.startsWith(idPrefix));
        return filtered2.length > 0 ? filtered2 : null;
      }
      if (!idCommands.has(subcommand)) {
        if (subcommand === "export") {
          const items2 = [];
          try {
            for (const actor of state.actors.list()) {
              items2.push({
                value: actor.name,
                label: actor.name,
                description: `${actor.status} ${actor.runner} actor \xB7 ${actor.id.slice(0, 8)}`
              });
            }
          } catch {
          }
          const filtered2 = items2.filter((item) => item.value.startsWith(idPrefix));
          return filtered2.length > 0 ? filtered2 : null;
        }
        return null;
      }
      const items = [];
      try {
        for (const actor of state.actors.list()) {
          items.push({
            value: actor.name,
            label: actor.name,
            description: `${actor.status} ${actor.runner} actor \xB7 ${actor.id.slice(0, 8)}`
          });
        }
      } catch {
      }
      try {
        for (const agent of state.agents.list()) {
          const short = agent.id.slice(0, 8);
          items.push({
            value: short,
            label: short,
            description: `${agent.status} ${agent.runner} agent \xB7 ${agent.name}`
          });
        }
      } catch {
      }
      const filtered = items.filter((item) => item.value.startsWith(idPrefix));
      return filtered.length > 0 ? filtered : null;
    },
    async handler(argumentsText, context) {
      await state.ensure(context);
      const [command = "dashboard", ...argumentsList] = argumentsText.trim().split(/\s+/).filter(Boolean);
      if (command === "reload") {
        fabricUi.stop();
        suspendToolCapture();
        try {
          await state.initialize(context);
        } catch (error) {
          fabricUi.stop();
          suspendToolCapture();
          throw error;
        }
        context.ui.notify("Pi Fabric reloaded", "info");
        deps.refreshToolDisplay?.();
        return;
      }
      if (command === "settings") {
        const { openFabricSettings } = await import("./chunks/settings-ED3FNKWZ.js");
        await openFabricSettings(context, {
          state,
          applyFabricMode,
          capturedTools,
          // Only card-affecting preferences pay for a transcript refresh:
          // refreshToolDisplay re-renders every fabric_exec card, so gating it
          // on the display sections keeps unrelated saves off the transcript.
          onConfigApplied: (id) => {
            if (id.startsWith("codePreview.")) {
              deps.refreshCodePreviewSettings?.();
              deps.refreshToolDisplay?.();
            } else if (id === "ui.toolDisplay" || id === "ui.showAgentToolPreview") {
              deps.refreshToolDisplay?.();
            }
          }
        });
        return;
      }
      if (command === "schema") {
        const requested = argumentsList[0];
        if (requested === void 0) {
          const status = state.schemaStatus(context);
          context.ui.notify(
            `Schema mode: ${status.mode} (${status.source}) \xB7 executor: ${status.executorRuntime} \xB7 /fabric schema [off|audit|enforce] overrides this session only`,
            "info"
          );
          return;
        }
        if (requested !== "off" && requested !== "audit" && requested !== "enforce") {
          context.ui.notify("Usage: /fabric schema [off|audit|enforce]", "warning");
          return;
        }
        try {
          state.setSchemaMode(context, requested);
        } catch (error) {
          context.ui.notify(
            error instanceof Error ? error.message : String(error),
            "error"
          );
          return;
        }
        context.ui.notify(
          `Schema mode set to ${requested} for this session (config file unchanged; the next session starts from the configured mode)`,
          "info"
        );
        return;
      }
      if (command === "prewalk") {
        const option = argumentsList[0];
        if (option === "--disable" || option === "--enable") {
          const enabled = option === "--enable";
          try {
            const projectTrusted = context.isProjectTrusted();
            const saved = saveFabricConfig(
              {
                cwd: context.cwd,
                agentDir: resolveAgentDir(),
                projectTrusted,
                scope: projectTrusted ? "project" : "global"
              },
              { prewalk: { enabled } }
            );
            state.reloadConfig(context);
            if (!enabled) {
              state.prewalk.cancel();
              state.prewalkDrift.drop(context.sessionManager.getSessionId());
              context.ui.setStatus("fabric-prewalk", void 0);
            }
            context.ui.notify(
              `Fabric prewalk ${enabled ? "enabled" : "disabled"} (${saved.scope}: ${saved.path})`,
              "info"
            );
          } catch (error) {
            context.ui.notify(
              `Failed to update Fabric prewalk setting: ${error instanceof Error ? error.message : String(error)}`,
              "error"
            );
          }
          return;
        }
        if (option === "--off" || option === "--cancel") {
          state.prewalk.cancel();
          state.prewalkDrift.drop(context.sessionManager.getSessionId());
          context.ui.setStatus("fabric-prewalk", void 0);
          context.ui.notify("Fabric prewalk cancelled", "info");
          return;
        }
        if (option === "--status") {
          const status = state.prewalk.status();
          context.ui.notify(
            status.state === "idle" ? "Fabric prewalk is idle" : `Fabric prewalk ${status.state} (${status.mode}) \u2192 ${status.model}${status.task ? `
Task: ${status.task}` : ""}`,
            "info"
          );
          return;
        }
        const task = argumentsText.trim().slice(command.length).trim();
        await armPrewalk(state, context, pi, task);
        return;
      }
      if (command === "dashboard" || command === "ui") {
        await fabricUi.openDashboard(context);
        return;
      }
      if (command === "providers") {
        const providers = state.registry.providers();
        context.ui.notify(
          providers.map((provider) => `${provider.name} \u2014 ${provider.description}`).join("\n"),
          "info"
        );
        return;
      }
      if (command === "captured") {
        const query = argumentsList.join(" ").toLowerCase();
        const tools = capturedTools.list().filter(
          (tool) => !query || `${tool.name} ${tool.definition.description} ${tool.sourceInfo.path}`.toLowerCase().includes(query)
        );
        const shown = tools.slice(0, 100);
        context.ui.notify(
          shown.length > 0 ? [
            ...shown.map((tool) => `${tool.name} [${tool.risk}] \u2014 ${tool.sourceInfo.path}`),
            ...tools.length > shown.length ? [`\u2026 ${tools.length - shown.length} more captured tools`] : []
          ].join("\n") : query ? `No captured extension tools matching ${JSON.stringify(query)}` : "No extension tools captured",
          "info"
        );
        return;
      }
      if (command === "agents") {
        const agents = state.agents.list();
        context.ui.notify(
          agents.length > 0 ? agents.map(
            (agent) => `${agent.id.slice(0, 8)} ${agent.status} ${agent.runner}/${agent.transport} \u2014 ${agent.name}`
          ).join("\n") : "No Fabric agents",
          "info"
        );
        return;
      }
      if (command === "actors") {
        const actors = state.actors.list();
        context.ui.notify(
          actors.length > 0 ? actors.map(
            (actor) => `${actor.id.slice(0, 8)} ${actor.status} ${actor.runner} q:${actor.queued} \u2014 ${actor.name}`
          ).join("\n") : "No Fabric actors",
          "info"
        );
        return;
      }
      if (command === "messages") {
        const id = argumentsList[0];
        if (!id) {
          context.ui.notify("Usage: /fabric messages <actor-id>", "warning");
          return;
        }
        try {
          const actor = state.actors.status(id);
          const messages = state.actors.messages(actor.id, 20);
          const shortId = actor.id.slice(0, 8);
          const body = messages.length > 0 ? messages.map((message) => {
            const value = message.text ?? message.error ?? message.action ?? "data";
            const summary = truncateMiddle(value.replace(/\s+/g, " "), 500);
            const runTag = message.runId ? ` [${message.runId.slice(0, 8)}]` : "";
            const usageTag = message.usage ? ` \xB7 ${message.usage.input + message.usage.output} tok` : "";
            return `${message.direction === "in" ? "\u2192" : "\u2190"} ${message.source}${runTag}: ${summary}${usageTag}`;
          }).join("\n") : `No messages for ${actor.name}`;
          const footer = `
Inspect LLM I/O: /fabric log ${shortId} \xB7 Export: /fabric export-log ${actor.name}`;
          context.ui.notify(`${body}${footer}`, "info");
        } catch (error) {
          context.ui.notify(error instanceof Error ? error.message : String(error), "error");
        }
        return;
      }
      if (command === "log") {
        const id = argumentsList[0];
        if (!id) {
          context.ui.notify(
            "Usage: /fabric log <id> [session|run|all] [--lines N] [--run <runId>]",
            "warning"
          );
          return;
        }
        let type = "session";
        let lines = 40;
        let runId;
        for (let i = 1; i < argumentsList.length; i++) {
          const arg = argumentsList[i];
          if (arg === "session" || arg === "run" || arg === "all") type = arg;
          else if ((arg === "--lines" || arg === "-n") && i + 1 < argumentsList.length) {
            const n = Number(argumentsList[++i]);
            if (n > 0) lines = Math.min(n, 5e3);
          } else if (arg === "--run" && i + 1 < argumentsList.length) {
            runId = argumentsList[++i];
          }
        }
        try {
          const actor = state.actors.status(id);
          const log = state.actors.readLog(actor.id, { type, lines, ...runId ? { runId } : {} });
          const parts = [`Actor ${actor.name} \xB7 ${log.sessionFile}`];
          if (log.session.length > 0) {
            parts.push(`\u2500\u2500 session (last ${log.session.length} lines) \u2500\u2500`);
            for (const line of log.session) parts.push(summarizeLogLine(line.parsed ?? line.raw));
          }
          if (log.run) {
            parts.push(
              `\u2500\u2500 run ${log.run.runId.slice(0, 8)} (${log.run.status?.status ?? "?"}) \u2500\u2500`
            );
            for (const line of log.run.events) parts.push(summarizeLogLine(line.parsed ?? line.raw));
          }
          if (log.retainedRuns.length > 0) {
            parts.push(
              `retained runs: ${log.retainedRuns.map((r) => r.slice(0, 8)).join(" ")}`
            );
          }
          context.ui.notify(
            parts.length > 1 ? truncateMiddle(parts.join("\n"), 8e3) : `No log found for ${actor.name}`,
            "info"
          );
        } catch (error) {
          context.ui.notify(error instanceof Error ? error.message : String(error), "error");
        }
        return;
      }
      if (command === "export-log") {
        const id = argumentsList[0];
        const destArg = argumentsList.slice(1).join(" ");
        if (!id) {
          context.ui.notify("Usage: /fabric export-log <id> [path]", "warning");
          return;
        }
        try {
          const dest = path2.resolve(
            destArg || path2.join("fabric-logs", `export-${Date.now()}`)
          );
          fs.mkdirSync(dest, { recursive: true });
          const actor = state.actors.list().find((candidate) => candidate.id.startsWith(id) || candidate.name === id);
          let label;
          let copied = [];
          if (actor) {
            const full = state.actors.status(actor.id);
            label = actor.name;
            if (full.sessionFile && fs.existsSync(full.sessionFile)) {
              fs.copyFileSync(full.sessionFile, path2.join(dest, "session.jsonl"));
              copied.push("session.jsonl");
            }
            if (full.logDir && fs.existsSync(full.logDir)) {
              fs.cpSync(full.logDir, path2.join(dest, "runs"), { recursive: true });
              copied.push("runs/");
            }
          } else {
            const runDir = state.agents.runDirectory(id);
            const status = state.agents.status(id);
            label = status.name;
            if (runDir && fs.existsSync(runDir)) {
              fs.cpSync(runDir, dest, { recursive: true });
              copied.push("run/");
            }
          }
          if (copied.length === 0) {
            context.ui.notify(`No log files found for ${label}`, "warning");
            return;
          }
          context.ui.notify(`Exported ${label} log \u2192 ${dest} (${copied.join(", ")})`, "info");
        } catch (error) {
          context.ui.notify(error instanceof Error ? error.message : String(error), "error");
        }
        return;
      }
      if (command === "clear-messages") {
        const id = argumentsList[0];
        if (!id) {
          context.ui.notify("Usage: /fabric clear-messages <actor-id>", "warning");
          return;
        }
        try {
          const actor = state.actors.status(id);
          await state.actors.clearMessages(actor.id);
          context.ui.notify(`Cleared message history for ${actor.name}`, "info");
        } catch (error) {
          context.ui.notify(error instanceof Error ? error.message : String(error), "error");
        }
        return;
      }
      if (command === "events") {
        const id = argumentsList[0];
        if (!id) {
          context.ui.notify("Usage: /fabric events <actor-id> [event...]", "warning");
          return;
        }
        try {
          const actor = state.actors.status(id);
          const events = argumentsList.slice(1);
          await state.actors.setEvents(actor.id, events);
          context.ui.notify(
            `Set ${actor.name} events: ${events.join(", ") || "(none)"}`,
            "info"
          );
        } catch (error) {
          context.ui.notify(error instanceof Error ? error.message : String(error), "error");
        }
        return;
      }
      if (command === "stop") {
        const id = argumentsList[0];
        if (!id) {
          context.ui.notify("Usage: /fabric stop <id>", "warning");
          return;
        }
        const actor = state.actors.list().find((candidate) => candidate.id.startsWith(id) || candidate.name === id);
        if (actor) {
          await state.actors.stop(actor.id);
          context.ui.notify(`Stopped Fabric actor ${actor.id.slice(0, 8)}`, "info");
          return;
        }
        const agent = state.agents.list().find((candidate) => candidate.id.startsWith(id));
        if (!agent) {
          context.ui.notify(`Unknown Fabric actor or agent: ${id}`, "error");
          return;
        }
        await state.agents.stop(agent.id);
        context.ui.notify(`Stopped Fabric agent ${agent.id.slice(0, 8)}`, "info");
        return;
      }
      if (command === "remove" || command === "kill") {
        const id = argumentsList[0];
        if (!id) {
          context.ui.notify("Usage: /fabric remove <id>", "warning");
          return;
        }
        const actor = state.actors.list().find((candidate) => candidate.id.startsWith(id) || candidate.name === id);
        if (actor) {
          await state.actors.remove(actor.id);
          context.ui.notify(`Removed Fabric actor ${actor.id.slice(0, 8)} (${actor.name})`, "info");
          return;
        }
        const agent = state.agents.list().find((candidate) => candidate.id.startsWith(id));
        if (!agent) {
          context.ui.notify(`Unknown Fabric actor or agent: ${id}`, "error");
          return;
        }
        await state.agents.stop(agent.id);
        await state.agents.cleanup(agent.id);
        context.ui.notify(`Removed Fabric agent ${agent.id.slice(0, 8)}`, "info");
        return;
      }
      if (command === "attach") {
        const id = argumentsList[0];
        const agent = id ? state.agents.list().find((candidate) => candidate.id.startsWith(id)) : void 0;
        if (!agent?.attachCommand) {
          context.ui.notify("No attachable Fabric agent found", "warning");
          return;
        }
        context.ui.notify(agent.attachCommand, "info");
        return;
      }
      if (command === "global") {
        const templates = state.globalActors.list();
        context.ui.notify(
          templates.length > 0 ? templates.map((template) => `${template.id.slice(0, 8)} global ${template.runner} \u2014 ${template.name}`).join("\n") : "No global Fabric actor templates",
          "info"
        );
        return;
      }
      if (command === "import") {
        const key = argumentsList[0];
        if (!key) {
          context.ui.notify("Usage: /fabric import <global-actor-name-or-id> [as <new-name>]", "warning");
          return;
        }
        try {
          const def = state.globalActors.resolve(key);
          if (!def) {
            context.ui.notify(`Unknown global actor: ${key}`, "error");
            return;
          }
          const asIndex = argumentsList.indexOf("as");
          const as = asIndex >= 0 && argumentsList[asIndex + 1] ? argumentsList[asIndex + 1] : void 0;
          const actor = await state.actors.create(state.globalActors.toRequest(def, as));
          context.ui.notify(`Imported global actor "${def.name}" as ${actor.name}`, "info");
        } catch (error) {
          context.ui.notify(error instanceof Error ? error.message : String(error), "error");
        }
        return;
      }
      if (command === "export") {
        const id = argumentsList[0];
        const overwrite = argumentsList.includes("--overwrite") || argumentsList.includes("-f");
        if (!id) {
          context.ui.notify("Usage: /fabric export <actor-id> [--overwrite]", "warning");
          return;
        }
        try {
          const actor = state.actors.list().find((candidate) => candidate.id.startsWith(id) || candidate.name === id);
          if (!actor) {
            context.ui.notify(`Unknown Fabric actor: ${id}`, "error");
            return;
          }
          const def = state.actors.definition(actor.id);
          const template = state.globalActors.create(def, overwrite);
          context.ui.notify(`Exported "${template.name}" to global actors`, "info");
        } catch (error) {
          context.ui.notify(error instanceof Error ? error.message : String(error), "error");
        }
        return;
      }
      if (command === "repairs") {
        if (argumentsList[0] !== void 0) {
          context.ui.notify("Usage: /fabric repairs", "warning");
          return;
        }
        context.ui.notify(formatRepairStatus(state.repairs.status()), "info");
        return;
      }
      if (command !== "status") {
        context.ui.notify(
          "Usage: /fabric [status|dashboard|prewalk [task]|prewalk --off|--disable|--enable|reload|providers|agents|actors|global|import <name> [as <new>]|export <id> [--overwrite]|messages <id>|clear-messages <id>|events <id> [event...]|log <id>|export-log <id>|attach <id>|stop <id>|remove <id>|kill <id>|repairs]",
          "warning"
        );
        return;
      }
      const config = state.config;
      context.ui.notify(
        [
          `cwd: ${state.cwd}`,
          `mode: ${config.fullCodeMode ? "full code (Fabric-owned core tools)" : "orchestration-only (native Pi tools)"}`,
          `providers: ${state.registry.providers().map((provider) => provider.name).join(", ")}`,
          `runner: ${config.agents.runner} \xB7 transport: ${config.agents.transport} \xB7 model: ${config.agents.runner === "claude" ? config.agents.claude.model || "Claude default" : config.agents.runner === "veda" ? `${config.agents.veda.model || "Veda default"} \xB7 backend ${config.agents.veda.backend} \xB7 persona ${config.agents.veda.persona}` : config.agents.model || "inherit"}`,
          `agent limits: concurrency ${config.agents.maxConcurrent}, per execution ${config.agents.maxPerExecution}, depth ${config.agents.maxDepth}`,
          (() => {
            const prewalk = state.prewalk.status();
            return prewalk.state === "idle" ? `prewalk: idle \xB7 ${config.prewalk.mode} \xB7 model ${config.prewalk.model || "Ask each time"} \xB7 auto-arm & re-arm ${config.prewalk.alwaysRearm ? "on" : "off"}` : `prewalk: ${prewalk.state} \xB7 ${prewalk.mode} \u2192 ${prewalk.model}${prewalk.alwaysRearm ? " \xB7 always re-arm" : ""}`;
          })(),
          config.fullCodeMode && config.capture.enabled ? `captured tools: ${capturedTools.size} \xB7 model visibility: ${config.capture.hideFromModel ? "hidden" : "visible"}` : "captured tools: disabled (native registry preserved)",
          `actors: ${state.actors.list().length} \xB7 mesh: ${config.mesh.enabled ? state.mesh.root : "disabled"}`,
          `MCP: ${config.mcp.enabled ? "enabled" : "disabled"}`,
          `UI: ${config.ui.enabled ? `${config.ui.widget} widget above chat` : "disabled"}`
        ].join("\n"),
        "info"
      );
    }
  });
}

// src/core/tool-ownership.ts
import path3 from "node:path";

// src/audit/details.ts
var FABRIC_EXECUTION_DETAILS_MAX_BYTES = 512 * 1024;
var serializedBytes = (value) => Buffer.byteLength(JSON.stringify(value), "utf8");
var cloneTrace = (trace) => structuredClone(trace);
var persistableAudit = (audit) => structuredClone({
  ref: audit.ref,
  ...audit.tool !== void 0 ? { tool: audit.tool } : {},
  ...audit.provider !== void 0 ? { provider: audit.provider } : {},
  ...audit.success !== void 0 ? { success: audit.success } : {},
  ...audit.error !== void 0 ? { error: audit.error } : {},
  ...audit.args !== void 0 ? { args: audit.args } : {},
  ...audit.result !== void 0 ? { result: audit.result } : {},
  ...audit.resultTruncated !== void 0 ? { resultTruncated: audit.resultTruncated } : {},
  ...audit.preview !== void 0 ? { preview: audit.preview } : {},
  ...audit.startedAt !== void 0 ? { startedAt: audit.startedAt } : {},
  ...audit.endedAt !== void 0 ? { endedAt: audit.endedAt } : {}
});
var createFabricPersistedExecutionDetails = (input) => {
  const details = {
    success: input.success,
    trace: cloneTrace(input.trace),
    audits: (input.audits ?? []).map(persistableAudit),
    phases: (input.phases ?? []).filter((phase) => typeof phase === "string"),
    ...typeof input.error === "string" && input.error ? { error: input.error } : {},
    ...input.outputFormat ? { outputFormat: input.outputFormat } : {},
    ...input.outputFormatStartLine !== void 0 ? { outputFormatStartLine: Math.max(0, Math.floor(input.outputFormatStartLine)) } : {},
    ...input.outputFormatLines !== void 0 ? { outputFormatLines: Math.max(0, Math.floor(input.outputFormatLines)) } : {}
  };
  while (serializedBytes(details) > FABRIC_EXECUTION_DETAILS_MAX_BYTES && details.audits.length > 0) {
    details.audits.pop();
  }
  while (serializedBytes(details) > FABRIC_EXECUTION_DETAILS_MAX_BYTES && details.trace.operations.length > 0) {
    details.trace.operations.pop();
    details.trace.counts.droppedOperations++;
  }
  while (serializedBytes(details) > FABRIC_EXECUTION_DETAILS_MAX_BYTES && details.phases.length > 0) {
    details.phases.pop();
  }
  while (serializedBytes(details) > FABRIC_EXECUTION_DETAILS_MAX_BYTES && details.trace.phases.length > 0) {
    details.trace.phases.pop();
    details.trace.counts.droppedValues++;
  }
  if (serializedBytes(details) > FABRIC_EXECUTION_DETAILS_MAX_BYTES) {
    delete details.trace.error;
    details.trace.counts.droppedValues++;
  }
  return details;
};
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var legacyAudit = (value) => {
  if (!isRecord(value) || typeof value.ref !== "string") return void 0;
  return {
    ref: value.ref,
    ...typeof value.tool === "string" ? { tool: value.tool } : {},
    ...typeof value.provider === "string" ? { provider: value.provider } : {},
    ...typeof value.success === "boolean" ? { success: value.success } : {},
    ...typeof value.error === "string" ? { error: value.error } : {},
    ...isRecord(value.args) ? { args: value.args } : {},
    ...value.result !== void 0 ? { result: value.result } : {},
    ...typeof value.resultTruncated === "boolean" ? { resultTruncated: value.resultTruncated } : {},
    ...value.preview !== void 0 ? { preview: value.preview } : {},
    ...typeof value.startedAt === "number" ? { startedAt: value.startedAt } : {},
    ...typeof value.endedAt === "number" ? { endedAt: value.endedAt } : {}
  };
};
var auditFromOperation = (operation) => ({
  ref: operation.ref,
  fromTrace: true,
  ...operation.action ? { tool: operation.action } : {},
  ...operation.provider ? { provider: operation.provider } : {},
  success: operation.outcome === "succeeded",
  ...operation.error ? { error: operation.error } : {},
  ...Object.keys(operation.args).length > 0 ? { args: operation.args } : {},
  ...operation.result !== void 0 ? { result: operation.result } : {},
  ...operation.resultTruncated === true ? { resultTruncated: true } : {}
});
var readFabricExecutionRenderDetails = (value) => {
  if (!isRecord(value)) return { audits: [], phases: [] };
  const trace = isFabricExecutionTraceV1(value.trace) ? value.trace : void 0;
  const oldAudits = Array.isArray(value.audits) ? value.audits.map(legacyAudit).filter((audit) => audit !== void 0) : void 0;
  const oldPhases = Array.isArray(value.phases) ? value.phases.filter((phase) => typeof phase === "string") : void 0;
  return {
    ...typeof value.success === "boolean" ? { success: value.success } : trace ? { success: trace.outcome === "succeeded" } : {},
    ...typeof value.error === "string" ? { error: value.error } : trace?.error ? { error: trace.error } : {},
    ...typeof value.progress === "string" ? { progress: value.progress } : {},
    ...value.outputFormat === "yaml" || value.outputFormat === "json" ? { outputFormat: value.outputFormat } : {},
    ...typeof value.outputFormatStartLine === "number" && Number.isFinite(value.outputFormatStartLine) && value.outputFormatStartLine >= 0 ? { outputFormatStartLine: Math.floor(value.outputFormatStartLine) } : {},
    ...typeof value.outputFormatLines === "number" && Number.isFinite(value.outputFormatLines) && value.outputFormatLines >= 0 ? { outputFormatLines: Math.floor(value.outputFormatLines) } : {},
    phases: oldPhases ?? trace?.phases ?? [],
    audits: oldAudits ?? trace?.operations.map(auditFromOperation) ?? []
  };
};

// src/core/tool-ownership.ts
var FABRIC_TOOL_NAME = "fabric_exec";
var TOP_LEVEL_SCHEMA_REF_PREFIX = "schema.top_level_tool.";
var ownsFabricToolSource = (tools, extensionEntryPath) => tools.some(
  (tool) => tool.name === FABRIC_TOOL_NAME && path3.resolve(tool.sourceInfo.path) === path3.resolve(extensionEntryPath)
);
var isRecord2 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var finalFabricDetailsFailed = (details) => {
  if (!isRecord2(details)) return false;
  if (details.success === false) return true;
  const trace = readFabricExecutionTraceV1(details.trace);
  return trace !== void 0 && trace.outcome !== "succeeded";
};
var FabricToolLifecycle = class {
  constructor(ownsFabricTool, authorizer, approver = () => void 0) {
    this.ownsFabricTool = ownsFabricTool;
    this.authorizer = authorizer;
    this.approver = approver;
  }
  #outerCalls = /* @__PURE__ */ new Set();
  async toolCall(event, context) {
    if (event.toolCallId.startsWith(NESTED_TOOL_CALL_ID_PREFIX)) {
      if (this.#outerCalls.size > 0) return void 0;
      await this.#authorizeTopLevel(event);
      return void 0;
    }
    if (event.toolName === FABRIC_TOOL_NAME && this.ownsFabricTool()) {
      this.#outerCalls.add(event.toolCallId);
      return void 0;
    }
    await this.#authorizeTopLevel(event);
    const approver = this.approver();
    if (approver) {
      if (!context) throw new Error("Fabric direct tool approval needs an extension context");
      await approver.approve(event, context);
    }
    return void 0;
  }
  toolResult(event) {
    if (event.toolName !== FABRIC_TOOL_NAME || event.toolCallId.startsWith(NESTED_TOOL_CALL_ID_PREFIX) || !this.#outerCalls.delete(event.toolCallId)) {
      return void 0;
    }
    return !event.isError && finalFabricDetailsFailed(event.details) ? { isError: true } : void 0;
  }
  clear() {
    this.#outerCalls.clear();
  }
  async #authorizeTopLevel(event) {
    await this.authorizer()?.authorize(
      `${TOP_LEVEL_SCHEMA_REF_PREFIX}${event.toolName}`,
      event.toolCallId
    );
  }
};
var sameTools = (left, right) => left.length === right.length && left.every((name, index) => name === right[index]);
var createToolOwnershipReassertion = (options) => {
  let queued = false;
  const reassert = () => {
    queued = false;
    if (!options.ready() || !options.active()) return;
    options.apply(options.hiddenNames());
  };
  return {
    reassert,
    schedule: () => {
      if (queued) return;
      queued = true;
      queueMicrotask(reassert);
    }
  };
};
var FabricToolOwnership = class {
  constructor(host) {
    this.host = host;
  }
  #savedNativeCoreTools;
  // Captured extension tools stay registered so host extensions (permission
  // systems, auditors) keep them in `pi.getAllTools()`; hiding from the model
  // happens here, in the active set. Removed names are remembered so leaving
  // full code mode (or adding a name to `capture.keepVisible`) re-exposes them.
  #savedHiddenExtensionTools = /* @__PURE__ */ new Map();
  apply(fullCodeMode, hiddenExtensionTools) {
    const active = this.host.getActiveTools();
    if (!fullCodeMode) return this.#restore(active);
    this.#savedNativeCoreTools ??= active.flatMap(
      (name, index) => PI_CORE_TOOL_NAME_SET.has(name) ? [{ name, index }] : []
    );
    const hidden = hiddenExtensionTools ?? /* @__PURE__ */ new Set();
    const next = [];
    active.forEach((name, index) => {
      if (PI_CORE_TOOL_NAME_SET.has(name)) return;
      if (hidden.has(name)) {
        if (!this.#savedHiddenExtensionTools.has(name)) {
          this.#savedHiddenExtensionTools.set(name, index);
        }
        return;
      }
      next.push(name);
    });
    for (const [name, index] of this.#savedHiddenExtensionTools) {
      if (hidden.has(name) || next.includes(name)) continue;
      this.#savedHiddenExtensionTools.delete(name);
      next.splice(Math.min(index, next.length), 0, name);
    }
    if (!next.includes("fabric_exec")) next.push("fabric_exec");
    return this.#setIfChanged(active, next);
  }
  release() {
    return this.#restore(this.host.getActiveTools());
  }
  #restore(active) {
    const saved = this.#savedNativeCoreTools;
    const savedHidden = this.#savedHiddenExtensionTools;
    if (!saved && savedHidden.size === 0) return false;
    this.#savedNativeCoreTools = void 0;
    this.#savedHiddenExtensionTools = /* @__PURE__ */ new Map();
    const next = [...active];
    for (const { name, index } of saved ?? []) {
      if (!next.includes(name)) next.splice(Math.min(index, next.length), 0, name);
    }
    for (const [name, index] of savedHidden) {
      if (!next.includes(name)) next.splice(Math.min(index, next.length), 0, name);
    }
    return this.#setIfChanged(active, next);
  }
  #setIfChanged(active, next) {
    if (sameTools(active, next)) return false;
    this.host.setActiveTools(next);
    return true;
  }
};

// src/core/core-override-guidance.ts
var coreOverridePromptGuidance = (catalog) => {
  const sections = [];
  for (const name of PI_CORE_TOOL_NAMES) {
    const entry = catalog.get(name);
    if (!entry) continue;
    const lines = [];
    if (entry.definition.promptSnippet) {
      lines.push(`Additional guidance for \`pi.${name}\`: ${entry.definition.promptSnippet}`);
    }
    const guidelines = entry.definition.promptGuidelines ?? [];
    if (guidelines.length > 0) {
      lines.push(`Guidelines for \`pi.${name}\`:`);
      lines.push(...guidelines.map((guideline) => `- ${guideline}`));
    }
    if (lines.length > 0) sections.push(lines.join("\n"));
  }
  return sections.length > 0 ? `

Effective compatible core override guidance:
${sections.join("\n")}` : "";
};

// src/core/system-guidance.ts
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "node:fs";
import * as path4 from "node:path";
var fabricExecutionKernelGuidance = (fullCodeMode) => [
  fullCodeMode ? "Pi Fabric full code mode: `fabric_exec` is the only way to call Pi core tools \u2014 use them as `pi.*` inside `code`." : "Pi Fabric is in orchestration-only mode. Pi core and registered extension tools stay on their native direct execution path; inside fabric_exec, `pi.*` and `extensions.*` are unavailable.",
  // Files the model has not opened (images in particular) must be read before
  // use; this line rides the turn-stable kernel guidance so provider prefix
  // caches stay warm.
  `Read every file the user provides (images, screenshots, code, text) with the ${fullCodeMode ? "`pi.read`" : "`read`"} tool before responding \u2014 never assume its contents.`
].join(" ");
var defaultFabricExecutionGuidance = (fullCodeMode) => fullCodeMode ? "Examples and returns: `pi.read('/x')`, `pi.grep('TODO','src')` / `pi.grep({pattern:'TODO', path:'src', ignoreCase:true, context:2})`, `pi.find({pattern:'*.ts', path:'src', limit:20})`, and `pi.ls('src')` return strings; `pi.bash({cmd:'ls'})`, `pi.edit({path:'/x', old:'a', new:'b'})`, and `pi.write({path:'/y', text:'z'})` return `{ok, output, details}` (read `.output`); failed core calls reject, including `bash` on an ordinary nonzero exit; pass `settle: true` to `pi.bash` to get `{ ok: false, exitCode, output, error }` instead. Timeout, cancellation, approval, and security failures still reject.\n`tools` is discovery + generic calls only (`providers`/`catalog`/`list`/`search`/`describe`/`call`/`models`). Call known MCP tools as `mcp.<sanitized_server>.<sanitized_tool>(args)`, captured tools as `extensions.<tool>(args)`, and stable providers as `memory.*`, `state.*`, `schema.*`, or `compact.*`. Use `tools.call({ref,args})` for computed refs. `pi` is the core tools; `\u03C0.<key>` reads named `strings` (not a tool)." : "Call known actions through `mcp.<sanitized_server>.<sanitized_tool>(args)`, `memory.*`, `state.*`, `schema.*`, `components.*`, `compact.*`, `agents.*`, or `mesh.*`; use `tools.catalog`/`search`/`describe`/`list` for discovery and `tools.call({ref,args})` for computed refs. Other surfaces are opt-in via user-loaded skills.";
var manifestNameCache = /* @__PURE__ */ new Map();
var packageNameFromManifest = (startPath) => {
  if (!startPath) return void 0;
  let directory = path4.dirname(path4.resolve(startPath));
  while (true) {
    if (manifestNameCache.has(directory)) return manifestNameCache.get(directory);
    const manifestPath = path4.join(directory, "package.json");
    let name;
    if (existsSync2(manifestPath)) {
      try {
        const manifest = JSON.parse(readFileSync2(manifestPath, "utf8"));
        if (typeof manifest.name === "string" && manifest.name.trim()) name = manifest.name.trim();
      } catch {
      }
    }
    manifestNameCache.set(directory, name);
    if (name) return name;
    const parent = path4.dirname(directory);
    if (parent === directory) return void 0;
    directory = parent;
  }
};
var extensionToolRosterGuidance = (tools, coreToolNames) => {
  const extensionTools = tools.filter((tool) => !coreToolNames.has(tool.name));
  if (extensionTools.length === 0) return void 0;
  const namespaceLabel = (tool) => {
    const source = tool.sourceInfo?.source?.trim();
    if (source?.startsWith("npm:")) return source.slice("npm:".length) || source;
    const manifestName = packageNameFromManifest(tool.sourceInfo?.path) ?? packageNameFromManifest(source && /[\\/]/.test(source) ? source : void 0);
    if (manifestName) return manifestName;
    if (source && !/[\\/]/.test(source)) return source;
    const parts = (tool.sourceInfo?.path ?? source ?? "").split(/[\\/]/).filter(Boolean);
    const base = parts.at(-1)?.trim() ?? "";
    if (/^index\./i.test(base)) return parts.at(-2)?.trim() || base;
    return base || "extensions";
  };
  const groups = /* @__PURE__ */ new Map();
  for (const tool of [...extensionTools].sort((left, right) => left.name.localeCompare(right.name))) {
    const label = namespaceLabel(tool);
    const names = groups.get(label);
    if (names) names.push(tool.name);
    else groups.set(label, [tool.name]);
  }
  return [
    "Registered extension tools are callable inside fabric_exec as `extensions.<name>(args)`; run `tools.list` for full descriptions and schemas before re-implementing an effect with pi.bash.",
    ...[...groups.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([label, names]) => "- " + label + ": " + names.join(", "))
  ].join("\n");
};
var fabricSchemaGuidance = (mode) => {
  if (mode === "enforce") {
    return "Schema enforce mode is fixed for this session. Reads remain available, but protected-workspace changes must use schema.hypothesize \u2192 schema.verify \u2192 schema.commit in the same fabric_exec invocation. Direct pi.edit/write/bash, agents, state/mesh writes, compaction requests, MCP, extensions, and external providers are blocked by the host gate.";
  }
  if (mode === "audit") {
    return "Schema audit mode reports actions that enforce mode would block, but preserves their current behavior.";
  }
  return void 0;
};

// src/core/skill-prompt.ts
var SKILL_SECTION_HEADING = "The following skills provide specialized instructions for specific tasks.";
var PI_SKILL_LOAD_INSTRUCTION = "Use the read tool to load a skill's file when the task matches its description.";
var FABRIC_SKILL_LOAD_INSTRUCTION = "Use `pi.read` inside `fabric_exec` to load a skill's file when the task matches its description.";
var CWD_MARKER = "\nCurrent working directory:";
var restoreSkillsForFullCodePrompt = (systemPrompt, skills) => {
  const section = formatSkillsForPrompt([...skills]).replace(
    PI_SKILL_LOAD_INSTRUCTION,
    FABRIC_SKILL_LOAD_INSTRUCTION
  );
  if (!section) return systemPrompt;
  if (systemPrompt.includes(SKILL_SECTION_HEADING)) {
    return systemPrompt.replace(
      PI_SKILL_LOAD_INSTRUCTION,
      FABRIC_SKILL_LOAD_INSTRUCTION
    );
  }
  const cwdIndex = systemPrompt.lastIndexOf(CWD_MARKER);
  if (cwdIndex < 0) return `${systemPrompt}${section}`;
  return `${systemPrompt.slice(0, cwdIndex)}${section}${systemPrompt.slice(cwdIndex)}`;
};

// src/core/proxy-contract.ts
var PROXY_CONTRACT_CUSTOM_TYPE = "pi-fabric-proxy";
var FABRIC_EXEC_TOOL = "fabric_exec";
var MAX_PROXY_NAMES = 8;
var SKILL_REGION = /<available_skills\b[^>]*>[\s\S]*?(?:<\/available_skills\s*>|$)|<skill\b[^>]*>[\s\S]*?(?:<\/skill\s*>|$)/g;
var escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var isRewritableCapturedToolName = (name) => {
  if (!name || name === FABRIC_EXEC_TOOL) return false;
  if (PI_CORE_TOOL_NAME_SET.has(name)) return false;
  return name.includes("_") || name.length >= 10;
};
var rewritableHiddenCapturedToolNames = (names) => [...new Set(names)].filter(isRewritableCapturedToolName).sort((a, b) => b.length - a.length || a.localeCompare(b));
var mentionPattern = (name) => new RegExp(`(?<![\\w.])${escapeRegex(name)}(?![\\w])`);
var extractSkillRegions = (text) => {
  const regions = [];
  for (const match of text.matchAll(SKILL_REGION)) {
    const region = match[0];
    if (region) regions.push(region);
  }
  return regions.join("\n");
};
var capturedToolMentions = (text, names) => names.filter((name) => mentionPattern(name).test(text));
var proxyContractMentionsInSkills = (prompt, systemPrompt, names) => {
  const envelope = `${extractSkillRegions(prompt)}
${extractSkillRegions(systemPrompt)}`;
  if (envelope.trim().length === 0) return [];
  return capturedToolMentions(envelope, names).slice(0, MAX_PROXY_NAMES);
};
var formatProxyContractReminder = (names) => {
  const rows = names.map((name) => `\u25AA ${name} \u2192 extensions.${name}`);
  return [
    "Proxy contract: these names in the loaded skill are captured tools, not top-level calls.",
    "Call them as `extensions.<name>({...})` inside `fabric_exec`.",
    "",
    ...rows
  ].join("\n");
};
var namesFromEntry = (entry) => {
  if (entry.type !== "custom_message" || entry.customType !== PROXY_CONTRACT_CUSTOM_TYPE) {
    return [];
  }
  const details = entry.details;
  if (Array.isArray(details?.names)) {
    return details.names.filter((name) => typeof name === "string" && name.length > 0);
  }
  return [];
};
var ProxyContractLedger = class {
  #reminded = /* @__PURE__ */ new Set();
  reset() {
    this.#reminded.clear();
  }
  restoreFromEntries(entries) {
    this.#reminded.clear();
    for (const entryUnknown of entries) {
      if (typeof entryUnknown !== "object" || entryUnknown === null) continue;
      for (const name of namesFromEntry(entryUnknown)) {
        this.#reminded.add(name);
      }
    }
  }
  take(candidates) {
    const fresh = candidates.filter((name) => !this.#reminded.has(name));
    for (const name of fresh) this.#reminded.add(name);
    return fresh;
  }
};

// src/core/direct-tool-approval.ts
var isRecord3 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var addUsage = (left, right) => ({
  input: left.input + right.input,
  output: left.output + right.output,
  cacheRead: left.cacheRead + right.cacheRead,
  cacheWrite: left.cacheWrite + right.cacheWrite,
  ...left.cacheWrite1h !== void 0 || right.cacheWrite1h !== void 0 ? { cacheWrite1h: (left.cacheWrite1h ?? 0) + (right.cacheWrite1h ?? 0) } : {},
  ...left.reasoning !== void 0 || right.reasoning !== void 0 ? { reasoning: (left.reasoning ?? 0) + (right.reasoning ?? 0) } : {},
  totalTokens: left.totalTokens + right.totalTokens,
  cost: {
    input: left.cost.input + right.cost.input,
    output: left.cost.output + right.cost.output,
    cacheRead: left.cost.cacheRead + right.cost.cacheRead,
    cacheWrite: left.cost.cacheWrite + right.cost.cacheWrite,
    total: left.cost.total + right.cost.total
  }
});
var mergeFabricApprovalUsage = (existing, approval) => existing ? addUsage(existing, approval) : approval;
var FabricDirectToolApproval = class {
  constructor(pi, getConfig, sessionApprovals, classifier = new FabricAutoApprovalClassifier(), onAutoDecision) {
    this.pi = pi;
    this.getConfig = getConfig;
    this.sessionApprovals = sessionApprovals;
    this.classifier = classifier;
    this.onAutoDecision = onAutoDecision;
  }
  #pendingUsage = /* @__PURE__ */ new Map();
  async approve(event, context) {
    const config = this.getConfig();
    const action = this.#resolve(event.toolName, config);
    const controller = new ApprovalController(
      config.approvals,
      context,
      this.sessionApprovals,
      this.classifier,
      (audit, decision) => {
        this.onAutoDecision?.(audit, decision);
        if (decision) this.#pendingUsage.set(event.toolCallId, decision.usage);
      }
    );
    await controller.approve(action, isRecord3(event.input) ? event.input : {});
  }
  takeUsage(toolCallId) {
    const usage = this.#pendingUsage.get(toolCallId);
    this.#pendingUsage.delete(toolCallId);
    return usage;
  }
  clear() {
    this.#pendingUsage.clear();
  }
  #resolve(toolName, config) {
    const metadata = this.pi.getAllTools().find((tool) => tool.name === toolName);
    const builtin = metadata?.sourceInfo.source === "builtin";
    const provider = builtin ? "pi" : "extensions";
    return {
      ref: provider + "." + toolName,
      provider,
      name: toolName,
      description: metadata?.description ?? "Direct Pi tool: " + toolName,
      inputSchema: isRecord3(metadata?.parameters) ? metadata.parameters : {},
      risk: config.capture.risks[toolName] ?? config.capture.defaultRisk
    };
  }
};

// src/core/skill-references.ts
var INVOCATION_VERB = /^\s*(?:[-*]\s*)?(?:(?:then|next|first|always|must|you must)\s+)?(?:run|invoke|load|start|follow|use)\b/i;
var NEGATED_INVOCATION = /^\s*(?:[-*]\s*)?(?:do not|don't|never)\s+(?:run|invoke|load|start|follow|use)\b/i;
var escapeRegex2 = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var referencesSkill = (line, skillName) => {
  const name = escapeRegex2(skillName);
  return new RegExp(`/(?:skill:)?${name}(?=[\\s\`'".,;:!?<>)\\]}]|$)`, "i").test(line);
};
var buildSkillReferenceGuidance = (prompt, skills) => {
  const active = skills.find(
    (skill) => prompt.startsWith(`<skill name="${skill.name}" location="${skill.filePath}">`)
  );
  if (!active) return void 0;
  const closingTag = prompt.indexOf("</skill>");
  if (closingTag < 0) return void 0;
  const openingEnd = prompt.indexOf("\n\n");
  if (openingEnd < 0 || openingEnd >= closingTag) return void 0;
  const body = prompt.slice(openingEnd + 2, closingTag);
  const invocationLines = body.split("\n").filter((line) => INVOCATION_VERB.test(line) && !NEGATED_INVOCATION.test(line));
  const referenced = skills.filter(
    (skill) => skill.name !== active.name && skill.disableModelInvocation !== true && invocationLines.some((line) => referencesSkill(line, skill.name))
  );
  if (referenced.length === 0) return void 0;
  const mappings = referenced.map((skill) => `- /${skill.name} -> ${JSON.stringify(skill.filePath)}`).join("\n");
  return [
    `The active skill ${JSON.stringify(active.name)} is already expanded; do not reread ${JSON.stringify(active.filePath)}.`,
    "Resolve the skill invocations below before task exploration:",
    mappings,
    "Load each mapped SKILL.md through pi.read inside fabric_exec and follow it. Skill loading is a dependency, not task exploration. Continue the active workflow after tool results and later user replies until it completes."
  ].join("\n");
};

// src/fabric-exec-tool.ts
import { Container as Container2, Text as Text2 } from "@earendil-works/pi-tui";
import { Type } from "typebox";

// src/failure-progress.ts
var MAX_COMPLETED_CALLS = 8;
var MAX_PATH_CHARS = 100;
var compactPath = (value) => {
  const singleLine = value.replaceAll(/\s+/g, " ").trim();
  if (singleLine.length <= MAX_PATH_CHARS) return singleLine;
  return `\u2026${singleLine.slice(-(MAX_PATH_CHARS - 1))}`;
};
var formatFailureProgress = (trace) => {
  if (trace.outcome === "succeeded") return void 0;
  const completed = trace.operations.filter(
    (operation) => operation.outcome === "succeeded"
  );
  if (completed.length === 0) return void 0;
  const summaries = completed.slice(0, MAX_COMPLETED_CALLS).map((operation) => {
    const path10 = operation.args.path;
    return typeof path10 === "string" ? `${operation.ref}(${compactPath(path10)})` : operation.ref;
  });
  const omitted = completed.length - summaries.length;
  return [
    `Completed before the outer failure (outputs not returned): ${summaries.join("; ")}${omitted > 0 ? `; +${omitted} more` : ""}.`,
    "Successful calls may already have changed the workspace; inspect before repeating mutations."
  ].join("\n");
};

// src/fabric-exec-arguments.ts
var OPTIONAL_FABRIC_EXEC_KEYS = [
  "payloads",
  "strings",
  "resultFormat",
  "tokenBudget",
  "agentBudget",
  "timeoutMs",
  "display"
];
var isRecord4 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var looksLikeJsonObject = (text) => text.startsWith("{") && text.endsWith("}");
var looksLikeJsonString = (text) => text.startsWith('"') && text.endsWith('"');
var parseJsonObject = (text) => {
  const trimmed = text.trim();
  if (!looksLikeJsonObject(trimmed) && !looksLikeJsonString(trimmed)) return void 0;
  try {
    let parsed = JSON.parse(trimmed);
    if (typeof parsed === "string") {
      const inner = parsed.trim();
      if (!looksLikeJsonObject(inner)) return void 0;
      parsed = JSON.parse(inner);
    }
    return isRecord4(parsed) ? parsed : void 0;
  } catch {
    return void 0;
  }
};
var asStringRecord = (record) => {
  if (Object.values(record).some((value) => typeof value !== "string")) return void 0;
  return record;
};
var normalizeFabricExecStrings = (input) => {
  if (isRecord4(input)) return asStringRecord(input);
  if (typeof input !== "string") return void 0;
  const parsed = parseJsonObject(input);
  return parsed ? asStringRecord(parsed) : void 0;
};
var resolveFabricExecPayloads = (params) => normalizeFabricExecStrings(params.payloads) ?? normalizeFabricExecStrings(params.strings);
var prepareFabricExecArguments = (input) => {
  if (typeof input === "string") return { code: repairFabricGuestCode(input) };
  if (!isRecord4(input)) return input;
  let prepared = input;
  const writable = () => {
    if (prepared === input) prepared = { ...input };
    return prepared;
  };
  if (Array.isArray(prepared.code) && prepared.code.every((line) => typeof line === "string")) {
    writable().code = prepared.code.join("\n");
  }
  if (typeof prepared.code === "string") {
    const repaired = repairFabricGuestCode(prepared.code);
    if (repaired !== prepared.code) writable().code = repaired;
  }
  for (const key of OPTIONAL_FABRIC_EXEC_KEYS) {
    if (!Object.hasOwn(prepared, key)) continue;
    if (prepared[key] === null || prepared[key] === void 0) delete writable()[key];
  }
  const display = prepared.display;
  if (typeof display === "string" || isRecord4(display)) {
    const normalized = normalizeRunDisplay(display);
    if (normalized) writable().display = normalized;
    else delete writable().display;
  }
  const hasPayloads = Object.hasOwn(prepared, "payloads");
  const hasStrings = Object.hasOwn(prepared, "strings");
  if (hasPayloads || hasStrings) {
    const raw = hasPayloads ? prepared.payloads : prepared.strings;
    const normalized = normalizeFabricExecStrings(raw);
    if (normalized) {
      if (prepared.payloads !== normalized) writable().payloads = normalized;
    } else if (!hasPayloads) {
      writable().payloads = raw;
    }
    if (hasStrings) delete writable().strings;
  }
  return prepared;
};

// src/runtime/core-tool-properties.ts
var CORE_TOOL_NAMES = Object.keys(
  PI_CORE_COMPATIBILITY_ARGUMENT_TYPE_NAMES
);
var extractTypeDeclarations = (declarations) => {
  const parsed = /* @__PURE__ */ new Map();
  for (const match of declarations.matchAll(/\btype\s+(\w+)\s*=/g)) {
    const name = match[1];
    if (name === void 0) continue;
    const rhsStart = match.index + match[0].length;
    let depth = 0;
    let end = rhsStart;
    while (end < declarations.length) {
      const character = declarations[end];
      if (character === "(" || character === "{" || character === "[") depth += 1;
      else if (character === ")" || character === "}" || character === "]") depth -= 1;
      else if (character === ";" && depth === 0) break;
      end += 1;
    }
    parsed.set(name, declarations.slice(rhsStart, end));
  }
  return parsed;
};
var matchCaptures = (text, pattern) => [...text.matchAll(pattern)].flatMap(
  (match) => match[1] === void 0 ? [] : [match[1]]
);
var objectLiteralKeys = (rhs) => {
  const withoutMappedKeys = rhs.replace(/\[\s*\w+\s+in\s+keyof\s+\w+\s*\]\s*:/g, " ");
  return matchCaptures(withoutMappedKeys, /([A-Za-z_]\w*)\s*\??:/g);
};
var referencedTypeNames = (rhs) => matchCaptures(rhs, /\b(Pi[A-Z]\w*)/g);
var capitalise = (tool) => tool.charAt(0).toUpperCase() + tool.slice(1);
var collectCoreToolProperties = (declarations) => {
  const typeDeclarations = extractTypeDeclarations(declarations);
  const owners = /* @__PURE__ */ new Map();
  for (const tool of CORE_TOOL_NAMES) {
    const roots = [
      `Pi${capitalise(tool)}Argument`,
      PI_CORE_COMPATIBILITY_ARGUMENT_TYPE_NAMES[tool],
      `Pi${capitalise(tool)}Options`
    ];
    const visited = /* @__PURE__ */ new Set();
    const walk = (name) => {
      if (visited.has(name)) return;
      visited.add(name);
      const rhs = typeDeclarations.get(name);
      if (rhs === void 0) return;
      for (const property of objectLiteralKeys(rhs)) {
        const toolSet = owners.get(property) ?? /* @__PURE__ */ new Set();
        toolSet.add(tool);
        owners.set(property, toolSet);
      }
      for (const reference of referencedTypeNames(rhs)) walk(reference);
    };
    for (const root of roots) walk(root);
  }
  return new Map([...owners].map(([property, toolSet]) => [property, [...toolSet]]));
};
var CORE_TOOL_PROPERTIES = collectCoreToolProperties(GUEST_TYPE_DECLARATIONS);

// src/type-error-guidance.ts
var SYNTAX_ERROR_PATTERN = /expected|unterminated|unexpected|invalid character/i;
var PAYLOAD_CALL_PATTERN = /\bpi\.(?:edit|write)\s*\(/;
var UNQUOTED_PATH_HEAD = /\bpi\.(?:read|ls|write|edit)\(\s*(?:https?:\/\/|\/(?![/*])|\.\/|\.\.\/|~\/|[A-Za-z]:[\\/])/;
var PROMISE_ALL_PATTERN = /\bPromise\.all\s*\(/;
var TUPLE_ARITY_PATTERN = /Tuple type .* of length '[0-9]+' has no element at index '[0-9]+'/;
var MISSING_NAME_PATTERN = /^Cannot find name '([^']+)'/;
var UNKNOWN_PROPERTY_PATTERN = /'([^']+)' does not exist in type '([^']+)'/;
var PI_CALL_PATTERN = /\bpi\.(\w+)\s*\(/g;
var FABRIC_EXEC_ARGUMENT_NOTES = {
  payloads: "named `payloads` belong in the outer `fabric_exec` arguments, then become available inside `code` as `\u03C0.key`.",
  strings: "`strings` is an alias for outer `payloads`; named values belong in the outer `fabric_exec` arguments, then become available inside `code` as `\u03C0.key`.",
  tokenBudget: "budget arguments (`tokenBudget`, `agentBudget`) belong to the outer `fabric_exec` call, not inside `code`.",
  agentBudget: "budget arguments (`tokenBudget`, `agentBudget`) belong to the outer `fabric_exec` call, not inside `code`.",
  display: "the `display` objective belongs to the outer `fabric_exec` call, not inside `code`.",
  resultFormat: "`resultFormat` belongs to the outer `fabric_exec` call, not inside `code`."
};
var PROPERTY_NOTES = {
  settle: "`settle:true` settles nonzero `pi.bash` exits into an `ok:false` envelope instead of rejecting; other `pi.*` calls reject failures normally.",
  timeout: "`timeout` is measured in seconds; `timeoutMs` is converted from milliseconds."
};
var BASH_OPTION_NOTES = {
  stdin: "`pi.bash` does not accept `stdin`. Write the content with `pi.write(path, content)`, then pass that path to the command or redirect the file into it."
};
var isCoreToolName = (name) => CORE_TOOL_NAMES.includes(name);
var toolFromTypeText = (typeText) => {
  for (const match of typeText.matchAll(/\bPi([A-Z]\w*)/g)) {
    const captured = match[1];
    if (captured === void 0) continue;
    const candidate = captured.replace(/(?:Compatibility)?(?:Argument|Options)$/, "").toLowerCase();
    if (isCoreToolName(candidate)) return candidate;
  }
  return void 0;
};
var enclosingCoreTool = (code, error) => {
  const lines = code.split("\n");
  for (const lineIndex of [error.line - 2, error.line - 1]) {
    if (lineIndex < 0 || lineIndex >= lines.length) continue;
    const offset = lines.slice(0, lineIndex).join("\n").length + (lineIndex > 0 ? 1 : 0) + Math.max(0, error.column - 1);
    PI_CALL_PATTERN.lastIndex = 0;
    let match;
    let tool;
    while ((match = PI_CALL_PATTERN.exec(code)) !== null && match.index < offset) {
      const called = match[1];
      if (called !== void 0 && isCoreToolName(called)) tool = called;
    }
    if (tool !== void 0) return tool;
  }
  return void 0;
};
var unknownPropertyHint = (property, tool) => {
  if (tool === void 0) return void 0;
  if (tool === "bash") {
    const bashNote = BASH_OPTION_NOTES[property];
    if (bashNote !== void 0) return `Recovery hint: ${bashNote}`;
  }
  const envelopeNote = FABRIC_EXEC_ARGUMENT_NOTES[property];
  if (envelopeNote !== void 0) {
    return `Recovery hint: \`${property}\` is a \`fabric_exec\` argument, not a \`pi.${tool}\` property. ${envelopeNote}`;
  }
  const ownerTools = CORE_TOOL_PROPERTIES.get(property);
  if (ownerTools === void 0 || ownerTools.includes(tool)) return void 0;
  const owners = ownerTools.map((owner) => `\`pi.${owner}\``).join(", ");
  const note = PROPERTY_NOTES[property];
  return `Recovery hint: \`${property}\` is not a \`pi.${tool}\` property \u2014 it belongs to ${owners}.${note ? ` ${note}` : ""}`;
};
var hasLiteralPayloadInterpolation = (code, errors) => {
  if (!PAYLOAD_CALL_PATTERN.test(code)) return false;
  return errors.some((error) => {
    const name = MISSING_NAME_PATTERN.exec(error.message)?.[1];
    return name !== void 0 && code.includes(`\${${name}}`);
  });
};
var typeErrorRecoveryHint = (code, errors) => {
  for (const error of errors) {
    const property = UNKNOWN_PROPERTY_PATTERN.exec(error.message)?.[1];
    const typeText = UNKNOWN_PROPERTY_PATTERN.exec(error.message)?.[2];
    if (property !== void 0 && typeText !== void 0) {
      const tool = toolFromTypeText(typeText) ?? enclosingCoreTool(code, error);
      const hint = unknownPropertyHint(property, tool);
      if (hint) return hint;
    }
  }
  if (PROMISE_ALL_PATTERN.test(code) && errors.some((error) => TUPLE_ARITY_PATTERN.test(error.message))) {
    return "Recovery hint: match `Promise.all` destructuring one binding per promise; remove the extra binding or add the missing call.";
  }
  if (hasLiteralPayloadInterpolation(code, errors)) {
    return "Recovery hint: a `${...}` expression in an edit/write payload is being evaluated by the Fabric TypeScript program. Declare it if intentional; for literal file content, move the payload to top-level `payloads` and reference `\u03C0.key`.";
  }
  if (UNQUOTED_PATH_HEAD.test(code) && errors.some(
    (error) => SYNTAX_ERROR_PATTERN.test(error.message) || error.message.includes("Cannot find name") || error.message.includes("Expected 1-2 arguments")
  )) {
    return "Recovery hint: quote filesystem paths and URLs as strings, e.g. `pi.read('/x')` or `pi.read({ path: '/x' })`. Unquoted paths are parsed as regex, division, or extra arguments.";
  }
  if (!PAYLOAD_CALL_PATTERN.test(code)) return void 0;
  if (!errors.some((error) => SYNTAX_ERROR_PATTERN.test(error.message))) {
    return void 0;
  }
  return "Recovery hint: if embedded edit/write payload text caused the syntax error, pass it through top-level `payloads` and reference `\u03C0.key` instead of escaping it inside `code`.";
};

// src/ui/row-balance.ts
import { truncateToWidth as truncateToWidth2 } from "@earendil-works/pi-tui";
var HiddenRowBorrowingComponent = class {
  constructor(baseLimit, maxLimit, renderLimit, balance) {
    this.baseLimit = baseLimit;
    this.maxLimit = maxLimit;
    this.renderLimit = renderLimit;
    this.balance = balance;
  }
  #cachedWidth;
  #cachedDeficit;
  #cachedRows;
  render(width) {
    const deficit = resultRowDeficit(this.balance, width);
    if (this.#cachedWidth === width && this.#cachedDeficit === deficit && this.#cachedRows) {
      return this.#cachedRows;
    }
    const base = this.renderLimit(this.baseLimit, width);
    let best = base;
    if (deficit > 0 && this.maxLimit > this.baseLimit) {
      let bestGrowth = 0;
      for (let limit = this.baseLimit + 1; limit <= this.maxLimit; limit++) {
        const candidate = this.renderLimit(limit, width);
        const growth = candidate.length - base.length;
        if (growth > deficit) break;
        if (growth >= bestGrowth) {
          best = candidate;
          bestGrowth = growth;
        }
      }
    }
    this.#cachedWidth = width;
    this.#cachedDeficit = deficit;
    this.#cachedRows = best.map((row) => truncateToWidth2(row, Math.max(1, width)));
    return this.#cachedRows;
  }
  invalidate() {
    this.#cachedWidth = void 0;
    this.#cachedDeficit = void 0;
    this.#cachedRows = void 0;
  }
};
var observeResultRows = (component, balance, options) => {
  if (options.isPartial) {
    balance.finalized = false;
    delete balance.final;
    return options.expanded ? component : new PartialResultObserver(component, balance);
  }
  balance.finalized = true;
  if (options.expanded) delete balance.final;
  else balance.final = component;
  return component;
};
var resultRowDeficit = (balance, width) => {
  if (!balance.finalized || !balance.partial || !balance.final) return 0;
  const partialRows = balance.partial.width === width ? balance.partial.rows : balance.partial.component.render(width).length;
  const finalRows = balance.final.render(width).length;
  return Math.max(0, partialRows - finalRows);
};
var PartialResultObserver = class {
  constructor(component, balance) {
    this.component = component;
    this.balance = balance;
  }
  render(width) {
    const lines = this.component.render(width);
    const previous = this.balance.partial;
    if (!previous || previous.width !== width || lines.length >= previous.rows) {
      this.balance.partial = {
        component: this.component,
        width,
        rows: lines.length
      };
    }
    return lines;
  }
  invalidate() {
    this.component.invalidate?.();
  }
};

// src/output-budget.ts
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path5 from "node:path";
var MAX_FAILURE_MODEL_OUTPUT_CHARS = 2e4;
var modelOutputBudget = (configuredMaxChars, success) => success ? configuredMaxChars : Math.min(configuredMaxChars, MAX_FAILURE_MODEL_OUTPUT_CHARS);
var writeOutputArtifact = async (content) => {
  const directory = await mkdtemp(path5.join(tmpdir(), "pi-fabric-output-"));
  const artifactPath = path5.join(directory, "output.txt");
  await writeFile(artifactPath, content, { encoding: "utf8", mode: 384 });
  return artifactPath;
};
var boundModelOutput = async (visible, maxChars, fullOutput = visible, writeArtifact = writeOutputArtifact) => {
  if (visible.length <= maxChars && fullOutput.length <= maxChars) {
    return { text: visible, originalChars: fullOutput.length, omittedChars: 0 };
  }
  let artifactPath;
  try {
    artifactPath = await writeArtifact(fullOutput);
  } catch {
    artifactPath = void 0;
  }
  const suffix = artifactPath ? `

[Full output (${fullOutput.length} chars) saved to: ${artifactPath}]` : "";
  const bodyBudget = Math.max(1, maxChars - suffix.length);
  const text = `${truncateMiddle(visible, bodyBudget)}${suffix}`;
  return {
    text: text.length <= maxChars ? text : truncateMiddle(text, maxChars),
    ...artifactPath ? { artifactPath } : {},
    originalChars: fullOutput.length,
    omittedChars: Math.max(0, fullOutput.length - Math.min(fullOutput.length, bodyBudget))
  };
};

// src/fabric-exec-tool.ts
var defineTool = (tool) => tool;
var RESULT_FORMATS = ["auto", "yaml", "json", "text"];
var MAX_FABRIC_CODE_TRANSFER_LINES = 12;
var toolDisplayMode = (state) => state.bootstrapped ? state.config.ui.toolDisplay : "full";
var compactResultHeader = (theme, audits, failed) => {
  const failedCalls = audits.filter((audit) => audit.success === false).length;
  const isFailed = failed || failedCalls > 0;
  return theme.fg(isFailed ? "error" : "success", `${isFailed ? "\u2717" : "\u2713"} Tools`) + theme.fg(
    "dim",
    ` \xB7 ${countLabel(audits.length, "call")}${failedCalls > 0 ? ` \xB7 ${failedCalls} failed` : ""}`
  );
};
var countLabel = (count, singular) => `${count} ${count === 1 ? singular : `${singular}s`}`;
var createFabricExecTool = (state, codePreviewSettings, pendingHandoffs, decorateShell = withCodePreviewShell, toolDisplay) => decorateShell(
  defineTool({
    name: "fabric_exec",
    label: "Fabric",
    description: "Execute type-checked TypeScript through Fabric's configured executor for Pi core tools, MCP, Fabric providers, discovery, and extensions. QuickJS is isolated by default; the optional Node/Bun process is an unsafe trusted-code escape hatch. In full code mode, and always in Schema enforce mode, this is the exclusive model tool path.",
    promptSnippet: "Pi core tools, MCP, Fabric providers, discovery, and extensions",
    promptGuidelines: [
      "Batch independent operations in one `fabric_exec` program (`Promise.all` for parallel, sequential `await` for ordered), not one call per tool; keep dependent/conditional steps sequential. Coalesce non-dependent replacements from one file snapshot into one `pi.edit({path, edits:[...]})`; use `all:true` only for intentional repeated exact anchors. Return only the compact final value; intermediate results stay in the sandbox.",
      "Search before reading: use `pi.grep`/`pi.find` to locate relevant lines, then `pi.read({path, offset, limit})` that range. Escape regex metacharacters, or use `literal:true` for exact punctuated text. Keep fan-out search limits small and widen only on misses. An unbounded `pi.read` returns at most 2000 lines or 50KB and, when truncated, ends with a `Use offset=\u2026` continuation notice; reserve whole-file reads for small files you will use in full.",
      "For coding tasks, keep an acceptance ledger: turn the request into concrete checks, trace the relevant execution path before editing, implement end to end, then run targeted tests and direct behavioral probes. Mechanically confirm requested public symbols, registrations, and configuration entries. Use the smallest checks that cover the ledger, escalating only for failures or cross-cutting risk; inspect failures and iterate instead of rerunning unchanged passing checks. A build alone is not completion.",
      "Amortize round trips without inflating context: batch only independent, bounded work. Keep search\u2192read and edit\u2192verify sequential when an output determines the next action. Use `settle:true` for tests or probes whose nonzero result is evidence rather than an exceptional stop; for a known long suite, set `pi.bash` `timeout` in seconds once instead of retrying a timed-out call. Filter or summarize noisy command output inside the program and return decisions, failures, and evidence\u2014not raw logs or unused intermediate results.",
      "For multiline edits/writes, pass named payloads through top-level `payloads` and use `\u03C0.key`; prefer `pi.edit`/`pi.write`. `pi.bash`: no stdin.",
      "Use `display.name` and objective `display.description`; Fabric pairs them with verified outcomes in deterministic compaction."
    ],
    // The model-facing schema is intentionally flat: one large `code` string
    // plus scalar/optional params. Do not add nested arrays-of-objects with
    // escaped content here. SOTA models are post-trained on one dominant
    // harness's flat tool shapes and can invent trailing keys at the
    // highest-entropy point of a nested escaped-JSON field, which a strict
    // schema hard-rejects. Keep this surface string/scalar-heavy; the only
    // nested field (display) ignores unknown keys. See
    // lucumr.pocoo.org/2026/7/4/better-models-worse-tools/ and pi-tool-repair.
    // display also accepts a bare (or JSON-object) string, silently repaired
    // to { name } via normalizeRunDisplay: flash-tier models cold-start with
    // that near-miss, and repairing beats a zero-work rejection round trip.
    // payloads is the remaining nested map (legacy alias: strings). The old
    // name collides with the JSON string type, so models stringify it;
    // prepareArguments remaps `strings` and parses a JSON-object string
    // back to Record<string, string> before Pi validates.
    parameters: Type.Object({
      code: Type.String({
        description: "TypeScript function body. Top-level await and return are supported. Globals include `tools`, `mcp`, `memory`, `state`, `schema`, `compact`, `agents`, `mesh`, `print`, and `\u03C0`; full-code mode adds `pi` and `extensions`. See session guidance / `fabric-exec` skill for exact signatures."
      }),
      payloads: Type.Optional(
        Type.Record(Type.String(), Type.String(), {
          description: "Named payloads exposed as \u03C0.key, useful for content that is awkward to quote inside code. Prefer an object of string values; a JSON-object string is parsed."
        })
      ),
      resultFormat: Type.Optional(Type.Union(RESULT_FORMATS.map((value) => Type.Literal(value)))),
      tokenBudget: Type.Optional(
        Type.Number({
          minimum: 1,
          description: "Optional token budget observed by workflow.agent() calls"
        })
      ),
      agentBudget: Type.Optional(
        Type.Number({
          minimum: 1,
          description: "Optional agent-call cap, bounded by Fabric configuration"
        })
      ),
      timeoutMs: Type.Optional(
        Type.Number({
          minimum: 1,
          description: "Optional whole-program deadline in ms for this invocation; raises (never lowers) the configured executor.timeoutMs, capped by executor.maxTimeoutMs"
        })
      ),
      display: Type.Optional(
        Type.Union([
          Type.Object(
            {
              name: Type.Optional(
                Type.String({
                  description: "Concise execution milestone used by the Fabric activity UI and deterministic compaction continuity"
                })
              ),
              description: Type.Optional(
                Type.String({
                  description: "Compact declared objective or acceptance criterion shown in the dashboard and richer compaction activity"
                })
              )
            }
          ),
          Type.String({
            description: "Objective shorthand normalized to { name } (a JSON-object string is parsed). Prefer the object form when available."
          })
        ])
      )
    }),
    // Pi validates custom-tool arguments before `tool_call` and `execute`, so
    // compatibility coercions for the model-facing boundary must live in the
    // official prepareArguments hook rather than execute-time fallbacks.
    prepareArguments(args) {
      return prepareFabricExecArguments(args);
    },
    renderCall(params, theme, context) {
      observePiTheme(theme);
      const code = Array.isArray(params.code) ? params.code.join("\n") : params.code;
      const mode = toolDisplayMode(state);
      const rendererState = context.state;
      toolDisplay?.observe(context.toolCallId, "call", context.invalidate);
      const spinner = updateSpinner(
        rendererState.fabricSpinner ??= {},
        context.isPartial,
        context.invalidate
      );
      const rowBalance = rendererState.fabricResultRowBalance ??= {};
      if (rendererState.fabricWriteBindingsCode !== code) {
        rendererState.fabricWriteBindingsCode = code;
        rendererState.fabricWriteBindings = fabricWriteBindings(code);
      }
      const writePreview = context.executionStarted || !context.isPartial ? null : renderFabricWriteArgumentPreview(
        {
          bindings: rendererState.fabricWriteBindings ?? [],
          strings: resolveFabricExecPayloads(params),
          expanded: context.expanded,
          cwd: context.cwd,
          settings: codePreviewSettings,
          spinner
        },
        theme,
        context.invalidate
      );
      if (mode === "compact" && !context.expanded) {
        const display = normalizeRunDisplay(params.display);
        const title2 = display?.name?.trim() || fabricExecTitleHintCached(code);
        const header = renderBoundedLines(
          [
            theme.fg("toolTitle", theme.bold(safeTerminalText(title2 || "Fabric"))),
            ...display?.description ? [theme.fg("dim", safeTerminalText(display.description))] : []
          ],
          theme,
          codePreviewSettings.diffIntensity
        );
        if (!writePreview) return header;
        const composite2 = new Container2();
        composite2.addChild(header);
        composite2.addChild(new Text2("\n", 0, 0));
        composite2.addChild(writePreview);
        return composite2;
      }
      const lines = safeTerminalText(code).split("\n");
      const runDisplay = normalizeRunDisplay(params.display);
      const displayName = runDisplay?.name ? safeTerminalText(runDisplay.name) : "";
      const title = `${theme.fg("toolTitle", theme.bold("fabric"))}${displayName ? ` ${theme.fg("accent", displayName)}` : ""} ${theme.fg("dim", `TypeScript \xB7 ${countLabel(lines.length, "line")}`)}`;
      const description = runDisplay?.description ? theme.fg("dim", safeTerminalText(runDisplay.description)) : "";
      const baseLimit = context.expanded ? lines.length : Math.min(lines.length, 8);
      const maxLimit = context.expanded ? lines.length : Math.min(lines.length, baseLimit + MAX_FABRIC_CODE_TRANSFER_LINES);
      const renderCodePreview = (limit, width) => {
        const shown = lines.slice(0, limit);
        const lineNumberWidth = String(Math.max(1, shown.length)).length;
        const preview = shown.map(
          (line, index) => `${theme.fg("dim", String(index + 1).padStart(lineNumberWidth, " "))} ${theme.fg("muted", line || " ")}`
        ).join("\n");
        const hidden = lines.length - shown.length;
        const hiddenHint = hidden > 0 ? `
${theme.fg("dim", `\u2026 ${countLabel(hidden, "line")} hidden \xB7 `)}${expandHint(theme)}` : "";
        return new Text2(
          `${title}${description ? `
${description}` : ""}${preview ? `
${preview}` : ""}${hiddenHint}`,
          0,
          0
        ).render(width);
      };
      const codePreview = new HiddenRowBorrowingComponent(
        baseLimit,
        maxLimit,
        renderCodePreview,
        rowBalance
      );
      if (!writePreview) return codePreview;
      const composite = new Container2();
      composite.addChild(codePreview);
      composite.addChild(new Text2("\n", 0, 0));
      composite.addChild(writePreview);
      return composite;
    },
    renderResult(result, { expanded, isPartial }, theme, context) {
      observePiTheme(theme);
      const details = readFabricExecutionRenderDetails(result.details);
      let audits = restoreLegacyBashCommands(
        details.audits,
        context.args
      );
      const rendererState = context.state;
      toolDisplay?.observe(context.toolCallId, "result", context.invalidate);
      const spinner = updateSpinner(
        rendererState.fabricSpinner ??= {},
        isPartial,
        context.invalidate
      );
      const rowBalance = rendererState.fabricResultRowBalance ??= {};
      const trackRows = (component) => observeResultRows(
        inheritComponentBackground(component),
        rowBalance,
        { expanded, isPartial }
      );
      if (isPartial) {
        rendererState.fabricCoreToolPreviews = captureFabricCoreToolPreviews(
          audits,
          rendererState.fabricCoreToolPreviews
        );
        rendererState.fabricAgentPreviews = captureFabricAgentPreviews(
          audits,
          rendererState.fabricAgentPreviews
        );
        const headlinePreviews = captureFabricCallHeadlinePreviews(audits);
        if (headlinePreviews.length > 0) {
          rendererState.fabricCallHeadlinePreviews = headlinePreviews;
        }
        const writePreviews = captureFabricWritePreviews(audits);
        if (writePreviews.length > 0) rendererState.fabricWritePreviews = writePreviews;
      } else {
        if (rendererState.fabricCoreToolPreviews) {
          audits = restoreFabricCoreToolPreviews(
            audits,
            rendererState.fabricCoreToolPreviews
          );
        }
        if (rendererState.fabricAgentPreviews) {
          audits = restoreFabricAgentPreviews(audits, rendererState.fabricAgentPreviews);
        }
        if (rendererState.fabricCallHeadlinePreviews) {
          audits = restoreFabricCallHeadlinePreviews(
            audits,
            rendererState.fabricCallHeadlinePreviews
          );
        }
        if (rendererState.fabricWritePreviews) {
          audits = restoreFabricWritePreviews(audits, rendererState.fabricWritePreviews);
        }
      }
      const phases = details.phases;
      const nl = "\n";
      const allRowIndexes = (lines, enabled) => enabled ? new Set(lines.map((_line, index) => index)) : void 0;
      const compact = !expanded && toolDisplayMode(state) === "compact";
      const corePreviewContext = { cwd: context.cwd, settings: codePreviewSettings };
      const showAgentToolPreview = state.initialized ? state.config.ui.showAgentToolPreview : DEFAULT_FABRIC_CONFIG.ui.showAgentToolPreview;
      const renderBody = (audit, limit) => {
        const core = renderCoreToolBody(audit, theme, {
          cwd: context.cwd,
          settings: codePreviewSettings,
          expanded,
          maxLines: limit,
          ...context?.invalidate ? { invalidate: context.invalidate } : {}
        });
        if (core) return { body: core.lines.join(nl), hidden: core.hidden };
        if (coreToolRendererEnabled(audit, codePreviewSettings)) return null;
        const body = nestedCallBody(audit);
        if (!body) return null;
        const bodyLines = safeTerminalText(body).split(nl);
        while (bodyLines.length > 0) {
          const last = bodyLines[bodyLines.length - 1];
          if (last === void 0 || last.trim() === "") bodyLines.pop();
          else break;
        }
        if (bodyLines.length === 0) return null;
        const shown = bodyLines.slice(0, limit);
        return {
          body: shown.map((line) => theme.fg("toolOutput", line || " ")).join(nl),
          hidden: bodyLines.length - shown.length
        };
      };
      if (isPartial) {
        const progress = details.progress;
        if (audits.length === 0) {
          const label = compact ? "Running\u2026" : progress ?? "Running Fabric program\u2026";
          return trackRows(
            new Text2(theme.fg("warning", `\u25C6 ${safeTerminalText(label)}`), 0, 0)
          );
        }
        if (audits.length === 1) {
          const audit = audits[0];
          const glyph = audit.success === void 0 ? theme.fg("warning", spinner) : audit.success === false ? theme.fg("error", "\u2717") : theme.fg("dim", "\u203A");
          let text2 = `${glyph} ${nestedCallTitle(audit, theme, context?.invalidate, corePreviewContext)}`;
          const previewLines = renderAgentToolPreviewLines(audit, theme, {
            expanded,
            showTools: showAgentToolPreview,
            core: corePreviewContext,
            ...context?.invalidate ? { invalidate: context.invalidate } : {}
          });
          const progressLine = singleCallProgressLine(progress, previewLines);
          if (audit.success === false && audit.error) {
            text2 += nl + `  ${theme.fg("error", safeTerminalText(audit.error))}`;
          } else {
            const rendered = renderBody(
              audit,
              expanded || coreToolRendererEnabled(audit, codePreviewSettings) ? 200 : 10
            );
            if (rendered) {
              text2 += nl + rendered.body;
              if (rendered.hidden > 0) {
                text2 += nl + theme.fg("dim", `\u2026 ${countLabel(rendered.hidden, "line")}`);
                if (!expanded) text2 += theme.fg("dim", " \xB7 ") + expandHint(theme);
              }
            } else if (isCoreToolAudit(audit) && !expanded && !coreToolPreviewEnabled(audit, codePreviewSettings)) {
              text2 += nl + arcItemStyled(theme, expandHint(theme));
            } else if (progressLine) {
              text2 += nl + theme.fg("dim", progressLine);
            }
          }
          if (audit.success !== false && previewLines[0]) {
            const firstBreak = text2.indexOf(nl);
            if (firstBreak < 0) text2 += ` ${previewLines[0]}`;
            else text2 = `${text2.slice(0, firstBreak)} ${previewLines[0]}${text2.slice(firstBreak)}`;
            if (previewLines.length > 1) text2 += nl + previewLines.slice(1).join(nl);
          }
          const textLines = text2.split(nl);
          return trackRows(
            renderBoundedLines(
              textLines,
              theme,
              codePreviewSettings.diffIntensity,
              allRowIndexes(textLines, previewLines.length > 0)
            )
          );
        }
        let preview;
        for (let index = audits.length - 1; index >= 0; index--) {
          const audit = audits[index];
          if (audit.tool !== "write" && audit.tool !== "edit" || audit.success === false) continue;
          const rendered = renderBody(audit, expanded ? 20 : 10);
          if (rendered) {
            preview = { auditIndex: index, ...rendered };
            break;
          }
        }
        return trackRows(
          renderFabricMulticallPartial(
            {
              audits,
              phases,
              progress,
              expanded,
              preview,
              core: corePreviewContext,
              showAgentToolPreview,
              spinner,
              ...compact ? { activityLabel: "Tools" } : {}
            },
            theme,
            context?.invalidate
          )
        );
      }
      const output = result.content.filter((part) => part.type === "text").map((part) => part.text).join(nl);
      const styleOutputLines = (lines) => {
        if (!details.outputFormat || lines.length === 0) {
          return lines.map((line) => theme.fg("toolOutput", line || " "));
        }
        const highlightedStart = Math.min(
          lines.length,
          details.outputFormatStartLine ?? 0
        );
        const highlightedCount = Math.min(
          lines.length - highlightedStart,
          details.outputFormatLines ?? lines.length
        );
        const highlightedSource = lines.slice(
          highlightedStart,
          highlightedStart + highlightedCount
        );
        const highlighted = highlightedSource.length > 0 ? highlightCode(
          highlightedSource.join(nl),
          details.outputFormat,
          context?.invalidate
        ) : [];
        const styledPrefix = highlighted?.map((line) => line || " ") ?? highlightedSource.map((line) => theme.fg("toolOutput", line || " "));
        return [
          ...lines.slice(0, highlightedStart).map((line) => theme.fg("toolOutput", line || " ")),
          ...styledPrefix,
          ...lines.slice(highlightedStart + highlightedCount).map((line) => theme.fg("toolOutput", line || " "))
        ];
      };
      const failed = details.success === false;
      if (audits.length === 0) {
        if (failed && details.error) {
          return trackRows(
            new Text2(
              theme.fg("error", `\u2717 ${safeTerminalText(details.error)}`),
              0,
              0
            )
          );
        }
        if (!output) {
          return trackRows(new Text2(
            compact ? theme.fg(failed ? "error" : "success", failed ? "\u2717 Failed" : "\u2713 Evaluated") : theme.fg("dim", "\u2713 Fabric"),
            0,
            0
          ));
        }
        const lines = safeTerminalText(output).split(nl);
        const limit = expanded ? Math.min(lines.length, 200) : 12;
        const shown = lines.slice(0, limit);
        let text2 = styleOutputLines(shown).join(nl);
        if (compact) {
          text2 = theme.fg(failed ? "error" : "success", failed ? "\u2717 Failed" : "\u2713 Evaluated") + nl + text2;
        }
        if (lines.length > shown.length) {
          text2 += nl + theme.fg("dim", `\u2026 ${countLabel(lines.length - shown.length, "line")}`);
          if (!expanded) text2 += theme.fg("dim", " \xB7 ") + expandHint(theme);
        }
        return trackRows(
          renderBoundedLines(text2.split(nl), theme, codePreviewSettings.diffIntensity)
        );
      }
      if (audits.length === 1) {
        const audit = audits[0];
        let text2 = compact ? `${compactResultHeader(theme, audits, failed)}${nl}${nestedCallTitle(
          audit,
          theme,
          context?.invalidate,
          corePreviewContext
        )}` : nestedCallTitle(audit, theme, context?.invalidate, corePreviewContext);
        const previewLines = renderAgentToolPreviewLines(audit, theme, {
          expanded,
          showTools: showAgentToolPreview,
          core: corePreviewContext,
          ...context?.invalidate ? { invalidate: context.invalidate } : {}
        });
        if (audit.success === false) {
          if (audit.error) {
            text2 += nl + theme.fg("error", safeTerminalText(audit.error));
          }
          return trackRows(new Text2(text2, 0, 0));
        }
        if (previewLines[0]) {
          text2 += ` ${previewLines[0]}`;
          if (previewLines.length > 1) text2 += nl + previewLines.slice(1).join(nl);
        }
        const limit = expanded || coreToolRendererEnabled(audit, codePreviewSettings) ? 200 : 12;
        const rendered = previewLines.length > 0 ? null : renderBody(audit, limit);
        if (rendered) {
          text2 += nl + rendered.body;
          if (rendered.hidden > 0) {
            text2 += nl + theme.fg("dim", `\u2026 ${countLabel(rendered.hidden, "line")}`);
            if (!expanded) text2 += theme.fg("dim", " \xB7 ") + expandHint(theme);
          }
          const readHint2 = modelReadHint(audits, output, theme);
          if (readHint2) text2 += nl + readHint2;
        } else if (isCoreToolAudit(audit) && !expanded && !coreToolPreviewEnabled(audit, codePreviewSettings)) {
          text2 += nl + arcItemStyled(theme, expandHint(theme));
        } else if (previewLines.length === 0 && output && !isCoreToolAudit(audit) && (!compact || failed || expanded)) {
          const lines = safeTerminalText(output).split(nl);
          const outLimit = expanded ? Math.min(lines.length, 200) : 12;
          const outShown = lines.slice(0, outLimit);
          text2 += nl + styleOutputLines(outShown).join(nl);
          if (lines.length > outShown.length) {
            text2 += nl + theme.fg("dim", `\u2026 ${countLabel(lines.length - outShown.length, "line")}`);
            if (!expanded) text2 += theme.fg("dim", " \xB7 ") + expandHint(theme);
          }
        }
        const textLines = text2.split(nl);
        return trackRows(
          renderBoundedLines(
            textLines,
            theme,
            codePreviewSettings.diffIntensity,
            allRowIndexes(textLines, previewLines.length > 0)
          )
        );
      }
      const failedCalls = audits.filter(
        (audit) => audit.success === false
      ).length;
      const status = failed ? "failed" : "complete";
      const statusColor = failed ? "error" : "success";
      const metadata = [
        countLabel(audits.length, "nested call"),
        failedCalls > 0 ? `${failedCalls} failed` : void 0,
        phases.length > 0 ? countLabel(phases.length, "phase") : void 0
      ].filter((value) => Boolean(value));
      let text = compact ? compactResultHeader(theme, audits, failed) : theme.fg(
        statusColor,
        `${failed ? "\u2717" : "\u2713"} Fabric ${status}`
      );
      if (!compact && metadata.length > 0) text += theme.fg("dim", ` \xB7 ${metadata.join(" \xB7 ")}`);
      if (phases.length > 0)
        text += nl + theme.fg("dim", phases.map((phase) => `\u25C6 ${phase}`).join("  "));
      const callLimit = fabricMulticallCallLimit(expanded);
      const callsShown = audits.slice(0, callLimit);
      const callsHidden = audits.length - callsShown.length;
      let collapsedPreview;
      if (!expanded) {
        for (let index = callsShown.length - 1; index >= 0; index--) {
          const audit = callsShown[index];
          if (audit.tool !== "write" && audit.tool !== "edit" || audit.success === false) continue;
          const rendered = renderBody(audit, 10);
          if (rendered) {
            collapsedPreview = { auditIndex: index, ...rendered };
            break;
          }
        }
      }
      let firstNested = true;
      const textRows = text.split(nl);
      const agentWrapLineIndexes = /* @__PURE__ */ new Set();
      for (let index = 0; index < callsShown.length; index++) {
        const audit = callsShown[index];
        if (expanded && !firstNested) textRows.push("");
        firstNested = false;
        const glyph = audit.success === false ? theme.fg("error", "\u2717") : theme.fg("dim", "\u203A");
        const previewLines = renderAgentToolPreviewLines(audit, theme, {
          expanded,
          compact: !expanded,
          showTools: showAgentToolPreview,
          core: corePreviewContext,
          ...context?.invalidate ? { invalidate: context.invalidate } : {}
        });
        let callRow = `${glyph} ${nestedCallTitle(audit, theme, context?.invalidate, corePreviewContext)}`;
        if (previewLines[0] && audit.success !== false) {
          callRow += ` ${previewLines[0]}`;
          if (expanded) agentWrapLineIndexes.add(textRows.length);
        }
        textRows.push(callRow);
        if (audit.success === false && audit.error) {
          textRows.push(`  ${theme.fg("error", safeTerminalText(audit.error))}`);
        } else {
          if (previewLines.length > 1) {
            for (const line of previewLines.slice(1)) {
              agentWrapLineIndexes.add(textRows.length);
              textRows.push(line);
            }
          }
          const rendered = previewLines.length === 0 && expanded ? renderBody(audit, 40) : null;
          if (rendered) {
            textRows.push(...rendered.body.split(nl));
            if (rendered.hidden > 0) {
              textRows.push(theme.fg("dim", `\u2026 ${countLabel(rendered.hidden, "line")}`));
            }
          } else if (previewLines.length === 0 && collapsedPreview?.auditIndex === index) {
            textRows.push(...collapsedPreview.body.split(nl).map((line) => `  ${line}`));
            if (collapsedPreview.hidden > 0) {
              textRows.push(theme.fg(
                "dim",
                `  \u2026 ${countLabel(collapsedPreview.hidden, "line")}`
              ));
            }
          }
        }
      }
      text = textRows.join(nl);
      if (callsHidden > 0) {
        text += nl + theme.fg("dim", `\u2026 ${countLabel(callsHidden, "nested call")} hidden`);
        if (!expanded) text += theme.fg("dim", " \xB7 ") + expandHint(theme);
      }
      const readHint = modelReadHint(audits, output, theme);
      if (readHint) text += nl + readHint;
      const showOutput = failed || expanded;
      if (showOutput && output) {
        const lines = safeTerminalText(output).split(nl);
        const limit = expanded ? Math.min(lines.length, 200) : 6;
        const shown = lines.slice(0, limit);
        if (shown.length > 0) {
          if (expanded) text += nl + theme.fg("dim", "\u21A9 return");
          text += nl + styleOutputLines(shown).join(nl);
          if (lines.length > shown.length) {
            text += nl + theme.fg("dim", `\u2026 ${countLabel(lines.length - shown.length, "line")} hidden`);
            if (!expanded) text += theme.fg("dim", " \xB7 ") + expandHint(theme);
          }
        }
      }
      return trackRows(
        renderBoundedLines(
          text.split(nl),
          theme,
          codePreviewSettings.diffIntensity,
          agentWrapLineIndexes
        )
      );
    },
    async execute(toolCallId, params, signal, onUpdate, context) {
      await state.ensure(context);
      const joined = Array.isArray(params.code) ? params.code.join("\n") : params.code;
      const code = repairFabricGuestCode(joined);
      const runDisplay = normalizeRunDisplay(params.display);
      const strings = resolveFabricExecPayloads(params);
      const result = await state.execution.execute({
        code,
        ...strings ? { strings } : {},
        signal,
        parentToolCallId: toolCallId,
        context,
        ...params.tokenBudget !== void 0 ? { tokenBudget: params.tokenBudget } : {},
        ...params.agentBudget !== void 0 ? { maxAgentCalls: params.agentBudget } : {},
        ...params.timeoutMs !== void 0 ? { requestedTimeoutMs: params.timeoutMs } : {},
        ...runDisplay ? {
          display: {
            ...runDisplay.name !== void 0 && { name: runDisplay.name },
            ...runDisplay.description !== void 0 && { description: runDisplay.description }
          }
        } : {},
        onPartial(snapshot) {
          onUpdate?.({
            content: [{ type: "text", text: snapshot.progress ?? "" }],
            details: {
              progress: snapshot.progress,
              audits: snapshot.audits,
              phases: snapshot.phases
            }
          });
        }
      });
      const selectedResultFormat = params.resultFormat ?? state.config.executor.resultFormat;
      const pendingHandoff = await state.claimHandoff(
        result,
        context.sessionManager.getSessionId(),
        selectedResultFormat,
        toolCallId
      );
      if (pendingHandoff) {
        pendingHandoffs.set(toolCallId, pendingHandoff);
        context.ui.setStatus(
          "fabric-prewalk",
          `waiting for fabric_exec boundary \u2192 ${String(pendingHandoff.args.model ?? "executor")}`
        );
      }
      const fullFormattedValue = formatFabricValue(result.value, selectedResultFormat);
      const failureProgress = formatFailureProgress(result.trace);
      const fullSections = [...result.logs];
      if (fullFormattedValue.text) fullSections.push(fullFormattedValue.text);
      if (result.error) fullSections.push(`Runtime error: ${result.error}`);
      if (failureProgress) fullSections.push(failureProgress);
      const fullRawOutput = fullSections.join("\n\n");
      const outputBudget = modelOutputBudget(
        state.config.executor.maxOutputChars,
        result.success
      );
      const outputWillTruncate = fullRawOutput.length > outputBudget;
      const formattedValue = outputWillTruncate ? formatFabricValue(
        result.value,
        selectedResultFormat,
        outputBudget
      ) : fullFormattedValue;
      const sections = [...result.logs];
      const logPrefix = result.logs.join("\n\n");
      if (formattedValue.text) sections.push(formattedValue.text);
      if (result.error) sections.push(`Runtime error: ${result.error}`);
      if (failureProgress) sections.push(failureProgress);
      const rawOutput = sections.join("\n\n");
      const outputFormat = formattedValue.language && formattedValue.text && (result.logs.length === 0 || !outputWillTruncate) ? formattedValue.language : void 0;
      const outputFormatStartLine = result.logs.length > 0 ? countNewlines(logPrefix) + 2 : 0;
      const persistedRenderDetails = () => createFabricPersistedExecutionDetails({
        ...result,
        ...outputFormat ? { outputFormat, outputFormatStartLine } : {},
        ...outputFormat ? {
          outputFormatLines: formattedValue.highlightedLineCount ?? countNewlines(formattedValue.text) + 1
        } : {}
      });
      if (result.typeErrors) {
        const text = result.typeErrors.map(
          (error) => error.line > 0 ? `Line ${error.line}:${error.column} \u2014 ${error.message}` : error.message
        ).join("\n");
        const recoveryHint = typeErrorRecoveryHint(code, result.typeErrors);
        const bounded = await boundModelOutput(
          `Type errors; code was not executed:
${text}${recoveryHint ? `

${recoveryHint}` : ""}`,
          outputBudget
        );
        return {
          content: [{ type: "text", text: bounded.text }],
          details: persistedRenderDetails(),
          isError: true
        };
      }
      const output = (await boundModelOutput(
        rawOutput || "(no output)",
        outputBudget,
        fullRawOutput || "(no output)"
      )).text;
      const terminate = pendingHandoff !== void 0 || result.success && typeof result.value === "object" && result.value !== null && "terminate" in result.value && result.value.terminate === true;
      const mediaBlocks = [];
      for (const audit of result.audits) {
        if (audit.media) mediaBlocks.push(...audit.media);
      }
      const singleAudit = result.audits.length === 1 ? result.audits[0] : void 0;
      const mediaNote = singleAudit?.mediaNote;
      for (const audit of result.audits) {
        delete audit.media;
        delete audit.mediaNote;
      }
      const content = [];
      if (mediaBlocks.length > 0) {
        const textOutput = singleAudit && mediaNote ? mediaNote : output === "(no output)" ? "" : output;
        if (textOutput) content.push({ type: "text", text: textOutput });
        for (const block of mediaBlocks) content.push(block);
        if (singleAudit && mediaNote) {
          singleAudit.result = mediaNote;
        }
      } else {
        content.push({ type: "text", text: output });
      }
      return {
        content,
        details: persistedRenderDetails(),
        ...result.usage ? { usage: result.usage } : {},
        ...terminate ? { terminate: true } : {},
        ...result.success ? {} : { isError: true }
      };
    }
  }),
  {
    mode: codePreviewSettings.toolCallBackground,
    toolCallTiming: codePreviewSettings.toolCallTiming
  }
);

// src/fabric-state.ts
import fs2 from "node:fs";
import path6 from "node:path";
var FabricState = class {
  constructor(pi, capturedTools, options = {}) {
    this.pi = pi;
    this.capturedTools = capturedTools;
    this.#options = options;
  }
  #runtime;
  #activatingRuntime;
  #activation;
  #activationGeneration;
  #config;
  #cwd;
  #generation = 0;
  #everActivated = false;
  #activationHook;
  #activationFailureHook;
  #externalProviders = /* @__PURE__ */ new Map();
  #externalComponents = /* @__PURE__ */ new Map();
  #options;
  activity = new FabricActivityStore();
  prewalk = new PrewalkController();
  prewalkDrift = new PrewalkDriftTracker();
  sessionApprovals = new FabricSessionApprovals();
  #widgetDismissedAt = 0;
  get initialized() {
    return this.#current()?.initialized === true;
  }
  // Lightweight bootstrap seam: true once configuration is loaded, with no
  // dependency on the heavyweight runtime. Rendering reads this instead of
  // initialized so a resumed session honors bootstrapped presentation
  // preferences while the runtime is intentionally inactive.
  get bootstrapped() {
    return this.#config !== void 0;
  }
  get activated() {
    return this.#everActivated;
  }
  get config() {
    if (!this.#config) throw new Error("Pi Fabric has not bootstrapped");
    return this.#config;
  }
  get cwd() {
    return this.#cwd;
  }
  get widgetDismissedAt() {
    return this.#current()?.widgetDismissedAt ?? this.#widgetDismissedAt;
  }
  set widgetDismissedAt(value) {
    this.#widgetDismissedAt = value;
    const runtime = this.#current();
    if (runtime) runtime.widgetDismissedAt = value;
  }
  get registry() {
    return this.#required().registry;
  }
  get execution() {
    return this.#required().execution;
  }
  /** Speculative-PTC stream tap; undefined pre-init or when speculation is disabled. */
  get speculationTap() {
    return this.#runtime?.speculationTap;
  }
  /** Turn-boundary backstop for the speculation store; safe before initialization. */
  resetSpeculation() {
    this.#runtime?.resetSpeculation();
  }
  get agents() {
    return this.#required().agents;
  }
  get actors() {
    return this.#required().actors;
  }
  get globalActors() {
    return this.#required().globalActors;
  }
  get mesh() {
    return this.#required().mesh;
  }
  get compact() {
    return this.#required().compact;
  }
  get repairs() {
    return this.#required().repairs;
  }
  get components() {
    return this.#required().components;
  }
  setActivationHook(hook, onFailure) {
    this.#activationHook = hook;
    this.#activationFailureHook = onFailure;
  }
  async bootstrap(context) {
    const generation = ++this.#generation;
    this.#cwd = context.cwd;
    this.#config = void 0;
    const config = loadFabricConfig({
      cwd: context.cwd,
      agentDir: resolveAgentDir(),
      projectTrusted: context.isProjectTrusted()
    });
    this.#config = config;
    this.prewalk.cancel();
    this.prewalkDrift.clear();
    this.activity.reset();
    this.sessionApprovals.approvedRisks.clear();
    this.#widgetDismissedAt = 0;
    context.ui.setStatus("fabric-prewalk", void 0);
    const pending = this.#activation;
    if (pending) await pending.catch(() => void 0);
    if (generation !== this.#generation) return;
    if (this.#everActivated) await this.#activate(context, true);
  }
  async initialize(context) {
    if (!this.#config || this.#cwd !== context.cwd) {
      await this.bootstrap(context);
    } else {
      this.#config = loadFabricConfig({
        cwd: context.cwd,
        agentDir: resolveAgentDir(),
        projectTrusted: context.isProjectTrusted()
      });
    }
    await this.#activate(context, true);
  }
  async ensure(context) {
    if (!this.#config || this.#cwd !== context.cwd) await this.bootstrap(context);
    await this.#activate(context, false);
  }
  shouldEagerlyActivate(context) {
    if (process.env.PI_FABRIC_CAPABILITY_REQUIREMENTS !== void 0 && Boolean(process.env.PI_FABRIC_CAPABILITY_DIGEST)) return true;
    if (this.config.prewalk.alwaysRearm) return true;
    if (this.config.components.some((component) => component.disabled !== true)) return true;
    if (!context.isProjectTrusted() || !this.config.mesh.enabled || this.config.schema.mode === "enforce") {
      return false;
    }
    const sessionId = context.sessionManager.getSessionId();
    if (resolveFabricIdentity(sessionId).identity.kind !== "main") return false;
    const projectRoot = process.env.PI_FABRIC_PROJECT_ROOT ?? context.cwd;
    const meshRoot = process.env.PI_FABRIC_MESH_ROOT ?? (this.config.mesh.root ? path6.resolve(projectRoot, this.config.mesh.root) : path6.join(projectRoot, ".pi", "fabric", "mesh"));
    const actorRoot = this.config.mesh.actorScope === "session" ? path6.join(meshRoot, "actors", sessionId) : path6.join(meshRoot, "actors");
    try {
      const registry = JSON.parse(fs2.readFileSync(path6.join(actorRoot, "actors.json"), "utf8"));
      if (typeof registry !== "object" || registry === null || Array.isArray(registry)) return false;
      const actors = registry.actors;
      return Array.isArray(actors) && actors.some((value) => {
        if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
        const actor = value;
        return typeof actor.id === "string" && /^[a-f0-9]{32}$/.test(actor.id) && typeof actor.name === "string" && /^[a-zA-Z0-9][a-zA-Z0-9 _.-]{0,59}$/.test(actor.name) && typeof actor.instructions === "string" && Buffer.byteLength(actor.instructions, "utf8") <= this.config.mesh.maxEventBytes && typeof actor.createdAt === "number" && Number.isFinite(actor.createdAt);
      });
    } catch {
      return false;
    }
  }
  mainAgentInfo(context) {
    return this.#required().mainAgentInfo(context);
  }
  peerInfos() {
    return this.#current()?.peerInfos() ?? [];
  }
  componentGraph() {
    return this.#current()?.componentGraph() ?? { components: [], edges: [], cycles: [] };
  }
  modelGuidance() {
    return this.#current()?.modelGuidance() ?? [];
  }
  participantInfos(options = {}) {
    return this.#current()?.participantInfos(options) ?? [];
  }
  queueUserMessage(targetId, message, delivery) {
    return this.#required().queueUserMessage(targetId, message, delivery);
  }
  stopParticipant(targetId) {
    return this.#required().stopParticipant(targetId);
  }
  claimHandoff(execution, sessionId, resultFormat, outerToolCallId) {
    return this.#required().claimHandoff(execution, sessionId, resultFormat, outerToolCallId);
  }
  runHandoffAtBoundary(pending, result, context) {
    return this.#required().runHandoffAtBoundary(pending, result, context);
  }
  noteMainActivity(context) {
    this.#current()?.noteMainActivity(context);
  }
  dispatchHostEvent(event, payload, context) {
    return this.#current()?.dispatchHostEvent(event, payload, context) ?? 0;
  }
  publishHostLifecycle(event, payload) {
    return this.#current()?.publishHostLifecycle(event, payload) ?? Promise.resolve();
  }
  registerExternal(provider, options = {}) {
    if (provider.name === "fabric" || provider.name === "components" || FABRIC_COMPONENT_PROVIDER_NAMES.some((name) => name === provider.name)) {
      throw new Error(`Reserved Fabric provider name: ${provider.name}`);
    }
    if (this.#externalProviders.has(provider.name) && !options.overwrite) {
      throw new Error(`Fabric provider already registered: ${provider.name}`);
    }
    this.#externalProviders.set(provider.name, provider);
    this.#current()?.registerExternal(provider, options);
  }
  registerExternalComponent(component, options = {}) {
    if (component.name.startsWith(FABRIC_PROVIDER_COMPONENT_PREFIX)) {
      throw new Error(`Reserved Fabric component name: ${component.name}`);
    }
    if (this.#externalComponents.has(component.name) && !options.overwrite) {
      throw new Error(`Fabric component already registered: ${component.name}`);
    }
    this.#externalComponents.set(component.name, component);
    this.#current()?.registerExternalComponent(component, options);
  }
  reloadConfig(context) {
    const next = loadFabricConfig({
      cwd: context.cwd,
      agentDir: resolveAgentDir(),
      projectTrusted: context.isProjectTrusted()
    });
    if (this.#config) {
      next.schema.mode = this.#config.schema.mode;
      if (next.schema.mode === "enforce") next.executor.runtime = this.#config.executor.runtime;
    }
    this.#config = next;
    this.#runtime?.reloadConfig(context, next);
  }
  // Ephemeral, session-only schema mode: mutates the live config (guidance,
  // resolved-action gate, and executor runtime all read it per call) without
  // touching fabric.json, so the next session starts from the configured mode.
  // reloadConfig preserves the override like the startup mode does.
  setSchemaMode(context, mode) {
    if (!this.#config) throw new Error("Fabric is not initialized");
    const previous = this.#config.schema.mode;
    if (mode === "enforce" && previous !== "enforce" && !this.#config.fullCodeMode) {
      throw new Error(
        "Schema enforce requires full code mode; enable fullCodeMode or start a session with schema.mode=enforce"
      );
    }
    this.#config.schema.mode = mode;
    if (mode === "enforce") {
      this.#config.executor.runtime = "quickjs";
    } else if (previous === "enforce") {
      this.#config.executor.runtime = this.#diskConfig(context).executor.runtime;
    }
    this.#runtime?.setSchemaMode(mode, this.#config.executor.runtime);
  }
  schemaStatus(context) {
    const disk = this.#diskConfig(context);
    const mode = this.#config?.schema.mode ?? disk.schema.mode;
    return {
      mode,
      source: this.#config && this.#config.schema.mode !== disk.schema.mode ? "session override" : "config",
      executorRuntime: this.#config?.executor.runtime ?? disk.executor.runtime
    };
  }
  #diskConfig(context) {
    const projectTrusted = context.isProjectTrusted();
    return loadFabricConfigForScope(
      { cwd: context.cwd, agentDir: resolveAgentDir(), projectTrusted },
      projectTrusted ? "project" : "global"
    );
  }
  async shutdown() {
    const generation = ++this.#generation;
    const activation = this.#activation;
    if (activation) await activation.catch(() => void 0);
    if (generation !== this.#generation) return;
    const runtime = this.#runtime;
    this.#runtime = void 0;
    try {
      await runtime?.shutdown();
    } finally {
      if (generation === this.#generation) {
        this.#config = void 0;
        this.#cwd = void 0;
        this.#externalProviders.clear();
        this.#externalComponents.clear();
        this.#everActivated = false;
        this.activity.reset();
        this.prewalk.cancel();
        this.prewalkDrift.clear();
      }
    }
  }
  async #activate(context, reinitialize) {
    if (this.#activation) {
      if (this.#activationGeneration === this.#generation) return this.#activation;
      await this.#activation.catch(() => void 0);
      return this.#activate(context, reinitialize);
    }
    if (this.#runtime?.initialized && !reinitialize) return this.#runtime;
    const generation = this.#generation;
    const config = this.config;
    const existing = this.#runtime;
    const reusable = existing?.initialized ? existing : void 0;
    const orphan = existing && !existing.initialized ? existing : void 0;
    this.#runtime = void 0;
    let candidate;
    const assertCurrent = () => {
      if (generation !== this.#generation) {
        throw new Error("Pi Fabric activation was superseded by a session change");
      }
    };
    const activation = (async () => {
      try {
        await orphan?.shutdown().catch(() => void 0);
        assertCurrent();
        candidate = reusable ?? await this.#createRuntime();
        if (!reusable) {
          for (const component of this.#externalComponents.values()) {
            candidate.registerExternalComponent(component, { overwrite: true });
          }
        }
        await candidate.initialize(context, config);
        assertCurrent();
        for (const provider of this.#externalProviders.values()) {
          candidate.registerExternal(provider, { overwrite: true });
        }
        await candidate.settleComponents?.();
        assertCurrent();
        this.#activatingRuntime = candidate;
        candidate.widgetDismissedAt = this.#widgetDismissedAt;
        await this.#activationHook?.(context);
        assertCurrent();
        this.#runtime = candidate;
        this.#activatingRuntime = void 0;
        this.#everActivated = true;
        return candidate;
      } catch (error) {
        try {
          await this.#activationFailureHook?.();
        } catch {
        }
        if (this.#activatingRuntime === candidate) this.#activatingRuntime = void 0;
        if (candidate) await candidate.shutdown().catch(() => void 0);
        if (this.#runtime === candidate) this.#runtime = void 0;
        throw error;
      }
    })();
    this.#activation = activation;
    this.#activationGeneration = generation;
    void activation.finally(() => {
      if (this.#activation === activation) {
        this.#activation = void 0;
        this.#activationGeneration = void 0;
      }
    }).catch(() => void 0);
    return activation;
  }
  async #createRuntime() {
    const module = await (this.#options.runtimeLoader?.() ?? import("./chunks/fabric-runtime-state-DMGM5HF3.js"));
    return new module.FabricRuntimeState(
      this.pi,
      this.capturedTools,
      {
        activity: this.activity,
        prewalk: this.prewalk,
        prewalkDrift: this.prewalkDrift,
        sessionApprovals: this.sessionApprovals,
        ...this.#options.paths ? { paths: this.#options.paths } : {}
      }
    );
  }
  #current() {
    return this.#runtime ?? this.#activatingRuntime;
  }
  #required() {
    const runtime = this.#current();
    if (!runtime?.initialized) throw new Error("Pi Fabric has not activated");
    return runtime;
  }
};

// src/repairs/classify.ts
var TYPECHECK_HEAD = /type error|type checking failed/i;
var INVALID_ARGS = /Invalid arguments for ([^:]+):\s*(.*)/s;
var UNKNOWN_ACTION = /Unknown Fabric action:\s*(\S+)/i;
var VALIDATION_FAILED = /Validation failed for tool\s+"?fabric_exec"?/i;
var EXACT_TEXT = /could not find the exact text|Could not find edits\[/i;
var RUNTIME_HEAD = /^Runtime error/i;
var ENOENT = /ENOENT|no such file|Path not found/i;
var ARITY = /Expected ([0-9]+)(?:-[0-9]+)? arguments, but got ([0-9]+)/;
var CANNOT_FIND = /Cannot find name '([^']+)'/;
var DISPLAY_OBJECT = /display: must be object/i;
var STRINGS_OBJECT = /strings: must be object/i;
var CODE_REQUIRED = /code: must have required properties/i;
var SHELL_OR_PROSE_NAMES = /* @__PURE__ */ new Set([
  "$",
  "PY",
  "a",
  "and",
  "bash",
  "data",
  "do",
  "document",
  "done",
  "e",
  "echo",
  "f",
  "fi",
  "for",
  "i",
  "if",
  "in",
  "k",
  "len",
  "m",
  "n",
  "name",
  "open",
  "out",
  "p",
  "path",
  "printf",
  "r",
  "s",
  "sh",
  "t",
  "text",
  "the",
  "then",
  "tmp",
  "while",
  "x"
]);
var firstText = (content) => {
  if (typeof content === "string") return content;
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return firstText(content.content);
  }
  if (!Array.isArray(content)) return "";
  return content.map((part) => {
    if (typeof part === "string") return part;
    if (part && typeof part === "object" && typeof part.text === "string") {
      return part.text;
    }
    return "";
  }).join("\n");
};
var extraKeysFromMessage = (message) => {
  const keys = [];
  for (const match of message.matchAll(
    /\/([A-Za-z_][\w$]*): must not have additional properties/g
  )) {
    const key = match[1];
    if (key) keys.push(key);
  }
  return keys;
};
var classifyInvalidArgs = (ref, message, extraKeys = extraKeysFromMessage(message)) => {
  const key = extraKeys[0];
  return {
    stage: "invocation_args",
    fingerprint: key ? `args:${ref}:${key}` : `args:${ref}:${message.slice(0, 80)}`
  };
};
var classifyUnknownAction = (ref) => {
  const trimmed = ref.replace(/[,)]+$/, "").trim();
  return {
    stage: "invocation_unknown_action",
    fingerprint: `unknown:${trimmed}`
  };
};
var classifyTypeErrors = (messages, enclosingTool) => {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const push = (entry) => {
    if (seen.has(entry.fingerprint)) return;
    seen.add(entry.fingerprint);
    out.push(entry);
  };
  for (const message of messages) {
    const arity = ARITY.exec(message);
    if (arity) {
      const expected = Number(arity[1]);
      const got = Number(arity[2]);
      if (got > expected) {
        push({
          stage: "invocation_typecheck",
          fingerprint: enclosingTool ? `typecheck:arity:${expected}<-${got}:${enclosingTool}` : `typecheck:arity:${expected}<-${got}`
        });
        continue;
      }
    }
    const missing = CANNOT_FIND.exec(message);
    if (missing?.[1] && SHELL_OR_PROSE_NAMES.has(missing[1])) {
      push({
        stage: "didactic",
        fingerprint: `didactic:cannot_find:${missing[1]}`
      });
      continue;
    }
    if (missing?.[1]) {
      push({
        stage: "invocation_typecheck",
        fingerprint: `typecheck:cannot_find:${missing[1]}`
      });
      continue;
    }
    push({
      stage: "invocation_typecheck",
      fingerprint: `typecheck:${message.slice(0, 80)}`
    });
  }
  return out.length > 0 ? out : [{ stage: "invocation_typecheck", fingerprint: "typecheck:unparsed" }];
};
var classifyToolResult = (input) => {
  if (!input.isError) return void 0;
  const text = firstText(input.content);
  const head = text.slice(0, 400);
  const tool = input.toolName ?? "?";
  if (VALIDATION_FAILED.test(head)) {
    if (DISPLAY_OBJECT.test(text)) {
      return { stage: "invocation_outer_schema", fingerprint: "outer:display:object" };
    }
    if (STRINGS_OBJECT.test(text)) {
      return { stage: "invocation_outer_schema", fingerprint: "outer:strings:object" };
    }
    if (CODE_REQUIRED.test(text)) {
      return { stage: "didactic", fingerprint: "outer:code:required" };
    }
    return { stage: "invocation_outer_schema", fingerprint: "outer:unparsed" };
  }
  if (TYPECHECK_HEAD.test(head)) {
    const lines = text.split("\n").map((line) => line.replace(/^Line \d+:\d+ — /, "").trim()).filter((line) => line.length > 0 && !/^Type errors?;? code was not executed:?$/i.test(line));
    return classifyTypeErrors(lines)[0];
  }
  const invalid = INVALID_ARGS.exec(text);
  if (invalid?.[1]) return classifyInvalidArgs(invalid[1].trim(), invalid[2] ?? "");
  const unknown = UNKNOWN_ACTION.exec(text);
  if (unknown?.[1]) return classifyUnknownAction(unknown[1]);
  if (EXACT_TEXT.test(text)) return { stage: "effect", fingerprint: `effect:edit_miss:${tool}` };
  if (tool === "bash" || tool === "pi.bash") {
    return { stage: "effect", fingerprint: "effect:bash" };
  }
  if (["read", "write", "edit", "grep", "find", "ls"].includes(tool)) {
    return { stage: "effect", fingerprint: `effect:native:${tool}` };
  }
  if (ENOENT.test(text) || RUNTIME_HEAD.test(head)) {
    return { stage: "effect", fingerprint: `effect:runtime:${tool}` };
  }
  return { stage: "didactic", fingerprint: `other:${tool}` };
};

// src/host-compatibility.ts
import { existsSync as existsSync3, readFileSync as readFileSync3, realpathSync as realpathSync2 } from "node:fs";
import path7 from "node:path";
var MINIMUM_PI_HOST_VERSION = "0.80.6";
var PI_HOST_PACKAGE_NAMES = /* @__PURE__ */ new Set([
  "@earendil-works/pi-coding-agent",
  "@mariozechner/pi-coding-agent"
]);
var parseVersion = (value) => {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/.exec(value.trim());
  if (!match) return void 0;
  return {
    numbers: [Number(match[1]), Number(match[2]), Number(match[3])],
    ...match[4] ? { prerelease: match[4] } : {}
  };
};
var compareVersions = (left, right) => {
  const a = parseVersion(left);
  const b = parseVersion(right);
  if (!a || !b) return void 0;
  for (let index = 0; index < a.numbers.length; index++) {
    const delta = a.numbers[index] - b.numbers[index];
    if (delta !== 0) return Math.sign(delta);
  }
  if (a.prerelease && !b.prerelease) return -1;
  if (!a.prerelease && b.prerelease) return 1;
  if (a.prerelease === b.prerelease) return 0;
  return (a.prerelease ?? "").localeCompare(b.prerelease ?? "");
};
var detectPiHostVersion = (cliPath = process.argv[1]) => {
  if (!cliPath) return void 0;
  let directory;
  try {
    directory = path7.dirname(realpathSync2(cliPath));
  } catch {
    return void 0;
  }
  while (true) {
    const manifestPath = path7.join(directory, "package.json");
    if (existsSync3(manifestPath)) {
      try {
        const manifest = JSON.parse(readFileSync3(manifestPath, "utf8"));
        if (typeof manifest.name === "string" && PI_HOST_PACKAGE_NAMES.has(manifest.name) && typeof manifest.version === "string") {
          return manifest.version;
        }
      } catch {
      }
    }
    const parent = path7.dirname(directory);
    if (parent === directory) return void 0;
    directory = parent;
  }
};
var piHostCompatibilityWarning = (version = detectPiHostVersion()) => {
  if (!version) return void 0;
  const comparison = compareVersions(version, MINIMUM_PI_HOST_VERSION);
  if (comparison === void 0 || comparison >= 0) return void 0;
  return "Pi Fabric requires Pi >= " + MINIMUM_PI_HOST_VERSION + "; detected " + version + ". Actor triggerTurn and other host continuations may be ignored. Upgrade Pi before relying on actor delivery.";
};

// src/ui/controller.ts
import path8 from "node:path";

// src/ui/snapshot.ts
var MAX_UI_AGENTS = 240;
var boundedUiAgents = (local, remote) => {
  const selected = /* @__PURE__ */ new Map();
  for (const agent of local) {
    if (activeStatuses.has(agent.status)) selected.set(agent.id, agent);
  }
  const addNewest = (agents) => {
    for (let index = agents.length - 1; index >= 0 && selected.size < MAX_UI_AGENTS; index--) {
      const agent = agents[index];
      if (agent) selected.set(agent.id, agent);
    }
  };
  addNewest(orderAgentsByCreation(local));
  addNewest(orderAgentsByCreation(remote));
  return orderAgentsByCreation([...selected.values()]);
};
var isRunRecord = (value) => "startedAt" in value;
var numberFrom = (value) => typeof value === "number" && Number.isFinite(value) ? value : void 0;
var stateEntry = (entry) => {
  const value = typeof entry.value === "object" && entry.value !== null && !Array.isArray(entry.value) ? entry.value : void 0;
  const label = safeText(
    value?.title ?? value?.label ?? value?.name ?? value?.task ?? entry.key
  ).slice(0, 160);
  const status = safeText(value?.status ?? value?.state ?? "state").toLowerCase() || "state";
  const owner = safeText(value?.owner ?? value?.claimedBy ?? value?.claimed_by);
  const detail = safeText(
    value?.current ?? value?.activity ?? value?.description ?? value?.summary
  );
  return {
    key: entry.key,
    label: label || entry.key,
    status,
    value: entry.value,
    version: entry.version,
    updatedAt: entry.updatedAt,
    ...owner ? { owner } : {},
    ...detail ? { detail: detail.slice(0, 500) } : {}
  };
};
var createDashboardSnapshot = (state, events, context, activityRuns) => {
  const runs = activityRuns ?? state.activity.runs();
  const agentRecords = typeof state.agents.listForUi === "function" ? state.agents.listForUi() : state.agents.list();
  const agentLinks = [];
  for (const run of runs) {
    for (const call of run.calls) {
      if (call.entityId) agentLinks.push({ runId: run.id, call });
    }
  }
  agentLinks.sort((left, right) => {
    const leftLaunch = left.call.ref === "agents.spawn" || left.call.ref === "agents.run";
    const rightLaunch = right.call.ref === "agents.spawn" || right.call.ref === "agents.run";
    if (leftLaunch !== rightLaunch) return leftLaunch ? -1 : 1;
    return left.call.startedAt - right.call.startedAt;
  });
  const agentFromRecord = (record, nestingDepth, parentId, parent) => {
    const linked = parentId ? void 0 : agentLinks.find(
      ({ call }) => call.entityId && (record.id.startsWith(call.entityId) || call.entityId.startsWith(record.id))
    );
    const base = {
      id: record.id,
      name: record.name,
      status: record.status,
      runner: record.runner,
      transport: record.transport,
      cwd: record.cwd,
      ...!isRunRecord(record) && linked ? { startedAt: linked.call.startedAt } : {},
      ...record.model ? { model: record.model } : {},
      ...record.thinking ? { thinking: record.thinking } : {},
      ...record.attachCommand ? { attachCommand: record.attachCommand } : {},
      ...isRunRecord(record) && record.logFile ? { logFile: record.logFile } : {},
      ...record.branch ? { branch: record.branch } : {},
      ...record.worktree ? { worktree: record.worktree } : {},
      ...record.actorId ? { actorId: record.actorId } : {},
      ...record.actorName ? { actorName: record.actorName } : {},
      ...parentId ? { parentId } : {},
      ...nestingDepth > 0 ? { nestingDepth } : {},
      ...linked ? { runId: linked.runId } : parent?.runId ? { runId: parent.runId } : {},
      ...linked?.call.phaseId ? { phaseId: linked.call.phaseId } : parent?.phaseId ? { phaseId: parent.phaseId } : {}
    };
    if (!isRunRecord(record)) return base;
    return {
      ...base,
      task: record.task,
      startedAt: record.startedAt,
      updatedAt: record.updatedAt,
      ...record.finishedAt !== void 0 ? { finishedAt: record.finishedAt } : {},
      ...record.currentTool ? { currentTool: record.currentTool } : {},
      turns: record.turns,
      toolCalls: record.toolCalls,
      usage: { ...record.usage },
      ...record.text ? { text: record.text } : {},
      ...record.value !== void 0 ? { value: structuredClone(record.value) } : {},
      ...record.error ? { error: record.error } : {}
    };
  };
  const allAgents = [];
  const appendAgent = (record, nestingDepth, parentId, parent) => {
    const agent = agentFromRecord(record, nestingDepth, parentId, parent);
    allAgents.push(agent);
    if (!isRunRecord(record)) return;
    for (const nested of record.nestedAgents ?? []) {
      appendAgent(nested, nestingDepth + 1, record.id, agent);
    }
  };
  for (const record of agentRecords) appendAgent(record, 0);
  const participants = typeof state.participantInfos === "function" ? state.participantInfos({ scope: "project" }) : [];
  const participantById = new Map(participants.map((participant) => [participant.id, participant]));
  const actors = state.actors.list().map((actor) => {
    const participant = participantById.get(actor.id);
    const worker = allAgents.filter((agent) => agent.actorId === actor.id).sort((left, right) => {
      const active = Number(activeStatuses.has(right.status)) - Number(activeStatuses.has(left.status));
      const recency = (numberFrom(right.updatedAt) ?? numberFrom(right.startedAt) ?? 0) - (numberFrom(left.updatedAt) ?? numberFrom(left.startedAt) ?? 0);
      return active || recency;
    })[0];
    return {
      ...actor,
      instructions: state.actors.instructions(actor.id),
      recentMessages: state.actors.messages(actor.id, 12),
      ...participant ? { ownerHostId: participant.ownerHostId, local: participant.local } : {},
      ...worker ? { worker } : {}
    };
  });
  const localAgents = allAgents.filter((agent) => !agent.actorId).map((agent) => {
    const participant = participantById.get(agent.id);
    return participant ? {
      ...agent,
      ...agent.parentId ? {} : participant.parentId ? { parentId: participant.parentId } : {},
      rootId: participant.rootId,
      ownerHostId: participant.ownerHostId,
      local: participant.local,
      stale: participant.stale,
      participantKind: participant.kind,
      ...participant.residency ? { residency: participant.residency } : {},
      capabilities: [...participant.capabilities]
    } : agent;
  });
  const localAgentIds = new Set(localAgents.map((agent) => agent.id));
  const remoteAgents = participants.filter((participant) => participant.kind === "agent" && !localAgentIds.has(participant.id)).map((participant) => ({
    id: participant.id,
    name: participant.name,
    status: participant.status,
    runner: participant.runner,
    transport: participant.transport,
    cwd: participant.cwd ?? "",
    ...participant.model ? { model: participant.model } : {},
    ...participant.thinking ? { thinking: participant.thinking } : {},
    ...participant.currentTool ? { currentTool: participant.currentTool } : {},
    startedAt: participant.startedAt,
    updatedAt: participant.updatedAt,
    ...participant.finishedAt !== void 0 ? { finishedAt: participant.finishedAt } : {},
    ...participant.turns !== void 0 ? { turns: participant.turns } : {},
    ...participant.toolCalls !== void 0 ? { toolCalls: participant.toolCalls } : {},
    ...participant.usage ? { usage: { ...participant.usage } } : {},
    ...participant.parentId ? { parentId: participant.parentId } : {},
    rootId: participant.rootId,
    ownerHostId: participant.ownerHostId,
    local: participant.local,
    stale: participant.stale,
    participantKind: participant.kind,
    ...participant.residency ? { residency: participant.residency } : {},
    capabilities: [...participant.capabilities]
  }));
  const agents = [...localAgents, ...remoteAgents];
  const visibleAgents = boundedUiAgents(localAgents, remoteAgents);
  const activeRunIds = new Set(
    agents.filter((agent) => agent.runId && activeStatuses.has(agent.status)).map((agent) => agent.runId)
  );
  const orderedRuns = runs.map((run, index) => ({ run, index })).sort((left, right) => {
    const leftActive = activeRunIds.has(left.run.id) ? 1 : 0;
    const rightActive = activeRunIds.has(right.run.id) ? 1 : 0;
    return rightActive - leftActive || left.index - right.index;
  }).map(({ run }) => run);
  const meshEntries = state.config.mesh.enabled ? state.mesh.list("", 200) : [];
  const stateEntries = meshEntries.filter(
    (entry) => !entry.key.startsWith("actors/") && !entry.key.startsWith("sessions/") && !entry.key.startsWith("topology/")
  ).map(stateEntry).sort((left, right) => {
    const leftActive = activeStatuses.has(left.status) ? 1 : 0;
    const rightActive = activeStatuses.has(right.status) ? 1 : 0;
    return rightActive - leftActive || right.updatedAt - left.updatedAt;
  }).slice(0, 120);
  return {
    now: Date.now(),
    runs: orderedRuns,
    main: state.mainAgentInfo(context),
    peers: typeof state.peerInfos === "function" ? state.peerInfos() : [],
    participants,
    widgetDismissedAt: state.widgetDismissedAt,
    globalActors: state.globalActors.list(),
    agents: visibleAgents,
    componentGraph: typeof state.componentGraph === "function" ? state.componentGraph() : { components: [], edges: [], cycles: [] },
    actors: actors.sort((left, right) => {
      const leftActive = activeStatuses.has(left.status) ? 1 : 0;
      const rightActive = activeStatuses.has(right.status) ? 1 : 0;
      return rightActive - leftActive || right.updatedAt - left.updatedAt;
    }),
    state: stateEntries,
    events: events.map((event) => structuredClone(event))
  };
};

// src/ui/widget.ts
import { truncateToWidth as truncateToWidth3, visibleWidth as visibleWidth2 } from "@earendil-works/pi-tui";
var statusGlyph = (status) => {
  if (status === "completed" || status === "done") return "\u2713";
  if (status === "failed" || status === "timed_out") return "\u2717";
  if (status === "blocked") return "!";
  if (status === "stopped" || status === "cancelled") return "\u25A0";
  if (status === "queued" || status === "pending" || status === "ready") return "\u25CB";
  if (status === "idle" || status === "state") return "\xB7";
  return spinnerFrame();
};
var colorStatus = (theme, status, value) => {
  if (status === "completed" || status === "done") return theme.fg("success", value);
  if (status === "failed" || status === "timed_out") return theme.fg("error", value);
  if (status === "blocked") return theme.fg("warning", value);
  if (status === "running" || status === "in_progress") return theme.fg("accent", value);
  return theme.fg("dim", value);
};
var phaseProgress = (run, phaseId) => {
  const phase = run.phases.find((candidate) => candidate.id === phaseId);
  const statuses = [
    ...run.calls.filter((call) => call.phaseId === phaseId).map((call) => call.status),
    ...run.items.filter((item) => item.phaseId === phaseId).map((item) => item.status)
  ];
  const completed = statuses.filter((status) => status === "completed").length;
  return { completed, total: Math.max(phase?.total ?? 0, statuses.length) };
};
var totalTokens = (snapshot, run) => snapshot.agents.filter((agent) => run ? agent.runId === run.id : isActiveStatus(agent.status)).reduce(
  (sum, agent) => sum + (agent.usage ? agent.usage.input + agent.usage.output : 0),
  0
);
var totalCost = (snapshot, run) => snapshot.agents.filter((agent) => run ? agent.runId === run.id : isActiveStatus(agent.status)).reduce((sum, agent) => sum + (agent.usage?.cost ?? 0), 0);
var agentLines = (theme, agent, now) => {
  const status = colorStatus(theme, agent.status, statusGlyph(agent.status));
  const activity = agent.currentTool ?? (agent.error ? `error: ${truncateToWidth3(safeText(agent.error), 48)}` : agent.text && !isActiveStatus(agent.status) ? `result: ${truncateToWidth3(safeText(agent.text), 48)}` : agent.status === "running" ? "thinking" : agent.status);
  const metrics = [
    agent.toolCalls !== void 0 ? `${agent.toolCalls} calls` : void 0,
    agent.usage ? `${formatTokens(agent.usage.input + agent.usage.output)} tok` : void 0,
    agent.startedAt ? formatDuration((agent.finishedAt ?? now) - agent.startedAt) : void 0
  ].filter((value) => Boolean(value));
  const indent = "  ".repeat(1 + Math.max(0, agent.nestingDepth ?? 0));
  return [
    `${indent}${status} ${theme.fg("muted", safeText(agent.name))}  ${theme.fg("muted", safeText(activity))}${metrics.length > 0 ? theme.fg("dim", ` \xB7 ${metrics.join(" \xB7 ")}`) : ""}`
  ];
};
var shouldShowFabricWidget = (snapshot, mode) => {
  if (mode === "hidden") return false;
  if (mode === "always") return true;
  if (snapshot.agents.some((agent) => isActiveStatus(agent.status))) return true;
  if (snapshot.actors.some((actor) => actor.status !== "stopped")) return true;
  const run = snapshot.runs[0];
  if (!run) return false;
  if (run.status === "running") return true;
  const finishedAt = run.finishedAt ?? run.updatedAt;
  return finishedAt > (snapshot.widgetDismissedAt ?? 0);
};
var FabricWidget = class {
  constructor(theme, snapshot, maxRows) {
    this.theme = theme;
    this.snapshot = snapshot;
    this.maxRows = maxRows;
  }
  #lastWidth;
  #lastSnapshot;
  #lastLines;
  #leaseKey;
  #leasedRows = 0;
  #pending;
  render(width) {
    if (width <= 0) return [];
    const snapshot = this.snapshot();
    const lines = this.#pending?.width === width && this.#pending.snapshot === snapshot ? this.#pending.lines : this.#lastWidth === width && this.#lastSnapshot === snapshot && this.#lastLines ? this.#lastLines : this.#renderLines(snapshot, width);
    this.#pending = void 0;
    this.#lastWidth = width;
    this.#lastSnapshot = snapshot;
    this.#lastLines = lines;
    return lines;
  }
  hasChanged() {
    if (this.#lastWidth === void 0 || this.#lastLines === void 0) return true;
    const snapshot = this.snapshot();
    const lines = this.#renderLines(snapshot, this.#lastWidth);
    this.#pending = { width: this.#lastWidth, snapshot, lines };
    return lines.length !== this.#lastLines.length || lines.some((line, index) => line !== this.#lastLines?.[index]);
  }
  invalidate() {
    this.#pending = void 0;
    this.#lastWidth = void 0;
    this.#lastSnapshot = void 0;
    this.#lastLines = void 0;
  }
  #renderLines(snapshot, width) {
    const { lines: content, leaseKey } = this.#buildContent(snapshot);
    return this.#leaseContent(this.#boundContent(content, width), leaseKey);
  }
  #buildContent(snapshot) {
    const candidateRun = snapshot.runs[0];
    const candidateFinishedAt = candidateRun?.finishedAt ?? candidateRun?.updatedAt ?? 0;
    const run = candidateRun && (candidateRun.status === "running" || candidateFinishedAt > (snapshot.widgetDismissedAt ?? 0)) ? candidateRun : void 0;
    const orderedAgents = orderAgentsByCreation(snapshot.agents);
    const activeAgents = orderedAgents.filter((agent) => isActiveStatus(agent.status));
    const activeAgentIds = new Set(activeAgents.map((agent) => agent.id));
    const terminalAgents = run ? orderedAgents.filter(
      (agent) => agent.runId === run.id && !activeAgentIds.has(agent.id) && !isActiveStatus(agent.status)
    ) : [];
    const visibleActors = snapshot.actors.filter((actor) => actor.status !== "stopped");
    const activeActorWorkers = visibleActors.filter((actor) => actor.worker && isActiveStatus(actor.worker.status)).map((actor) => ({ ...actor.worker, name: actor.name }));
    const terminalActorWorkers = visibleActors.filter((actor) => actor.worker && !isActiveStatus(actor.worker.status)).map((actor) => ({ ...actor.worker, name: actor.name }));
    const nestedCalls = run?.calls.filter((call) => call.kind !== "agent" && call.kind !== "actor") ?? [];
    const title = run?.name ?? "Fabric session";
    const headerStatus = run?.status ?? (activeAgents.length > 0 || activeActorWorkers.length > 0 ? "running" : "idle");
    const parts = [];
    const callTotal = nestedCalls.length;
    if (callTotal > 1) {
      const callDone = nestedCalls.filter(
        (call) => call.status === "completed" || call.status === "failed"
      ).length;
      parts.push(`${callDone}/${callTotal} calls`);
    }
    if (run?.currentPhaseId) {
      const phaseIndex = run.phases.findIndex((phase2) => phase2.id === run.currentPhaseId);
      const phase = run.phases[phaseIndex];
      if (phase) {
        const progress = phaseProgress(run, phase.id);
        parts.push(
          `${phaseIndex + 1}/${run.phases.length} ${safeText(phase.name)}${progress.total > 0 ? ` ${progress.completed}/${progress.total}` : ""}`
        );
      }
    }
    if (activeAgents.length > 0) parts.push(`${activeAgents.length} running`);
    if (visibleActors.length > 0) parts.push(`${visibleActors.length} actor${visibleActors.length === 1 ? "" : "s"}`);
    const tokens = totalTokens(snapshot, run);
    if (tokens > 0) parts.push(`${formatTokens(tokens)} tok`);
    const cost = totalCost(snapshot, run);
    if (cost > 0) parts.push(formatCost(cost));
    if (run) parts.push(formatDuration((run.finishedAt ?? snapshot.now) - run.startedAt));
    const glyph = colorStatus(this.theme, headerStatus, statusGlyph(headerStatus));
    const header = `${glyph} ${this.theme.fg("accent", "Fabric")} ${this.theme.fg(
      "muted",
      safeText(title)
    )}${parts.length > 0 ? this.theme.fg("dim", ` \xB7 ${parts.join(" \xB7 ")}`) : ""}`;
    const lines = [header];
    lines.push(
      ...activeAgents.flatMap((agent) => agentLines(this.theme, agent, snapshot.now)),
      ...activeActorWorkers.flatMap(
        (agent) => agentLines(this.theme, agent, snapshot.now)
      ),
      ...terminalActorWorkers.flatMap(
        (agent) => agentLines(this.theme, agent, snapshot.now)
      ),
      ...terminalAgents.flatMap((agent) => agentLines(this.theme, agent, snapshot.now))
    );
    const ambientOwners = [
      ...activeAgents.map((agent) => `agent:${agent.id}`),
      ...visibleActors.map(
        (actor) => `actor:${actor.id}:${actor.worker?.id ?? actor.lastRunId ?? "idle"}`
      )
    ];
    return {
      lines,
      leaseKey: run?.id ?? (ambientOwners.length > 0 ? `ambient:${ambientOwners.join(",")}` : "ambient")
    };
  }
  #leaseContent(lines, leaseKey) {
    if (this.#leaseKey !== leaseKey) {
      this.#leaseKey = leaseKey;
      this.#leasedRows = lines.length;
    } else {
      this.#leasedRows = Math.max(this.#leasedRows, lines.length);
    }
    if (lines.length >= this.#leasedRows) return lines;
    return [
      ...lines,
      ...Array.from({ length: this.#leasedRows - lines.length }, () => "")
    ];
  }
  #boundContent(content, width) {
    const bounded = content.slice(0, Math.max(1, this.maxRows));
    if (content.length > bounded.length && bounded.length > 0) {
      const marker = this.theme.fg("dim", `+${content.length - bounded.length}`);
      const available = Math.max(0, width - visibleWidth2(marker) - 1);
      const last = truncateToWidth3(bounded[bounded.length - 1] ?? "", available, "");
      bounded[bounded.length - 1] = `${last} ${marker}`;
    }
    return bounded.map((line) => truncateToWidth3(line, width));
  }
};

// src/ui/controller.ts
var WIDGET_ID = "pi-fabric";
var ACTIVITY_REFRESH_MS = 100;
var emptySnapshot = () => {
  const now = Date.now();
  return {
    now,
    runs: [],
    main: {
      id: "main",
      name: "Main",
      kind: "main",
      status: "idle",
      runner: "pi",
      transport: "host",
      cwd: process.cwd(),
      startedAt: now,
      updatedAt: now,
      pendingMessages: false,
      local: true
    },
    peers: [],
    agents: [],
    actors: [],
    componentGraph: { components: [], edges: [], cycles: [] },
    globalActors: [],
    state: [],
    events: []
  };
};
var FabricUiController = class {
  constructor(state, codePreviewSettings) {
    this.state = state;
    this.codePreviewSettings = codePreviewSettings;
  }
  #context;
  #snapshot = emptySnapshot();
  #events = [];
  #meshOffset = 0;
  #timer;
  #activityUnsubscribe;
  #actorUnsubscribe;
  #agentUnsubscribe;
  #scheduledRefresh;
  #widgetTui;
  #dashboardTui;
  #widgetMounted = false;
  #widget;
  #lastRefreshErrorAt = 0;
  #lastRefreshAt = 0;
  #dashboardOpen = false;
  #activityRevision;
  // Tracks whether #activityRuns was last fetched with full payloads. The
  // dashboard needs args/result/preview to render call detail; the periodic
  // refresh instead pulls payload-free summaries so streaming runs stop
  // paying a deep clone of up to 1,000 bounded call payloads per tick.
  #activityRunsDetailed = true;
  #activityRuns = [];
  #transcripts = new AgentTranscriptReader();
  start(context) {
    this.stop();
    this.#context = context;
    if (!this.state.config.ui.enabled || context.mode !== "tui") return;
    if (this.state.config.mesh.enabled) {
      this.#events = this.state.mesh.read({ limit: this.state.config.ui.eventHistory });
      this.#meshOffset = this.state.mesh.latestOffset();
    }
    this.#activityUnsubscribe = this.state.activity.subscribe(() => this.#scheduleRefresh());
    this.#actorUnsubscribe = this.state.actors.subscribe(() => this.#scheduleRefresh());
    this.#agentUnsubscribe = this.state.agents.subscribeUi(() => this.#scheduleRefresh());
    this.#refresh();
    this.#schedulePoll();
  }
  stop() {
    if (this.#timer) clearTimeout(this.#timer);
    if (this.#scheduledRefresh) clearTimeout(this.#scheduledRefresh);
    this.#timer = void 0;
    this.#scheduledRefresh = void 0;
    this.#widget = void 0;
    this.#activityUnsubscribe?.();
    this.#activityUnsubscribe = void 0;
    this.#actorUnsubscribe?.();
    this.#actorUnsubscribe = void 0;
    this.#agentUnsubscribe?.();
    this.#agentUnsubscribe = void 0;
    if (this.#context?.mode === "tui") {
      this.#context.ui.setWidget(WIDGET_ID, void 0);
    }
    this.#context = void 0;
    this.#widgetTui = void 0;
    this.#dashboardTui = void 0;
    this.#widgetMounted = false;
    this.#events = [];
    this.#meshOffset = 0;
    this.#snapshot = emptySnapshot();
    this.#lastRefreshErrorAt = 0;
    this.#lastRefreshAt = 0;
    this.#dashboardOpen = false;
    this.#activityRevision = void 0;
    this.#activityRunsDetailed = true;
    this.#activityRuns = [];
    this.#transcripts.clear();
  }
  async openDashboard(context) {
    if (context.mode !== "tui") {
      context.ui.notify("The Fabric dashboard is available in TUI mode", "warning");
      return;
    }
    if (!this.state.config.ui.enabled) {
      context.ui.notify("The Fabric UI is disabled by ui.enabled", "warning");
      return;
    }
    if (!this.#context) this.start(context);
    this.#dashboardOpen = true;
    this.#refresh();
    const [{ FabricDashboard }, { buildClaudeModelSource, buildModelSource }] = await Promise.all([import("./chunks/dashboard-N57JCWR4.js"), import("./chunks/model-picker-6XUIOUV6.js")]);
    const modelSource = buildModelSource(context.modelRegistry, resolveAgentDir());
    let claudeModelSource;
    if (this.#snapshot.actors.some((actor) => actor.runner === "claude")) {
      try {
        claudeModelSource = buildClaudeModelSource(await this.state.agents.claudeModels());
      } catch (error) {
        context.ui.notify(
          `Claude model discovery failed: ${error instanceof Error ? error.message : String(error)}`,
          "warning"
        );
      }
    }
    const reportUpdate = (message, update) => {
      void update.then(() => {
        context.ui.notify(message, "info");
        this.#refresh();
      }).catch(
        (error) => context.ui.notify(error instanceof Error ? error.message : String(error), "error")
      );
    };
    const onTargetMessage = (target, message, delivery) => {
      const action = target.kind === "actor" ? "Message queued for actor" : delivery === "steer" ? `Steer queued for ${target.name}` : `Follow-up queued for ${target.name}`;
      reportUpdate(
        action,
        this.state.queueUserMessage(target.id, message, delivery)
      );
    };
    const onAgentStop = (agentId) => {
      reportUpdate("Agent stopped", this.state.stopParticipant(agentId));
    };
    const onActorModel = (actorId, model, scope) => {
      reportUpdate(
        scope === "project" ? "Actor project model pinned" : "Actor session model updated",
        this.state.actors.setModel(actorId, model, scope)
      );
    };
    const onActorThinking = (actorId, thinking, scope) => {
      reportUpdate(
        scope === "project" ? "Actor project thinking pinned" : "Actor session thinking updated",
        this.state.actors.setThinking(actorId, thinking, scope)
      );
    };
    const onActorEvents = (actorId, events) => {
      reportUpdate("Actor event subscriptions updated", this.state.actors.setEvents(actorId, events));
    };
    const onActorDeliveryPolicy = (actorId, delivery, triggerTurn) => {
      reportUpdate(
        "Actor delivery policy updated",
        this.state.actors.setDeliveryPolicy(actorId, delivery, triggerTurn)
      );
    };
    const onGlobalDeliveryPolicy = (actorId, delivery, triggerTurn) => {
      try {
        this.state.globalActors.update(actorId, { delivery, triggerTurn });
        context.ui.notify("Global actor delivery policy updated", "info");
        this.#refresh();
      } catch (error) {
        context.ui.notify(error instanceof Error ? error.message : String(error), "error");
      }
    };
    const onActorTools = (actorId, tools) => {
      reportUpdate("Actor tools updated", this.state.actors.setTools(actorId, tools));
    };
    const onClearMessages = (actorId) => {
      reportUpdate("Actor mailbox cleared", this.state.actors.clearMessages(actorId));
    };
    const onActorInstructions = (actorId, instructions) => {
      reportUpdate("Actor instructions updated", this.state.actors.setInstructions(actorId, instructions));
    };
    const onGlobalInstructions = (globalActorId, instructions) => {
      try {
        this.state.globalActors.update(globalActorId, { instructions });
        context.ui.notify("Global actor instructions updated", "info");
        this.#refresh();
      } catch (error) {
        context.ui.notify(error instanceof Error ? error.message : String(error), "error");
      }
    };
    const onImportActor = (globalActorId) => {
      const def = this.state.globalActors.resolve(globalActorId);
      if (!def) return;
      this.state.actors.create(this.state.globalActors.toRequest(def)).then((actor) => {
        context.ui.notify(`Imported global actor "${def.name}" as ${actor.name}`, "info");
        this.#refresh();
      }).catch(
        (error) => context.ui.notify(error instanceof Error ? error.message : String(error), "error")
      );
    };
    const onExportActor = (actorId) => {
      try {
        const def = this.state.actors.definition(actorId);
        const template = this.state.globalActors.create(def);
        context.ui.notify(`Exported "${template.name}" to global actors`, "info");
        this.#refresh();
      } catch (error) {
        context.ui.notify(error instanceof Error ? error.message : String(error), "error");
      }
    };
    const onRemoveGlobalActor = (globalActorId) => {
      try {
        const result = this.state.globalActors.remove(globalActorId);
        context.ui.notify(
          result.removed ? "Removed global actor template" : "Global actor not found",
          result.removed ? "info" : "warning"
        );
        this.#refresh();
      } catch (error) {
        context.ui.notify(error instanceof Error ? error.message : String(error), "error");
      }
    };
    this.#schedulePoll(true);
    try {
      await context.ui.custom(
        (tui, theme, keybindings, done) => {
          this.#dashboardTui = tui;
          return new FabricDashboard(tui, theme, () => this.#snapshot, () => done(void 0), {
            modelSource,
            keybindings,
            ...this.codePreviewSettings ? { codePreviewSettings: this.codePreviewSettings } : {},
            ...claudeModelSource ? { claudeModelSource } : {},
            onTargetMessage,
            onAgentStop,
            agentTranscript: (agent, followLatest) => this.#transcripts.read(this.#agentTranscriptSource(agent), followLatest),
            actorTranscript: (actor, followLatest) => this.#transcripts.read(this.#actorTranscriptSource(actor), followLatest),
            loadOlderTranscript: (target) => this.#transcripts.loadOlder(this.#transcriptSource(target)),
            loadNewerTranscript: (target) => this.#transcripts.loadNewer(this.#transcriptSource(target)),
            loadLatestTranscript: (target) => this.#transcripts.loadLatest(this.#transcriptSource(target)),
            onActorModel,
            onActorThinking,
            onActorEvents,
            onActorDeliveryPolicy,
            onGlobalDeliveryPolicy,
            onActorTools,
            actorDefaultTools: this.state.config.agents?.defaultTools ?? [],
            onClearMessages,
            onActorInstructions,
            onGlobalInstructions,
            onImportActor,
            onExportActor,
            onRemoveGlobalActor
          });
        },
        {
          overlay: true,
          overlayOptions: {
            width: "94%",
            minWidth: 40,
            maxHeight: "90%",
            anchor: "center",
            margin: 1
          }
        }
      );
    } finally {
      this.#dashboardOpen = false;
      this.#dashboardTui = void 0;
      this.#refresh();
      this.#schedulePoll(true);
    }
  }
  snapshot() {
    return structuredClone(this.#snapshot);
  }
  #schedulePoll(reset = false) {
    if (reset && this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = void 0;
    }
    if (this.#timer || !this.#context) return;
    const active = this.#snapshot.runs.some((run) => run.status === "running") || this.#snapshot.peers.length > 0 || this.#snapshot.agents.some((agent) => isActiveStatus(agent.status)) || this.#snapshot.actors.some(
      (actor) => isActiveStatus(actor.status) || Boolean(actor.worker && isActiveStatus(actor.worker.status))
    );
    if (!this.#dashboardOpen && !active) return;
    this.#timer = setTimeout(() => {
      this.#timer = void 0;
      this.#refresh();
      this.#schedulePoll();
    }, this.state.config.ui.refreshMs);
    this.#timer.unref();
  }
  #scheduleRefresh() {
    if (this.#scheduledRefresh || !this.#context) return;
    const elapsed = performance.now() - this.#lastRefreshAt;
    const delay = Math.max(
      0,
      Math.min(ACTIVITY_REFRESH_MS, this.state.config.ui.refreshMs) - elapsed
    );
    this.#scheduledRefresh = setTimeout(() => {
      this.#scheduledRefresh = void 0;
      this.#refresh();
      this.#schedulePoll(true);
    }, delay);
    this.#scheduledRefresh.unref();
  }
  #agentTranscriptSource(agent) {
    return { id: agent.id, status: agent.status, ...agent.logFile ? { logFile: agent.logFile } : {} };
  }
  #actorTranscriptSource(actor) {
    if (actor.worker?.logFile && isActiveStatus(actor.worker.status)) {
      return {
        id: `${actor.id}:${actor.worker.id}`,
        status: actor.worker.status,
        logFile: actor.worker.logFile
      };
    }
    const retained = actor.lastRunId && actor.logDir ? path8.join(actor.logDir, actor.lastRunId, "events.jsonl") : void 0;
    if (retained) return { id: actor.id, status: actor.status, logFile: retained };
    if (actor.sessionFile) {
      return { id: actor.id, status: actor.status, logFile: actor.sessionFile };
    }
    return { id: actor.id, status: actor.status };
  }
  #transcriptSource(target) {
    return "recentMessages" in target ? this.#actorTranscriptSource(target) : this.#agentTranscriptSource(target);
  }
  #refresh() {
    this.#lastRefreshAt = performance.now();
    const context = this.#context;
    if (!context || !this.state.initialized) return;
    try {
      this.#pollMesh();
      const revision = typeof this.state.activity.revision === "function" ? this.state.activity.revision() : void 0;
      const detailed = this.#dashboardOpen;
      if (revision === void 0 || revision !== this.#activityRevision || detailed !== this.#activityRunsDetailed) {
        this.#activityRuns = detailed || typeof this.state.activity.runSummaries !== "function" ? this.state.activity.runs() : this.state.activity.runSummaries();
        this.#activityRevision = revision;
        this.#activityRunsDetailed = detailed;
      }
      this.#snapshot = createDashboardSnapshot(
        this.state,
        this.#events,
        context,
        this.#activityRuns
      );
      this.#renderWidget(context);
      if (this.#dashboardTui) this.#dashboardTui.requestRender();
      else if (this.#widgetTui && this.#widget?.hasChanged()) this.#widgetTui.requestRender();
    } catch (error) {
      const now = Date.now();
      if (now - this.#lastRefreshErrorAt >= 1e4) {
        this.#lastRefreshErrorAt = now;
        const message = error instanceof Error ? error.message : String(error);
        context.ui.notify(`Fabric dashboard refresh failed: ${message}`, "warning");
      }
    }
  }
  #pollMesh() {
    if (!this.state.config.mesh.enabled) return;
    const result = this.state.mesh.tail(this.#meshOffset, this.state.config.ui.eventHistory);
    this.#meshOffset = result.nextOffset;
    if (result.events.length === 0) return;
    this.#events.push(...result.events);
    const limit = this.state.config.ui.eventHistory;
    if (this.#events.length > limit) this.#events.splice(0, this.#events.length - limit);
  }
  #renderWidget(context) {
    const config = this.state.config.ui;
    const shouldShow = context.mode === "tui" && shouldShowFabricWidget(this.#snapshot, config.widget);
    if (shouldShow) {
      if (this.#widgetMounted) return;
      this.#widgetMounted = true;
      context.ui.setWidget(
        WIDGET_ID,
        (tui, theme) => {
          this.#widgetTui = tui;
          this.#widget = new FabricWidget(theme, () => this.#snapshot, config.maxRows);
          return this.#widget;
        },
        { placement: "aboveEditor" }
      );
      return;
    }
    if (!this.#widgetMounted) return;
    context.ui.setWidget(WIDGET_ID, void 0);
    this.#widgetMounted = false;
    this.#widgetTui = void 0;
    this.#widget = void 0;
  }
};

// src/ui/tool-display.ts
var FabricToolDisplayController = class {
  #invalidators = /* @__PURE__ */ new Map();
  #pendingRefresh = [];
  #refreshDrainScheduled = false;
  observe(toolCallId, kind, invalidate) {
    const invalidators = this.#invalidators.get(toolCallId) ?? {};
    invalidators[kind] = invalidate;
    this.#invalidators.set(toolCallId, invalidators);
  }
  refresh() {
    for (const { call, result } of this.#invalidators.values()) {
      const invalidate = result ?? call;
      if (invalidate) this.#pendingRefresh.push(invalidate);
    }
    this.#scheduleRefreshDrain();
  }
  // Drain a few cards per event-loop turn. invalidate() synchronously runs the
  // card's full renderer pair (updateDisplay in pi's ToolExecutionComponent),
  // so re-rendering a long transcript inside a single keypress froze the UI
  // until every card had been redrawn.
  #scheduleRefreshDrain() {
    if (this.#refreshDrainScheduled) return;
    this.#refreshDrainScheduled = true;
    setImmediate(() => {
      this.#refreshDrainScheduled = false;
      const batch = this.#pendingRefresh.splice(0, REFRESH_CARDS_PER_TICK);
      for (const invalidate of batch) {
        try {
          invalidate();
        } catch {
        }
      }
      if (this.#pendingRefresh.length > 0) this.#scheduleRefreshDrain();
    });
  }
  clear() {
    this.#pendingRefresh = [];
    this.#invalidators.clear();
  }
};
var REFRESH_CARDS_PER_TICK = 3;

// src/index.ts
import { existsSync as existsSync4 } from "node:fs";
import path9 from "node:path";
import { fileURLToPath } from "node:url";
var FABRIC_EXTENSION_ENTRY_PATH = path9.resolve(fileURLToPath(import.meta.url));
var FABRIC_ENTRY_DIR = path9.dirname(FABRIC_EXTENSION_ENTRY_PATH);
var FABRIC_RUNTIME_PATHS = {
  extension: FABRIC_EXTENSION_ENTRY_PATH,
  worker: path9.join(FABRIC_ENTRY_DIR, "worker.js"),
  residentHost: path9.join(FABRIC_ENTRY_DIR, "residency", "launcher.js"),
  skills: path9.resolve(FABRIC_ENTRY_DIR, "..", "skills")
};
var FABRIC_SKILLS_DIR = FABRIC_RUNTIME_PATHS.skills;
var componentRegistrationFrom = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
  const registration = value;
  const component = registration.component;
  if (registration.version !== 1 || typeof component !== "object" || component === null || typeof component.name !== "string" || typeof component.activate !== "function") {
    return void 0;
  }
  return registration;
};
var registrationFrom = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
  const registration = value;
  const provider = registration.provider;
  if (registration.version !== 1 || typeof provider !== "object" || provider === null || typeof provider.name !== "string" || typeof provider.description !== "string" || typeof provider.list !== "function" || typeof provider.describe !== "function" || typeof provider.invoke !== "function") {
    return void 0;
  }
  return registration;
};
var SKILL_REFERENCE_CUSTOM_TYPE = "pi-fabric-skill-reference";
async function piFabric(pi) {
  const codePreviewSettings = defaultCodePreviewSettings();
  const decorateShell = withCodePreviewShell;
  let compatibilityWarningShown = false;
  configureHighlighting(
    codePreviewSettings.shikiTheme,
    codePreviewSettings.syntaxHighlighting
  );
  const capturedTools = new CapturedToolCatalog();
  const proxyContract = new ProxyContractLedger();
  const state = new FabricState(pi, capturedTools, { paths: FABRIC_RUNTIME_PATHS });
  const directToolApproval = new FabricDirectToolApproval(
    pi,
    () => state.config,
    state.sessionApprovals
  );
  const pendingHandoffs = /* @__PURE__ */ new Map();
  const toolOwnership = new FabricToolOwnership(pi);
  const fabricUi = new FabricUiController(state, codePreviewSettings);
  const toolDisplay = new FabricToolDisplayController();
  const capturePolicy = () => effectiveToolCaptureConfig(state.config);
  const fabricOwnsModelTools = () => state.config.fullCodeMode || state.config.schema.mode === "enforce";
  const hiddenCapturedToolNames = () => {
    const visible = new Set(capturePolicy().keepVisible);
    return new Set(
      capturedTools.list().map((entry) => entry.name).filter((name) => !visible.has(name))
    );
  };
  const { reassert: reassertToolOwnership, schedule: scheduleOwnershipReassert } = createToolOwnershipReassertion({
    ready: () => state.cwd !== void 0,
    active: () => {
      const policy = capturePolicy();
      return policy.enabled && policy.hideFromModel && fabricOwnsModelTools();
    },
    hiddenNames: hiddenCapturedToolNames,
    apply: (hidden) => toolOwnership.apply(true, hidden)
  });
  const unsubscribeComponentRegistration = pi.events.on(
    FABRIC_COMPONENT_REGISTER_EVENT,
    (value) => {
      const registration = componentRegistrationFrom(value);
      if (!registration) throw new Error("Invalid Pi Fabric component registration");
      state.registerExternalComponent(
        registration.component,
        registration.overwrite === void 0 ? {} : { overwrite: registration.overwrite }
      );
    }
  );
  const unsubscribeProviderRegistration = pi.events.on(
    FABRIC_PROVIDER_REGISTER_EVENT,
    (value) => {
      const registration = registrationFrom(value);
      if (!registration) throw new Error("Invalid Pi Fabric provider registration");
      state.registerExternal(
        registration.provider,
        registration.overwrite === void 0 ? {} : { overwrite: registration.overwrite }
      );
    }
  );
  pi.on("resources_discover", async () => {
    if (existsSync4(FABRIC_SKILLS_DIR)) return { skillPaths: [FABRIC_SKILLS_DIR] };
    return {};
  });
  const fabricTool = createFabricExecTool(
    state,
    codePreviewSettings,
    pendingHandoffs,
    decorateShell,
    toolDisplay
  );
  const refreshCodePreviewSettings = () => {
    Object.assign(codePreviewSettings, state.config.codePreview);
    configureHighlighting(
      codePreviewSettings.shikiTheme,
      codePreviewSettings.syntaxHighlighting
    );
  };
  const fabricToolLifecycle = new FabricToolLifecycle(
    () => ownsFabricToolSource(pi.getAllTools(), FABRIC_EXTENSION_ENTRY_PATH),
    () => state.initialized ? state.execution.authorizer : void 0,
    () => state.initialized ? directToolApproval : void 0
  );
  const inactiveCapturePolicy = {
    ...structuredClone(DEFAULT_FABRIC_CONFIG.capture),
    enabled: false,
    hideFromModel: false
  };
  const toolCapture = await installRegisteredToolCapture({
    anchorDefinition: fabricTool,
    catalog: capturedTools,
    initialPolicy: inactiveCapturePolicy,
    onCatalogRefresh: () => {
      scheduleOwnershipReassert();
    }
  });
  pi.registerTool(fabricTool);
  const applyFabricMode = () => {
    capturedTools.markResumed();
    toolCapture.setPolicy(capturePolicy());
    pi.registerTool(fabricTool);
    toolOwnership.apply(
      fabricOwnsModelTools(),
      fabricOwnsModelTools() ? hiddenCapturedToolNames() : void 0
    );
    capturedTools.refresh();
  };
  const suspendToolCapture = () => {
    capturedTools.markSuspended();
    toolCapture.setPolicy(inactiveCapturePolicy);
  };
  let haltOnEscapeUnsubscribe;
  const uninstallHaltOnEscape = () => {
    haltOnEscapeUnsubscribe?.();
    haltOnEscapeUnsubscribe = void 0;
  };
  const installHaltOnEscape = (context) => {
    uninstallHaltOnEscape();
    if (context.mode !== "tui") return;
    if (!state.config.ui.haltOnEscape || !state.config.mesh.enabled) return;
    if (typeof context.ui.onTerminalInput !== "function") return;
    const ESC = "\x1B";
    const DEBOUNCE_MS = 60;
    let escTimer;
    const trigger = () => {
      if (!state.initialized || !state.config.mesh.enabled) return;
      let halted = 0;
      try {
        if (state.actors.halted) return;
        halted = state.actors.haltAll().halted;
      } catch {
        return;
      }
      if (halted === 0) return;
      context.ui.notify(
        `Fabric: halted ${halted} actor${halted === 1 ? "" : "s"} (Esc) \xB7 resumes on next message`,
        "warning"
      );
    };
    haltOnEscapeUnsubscribe = context.ui.onTerminalInput((data) => {
      if (data === ESC) {
        if (escTimer) clearTimeout(escTimer);
        escTimer = setTimeout(() => {
          escTimer = void 0;
          trigger();
        }, DEBOUNCE_MS);
        escTimer.unref?.();
        return void 0;
      }
      if (escTimer) {
        clearTimeout(escTimer);
        escTimer = void 0;
      }
      return void 0;
    });
  };
  const refreshProxyLedger = (context) => {
    proxyContract.restoreFromEntries(context.sessionManager?.getBranch?.() ?? []);
  };
  let prewalkAutoArmNoticeShown = false;
  const autoArmPrewalk = async (context) => {
    const skipReason = await autoArmFabricPrewalk(state, context, pi);
    if (!skipReason || prewalkAutoArmNoticeShown || !context.hasUI) return;
    prewalkAutoArmNoticeShown = true;
    context.ui.notify(skipReason, "warning");
  };
  const cleanupActivationSideEffects = () => {
    uninstallHaltOnEscape();
    fabricUi.stop();
  };
  state.setActivationHook(async (context) => {
    refreshCodePreviewSettings();
    Object.assign(
      fabricTool,
      createFabricExecTool(state, codePreviewSettings, pendingHandoffs, decorateShell, toolDisplay)
    );
    await autoArmPrewalk(context);
    applyFabricMode();
    fabricUi.start(context);
    installHaltOnEscape(context);
  }, cleanupActivationSideEffects);
  pi.on("session_start", async (_event, context) => {
    pendingHandoffs.clear();
    directToolApproval.clear();
    toolDisplay.clear();
    uninstallHaltOnEscape();
    fabricUi.stop();
    suspendToolCapture();
    proxyContract.reset();
    refreshProxyLedger(context);
    if (!compatibilityWarningShown) {
      compatibilityWarningShown = true;
      const warning = piHostCompatibilityWarning();
      if (warning) {
        console.warn(`[pi-fabric] ${warning}`);
        if (context.hasUI) context.ui.notify(warning, "warning");
      }
    }
    await state.bootstrap(context);
    refreshCodePreviewSettings();
    applyFabricMode();
    if (state.shouldEagerlyActivate(context)) await state.ensure(context);
  });
  pi.on("session_tree", async (_event, context) => {
    proxyContract.reset();
    refreshProxyLedger(context);
    toolDisplay.clear();
    return void 0;
  });
  pi.on("input", async (event, context) => {
    if (!state.initialized) return;
    state.prewalk.observeTask(
      context.sessionManager.getSessionId(),
      event.text
    );
    await state.publishHostLifecycle("pi.input", event);
  });
  pi.on("agent_start", async (event) => {
    if (state.initialized) await state.publishHostLifecycle("pi.agent_start", event);
  });
  pi.on("agent_end", async (event) => {
    if (state.initialized) await state.publishHostLifecycle("pi.agent_end", event);
  });
  pi.on("turn_end", async (event, context) => {
    if (state.initialized) state.resetSpeculation();
    if (state.initialized) await state.publishHostLifecycle("pi.turn_end", event);
  });
  pi.on("agent_settled", async (event, context) => {
    if (!state.initialized) {
      await compactAtConfiguredThreshold(context, state.config);
      return;
    }
    const sessionId = context.sessionManager.getSessionId();
    const settledInPlace = await settleInPlacePrewalk(state.prewalk, pi, context, {
      compactOnReturn: state.config.prewalk.compactOnReturn,
      compact: state.compact
    });
    if (!settledInPlace && state.prewalk.settleTask(sessionId)) {
      const status = state.prewalk.status();
      context.ui.setStatus(
        "fabric-prewalk",
        status.state === "armed" ? `armed \u2192 ${status.model}` : void 0
      );
    }
    if (state.prewalk.status().state === "armed") {
      void state.prewalkDrift.captureBaseline(sessionId, context.cwd);
    } else {
      state.prewalkDrift.drop(sessionId);
    }
    await state.compact.maybeCommit(context);
    await compactAtConfiguredThreshold(context, state.config);
    await state.publishHostLifecycle("pi.agent_settled", event);
  });
  pi.on("message_start", () => {
    state.speculationTap?.reset();
  });
  pi.on("message_update", (event, context) => {
    if (!state.initialized) return;
    state.speculationTap?.handleMessageUpdate(event, context);
  });
  pi.on("tool_call", (event, context) => fabricToolLifecycle.toolCall(event, context));
  pi.on("tool_result", (event) => fabricToolLifecycle.toolResult(event));
  pi.on("tool_result", (event, context) => {
    if (event.toolName !== "read" || event.isError) return void 0;
    let changed = false;
    const content = event.content.map((part) => {
      if (part.type !== "text") return part;
      const text = expandSkillDirMarkersForRead(
        part.text,
        event.input,
        context.cwd
      );
      if (text === part.text) return part;
      changed = true;
      return { ...part, text };
    });
    return changed ? { content } : void 0;
  });
  pi.on("message_end", (event) => {
    if (event.message.role !== "toolResult") return void 0;
    const message = event.message;
    const usage = directToolApproval.takeUsage(message.toolCallId);
    if (!usage) return void 0;
    return {
      message: {
        ...message,
        usage: mergeFabricApprovalUsage(message.usage, usage)
      }
    };
  });
  pi.on("message_end", async (event, context) => {
    if (event.message.role !== "toolResult") return void 0;
    const pending = pendingHandoffs.get(event.message.toolCallId);
    if (!pending || event.message.toolName !== "fabric_exec") return void 0;
    pendingHandoffs.delete(event.message.toolCallId);
    const outerToolResult = event.message;
    const handoff = await state.runHandoffAtBoundary(
      pending,
      outerToolResult,
      context
    );
    const formatted = formatFabricValue(
      handoff,
      pending.resultFormat,
      state.config.executor.maxOutputChars
    );
    const output = truncateMiddle(
      formatted.text || "(no output)",
      state.config.executor.maxOutputChars
    );
    const text = withTrajectoryRearmDirective(
      output,
      pending,
      handoff,
      state.prewalk,
      context.sessionManager.getSessionId()
    );
    const boundarySucceeded = handoff.completed === true || handoff.continued === true;
    const details = typeof event.message.details === "object" && event.message.details !== null && !Array.isArray(event.message.details) && "success" in event.message.details ? { ...event.message.details, success: boundarySucceeded } : event.message.details;
    return {
      message: {
        ...event.message,
        content: [{ type: "text", text }],
        details,
        isError: !boundarySucceeded
      }
    };
  });
  pi.on("tool_execution_end", async (event, context) => {
    if (!state.initialized) return;
    state.noteMainActivity(context);
    if (event.isError) {
      const classified = classifyToolResult({
        toolName: event.toolName,
        isError: true,
        content: event.result
      });
      const registryObserved = event.toolName === "fabric_exec" && (classified?.stage === "invocation_args" || classified?.stage === "invocation_unknown_action");
      if (classified && !registryObserved) {
        getActiveRepairCompiler()?.observe(classified);
      }
      state.dispatchHostEvent("tool_error", event, context);
      await state.publishHostLifecycle("pi.tool_error", event);
    }
  });
  pi.on("session_compact", async (event, context) => {
    if (!state.initialized) return;
    await state.publishHostLifecycle("pi.session_compact", event);
  });
  registerCompactionHook(pi, {
    getEngine: () => state.cwd ? state.config.compaction.engine : DEFAULT_FABRIC_CONFIG.compaction.engine,
    getTargetContextRatio: () => state.cwd ? state.config.compaction.targetContextRatio : DEFAULT_FABRIC_CONFIG.compaction.targetContextRatio,
    getThresholdContextRatio: (modelKey) => state.cwd ? state.config.compaction.thresholds[modelKey] : DEFAULT_FABRIC_CONFIG.compaction.thresholds[modelKey],
    getThresholdTokens: (modelKey) => state.cwd ? state.config.compaction.tokenThresholds[modelKey] : DEFAULT_FABRIC_CONFIG.compaction.tokenThresholds[modelKey]
  });
  pi.on("context", (event, context) => {
    const sessionId = context.sessionManager.getSessionId();
    const continuation = filterPrewalkContinuationMessages(
      event.messages,
      (continuationId) => state.initialized && state.prewalk.acceptContinuation(sessionId, continuationId)
    );
    let changed = continuation.changed;
    const messages = continuation.messages.map((message) => {
      if (message.role !== "user") return message;
      if (typeof message.content === "string") {
        const content2 = expandSkillDirMarkersInSkillBlock(message.content);
        if (content2 === message.content) return message;
        changed = true;
        return { ...message, content: content2 };
      }
      let messageChanged = false;
      const content = message.content.map((part) => {
        if (part.type !== "text") return part;
        const text = expandSkillDirMarkersInSkillBlock(part.text);
        if (text === part.text) return part;
        changed = true;
        messageChanged = true;
        return { ...part, text };
      });
      return messageChanged ? { ...message, content } : message;
    });
    return changed ? { messages } : void 0;
  });
  pi.on("before_agent_start", async (event, context) => {
    const fullCodeMode = state.cwd ? state.config.fullCodeMode : DEFAULT_FABRIC_CONFIG.fullCodeMode;
    const schemaMode = state.cwd ? state.config.schema.mode : DEFAULT_FABRIC_CONFIG.schema.mode;
    const effectiveFullCodeMode = fullCodeMode || schemaMode === "enforce";
    if (!pi.getActiveTools().includes("fabric_exec")) return;
    const skills = event.systemPromptOptions.skills ?? [];
    const captureSnapshot = state.cwd ? capturePolicy() : void 0;
    const systemPrompt = effectiveFullCodeMode ? restoreSkillsForFullCodePrompt(event.systemPrompt, skills) : event.systemPrompt;
    const skillReferenceGuidance = effectiveFullCodeMode ? buildSkillReferenceGuidance(event.prompt, skills) : void 0;
    const currentModel = context.model ? `${context.model.provider}/${context.model.id}` : void 0;
    const resolvedGuidance = resolveFabricModelGuidance(state.modelGuidance(), {
      ...currentModel ? { model: currentModel } : {},
      target: process.env.PI_FABRIC_PARENT_RUN ? "participant" : "main",
      defaults: [{
        slot: FABRIC_EXECUTION_GUIDANCE_SLOT,
        content: defaultFabricExecutionGuidance(effectiveFullCodeMode)
      }]
    });
    const overrideGuidance = effectiveFullCodeMode ? coreOverridePromptGuidance(capturedTools).trim() : void 0;
    const extensionRoster = effectiveFullCodeMode ? extensionToolRosterGuidance(capturedTools.list(), new Set(PI_CORE_TOOL_NAMES)) : void 0;
    const guidance = [
      fabricExecutionKernelGuidance(effectiveFullCodeMode),
      resolvedGuidance.slotText,
      fabricSchemaGuidance(schemaMode),
      overrideGuidance,
      extensionRoster,
      resolvedGuidance.appendText
    ].filter((section) => Boolean(section)).join("\n\n");
    if (!skillReferenceGuidance) return {
      systemPrompt: `${systemPrompt}

${guidance}`
    };
    return {
      systemPrompt: `${systemPrompt}

${guidance}`,
      message: {
        customType: SKILL_REFERENCE_CUSTOM_TYPE,
        content: skillReferenceGuidance,
        display: false,
        details: {}
      }
    };
  });
  pi.on("before_agent_start", (event) => {
    if (!pi.getActiveTools().includes("fabric_exec")) return;
    const captureSnapshot = state.cwd ? capturePolicy() : void 0;
    if (!captureSnapshot?.enabled || !captureSnapshot.hideFromModel || !fabricOwnsModelTools()) {
      return;
    }
    const names = rewritableHiddenCapturedToolNames(hiddenCapturedToolNames());
    if (names.length === 0) return;
    const mentioned = proxyContractMentionsInSkills(
      event.prompt,
      event.systemPrompt,
      names
    );
    const fresh = proxyContract.take(mentioned);
    if (fresh.length === 0) return;
    return {
      message: {
        customType: PROXY_CONTRACT_CUSTOM_TYPE,
        content: formatProxyContractReminder(fresh),
        display: false,
        details: { names: fresh, origin: "skill" }
      }
    };
  });
  registerFabricActorHostEventObservers(pi, (eventName, event, context) => {
    if (!state.initialized) return;
    state.dispatchHostEvent(eventName, event, context);
  });
  pi.on("session_shutdown", async () => {
    unsubscribeComponentRegistration();
    unsubscribeProviderRegistration();
    pendingHandoffs.clear();
    directToolApproval.clear();
    toolDisplay.clear();
    try {
      await state.shutdown();
    } finally {
      uninstallHaltOnEscape();
      fabricUi.stop();
      suspendToolCapture();
      toolOwnership.release();
      fabricToolLifecycle.clear();
      toolCapture.dispose();
    }
  });
  pi.on("before_agent_start", () => {
    reassertToolOwnership();
  });
  registerFabricCommand(pi, {
    state,
    fabricUi,
    capturedTools,
    applyFabricMode,
    suspendToolCapture,
    refreshCodePreviewSettings,
    refreshToolDisplay: () => toolDisplay.refresh()
  });
}
export {
  FABRIC_COMPONENT_DISCOVER_EVENT,
  FABRIC_COMPONENT_REGISTER_EVENT,
  FABRIC_EXECUTION_DETAILS_MAX_BYTES,
  FABRIC_EXECUTION_GUIDANCE_SLOT,
  FABRIC_EXECUTION_TRACE_KIND,
  FABRIC_EXECUTION_TRACE_MAX_BYTES,
  FABRIC_EXECUTION_TRACE_VERSION,
  FABRIC_NESTED_TOOL_CALL_ID_PREFIX,
  FABRIC_PEER_AWAIT_SETTLE_EVENT,
  FABRIC_PEER_CARDS_EVENT,
  FABRIC_PREWALK_REQUEST_EVENT,
  FABRIC_PROVIDER_DISCOVER_EVENT,
  FABRIC_PROVIDER_REGISTER_EVENT,
  FABRIC_TOOL_RESULT_PROXY_KIND,
  FabricExecutionTraceOperationHandle,
  FabricExecutionTraceRecorder,
  MAX_FABRIC_MODEL_GUIDANCE_CONTENT_CHARS,
  MAX_FABRIC_MODEL_GUIDANCE_PER_COMPONENT,
  MAX_FABRIC_MODEL_GUIDANCE_REGISTRATIONS,
  MAX_FABRIC_MODEL_GUIDANCE_SNAPSHOT_CHARS,
  MAX_FABRIC_MODEL_GUIDANCE_TOTAL_CHARS,
  createFabricPersistedExecutionDetails,
  piFabric as default,
  executionOutcomeFromError,
  isFabricExecutionTraceOperationV1,
  isFabricExecutionTraceV1,
  projectFabricAuditArgs,
  projectFabricAuditResult,
  readFabricExecutionRenderDetails,
  readFabricExecutionTraceV1,
  readFabricPeerAwaitSettleRequestV1,
  readFabricPeerCardsRequestV1,
  readFabricPrewalkRequestV1,
  readFabricToolResultProxyDetailsV1
};
//# sourceMappingURL=index.js.map
