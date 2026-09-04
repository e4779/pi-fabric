import type { FabricActorRequest, GlobalActorDefinition } from "./types.js";
/**
 * A project-independent library of actor templates. Templates carry only an
 * actor definition (name, instructions, subscriptions, and run settings) plus
 * identity/timestamps — never any history. They are not live actors: importing
 * a template into a project creates a fresh live actor with no inherited
 * session, mailbox, or run logs.
 *
 * The registry lives in the user's agent dir (machine-global), independent of
 * any project or mesh, so the same templates are available across every
 * project. Operations are pure file I/O and do not require the mesh to be
 * enabled; only importing (which creates a live actor via ActorManager) does.
 * The registry is read into memory once at construction; run `/fabric reload`
 * to pick up templates added by other Pi sessions. Writes are atomic (write
 * to a temp file then rename) so concurrent sessions cannot corrupt the
 * store, though truly simultaneous edits are last-write-wins.
 */
export declare class GlobalActorRegistry {
    #private;
    constructor(agentDir: string, maxInstructionsBytes: number);
    list(): GlobalActorDefinition[];
    resolve(idOrName: string): GlobalActorDefinition | undefined;
    /**
     * Save a definition to the global registry. If a template with the same name
     * already exists, throws unless `overwrite` is true (in which case the
     * existing template is updated in place, keeping its id). Returns the stored
     * definition.
     */
    create(def: FabricActorRequest, overwrite?: boolean): GlobalActorDefinition;
    /**
     * Apply a partial patch to a stored template (e.g. new instructions). Only
     * the supplied fields are replaced; the rest are preserved. Re-validates any
     * changed field.
     */
    update(idOrName: string, patch: Partial<FabricActorRequest>): GlobalActorDefinition;
    remove(idOrName: string): {
        removed: boolean;
    };
    /**
     * Strip identity/timestamps from a stored template to produce the request
     * shape ActorManager.create expects. Optionally rename the imported actor so
     * a template can be stamped into a project under a different name (e.g. to
     * avoid a collision with a live actor).
     */
    toRequest(def: GlobalActorDefinition, as?: string): FabricActorRequest;
}
//# sourceMappingURL=global-registry.d.ts.map