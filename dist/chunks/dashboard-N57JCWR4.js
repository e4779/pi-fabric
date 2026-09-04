import {
  FabricModelSelector
} from "./chunk-NLBLNR5A.js";
import {
  INHERIT_VALUE
} from "./chunk-FPAFHMEI.js";
import {
  coreToolTitle,
  formatActorDataPreview,
  formatClock,
  formatDuration,
  formatJsonAsYaml,
  formatTokens,
  highlightCode,
  highlightFileLines,
  isActiveStatus,
  languageFromPath,
  nestedEditDiff,
  orderAgentsByCreation,
  padToWidth,
  renderBoundedLines,
  renderCoreToolBody,
  safeText,
  spinnerFrame,
  wrapPlainText
} from "./chunk-USXAEFZ2.js";
import "./chunk-MJNWCLRJ.js";
import {
  formatFabricEffectConflict
} from "./chunk-PM3ESBLM.js";
import {
  FABRIC_ACTOR_HOST_EVENTS
} from "./chunk-QOOWAB5D.js";
import {
  THINKING_LEVELS,
  isFabricThinking,
  thinkingLabel
} from "./chunk-XCYTQGH2.js";
import "./chunk-4IZKKHJM.js";

// src/ui/dashboard.ts
import {
  Editor,
  getKeybindings as getKeybindings3,
  Key,
  matchesKey,
  truncateToWidth as truncateToWidth4,
  visibleWidth as visibleWidth4
} from "@earendil-works/pi-tui";

// src/ui/topology.ts
import { createHash } from "node:crypto";
var UNPHASED = Symbol("fabric-run-topology-unphased");
var SYSTEM_TOPICS = /* @__PURE__ */ new Set([
  "fabric.actor.input",
  "fabric.actor.output",
  "fabric.actor.lifecycle",
  "fabric.compact",
  "fabric.participant.lifecycle",
  "fabric.steer",
  "fabric.control.command",
  "fabric.control.ack"
]);
var IGNORED_ROUTE_TOPICS = /* @__PURE__ */ new Set([
  "fabric.actor.lifecycle",
  "fabric.compact",
  "fabric.control.ack"
]);
var eventData = (event) => typeof event.data === "object" && event.data !== null && !Array.isArray(event.data) ? event.data : void 0;
var failureEventKinds = /* @__PURE__ */ new Set([
  "error",
  "failed",
  "failure",
  "blocked",
  "reject",
  "rejected"
]);
var routeStatus = (kind) => kind.toLowerCase().split(/[.:/_-]+/).some((part) => failureEventKinds.has(part)) ? "failed" : "completed";
var projectMeshRoutes = (main, actors, agents, events) => {
  const actorByKey = /* @__PURE__ */ new Map();
  for (const actor of actors) {
    actorByKey.set(actor.id, actor);
    actorByKey.set(actor.name, actor);
  }
  const agentByKey = /* @__PURE__ */ new Map();
  for (const agent of agents) {
    agentByKey.set(agent.id, agent);
    agentByKey.set(agent.name, agent);
  }
  const mainByKey = /* @__PURE__ */ new Map([
    [main.id, main.name],
    [main.name, main.name],
    ["main", main.name]
  ]);
  for (const event of events) {
    if (event.from.kind !== "main") continue;
    mainByKey.set(event.from.id, event.from.name);
    mainByKey.set(event.from.name, event.from.name);
  }
  const routes = /* @__PURE__ */ new Map();
  for (const event of events) {
    if (IGNORED_ROUTE_TOPICS.has(event.topic)) continue;
    const data = eventData(event);
    let targetId;
    let targetName;
    let targetKind;
    const actorInputId = event.topic === "fabric.actor.input" && typeof data?.actorId === "string" ? data.actorId : void 0;
    const controlTarget = event.topic === "fabric.control.command" && typeof data?.targetId === "string" ? data.targetId : void 0;
    const addressed = controlTarget ?? event.to ?? actorInputId;
    const targetMain = addressed ? mainByKey.get(addressed) : void 0;
    const targetActor = addressed ? actorByKey.get(addressed) : void 0;
    const targetAgent = addressed ? agentByKey.get(addressed) : void 0;
    if (targetMain) {
      targetId = addressed;
      targetName = targetMain;
      targetKind = "main";
    } else if (targetActor) {
      targetId = targetActor.id;
      targetName = targetActor.name;
      targetKind = "actor";
    } else if (targetAgent) {
      targetId = targetAgent.id;
      targetName = targetAgent.name;
      targetKind = "agent";
    } else if (addressed) {
      targetId = addressed;
      targetName = addressed;
      targetKind = "agent";
    } else if (event.topic === "fabric.actor.output") {
      targetId = main.id;
      targetName = main.name;
      targetKind = "main";
    } else {
      targetId = event.topic;
      targetName = event.topic;
      targetKind = "topic";
    }
    const key = JSON.stringify([
      event.from.id,
      event.from.kind,
      targetKind,
      targetId,
      event.topic,
      event.kind
    ]);
    const existing = routes.get(key);
    if (existing) {
      existing.count++;
      if (event.createdAt >= existing.lastAt) {
        existing.lastAt = event.createdAt;
        if (event.text) existing.text = event.text;
        else delete existing.text;
      }
      if (routeStatus(event.kind) === "failed") existing.status = "failed";
      continue;
    }
    routes.set(key, {
      id: `route:${createHash("sha256").update(key).digest("hex").slice(0, 20)}`,
      fromId: event.from.id,
      fromName: event.from.name,
      fromKind: event.from.kind,
      targetId,
      targetName,
      targetKind,
      topic: event.topic,
      kind: event.kind,
      status: routeStatus(event.kind),
      count: 1,
      lastAt: event.createdAt,
      ...event.text ? { text: event.text } : {}
    });
  }
  return [...routes.values()].sort((left, right) => right.lastAt - left.lastAt);
};
var projectMeshParticipants = (agents, routes, directoryParticipants) => {
  const agentByKey = /* @__PURE__ */ new Map();
  for (const agent of agents) {
    agentByKey.set(agent.id, agent);
    agentByKey.set(agent.name, agent);
  }
  const observed = /* @__PURE__ */ new Map();
  const touch = (id, name, lastSeenAt, participant) => {
    const existing = observed.get(id);
    if (!existing) {
      observed.set(id, {
        id,
        name,
        lastSeenAt,
        ...participant ? { participant } : {}
      });
      return;
    }
    if (lastSeenAt >= existing.lastSeenAt) {
      existing.name = name;
      existing.lastSeenAt = lastSeenAt;
    }
    if (participant) existing.participant = participant;
  };
  for (const participant of directoryParticipants) {
    const name = participant.kind === "root" && participant.sessionId ? `Peer ${participant.sessionId.slice(0, 8)}` : participant.name;
    touch(participant.id, name, participant.updatedAt, participant);
  }
  for (const route of routes) {
    if (route.fromKind === "agent") touch(route.fromId, route.fromName, route.lastAt);
    if (route.targetKind === "agent") touch(route.targetId, route.targetName, route.lastAt);
  }
  return [...observed.values()].map((identity) => {
    const agent = agentByKey.get(identity.id) ?? agentByKey.get(identity.name);
    const routesForParticipant = routes.reduce(
      (count, route) => count + (route.fromKind === "agent" && route.fromId === identity.id || route.targetKind === "agent" && route.targetId === identity.id ? route.count : 0),
      0
    );
    return {
      id: identity.id,
      entityId: agent ? `agent:${agent.id}` : `participant:${identity.id}`,
      name: agent?.name ?? identity.name,
      status: agent?.status ?? "idle",
      routes: routesForParticipant,
      lastSeenAt: identity.lastSeenAt,
      ...agent ? { agent } : {},
      ...identity.participant ? { participant: identity.participant } : {}
    };
  }).sort(
    (left, right) => Number(isActiveStatus(right.status)) - Number(isActiveStatus(left.status)) || left.name.localeCompare(right.name)
  );
};
var projectParticipantTree = (participants) => {
  const byId = new Map(participants.map((participant) => [participant.id, participant]));
  const children = /* @__PURE__ */ new Map();
  const roots = [];
  for (const participant of participants) {
    const parentId = participant.participant?.parentId ?? participant.agent?.parentId;
    if (!parentId || !byId.has(parentId) || parentId === participant.id) {
      roots.push(participant);
      continue;
    }
    const entries = children.get(parentId) ?? [];
    entries.push(participant);
    children.set(parentId, entries);
  }
  const rows = [];
  const visited = /* @__PURE__ */ new Set();
  const visit = (participant, ancestorLast, isLast) => {
    if (visited.has(participant.id)) return;
    visited.add(participant.id);
    rows.push({ participant, ancestorLast, isLast });
    const descendants = (children.get(participant.id) ?? []).filter(
      (candidate) => !visited.has(candidate.id)
    );
    for (let index = 0; index < descendants.length; index++) {
      const descendant = descendants[index];
      if (descendant) {
        visit(descendant, [...ancestorLast, isLast], index === descendants.length - 1);
      }
    }
  };
  for (let index = 0; index < roots.length; index++) {
    const root = roots[index];
    if (root) visit(root, [], index === roots.length - 1);
  }
  for (const participant of participants) {
    if (!visited.has(participant.id)) visit(participant, [], true);
  }
  return rows;
};
var projectMeshTopics = (actors, events, now) => {
  const names = /* @__PURE__ */ new Set();
  for (const actor of actors) {
    for (const topic of actor.topics) names.add(topic);
  }
  for (const event of events) {
    if (!SYSTEM_TOPICS.has(event.topic)) names.add(event.topic);
  }
  return [...names].sort((left, right) => left.localeCompare(right)).map((name) => {
    const topicEvents = events.filter((event) => event.topic === name);
    const lastEventAt = topicEvents.reduce(
      (latest, event) => Math.max(latest, event.createdAt),
      0
    );
    const subscribers = actors.filter((actor) => actor.topics.includes(name)).map((actor) => ({ id: actor.id, name: actor.name, status: actor.status }));
    return {
      id: `topic:${name}`,
      name,
      status: lastEventAt > 0 && now - lastEventAt <= 1e4 ? "running" : "idle",
      system: SYSTEM_TOPICS.has(name),
      subscribers,
      recentEvents: topicEvents.length,
      ...lastEventAt > 0 ? { lastEventAt } : {}
    };
  });
};
var buildProjectMeshTopology = (input) => {
  const topics = projectMeshTopics(input.actors, input.events, input.now);
  const routes = projectMeshRoutes(input.main, input.actors, input.agents, input.events);
  const localActorIds = new Set(input.actors.map((actor) => actor.id));
  const directoryParticipants = (input.participants ?? []).filter(
    (participant) => participant.id !== input.main.id && !(participant.kind === "actor" && localActorIds.has(participant.id))
  );
  const participants = projectMeshParticipants(input.agents, routes, directoryParticipants);
  const rows = [
    {
      kind: "meshRoot",
      entityId: `main:${input.main.id}`,
      main: input.main,
      actors: input.actors.length,
      agents: participants.length,
      topics: topics.length,
      state: input.state.length,
      routes: routes.length
    }
  ];
  if (input.actors.length > 0) {
    rows.push({ kind: "meshSection", label: "Persistent actors", count: input.actors.length });
    for (const actor of input.actors) {
      rows.push({ kind: "meshActor", entityId: `actor:${actor.id}`, actor });
    }
  }
  if (participants.length > 0) {
    rows.push({
      kind: "meshSection",
      label: "Project participants",
      count: participants.length
    });
    for (const entry of projectParticipantTree(participants)) {
      rows.push({
        kind: "meshAgent",
        entityId: entry.participant.entityId,
        participant: entry.participant,
        ancestorLast: entry.ancestorLast,
        isLast: entry.isLast
      });
    }
  }
  if (topics.length > 0) {
    rows.push({ kind: "meshSection", label: "Topics", count: topics.length });
    for (const topic of topics) {
      rows.push({ kind: "meshTopic", entityId: topic.id, topic });
      for (let index = 0; index < topic.subscribers.length; index++) {
        const subscriber = topic.subscribers[index];
        if (!subscriber) continue;
        rows.push({
          kind: "meshLink",
          relation: "subscribes",
          sourceId: subscriber.id,
          sourceName: subscriber.name,
          targetId: topic.id,
          targetName: topic.name,
          status: subscriber.status,
          isLast: index === topic.subscribers.length - 1
        });
      }
    }
  }
  if (input.state.length > 0) {
    rows.push({ kind: "meshSection", label: "Shared state", count: input.state.length });
    for (const state of input.state) {
      rows.push({ kind: "meshState", entityId: `state:${state.key}`, state });
    }
  }
  if (routes.length > 0) {
    rows.push({ kind: "meshSection", label: "Recent routes", count: routes.length });
    for (const route of routes) {
      rows.push({ kind: "meshRoute", entityId: route.id, route });
    }
  }
  const entityOrder = rows.flatMap(
    (row) => "entityId" in row ? [row.entityId] : []
  );
  return { participants, topics, routes, rows, entityOrder };
};

// src/ui/dashboard-model.ts
var entityGroupOrder = [
  "agent",
  "peer",
  "actor",
  "globalActor",
  "tool",
  "extension",
  "mcp",
  "mesh",
  "task",
  "custom",
  "state",
  "component",
  "meshParticipant",
  "meshTopic",
  "meshRoute"
];
var entityGroupLabels = {
  agent: "Agents",
  peer: "Peers",
  actor: "Actors",
  globalActor: "Global templates",
  tool: "Tools",
  extension: "Extensions",
  mcp: "MCP",
  mesh: "Mesh",
  task: "Tasks",
  custom: "Custom items",
  state: "Shared state",
  component: "Components",
  meshParticipant: "Project participants",
  meshTopic: "Topics",
  meshRoute: "Recent routes"
};
var entityGroupKind = (entity) => {
  if (entity.kind === "main" || entity.kind === "agent") return "agent";
  if (entity.kind === "peer") return "peer";
  if (entity.kind === "actor") return "actor";
  if (entity.kind === "globalActor") return "globalActor";
  if (entity.kind === "state") return "state";
  if (entity.kind === "component") return "component";
  if (entity.kind === "meshParticipant") return "meshParticipant";
  if (entity.kind === "meshTopic") return "meshTopic";
  if (entity.kind === "meshRoute") return "meshRoute";
  if (entity.kind === "call") return entity.value.entityKind ?? entity.value.kind;
  return entity.value.kind;
};
var entityGroupRanks = new Map(
  entityGroupOrder.map((kind, index) => [kind, index])
);
var orderEntitiesByGroup = (entities) => entities.map((entity, index) => ({ entity, index })).sort(
  (left, right) => (entityGroupRanks.get(entityGroupKind(left.entity)) ?? Number.MAX_SAFE_INTEGER) - (entityGroupRanks.get(entityGroupKind(right.entity)) ?? Number.MAX_SAFE_INTEGER) || left.index - right.index
).map(({ entity }) => entity);
var groupEntities = (entities) => {
  const indexed = entities.map((entity, index) => ({ entity, index }));
  return entityGroupOrder.flatMap((kind) => {
    const entries = indexed.filter(({ entity }) => entityGroupKind(entity) === kind);
    return entries.length > 0 ? [{ kind, label: entityGroupLabels[kind], entries }] : [];
  });
};
var filters = ["all", "active", "completed", "failed"];
var linkedEntityId = (entityId, id) => Boolean(entityId && (id.startsWith(entityId) || entityId.startsWith(id)));
var linkedAgent = (call, agent) => linkedEntityId(call.entityId, agent.id);
var agentLaunchRefs = /* @__PURE__ */ new Set(["agents.run", "agents.spawn"]);
var mainEntity = (snapshot) => ({
  id: `main:${snapshot.main.id}`,
  kind: "main",
  label: "Main",
  status: snapshot.main.status,
  value: snapshot.main
});
var UNPHASED_PANEL_ID = "__fabric_unphased";
var SESSION_PANEL_ID = "__fabric_session";
var callsForPanel = (run, panel) => {
  if (!run || panel.kind === "session") return [];
  return run.calls.filter(
    (call) => panel.kind === "unphased" ? !call.phaseId : call.phaseId === panel.id
  );
};
var itemsForPanel = (run, panel) => {
  if (!run || panel.kind === "session") return [];
  return run.items.filter(
    (item) => panel.kind === "unphased" ? !item.phaseId : item.phaseId === panel.id
  );
};
var entitiesFor = (snapshot, run, panel) => {
  if (!panel || panel.kind === "session") {
    const unlinkedAgents = orderAgentsByCreation(snapshot.agents).filter((agent) => agent.runId !== run?.id && isActiveStatus(agent.status)).map((agent) => ({
      id: `agent:${agent.id}`,
      kind: "agent",
      label: agent.name,
      status: agent.status,
      value: agent
    }));
    const peers = snapshot.peers.map((peer) => ({
      id: `peer:${peer.id}`,
      kind: "peer",
      label: peer.name,
      status: peer.status,
      value: peer
    }));
    const actors = snapshot.actors.map((actor) => ({
      id: `actor:${actor.id}`,
      kind: "actor",
      label: actor.name,
      status: actor.lastError ? "failed" : actor.status,
      value: actor
    }));
    const globalActors = snapshot.globalActors.map((definition) => ({
      id: `globalActor:${definition.id}`,
      kind: "globalActor",
      label: definition.name,
      status: "global",
      value: definition
    }));
    const components = snapshot.componentGraph.components.map((component) => ({
      id: `component:${component.id}`,
      kind: "component",
      label: component.id,
      status: component.state,
      value: component
    }));
    const state = snapshot.state.map((entry) => ({
      id: `state:${entry.key}`,
      kind: "state",
      label: entry.label,
      status: entry.status,
      value: entry
    }));
    return orderEntitiesByGroup([
      mainEntity(snapshot),
      ...unlinkedAgents,
      ...peers,
      ...actors,
      ...globalActors,
      ...components,
      ...state
    ]);
  }
  const calls = callsForPanel(run, panel);
  const panelAgents = orderAgentsByCreation(snapshot.agents).filter((agent) => {
    const ownedByPanel = agent.runId === run?.id && (panel.kind === "unphased" ? !agent.phaseId : agent.phaseId === panel.id);
    return ownedByPanel || !agent.runId && calls.some((call) => linkedAgent(call, agent));
  });
  const linkedAgents = panelAgents.map((agent) => ({
    id: `agent:${agent.id}`,
    kind: "agent",
    label: agent.name,
    status: agent.status,
    value: agent
  }));
  const visibleCalls = calls.filter((call) => {
    const representedAgentLaunch = call.kind === "agent" && agentLaunchRefs.has(call.ref) && panelAgents.some((agent) => linkedAgent(call, agent));
    const representedActorCreation = call.kind === "actor" && call.ref === "agents.create" && snapshot.actors.some((actor) => linkedEntityId(call.entityId, actor.id));
    return !representedAgentLaunch && !representedActorCreation;
  }).map((call) => ({
    id: `call:${call.id}`,
    kind: "call",
    label: call.label,
    status: call.status,
    value: call
  }));
  const items = itemsForPanel(run, panel).map((item) => ({
    id: `item:${item.id}`,
    kind: "item",
    label: item.label,
    status: item.status,
    value: item
  }));
  return orderEntitiesByGroup([
    mainEntity(snapshot),
    ...linkedAgents,
    ...visibleCalls,
    ...items
  ]);
};
var projectMeshEntitiesFor = (snapshot, topology) => {
  const model = topology ?? buildProjectMeshTopology({
    main: snapshot.main,
    actors: snapshot.actors,
    agents: snapshot.agents,
    state: snapshot.state,
    events: snapshot.events,
    ...snapshot.participants ? { participants: snapshot.participants } : {},
    now: snapshot.now
  });
  const entities = model.rows.flatMap((row) => {
    if (row.kind === "meshRoot") return [mainEntity(snapshot)];
    if (row.kind === "meshActor") {
      return [{
        id: row.entityId,
        kind: "actor",
        label: row.actor.name,
        status: row.actor.lastError ? "failed" : row.actor.status,
        value: row.actor
      }];
    }
    if (row.kind === "meshAgent") {
      if (row.participant.agent) {
        return [{
          id: row.entityId,
          kind: "agent",
          label: row.participant.agent.name,
          status: row.participant.agent.status,
          value: row.participant.agent
        }];
      }
      return [{
        id: row.entityId,
        kind: "meshParticipant",
        label: row.participant.name,
        status: row.participant.status,
        value: row.participant
      }];
    }
    if (row.kind === "meshTopic") {
      return [{
        id: row.entityId,
        kind: "meshTopic",
        label: row.topic.name,
        status: row.topic.status,
        value: row.topic
      }];
    }
    if (row.kind === "meshState") {
      return [{
        id: row.entityId,
        kind: "state",
        label: row.state.label,
        status: row.state.status,
        value: row.state
      }];
    }
    if (row.kind === "meshRoute") {
      return [{
        id: row.entityId,
        kind: "meshRoute",
        label: `${row.route.fromName} \u2192 ${row.route.targetName}`,
        status: row.route.status,
        value: row.route
      }];
    }
    return [];
  });
  return [
    ...entities,
    ...snapshot.componentGraph.components.map((component) => ({
      id: `component:${component.id}`,
      kind: "component",
      label: component.id,
      status: component.state,
      value: component
    }))
  ];
};
var unifiedTopologyEntitiesFor = (snapshot, run, topology) => {
  const orderedAgents = orderAgentsByCreation(snapshot.agents).sort(
    (left, right) => Number(right.runId === run?.id) - Number(left.runId === run?.id) || Number(isActiveStatus(right.status)) - Number(isActiveStatus(left.status))
  );
  const canonical = [
    mainEntity(snapshot),
    ...orderedAgents.map((agent) => ({
      id: `agent:${agent.id}`,
      kind: "agent",
      label: agent.name,
      status: agent.status,
      value: agent
    })),
    ...snapshot.actors.map((actor) => ({
      id: `actor:${actor.id}`,
      kind: "actor",
      label: actor.name,
      status: actor.lastError ? "failed" : actor.status,
      value: actor
    })),
    ...snapshot.peers.map((peer) => ({
      id: `peer:${peer.id}`,
      kind: "peer",
      label: peer.name,
      status: peer.status,
      value: peer
    }))
  ];
  const seen = new Set(canonical.map((entity) => entity.id));
  const seenParticipantIds = /* @__PURE__ */ new Set([
    snapshot.main.id,
    ...snapshot.agents.map((agent) => agent.id),
    ...snapshot.actors.map((actor) => actor.id),
    ...snapshot.peers.map((peer) => peer.id)
  ]);
  for (const entity of projectMeshEntitiesFor(snapshot, topology)) {
    if (seen.has(entity.id)) continue;
    if (entity.kind === "meshParticipant" && seenParticipantIds.has(entity.value.id)) continue;
    seen.add(entity.id);
    canonical.push(entity);
  }
  return canonical;
};
var entitiesForOverview = (snapshot, run, panel, view, projectMesh) => {
  if (view === "topology") return unifiedTopologyEntitiesFor(snapshot, run, projectMesh);
  return entitiesFor(snapshot, run, panel);
};
var panelStatus = (entities, fallback) => {
  if (entities.some((entity) => ["failed", "timed_out", "error"].includes(entity.status))) {
    return "failed";
  }
  if (entities.some((entity) => entity.status === "blocked")) return "blocked";
  if (entities.some((entity) => isActiveStatus(entity.status))) return "running";
  if (entities.length > 0 && entities.every(
    (entity) => ["completed", "done", "stopped", "cancelled", "global", "idle", "state"].includes(
      entity.status
    )
  )) {
    return "completed";
  }
  return fallback;
};
var withPanelProgress = (snapshot, run, panel, projectedEntities) => {
  const entities = projectedEntities ?? entitiesFor(snapshot, run, panel);
  const progressEntities = panel.kind === "session" ? entities : entities.filter((entity) => entity.kind !== "main");
  const status = panel.kind === "session" ? progressEntities.some(
    (entity) => ["failed", "timed_out", "error"].includes(entity.status)
  ) ? "failed" : progressEntities.some((entity) => isActiveStatus(entity.status)) ? "running" : "idle" : panelStatus(progressEntities, panel.status);
  const agents = progressEntities.filter((entity) => entity.kind === "agent");
  const tokens = agents.reduce(
    (sum, entity) => sum + (entity.kind === "agent" && entity.value.usage ? entity.value.usage.input + entity.value.usage.output : 0),
    0
  );
  const starts = progressEntities.flatMap((entity) => {
    if (entity.kind === "agent" || entity.kind === "call") return [entity.value.startedAt ?? 0];
    if (entity.kind === "item") return [entity.value.createdAt];
    return [];
  }).filter((value) => value > 0);
  const startedAt = starts.length > 0 ? Math.min(...starts) : void 0;
  const hasActive = progressEntities.some((entity) => isActiveStatus(entity.status));
  const finishes = progressEntities.flatMap((entity) => {
    if (entity.kind === "agent" || entity.kind === "call") return [entity.value.finishedAt ?? 0];
    if (entity.kind === "item") return [entity.value.finishedAt ?? 0];
    return [];
  }).filter((value) => value > 0);
  const finishedAt = hasActive ? snapshot.now : finishes.length > 0 ? Math.max(...finishes) : void 0;
  return {
    ...panel,
    status,
    completed: progressEntities.filter(
      (entity) => entity.status === "completed" || entity.status === "done"
    ).length,
    total: Math.max(panel.total, progressEntities.length),
    ...agents.length > 0 ? { agents: agents.length } : {},
    ...tokens > 0 ? { tokens } : {},
    ...startedAt && finishedAt ? { elapsedMs: Math.max(0, finishedAt - startedAt) } : {}
  };
};
var activityEntitiesByPanel = (snapshot, run) => {
  const calls = /* @__PURE__ */ new Map();
  const items = /* @__PURE__ */ new Map();
  const agents = /* @__PURE__ */ new Map();
  const keyFor = (phaseId) => phaseId ?? UNPHASED_PANEL_ID;
  for (const call of run.calls) {
    const key = keyFor(call.phaseId);
    const bucket = calls.get(key) ?? [];
    bucket.push(call);
    calls.set(key, bucket);
  }
  for (const item of run.items) {
    const key = keyFor(item.phaseId);
    const bucket = items.get(key) ?? [];
    bucket.push(item);
    items.set(key, bucket);
  }
  const detachedAgents = [];
  for (const agent of snapshot.agents) {
    if (agent.runId === run.id) {
      const key = keyFor(agent.phaseId);
      const bucket = agents.get(key) ?? /* @__PURE__ */ new Map();
      bucket.set(agent.id, agent);
      agents.set(key, bucket);
    } else if (!agent.runId) {
      detachedAgents.push(agent);
    }
  }
  if (detachedAgents.length > 0) {
    for (const [key, panelCalls] of calls) {
      for (const call of panelCalls) {
        for (const agent of detachedAgents) {
          if (!linkedAgent(call, agent)) continue;
          const bucket = agents.get(key) ?? /* @__PURE__ */ new Map();
          bucket.set(agent.id, agent);
          agents.set(key, bucket);
        }
      }
    }
  }
  const keys = /* @__PURE__ */ new Set([
    UNPHASED_PANEL_ID,
    ...run.phases.map((phase) => phase.id)
  ]);
  const projected = /* @__PURE__ */ new Map();
  for (const key of keys) {
    const panelAgents = [...agents.get(key)?.values() ?? []];
    const agentEntities = panelAgents.map((agent) => ({
      id: `agent:${agent.id}`,
      kind: "agent",
      label: agent.name,
      status: agent.status,
      value: agent
    }));
    const callEntities = (calls.get(key) ?? []).filter((call) => {
      const representedAgentLaunch = call.kind === "agent" && agentLaunchRefs.has(call.ref) && panelAgents.some((agent) => linkedAgent(call, agent));
      const representedActorCreation = call.kind === "actor" && call.ref === "agents.create" && snapshot.actors.some((actor) => linkedEntityId(call.entityId, actor.id));
      return !representedAgentLaunch && !representedActorCreation;
    }).map((call) => ({
      id: `call:${call.id}`,
      kind: "call",
      label: call.label,
      status: call.status,
      value: call
    }));
    const itemEntities = (items.get(key) ?? []).map((item) => ({
      id: `item:${item.id}`,
      kind: "item",
      label: item.label,
      status: item.status,
      value: item
    }));
    projected.set(key, [...agentEntities, ...callEntities, ...itemEntities]);
  }
  return projected;
};
var phasePanels = (snapshot, run) => {
  const panels = [];
  const activityEntities = run ? activityEntitiesByPanel(snapshot, run) : /* @__PURE__ */ new Map();
  if (run) {
    const runActivity = {
      id: UNPHASED_PANEL_ID,
      name: "Run activity",
      status: run.status,
      completed: 0,
      total: 0,
      kind: "unphased"
    };
    if ((activityEntities.get(UNPHASED_PANEL_ID)?.length ?? 0) > 0) panels.push(runActivity);
  }
  panels.push(
    ...run?.phases.map((phase) => ({
      id: phase.id,
      name: phase.name,
      status: phase.status,
      completed: 0,
      total: phase.total ?? 0,
      phase,
      kind: "phase"
    })) ?? []
  );
  const session = {
    id: SESSION_PANEL_ID,
    name: "Project participants & shared state",
    status: "idle",
    completed: 0,
    total: 0,
    kind: "session"
  };
  const sessionEntities = entitiesFor(snapshot, run, session);
  if (sessionEntities.length > 0 || panels.length === 0) panels.push(session);
  return panels.map(
    (panel) => withPanelProgress(
      snapshot,
      run,
      panel,
      panel.kind === "session" ? sessionEntities : activityEntities.get(panel.id) ?? []
    )
  );
};
var matchesFilter = (status, filter) => {
  if (filter === "all") return true;
  if (filter === "active") return isActiveStatus(status);
  if (filter === "completed") return status === "completed" || status === "done";
  return status === "failed" || status === "timed_out" || status === "blocked" || status === "error";
};
var tokensFor = (snapshot, run) => snapshot.agents.filter((agent) => !run || agent.runId === run.id).reduce(
  (sum, agent) => sum + (agent.usage ? agent.usage.input + agent.usage.output : 0),
  0
);

