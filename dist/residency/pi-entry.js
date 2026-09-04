import {
  runResidentHostFromConfigPath
} from "../chunks/chunk-VEYAJ2O5.js";
import "../chunks/chunk-LHW2QGKS.js";
import "../chunks/chunk-EKJ4KUXF.js";
import "../chunks/chunk-KKL6O7KG.js";
import "../chunks/chunk-OANJNIWI.js";
import "../chunks/chunk-3QCDEK4M.js";
import "../chunks/chunk-QOOWAB5D.js";
import "../chunks/chunk-LXRYXUTG.js";
import "../chunks/chunk-XCYTQGH2.js";
import "../chunks/chunk-XHM55LMF.js";
import "../chunks/chunk-BH2VUB62.js";
import "../chunks/chunk-2DGB2R4E.js";
import "../chunks/chunk-2JELHSX5.js";
import "../chunks/chunk-LU4SNIHE.js";
import "../chunks/chunk-7B4MWJK4.js";
import "../chunks/chunk-4IZKKHJM.js";
import "../chunks/chunk-Y2TSC4OL.js";
import "../chunks/chunk-AZOIDGCU.js";

// src/residency/pi-entry.ts
var configPath = process.env.PI_FABRIC_RESIDENT_CONFIG;
function pi_entry_default(pi) {
  let controller;
  let host;
  pi.on("session_start", (_event, ctx) => {
    if (host) return;
    if (!configPath) {
      ctx.shutdown();
      return;
    }
    controller = new AbortController();
    host = runResidentHostFromConfigPath(configPath, controller.signal).catch(() => void 0).finally(() => ctx.shutdown());
  });
  pi.on("session_shutdown", () => controller?.abort());
}
export {
  pi_entry_default as default
};
//# sourceMappingURL=pi-entry.js.map
