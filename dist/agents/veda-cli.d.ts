import type { FabricThinking } from "../thinking.js";
export interface VedaRunArguments {
    backend: string;
    persona: string;
    model?: string;
    thinking?: FabricThinking;
    tools: string[];
    session: string;
}
export declare const mapVedaTools: (tools: readonly string[]) => string[];
/** Strip a `veda/` routing prefix; everything else passes through because -b
 *  pins the backend and -m is forwarded literally. */
export declare const normalizeVedaModel: (model: string) => string;
/** FabricThinking → Veda reasoning level. Veda has no "off" level; the closest
 *  supported value is minimal. */
export declare const vedaReasoning: (thinking: FabricThinking) => string;
/** Headless run arguments: veda -b <backend> -p <persona> [model/reasoning/
 *  tools] --json --no-sel -S <session> --no-notify. The task itself is
 *  delivered over stdin by the worker so arbitrarily long prompts never hit
 *  ARG_MAX. */
export declare const buildVedaArguments: (options: VedaRunArguments) => string[];
//# sourceMappingURL=veda-cli.d.ts.map