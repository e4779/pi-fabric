import type { FabricCapabilityRequirement, FabricComponentProviderLease } from "../components/types.js";
import { type FabricExecutionTraceOperationHandle, type FabricExecutionTraceRecorder } from "../audit/trace.js";
import { type FabricActionDescriptor, type FabricCapabilityCatalog, type FabricCapabilityResolution, type FabricGuestTypeSources, type FabricInvocationActivityUpdate, type FabricInvocationContext, type FabricMediaBlock, type FabricProvider, type FabricProviderListRequest, type FabricScopedProviderResult } from "../protocol.js";
import type { FabricSpeculationReplay, FabricSpeculationRuntime } from "../speculation/types.js";
import type { FabricNestedToolResultProxy } from "./tool-result-proxy.js";
import { type FabricProviderBindingEvent } from "./provider-bindings.js";
export interface ResolvedFabricAction extends FabricActionDescriptor {
    ref: string;
    provider: string;
}
interface FabricEffectConflict {
    withRef: string;
    resources: string[];
    reason: "shared_resource" | "unknown_resource";
}
export interface FabricCallAudit {
    ref: string;
    nestedToolCallId: string;
    startedAt: number;
    endedAt?: number;
    success?: boolean;
    error?: string;
    resultChars?: number;
    resultTruncated?: boolean;
    tool?: string;
    provider?: string;
    args?: Record<string, unknown>;
    result?: unknown;
    media?: FabricMediaBlock[];
    mediaNote?: string;
    preview?: unknown;
    effectConflicts?: FabricEffectConflict[];
    /** Result was pre-launched while the program streamed and served from the speculation store. */
    speculated?: boolean;
    /** Spelled action name that repaired to the canonical one at resolve (e.g. search → recall). */
    repairedFrom?: string;
}
export type FabricRegistryActivityEvent = {
    type: "call_start";
    callId: string;
    ref: string;
    args: Record<string, unknown>;
} | {
    type: "call_update";
    callId: string;
    update: FabricInvocationActivityUpdate;
} | {
    type: "call_args";
    callId: string;
    args: Record<string, unknown>;
} | {
    type: "call_end";
    callId: string;
    success: boolean;
    result?: unknown;
    preview?: unknown;
    error?: string;
};
export interface FabricCapabilityViewLease extends FabricCapabilityResolution {
    release(): Promise<void>;
}
export interface FabricRegistryInvocationContext extends FabricInvocationContext {
    authorize?(action: ResolvedFabricAction): Promise<void>;
    approve(action: ResolvedFabricAction, args: Record<string, unknown>): Promise<void>;
    audits: FabricCallAudit[];
    maxResultChars: number;
    trace?: FabricExecutionTraceRecorder;
    traceOperation?: FabricExecutionTraceOperationHandle;
    observeInvocation?(event: FabricRegistryActivityEvent): void;
}
/**
 * Prefix pi-fabric prepends to every nested tool-call id it generates inside a
 * fabric_exec run (one per pi., mcp., or agents. invocation). Extensions can
 * detect that a tool_call/tool_result event came from a nested fabric call —
 * rather than a top-level call the LLM made directly — by checking
 * `event.toolCallId.startsWith(NESTED_TOOL_CALL_ID_PREFIX)`. The LLM's own
 * tool-call ids (e.g. openai "call_…", anthropic "toolu_…") never use this
 * prefix, so the signal is unambiguous.
 */
export declare const NESTED_TOOL_CALL_ID_PREFIX = "fabric_";
export declare class ActionRegistry {
    #private;
    readonly toolResultProxy?: FabricNestedToolResultProxy | undefined;
    constructor(toolResultProxy?: FabricNestedToolResultProxy | undefined);
    /**
     * Attach the speculative-PTC runtime. Eligibility is re-checked against the
     * resolved descriptor inside speculate(), so a config/captured-tool change
     * cannot sneak a side-effecting ref into the store after the fact.
     */
    setSpeculation(runtime: FabricSpeculationRuntime | undefined, eligibility?: (action: ResolvedFabricAction) => boolean): void;
    register(provider: FabricProvider, options?: {
        overwrite?: boolean;
    }): void;
    mount(provider: FabricProvider, options?: {
        overwrite?: boolean;
        staged?: boolean;
    }): FabricComponentProviderLease;
    activateProviderBindings(bindingIds: readonly string[]): string[];
    subscribeProviderChanges(listener: (event: FabricProviderBindingEvent) => void): () => void;
    notifyCatalogChanged(provider: string): void;
    has(name: string): boolean;
    markUnavailable(name: string, reason: string): void;
    unavailableProviders(): Array<{
        name: string;
        reason: string;
    }>;
    unregister(name: string): FabricProvider | undefined;
    providers(): Array<{
        name: string;
        description: string;
    }>;
    inspectCapabilities(requirements: readonly (string | FabricCapabilityRequirement)[], context: FabricInvocationContext): Promise<FabricCapabilityResolution>;
    acquireCapabilityView(requirements: readonly (string | FabricCapabilityRequirement)[], context: FabricInvocationContext): Promise<FabricCapabilityViewLease>;
    /**
     * Snapshot the tool schemas backing the dynamic guest surfaces (mcp and
     * extensions) so the type gate can reject argument-shape mistakes before
     * the sandbox runs. Side-effect-free by construction: MCP data comes from
     * the provider's cache-warm descriptor slice (listing would schedule
     * background revalidation), extension data from the captured-tool catalog.
     * Providers that cannot supply data yet simply contribute no section and
     * the loose declarations stand for that execution.
     */
    guestTypeSources(context: FabricInvocationContext): Promise<FabricGuestTypeSources>;
    list(request: FabricProviderListRequest & {
        provider?: string;
    }, context: FabricInvocationContext): Promise<ResolvedFabricAction[]>;
    catalog(context: FabricInvocationContext, options?: {
        provider?: string;
        limit?: number;
        includeProvider?: (provider: string) => boolean;
    }): Promise<FabricCapabilityCatalog>;
    search(query: string, context: FabricInvocationContext, limit?: number): Promise<ResolvedFabricAction[]>;
    describe(ref: string, context: FabricInvocationContext): Promise<ResolvedFabricAction>;
    acquireScoped(ref: string, args: Record<string, unknown>, context: FabricInvocationContext): Promise<FabricScopedProviderResult>;
    invoke(ref: string, args: Record<string, unknown>, context: FabricRegistryInvocationContext): Promise<unknown>;
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
    speculate(ref: string, args: Record<string, unknown>, context: FabricInvocationContext, replay: FabricSpeculationReplay): Promise<{
        preparedArgs: Record<string, unknown>;
        bindingToken: string;
        execute(signal: AbortSignal | undefined): Promise<unknown>;
    } | undefined>;
    endInvocation(parentToolCallId: string, timeoutMs?: number): Promise<void>;
    close(excludedProviderNames?: Set<string>): Promise<void>;
}
export {};
//# sourceMappingURL=action-registry.d.ts.map