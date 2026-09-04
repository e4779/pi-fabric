import {
  ActorManager,
  AgentManager,
  FabricControlPlane,
  LifecycleBroker,
  MeshStore,
  ParticipantDirectory,
  actorParticipantRecord,
  agentParticipantRecords,
  lifecycleSourceIdentity,
  useBudgetLedger
} from "./chunk-LHW2QGKS.js";
import {
  parseFabricOwnedModelGuidance,
  resolveFabricModelGuidance
} from "./chunk-BH2VUB62.js";
import {
  RESIDENT_HOST_FORMAT,
  residentDeliveryPrefix,
  residentHostId
} from "./chunk-2JELHSX5.js";
import {
  writeJsonAtomic
} from "./chunk-LU4SNIHE.js";

// src/residency/host.ts
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
var REQUEST_POLL_MS = 50;
var IDLE_EXIT_MS = 3e4;
var COMPLETION_MAX_CHARS = 8e3;
var delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var atomicWrite = (filePath, value) => {
  writeJsonAtomic(filePath, value, { space: 2 });
};
var readJson = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return void 0;
  }
};
var errorMessage = (error) => error instanceof Error ? error.message : String(error);
var processAlive = (pid) => {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error instanceof Error && "code" in error && error.code === "EPERM";
  }
};
var ResidentHostAlreadyRunning = class extends Error {
};
var parseResidentHostConfigPath = (argv) => {
  const index = argv.indexOf("--config");
  const value = index >= 0 ? argv[index + 1] : void 0;
  if (!value) throw new Error("Missing resident host argument: --config");
  return path.resolve(value);
};
var validateResidentHostConfig = (value, configPath) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Invalid Fabric resident host config");
  }
  const config = value;
  if (config.format !== RESIDENT_HOST_FORMAT || typeof config.rootId !== "string" || typeof config.sessionId !== "string" || typeof config.cwd !== "string" || typeof config.projectRoot !== "string" || typeof config.meshRoot !== "string" || typeof config.actorRoot !== "string" || typeof config.residencyRoot !== "string" || typeof config.fullCodeMode !== "boolean" || typeof config.agents !== "object" || config.agents === null || typeof config.mesh !== "object" || config.mesh === null || typeof config.retention !== "object" || config.retention === null || typeof config.workerPath !== "string" || typeof config.fabricExtensionPath !== "string" || typeof config.piBinary !== "string" || typeof config.claudeBinary !== "string" || typeof config.vedaBinary !== "string") {
    throw new Error("Fabric resident host config is incomplete");
  }
  if (path.resolve(config.residencyRoot) !== path.dirname(configPath)) {
    throw new Error("Fabric resident host config is outside its residency root");
  }
  if (!config.mesh.enabled) throw new Error("Durable residency requires the Fabric mesh");
  return config;
};
var ResidentHost = class {
  constructor(config, onIdle = () => {
  }) {
    this.config = config;
    this.onIdle = onIdle;
    this.hostId = residentHostId(config.rootId);
    this.identity = { id: this.hostId, name: "Fabric resident host", kind: "agent" };
    this.#ownerPath = path.join(config.residencyRoot, "owner.json");
    this.#lockPath = path.join(config.residencyRoot, "host.lock");
    this.#errorPath = path.join(config.residencyRoot, "error.json");
    this.#requestsPath = path.join(config.residencyRoot, "requests");
    this.#processingPath = path.join(config.residencyRoot, "processing");
    this.#responsesPath = path.join(config.residencyRoot, "responses");
    this.#agentsPath = path.join(config.residencyRoot, "agents");
    this.#deliveryPrefix = residentDeliveryPrefix(config.rootId);
    this.mesh = new MeshStore(config.meshRoot, config.mesh.maxEventBytes, config.mesh.maxReadEvents);
    this.participants = new ParticipantDirectory(this.mesh, {
      enabled: true,
      hostId: this.hostId,
      rootId: config.rootId,
      identity: this.identity
    });
    this.control = new FabricControlPlane(this.mesh, this.identity, {
      enabled: true,
      hostId: this.hostId,
      pollMs: config.mesh.actorPollMs
    });
    if (config.agents.budgetUsd > 0) {
      const budgetFile = path.join(config.residencyRoot, "budget.jsonl");
      fs.mkdirSync(path.dirname(budgetFile), { recursive: true, mode: 448 });
      if (!fs.existsSync(budgetFile)) fs.writeFileSync(budgetFile, "", { mode: 384 });
      useBudgetLedger({
        budget: config.agents.budgetUsd,
        file: budgetFile,
        id: this.hostId
      });
    }
    const guidanceConfigPath = path.join(config.residencyRoot, "config.json");
    const currentModelGuidance = () => {
      const current = readJson(guidanceConfigPath);
      return parseFabricOwnedModelGuidance(current?.modelGuidance ?? config.modelGuidance);
    };
    this.agents = new AgentManager(config.cwd, config.agents, {
      workerPath: config.workerPath,
      fabricExtensionPath: config.fabricExtensionPath,
      piBinary: config.piBinary,
      claudeBinary: config.claudeBinary,
      vedaBinary: config.vedaBinary,
      runRoot: path.join(config.residencyRoot, "runs"),
      fullCodeMode: config.fullCodeMode,
      mainAgentId: config.rootId,
      meshRoot: config.meshRoot,
      projectRoot: config.projectRoot,
      hostId: this.hostId,
      identityId: this.identity.id,
      retention: config.retention,
      resolveParticipantGuidance: ({ model }) => {
        if (!model) return void 0;
        return resolveFabricModelGuidance(currentModelGuidance(), {
          model,
          target: "participant",
          includeSlots: false
        }).appendText || void 0;
      },
      onLifecycle: (event) => void this.lifecycle?.publish(event).catch(() => void 0),
      onBackgroundComplete: (result) => {
        if (!config.agents.notifyOnComplete) return;
        const durationMs = Math.max(0, (result.finishedAt ?? Date.now()) - result.startedAt);
        const summary = (result.text || result.error || "no result").slice(0, COMPLETION_MAX_CHARS);
        void this.#queueDelivery(
          { id: result.id, name: result.name, kind: "agent" },
          `Fabric agent ${result.id.slice(0, 8)} ${result.status} after ${Math.round(durationMs / 1e3)}s: ${summary}`,
          "followUp",
          true,
          result
        ).catch(() => void 0);
      }
    });
    const canManageActor = (id) => {
      const participant = this.participants.get(id);
      return participant ? participant.ownerHostId === this.hostId : void 0;
    };
    const lineageAlive = (rootId) => this.participants.get(rootId) !== void 0;
    this.actors = new ActorManager(
      config.sessionId,
      this.identity,
      this.mesh,
      config.mesh,
      this.agents,
      ({ actor, message, delivery, triggerTurn }) => {
        if (!message.text) return;
        const mode = delivery === "steer" ? "steer" : "followUp";
        const triggers = delivery === "nextTurn" ? false : triggerTurn;
        void this.#queueDelivery(
          { id: actor.id, name: actor.name, kind: "actor" },
          message.text,
          mode,
          triggers,
          message.data
        ).catch(() => void 0);
      },
      {
        actorRoot: config.actorRoot,
        persistent: true,
        canManageActor,
        lineageAlive,
        claimResidency: "durable",
        rootId: config.rootId,
        meshCursorPath: path.join(config.residencyRoot, "actor-mesh-cursor.json"),
        retention: config.retention
      }
    );
    this.lifecycle = new LifecycleBroker(
      this.mesh,
      this.identity,
      this.participants,
      {
        enabled: true,
        pollMs: config.mesh.actorPollMs,
        maxReadEvents: config.mesh.maxReadEvents
      },
      (subscription, event) => this.#deliverLifecycle(subscription, event)
    );
  }
  hostId;
  identity;
  mesh;
  participants;
  control;
  agents;
  actors;
  lifecycle;
  #ownerPath;
  #lockPath;
  #errorPath;
  #requestsPath;
  #processingPath;
  #responsesPath;
  #agentsPath;
  #deliveryPrefix;
  #token = randomUUID();
  #requestTimer;
  #pollingRequests = false;
  #closed = false;
  #started = false;
  #idleSince = Date.now();
  async start() {
    if (this.#started) return;
    this.#acquireLock();
    this.#started = true;
    fs.mkdirSync(this.#requestsPath, { recursive: true, mode: 448 });
    fs.mkdirSync(this.#processingPath, { recursive: true, mode: 448 });
    fs.mkdirSync(this.#responsesPath, { recursive: true, mode: 448 });
    fs.mkdirSync(this.#agentsPath, { recursive: true, mode: 448 });
    this.#recoverInterruptedRequests();
    const firstSeenAgents = /* @__PURE__ */ new Map();
    this.participants.registerSource(
      () => agentParticipantRecords(
        this.agents.listForUi(),
        this.config.rootId,
        this.hostId,
        this.identity.id,
        this.config.rootId,
        firstSeenAgents
      )
    );
    this.participants.registerSource(
      () => this.actors.listOwned().map(
        (actor) => actorParticipantRecord(
          actor,
          this.config.rootId,
          this.hostId,
          this.identity.id,
          this.config.rootId
        )
      )
    );
    this.agents.subscribeUi(() => this.participants.scheduleRefresh());
    this.actors.subscribe(() => this.participants.scheduleRefresh());
    this.control.start((command, from, signal) => this.#acceptControl(command, from, signal));
    await this.participants.start().catch(() => void 0);
    this.lifecycle.start();
    this.#requestTimer = setInterval(
      () => void this.#pollRequests().catch(() => void 0),
      REQUEST_POLL_MS
    );
    const now = Date.now();
    const owner = {
      format: RESIDENT_HOST_FORMAT,
      hostId: this.hostId,
      pid: process.pid,
      token: this.#token,
      startedAt: now,
      readyAt: now
    };
    atomicWrite(this.#ownerPath, owner);
    fs.rmSync(this.#errorPath, { force: true });
    await this.#pollRequests();
  }
  async close() {
    if (this.#closed) return;
    this.#closed = true;
    if (this.#requestTimer) clearInterval(this.#requestTimer);
    this.#requestTimer = void 0;
    while (this.#pollingRequests) await delay(10);
    await this.participants.quiesce().catch(() => void 0);
    await this.lifecycle.close().catch(() => void 0);
    await this.control.close().catch(() => void 0);
    try {
      await this.actors.close();
    } finally {
      await this.agents.close();
      await this.participants.close().catch(() => void 0);
      this.#releaseLock();
    }
  }
  async #acceptControl(command, _from, signal) {
    if (command.operation === "cancel") {
      return { accepted: false, error: "Cancel commands are handled by the control plane" };
    }
    if (command.operation === "stop") {
      try {
        await this.agents.stop(command.targetId);
        this.participants.scheduleRefresh();
        return { accepted: true, messageId: command.commandId };
      } catch (error) {
        if (!(error instanceof Error && /Unknown Fabric agent/.test(error.message))) {
          return { accepted: false, error: errorMessage(error) };
        }
      }
      try {
        if (!this.actors.owns(command.targetId)) {
          return { accepted: false, error: `Resident host does not own ${command.targetId}` };
        }
        await this.actors.stop(command.targetId);
        this.participants.scheduleRefresh();
        return { accepted: true, messageId: command.commandId };
      } catch (error) {
        return { accepted: false, error: errorMessage(error) };
      }
    }
    const message = command.message?.trim();
    if (!message) return { accepted: false, error: "Fabric control message must not be empty" };
    if (command.operation === "ask") {
      try {
        if (!this.actors.owns(command.targetId)) {
          return { accepted: false, error: `Resident host does not own ${command.targetId}` };
        }
        const result = await this.actors.ask(
          command.targetId,
          message,
          command.data,
          signal,
          command.binding !== void 0 ? { binding: command.binding } : {}
        );
        return { accepted: true, messageId: result.id, result };
      } catch (error) {
        return { accepted: false, error: errorMessage(error) };
      }
    }
    try {
      this.agents.status(command.targetId);
      const result = command.operation === "steer" ? this.agents.steer(command.targetId, message, command.data) : this.agents.followUp(command.targetId, message, command.data);
      return { accepted: true, messageId: result.messageId };
    } catch (error) {
      if (!(error instanceof Error && /Unknown Fabric agent/.test(error.message))) {
        return { accepted: false, error: errorMessage(error) };
      }
    }
    try {
      if (!this.actors.owns(command.targetId)) {
        return { accepted: false, error: `Resident host does not own ${command.targetId}` };
      }
      const result = this.actors.tell(
        command.targetId,
        message,
        command.data,
        command.binding !== void 0 ? { binding: command.binding } : {}
      );
      return { accepted: true, messageId: result.messageId };
    } catch (error) {
      return { accepted: false, error: errorMessage(error) };
    }
  }
  async #deliverLifecycle(subscription, event) {
    const message = `Fabric lifecycle ${event.event} from ${event.source.name} (${event.source.id})${event.status ? ` with status ${event.status}` : ""}.`;
    if (subscription.to === this.config.rootId) {
      await this.#queueDelivery(
        lifecycleSourceIdentity(event.source),
        message,
        subscription.delivery,
        subscription.triggerTurn,
        event
      );
      return;
    }
    try {
      this.agents.status(subscription.to);
      if (subscription.delivery === "steer") this.agents.steer(subscription.to, message, event);
      else this.agents.followUp(subscription.to, message, event);
      return;
    } catch (error) {
      if (!(error instanceof Error && /Unknown Fabric agent/.test(error.message))) throw error;
    }
    try {
      if (this.actors.owns(subscription.to)) {
        this.actors.tell(subscription.to, message, event);
        return;
      }
    } catch {
    }
    const target = this.participants.get(subscription.to);
    if (!target) throw new Error(`Unknown Fabric lifecycle target: ${subscription.to}`);
    await this.control.request(
      target.ownerHostId,
      target.id,
      subscription.delivery,
      { message, data: event, triggerTurn: subscription.triggerTurn },
      target.ownerIdentityId
    );
  }
  async #queueDelivery(from, message, delivery, triggerTurn, data) {
    const id = randomUUID();
    const record = {
      format: RESIDENT_HOST_FORMAT,
      id,
      rootId: this.config.rootId,
      from,
      delivery,
      triggerTurn,
      message,
      ...data === void 0 ? {} : { data },
      createdAt: Date.now()
    };
    try {
      await this.mesh.put({
        key: `${this.#deliveryPrefix}${id}`,
        value: record,
        identity: this.identity,
        ifVersion: 0
      });
    } catch {
      await this.mesh.put({
        key: `${this.#deliveryPrefix}${id}`,
        value: {
          ...record,
          message: message.slice(0, Math.max(1, this.config.mesh.eventContextChars)),
          data: { fabricTruncated: true }
        },
        identity: this.identity,
        ifVersion: 0
      });
    }
  }
  async #pollRequests() {
    if (this.#pollingRequests || this.#closed) return;
    this.#pollingRequests = true;
    try {
      let entries;
      try {
        entries = fs.readdirSync(this.#requestsPath).filter((entry) => entry.endsWith(".json"));
      } catch {
        return;
      }
      for (const entry of entries.slice(0, 32)) {
        const source = path.join(this.#requestsPath, entry);
        const processing = path.join(this.#processingPath, entry);
        try {
          fs.renameSync(source, processing);
        } catch {
          continue;
        }
        await this.#processRequest(processing);
      }
    } finally {
      this.#pollingRequests = false;
      this.#checkIdle();
    }
  }
  #checkIdle() {
    const activeActor = this.actors.listOwned().some((actor) => actor.residency === "durable" && actor.status !== "stopped");
    const activeAgent = this.agents.listForUi().some((agent) => agent.status === "queued" || agent.status === "running");
    let pendingRequest = false;
    try {
      pendingRequest = fs.readdirSync(this.#requestsPath).some((entry) => entry.endsWith(".json"));
    } catch {
    }
    if (activeActor || activeAgent || pendingRequest) {
      this.#idleSince = Date.now();
      return;
    }
    if (Date.now() - this.#idleSince >= IDLE_EXIT_MS) this.onIdle();
  }
  async #processRequest(filePath) {
    const command = readJson(filePath);
    const requestId = command?.requestId ?? path.basename(filePath, ".json");
    let response;
    try {
      if (command?.format !== RESIDENT_HOST_FORMAT || command.rootId !== this.config.rootId || command.requestId !== requestId) {
        throw new Error("Invalid Fabric residency request");
      }
      if (command.operation === "spawn") {
        if (command.request.sessionSeed || command.request.sessionFile || command.request.actorId || command.request.actorName || command.request.meshRoot || command.request.runnerSessionId || command.request.systemPrompt || command.request.images) {
          throw new Error("Durable agents.spawn accepts only its public task and run settings");
        }
        const handle = await this.agents.spawn({ ...command.request, residency: "durable" });
        this.agents.detachSignal(handle.id);
        const runDirectory = this.agents.runDirectory(handle.id);
        if (!runDirectory) throw new Error(`Resident agent ${handle.id} has no run directory`);
        const worktreeGitRoot = this.agents.worktreeGitRoot(handle.id);
        const metadata = {
          format: RESIDENT_HOST_FORMAT,
          rootId: this.config.rootId,
          id: handle.id,
          runDirectory,
          handle: { ...handle, residency: "durable" },
          ...worktreeGitRoot ? { worktreeGitRoot } : {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        atomicWrite(path.join(this.#agentsPath, `${handle.id}.json`), metadata);
        response = {
          format: RESIDENT_HOST_FORMAT,
          requestId,
          ok: true,
          handle: metadata.handle,
          completedAt: Date.now()
        };
      } else if (command.operation === "foreground") {
        this.agents.markForeground(command.id);
        response = {
          format: RESIDENT_HOST_FORMAT,
          requestId,
          ok: true,
          completedAt: Date.now()
        };
      } else if (command.operation === "cleanup") {
        await this.agents.wait(command.id);
        await this.agents.cleanup(command.id, command.deleteBranch);
        fs.rmSync(path.join(this.#agentsPath, `${command.id}.json`), { force: true });
        response = {
          format: RESIDENT_HOST_FORMAT,
          requestId,
          ok: true,
          completedAt: Date.now()
        };
      } else if (command.operation === "createActor") {
        if (command.request.residency !== "durable") {
          throw new Error("Resident host createActor only supports durable residency");
        }
        const actor = await this.actors.create(command.request, { asRegistryOwner: true });
        response = {
          format: RESIDENT_HOST_FORMAT,
          requestId,
          ok: true,
          actor,
          completedAt: Date.now()
        };
      } else {
        if (!this.actors.owns(command.id)) {
          throw new Error(`Resident host does not own ${command.id}`);
        }
        await this.actors.remove(command.id);
        response = {
          format: RESIDENT_HOST_FORMAT,
          requestId,
          ok: true,
          completedAt: Date.now()
        };
      }
    } catch (error) {
      response = {
        format: RESIDENT_HOST_FORMAT,
        requestId,
        ok: false,
        error: errorMessage(error),
        completedAt: Date.now()
      };
    }
    atomicWrite(path.join(this.#responsesPath, `${requestId}.json`), response);
    fs.rmSync(filePath, { force: true });
    this.participants.scheduleRefresh();
  }
  #recoverInterruptedRequests() {
    let entries;
    try {
      entries = fs.readdirSync(this.#processingPath).filter((entry) => entry.endsWith(".json"));
    } catch {
      return;
    }
    for (const entry of entries) {
      const requestId = path.basename(entry, ".json");
      const response = {
        format: RESIDENT_HOST_FORMAT,
        requestId,
        ok: false,
        error: "Fabric residency outcome is indeterminate after resident host restart",
        completedAt: Date.now()
      };
      atomicWrite(path.join(this.#responsesPath, entry), response);
      fs.rmSync(path.join(this.#processingPath, entry), { force: true });
    }
  }
  #acquireLock() {
    fs.mkdirSync(this.config.residencyRoot, { recursive: true, mode: 448 });
    const existing = readJson(this.#ownerPath);
    if (existing && processAlive(existing.pid)) {
      throw new ResidentHostAlreadyRunning(`Fabric resident host is already running (${existing.pid})`);
    }
    try {
      const descriptor = fs.openSync(this.#lockPath, "wx", 384);
      fs.writeFileSync(descriptor, JSON.stringify({ token: this.#token, pid: process.pid }));
      fs.closeSync(descriptor);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "EEXIST") {
        const locked = readJson(this.#lockPath);
        if (typeof locked?.pid === "number" && processAlive(locked.pid)) {
          throw new ResidentHostAlreadyRunning(`Fabric resident host is starting (${locked.pid})`);
        }
        fs.rmSync(this.#lockPath, { force: true });
        const descriptor = fs.openSync(this.#lockPath, "wx", 384);
        fs.writeFileSync(descriptor, JSON.stringify({ token: this.#token, pid: process.pid }));
        fs.closeSync(descriptor);
      } else {
        throw error;
      }
    }
  }
  #releaseLock() {
    const lock = readJson(this.#lockPath);
    if (lock?.token === this.#token) fs.rmSync(this.#lockPath, { force: true });
    const owner = readJson(this.#ownerPath);
    if (owner?.token === this.#token) fs.rmSync(this.#ownerPath, { force: true });
  }
};
var runResidentHost = async (config, signal) => {
  let finishIdle;
  const idle = new Promise((resolve) => {
    finishIdle = resolve;
  });
  const host = new ResidentHost(config, () => finishIdle?.());
  await host.start();
  if (signal?.aborted) {
    await host.close();
    return;
  }
  await Promise.race([
    idle,
    new Promise((resolve) => {
      const finish = () => resolve();
      signal?.addEventListener("abort", finish, { once: true });
      process.once("SIGTERM", finish);
      process.once("SIGINT", finish);
    })
  ]);
  await host.close();
};
var runResidentHostFromConfigPath = async (configPath, signal) => {
  let config;
  try {
    config = validateResidentHostConfig(readJson(configPath), configPath);
    await runResidentHost(config, signal);
  } catch (error) {
    if (error instanceof ResidentHostAlreadyRunning) return;
    const residencyRoot = config?.residencyRoot ?? path.dirname(configPath);
    try {
      atomicWrite(path.join(residencyRoot, "error.json"), {
        error: errorMessage(error),
        occurredAt: Date.now()
      });
    } catch {
    }
    throw error;
  }
};
var isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const configPath = parseResidentHostConfigPath(process.argv);
  try {
    await runResidentHostFromConfigPath(configPath);
  } catch {
    process.exitCode = 1;
  }
}

export {
  runResidentHostFromConfigPath
};
//# sourceMappingURL=chunk-VEYAJ2O5.js.map
