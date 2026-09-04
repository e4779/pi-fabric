import {
  RESIDENT_HOST_FORMAT,
  residentRoot
} from "./chunk-2JELHSX5.js";
import {
  writeJsonAtomic
} from "./chunk-LU4SNIHE.js";

// src/residency/actor-client.ts
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
var COMMAND_TIMEOUT_MS = 3e4;
var STATUS_POLL_MS = 100;
var delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var readJson = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return void 0;
  }
};
var ResidentActorClient = class _ResidentActorClient {
  #rootId;
  #requestsPath;
  #responsesPath;
  #ownerPath;
  constructor(meshRoot, rootId) {
    this.#rootId = rootId;
    const residencyDir = residentRoot(meshRoot, rootId);
    this.#requestsPath = path.join(residencyDir, "requests");
    this.#responsesPath = path.join(residencyDir, "responses");
    this.#ownerPath = path.join(residencyDir, "owner.json");
  }
  static fromEnv() {
    const rootId = process.env.PI_FABRIC_MAIN_AGENT_ID;
    const meshRoot = process.env.PI_FABRIC_MESH_ROOT;
    if (!rootId || !meshRoot) return void 0;
    return new _ResidentActorClient(meshRoot, rootId);
  }
  async createActor(request) {
    const response = await this.#send({
      format: RESIDENT_HOST_FORMAT,
      operation: "createActor",
      requestId: randomUUID(),
      rootId: this.#rootId,
      request,
      createdAt: Date.now()
    });
    if (!response.actor) throw new Error("Resident host returned no actor from createActor");
    return response.actor;
  }
  async removeActor(id) {
    await this.#send({
      format: RESIDENT_HOST_FORMAT,
      operation: "removeActor",
      requestId: randomUUID(),
      rootId: this.#rootId,
      id,
      createdAt: Date.now()
    });
    return { removed: true };
  }
  async #send(command) {
    fs.mkdirSync(this.#requestsPath, { recursive: true });
    writeJsonAtomic(path.join(this.#requestsPath, `${command.requestId}.json`), command);
    const responsePath = path.join(this.#responsesPath, `${command.requestId}.json`);
    const deadline = Date.now() + COMMAND_TIMEOUT_MS;
    while (Date.now() < deadline) {
      const response = readJson(responsePath);
      if (response?.format === RESIDENT_HOST_FORMAT && response.requestId === command.requestId) {
        fs.rmSync(responsePath, { force: true });
        if (!response.ok) throw new Error(response.error ?? "Resident host rejected actor request");
        return response;
      }
      const owner = readJson(this.#ownerPath);
      if (!owner?.pid) throw new Error("Root resident host exited during actor request");
      await delay(STATUS_POLL_MS);
    }
    throw new Error("Timed out waiting for resident host actor response");
  }
};

export {
  ResidentActorClient
};
//# sourceMappingURL=chunk-HDBZ4IXL.js.map