// src/ui/dashboard-presentation.ts
var statusGlyph = (status) => {
  if (status === "completed" || status === "done") return "\u2713";
  if (status === "failed" || status === "timed_out" || status === "error") return "\u2717";
  if (status === "blocked") return "!";
  if (status === "stopped" || status === "cancelled") return "\u25A0";
  if (status === "queued" || status === "pending" || status === "ready") return "\u25CB";
  if (status === "idle" || status === "state") return "\xB7";
  if (status === "global") return "\u25C7";
  return spinnerFrame();
};
var colorStatus = (theme, status, value) => {
  if (status === "completed" || status === "done") return theme.fg("success", value);
  if (status === "failed" || status === "timed_out" || status === "error") {
    return theme.fg("error", value);
  }
  if (status === "blocked" || status === "warning") return theme.fg("warning", value);
  if (status === "running" || status === "in_progress") return theme.fg("accent", value);
  if (status === "global") return theme.fg("muted", value);
  return theme.fg("dim", value);
};
var entityTail = (entity, now) => {
  if (entity.kind === "main") {
    const main = entity.value;
    return [
      "host Pi",
      main.model,
      main.thinking,
      main.pendingMessages ? "messages queued" : void 0,
      main.local ? void 0 : "remote"
    ].filter((value) => Boolean(value)).join(" \xB7 ");
  }
  if (entity.kind === "agent") {
    const agent = entity.value;
    const narrative = safeText(agent.error ?? agent.text).slice(0, 140);
    const summary = agent.status === "blocked" && narrative ? `needs input: ${narrative}` : (agent.status === "failed" || agent.status === "timed_out") && narrative ? `error: ${narrative}` : agent.status === "completed" && narrative ? `result: ${narrative}` : agent.currentTool ?? (agent.status === "running" ? "thinking" : void 0);
    const parts = [
      summary,
      agent.runner,
      agent.model,
      agent.usage ? `${formatTokens(agent.usage.input + agent.usage.output)} tok` : void 0,
      agent.toolCalls !== void 0 ? `${agent.toolCalls} tools` : void 0,
      agent.startedAt ? formatDuration((agent.finishedAt ?? now) - agent.startedAt) : void 0
    ];
    return parts.filter((value) => Boolean(value)).join(" \xB7 ");
  }
  if (entity.kind === "actor") {
    const actor = entity.value;
    return [
      actor.runner,
      actor.model ?? actor.worker?.model,
      actor.worker?.currentTool,
      actor.worker?.usage ? `${formatTokens(actor.worker.usage.input + actor.worker.usage.output)} tok` : void 0,
      `${actor.messages} msg`,
      actor.queued > 0 ? `q:${actor.queued}` : void 0
    ].filter((value) => Boolean(value)).join(" \xB7 ");
  }
  if (entity.kind === "globalActor") {
    const def = entity.value;
    return [
      "global template",
      def.runner,
      def.model ?? "inherit",
      def.responseMode === "directive" ? "directive" : void 0,
      def.delivery !== "mailbox" ? def.delivery : void 0
    ].filter((value) => Boolean(value)).join(" \xB7 ");
  }
  if (entity.kind === "call") {
    const call = entity.value;
    return [
      call.ref,
      call.progress,
      call.metrics?.tokens !== void 0 ? `${formatTokens(call.metrics.tokens)} tok` : void 0,
      call.metrics?.toolCalls !== void 0 ? `${call.metrics.toolCalls} tools` : void 0,
      formatDuration((call.finishedAt ?? now) - call.startedAt)
    ].filter((value) => Boolean(value)).join(" \xB7 ");
  }
  if (entity.kind === "item") {
    const item = entity.value;
    return [
      item.current ?? item.detail,
      item.total !== void 0 ? `${item.completed ?? 0}/${item.total}` : void 0
    ].filter((value) => Boolean(value)).join(" \xB7 ");
  }
  if (entity.kind === "peer") {
    const peer = entity.value;
    return [peer.sessionId, peer.model, `${formatDuration(Math.max(0, now - peer.updatedAt))} ago`].filter((value) => Boolean(value)).join(" \xB7 ");
  }
  if (entity.kind === "meshParticipant") {
    const participant = entity.value;
    return [
      participant.participant ? `project ${participant.participant.kind}` : "observed mesh agent",
      `${participant.routes} route${participant.routes === 1 ? "" : "s"}`,
      `${formatDuration(Math.max(0, now - participant.lastSeenAt))} ago`
    ].join(" \xB7 ");
  }
  if (entity.kind === "meshTopic") {
    const topic = entity.value;
    return [
      `${topic.subscribers.length} subscriber${topic.subscribers.length === 1 ? "" : "s"}`,
      topic.recentEvents > 0 ? `${topic.recentEvents} recent event${topic.recentEvents === 1 ? "" : "s"}` : void 0,
      topic.lastEventAt ? `${formatDuration(Math.max(0, now - topic.lastEventAt))} ago` : void 0
    ].filter((value) => Boolean(value)).join(" \xB7 ");
  }
  if (entity.kind === "meshRoute") {
    const route = entity.value;
    return [
      route.kind,
      route.topic,
      route.count > 1 ? `\xD7${route.count}` : void 0,
      `${formatDuration(Math.max(0, now - route.lastAt))} ago`
    ].filter((value) => Boolean(value)).join(" \xB7 ");
  }
  if (entity.kind === "component") {
    return [
      entity.value.guarantee,
      entity.value.parentId ? `child of ${entity.value.parentId}` : void 0,
      (entity.value.effects?.length ?? 0) > 0 ? `${entity.value.effects.length} effects` : void 0,
      entity.value.requirements.length > 0 ? `${entity.value.requirements.length} requirements` : void 0,
      entity.value.provisions.length > 0 ? `${entity.value.provisions.length} provisions` : void 0
    ].filter((value) => Boolean(value)).join(" \xB7 ");
  }
  return [entity.value.owner, entity.value.detail, `v${entity.value.version}`].filter((value) => Boolean(value)).join(" \xB7 ");
};

// src/ui/dashboard-detail.ts
import {
  Markdown,
  truncateToWidth as truncateToWidth2,
  wrapTextWithAnsi,
  visibleWidth as visibleWidth2
} from "@earendil-works/pi-tui";

