// src/residency/protocol.ts
import { createHash } from "node:crypto";
import path from "node:path";
var RESIDENT_HOST_FORMAT = 1;
var RESIDENT_DELIVERY_PREFIX = "residency/deliveries/";
var digest = (value) => createHash("sha256").update(value).digest("hex");
var residentHostId = (rootId) => `resident:${digest(rootId).slice(0, 24)}`;
var residentRoot = (meshRoot, rootId) => path.join(meshRoot, "residency", digest(rootId));
var residentDeliveryPrefix = (rootId) => `${RESIDENT_DELIVERY_PREFIX}${digest(rootId).slice(0, 32)}/`;

export {
  RESIDENT_HOST_FORMAT,
  residentHostId,
  residentRoot,
  residentDeliveryPrefix
};
//# sourceMappingURL=chunk-2JELHSX5.js.map
