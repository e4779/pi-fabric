// src/protocol.ts
var FABRIC_PROVIDER_REGISTER_EVENT = "pi-fabric:provider:register:v1";
var FABRIC_PROVIDER_DISCOVER_EVENT = "pi-fabric:provider:discover:v1";
var FABRIC_COMPONENT_REGISTER_EVENT = "pi-fabric:component:register:v1";
var FABRIC_COMPONENT_DISCOVER_EVENT = "pi-fabric:component:discover:v1";
var FABRIC_PREWALK_REQUEST_EVENT = "pi-fabric:prewalk:request:v1";
var readFabricPrewalkRequestV1 = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
  const record = value;
  if (record.version !== 1 || typeof record.context !== "object" || record.context === null || typeof record.claim !== "function" || typeof record.respond !== "function") {
    return void 0;
  }
  return value;
};
var FABRIC_PEER_CARDS_EVENT = "pi-fabric:peers:cards:v1";
var FABRIC_PEER_AWAIT_SETTLE_EVENT = "pi-fabric:peer:await-settle:v1";
var readFabricPeerCardsRequestV1 = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
  const record = value;
  if (record.version !== 1 || typeof record.context !== "object" || record.context === null || typeof record.claim !== "function" || typeof record.respond !== "function") {
    return void 0;
  }
  return value;
};
var readFabricPeerAwaitSettleRequestV1 = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
  const record = value;
  const signal = record.signal;
  if (record.version !== 1 || typeof record.context !== "object" || record.context === null || typeof record.claim !== "function" || typeof record.respond !== "function" || record.selector !== void 0 && typeof record.selector !== "string" || record.settledForMs !== void 0 && typeof record.settledForMs !== "number" || signal !== void 0 && typeof signal.aborted !== "boolean" || record.update !== void 0 && typeof record.update !== "function") {
    return void 0;
  }
  return value;
};
var FABRIC_NESTED_TOOL_CALL_ID_PREFIX = "fabric_";
var FABRIC_TOOL_RESULT_PROXY_KIND = "pi-fabric.tool-result-proxy.v1";
var readFabricToolResultProxyDetailsV1 = (value) => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
  const record = value;
  if (record.kind !== FABRIC_TOOL_RESULT_PROXY_KIND || typeof record.ref !== "string" || !Object.prototype.hasOwnProperty.call(record, "result")) {
    return void 0;
  }
  return record;
};

export {
  FABRIC_PROVIDER_REGISTER_EVENT,
  FABRIC_PROVIDER_DISCOVER_EVENT,
  FABRIC_COMPONENT_REGISTER_EVENT,
  FABRIC_COMPONENT_DISCOVER_EVENT,
  FABRIC_PREWALK_REQUEST_EVENT,
  readFabricPrewalkRequestV1,
  FABRIC_PEER_CARDS_EVENT,
  FABRIC_PEER_AWAIT_SETTLE_EVENT,
  readFabricPeerCardsRequestV1,
  readFabricPeerAwaitSettleRequestV1,
  FABRIC_NESTED_TOOL_CALL_ID_PREFIX,
  FABRIC_TOOL_RESULT_PROXY_KIND,
  readFabricToolResultProxyDetailsV1
};
//# sourceMappingURL=chunk-CTG37A6U.js.map
