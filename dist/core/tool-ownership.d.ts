import type { ToolCallEvent, ToolCallEventResult, ToolResultEvent, ExtensionContext } from "@earendil-works/pi-coding-agent";
export interface FabricToolOwnershipHost {
    getActiveTools(): string[];
    setActiveTools(names: string[]): void;
}
export interface FabricTopLevelToolAuthorizer {
    authorize(ref: string, parentToolCallId: string): Promise<void>;
}
export interface FabricTopLevelToolApprover {
    approve(event: ToolCallEvent, context: ExtensionContext): Promise<void>;
}
export declare const ownsFabricToolSource: (tools: Array<{
    name: string;
    sourceInfo: {
        path: string;
    };
}>, extensionEntryPath: string) => boolean;
export declare class FabricToolLifecycle {
    #private;
    readonly ownsFabricTool: () => boolean;
    readonly authorizer: () => FabricTopLevelToolAuthorizer | undefined;
    readonly approver: () => FabricTopLevelToolApprover | undefined;
    constructor(ownsFabricTool: () => boolean, authorizer: () => FabricTopLevelToolAuthorizer | undefined, approver?: () => FabricTopLevelToolApprover | undefined);
    toolCall(event: ToolCallEvent, context?: ExtensionContext): Promise<ToolCallEventResult | undefined>;
    toolResult(event: ToolResultEvent): {
        isError: true;
    } | undefined;
    clear(): void;
}
export interface ToolOwnershipReassertion {
    reassert(): void;
    schedule(): void;
}
export declare const createToolOwnershipReassertion: (options: {
    ready: () => boolean;
    active: () => boolean;
    hiddenNames: () => ReadonlySet<string>;
    apply: (hidden: ReadonlySet<string>) => boolean;
}) => ToolOwnershipReassertion;
export declare class FabricToolOwnership {
    #private;
    readonly host: FabricToolOwnershipHost;
    constructor(host: FabricToolOwnershipHost);
    apply(fullCodeMode: boolean, hiddenExtensionTools?: ReadonlySet<string>): boolean;
    release(): boolean;
}
//# sourceMappingURL=tool-ownership.d.ts.map