// src/ui/state-file-preview.ts
import fs from "node:fs";
import path from "node:path";
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
var MAX_FILE_BYTES = 64 * 1024;
var MAX_FILE_LINES = 240;
var CACHE_LIMIT = 64;
var cache = /* @__PURE__ */ new Map();
var candidatePath = (entry) => {
  const value = entry.value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value;
    const candidate = record.file ?? record.path;
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return entry.key.startsWith("state/complexity/") ? entry.key.slice("state/complexity/".length) : void 0;
};
var inside = (root, candidate) => {
  const relative = path.relative(root, candidate);
  return relative === "" || !relative.startsWith(`..${path.sep}`) && relative !== "..";
};
var loadStateFilePreview = (entry, cwd) => {
  const candidate = candidatePath(entry);
  if (!candidate || path.isAbsolute(candidate) || !cwd) return void 0;
  try {
    const root = fs.realpathSync(cwd);
    const absolute = fs.realpathSync(path.resolve(root, candidate));
    if (!inside(root, absolute)) return void 0;
    const stat = fs.statSync(absolute);
    if (!stat.isFile()) return void 0;
    const cacheKey = `${absolute}\0${stat.mtimeMs}\0${stat.size}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      cache.delete(cacheKey);
      cache.set(cacheKey, cached);
      return cached;
    }
    const bytes = Math.min(stat.size, MAX_FILE_BYTES);
    const descriptor = fs.openSync(absolute, "r");
    const buffer = Buffer.alloc(bytes);
    try {
      if (bytes > 0) fs.readSync(descriptor, buffer, 0, bytes, 0);
    } finally {
      fs.closeSync(descriptor);
    }
    if (buffer.includes(0)) return void 0;
    const decoded = buffer.toString("utf8").replace(/\r\n?/g, "\n");
    const allLines = decoded.split("\n");
    const boundedLines = allLines.slice(0, MAX_FILE_LINES);
    const preview = {
      path: (path.relative(root, absolute) || path.basename(absolute)).split(path.sep).join("/"),
      absolutePath: absolute,
      language: languageFromPath(absolute) ?? "text",
      content: boundedLines.join("\n"),
      lines: boundedLines,
      truncated: stat.size > bytes || allLines.length > boundedLines.length
    };
    cache.set(cacheKey, preview);
    while (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value);
    return preview;
  } catch {
    return void 0;
  }
};
var renderStateFilePreview = (preview, theme, width, maxLines, invalidate) => {
  if (width <= 0 || maxLines <= 0) return [];
  const shown = preview.lines.slice(0, maxLines);
  const fileLines = highlightFileLines(
    preview.absolutePath,
    preview.language,
    0,
    shown.length,
    invalidate
  );
  const fileVerified = fileLines !== null && fileLines.every((line, index) => line.raw === (shown[index] ?? "").replace(/\t/g, "    "));
  const highlighted = fileVerified ? fileLines.map((line) => line.ansi || " ") : highlightCode(shown.join("\n"), preview.language, invalidate) ?? shown.map((line) => theme.fg("mdCodeBlock", safeText(line) || " "));
  const digits = String(Math.max(1, shown.length)).length;
  const output = highlighted.map((line, index) => {
    const gutter = theme.fg("dim", `${String(index + 1).padStart(digits)} \u2502 `);
    return truncateToWidth(gutter + line, width, "");
  });
  if ((preview.truncated || preview.lines.length > shown.length) && output.length < maxLines) {
    const omitted = Math.max(0, preview.lines.length - shown.length);
    const label = omitted > 0 ? `\u2026 ${omitted}+ lines omitted` : "\u2026 file truncated";
    output.push(truncateToWidth(theme.fg("dim", label), width, ""));
  }
  return output.filter((line) => visibleWidth(line) <= width);
};

// src/ui/dashboard-detail.ts
var transcriptMarkdownTheme = (theme, invalidate) => ({
  heading: (text) => theme.fg("mdHeading", text),
  link: (text) => theme.fg("mdLink", text),
  linkUrl: (text) => theme.fg("mdLinkUrl", text),
  code: (text) => theme.fg("mdCode", text),
  codeBlock: (text) => theme.fg("mdCodeBlock", text),
  codeBlockBorder: (text) => theme.fg("mdCodeBlockBorder", text),
  quote: (text) => theme.fg("mdQuote", text),
  quoteBorder: (text) => theme.fg("mdQuoteBorder", text),
  hr: (text) => theme.fg("mdHr", text),
  listBullet: (text) => theme.fg("mdListBullet", text),
  bold: (text) => theme.bold(text),
  italic: (text) => theme.italic(text),
  underline: (text) => theme.underline(text),
  strikethrough: (text) => theme.strikethrough(text),
  highlightCode: (code, lang) => highlightCode(code, lang ?? "", invalidate) ?? code.split("\n").map((line) => theme.fg("mdCodeBlock", line))
});
var TRANSCRIPT_EXPANDED_TOOL_LINES = 40;
var TRANSCRIPT_STRUCTURED_LINES = 40;
var safeMarkdownText = (value) => value.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b-\u000c\u000e-\u001f\u007f-\u009f]/g, " ");
var DashboardDetailRenderer = class {
  constructor(tui, theme, snapshot, options) {
    this.tui = tui;
    this.theme = theme;
    this.snapshot = snapshot;
    this.agentTranscript = options.agentTranscript;
    this.actorTranscript = options.actorTranscript;
    this.codePreviewSettings = options.codePreviewSettings;
    this.actorDefaultTools = options.actorDefaultTools;
  }
  detailView = "summary";
  detailScroll = 0;
  detailMaxScroll = 0;
  transcriptPageAnchor;
  transcriptFollowing = true;
  transcriptToolsExpanded = false;
  actionHint = "";
  toolToggleHint = "";
  transcriptMarkdown = /* @__PURE__ */ new Map();
  highlightInvalidate = () => this.tui.requestRender();
  agentTranscript;
  actorTranscript;
  codePreviewSettings;
  actorDefaultTools;
  render(width, snapshot, entity, state, actionHint, toolToggleHint) {
    this.detailView = state.view;
    this.detailScroll = state.scroll;
    this.transcriptPageAnchor = state.pageAnchor;
    this.transcriptFollowing = state.transcriptFollowing;
    this.transcriptToolsExpanded = state.transcriptToolsExpanded;
    this.actionHint = actionHint;
    this.toolToggleHint = toolToggleHint;
    const lines = this.renderDetail(width, snapshot, entity);
    return {
      lines,
      scroll: this.detailScroll,
      maxScroll: this.detailMaxScroll,
      pageAnchor: this.transcriptPageAnchor
    };
  }
  invalidate() {
    this.transcriptMarkdown.clear();
  }
  detailActionHint(_entity) {
    return this.actionHint;
  }
  transcriptToolToggleHint() {
    return this.toolToggleHint;
  }
  transcriptTarget(entity) {
    if (entity.kind === "agent" || entity.kind === "actor") return entity.value;
    return void 0;
  }
  hasTranscript(entity) {
    return entity.kind === "agent" && this.agentTranscript !== void 0 || entity.kind === "actor" && this.actorTranscript !== void 0;
  }
  transcriptFor(entity) {
    if (entity.kind === "agent") {
      return this.agentTranscript?.(entity.value, this.transcriptFollowing);
    }
    if (entity.kind === "actor") {
      return this.actorTranscript?.(entity.value, this.transcriptFollowing);
    }
    return void 0;
  }
  renderDetail(width, snapshot, entity) {
    if (width < 24) return this.renderNarrowDetail(width, snapshot, entity);
    const innerWidth = width - 2;
    const transcriptView = (entity.kind === "agent" || entity.kind === "actor") && this.detailView === "transcript";
    const actionLines = wrapPlainText(this.detailActionHint(entity), Math.max(1, innerWidth - 2), 3);
    const viewLabel = transcriptView ? ` \xB7 transcript \xB7 ${isActiveStatus(entity.status) ? "live" : entity.status}` : "";
    const kindLabel = entity.kind === "main" ? "main agent" : entity.kind === "peer" ? "peer session" : entity.kind === "meshParticipant" ? "project participant" : entity.kind === "meshTopic" ? "topic" : entity.kind === "meshRoute" ? "route" : entity.kind;
    const lines = [this.topBorder(width, `${kindLabel} \xB7 ${entity.label}${viewLabel}`)];
    const content = transcriptView ? this.transcriptLines(entity, innerWidth) : this.detailLines(entity, innerWidth, snapshot.now, snapshot.main.cwd ?? process.cwd());
    const terminalRows = this.tui.terminal?.rows ?? process.stdout.rows ?? 28;
    const maxBody = Math.max(1, Math.min(24, terminalRows - 8 - actionLines.length));
    const maxScroll = Math.max(0, content.length - maxBody);
    this.detailMaxScroll = maxScroll;
    if (transcriptView && this.transcriptFollowing) {
      this.detailScroll = maxScroll;
    } else if (transcriptView && this.transcriptPageAnchor) {
      this.detailScroll = this.transcriptPageAnchor === "end" ? maxScroll : 0;
      this.transcriptPageAnchor = void 0;
    } else {
      this.detailScroll = Math.max(0, Math.min(this.detailScroll, maxScroll));
    }
    const visible = content.slice(this.detailScroll, this.detailScroll + maxBody);
    for (const line of visible) lines.push(this.row(width, line));
    while (lines.length < maxBody + 1) lines.push(this.row(width, ""));
    lines.push(this.middleBorder(width));
    const range = content.length > maxBody ? ` \xB7 ${this.detailScroll + 1}-${Math.min(content.length, this.detailScroll + maxBody)}/${content.length}` : "";
    const navigation = transcriptView ? `\u2191\u2193/jk lazy scroll \xB7 ${this.transcriptToolToggleHint()} \xB7 g page top \xB7 G follow:${this.transcriptFollowing ? "on" : "off"}/live tail \xB7 t summary \xB7 esc back${range}` : `\u2191\u2193/jk scroll \xB7 ${this.hasTranscript(entity) ? "t transcript \xB7 " : ""}esc back${range}`;
    lines.push(this.row(width, this.theme.fg("dim", navigation)));
    for (const actionLine of actionLines) {
      lines.push(this.row(width, this.theme.fg("muted", `  ${actionLine}`)));
    }
    lines.push(this.bottomBorder(width));
    return lines.map((line) => truncateToWidth2(line, width, ""));
  }
  transcriptLines(entity, width) {
    const transcript = this.transcriptFor(entity);
    const transcriptCwd = entity.kind === "agent" ? entity.value.cwd : entity.kind === "actor" ? entity.value.worker?.cwd : void 0;
    if (!transcript || transcript.entries.length === 0) {
      return [
        this.theme.fg(
          "dim",
          isActiveStatus(entity.status) ? "Waiting for streamed agent activity\u2026" : "No retained transcript is available for this agent or actor."
        )
      ];
    }
    const lines = [];
    if (transcript.hasMore ?? transcript.truncated) {
      lines.push(this.theme.fg("dim", "\u2191 older activity available \xB7 scroll past the top to load"));
    }
    let firstTool = true;
    for (const entry of transcript.entries) {
      if (entry.kind === "tool") {
        if (this.transcriptToolsExpanded && !firstTool) lines.push("");
        firstTool = false;
        lines.push(...this.transcriptToolLines(entry, width, transcriptCwd));
        continue;
      }
      const glyph = entry.kind === "assistant" ? this.theme.fg("accent", "\u25C6") : entry.kind === "user" ? this.theme.fg("muted", "\u203A") : entry.kind === "error" ? this.theme.fg("error", "\u2717") : colorStatus(
        this.theme,
        entry.status ?? "completed",
        statusGlyph(entry.status ?? "completed")
      );
      lines.push(
        truncateToWidth2(
          `${glyph} ${this.theme.fg(
            entry.kind === "assistant" ? "accent" : "muted",
            safeText(entry.label)
          )}`,
          width,
          ""
        )
      );
      if (!entry.text) continue;
      if (entry.kind === "assistant" || entry.kind === "user") {
        lines.push(
          ...this.markdownTranscriptLines(
            this.transcriptTarget(entity)?.id ?? entity.id,
            entry.id,
            entry.text,
            width
          )
        );
        continue;
      }
      for (const paragraph of entry.text.split("\n")) {
        const wrapped = wrapPlainText(paragraph, Math.max(1, width - 2), 1e4);
        for (const line of wrapped) lines.push(truncateToWidth2(`  ${line}`, width, ""));
      }
    }
    if (transcript.hasNewer) {
      lines.push(this.theme.fg("dim", "\u2193 newer activity available \xB7 scroll past the bottom to load"));
    }
    return lines;
  }
  transcriptToolLines(entry, width, transcriptCwd) {
    const depth = Math.max(0, entry.depth ?? 0);
    const padding = "  ".repeat(depth);
    const bodyPadding = `${padding}  `;
    const glyph = colorStatus(
      this.theme,
      entry.status ?? "completed",
      statusGlyph(entry.status ?? "completed")
    );
    const status = entry.status === "running" ? " \xB7 running" : entry.status === "failed" ? " \xB7 failed" : "";
    const audit = this.transcriptToolAudit(entry);
    const context = this.codePreviewSettings ? {
      cwd: transcriptCwd ?? this.snapshot().main.cwd ?? process.cwd(),
      settings: this.codePreviewSettings,
      invalidate: this.highlightInvalidate
    } : void 0;
    const title = context ? coreToolTitle(audit, this.theme, context) : null;
    const headline = title ?? this.theme.fg("toolTitle", this.theme.bold(entry.toolName ?? entry.label));
    const collapsedSummary = !this.transcriptToolsExpanded && entry.text ? ` \xB7 ${safeText(entry.text).replace(/\s+/g, " ").trim()}` : "";
    const lines = [
      truncateToWidth2(
        `${padding}${glyph} ${headline}${this.theme.fg("dim", `${status}${collapsedSummary}`)}`,
        width,
        ""
      )
    ];
    if (!this.transcriptToolsExpanded) return lines;
    const rendered = context ? renderCoreToolBody(audit, this.theme, {
      ...context,
      expanded: true,
      maxLines: TRANSCRIPT_EXPANDED_TOOL_LINES
    }) : null;
    if (rendered) {
      for (const row of renderBoundedLines(
        rendered.lines,
        this.theme,
        this.codePreviewSettings?.diffIntensity ?? "off"
      ).render(Math.max(1, width - visibleWidth2(bodyPadding)))) {
        lines.push(truncateToWidth2(`${bodyPadding}${row}`, width, ""));
      }
      if (rendered.hidden > 0) {
        lines.push(this.theme.fg("dim", `${bodyPadding}\u2026 ${rendered.hidden} more lines`));
      }
      return lines;
    }
    if (entry.args && Object.keys(entry.args).length > 0) {
      lines.push(...this.transcriptStructuredLines("input", entry.args, width, bodyPadding));
    } else if (entry.text) {
      for (const row of wrapPlainText(
        entry.text,
        Math.max(1, width - visibleWidth2(bodyPadding)),
        1e4
      )) {
        lines.push(truncateToWidth2(`${bodyPadding}${row}`, width, ""));
      }
    }
    if (entry.result !== void 0) {
      lines.push(...this.transcriptStructuredLines("result", entry.result, width, bodyPadding));
    }
    return lines;
  }
  transcriptToolAudit(entry) {
    const rawName = entry.toolName ?? entry.label;
    const normalizedName = rawName.toLowerCase();
    const tool = normalizedName === "glob" ? "find" : ["read", "write", "edit", "bash", "grep", "find", "ls"].includes(normalizedName) ? normalizedName : rawName;
    const rawArgs = entry.args ?? {};
    const args = { ...rawArgs };
    if (typeof rawArgs.file_path === "string" && typeof args.path !== "string") {
      args.path = rawArgs.file_path;
    }
    if (tool === "edit" && !Array.isArray(args.edits)) {
      const oldText = typeof rawArgs.old_string === "string" ? rawArgs.old_string : void 0;
      const newText = typeof rawArgs.new_string === "string" ? rawArgs.new_string : void 0;
      if (oldText !== void 0 && newText !== void 0) args.edits = [{ oldText, newText }];
    }
    return {
      ref: typeof tool === "string" ? `pi.${tool}` : `tool.${rawName}`,
      provider: "pi",
      tool,
      ...Object.keys(args).length > 0 ? { args } : {},
      ...entry.result !== void 0 ? { result: entry.result } : {},
      ...entry.status !== "running" ? { success: entry.status !== "failed" } : {}
    };
  }
  transcriptStructuredLines(label, value, width, padding) {
    const yaml = formatJsonAsYaml(value) ?? safeText(value);
    if (!yaml) return [];
    const yamlLines = yaml.split("\n");
    const shownYamlLines = yamlLines.slice(0, TRANSCRIPT_STRUCTURED_LINES);
    const highlighted = highlightCode(shownYamlLines.join("\n"), "yaml", this.highlightInvalidate) ?? shownYamlLines.map((line) => this.theme.fg("mdCodeBlock", line || " "));
    const lines = [truncateToWidth2(`${padding}${this.theme.fg("dim", `${label}:`)}`, width, "")];
    const nestedPadding = `${padding}  `;
    for (const row of highlighted) {
      for (const wrapped of wrapTextWithAnsi(row, Math.max(1, width - visibleWidth2(nestedPadding)))) {
        lines.push(truncateToWidth2(`${nestedPadding}${wrapped}`, width, ""));
        if (lines.length > TRANSCRIPT_STRUCTURED_LINES) break;
      }
      if (lines.length > TRANSCRIPT_STRUCTURED_LINES) break;
    }
    const hiddenLines = Math.max(0, yamlLines.length - shownYamlLines.length);
    if (hiddenLines > 0) {
      lines.push(this.theme.fg("dim", `${nestedPadding}\u2026 ${hiddenLines} more lines`));
    }
    return lines;
  }
  markdownTranscriptLines(agentId, entryId, text, width) {
    return this.markdownLines(`transcript:${agentId}:${entryId}`, text, width);
  }
  markdownLines(key, text, width, indent = 2) {
    const markdown = safeMarkdownText(text);
    if (!markdown.trim()) return [];
    let cached = this.transcriptMarkdown.get(key);
    if (!cached || cached.text !== markdown) {
      cached = {
        text: markdown,
        component: new Markdown(
          markdown,
          0,
          0,
          transcriptMarkdownTheme(this.theme, () => {
            this.transcriptMarkdown.delete(key);
            this.tui.requestRender();
          })
        )
      };
      this.transcriptMarkdown.delete(key);
      this.transcriptMarkdown.set(key, cached);
      while (this.transcriptMarkdown.size > 128) {
        const oldest = this.transcriptMarkdown.keys().next().value;
        if (!oldest) break;
        this.transcriptMarkdown.delete(oldest);
      }
    }
    const padding = " ".repeat(Math.max(0, indent));
    return cached.component.render(Math.max(1, width - visibleWidth2(padding))).map((line) => truncateToWidth2(`${padding}${line}`, width, ""));
  }
  detailLines(entity, width, now, cwd) {
    const lines = [];
    const field = (label, value) => {
      const text = safeText(value);
      if (!text) return;
      const prefix = `${this.theme.fg("dim", `${label}:`)} `;
      const wrapped = wrapPlainText(text, Math.max(1, width - visibleWidth2(prefix)), 12);
      if (wrapped[0]) lines.push(truncateToWidth2(prefix + wrapped[0], width));
      for (const continuation of wrapped.slice(1)) {
        lines.push(truncateToWidth2(" ".repeat(visibleWidth2(prefix)) + continuation, width));
      }
    };
    const markdownField = (label, value, key) => {
      if (!value?.trim()) return;
      lines.push(this.theme.fg("dim", `${label}:`));
      lines.push(...this.markdownLines(`detail:${entity.id}:${key}`, value, width));
    };
    const structuredField = (label, value) => {
      if (value === void 0) return;
      const yaml = formatJsonAsYaml(value);
      if (yaml === void 0) {
        field(label, value);
        return;
      }
      lines.push(this.theme.fg("dim", `${label}:`));
      const highlighted = highlightCode(yaml, "yaml", this.highlightInvalidate) ?? yaml.split("\n").map((line) => this.theme.fg("mdCodeBlock", line || " "));
      for (const highlightedLine of highlighted) {
        for (const wrapped of wrapTextWithAnsi(highlightedLine, Math.max(1, width - 2))) {
          lines.push(truncateToWidth2(`  ${wrapped}`, width, ""));
        }
      }
    };
    const stringOutputField = (label, value) => {
      if (typeof value !== "string") return;
      markdownField(label, value, label.toLowerCase());
    };
    const objectOutputField = (label, value) => {
      if (typeof value.output === "string" || typeof value.text === "string" || typeof value.content === "string") {
        stringOutputField(label, value.output ?? value.text ?? value.content);
        return;
      }
      structuredField(label, value);
    };
    const outputField = (label, value) => {
      if (value === void 0) return;
      if (typeof value === "string") {
        stringOutputField(label, value);
        return;
      }
      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        objectOutputField(label, value);
        return;
      }
      structuredField(label, value);
    };
    const coreCallPreview = (call) => {
      const settings = this.codePreviewSettings;
      const tool = call.ref.startsWith("pi.") ? call.ref.slice(3) : "";
      if (!settings || !["bash", "read", "write", "edit", "grep", "find", "ls"].includes(tool)) {
        return false;
      }
      const success = call.status === "completed" ? true : call.status === "failed" ? false : void 0;
      const audit = {
        ref: call.ref,
        provider: "pi",
        tool,
        ...call.args !== void 0 ? { args: call.args } : {},
        ...call.result !== void 0 ? { result: call.result } : {},
        ...call.preview !== void 0 ? { preview: call.preview } : {},
        ...success !== void 0 ? { success } : {},
        startedAt: call.startedAt,
        ...call.finishedAt !== void 0 ? { endedAt: call.finishedAt } : {}
      };
      const context = {
        cwd: this.snapshot().main.cwd ?? process.cwd(),
        settings,
        invalidate: this.highlightInvalidate
      };
      const title = coreToolTitle(audit, this.theme, context);
      const rendered = renderCoreToolBody(audit, this.theme, {
        ...context,
        expanded: true,
        maxLines: 200
      });
      if (!rendered) return false;
      lines.push(this.theme.fg("dim", "Preview:"));
      const body = renderBoundedLines(
        [...title ? [title] : [], ...rendered.lines],
        this.theme,
        settings.diffIntensity
      ).render(Math.max(1, width - 2));
      for (const row of body) lines.push(truncateToWidth2(`  ${row}`, width, ""));
      if (rendered.hidden > 0) {
        lines.push(this.theme.fg("muted", `  \u2026 ${rendered.hidden} more lines`));
      }
      return true;
    };
    const argumentField = (call) => {
      const args = call.args;
      if (!args || Object.keys(args).length === 0) return;
      const stringValue = (key) => typeof args[key] === "string" ? args[key] : void 0;
      if (call.ref === "pi.bash") {
        const command = stringValue("command");
        if (command) markdownField("Command", "```bash\n" + command + "\n```", "command");
      }
      const edits = Array.isArray(args.edits) ? args.edits : [];
      if (call.ref === "pi.edit" && edits.length > 0) {
        lines.push(this.theme.fg("dim", "Edits:"));
        const diff = nestedEditDiff(
          {
            ref: call.ref,
            tool: call.ref.split(".")[1] ?? call.ref,
            args
          },
          this.theme,
          this.highlightInvalidate
        );
        if (diff) {
          for (const line of diff) lines.push(truncateToWidth2(`  ${line}`, width, ""));
        } else {
          structuredField("Edits", edits);
        }
      }
      const content = stringValue("content");
      if (call.ref === "pi.write" && content !== void 0) {
        const path2 = stringValue("path") ?? "";
        const extension = path2.includes(".") ? path2.split(".").at(-1) : "";
        markdownField("Content", "```" + (extension || "text") + "\n" + content + "\n```", "content");
      }
      const renderedKeys = /* @__PURE__ */ new Set(["command", "edits", "content"]);
      const remaining = Object.fromEntries(
        Object.entries(args).filter(([key]) => !renderedKeys.has(key))
      );
      if (Object.keys(remaining).length > 0) structuredField("Input", remaining);
    };
    field("Status", entity.status);
    if (entity.kind === "main") {
      const main = entity.value;
      field("ID", main.id);
      field("Scope", "user-facing Pi session");
      field("Runner", main.runner);
      field("Model", main.model);
      field("Thinking", main.thinking);
      field("Transport", main.transport);
      field("Session", main.sessionId);
      field("Working directory", main.cwd);
      field("Pending messages", main.pendingMessages ? "yes" : "no");
      field("Local owner", main.local ? "yes" : "no");
      field(
        "Elapsed",
        main.startedAt ? formatDuration(Math.max(0, now - main.startedAt)) : void 0
      );
    } else if (entity.kind === "peer") {
      const peer = entity.value;
      field("ID", peer.id);
      field("Scope", "concurrent root Pi session");
      field("Runner", peer.runner);
      field("Model", peer.model);
      field("Thinking", peer.thinking);
      field("Transport", peer.transport);
      field("Session", peer.sessionId);
      field("Working directory", peer.cwd);
      field("Pending messages", peer.pendingMessages ? "yes" : "no");
      field("Last heartbeat", new Date(peer.updatedAt).toLocaleString());
      field("Elapsed", formatDuration(Math.max(0, now - peer.startedAt)));
    } else if (entity.kind === "agent") {
      const agent = entity.value;
      field("ID", agent.id);
      field("Runner", agent.runner);
      field("Residency", agent.residency ?? "session");
      field("Model", agent.model);
      field("Thinking", agent.thinking);
      field("Transport", agent.transport);
      field("Activity", agent.currentTool);
      field("Elapsed", agent.startedAt ? formatDuration((agent.finishedAt ?? now) - agent.startedAt) : void 0);
      field("Usage", agent.usage ? `${formatTokens(agent.usage.input + agent.usage.output)} tokens \xB7 ${agent.toolCalls ?? 0} tools \xB7 ${agent.turns ?? 0} turns \xB7 $${agent.usage.cost.toFixed(4)}` : void 0);
      markdownField("Task", agent.task, "task");
      field("Branch", agent.branch);
      field("Worktree", agent.worktree);
      field("Attach", agent.attachCommand);
      field("Error", agent.error);
      markdownField("Result", agent.text, "result");
      structuredField("Value", agent.value);
    } else if (entity.kind === "actor") {
      const actor = entity.value;
      field("ID", actor.id);
      field("Runner", actor.runner);
      field("Residency", actor.residency ?? "session");
      field("Execution owner", actor.ownerHostId);
      field("Runtime", actor.local === false ? "remote shared owner" : "local owner");
      field("Session model", actor.binding?.model ?? "inherit project");
      field("Project model", actor.projectDefaults?.model ?? "inherit Fabric");
      field("Effective model", actor.model ?? "Fabric default");
      field("Active worker model", actor.worker?.model);
      field("Session thinking", actor.binding?.thinking ?? "inherit project");
      field("Project thinking", actor.projectDefaults?.thinking ?? "inherit Fabric");
      field("Effective reasoning", actor.thinking ?? "Fabric default");
      field("Active worker thinking", actor.worker?.thinking);
      field("Delivery", `${actor.delivery} \xB7 ${actor.responseMode}`);
      field("Trigger turn", actor.triggerTurn ? "yes" : "no");
      field("Activity", actor.worker?.currentTool);
      field("Transport", actor.worker?.transport);
      field(
        "Usage",
        actor.worker?.usage ? `${formatTokens(actor.worker.usage.input + actor.worker.usage.output)} tokens \xB7 ${actor.worker.toolCalls ?? 0} tools` : void 0
      );
      field("Host events", actor.events.join(", "));
      field("Tools", actor.tools?.join(", ") ?? `inherited (${this.actorDefaultTools.join(", ")})`);
      field("Topics", actor.topics.join(", "));
      field("Queue", actor.queued);
      field("Last error", actor.lastError);
      field("Instructions", actor.instructions);
      if (actor.recentMessages.length > 0) {
        lines.push("");
        lines.push(this.theme.fg("accent", "Recent mailbox"));
        for (const message of actor.recentMessages) {
          const text = message.text ?? message.error ?? message.action ?? formatActorDataPreview(message.data) ?? "data";
          field(
            `${message.direction === "in" ? "\u2192" : "\u2190"} ${formatClock(message.createdAt)} ${message.source}`,
            text
          );
        }
      }
    } else if (entity.kind === "call") {
      const call = entity.value;
      field("Reference", call.ref);
      field("ID", call.id);
      field("Kind", call.entityKind ?? call.kind);
      field("Progress", call.progress);
      field("Elapsed", formatDuration((call.finishedAt ?? now) - call.startedAt));
      field("Tokens", call.metrics?.tokens);
      field("Tool calls", call.metrics?.toolCalls);
      field("Cost", call.metrics?.cost);
      field("Entity", call.entityId);
      const renderedCorePreview = coreCallPreview(call);
      if (!renderedCorePreview) argumentField(call);
      field("Error", call.error);
      if (!renderedCorePreview) outputField("Output", call.result);
    } else if (entity.kind === "item") {
      const item = entity.value;
      field("ID", item.id);
      field("Kind", item.kind);
      field("Progress", item.total !== void 0 ? `${item.completed ?? 0}/${item.total}` : void 0);
      field("Current", item.current);
      field("Detail", item.detail);
      structuredField("Data", item.data);
    } else if (entity.kind === "globalActor") {
      const def = entity.value;
      field("Scope", "global template");
      field("ID", def.id);
      field("Runner", def.runner);
      field("Residency", def.residency ?? "session");
      field("Delivery", `${def.delivery} \xB7 ${def.responseMode}`);
      field("Model", def.model ?? "inherit");
      field("Thinking", def.thinking ?? "inherit");
      field("Host events", def.events.join(", "));
      field("Topics", def.topics.join(", "));
      field("Trigger turn", def.triggerTurn ? "yes" : "no");
      field("Coalesce", def.coalesce ? "yes" : "no");
      field("Created", new Date(def.createdAt).toLocaleString());
      field("Updated", new Date(def.updatedAt).toLocaleString());
      field("Instructions", def.instructions);
    } else if (entity.kind === "meshParticipant") {
      const participant = entity.value;
      const canonical = participant.participant;
      field("Scope", canonical ? `project ${canonical.kind}` : "observed mesh agent");
      field("Identity", participant.id);
      field("Root", canonical?.rootId);
      field("Parent", canonical?.parentId);
      field("Owner host", canonical?.ownerHostId);
      field("Owner identity", canonical?.ownerIdentityId);
      field("Residency", canonical?.residency ?? "session");
      field("Runner", canonical?.runner);
      field("Transport", canonical?.transport);
      field("Capabilities", canonical?.capabilities.join(", "));
      field("Local", canonical ? canonical.local ? "yes" : "no" : void 0);
      field("Observed routes", participant.routes);
      field("Last activity", new Date(participant.lastSeenAt).toLocaleString());
      field("Current work", canonical?.currentTool);
    } else if (entity.kind === "meshTopic") {
      const topic = entity.value;
      field("Scope", "project mesh topic");
      field("ID", topic.id);
      field("System topic", topic.system ? "yes" : "no");
      field("Subscribers", topic.subscribers.map((subscriber) => subscriber.name).join(", "));
      field("Recent events", topic.recentEvents);
      field(
        "Last activity",
        topic.lastEventAt ? new Date(topic.lastEventAt).toLocaleString() : void 0
      );
    } else if (entity.kind === "meshRoute") {
      const route = entity.value;
      field("Scope", "recent project mesh route");
      field("From", `${route.fromName} (${route.fromKind}:${route.fromId})`);
      field("To", `${route.targetName} (${route.targetKind}:${route.targetId})`);
      field("Topic", route.topic);
      field("Event kind", route.kind);
      field("Deliveries", route.count);
      field("Last activity", new Date(route.lastAt).toLocaleString());
      markdownField("Payload text", route.text, "route-text");
    } else if (entity.kind === "component") {
      const component = entity.value;
      field("Definition", component.component);
      field("Parent", component.parentId);
      field("Guarantee", component.guarantee);
      const componentEffects = component.effects ?? [];
      const visibleEffects = componentEffects.slice(0, 8).map(
        (effect) => `${effect.label}: ${effect.kind}/${effect.ordering} [${effect.resources.join(", ")}]`
      );
      if (componentEffects.length > visibleEffects.length) {
        visibleEffects.push(`+${componentEffects.length - visibleEffects.length} more`);
      }
      field("Effects", visibleEffects.join("; "));
      field("Effect conflicts", component.effectConflicts?.map(
        (conflict) => formatFabricEffectConflict(
          conflict.withComponent,
          conflict.resources,
          conflict.reason
        )
      ).join("; "));
      field("Requirements", component.requirements.join(", "));
      field("Provisions", component.provisions.join(", "));
      field("Missing", component.missing.join(", "));
      field("Optional missing", component.optionalMissing.join(", "));
      field("Target digest", component.targetDigest);
      field("Error", component.error);
      field("Updated", new Date(component.updatedAt).toLocaleString());
    } else {
      const entry = entity.value;
      field("Key", entry.key);
      field("Owner", entry.owner);
      field("Version", entry.version);
      field("Updated", new Date(entry.updatedAt).toLocaleString());
      field("Detail", entry.detail);
      const filePreview = loadStateFilePreview(entry, cwd);
      if (filePreview) {
        field("File", filePreview.path);
        lines.push(this.theme.fg("dim", "Preview:"));
        lines.push(...renderStateFilePreview(
          filePreview,
          this.theme,
          width,
          120,
          this.highlightInvalidate
        ));
      }
      structuredField("Value", entry.value);
    }
    return lines.length > 0 ? lines : [this.theme.fg("dim", "No details")];
  }
  renderNarrowDetail(width, snapshot, entity) {
    const transcriptView = (entity.kind === "agent" || entity.kind === "actor") && this.detailView === "transcript";
    const content = transcriptView ? this.transcriptLines(entity, width) : this.detailLines(entity, width, snapshot.now, snapshot.main.cwd ?? process.cwd());
    const terminalRows = this.tui.terminal?.rows ?? process.stdout.rows ?? 28;
    const maxBody = Math.max(1, terminalRows - 2);
    this.detailMaxScroll = Math.max(0, content.length - maxBody);
    if (transcriptView && this.transcriptFollowing) {
      this.detailScroll = this.detailMaxScroll;
    } else if (transcriptView && this.transcriptPageAnchor) {
      this.detailScroll = this.transcriptPageAnchor === "end" ? this.detailMaxScroll : 0;
      this.transcriptPageAnchor = void 0;
    } else {
      this.detailScroll = Math.max(0, Math.min(this.detailScroll, this.detailMaxScroll));
    }
    const title = `${entity.label}${transcriptView ? " \xB7 transcript" : ""}`;
    const hint = transcriptView ? `${this.transcriptToolToggleHint()} \xB7 g page top \xB7 G follow:${this.transcriptFollowing ? "on" : "off"}/tail \xB7 t summary \xB7 esc` : `${this.hasTranscript(entity) ? "t transcript \xB7 " : ""}esc`;
    return [title, ...content.slice(this.detailScroll, this.detailScroll + maxBody), hint].map((line) => truncateToWidth2(line, width, "")).filter((line) => visibleWidth2(line) > 0);
  }
  topBorder(width, title) {
    const border = (value) => this.theme.fg("borderMuted", value);
    const safeTitle = truncateToWidth2(safeText(title), Math.max(0, width - 6));
    const styledTitle = ` ${this.theme.fg("accent", safeTitle)} `;
    const remaining = Math.max(0, width - 2 - visibleWidth2(styledTitle));
    const left = Math.floor(remaining / 2);
    const right = remaining - left;
    return `${border(`\u256D${"\u2500".repeat(left)}`)}${styledTitle}${border(`${"\u2500".repeat(right)}\u256E`)}`;
  }
  middleBorder(width) {
    return this.theme.fg("borderMuted", `\u251C${"\u2500".repeat(Math.max(0, width - 2))}\u2524`);
  }
  bottomBorder(width) {
    return this.theme.fg("borderMuted", `\u2570${"\u2500".repeat(Math.max(0, width - 2))}\u256F`);
  }
  row(width, content) {
    const innerWidth = Math.max(0, width - 2);
    return `${this.theme.fg("borderMuted", "\u2502")}${padToWidth(content, innerWidth)}${this.theme.fg(
      "borderMuted",
      "\u2502"
    )}`;
  }
};

// src/ui/dashboard-fabric-graph.ts
import { truncateToWidth as truncateToWidth3, visibleWidth as visibleWidth3 } from "@earendil-works/pi-tui";
var kindRank = {
  agent: 0,
  actor: 1,
  participant: 2,
  component: 3,
  peer: 4,
  group: 5,
  topic: 6,
  state: 7,
  route: 8,
  main: 9
};
var activeRank = (status) => isActiveStatus(status) && status !== "blocked" ? 0 : status === "blocked" ? 1 : 2;
var nodeKind = (entity) => {
  if (entity.kind === "component") return "component";
  if (entity.kind === "meshParticipant") return "participant";
  if (entity.kind === "meshTopic") return "topic";
  if (entity.kind === "meshRoute") return "route";
  if (entity.kind === "globalActor" || entity.kind === "call" || entity.kind === "item") {
    return "state";
  }
  return entity.kind;
};
var rawIdentity = (entity) => {
  if (entity.kind === "main" || entity.kind === "peer" || entity.kind === "agent" || entity.kind === "actor") {
    return [entity.value.id, entity.value.name];
  }
  if (entity.kind === "meshParticipant") {
    return [entity.value.id, entity.value.name, entity.value.participant?.sessionId];
  }
  if (entity.kind === "meshTopic") return [entity.value.id, entity.value.name];
  if (entity.kind === "state") return [entity.value.key, entity.value.label];
  if (entity.kind === "meshRoute") return [entity.value.id];
  if (entity.kind === "component") {
    return [entity.value.id, entity.id];
  }
  return [entity.id, entity.label];
};
var graphLabel = (value, maxWidth) => {
  let output = "";
  let width = 0;
  for (const char of value) {
    const charWidth = visibleWidth3(char);
    if (width + charWidth > maxWidth) {
      while (width + 1 > maxWidth && output.length > 0) {
        const parts = [...output];
        const removed = parts.pop();
        output = parts.join("");
        width -= removed ? visibleWidth3(removed) : 0;
      }
      return output + "\u2026";
    }
    output += char;
    width += charWidth;
  }
  return output;
};
var graphGlyph = (node, animation) => {
  if (node.stale) return animation.reducedMotion ? "\xB7" : ["\u25A7", "\u25AB", "\xB7", " "][Math.floor(animation.now / 240) % 4];
  const frame = Math.floor(animation.now / 160);
  const active = isActiveStatus(node.status);
  if (node.kind === "main") return active && !animation.reducedMotion ? ["\u25C7", "\u25C8", "\u25C6", "\u25C8"][frame % 4] : "\u25C6";
  if (node.kind === "actor") {
    if ((node.queued ?? 0) > 0 && !animation.reducedMotion) return ["\u25C7", "\u25C8", "\u25C6", "\u25C8"][frame % 4];
    return "\u25C7";
  }
  if (node.kind === "peer") return "\u25C8";
  if (node.kind === "group") return "\u25B1";
  if (node.kind === "topic") {
    const hot = node.activityAt !== void 0 && animation.now - node.activityAt <= 1e4;
    return hot && !animation.reducedMotion ? ["\u25CE", "\u25C9", "\u29BF", "\u25C9"][frame % 4] : "\u25CE";
  }
  if (node.kind === "state") {
    if (/certified|committed|complete/.test(node.status) && !animation.reducedMotion) {
      return ["\u25EB", "\u25A3", "\u2726", "\u25A3"][Math.floor(animation.now / 280) % 4];
    }
    return "\u25EB";
  }
  if (node.kind === "participant") return "\u25A7";
  if (node.kind === "component") return "\u2B21";
  if (node.kind === "agent" && !animation.reducedMotion) {
    const spawnAge = node.startedAt === void 0 ? Number.POSITIVE_INFINITY : animation.now - node.startedAt;
    if (spawnAge >= 0 && spawnAge <= 1600) {
      return ["\xB7", "\u25AA", "\u25AB", "\u25A3", "\u25A0"][Math.min(4, Math.floor(spawnAge / 320))];
    }
    if (active) return ["\u25A0", "\u25A3", "\u25AA", "\u25A3"][frame % 4];
  }
  return "\u25A0";
};
var PARTICIPANTS_GROUP_ID = "group:participants";
var MESH_GROUP_ID = "group:mesh";
var TOPICS_GROUP_ID = "group:mesh:topics";
var STATE_GROUP_ID = "group:mesh:state";
var COMPONENTS_GROUP_ID = "group:components";
var topologyParticipantGroup = (kind) => {
  if (kind === "actor") return { id: "actors", label: "Actors", order: 2 };
  if (kind === "agent") return { id: "agents", label: "Agents", order: 1 };
  return { id: "sessions", label: "Sessions", order: 0 };
};
var titleSegment = (value) => value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
var namespaceParts = (value) => value.split(/[.:/]+/).map((part) => part.trim()).filter(Boolean);
var topologyTopicGroupPath = (name) => {
  const parts = namespaceParts(name);
  if (parts[0] === "fabric") {
    return [
      { id: "fabric", label: "Fabric" },
      ...parts.length > 2 && parts[1] ? [{ id: `fabric:${parts[1]}`, label: titleSegment(parts[1]) }] : []
    ];
  }
  return [
    { id: "project", label: "Project topics" },
    ...parts.length > 1 && parts[0] ? [{ id: `project:${parts[0]}`, label: parts[0] }] : []
  ];
};
var topologyStateGroupPath = (key) => {
  const parts = key.split("/").map((part) => part.trim()).filter(Boolean);
  if (parts[0] === "state") {
    const path3 = [{ id: "world", label: "World state" }];
    if (parts[1] === "complexity") {
      let prefix2 = "world:complexity";
      path3.push({ id: prefix2, label: "Complexity" });
      for (const directory of parts.slice(2, -1)) {
        prefix2 += `:${directory}`;
        path3.push({ id: prefix2, label: directory });
      }
    } else {
      let prefix2 = "world";
      for (const directory of parts.slice(1, -1)) {
        prefix2 += `:${directory}`;
        path3.push({ id: prefix2, label: titleSegment(directory) });
      }
    }
    return path3;
  }
  if (parts[0] === "schema") {
    const path3 = [{ id: "schema", label: "Schema" }];
    const family = parts[1];
    if (family === "hypothesis") path3.push({ id: "schema:hypotheses", label: "Hypotheses" });
    else if (family === "certificate") path3.push({ id: "schema:certificates", label: "Certificates" });
    else {
      let prefix2 = "schema";
      for (const directory of parts.slice(1, -1)) {
        prefix2 += `:${directory}`;
        path3.push({ id: prefix2, label: titleSegment(directory) });
      }
    }
    return path3;
  }
  const path2 = [{ id: "project", label: "Project state" }];
  let prefix = "project";
  for (const directory of parts.slice(0, -1)) {
    prefix += `:${directory}`;
    path2.push({ id: prefix, label: directory });
  }
  return path2;
};
var parentReference = (entity) => {
  if (entity.kind === "agent") return entity.value.parentId ?? entity.value.actorId;
  if (entity.kind === "meshParticipant") return entity.value.participant?.parentId;
  if (entity.kind === "meshRoute") return entity.value.fromId;
  return void 0;
};
var buildLayout = (snapshot, entities, selectedRun, mesh) => {
  const aliases = /* @__PURE__ */ new Map();
  const entityById = new Map(entities.map((entity) => [entity.id, entity]));
  for (const entity of entities) {
    for (const identity of rawIdentity(entity)) {
      if (identity) aliases.set(identity, entity.id);
    }
  }
  const mainId = entities.find((entity) => entity.kind === "main")?.id ?? `main:${snapshot.main.id}`;
  aliases.set(snapshot.main.id, mainId);
  aliases.set(snapshot.main.name, mainId);
  aliases.set("main", mainId);
  const groups = /* @__PURE__ */ new Map();
  const ensureGroup = (id, label, parentId, order) => {
    if (!groups.has(id)) {
      groups.set(id, {
        id,
        label,
        status: "idle",
        kind: "group",
        parentId,
        order,
        x: 0,
        y: 0
      });
    }
    return id;
  };
  const ensurePath = (rootId, path2) => {
    let parentId = rootId;
    for (let index = 0; index < path2.length; index++) {
      const segment = path2[index];
      const id = `${rootId}:${segment.id}`;
      parentId = ensureGroup(id, segment.label, parentId, index);
    }
    return parentId;
  };
  const participantCategory = (entity) => {
    if (entity.kind === "actor") return topologyParticipantGroup("actor");
    if (entity.kind === "agent") return topologyParticipantGroup("agent");
    if (entity.kind === "peer") return topologyParticipantGroup("peer");
    return topologyParticipantGroup(
      entity.kind === "meshParticipant" ? entity.value.participant?.kind ?? "root" : "root"
    );
  };
  const nodes = entities.filter((entity) => entity.kind !== "meshRoute").map((entity) => {
    const parentRef = parentReference(entity);
    const explicitParentId = parentRef ? aliases.get(parentRef) : void 0;
    let parentId = explicitParentId;
    if (entity.kind !== "main") {
      if (entity.kind === "component") {
        parentId = ensureGroup(COMPONENTS_GROUP_ID, "Components", mainId, 2);
      } else if (["agent", "actor", "peer", "meshParticipant"].includes(entity.kind) && (!parentId || parentId === mainId)) {
        ensureGroup(PARTICIPANTS_GROUP_ID, "Participants", mainId, 0);
        const category = participantCategory(entity);
        parentId = ensureGroup(
          `${PARTICIPANTS_GROUP_ID}:${category.id}`,
          category.label,
          PARTICIPANTS_GROUP_ID,
          category.order
        );
      } else if (entity.kind === "meshTopic") {
        ensureGroup(MESH_GROUP_ID, "Mesh", mainId, 1);
        ensureGroup(TOPICS_GROUP_ID, "Topics", MESH_GROUP_ID, 0);
        parentId = ensurePath(TOPICS_GROUP_ID, topologyTopicGroupPath(entity.value.name));
      } else if (entity.kind === "state") {
        ensureGroup(MESH_GROUP_ID, "Mesh", mainId, 1);
        ensureGroup(STATE_GROUP_ID, "State", MESH_GROUP_ID, 1);
        parentId = ensurePath(STATE_GROUP_ID, topologyStateGroupPath(entity.value.key));
      } else if (!parentId) {
        parentId = mainId;
      }
    }
    const activityAt = entity.kind === "meshTopic" ? entity.value.lastEventAt : void 0;
    const startedAt = entity.kind === "agent" ? entity.value.startedAt : void 0;
    const queued = entity.kind === "actor" ? entity.value.queued : void 0;
    const stale = entity.kind === "meshParticipant" ? entity.value.participant?.stale : entity.kind === "agent" ? entity.value.stale : void 0;
    return {
      id: entity.id,
      label: entity.kind === "main" ? "Main" : entity.kind === "state" && entity.value.label === entity.value.key ? entity.value.key.split("/").at(-1) ?? entity.value.label : entity.label,
      status: entity.status,
      kind: nodeKind(entity),
      ...parentId ? { parentId } : {},
      ...activityAt !== void 0 ? { activityAt } : {},
      ...startedAt !== void 0 ? { startedAt } : {},
      ...queued !== void 0 ? { queued } : {},
      ...stale !== void 0 ? { stale } : {},
      x: 0,
      y: 0
    };
  });
  nodes.push(...groups.values());
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const children = /* @__PURE__ */ new Map();
  for (const node of nodes) {
    if (!node.parentId || node.parentId === node.id || !nodeById.has(node.parentId)) continue;
    const bucket = children.get(node.parentId) ?? [];
    bucket.push(node);
    children.set(node.parentId, bucket);
  }
  const inSelectedRun = (node) => {
    const entity = entityById.get(node.id);
    return Boolean(selectedRun && entity?.kind === "agent" && entity.value.runId === selectedRun.id);
  };
  for (const bucket of children.values()) {
    bucket.sort(
      (left, right) => activeRank(left.status) - activeRank(right.status) || Number(inSelectedRun(right)) - Number(inSelectedRun(left)) || (left.order ?? 0) - (right.order ?? 0) || kindRank[left.kind] - kindRank[right.kind] || left.label.localeCompare(right.label)
    );
  }
  let nextLeafY = 0;
  const visited = /* @__PURE__ */ new Set();
  const place = (node, depth) => {
    if (visited.has(node.id)) return node.y;
    visited.add(node.id);
    node.x = depth * 20;
    const descendants = (children.get(node.id) ?? []).filter((child) => !visited.has(child.id));
    if (descendants.length === 0) {
      node.y = nextLeafY;
      nextLeafY += 2;
      return node.y;
    }
    const childRows = descendants.map((child) => place(child, depth + 1));
    node.y = (childRows[0] + childRows[childRows.length - 1]) / 2;
    return node.y;
  };
  const main = nodeById.get(mainId);
  if (main) place(main, 0);
  for (const node of nodes) {
    if (!visited.has(node.id)) place(node, 1);
  }
  const mainY = main?.y ?? 0;
  for (const node of nodes) node.y = Math.round(node.y - mainY);
  const edges = [];
  for (const node of nodes) {
    if (node.parentId && nodeById.has(node.parentId) && node.parentId !== node.id) {
      edges.push({ from: node.parentId, to: node.id, kind: node.kind === "route" ? "route" : "structure" });
    }
  }
  for (const topic of mesh.topics) {
    const target = aliases.get(topic.id) ?? aliases.get(topic.name);
    if (!target) continue;
    for (const subscriber of topic.subscribers) {
      const source = aliases.get(subscriber.id) ?? aliases.get(subscriber.name);
      if (source && source !== target) edges.push({ from: source, to: target, kind: "subscription" });
    }
  }
  for (const entity of entities) {
    if (entity.kind !== "state" || !entity.value.owner) continue;
    const owner = aliases.get(entity.value.owner);
    const target = aliases.get(entity.value.key) ?? aliases.get(entity.value.label);
    if (owner && target && owner !== target) {
      edges.push({ from: owner, to: target, kind: "subscription" });
    }
  }
  for (const dependency of snapshot.componentGraph.edges) {
    const source = aliases.get(dependency.from);
    const target = aliases.get(dependency.to);
    if (source && target && source !== target) {
      edges.push({ from: source, to: target, kind: "subscription" });
    }
  }
  for (const route of mesh.routes) {
    const source = aliases.get(route.fromId) ?? aliases.get(route.fromName);
    const target = aliases.get(route.targetId) ?? aliases.get(route.targetName) ?? aliases.get(route.topic);
    if (source && target && source !== target) {
      edges.push({ from: source, to: target, kind: "route", route });
    }
  }
  const positions = new Map(nodes.map((node) => [node.id, { x: node.x, y: node.y }]));
  for (const edge of edges) {
    if (!edge.route) continue;
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);
    if (!from || !to) continue;
    positions.set(edge.route.id, {
      x: Math.round((from.x + to.x) / 2),
      y: Math.round((from.y + to.y) / 2)
    });
  }
  return { nodes, edges, positions };
};
var lineChar = (mask) => {
  const chars = {
    1: "\u2502",
    2: "\u2500",
    3: "\u2514",
    4: "\u2502",
    5: "\u2502",
    6: "\u250C",
    7: "\u251C",
    8: "\u2500",
    9: "\u2518",
    10: "\u2500",
    11: "\u2534",
    12: "\u2510",
    13: "\u2524",
    14: "\u252C",
    15: "\u253C"
  };
  return chars[mask] ?? "\xB7";
};
var styleForStatus = (status) => {
  if (["failed", "timed_out", "error", "quarantined"].includes(status)) return "error";
  if (["blocked", "waiting"].includes(status)) return "warning";
  if (isActiveStatus(status)) return "success";
  return "dim";
};
var topologyTreeRouteNodeIds = (nodes, fromId, toId) => {
  if (fromId === toId) return [fromId];
  const ancestry = (start) => {
    const path2 = [];
    const seen = /* @__PURE__ */ new Set();
    let current = start;
    while (current && !seen.has(current)) {
      path2.push(current);
      seen.add(current);
      current = nodes.get(current)?.parentId;
    }
    return path2;
  };
  const fromAncestors = ancestry(fromId);
  const fromSet = new Set(fromAncestors);
  const toAncestors = ancestry(toId);
  const common = toAncestors.find((id) => fromSet.has(id));
  if (!common) return [fromId, toId];
  return [
    ...fromAncestors.slice(0, fromAncestors.indexOf(common) + 1),
    ...toAncestors.slice(0, toAncestors.indexOf(common)).reverse()
  ];
};
var routeGlyph = (route) => {
  if (route.status === "failed") return "!";
  const kind = route.kind.toLowerCase();
  if (kind.includes("certif")) return "\u2726";
  if (kind.includes("commit")) return "\u25C6";
  if (kind.includes("control") || kind.includes("steer")) return "\u21AF";
  if (kind.includes("message") || kind.includes("directive")) return "\u2709";
  return "\u2022";
};
var routeStyle = (route) => route.status === "failed" ? "error" : route.kind.toLowerCase().includes("certif") ? "warning" : "accent";
var renderCanvas = (theme, layout, selectedEntityId, width, height, camera, animation) => {
  const originX = Math.round(camera.x - width / 2);
  const originY = Math.round(camera.y - height / 2);
  const cells = Array.from(
    { length: height },
    () => Array.from({ length: width }, () => ({ char: " ", style: "plain" }))
  );
  const masks = Array.from({ length: height }, () => Array(width).fill(0));
  const nodeById = new Map(layout.nodes.map((node) => [node.id, node]));
  const selectedRoute = layout.edges.find((edge) => edge.route?.id === selectedEntityId)?.route;
  const related = new Set(selectedEntityId ? [selectedEntityId] : []);
  for (const edge of layout.edges) {
    if (edge.from === selectedEntityId || edge.to === selectedEntityId || edge.route?.id === selectedEntityId) {
      related.add(edge.from);
      related.add(edge.to);
      if (edge.route) related.add(edge.route.id);
    }
  }
  const setCell = (x, y, char, style) => {
    const sx = x - originX;
    const sy = y - originY;
    if (sx < 0 || sx >= width || sy < 0 || sy >= height) return;
    cells[sy][sx] = { char, style };
  };
  const addMask = (x, y, mask) => {
    const sx = x - originX;
    const sy = y - originY;
    if (sx < 0 || sx >= width || sy < 0 || sy >= height) return;
    masks[sy][sx] = (masks[sy][sx] ?? 0) | mask;
  };
  const horizontal = (x1, x2, y) => {
    if (y < originY || y >= originY + height) return;
    const worldStart = Math.min(x1, x2);
    const worldEnd = Math.max(x1, x2);
    const start = Math.max(worldStart, originX);
    const end = Math.min(worldEnd, originX + width - 1);
    for (let x = start; x <= end; x++) {
      addMask(x, y, (x > worldStart ? 8 : 0) | (x < worldEnd ? 2 : 0));
    }
  };
  const vertical = (x, y1, y2) => {
    if (x < originX || x >= originX + width) return;
    const worldStart = Math.min(y1, y2);
    const worldEnd = Math.max(y1, y2);
    const start = Math.max(worldStart, originY);
    const end = Math.min(worldEnd, originY + height - 1);
    for (let y = start; y <= end; y++) {
      addMask(x, y, (y > worldStart ? 1 : 0) | (y < worldEnd ? 4 : 0));
    }
  };
  const edgePathPoints = (from, to) => {
    const fromEnd = from.x + Math.min(16, visibleWidth3(safeText(from.label)) + 3);
    const toStart = to.x - 2;
    const bend = Math.max(fromEnd + 1, Math.floor((fromEnd + toStart) / 2));
    const points = [];
    const appendLine = (x1, y1, x2, y2) => {
      const dx = Math.sign(x2 - x1);
      const dy = Math.sign(y2 - y1);
      const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
      for (let step = points.length === 0 ? 0 : 1; step <= steps; step++) {
        points.push({ x: x1 + dx * step, y: y1 + dy * step });
      }
    };
    appendLine(fromEnd, from.y, bend, from.y);
    appendLine(bend, from.y, bend, to.y);
    appendLine(bend, to.y, toStart, to.y);
    return points;
  };
  const treePathPoints = (from, to) => {
    const ids = topologyTreeRouteNodeIds(nodeById, from.id, to.id);
    const points = [];
    for (let index = 0; index < ids.length - 1; index++) {
      const left = nodeById.get(ids[index]);
      const right = nodeById.get(ids[index + 1]);
      if (!left || !right) continue;
      const segment = right.parentId === left.id ? edgePathPoints(left, right) : left.parentId === right.id ? edgePathPoints(right, left).reverse() : edgePathPoints(left, right);
      const previous = points.at(-1);
      const first = segment[0];
      if (previous && first && previous.x === first.x && previous.y === first.y) segment.shift();
      points.push(...segment);
    }
    return points;
  };
  for (const edge of layout.edges) {
    if (edge.kind !== "structure") continue;
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);
    if (!from || !to) continue;
    const fromEnd = from.x + Math.min(16, visibleWidth3(safeText(from.label)) + 3);
    const toStart = to.x - 2;
    const bend = Math.max(fromEnd + 1, Math.floor((fromEnd + toStart) / 2));
    horizontal(fromEnd, bend, from.y);
    vertical(bend, from.y, to.y);
    horizontal(bend, toStart, to.y);
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const mask = masks[y]?.[x] ?? 0;
      if (mask) cells[y][x] = { char: lineChar(mask), style: "edge" };
    }
  }
  const traffic = /* @__PURE__ */ new Map();
  for (const edge of layout.edges) {
    if (edge.kind === "structure") continue;
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);
    if (!from || !to) continue;
    if (!edge.route) {
      if (edge.from !== selectedEntityId && edge.to !== selectedEntityId) continue;
      const points = treePathPoints(from, to);
      for (let index = 0; index < points.length; index += 2) {
        const point = points[index];
        setCell(point.x, point.y, "\xB7", "accent");
      }
      continue;
    }
    const key = `${edge.from}\0${edge.to}`;
    const group = traffic.get(key) ?? { from, to, routes: [] };
    group.routes.push(edge.route);
    traffic.set(key, group);
  }
  for (const group of traffic.values()) {
    const points = treePathPoints(group.from, group.to);
    if (points.length === 0) continue;
    const selected = group.routes.find((route2) => route2.id === selectedEntityId);
    const replay = group.routes.find((route2) => route2.id === animation.replayRouteId);
    const newest = group.routes.reduce((latest, route2) => route2.lastAt > latest.lastAt ? route2 : latest);
    const route = replay ?? selected ?? newest;
    const age = Math.max(0, animation.now - route.lastAt);
    const connected = group.from.id === selectedEntityId || group.to.id === selectedEntityId;
    const visible = Boolean(replay || selected || connected || animation.showHistory || age <= 6e4);
    if (!visible) continue;
    const fresh = Boolean(replay || age <= 1e4);
    const style = selected || replay ? routeStyle(route) : fresh ? "accent" : "dim";
    const stride = fresh ? 1 : 2;
    for (let index = 0; index < points.length; index += stride) {
      const point = points[index];
      const trail = fresh && !animation.reducedMotion && index % 3 === 0 ? "\u2501" : fresh ? "\xB7" : "\u254C";
      setCell(point.x, point.y, trail, style);
    }
    const packetActive = !animation.reducedMotion && Boolean(replay || age <= 2e3);
    if (packetActive) {
      const duration = 1200;
      const phase = replay ? animation.now % duration / duration : Math.min(0.999, age / 2e3);
      const packetIndex = Math.min(points.length - 1, Math.floor(phase * points.length));
      const point = points[packetIndex];
      setCell(point.x, point.y, routeGlyph(route), routeStyle(route));
      if (route.kind.toLowerCase().includes("certif")) {
        const ripple = points[Math.max(0, points.length - 1 - packetIndex)];
        setCell(ripple.x, ripple.y, "\u2726", "warning");
      } else if (route.status === "failed") {
        const impact = points.at(-1);
        setCell(impact.x, impact.y, Math.floor(animation.now / 120) % 2 === 0 ? "\u2573" : "!", "error");
      }
      const label = graphLabel(animation.replayLabel ?? route.kind, 18);
      let offset = 2;
      for (const char of label) {
        setCell(point.x + offset, point.y, char, routeStyle(route));
        offset += visibleWidth3(char);
      }
    } else {
      const count = group.routes.reduce((total, candidate) => total + candidate.count, 0);
      if (count > 1) {
        const point = points[Math.floor(points.length / 2)];
        const label = `\xD7${count}`;
        for (let index = 0; index < label.length; index++) {
          setCell(point.x + index, point.y, label[index], style);
        }
      }
    }
  }
  for (const node of layout.nodes) {
    const selected = node.id === selectedEntityId;
    const spotlighted = !selectedRoute || related.has(node.id);
    const glyph = selected ? "\u25A3" : graphGlyph(node, animation);
    const label = graphLabel(safeText(node.label), 14);
    const nodeStyle = selected ? "accent" : !spotlighted ? "dim" : styleForStatus(node.status);
    setCell(node.x, node.y, glyph, nodeStyle);
    setCell(node.x + 1, node.y, " ", "plain");
    let offset = 0;
    for (const char of label) {
      setCell(node.x + 2 + offset, node.y, char, selected ? "accent" : spotlighted ? "muted" : "dim");
      offset += visibleWidth3(char);
    }
  }
  const apply = (style, value) => {
    if (style === "edge") return theme.fg("borderMuted", value);
    if (style === "dim") return theme.fg("dim", value);
    if (style === "muted") return theme.fg("muted", value);
    if (style === "accent") return theme.fg("accent", theme.bold(value));
    if (style === "success") return theme.fg("success", value);
    if (style === "warning") return theme.fg("warning", value);
    if (style === "error") return theme.fg("error", value);
    return value;
  };
  return cells.map((row) => {
    let rendered = "";
    let style = row[0]?.style ?? "plain";
    let run = "";
    for (const cell of row) {
      if (cell.style !== style) {
        rendered += apply(style, run);
        style = cell.style;
        run = "";
      }
      run += cell.char;
    }
    rendered += apply(style, run);
    return truncateToWidth3(rendered, width, "");
  });
};
var wrapInspector = (theme, label, value, width) => {
  const clean = safeText(value);
  const first = truncateToWidth3(clean, Math.max(1, width - label.length - 1), "\u2026");
  return [theme.fg("muted", `${label} ${first}`)];
};
var inspectorLines = (theme, entity, snapshot, run, width, height, invalidate) => {
  const inner = Math.max(1, width - 2);
  const border = (value) => theme.fg("borderMuted", value);
  const content = [];
  if (entity) {
    content.push(theme.fg("accent", theme.bold(truncateToWidth3(safeText(entity.label), inner - 2, "\u2026"))));
    content.push(colorStatus(theme, entity.status, `${statusGlyph(entity.status)} ${entity.kind} \xB7 ${entity.status}`));
    content.push("");
    content.push(theme.fg("dim", truncateToWidth3(safeText(entityTail(entity, snapshot.now)), inner - 2, "\u2026")));
    if (entity.kind === "agent") {
      const agentRun = snapshot.runs.find((candidate) => candidate.id === entity.value.runId) ?? run;
      const phase = agentRun?.phases.find((candidate) => candidate.id === entity.value.phaseId);
      if (agentRun) content.push(theme.fg("muted", `run   ${safeText(agentRun.name)}`));
      if (phase) content.push(theme.fg("muted", `phase ${safeText(phase.name)}`));
      if (entity.value.currentTool) content.push(theme.fg("muted", `tool  ${safeText(entity.value.currentTool)}`));
      if (entity.value.model) content.push(theme.fg("muted", `model ${safeText(entity.value.model)}`));
      if (entity.value.task) content.push(...wrapInspector(theme, "task", entity.value.task, inner - 2));
    } else if (entity.kind === "actor") {
      content.push(theme.fg("muted", `runner ${entity.value.runner}`));
      content.push(theme.fg("muted", `queue  ${entity.value.queued}`));
      if (entity.value.topics.length > 0) content.push(theme.fg("muted", `${entity.value.topics.length} subscriptions`));
    } else if (entity.kind === "component") {
      content.push(theme.fg("muted", `definition ${safeText(entity.value.component)}`));
      content.push(theme.fg("muted", `guarantee  ${entity.value.guarantee}`));
      if (entity.value.parentId) {
        content.push(theme.fg("muted", `parent     ${safeText(entity.value.parentId)}`));
      }
      if (entity.value.effects?.length) {
        content.push(theme.fg("muted", `effects    ${entity.value.effects.length}`));
      }
      if (entity.value.effectConflicts?.length) {
        content.push(theme.fg("warning", `conflicts  ${entity.value.effectConflicts.length}`));
      }
      if (entity.value.requirements.length > 0) {
        content.push(theme.fg("muted", `requires   ${entity.value.requirements.join(", ")}`));
      }
      if (entity.value.provisions.length > 0) {
        content.push(theme.fg("muted", `provides   ${entity.value.provisions.join(", ")}`));
      }
      const cycles = snapshot.componentGraph.cycles.filter(
        (cycle) => cycle.includes(entity.value.id)
      );
      if (cycles.length > 0) {
        content.push(theme.fg("warning", `cycles     ${cycles.map((cycle) => cycle.join(" \u2192 ")).join("; ")}`));
      }
      if (entity.value.error) content.push(theme.fg("error", safeText(entity.value.error)));
    } else if (entity.kind === "meshTopic") {
      content.push(theme.fg("muted", `${entity.value.subscribers.length} subscribers`));
      content.push(theme.fg("muted", `${entity.value.recentEvents} recent events`));
    } else if (entity.kind === "meshRoute") {
      content.push(theme.fg("muted", `${safeText(entity.value.fromName)} \u2192 ${safeText(entity.value.targetName)}`));
      content.push(theme.fg("muted", `kind  ${safeText(entity.value.kind)}`));
      content.push(theme.fg("muted", `topic ${safeText(entity.value.topic)}`));
      content.push(theme.fg("muted", `count ${entity.value.count}`));
    } else if (entity.kind === "state") {
      content.push(theme.fg("muted", `version ${entity.value.version}`));
      if (entity.value.owner) content.push(theme.fg("muted", `owner   ${safeText(entity.value.owner)}`));
      const filePreview = loadStateFilePreview(entity.value, snapshot.main.cwd ?? process.cwd());
      if (filePreview) {
        content.push("");
        content.push(theme.fg("muted", `file ${safeText(filePreview.path)}`));
        content.push(...renderStateFilePreview(
          filePreview,
          theme,
          Math.max(1, inner - 2),
          Math.max(0, height - content.length - 3),
          invalidate
        ));
      }
    }
  } else {
    content.push(theme.fg("dim", "No node selected"));
  }
  const title = " selected ";
  const rows = [border(`\u256D${title}${"\u2500".repeat(Math.max(0, inner - visibleWidth3(title)))}\u256E`)];
  for (let index = 0; index < height - 2; index++) {
    rows.push(`${border("\u2502")}${padToWidth(` ${content[index] ?? ""}`, inner)}${border("\u2502")}`);
  }
  rows.push(border(`\u2570${"\u2500".repeat(inner)}\u256F`));
  return rows.slice(0, height);
};
var graphContextEntities = (allEntities, entities) => {
  const byRawId = /* @__PURE__ */ new Map();
  for (const entity of allEntities) {
    for (const identity of rawIdentity(entity)) {
      if (identity) byRawId.set(identity, entity);
    }
  }
  const visible = new Map(entities.map((entity) => [entity.id, entity]));
  for (const entity of entities) {
    let parentRef = parentReference(entity);
    const visited = /* @__PURE__ */ new Set();
    while (parentRef && !visited.has(parentRef)) {
      visited.add(parentRef);
      const parent = byRawId.get(parentRef);
      if (!parent) break;
      visible.set(parent.id, parent);
      parentRef = parentReference(parent);
    }
  }
  return allEntities.filter((entity) => visible.has(entity.id));
};
var renderFabricTopologyPanel = ({
  theme,
  filter,
  selectedEntityId,
  snapshot,
  run,
  mesh,
  allEntities,
  entities,
  width,
  height,
  camera,
  animation,
  invalidate
}) => {
  const graphEntities = graphContextEntities(allEntities, entities);
  const layout = buildLayout(snapshot, graphEntities, run, mesh);
  const selectableIds = new Set(entities.map((entity) => entity.id));
  const selected = entities.find((entity) => entity.id === selectedEntityId) ?? entities[0];
  const inspectorWidth = width >= 92 ? Math.min(36, Math.max(30, Math.floor(width * 0.3))) : 0;
  const graphWidth = Math.max(1, width - inspectorWidth);
  const graph = renderCanvas(theme, layout, selected?.id, graphWidth, height, camera, animation);
  const inspector = inspectorWidth > 0 ? inspectorLines(theme, selected, snapshot, run, inspectorWidth, height, invalidate) : [];
  const lines = inspectorWidth > 0 ? graph.map(
    (line, index) => `${padToWidth(line, graphWidth)}${inspector[index] ?? ""}`
  ) : graph;
  const active = entities.filter((entity) => isActiveStatus(entity.status)).length;
  const originX = Math.round(camera.x - graphWidth / 2);
  const originY = Math.round(camera.y - height / 2);
  const hiddenLeft = layout.nodes.filter((node) => node.x < originX).length;
  const hiddenRight = layout.nodes.filter((node) => node.x + 2 > originX + graphWidth).length;
  const hiddenUp = layout.nodes.filter((node) => node.y < originY).length;
  const hiddenDown = layout.nodes.filter((node) => node.y >= originY + height).length;
  const offCanvas = new Set(
    layout.nodes.filter(
      (node) => node.x < originX || node.x + 2 > originX + graphWidth || node.y < originY || node.y >= originY + height
    ).map((node) => node.id)
  ).size;
  const directions = [
    hiddenLeft > 0 ? "\u2190" : "",
    hiddenRight > 0 ? "\u2192" : "",
    hiddenUp > 0 ? "\u2191" : "",
    hiddenDown > 0 ? "\u2193" : ""
  ].join("");
  if (lines.length > 0 && height > 1) {
    const legend = [
      offCanvas > 0 ? `${directions} ${offCanvas} off-canvas` : void 0,
      `${active} active`,
      "\u25C6 Main",
      "\u25A0 agent",
      "\u25C7 actor",
      "\u25CE topic",
      "\u25B1 group",
      animation.replayRouteId ? "\u25B6 replay" : animation.showHistory ? "history" : "live decay",
      "\u2B21 component",
      animation.reducedMotion ? "reduced motion" : void 0,
      filter !== "all" ? `${entities.length}/${allEntities.length} ${filter}` : void 0
    ].filter((value) => Boolean(value)).join(" \xB7 ");
    const graphLegend = padToWidth(theme.fg("dim", truncateToWidth3(legend, graphWidth, "")), graphWidth);
    lines[0] = truncateToWidth3(
      graphLegend + (inspectorWidth > 0 ? inspector[0] ?? "" : ""),
      width,
      ""
    );
  }
  const selectedPosition = selected ? layout.positions.get(selected.id) : void 0;
  return {
    lines,
    positions: new Map(
      [...layout.positions].filter(([id]) => selectableIds.has(id))
    ),
    ...selectedPosition ? { selectedPosition } : {}
  };
};
var directionalGraphTarget = (positions, currentId, direction) => {
  const current = currentId ? positions.get(currentId) : void 0;
  if (!current) return positions.keys().next().value;
  let best;
  for (const [id, point] of positions) {
    if (id === currentId) continue;
    const dx = point.x - current.x;
    const dy = point.y - current.y;
    const primary = direction === "left" ? -dx : direction === "right" ? dx : direction === "up" ? -dy : dy;
    if (primary <= 0) continue;
    const secondary = direction === "left" || direction === "right" ? Math.abs(dy) : Math.abs(dx);
    const score = primary + secondary * 2.4;
    if (!best || score < best.score) best = { id, score };
  }
  return best?.id;
};

// src/ui/fabric-host-event-selector.ts
import { Container, getKeybindings, Spacer, Text } from "@earendil-works/pi-tui";
var COMMON_HOST_EVENTS = [
  "input",
  "turn_end",
  "agent_settled",
  "tool_error",
  "session_compact"
];
var commonHostEvents = new Set(COMMON_HOST_EVENTS);
var MAX_VISIBLE_HOST_EVENTS = 12;
var HOST_EVENT_ORDER = [
  ...COMMON_HOST_EVENTS,
  ...FABRIC_ACTOR_HOST_EVENTS.filter((event) => !commonHostEvents.has(event))
];
var EVENT_LABELS = {
  input: "raw user or extension input",
  turn_end: "each completed LLM turn",
  agent_settled: "host fully idle after a run",
  tool_error: "synthetic notification for a failed tool",
  session_compact: "context was compacted",
  session_compact_failed: "context compaction failed or was aborted",
  resources_discover: "skills, prompts, and themes are discovered",
  session_start: "a session starts, reloads, or is restored",
  session_info_changed: "session metadata or name changed",
  session_before_switch: "before a new or resumed session replaces this one",
  session_before_fork: "before a session fork or clone",
  session_before_compact: "before context compaction",
  session_shutdown: "before this session runtime shuts down",
  session_before_tree: "before session-tree navigation",
  session_tree: "after session-tree navigation",
  before_agent_start: "expanded prompt and system context before the agent loop",
  agent_start: "a low-level agent run started",
  agent_end: "a low-level agent run ended",
  turn_start: "an LLM turn started",
  message_start: "a user, assistant, or tool message started",
  message_update: "an assistant streaming update",
  message_end: "a user, assistant, or tool message completed",
  ui_prompt_start: "a blocking user-facing UI prompt opened",
  ui_prompt_end: "a blocking user-facing UI prompt closed",
  context: "assembled messages before an LLM request",
  before_provider_headers: "outbound provider headers assembled; secrets redacted",
  before_provider_request: "provider payload assembled before sending",
  after_provider_response: "provider response status and headers received",
  tool_execution_start: "tool execution started",
  tool_call: "validated tool call before execution",
  tool_execution_update: "streaming tool progress",
  tool_result: "final tool result before message persistence",
  tool_execution_end: "tool execution completed",
  model_select: "the active model changed",
  thinking_level_select: "the active thinking level changed",
  user_bash: "a user ! or !! shell command was submitted"
};
var FabricHostEventSelector = class extends Container {
  theme;
  onSelectCallback;
  onCancelCallback;
  listContainer = new Container();
  enabled;
  selectedIndex = 0;
  focused = false;
  constructor(options) {
    super();
    this.theme = options.theme;
    this.onSelectCallback = options.onSelect;
    this.onCancelCallback = options.onCancel;
    this.enabled = new Set(options.currentValue);
    this.addChild(
      new Text(
        this.theme.fg(
          "muted",
          options.headerText ?? "Toggle the host events this actor subscribes to."
        ),
        0,
        0
      )
    );
    this.addChild(new Spacer(1));
    this.addChild(this.listContainer);
    this.addChild(new Spacer(1));
    this.updateList();
  }
  handleInput(keyData) {
    const kb = getKeybindings();
    if (kb.matches(keyData, "tui.select.up")) {
      this.selectedIndex = this.selectedIndex === 0 ? HOST_EVENT_ORDER.length - 1 : this.selectedIndex - 1;
      this.updateList();
    } else if (kb.matches(keyData, "tui.select.down")) {
      this.selectedIndex = this.selectedIndex === HOST_EVENT_ORDER.length - 1 ? 0 : this.selectedIndex + 1;
      this.updateList();
    } else if (keyData === " ") {
      const event = HOST_EVENT_ORDER[this.selectedIndex];
      if (event) {
        if (this.enabled.has(event)) this.enabled.delete(event);
        else this.enabled.add(event);
        this.updateList();
      }
    } else if (kb.matches(keyData, "tui.select.confirm")) {
      this.onSelectCallback(HOST_EVENT_ORDER.filter((event) => this.enabled.has(event)));
    } else if (kb.matches(keyData, "tui.select.cancel")) {
      this.onCancelCallback();
    }
  }
  updateList() {
    this.listContainer.clear();
    const total = HOST_EVENT_ORDER.length;
    const startIndex = Math.max(
      0,
      Math.min(
        this.selectedIndex - Math.floor(MAX_VISIBLE_HOST_EVENTS / 2),
        total - MAX_VISIBLE_HOST_EVENTS
      )
    );
    const endIndex = Math.min(startIndex + MAX_VISIBLE_HOST_EVENTS, total);
    if (startIndex > 0) {
      this.listContainer.addChild(
        new Text(this.theme.fg("dim", `  \u2191 ${startIndex} earlier events`), 0, 0)
      );
    }
    for (let index = startIndex; index < endIndex; index++) {
      const event = HOST_EVENT_ORDER[index];
      const selected = index === this.selectedIndex;
      const checked = this.enabled.has(event);
      const box = checked ? this.theme.fg("success", "[x]") : this.theme.fg("dim", "[ ]");
      const label = `${box} ${event} \xB7 ${this.theme.fg("muted", EVENT_LABELS[event])}`;
      const line = selected ? `${this.theme.fg("accent", "\u2192 ")}${this.theme.fg("accent", label)}` : `  ${label}`;
      this.listContainer.addChild(new Text(line, 0, 0));
    }
    if (endIndex < total) {
      this.listContainer.addChild(
        new Text(this.theme.fg("dim", `  \u2193 ${total - endIndex} later events`), 0, 0)
      );
    }
    this.listContainer.addChild(new Spacer(1));
    this.listContainer.addChild(
      new Text(this.theme.fg("muted", "  space toggle \xB7 enter apply \xB7 esc cancel"), 0, 0)
    );
  }
};

// src/ui/fabric-actor-delivery-selector.ts
import {
  Container as Container2,
  SelectList,
  Spacer as Spacer2,
  Text as Text2
} from "@earendil-works/pi-tui";
var LAYOUT = {
  minPrimaryColumnWidth: 18,
  maxPrimaryColumnWidth: 34
};
var POLICIES = [
  { value: "mailbox", label: "Mailbox only", description: "keep output in actor history", delivery: "mailbox", triggerTurn: false },
  { value: "steer-passive", label: "Steer \xB7 passive", description: "deliver now without starting idle Main", delivery: "steer", triggerTurn: false },
  { value: "steer-active", label: "Steer \xB7 resume Main", description: "deliver now and start Main when idle", delivery: "steer", triggerTurn: true },
  { value: "followUp-passive", label: "Follow-up \xB7 passive", description: "deliver after the run without starting idle Main", delivery: "followUp", triggerTurn: false },
  { value: "followUp-active", label: "Follow-up \xB7 resume Main", description: "deliver after the run and start Main when idle", delivery: "followUp", triggerTurn: true },
  { value: "next-turn", label: "Next user turn", description: "defer until the next user prompt", delivery: "nextTurn", triggerTurn: false }
];
var selectListTheme = (theme) => ({
  selectedPrefix: (text) => theme.fg("accent", text),
  selectedText: (text) => theme.fg("accent", text),
  description: (text) => theme.fg("muted", text),
  scrollInfo: (text) => theme.fg("muted", text),
  noMatch: (text) => theme.fg("muted", text)
});
var FabricActorDeliverySelector = class extends Container2 {
  selectList;
  focused = false;
  constructor(options) {
    super();
    const current = POLICIES.find(
      (policy) => policy.delivery === options.currentValue.delivery && policy.triggerTurn === options.currentValue.triggerTurn
    )?.value;
    const items = POLICIES.map((policy) => ({
      value: policy.value,
      label: `${policy.label}${policy.value === current ? " \u2713" : ""}`,
      description: policy.description
    }));
    this.addChild(
      new Text2(
        options.theme.fg(
          "muted",
          options.headerText ?? "Choose how actor output enters Main and whether it starts a turn."
        ),
        0,
        0
      )
    );
    this.addChild(new Spacer2(1));
    this.selectList = new SelectList(items, items.length, selectListTheme(options.theme), LAYOUT);
    const startIndex = items.findIndex((item) => item.value === current);
    if (startIndex >= 0) this.selectList.setSelectedIndex(startIndex);
    this.selectList.onSelect = (item) => {
      const policy = POLICIES.find((candidate) => candidate.value === item.value);
      if (policy) options.onSelect({ delivery: policy.delivery, triggerTurn: policy.triggerTurn });
    };
    this.selectList.onCancel = options.onCancel;
    this.addChild(this.selectList);
    this.addChild(new Spacer2(1));
  }
  handleInput(data) {
    this.selectList.handleInput(data);
  }
};

// src/ui/fabric-actor-tool-selector.ts
import { Container as Container3, getKeybindings as getKeybindings2, Spacer as Spacer3, Text as Text3 } from "@earendil-works/pi-tui";
var ACTOR_TOOL_ORDER = ["read", "grep", "find", "ls", "bash", "edit", "write"];
var TOOL_LABELS = {
  read: "read files",
  grep: "search file contents",
  find: "find files by name",
  ls: "list directories",
  bash: "execute shell commands",
  edit: "edit existing files",
  write: "write files"
};
var FabricActorToolSelector = class extends Container3 {
  theme;
  onSelectCallback;
  onCancelCallback;
  listContainer = new Container3();
  enabled;
  selectedIndex = 0;
  focused = false;
  constructor(options) {
    super();
    this.theme = options.theme;
    this.onSelectCallback = options.onSelect;
    this.onCancelCallback = options.onCancel;
    this.enabled = new Set(options.currentValue);
    this.addChild(
      new Text3(
        this.theme.fg("muted", options.headerText ?? "Select the optional tools available to this actor."),
        0,
        0
      )
    );
    this.addChild(new Spacer3(1));
    this.addChild(this.listContainer);
    this.addChild(new Spacer3(1));
    this.updateList();
  }
  handleInput(keyData) {
    const kb = getKeybindings2();
    if (kb.matches(keyData, "tui.select.up")) {
      this.selectedIndex = this.selectedIndex === 0 ? ACTOR_TOOL_ORDER.length - 1 : this.selectedIndex - 1;
      this.updateList();
    } else if (kb.matches(keyData, "tui.select.down")) {
      this.selectedIndex = this.selectedIndex === ACTOR_TOOL_ORDER.length - 1 ? 0 : this.selectedIndex + 1;
      this.updateList();
    } else if (keyData === " ") {
      const tool = ACTOR_TOOL_ORDER[this.selectedIndex];
      if (tool) {
        if (this.enabled.has(tool)) this.enabled.delete(tool);
        else this.enabled.add(tool);
        this.updateList();
      }
    } else if (kb.matches(keyData, "tui.select.confirm")) {
      const selected = ACTOR_TOOL_ORDER.filter((tool) => this.enabled.has(tool));
      const custom = [...this.enabled].filter(
        (tool) => !ACTOR_TOOL_ORDER.includes(tool)
      );
      this.onSelectCallback([...selected, ...custom]);
    } else if (kb.matches(keyData, "tui.select.cancel")) {
      this.onCancelCallback();
    }
  }
  updateList() {
    this.listContainer.clear();
    for (let index = 0; index < ACTOR_TOOL_ORDER.length; index++) {
      const tool = ACTOR_TOOL_ORDER[index];
      const selected = index === this.selectedIndex;
      const checked = this.enabled.has(tool);
      const box = checked ? this.theme.fg("success", "[x]") : this.theme.fg("dim", "[ ]");
      const label = `${box} ${tool} \xB7 ${this.theme.fg("muted", TOOL_LABELS[tool])}`;
      const line = selected ? `${this.theme.fg("accent", "\u2192 ")}${this.theme.fg("accent", label)}` : `  ${label}`;
      this.listContainer.addChild(new Text3(line, 0, 0));
    }
    this.listContainer.addChild(new Spacer3(1));
    this.listContainer.addChild(
      new Text3(this.theme.fg("muted", "  space toggle \xB7 enter apply \xB7 esc cancel"), 0, 0)
    );
  }
};

// src/ui/fabric-thinking-selector.ts
import {
  Container as Container4,
  SelectList as SelectList2,
  Spacer as Spacer4,
  Text as Text4
} from "@earendil-works/pi-tui";
var LAYOUT2 = {
  minPrimaryColumnWidth: 8,
  maxPrimaryColumnWidth: 24
};
var selectListTheme2 = (theme) => ({
  selectedPrefix: (text) => theme.fg("accent", text),
  selectedText: (text) => theme.fg("accent", text),
  description: (text) => theme.fg("muted", text),
  scrollInfo: (text) => theme.fg("muted", text),
  noMatch: (text) => theme.fg("muted", text)
});
var FabricThinkingSelector = class extends Container4 {
  selectList;
  onSelectCallback;
  focused = false;
  constructor(options) {
    super();
    this.onSelectCallback = options.onSelect;
    const headerText = options.headerText ?? "Thinking level for this actor. Pick Inherit to use the Fabric default.";
    const inheritName = options.inheritName ?? "Use the Fabric default thinking level";
    const items = [
      {
        value: INHERIT_VALUE,
        label: `Inherit${options.currentValue === INHERIT_VALUE ? " \u2713" : ""}`,
        description: inheritName
      },
      ...THINKING_LEVELS.map((level) => ({
        value: level,
        label: `${thinkingLabel(level)}${options.currentValue === level ? " \u2713" : ""}`
      }))
    ];
    const startIndex = items.findIndex((item) => item.value === options.currentValue);
    this.addChild(new Text4(options.theme.fg("muted", headerText), 0, 0));
    this.addChild(new Spacer4(1));
    this.selectList = new SelectList2(items, items.length, selectListTheme2(options.theme), LAYOUT2);
    if (startIndex >= 0) this.selectList.setSelectedIndex(startIndex);
    this.selectList.onSelect = (item) => this.onSelectCallback(item.value);
    this.selectList.onCancel = options.onCancel;
    this.addChild(this.selectList);
    this.addChild(new Spacer4(1));
  }
  handleInput(data) {
    this.selectList.handleInput(data);
  }
};

// src/ui/dashboard.ts
var editorTheme = (theme) => ({
  borderColor: (value) => theme.fg("borderMuted", value),
  selectList: {
    selectedPrefix: (text) => theme.fg("accent", text),
    selectedText: (text) => theme.fg("accent", text),
    description: (text) => theme.fg("muted", text),
    scrollInfo: (text) => theme.fg("muted", text),
    noMatch: (text) => theme.fg("muted", text)
  }
});
var DASHBOARD_OVERLAY_HEIGHT_PERCENT = 90;
var DASHBOARD_OVERLAY_VERTICAL_MARGIN = 1;
var dashboardOverlayRows = (terminalRows) => Math.max(
  1,
  Math.min(
    Math.floor(terminalRows * DASHBOARD_OVERLAY_HEIGHT_PERCENT / 100),
    terminalRows - DASHBOARD_OVERLAY_VERTICAL_MARGIN * 2
  )
);
var FabricDashboard = class {
  constructor(tui, theme, snapshot, done, options = {}) {
    this.tui = tui;
    this.theme = theme;
    this.snapshot = snapshot;
    this.done = done;
    this.focused = true;
    this.modelSource = options.modelSource;
    this.codePreviewSettings = options.codePreviewSettings;
    this.keybindings = options.keybindings;
    this.claudeModelSource = options.claudeModelSource;
    this.onAgentSteer = options.onAgentSteer;
    this.onAgentFollowUp = options.onAgentFollowUp;
    this.onAgentStop = options.onAgentStop;
    this.onTargetMessage = options.onTargetMessage;
    this.agentTranscript = options.agentTranscript;
    this.actorTranscript = options.actorTranscript;
    this.loadOlderTranscript = options.loadOlderTranscript;
    this.loadNewerTranscript = options.loadNewerTranscript;
    this.loadLatestTranscript = options.loadLatestTranscript;
    this.onActorModel = options.onActorModel;
    this.onActorThinking = options.onActorThinking;
    this.onActorEvents = options.onActorEvents;
    this.onActorDeliveryPolicy = options.onActorDeliveryPolicy;
    this.onGlobalDeliveryPolicy = options.onGlobalDeliveryPolicy;
    this.onActorTools = options.onActorTools;
    this.actorDefaultTools = options.actorDefaultTools ?? [];
    this.onClearMessages = options.onClearMessages;
    this.onActorInstructions = options.onActorInstructions;
    this.onGlobalInstructions = options.onGlobalInstructions;
    this.onImportActor = options.onImportActor;
    this.onExportActor = options.onExportActor;
    this.onRemoveGlobalActor = options.onRemoveGlobalActor;
    this.detailRenderer = new DashboardDetailRenderer(tui, theme, snapshot, {
      agentTranscript: this.agentTranscript,
      actorTranscript: this.actorTranscript,
      codePreviewSettings: this.codePreviewSettings,
      actorDefaultTools: this.actorDefaultTools
    });
  }
  focused = false;
  pane = "phases";
  overviewView = "activity";
  graphPositions = /* @__PURE__ */ new Map();
  graphCamera = { x: 0, y: 0 };
  graphCameraTarget = { x: 0, y: 0 };
  graphVelocity = { x: 0, y: 0 };
  graphCameraInitialized = false;
  graphAnimation;
  graphAnimationAt = 0;
  graphEffectsAnimation;
  graphReducedMotion = false;
  graphShowHistory = false;
  graphReplayIndex;
  graphReplayPlaying = false;
  graphReplaySpeed = 1;
  graphReplayAdvancedAt = 0;
  graphReplayLength = 0;
  graphReplayLabel;
  phaseIndex = 0;
  entityIndex = 0;
  runIndex = 0;
  selectedRunId;
  runSelectionTouched = false;
  selectedEntityId;
  filter = "all";
  phaseSelectionTouched = false;
  selectedPhaseId;
  detailId;
  detailScroll = 0;
  detailMaxScroll = 0;
  transcriptPageAnchor;
  transcriptToolsExpanded = false;
  detailSelectionRestore;
  detailView = "summary";
  transcriptFollowing = true;
  detailRenderer;
  highlightInvalidate = () => this.tui.requestRender();
  mode = "overview";
  picker;
  editor;
  editorActorName;
  agentMessageTarget;
  pendingStop;
  modelSource;
  claudeModelSource;
  onAgentSteer;
  onAgentFollowUp;
  onAgentStop;
  onTargetMessage;
  agentTranscript;
  actorTranscript;
  loadOlderTranscript;
  loadNewerTranscript;
  loadLatestTranscript;
  onActorModel;
  onActorThinking;
  onActorEvents;
  onActorDeliveryPolicy;
  onGlobalDeliveryPolicy;
  onActorTools;
  actorDefaultTools;
  onClearMessages;
  onActorInstructions;
  onGlobalInstructions;
  onImportActor;
  onExportActor;
  onRemoveGlobalActor;
  codePreviewSettings;
  keybindings;
  pickerActorName;
  handleInput(data) {
    if (this.mode === "help") {
      if (data === "?" || matchesKey(data, Key.escape) || matchesKey(data, Key.ctrl("c"))) {
        this.mode = this.detailId ? "detail" : "overview";
      }
      this.tui.requestRender();
      return;
    }
    if (this.mode === "agentMessageEditor" && this.editor) {
      if (getKeybindings3().matches(data, "tui.select.cancel")) {
        this.closeAgentMessageEditor();
      } else {
        this.editor.handleInput(data);
      }
      this.tui.requestRender();
      return;
    }
    if (this.mode === "instructionsEditor" && this.editor) {
      if (getKeybindings3().matches(data, "tui.select.cancel")) {
        this.closeInstructionsEditor();
      } else {
        this.editor.handleInput(data);
      }
      this.tui.requestRender();
      return;
    }
    if ((this.mode === "modelPicker" || this.mode === "thinkingPicker" || this.mode === "deliveryPicker" || this.mode === "eventsPicker" || this.mode === "toolsPicker") && this.picker) {
      this.picker.handleInput(data);
      this.tui.requestRender();
      return;
    }
    const snapshot = this.snapshot();
    const run = this.selectRun(snapshot);
    const panels = phasePanels(snapshot, run);
    this.syncPhase(run, panels);
    const panel = panels[this.phaseIndex];
    const projectMesh = this.projectMesh(snapshot);
    const allEntities = entitiesForOverview(
      snapshot,
      run,
      panel,
      this.overviewView,
      projectMesh
    );
    const entities = allEntities.filter(
      (entity) => entity.kind === "main" || matchesFilter(entity.status, this.filter)
    );
    this.syncEntitySelection(entities, this.overviewView !== "activity");
    if (data === "?") {
      this.mode = "help";
      this.tui.requestRender();
      return;
    }
    if (this.detailId) {
      if (matchesKey(data, Key.escape) || matchesKey(data, Key.ctrl("c")) || matchesKey(data, Key.left) || data === "h") {
        this.closeDetail();
      } else if (data === "t") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && this.hasTranscript(detail)) {
          this.detailView = this.detailView === "summary" ? "transcript" : "summary";
          this.detailScroll = 0;
          this.transcriptPageAnchor = void 0;
          this.transcriptFollowing = true;
        }
      } else if (this.detailView === "transcript" && this.matchesTranscriptToolToggle(data)) {
        this.transcriptToolsExpanded = !this.transcriptToolsExpanded;
      } else if (matchesKey(data, Key.up) || data === "k") {
        if (this.detailScroll > 0) {
          if (this.detailView === "transcript") this.transcriptFollowing = false;
          this.detailScroll--;
        } else if (this.detailView === "transcript") {
          const detail = allEntities.find((entity) => entity.id === this.detailId);
          const target = detail ? this.transcriptTarget(detail) : void 0;
          if (target && this.loadOlderTranscript?.(target)) {
            this.transcriptPageAnchor = "end";
            this.transcriptFollowing = false;
          }
        }
      } else if (matchesKey(data, Key.down) || data === "j") {
        if (this.detailScroll < this.detailMaxScroll) {
          if (this.detailView === "transcript") this.transcriptFollowing = false;
          this.detailScroll++;
        } else if (this.detailView === "transcript") {
          const detail = allEntities.find((entity) => entity.id === this.detailId);
          const target = detail ? this.transcriptTarget(detail) : void 0;
          if (target && this.loadNewerTranscript?.(target)) {
            this.transcriptPageAnchor = "start";
            this.transcriptFollowing = false;
          }
        }
      } else if (data === "G" && this.detailView === "transcript") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        const target = detail ? this.transcriptTarget(detail) : void 0;
        if (target) this.loadLatestTranscript?.(target);
        this.transcriptPageAnchor = void 0;
        this.transcriptFollowing = true;
        this.detailScroll = this.detailMaxScroll;
      } else if (matchesKey(data, Key.home) || data === "g") {
        if (this.detailView === "transcript") {
          this.transcriptPageAnchor = void 0;
          this.transcriptFollowing = false;
        }
        this.detailScroll = 0;
      } else if (data === "s" || data === "u") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        const delivery = data === "s" ? "steer" : "followUp";
        if (detail && this.canMessage(detail, delivery)) {
          this.openAgentMessageEditor(detail, delivery);
        }
      } else if (data === "m" || data === "M") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && detail.kind === "actor" && detail.status !== "stopped" && (data === "m" || detail.value.local !== false)) {
          this.openModelPicker(detail, data === "M" ? "project" : "session");
        }
      } else if (data === "e" || data === "E") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && detail.kind === "actor" && detail.status !== "stopped" && (data === "e" || detail.value.local !== false)) {
          this.openThinkingPicker(detail, data === "E" ? "project" : "session");
        }
      } else if (data === "y") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && (detail.kind === "globalActor" || detail.kind === "actor" && detail.value.local !== false)) {
          this.openDeliveryPicker(detail);
        }
      } else if (data === "v") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && detail.kind === "actor" && detail.status !== "stopped" && detail.value.local !== false) {
          this.openEventsPicker(detail);
        }
      } else if (data === "o") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && detail.kind === "actor" && detail.status !== "stopped" && detail.value.local !== false) {
          this.openToolsPicker(detail);
        }
      } else if (data === "c") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && detail.kind === "actor" && detail.status !== "stopped" && detail.value.local !== false && this.onClearMessages) {
          this.onClearMessages(detail.value.id);
        }
      } else if (data === "i") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && (detail.kind === "globalActor" || detail.kind === "actor" && detail.value.local !== false)) {
          this.openInstructionsEditor(detail);
        }
      } else if (data === "x") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && this.canStop(detail)) {
          this.requestParticipantStop(detail);
        } else if (detail && detail.kind === "actor" && detail.status !== "stopped" && this.onExportActor) {
          this.onExportActor(detail.value.id);
        }
      } else if (data === "p") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && detail.kind === "globalActor" && this.onImportActor) {
          this.onImportActor(detail.value.id);
        }
      } else if (data === "d") {
        const detail = allEntities.find((entity) => entity.id === this.detailId);
        if (detail && detail.kind === "globalActor" && this.onRemoveGlobalActor) {
          this.onRemoveGlobalActor(detail.value.id);
        }
      }
      this.tui.requestRender();
      return;
    }
    if (data === "1" || data === "2") {
      const nextOverview = data === "1" ? "activity" : "topology";
      if (nextOverview !== this.overviewView) {
        if (nextOverview === "activity") {
          this.stopGraphAnimation();
          this.stopGraphEffectsAnimation();
        }
        this.overviewView = nextOverview;
        this.pane = nextOverview === "activity" ? "phases" : "entities";
        this.entityIndex = 0;
        this.selectedEntityId = void 0;
        this.pendingStop = void 0;
      }
      this.tui.requestRender();
      return;
    }
    if (matchesKey(data, Key.escape) || matchesKey(data, Key.ctrl("c"))) {
      if (this.overviewView === "activity" && this.pane === "entities") {
        this.pane = "phases";
      } else {
        this.done();
        return;
      }
    } else if (this.overviewView === "topology" && data === "r") {
      this.toggleGraphReplay(snapshot, projectMesh);
      this.startGraphEffectsAnimation();
      this.tui.requestRender();
      return;
    } else if (this.overviewView === "topology" && this.graphReplayIndex !== void 0 && data === " ") {
      this.graphReplayPlaying = !this.graphReplayPlaying;
      this.graphReplayAdvancedAt = Date.now();
      this.startGraphEffectsAnimation();
      this.tui.requestRender();
      return;
    } else if (this.overviewView === "topology" && this.graphReplayIndex !== void 0 && (matchesKey(data, Key.left) || matchesKey(data, Key.right))) {
      this.stepGraphReplay(matchesKey(data, Key.left) ? -1 : 1);
      this.tui.requestRender();
      return;
    } else if (this.overviewView === "topology" && (data === "+" || data === "=" || data === "-")) {
      const speeds = [0.5, 1, 2, 4];
      const current = speeds.indexOf(this.graphReplaySpeed);
      const direction = data === "-" ? -1 : 1;
      this.graphReplaySpeed = speeds[Math.max(0, Math.min(speeds.length - 1, current + direction))] ?? 1;
      this.graphReplayAdvancedAt = Date.now();
      this.tui.requestRender();
      return;
    } else if (this.overviewView === "topology" && data === "H") {
      this.graphShowHistory = !this.graphShowHistory;
      this.tui.requestRender();
      return;
    } else if (this.overviewView === "topology" && data === "M") {
      const selected = this.pane === "entities" ? entities[this.entityIndex] : void 0;
      if (selected?.kind === "actor" && selected.status !== "stopped" && selected.value.local !== false && this.modelSourceForActor(selected.value) && this.onActorModel) {
        this.detailId = selected.id;
        this.openModelPicker(selected, "project");
      } else {
        this.graphReducedMotion = !this.graphReducedMotion;
      }
      this.tui.requestRender();
      return;
    } else if (this.overviewView === "topology" && (matchesKey(data, Key.left) || matchesKey(data, Key.right) || matchesKey(data, Key.up) || matchesKey(data, Key.down) || data === "h" || data === "l")) {
      const direction = matchesKey(data, Key.left) || data === "h" ? "left" : matchesKey(data, Key.right) || data === "l" ? "right" : matchesKey(data, Key.up) ? "up" : "down";
      const target = directionalGraphTarget(this.graphPositions, this.selectedEntityId, direction);
      const targetIndex = target ? entities.findIndex((entity) => entity.id === target) : -1;
      if (targetIndex >= 0) {
        this.entityIndex = targetIndex;
        this.selectedEntityId = target;
        this.pendingStop = void 0;
      }
      this.tui.requestRender();
      return;
    } else if (matchesKey(data, Key.tab) && this.overviewView === "topology") {
      this.entityIndex = entities.length > 0 ? (this.entityIndex + 1) % entities.length : 0;
      this.selectedEntityId = entities[this.entityIndex]?.id;
      this.pendingStop = void 0;
      this.tui.requestRender();
      return;
    } else if (matchesKey(data, Key.tab) && this.overviewView === "activity") {
      this.pane = this.pane === "phases" ? "entities" : "phases";
    } else if (this.overviewView === "activity" && (matchesKey(data, Key.left) || data === "h")) {
      this.pane = "phases";
    } else if (this.overviewView === "activity" && (matchesKey(data, Key.right) || data === "l")) {
      this.pane = "entities";
    } else if (matchesKey(data, Key.up) || data === "k") {
      if (this.overviewView === "activity" && this.pane === "phases") {
        this.phaseIndex = Math.max(0, this.phaseIndex - 1);
        this.phaseSelectionTouched = true;
        this.entityIndex = 0;
        this.selectedEntityId = void 0;
      } else {
        this.entityIndex = Math.max(0, this.entityIndex - 1);
      }
    } else if (matchesKey(data, Key.down) || data === "j") {
      if (this.overviewView === "activity" && this.pane === "phases") {
        this.phaseIndex = Math.min(Math.max(0, panels.length - 1), this.phaseIndex + 1);
        this.phaseSelectionTouched = true;
        this.entityIndex = 0;
        this.selectedEntityId = void 0;
      } else {
        this.entityIndex = Math.min(Math.max(0, entities.length - 1), this.entityIndex + 1);
      }
    } else if (["m", "M", "e", "E", "y", "v", "o", "i", "c", "s", "u", "x", "p", "d"].includes(data) && this.pane === "entities") {
      const selected = entities[this.entityIndex];
      if (selected) {
        if ((data === "s" || data === "u") && this.canMessage(selected, data === "s" ? "steer" : "followUp")) {
          this.detailId = selected.id;
          this.openAgentMessageEditor(selected, data === "s" ? "steer" : "followUp");
        } else if (data === "x" && this.canStop(selected)) {
          this.requestParticipantStop(selected);
        } else if (data === "x" && selected.kind === "actor" && selected.status !== "stopped" && this.onExportActor) {
          this.onExportActor(selected.value.id);
        } else if ((data === "m" || data === "M") && selected.kind === "actor" && selected.status !== "stopped" && (data === "m" || selected.value.local !== false)) {
          this.detailId = selected.id;
          this.openModelPicker(selected, data === "M" ? "project" : "session");
        } else if ((data === "e" || data === "E") && selected.kind === "actor" && selected.status !== "stopped" && (data === "e" || selected.value.local !== false)) {
          this.detailId = selected.id;
          this.openThinkingPicker(selected, data === "E" ? "project" : "session");
        } else if (data === "y" && (selected.kind === "globalActor" || selected.kind === "actor" && selected.status !== "stopped" && selected.value.local !== false)) {
          this.detailId = selected.id;
          this.openDeliveryPicker(selected);
        } else if (data === "v" && selected.kind === "actor" && selected.status !== "stopped" && selected.value.local !== false) {
          this.detailId = selected.id;
          this.openEventsPicker(selected);
        } else if (data === "o" && selected.kind === "actor" && selected.status !== "stopped" && selected.value.local !== false) {
          this.detailId = selected.id;
          this.openToolsPicker(selected);
        } else if (data === "c" && selected.kind === "actor" && selected.status !== "stopped" && selected.value.local !== false && this.onClearMessages) {
          this.onClearMessages(selected.value.id);
        } else if (data === "i" && (selected.kind === "globalActor" || selected.kind === "actor" && selected.value.local !== false)) {
          this.detailId = selected.id;
          this.openInstructionsEditor(selected);
        } else if (data === "p" && selected.kind === "globalActor" && this.onImportActor) {
          this.onImportActor(selected.value.id);
        } else if (data === "d" && selected.kind === "globalActor" && this.onRemoveGlobalActor) {
          this.onRemoveGlobalActor(selected.value.id);
        }
      }
    } else if (data === " " && this.pane === "entities") {
      const selected = entities[this.entityIndex];
      if (selected && this.hasTranscript(selected)) {
        this.detailId = selected.id;
        this.detailView = "transcript";
        this.detailScroll = 0;
        this.transcriptPageAnchor = void 0;
        this.transcriptFollowing = true;
      }
    } else if (matchesKey(data, Key.enter)) {
      if (this.overviewView === "activity" && this.pane === "phases") {
        this.pane = "entities";
      } else {
        const selected = entities[this.entityIndex];
        if (selected) {
          this.detailId = selected.id;
          this.detailView = "summary";
          this.detailScroll = 0;
          this.transcriptFollowing = true;
        }
      }
    } else if (data === "f") {
      const next = (filters.indexOf(this.filter) + 1) % filters.length;
      this.filter = filters[next] ?? "all";
      this.entityIndex = 0;
      this.selectedEntityId = void 0;
      this.tui.requestRender();
      return;
    } else if (data === "[") {
      this.runIndex = Math.min(Math.max(0, snapshot.runs.length - 1), this.runIndex + 1);
      this.selectedRunId = snapshot.runs[this.runIndex]?.id;
      this.runSelectionTouched = true;
      this.resetSelection();
      this.tui.requestRender();
      return;
    } else if (data === "]") {
      this.runIndex = Math.max(0, this.runIndex - 1);
      this.selectedRunId = snapshot.runs[this.runIndex]?.id;
      this.runSelectionTouched = true;
      this.resetSelection();
      this.tui.requestRender();
      return;
    } else if (data === "G") {
      if (this.overviewView === "activity" && this.pane === "phases") {
        this.phaseIndex = Math.max(0, panels.length - 1);
        this.phaseSelectionTouched = true;
        this.entityIndex = 0;
        this.selectedEntityId = void 0;
      } else {
        this.entityIndex = Math.max(0, entities.length - 1);
      }
    } else if (data === "g") {
      if (this.overviewView === "activity" && this.pane === "phases") {
        this.phaseIndex = 0;
        this.phaseSelectionTouched = true;
        this.entityIndex = 0;
        this.selectedEntityId = void 0;
      } else {
        this.entityIndex = 0;
      }
    }
    if (this.phaseSelectionTouched) this.selectedPhaseId = panels[this.phaseIndex]?.id;
    if (this.detailId) {
      this.pinDetailSelection(run, panel, this.overviewView === "activity");
    }
    if (this.pane === "entities") {
      this.selectedEntityId = entities[this.entityIndex]?.id;
    }
    this.tui.requestRender();
  }
  render(width) {
    if (width <= 0) return [];
    if (this.mode === "help") return this.renderHelp(width);
    if (this.mode === "agentMessageEditor") return this.renderAgentMessageEditor(width);
    if (this.mode === "instructionsEditor") {
      return this.renderInstructionsEditor(width);
    }
    if ((this.mode === "modelPicker" || this.mode === "thinkingPicker" || this.mode === "deliveryPicker" || this.mode === "eventsPicker" || this.mode === "toolsPicker") && this.picker) {
      return this.renderPicker(width);
    }
    const snapshot = this.snapshot();
    const run = this.selectRun(snapshot);
    const panels = phasePanels(snapshot, run);
    this.syncPhase(run, panels);
    const panel = panels[this.phaseIndex];
    const projectMesh = this.projectMesh(snapshot);
    const allEntities = entitiesForOverview(
      snapshot,
      run,
      panel,
      this.overviewView,
      projectMesh
    );
    const entities = allEntities.filter(
      (entity) => entity.kind === "main" || matchesFilter(entity.status, this.filter)
    );
    this.syncEntitySelection(entities, this.overviewView !== "activity");
    if (this.detailId) {
      const detail = allEntities.find((entity) => entity.id === this.detailId);
      if (detail) return this.renderDetail(width, snapshot, detail);
      this.closeDetail();
    }
    return this.renderOverview(
      width,
      snapshot,
      run,
      panels,
      entities,
      allEntities,
      projectMesh
    );
  }
  invalidate() {
    this.detailRenderer.invalidate();
  }
  dispose() {
    this.picker = void 0;
    this.editor = void 0;
    this.editorActorName = void 0;
    this.agentMessageTarget = void 0;
    this.pendingStop = void 0;
    this.stopGraphAnimation();
    this.stopGraphEffectsAnimation();
    this.detailRenderer.invalidate();
    this.mode = "overview";
  }
  transcriptTarget(entity) {
    if (entity.kind === "agent" || entity.kind === "actor") return entity.value;
    return void 0;
  }
  hasTranscript(entity) {
    return entity.kind === "agent" && this.agentTranscript !== void 0 || entity.kind === "actor" && this.actorTranscript !== void 0;
  }
  matchesTranscriptToolToggle(data) {
    if (this.keybindings) return this.keybindings.matches(data, "app.tools.expand");
    const keybindings = getKeybindings3();
    const keys = keybindings.getKeys("app.tools.expand");
    return keys.length > 0 ? keybindings.matches(data, "app.tools.expand") : matchesKey(data, Key.ctrl("o"));
  }
  transcriptToolToggleHint() {
    const keys = (this.keybindings ?? getKeybindings3()).getKeys("app.tools.expand");
    const key = keys.length > 0 ? keys.join("/") : this.keybindings ? "unbound" : "ctrl+o";
    return `${key} ${this.transcriptToolsExpanded ? "collapse" : "expand"} tools`;
  }
  messageTarget(entity) {
    if (entity.kind === "main") {
      return { id: entity.value.id, name: "Main", kind: "main" };
    }
    if (entity.kind === "peer") {
      return { id: entity.value.id, name: entity.value.name, kind: "peer" };
    }
    if (entity.kind === "agent") {
      return { id: entity.value.id, name: entity.value.name, kind: "agent" };
    }
    if (entity.kind === "actor") {
      return { id: entity.value.id, name: entity.value.name, kind: "actor" };
    }
    if (entity.kind === "meshParticipant") {
      return { id: entity.value.id, name: entity.value.name, kind: "meshParticipant" };
    }
    return void 0;
  }
  canMessage(entity, delivery) {
    const target = this.messageTarget(entity);
    if (!target) return false;
    if (target.kind === "agent") {
      if (!isActiveStatus(entity.status)) return false;
      if (entity.kind === "agent" && entity.value.capabilities && !entity.value.capabilities.includes(delivery)) {
        return false;
      }
      return Boolean(
        this.onTargetMessage || (delivery === "steer" ? this.onAgentSteer : this.onAgentFollowUp)
      );
    }
    if (!this.onTargetMessage) return false;
    if (target.kind === "actor") return entity.status !== "stopped" && delivery === "steer";
    if (target.kind === "meshParticipant" && entity.kind === "meshParticipant") {
      const participant = entity.value.participant;
      return participant ? !participant.stale && participant.capabilities.includes(delivery) : true;
    }
    return true;
  }
  openAgentMessageEditor(entity, delivery) {
    const target = this.messageTarget(entity);
    if (!target || !this.canMessage(entity, delivery)) return;
    const editor = new Editor(this.tui, editorTheme(this.theme));
    editor.focused = true;
    editor.onSubmit = (text) => {
      const message = text.trim();
      if (!message) return;
      if (this.onTargetMessage) {
        this.onTargetMessage(target, message, delivery);
      } else if (target.kind === "agent") {
        if (delivery === "steer") this.onAgentSteer?.(target.id, message);
        else this.onAgentFollowUp?.(target.id, message);
      }
      this.closeAgentMessageEditor();
    };
    this.editor = editor;
    this.agentMessageTarget = { ...target, delivery };
    this.mode = "agentMessageEditor";
  }
  closeAgentMessageEditor() {
    this.editor = void 0;
    this.agentMessageTarget = void 0;
    this.mode = this.detailId ? "detail" : "overview";
  }
  canStop(entity) {
    if (!this.onAgentStop) return false;
    if (entity.kind === "agent") {
      return isActiveStatus(entity.status) && (!entity.value.capabilities || entity.value.capabilities.includes("stop"));
    }
    if (entity.kind === "meshParticipant") {
      const participant = entity.value.participant;
      return Boolean(
        participant && !participant.stale && participant.capabilities.includes("stop")
      );
    }
    return false;
  }
  requestParticipantStop(entity) {
    if (!this.onAgentStop || !this.canStop(entity)) return;
    const now = Date.now();
    if (this.pendingStop?.id === entity.value.id && this.pendingStop.expiresAt > now) {
      this.pendingStop = void 0;
      this.onAgentStop(entity.value.id);
      return;
    }
    this.pendingStop = { id: entity.value.id, expiresAt: now + 2e3 };
  }
  renderAgentMessageEditor(width) {
    if (!this.editor || !this.agentMessageTarget) return [];
    if (width < 24) return this.renderNarrowFallback(width, `${this.agentMessageTarget.delivery} \xB7 ${this.agentMessageTarget.name}`, "esc cancel");
    const target = this.agentMessageTarget;
    const label = target.kind === "actor" ? "queue actor message" : target.delivery === "steer" ? target.kind === "main" ? "message or steer Main" : "steer now" : "queue follow-up";
    const innerWidth = width - 2;
    const lines = [this.topBorder(width, `${label} \xB7 ${target.name}`)];
    for (const line of this.editor.render(innerWidth)) lines.push(this.row(width, line));
    lines.push(this.middleBorder(width));
    lines.push(
      this.row(
        width,
        this.theme.fg("dim", "  enter send \xB7 shift+enter newline \xB7 esc cancel")
      )
    );
    lines.push(this.bottomBorder(width));
    return lines.map((line) => truncateToWidth4(line, width, ""));
  }
  renderHelp(width) {
    if (width < 24) return this.renderNarrowFallback(width, "dashboard help", "? or esc close");
    const lines = [this.topBorder(width, "Fabric dashboard help")];
    const mainActions = [
      this.onTargetMessage ? "s message/steer" : void 0,
      this.onTargetMessage ? "u queue follow-up" : void 0,
      "enter details"
    ].filter((value) => Boolean(value));
    const agentActions = [
      this.agentTranscript ? "space transcript peek" : void 0,
      this.onTargetMessage || this.onAgentSteer ? "s steer now" : void 0,
      this.onTargetMessage || this.onAgentFollowUp ? "u queue follow-up" : void 0,
      this.onAgentStop ? "x twice stop" : void 0,
      "enter details"
    ].filter((value) => Boolean(value));
    const actorActions = [
      this.actorTranscript ? "space transcript peek" : void 0,
      this.onTargetMessage ? "s queue message" : void 0,
      (this.modelSource || this.claudeModelSource) && this.onActorModel ? "m session model \xB7 M pin model" : void 0,
      this.onActorThinking ? "e session thinking \xB7 E pin thinking" : void 0,
      this.onActorDeliveryPolicy ? "y delivery policy" : void 0,
      this.onActorEvents ? "v events" : void 0,
      this.onActorTools ? "o tools" : void 0,
      this.onActorInstructions ? "i instructions" : void 0,
      this.onClearMessages ? "c clear mailbox" : void 0,
      this.onExportActor ? "x export" : void 0
    ].filter((value) => Boolean(value));
    const templateActions = [
      this.onGlobalDeliveryPolicy ? "y delivery policy" : void 0,
      this.onGlobalInstructions ? "i instructions" : void 0,
      this.onImportActor ? "p import" : void 0,
      this.onRemoveGlobalActor ? "d delete" : void 0
    ].filter((value) => Boolean(value));
    const help = [
      ["Navigate", "Topology: arrows/h/l move spatially \xB7 j/k ordered selection \xB7 tab next \xB7 enter inspect \xB7 esc back"],
      ["Views", "1 Activity \xB7 2 unified Topology"],
      ["Topology", "Main branches into Participants (sessions, agents, actors) and Mesh (namespaced topics and hierarchical state); traffic travels on decaying edges"],
      ["Motion", "r replay/live \xB7 space pause/play \xB7 \u2190/\u2192 step \xB7 +/- speed \xB7 H history \xB7 M reduced motion"],
      ["Runs", "[ older \xB7 ] newer \xB7 f cycle status filter"],
      ...mainActions.length > 1 ? [["Main", mainActions.join(" \xB7 ")]] : [],
      ...agentActions.length > 1 ? [["Agents", agentActions.join(" \xB7 ")]] : [],
      ...actorActions.length > 0 ? [["Actors", actorActions.join(" \xB7 ")]] : [],
      ...templateActions.length > 0 ? [["Templates", templateActions.join(" \xB7 ")]] : [],
      [
        "Details",
        `\u2191\u2193/jk lazy scroll \xB7 g page top \xB7 G live tail \xB7 ${this.transcriptToolToggleHint()} \xB7 t transcript/summary \xB7 ? close help`
      ]
    ];
    for (const [label, value] of help) {
      const prefix = `${this.theme.fg("accent", `${label}:`)} `;
      const wrapped = wrapPlainText(value ?? "", Math.max(1, width - 2 - visibleWidth4(prefix)), 3);
      if (wrapped[0]) lines.push(this.row(width, prefix + wrapped[0]));
      for (const continuation of wrapped.slice(1)) {
        lines.push(this.row(width, " ".repeat(visibleWidth4(prefix)) + continuation));
      }
    }
    lines.push(this.middleBorder(width));
    lines.push(this.row(width, this.theme.fg("dim", "  ? or esc close")));
    lines.push(this.bottomBorder(width));
    return lines.map((line) => truncateToWidth4(line, width, ""));
  }
  modelSourceForActor(actor) {
    return actor.runner === "claude" ? this.claudeModelSource : this.modelSource;
  }
  openModelPicker(entity, scope = "session") {
    if (entity.kind !== "actor" || !this.onActorModel) return;
    const actor = entity.value;
    if (scope === "project" && actor.local === false) return;
    const source = this.modelSourceForActor(actor);
    if (!source) return;
    const projectModel = actor.projectDefaults?.model ?? (actor.binding ? void 0 : actor.model);
    const currentValue = scope === "session" ? actor.binding?.model : projectModel;
    const runtimeDefault = actor.runner === "claude" ? "Fabric Claude model (or Claude Code runtime default)" : "Fabric Pi model (or host default)";
    this.pickerActorName = actor.name;
    this.picker = new FabricModelSelector({
      theme: this.theme,
      source,
      currentValue: currentValue ?? INHERIT_VALUE,
      headerText: scope === "session" ? actor.runner === "claude" ? `Model for Claude actor "${actor.name}" \xB7 session binding. Inherit uses the project default.` : `Model for actor "${actor.name}" \xB7 session binding. Inherit uses the project default.` : `Project model default for actor "${actor.name}". This pin is shared by every session.`,
      inheritName: scope === "session" ? `Use project default (${projectModel ?? runtimeDefault})` : `Clear project pin; use ${runtimeDefault}`,
      onSelect: (value) => {
        const model = value === INHERIT_VALUE ? void 0 : value;
        this.onActorModel(actor.id, model, scope);
        this.closeModelPicker();
      },
      onCancel: () => this.closeModelPicker()
    });
    this.picker.focused = true;
    this.mode = "modelPicker";
  }
  openThinkingPicker(entity, scope = "session") {
    if (entity.kind !== "actor" || !this.onActorThinking) return;
    const actor = entity.value;
    if (scope === "project" && actor.local === false) return;
    const projectThinking = actor.projectDefaults?.thinking ?? (actor.binding ? void 0 : actor.thinking);
    const currentValue = scope === "session" ? actor.binding?.thinking : projectThinking;
    this.pickerActorName = actor.name;
    this.picker = new FabricThinkingSelector({
      theme: this.theme,
      currentValue: currentValue ?? INHERIT_VALUE,
      headerText: scope === "session" ? `Thinking level for actor "${actor.name}" \xB7 session binding. Inherit uses the project default.` : `Project thinking default for actor "${actor.name}". This pin is shared by every session.`,
      inheritName: scope === "session" ? `Use project default (${projectThinking ?? "Fabric default"})` : "Clear project pin; use the Fabric default thinking level",
      onSelect: (value) => {
        const thinking = value === INHERIT_VALUE ? void 0 : value;
        this.onActorThinking(
          actor.id,
          isFabricThinking(thinking) ? thinking : void 0,
          scope
        );
        this.closeModelPicker();
      },
      onCancel: () => this.closeModelPicker()
    });
    this.picker.focused = true;
    this.mode = "thinkingPicker";
  }
  openDeliveryPicker(entity) {
    if (entity.kind !== "actor" && entity.kind !== "globalActor") return;
    const target = entity.value;
    const callback = entity.kind === "actor" ? this.onActorDeliveryPolicy : this.onGlobalDeliveryPolicy;
    if (!callback || entity.kind === "actor" && (entity.status === "stopped" || entity.value.local === false)) return;
    this.pickerActorName = target.name;
    this.picker = new FabricActorDeliverySelector({
      theme: this.theme,
      currentValue: { delivery: target.delivery, triggerTurn: target.triggerTurn },
      headerText: `Delivery policy for ${entity.kind === "actor" ? "actor" : "template"} "${target.name}". Active delivery requires an explicit resume choice.`,
      onSelect: (policy) => {
        callback(target.id, policy.delivery, policy.triggerTurn);
        this.closeModelPicker();
      },
      onCancel: () => this.closeModelPicker()
    });
    this.picker.focused = true;
    this.mode = "deliveryPicker";
  }
  openEventsPicker(entity) {
    if (entity.kind !== "actor" || entity.value.local === false || !this.onActorEvents) return;
    const actor = entity.value;
    this.pickerActorName = actor.name;
    this.picker = new FabricHostEventSelector({
      theme: this.theme,
      currentValue: actor.events,
      headerText: `Host events for actor "${actor.name}". Toggle with space, Enter to apply, Esc to cancel.`,
      onSelect: (events) => {
        this.onActorEvents(actor.id, events);
        this.closeModelPicker();
      },
      onCancel: () => this.closeModelPicker()
    });
    this.picker.focused = true;
    this.mode = "eventsPicker";
  }
  openToolsPicker(entity) {
    if (entity.kind !== "actor" || entity.value.local === false || !this.onActorTools) return;
    const actor = entity.value;
    this.pickerActorName = actor.name;
    this.picker = new FabricActorToolSelector({
      theme: this.theme,
      currentValue: actor.tools ?? this.actorDefaultTools,
      headerText: `Tools for actor "${actor.name}". Toggle with space, Enter to apply, Esc to cancel. Pi actors always retain fabric_exec.`,
      onSelect: (tools) => {
        this.onActorTools(actor.id, tools);
        this.closeModelPicker();
      },
      onCancel: () => this.closeModelPicker()
    });
    this.picker.focused = true;
    this.mode = "toolsPicker";
  }
  closeModelPicker() {
    this.picker = void 0;
    this.pickerActorName = void 0;
    this.mode = "detail";
  }
  /**
   * Open the embedded multi-line editor for an actor's default instruction.
   * Matches Pi's editor dialog convention (Enter submit, Shift+Enter newline,
   * Esc/Ctrl+C cancel) so a steering user edits the persona with the same
   * muscle memory as the chat input. Works for both live project actors and
   * global templates; the submit routes to the scope-appropriate callback.
   */
  openInstructionsEditor(entity) {
    let kind;
    let id;
    let name;
    let instructions;
    if (entity.kind === "actor") {
      if (entity.status === "stopped" || entity.value.local === false || !this.onActorInstructions) return;
      kind = "actor";
      id = entity.value.id;
      name = entity.value.name;
      instructions = entity.value.instructions;
    } else if (entity.kind === "globalActor") {
      if (!this.onGlobalInstructions) return;
      kind = "globalActor";
      id = entity.value.id;
      name = entity.value.name;
      instructions = entity.value.instructions;
    } else {
      return;
    }
    const editor = new Editor(this.tui, editorTheme(this.theme));
    editor.focused = true;
    editor.setText(instructions);
    editor.onSubmit = (text) => {
      if (kind === "actor") this.onActorInstructions?.(id, text);
      else this.onGlobalInstructions?.(id, text);
      this.closeInstructionsEditor();
    };
    this.editor = editor;
    this.editorActorName = name;
    this.mode = "instructionsEditor";
  }
  closeInstructionsEditor() {
    this.editor = void 0;
    this.editorActorName = void 0;
    this.mode = "detail";
  }
  renderPicker(width) {
    if (!this.picker) return [];
    if (width < 24) return this.renderNarrowFallback(width, `actor \xB7 ${this.pickerActorName ?? ""}`, "esc cancel");
    const kind = this.mode === "thinkingPicker" ? "thinking" : this.mode === "deliveryPicker" ? "delivery" : this.mode === "eventsPicker" ? "events" : this.mode === "toolsPicker" ? "tools" : "model";
    const lines = [
      this.topBorder(width, `actor \xB7 ${this.pickerActorName ?? ""} \xB7 ${kind}`)
    ];
    const inner = this.picker.render(width - 2);
    for (const line of inner) lines.push(this.row(width, line));
    lines.push(this.middleBorder(width));
    const filterHint = this.mode === "thinkingPicker" || this.mode === "deliveryPicker" || this.mode === "eventsPicker" || this.mode === "toolsPicker" ? "" : " \xB7 type to filter";
    lines.push(
      this.row(
        width,
        this.theme.fg("dim", `  Enter to select \xB7 Esc to cancel${filterHint}`)
      )
    );
    lines.push(this.bottomBorder(width));
    return lines.map((line) => truncateToWidth4(line, width, ""));
  }
  renderInstructionsEditor(width) {
    if (!this.editor) return [];
    if (width < 24) return this.renderNarrowFallback(width, `instructions \xB7 ${this.editorActorName ?? ""}`, "esc cancel");
    const innerWidth = width - 2;
    const lines = [this.topBorder(width, `instructions \xB7 ${this.editorActorName ?? ""}`)];
    for (const line of this.editor.render(innerWidth)) {
      lines.push(this.row(width, line));
    }
    lines.push(this.middleBorder(width));
    lines.push(
      this.row(
        width,
        this.theme.fg("dim", "  enter submit \xB7 shift+enter newline \xB7 esc cancel")
      )
    );
    lines.push(this.bottomBorder(width));
    return lines.map((line) => truncateToWidth4(line, width, ""));
  }
  projectMesh(snapshot) {
    if (this.overviewView !== "topology") return void 0;
    return buildProjectMeshTopology({
      main: snapshot.main,
      actors: snapshot.actors,
      agents: snapshot.agents,
      state: snapshot.state,
      events: snapshot.events,
      ...snapshot.participants ? { participants: snapshot.participants } : {},
      now: snapshot.now
    });
  }
  replayFrames(snapshot, topology) {
    return snapshot.events.flatMap((event) => {
      const route = topology.routes.find(
        (candidate) => candidate.topic === event.topic && candidate.kind === event.kind && (candidate.fromId === event.from.id || candidate.fromName === event.from.name)
      );
      return route ? [{ event, route }] : [];
    });
  }
  startGraphEffectsAnimation() {
    if (this.graphEffectsAnimation) return;
    this.graphReplayAdvancedAt = Date.now();
    this.graphEffectsAnimation = setInterval(() => {
      const now = Date.now();
      if (this.graphReplayPlaying && this.graphReplayIndex !== void 0 && this.graphReplayLength > 0 && now - this.graphReplayAdvancedAt >= 850 / this.graphReplaySpeed) {
        if (this.graphReplayIndex < this.graphReplayLength - 1) {
          this.graphReplayIndex++;
          this.graphReplayAdvancedAt = now;
        } else {
          this.graphReplayPlaying = false;
        }
      }
      this.tui.requestRender();
    }, 80);
    this.graphEffectsAnimation.unref?.();
  }
  stopGraphEffectsAnimation() {
    if (this.graphEffectsAnimation) clearInterval(this.graphEffectsAnimation);
    this.graphEffectsAnimation = void 0;
    this.graphReplayPlaying = false;
  }
  toggleGraphReplay(snapshot, topology) {
    const model = topology ?? this.projectMesh(snapshot);
    const frames = model ? this.replayFrames(snapshot, model) : [];
    this.graphReplayLength = frames.length;
    if (frames.length === 0) return;
    if (this.graphReplayIndex === void 0) {
      this.graphReplayIndex = 0;
      this.graphReplayPlaying = true;
    } else {
      this.graphReplayIndex = void 0;
      this.graphReplayPlaying = false;
    }
    this.graphReplayAdvancedAt = Date.now();
  }
  stepGraphReplay(delta) {
    if (this.graphReplayIndex === void 0 || this.graphReplayLength === 0) return;
    this.graphReplayIndex = Math.max(
      0,
      Math.min(this.graphReplayLength - 1, this.graphReplayIndex + delta)
    );
    this.graphReplayPlaying = false;
    this.graphReplayAdvancedAt = Date.now();
  }
  setGraphCameraTarget(point) {
    if (!this.graphCameraInitialized) {
      this.graphCamera = { ...point };
      this.graphCameraTarget = { ...point };
      this.graphCameraInitialized = true;
      return;
    }
    if (this.graphCameraTarget.x === point.x && this.graphCameraTarget.y === point.y) return;
    this.graphCameraTarget = { ...point };
    this.graphAnimationAt = Date.now();
    if (this.graphAnimation) return;
    this.graphAnimation = setInterval(() => this.stepGraphCamera(), 16);
    this.graphAnimation.unref?.();
  }
  stopGraphAnimation() {
    if (this.graphAnimation) clearInterval(this.graphAnimation);
    this.graphAnimation = void 0;
    this.graphAnimationAt = 0;
    this.graphVelocity = { x: 0, y: 0 };
    this.graphCameraTarget = { ...this.graphCamera };
  }
  stepGraphCamera() {
    const now = Date.now();
    const elapsed = this.graphAnimationAt > 0 ? (now - this.graphAnimationAt) / 1e3 : 0.016;
    const dt = Math.max(8e-3, Math.min(0.032, elapsed));
    this.graphAnimationAt = now;
    const stiffness = 115;
    const damping = 19;
    const stepAxis = (position, target, velocity) => {
      const acceleration = stiffness * (target - position) - damping * velocity;
      const nextVelocity = velocity + acceleration * dt;
      return [position + nextVelocity * dt, nextVelocity];
    };
    [this.graphCamera.x, this.graphVelocity.x] = stepAxis(
      this.graphCamera.x,
      this.graphCameraTarget.x,
      this.graphVelocity.x
    );
    [this.graphCamera.y, this.graphVelocity.y] = stepAxis(
      this.graphCamera.y,
      this.graphCameraTarget.y,
      this.graphVelocity.y
    );
    const distance = Math.hypot(
      this.graphCameraTarget.x - this.graphCamera.x,
      this.graphCameraTarget.y - this.graphCamera.y
    );
    const speed = Math.hypot(this.graphVelocity.x, this.graphVelocity.y);
    if (distance < 0.025 && speed < 0.025) {
      this.graphCamera = { ...this.graphCameraTarget };
      this.graphVelocity = { x: 0, y: 0 };
      if (this.graphAnimation) clearInterval(this.graphAnimation);
      this.graphAnimation = void 0;
    }
    this.tui.requestRender();
  }
  renderOverview(width, snapshot, run, panels, entities, allEntities, meshModel) {
    if (width < 24) {
      return [truncateToWidth4("too narrow \xB7 need 24 cols", width)];
    }
    const innerWidth = width - 2;
    const terminalRows = Math.max(
      1,
      this.tui.terminal?.rows ?? process.stdout.rows ?? 28
    );
    const overlayRows = dashboardOverlayRows(terminalRows);
    const lines = [];
    const title = this.overviewView === "activity" ? `Fabric \xB7 ${run?.name ?? "session"} \xB7 Activity` : "Fabric \xB7 Topology";
    lines.push(this.topBorder(width, title));
    const runAgents = run ? snapshot.agents.filter((agent) => agent.runId === run.id) : snapshot.agents;
    const activeAgents = runAgents.filter((agent) => isActiveStatus(agent.status)).length;
    const hasDetachedWork = activeAgents > 0;
    const runTokens = tokensFor(snapshot, run);
    const largeRun = runAgents.length > 25 || runTokens > 15e5;
    const elapsed = run ? formatDuration(((hasDetachedWork ? snapshot.now : run.finishedAt) ?? snapshot.now) - run.startedAt) : void 0;
    const activeActors = snapshot.actors.filter((actor) => isActiveStatus(actor.status)).length;
    const summary = (meshModel ? [
      run?.name ? `focus ${run.name}` : void 0,
      run?.currentPhaseId ? `current ${run.phases.find((phase) => phase.id === run.currentPhaseId)?.name ?? run.currentPhaseId}` : void 0,
      `Participants ${snapshot.agents.filter((agent) => isActiveStatus(agent.status)).length}/${snapshot.agents.length} agents \xB7 ${activeActors}/${snapshot.actors.length} actors \xB7 ${meshModel.participants.length} remote`,
      `Mesh ${meshModel.topics.length} topics \xB7 ${snapshot.state.length} state`,
      this.graphReplayIndex !== void 0 ? `${this.graphReplayPlaying ? "\u25B6" : "\u2161"} replay ${this.graphReplayIndex + 1}/${Math.max(1, this.graphReplayLength)} \xB7 ${this.graphReplaySpeed}\xD7` : void 0,
      snapshot.runs.length > 1 ? `run ${this.runIndex + 1}/${snapshot.runs.length}` : void 0
    ] : [
      this.overviewView === "topology" ? run?.name : void 0,
      run?.status,
      largeRun ? "\u26A0 large run" : void 0,
      `${activeAgents}/${runAgents.length} run agents active`,
      `${snapshot.actors.length} actors`,
      runTokens > 0 ? `${formatTokens(runTokens)} tok` : void 0,
      elapsed,
      snapshot.runs.length > 1 ? `run ${this.runIndex + 1}/${snapshot.runs.length}` : void 0
    ]).filter((value) => Boolean(value)).join(" \xB7 ");
    const summaryText = safeText(summary);
    let headerLine = summaryText;
    if (run?.description && this.overviewView === "activity") {
      const gap = "  ";
      const availableDescription = innerWidth - visibleWidth4(summaryText) - gap.length;
      headerLine = availableDescription >= 12 ? `${padToWidth(
        this.theme.fg("muted", safeText(run.description)),
        availableDescription
      )}${gap}${this.theme.fg("dim", summaryText)}` : this.theme.fg("dim", summaryText);
    } else if (summaryText) {
      headerLine = this.theme.fg("dim", summaryText);
    }
    const minimumRows = 8;
    if (overlayRows < minimumRows) {
      return [
        title,
        this.theme.fg("dim", summaryText || "No Fabric activity yet"),
        this.theme.fg("dim", "1 activity \xB7 2 topology \xB7 arrows move \xB7 esc close")
      ].slice(0, overlayRows).map((line) => truncateToWidth4(line, width, ""));
    }
    lines.push(this.row(width, headerLine || this.theme.fg("muted", "No Fabric activity yet")));
    lines.push(this.middleBorder(width));
    const desiredRunEvents = run?.events.slice(-2) ?? [];
    const desiredMeshEventCount = Math.max(0, 2 - desiredRunEvents.length);
    const desiredMeshEvents = desiredMeshEventCount > 0 ? snapshot.events.slice(-desiredMeshEventCount) : [];
    const optionalEventRoom = Math.max(0, overlayRows - minimumRows);
    const eventRows = optionalEventRoom >= 2 ? Math.min(2, optionalEventRoom - 1) : 0;
    const runEventRows = Math.min(desiredRunEvents.length, eventRows);
    const meshEventRows = Math.max(0, eventRows - runEventRows);
    const runEvents = runEventRows > 0 ? desiredRunEvents.slice(-runEventRows) : [];
    const meshEvents = meshEventRows > 0 ? desiredMeshEvents.slice(-meshEventRows) : [];
    const eventChromeRows = eventRows > 0 ? eventRows + 1 : 0;
    const maxBody = Math.max(
      1,
      Math.min(this.overviewView === "topology" ? 30 : 22, overlayRows - 7 - eventChromeRows)
    );
    if (this.overviewView === "topology") {
      const topology = meshModel ?? buildProjectMeshTopology({
        main: snapshot.main,
        actors: snapshot.actors,
        agents: snapshot.agents,
        state: snapshot.state,
        events: snapshot.events,
        ...snapshot.participants ? { participants: snapshot.participants } : {},
        now: snapshot.now
      });
      this.startGraphEffectsAnimation();
      const replayFrames = this.replayFrames(snapshot, topology);
      this.graphReplayLength = replayFrames.length;
      if (this.graphReplayIndex !== void 0 && replayFrames.length === 0) {
        this.graphReplayIndex = void 0;
        this.graphReplayPlaying = false;
      } else if (this.graphReplayIndex !== void 0) {
        this.graphReplayIndex = Math.min(this.graphReplayIndex, replayFrames.length - 1);
      }
      const replayFrame = this.graphReplayIndex === void 0 ? void 0 : replayFrames[this.graphReplayIndex];
      this.graphReplayLabel = replayFrame?.event.kind;
      const renderGraph = () => renderFabricTopologyPanel({
        theme: this.theme,
        filter: this.filter,
        selectedEntityId: this.selectedEntityId,
        snapshot,
        run,
        mesh: topology,
        allEntities,
        entities,
        width: innerWidth,
        height: maxBody,
        camera: this.graphCamera,
        invalidate: this.highlightInvalidate,
        animation: {
          now: Date.now(),
          reducedMotion: this.graphReducedMotion,
          showHistory: this.graphShowHistory,
          ...replayFrame ? { replayRouteId: replayFrame.route.id, replayLabel: replayFrame.event.kind } : {}
        }
      });
      const cameraWasInitialized = this.graphCameraInitialized;
      let rendered = renderGraph();
      this.graphPositions = rendered.positions;
      if (rendered.selectedPosition) this.setGraphCameraTarget(rendered.selectedPosition);
      if (!cameraWasInitialized && this.graphCameraInitialized) rendered = renderGraph();
      for (const line of rendered.lines) lines.push(this.row(width, line));
    } else if (innerWidth >= 88) {
      const leftWidth = Math.min(38, Math.max(28, Math.floor((innerWidth - 1) * 0.34)));
      const rightWidth = innerWidth - leftWidth - 1;
      const leftLines = this.renderPhasePanel(panels, leftWidth, maxBody);
      const rightLines = this.renderEntityPanel(entities, rightWidth, maxBody, snapshot.now);
      for (let index = 0; index < maxBody; index++) {
        const left = leftLines[index] ?? "";
        const right = rightLines[index] ?? "";
        lines.push(
          this.row(
            width,
            `${padToWidth(left, leftWidth)}${this.theme.fg("borderMuted", "\u2502")}${padToWidth(
              right,
              rightWidth
            )}`
          )
        );
      }
    } else {
      const panelRows = Math.max(2, maxBody - 1);
      const phaseHeight = Math.max(1, Math.min(panels.length + 1, Math.floor(panelRows * 0.45)));
      const entityHeight = Math.max(1, panelRows - phaseHeight);
      for (const line of this.renderPhasePanel(panels, innerWidth, phaseHeight)) {
        lines.push(this.row(width, line));
      }
      lines.push(this.row(width, this.theme.fg("borderMuted", "\u2500".repeat(innerWidth))));
      for (const line of this.renderEntityPanel(entities, innerWidth, entityHeight, snapshot.now)) {
        lines.push(this.row(width, line));
      }
    }
    if (eventRows > 0) {
      lines.push(this.middleBorder(width));
      let renderedEventRows = 0;
      for (const event of runEvents) {
        lines.push(
          this.row(
            width,
            colorStatus(
              this.theme,
              event.level === "success" ? "completed" : event.level,
              `[${formatClock(event.createdAt)}] ${safeText(event.message)}`
            )
          )
        );
        renderedEventRows++;
      }
      for (const event of meshEvents) {
        const target = event.to ? ` \u2192 ${event.to}` : "";
        const text = event.text ? ` \xB7 ${safeText(event.text)}` : "";
        lines.push(
          this.row(
            width,
            this.theme.fg(
              "dim",
              `[${formatClock(event.createdAt)}] ${event.topic} \xB7 ${event.from.name}${target}${text}`
            )
          )
        );
        renderedEventRows++;
      }
      while (renderedEventRows < eventRows) {
        lines.push(this.row(width, ""));
        renderedEventRows++;
      }
    }
    lines.push(this.middleBorder(width));
    const navigationHint = this.overviewView === "topology" ? this.graphReplayIndex !== void 0 ? `replay ${this.graphReplayIndex + 1}/${Math.max(1, this.graphReplayLength)}${this.graphReplayLabel ? ` \xB7 ${safeText(this.graphReplayLabel)}` : ""} \xB7 r live \xB7 space ${this.graphReplayPlaying ? "pause" : "play"} \xB7 \u2190/\u2192 step \xB7 +/- speed:${this.graphReplaySpeed}\xD7 \xB7 H history \xB7 M motion:${this.graphReducedMotion ? "reduced" : "full"} \xB7 ? help` : `arrows/h/l move \xB7 j/k order \xB7 r replay \xB7 H history \xB7 M motion:${this.graphReducedMotion ? "reduced" : "full"} \xB7 f filter:${this.filter} \xB7 1 activity \xB7 ? help` : `\u2191\u2193/jk select \xB7 \u2190\u2192/tab pane \xB7 enter inspect \xB7 f filter:${this.filter} \xB7 2 topology \xB7 [ older \xB7 ] newer \xB7 ? help`;
    lines.push(this.row(width, this.theme.fg("dim", navigationHint)));
    const selectedEntity = entities[this.entityIndex];
    const actionHint = this.pane === "entities" && selectedEntity ? this.theme.fg("muted", `  ${this.overviewActionHint(selectedEntity)}`) : "";
    lines.push(this.row(width, actionHint));
    lines.push(this.bottomBorder(width));
    return lines.map((line) => truncateToWidth4(line, width, ""));
  }
  overviewActionHint(entity) {
    if (entity.kind === "main") {
      const actions = [
        this.canMessage(entity, "steer") ? "s message/steer" : void 0,
        this.canMessage(entity, "followUp") ? "u queue follow-up" : void 0,
        "enter details"
      ].filter((value) => Boolean(value));
      return `Main actions: ${actions.join(" \xB7 ")}`;
    }
    if (entity.kind === "peer") {
      const actions = [
        this.canMessage(entity, "steer") ? "s steer" : void 0,
        this.canMessage(entity, "followUp") ? "u follow-up" : void 0,
        "enter details"
      ].filter((value) => Boolean(value));
      return `peer actions: ${actions.join(" \xB7 ")}`;
    }
    if (entity.kind === "actor" && entity.status !== "stopped") {
      const owned = entity.value.local !== false;
      const actions = [
        this.actorTranscript ? `space ${isActiveStatus(entity.status) ? "live " : ""}transcript peek` : void 0,
        this.canMessage(entity, "steer") ? "s queue message" : void 0,
        this.modelSourceForActor(entity.value) && this.onActorModel ? `m session model${owned ? " \xB7 M pin model" : ""}` : void 0,
        this.onActorThinking ? `e session thinking${owned ? " \xB7 E pin thinking" : ""}` : void 0,
        owned && this.onActorDeliveryPolicy ? "y delivery policy" : void 0,
        owned && this.onActorEvents ? "v events" : void 0,
        owned && this.onActorTools ? "o tools" : void 0,
        owned && this.onActorInstructions ? "i instructions" : void 0,
        owned && this.onClearMessages ? "c clear mailbox" : void 0,
        this.onExportActor ? "x export" : void 0,
        "enter details"
      ].filter((value) => Boolean(value));
      return `actor actions: ${actions.join(" \xB7 ")}`;
    }
    if (entity.kind === "globalActor") {
      const actions = [
        this.onGlobalDeliveryPolicy ? "y delivery policy" : void 0,
        this.onGlobalInstructions ? "i instructions" : void 0,
        this.onImportActor ? "p import" : void 0,
        this.onRemoveGlobalActor ? "d delete" : void 0,
        "enter details"
      ].filter((value) => Boolean(value));
      return `template actions: ${actions.join(" \xB7 ")}`;
    }
    if (entity.kind === "agent") {
      const armed = this.pendingStop?.id === entity.value.id && this.pendingStop.expiresAt > Date.now();
      const actions = [
        this.agentTranscript ? `space ${isActiveStatus(entity.status) ? "live " : ""}transcript peek` : void 0,
        this.canMessage(entity, "steer") ? "s steer" : void 0,
        this.canMessage(entity, "followUp") ? "u follow-up" : void 0,
        this.canStop(entity) ? armed ? "x again to stop" : "x stop" : void 0,
        "enter details"
      ].filter((value) => Boolean(value));
      return `agent actions: ${actions.join(" \xB7 ")}`;
    }
    if (entity.kind === "meshParticipant") {
      const actions = [
        this.canMessage(entity, "steer") ? "s steer" : void 0,
        this.canMessage(entity, "followUp") ? "u follow-up" : void 0,
        this.canStop(entity) ? "x twice to stop" : void 0,
        "enter details"
      ].filter((value) => Boolean(value));
      return `participant actions: ${actions.join(" \xB7 ")}`;
    }
    return "enter details";
  }
  renderPhasePanel(panels, width, height) {
    const lines = [
      truncateToWidth4(
        `${this.pane === "phases" ? this.theme.fg("accent", "\u25B8 ") : "  "}${this.theme.fg(
          "accent",
          "Activity"
        )}`,
        width
      )
    ];
    const available = Math.max(0, height - 1);
    const start = Math.max(
      0,
      Math.min(this.phaseIndex - Math.floor(available / 2), Math.max(0, panels.length - available))
    );
    for (let index = start; index < Math.min(panels.length, start + available); index++) {
      const panel = panels[index];
      if (!panel) continue;
      const selected = index === this.phaseIndex;
      const prefix = selected ? "\u203A " : "  ";
      const count = panel.total > 0 ? `${panel.completed}/${panel.total}` : "";
      const raw = `${prefix}${colorStatus(this.theme, panel.status, statusGlyph(panel.status))} ${this.theme.fg("muted", safeText(
        panel.name
      ))}`;
      const countWidth = visibleWidth4(count);
      const contentWidth = Math.max(0, width - countWidth - (count ? 1 : 0));
      let line = `${padToWidth(raw, contentWidth)}${count ? ` ${this.theme.fg("dim", count)}` : ""}`;
      if (selected && this.pane === "phases") {
        line = this.theme.bg("selectedBg", padToWidth(line, width));
      }
      lines.push(truncateToWidth4(line, width, ""));
    }
    while (lines.length < height) lines.push("");
    return lines.slice(0, height);
  }
  renderEntityPanel(entities, width, height, now) {
    const lines = [];
    const available = Math.max(0, height);
    const groupedRows = [];
    const groups = groupEntities(entities);
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      const group = groups[groupIndex];
      if (groupIndex > 0) groupedRows.push({ type: "spacer" });
      groupedRows.push({ type: "group", group });
      for (const entry of group.entries) {
        groupedRows.push({ type: "entity", entity: entry.entity, entityIndex: entry.index });
      }
    }
    const selectedRow = Math.max(
      0,
      groupedRows.findIndex(
        (row) => row.type === "entity" && row.entityIndex === this.entityIndex
      )
    );
    const start = Math.max(
      0,
      Math.min(
        selectedRow - Math.floor(available / 2),
        Math.max(0, groupedRows.length - available)
      )
    );
    for (let index = start; index < Math.min(groupedRows.length, start + available); index++) {
      const row = groupedRows[index];
      if (!row) continue;
      if (row.type === "spacer") {
        lines.push("");
        continue;
      }
      if (row.type === "group") {
        lines.push(
          truncateToWidth4(
            this.theme.fg(
              "muted",
              `  ${this.theme.bold(row.group.label)} (${row.group.entries.length})`
            ),
            width,
            ""
          )
        );
        continue;
      }
      const entity = row.entity;
      const selected = row.entityIndex === this.entityIndex;
      const prefix = selected ? "\u203A " : "  ";
      const lead = `${prefix}${colorStatus(this.theme, entity.status, statusGlyph(entity.status))} ${this.theme.fg("muted", safeText(
        entity.label
      ))}`;
      const tail = safeText(entityTail(entity, now));
      let line = tail ? `${lead}  ${this.theme.fg("dim", tail)}` : lead;
      if (selected && this.pane === "entities") {
        line = this.theme.bg("selectedBg", padToWidth(line, width));
      }
      lines.push(truncateToWidth4(line, width, ""));
    }
    if (entities.length === 0 && available > 0) {
      const label = this.filter === "all" ? "activity" : `${this.filter} activity`;
      lines.push(this.theme.fg("dim", `  (no ${label}; press f to change filter)`));
    }
    while (lines.length < height) lines.push("");
    return lines.slice(0, height);
  }
  renderDetail(width, snapshot, entity) {
    const result = this.detailRenderer.render(
      width,
      snapshot,
      entity,
      {
        view: this.detailView,
        scroll: this.detailScroll,
        pageAnchor: this.transcriptPageAnchor,
        transcriptFollowing: this.transcriptFollowing,
        transcriptToolsExpanded: this.transcriptToolsExpanded
      },
      this.detailActionHint(entity),
      (entity.kind === "agent" || entity.kind === "actor") && this.detailView === "transcript" ? this.transcriptToolToggleHint() : ""
    );
    this.detailScroll = result.scroll;
    this.detailMaxScroll = result.maxScroll;
    this.transcriptPageAnchor = result.pageAnchor;
    return result.lines;
  }
  detailActionHint(entity) {
    if (entity.kind === "main") {
      const actions = [
        this.canMessage(entity, "steer") ? "s message/steer now" : void 0,
        this.canMessage(entity, "followUp") ? "u queue follow-up" : void 0
      ].filter((value) => Boolean(value));
      return actions.length > 0 ? `Main Pi agent actions: ${actions.join(" \xB7 ")}` : "Main Pi agent controls are unavailable in this session.";
    }
    if (entity.kind === "peer") {
      const actions = [
        this.canMessage(entity, "steer") ? "s steer over mesh" : void 0,
        this.canMessage(entity, "followUp") ? "u queue follow-up over mesh" : void 0
      ].filter((value) => Boolean(value));
      return actions.length > 0 ? `Peer session actions: ${actions.join(" \xB7 ")}` : "Peer session is read-only.";
    }
    if (entity.kind === "agent") {
      const armed = this.pendingStop?.id === entity.value.id && this.pendingStop.expiresAt > Date.now();
      const actions = [
        this.canMessage(entity, "steer") ? "s steer now" : void 0,
        this.canMessage(entity, "followUp") ? "u queue follow-up" : void 0,
        this.canStop(entity) ? armed ? "x again to confirm stop" : "x stop" : void 0
      ].filter((value) => Boolean(value));
      const controls = actions.length > 0 ? `One-shot agent actions: ${actions.join(" \xB7 ")}. ` : "One-shot agent. ";
      return `${controls}Model and thinking are fixed at spawn; use a persistent actor for editable runtime settings.`;
    }
    if (entity.kind === "actor" && entity.status !== "stopped") {
      const owned = entity.value.local !== false;
      const actions = [
        this.canMessage(entity, "steer") ? "s queue message" : void 0,
        this.modelSourceForActor(entity.value) && this.onActorModel ? `m session model${owned ? " \xB7 M pin model" : ""}` : void 0,
        this.onActorThinking ? `e session thinking${owned ? " \xB7 E pin thinking" : ""}` : void 0,
        owned && this.onActorDeliveryPolicy ? "y delivery policy" : void 0,
        owned && this.onActorEvents ? "v events" : void 0,
        owned && this.onActorTools ? "o tools" : void 0,
        owned && this.onClearMessages ? "c clear mailbox" : void 0,
        owned && this.onActorInstructions ? "i instructions" : void 0,
        this.onExportActor ? "x export\u2192global" : void 0
      ].filter((value) => Boolean(value));
      return actions.length > 0 ? `Actor actions: ${actions.join(" \xB7 ")}` : "Actor settings are read-only in this session.";
    }
    if (entity.kind === "meshParticipant") {
      const actions = [
        this.canMessage(entity, "steer") ? "s steer over mesh" : void 0,
        this.canMessage(entity, "followUp") ? "u queue follow-up over mesh" : void 0,
        this.canStop(entity) ? "x twice to stop" : void 0
      ].filter((value) => Boolean(value));
      return actions.length > 0 ? `Remote participant actions: ${actions.join(" \xB7 ")}` : "Remote participant is read-only.";
    }
    if (entity.kind === "globalActor") {
      const actions = [
        this.onGlobalDeliveryPolicy ? "y delivery policy" : void 0,
        this.onGlobalInstructions ? "i instructions" : void 0,
        this.onImportActor ? "p import" : void 0,
        this.onRemoveGlobalActor ? "d delete" : void 0
      ].filter((value) => Boolean(value));
      return actions.length > 0 ? `Template actions: ${actions.join(" \xB7 ")}` : "Global template is read-only in this session.";
    }
    return "Read-only detail.";
  }
  syncEntitySelection(entities, preferAttention = false) {
    if (entities.length === 0) {
      this.entityIndex = 0;
      this.selectedEntityId = void 0;
      return;
    }
    const retainedIndex = this.selectedEntityId ? entities.findIndex((entity) => entity.id === this.selectedEntityId) : -1;
    const failedIndex = preferAttention ? entities.findIndex(
      (entity) => entity.kind !== "main" && ["failed", "timed_out", "error"].includes(entity.status)
    ) : -1;
    const blockedIndex = preferAttention ? entities.findIndex(
      (entity) => entity.kind !== "main" && entity.status === "blocked"
    ) : -1;
    const activeIndex = preferAttention ? entities.findIndex(
      (entity) => entity.kind !== "main" && isActiveStatus(entity.status)
    ) : -1;
    const attentionIndex = failedIndex >= 0 ? failedIndex : blockedIndex >= 0 ? blockedIndex : activeIndex;
    const firstWorkIndex = entities.findIndex((entity) => entity.kind !== "main");
    this.entityIndex = retainedIndex >= 0 ? retainedIndex : attentionIndex >= 0 ? attentionIndex : firstWorkIndex >= 0 ? firstWorkIndex : Math.max(0, Math.min(this.entityIndex, entities.length - 1));
    this.selectedEntityId = entities[this.entityIndex]?.id;
  }
  selectRun(snapshot) {
    if (snapshot.runs.length === 0) {
      this.runIndex = 0;
      this.selectedRunId = void 0;
      return void 0;
    }
    if (!this.runSelectionTouched) {
      this.runIndex = 0;
      this.selectedRunId = snapshot.runs[0]?.id;
      return snapshot.runs[0];
    }
    const retainedIndex = this.selectedRunId ? snapshot.runs.findIndex((run) => run.id === this.selectedRunId) : -1;
    this.runIndex = retainedIndex >= 0 ? retainedIndex : Math.max(0, Math.min(this.runIndex, snapshot.runs.length - 1));
    this.selectedRunId = snapshot.runs[this.runIndex]?.id;
    return snapshot.runs[this.runIndex];
  }
  syncPhase(run, panels) {
    if (panels.length === 0) {
      this.phaseIndex = 0;
      this.selectedPhaseId = void 0;
      return;
    }
    if (!this.phaseSelectionTouched) {
      const current = run?.currentPhaseId ? panels.findIndex((panel) => panel.id === run.currentPhaseId) : -1;
      const activeRunActivity = panels.findIndex(
        (panel) => panel.kind === "unphased" && isActiveStatus(panel.status)
      );
      if (current >= 0 && isActiveStatus(panels[current].status)) {
        this.phaseIndex = current;
      } else if (activeRunActivity >= 0) {
        this.phaseIndex = activeRunActivity;
      } else if (current >= 0) {
        this.phaseIndex = current;
      } else {
        this.phaseIndex = 0;
      }
    } else {
      const retainedIndex = this.selectedPhaseId ? panels.findIndex((panel) => panel.id === this.selectedPhaseId) : -1;
      this.phaseIndex = retainedIndex >= 0 ? retainedIndex : Math.max(0, Math.min(this.phaseIndex, panels.length - 1));
    }
    this.phaseIndex = Math.max(0, Math.min(this.phaseIndex, panels.length - 1));
    this.selectedPhaseId = panels[this.phaseIndex]?.id;
  }
  resetSelection() {
    this.phaseIndex = 0;
    this.entityIndex = 0;
    this.selectedEntityId = void 0;
    this.phaseSelectionTouched = false;
    this.selectedPhaseId = void 0;
    this.detailId = void 0;
    this.detailScroll = 0;
    this.detailMaxScroll = 0;
    this.transcriptPageAnchor = void 0;
    this.detailSelectionRestore = void 0;
    this.detailView = "summary";
    this.transcriptFollowing = true;
    this.pane = this.overviewView === "activity" ? "phases" : "entities";
  }
  pinDetailSelection(run, panel, pinPhase) {
    this.detailSelectionRestore ??= {
      runSelectionTouched: this.runSelectionTouched,
      phaseSelectionTouched: this.phaseSelectionTouched
    };
    this.runSelectionTouched = true;
    this.selectedRunId = run?.id;
    if (pinPhase) {
      this.phaseSelectionTouched = true;
      this.selectedPhaseId = panel?.id;
    }
  }
  closeDetail() {
    const restore = this.detailSelectionRestore;
    if (restore) {
      this.runSelectionTouched = restore.runSelectionTouched;
      this.phaseSelectionTouched = restore.phaseSelectionTouched;
    }
    this.detailSelectionRestore = void 0;
    this.detailId = void 0;
    this.detailScroll = 0;
    this.detailMaxScroll = 0;
    this.transcriptPageAnchor = void 0;
    this.detailView = "summary";
    this.transcriptFollowing = true;
  }
  renderNarrowFallback(width, label, hint) {
    return [safeText(label), hint].map((line) => truncateToWidth4(line, width, "")).filter((line) => visibleWidth4(line) > 0);
  }
  topBorder(width, title) {
    const border = (value) => this.theme.fg("borderMuted", value);
    const safeTitle = truncateToWidth4(safeText(title), Math.max(0, width - 6));
    const styledTitle = ` ${this.theme.fg("accent", safeTitle)} `;
    const remaining = Math.max(0, width - 2 - visibleWidth4(styledTitle));
    const left = Math.floor(remaining / 2);
    const right = remaining - left;
    return `${border(`\u256D${"\u2500".repeat(left)}`)}${styledTitle}${border(`${"\u2500".repeat(right)}\u256E`)}`;
  }
  middleBorder(width) {
    return this.theme.fg("borderMuted", `\u251C${"\u2500".repeat(Math.max(0, width - 2))}\u2524`);
  }
  bottomBorder(width) {
    return this.theme.fg("borderMuted", `\u2570${"\u2500".repeat(Math.max(0, width - 2))}\u256F`);
  }
  row(width, content) {
    const innerWidth = Math.max(0, width - 2);
    return `${this.theme.fg("borderMuted", "\u2502")}${padToWidth(content, innerWidth)}${this.theme.fg(
      "borderMuted",
      "\u2502"
    )}`;
  }
};
export {
  FabricDashboard
};
//# sourceMappingURL=dashboard-N57JCWR4.js.map
