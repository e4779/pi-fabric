/**
 * Cross-process cost budget ledger for a Fabric recursion tree.
 *
 * A recursion tree spans one Pi process per node. Each node's AgentManager
 * records the cost of the children it spawns into a single append-only JSONL
 * file, and checks the accumulated spend before spawning another child. The
 * ledger path and budget travel to descendants through PI_FABRIC_BUDGET*
 * environment variables, which the worker forwards to child Pi processes via
 * `{ ...process.env }`.
 *
 * This mirrors ypi's RLM_BUDGET / RLM_COST_FILE model: the check is best-effort
 * (concurrent children can each pass the check before any cost lands, so a tree
 * may slightly overshoot), while the race-free ceiling remains the per-execution
 * call count (agents.maxPerExecution). Cost is recorded only after a child
 * finishes, matching ypi's append-after-completion semantics.
 */
export interface BudgetLedgerEntry {
    id: string;
    depth: number;
    cost: number;
    tokens: number;
    ts: number;
    runner?: string;
    actorId?: string;
    actorName?: string;
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
}
export interface BudgetLedgerSummary {
    cost: number;
    tokens: number;
}
export interface BudgetLedgerDetail {
    cost: number;
    tokens: number;
    byRunner: Record<string, {
        cost: number;
        tokens: number;
    }>;
    byActor: Record<string, {
        cost: number;
        tokens: number;
    }>;
    entries: BudgetLedgerEntry[];
}
export interface BudgetLedgerState {
    budget: number;
    file: string;
    id: string;
}
/**
 * Read the active budget state inherited from the recursion-tree root.
 * Returns undefined when no budget is active for this process.
 */
export declare function activeBudgetState(): BudgetLedgerState | undefined;
/**
 * Initialize a shared ledger for a recursion tree and seed the environment
 * variables that descendants inherit. Only call at the tree root (depth 0)
 * when no budget has been inherited and a positive budget is configured.
 */
export declare function initBudgetLedger(budget: number): BudgetLedgerState;
/**
 * Clear the budget environment variables seeded by initBudgetLedger. Called by
 * the owning (depth-0) manager on close so a long-lived host process does not
 * leak an active budget into a later, unrelated session.
 */
export declare function useBudgetLedger(state: BudgetLedgerState): void;
export declare function clearOwnedBudgetEnv(): void;
/**
 * Sum the append-only ledger. Malformed lines are tolerated, matching ypi's
 * rlm_cost parser: a single bad entry must not abort the whole read.
 */
export declare function readBudgetLedger(file: string): BudgetLedgerSummary;
/**
 * Append a child's incurred cost to the shared ledger. O_APPEND makes small
 * single-line writes atomic across concurrent writers on POSIX, which is
 * sufficient because each manager appends one entry after a child settles.
 */
export declare function appendBudgetLedger(file: string, entry: BudgetLedgerEntry): void;
/**
 * Sum the append-only ledger with full per-attribution breakdown. Reuses the
 * tolerant line-parsing semantics of readBudgetLedger while exposing runner/
 * actor/token-kind rollups for orchestrator decisions.
 */
export declare function readBudgetLedgerDetailed(file: string): BudgetLedgerDetail;
//# sourceMappingURL=budget-ledger.d.ts.map