import { type Component } from "@earendil-works/pi-tui";
interface MeasuredPartialResult {
    component: Component;
    width: number;
    rows: number;
}
export interface ResultRowBalance {
    partial?: MeasuredPartialResult;
    final?: Component;
    finalized?: boolean;
}
export type LimitRenderer = (limit: number, width: number) => string[];
export declare class HiddenRowBorrowingComponent implements Component {
    #private;
    private readonly baseLimit;
    private readonly maxLimit;
    private readonly renderLimit;
    private readonly balance;
    constructor(baseLimit: number, maxLimit: number, renderLimit: LimitRenderer, balance: ResultRowBalance);
    render(width: number): string[];
    invalidate(): void;
}
export declare const observeResultRows: (component: Component, balance: ResultRowBalance, options: {
    expanded: boolean;
    isPartial: boolean;
}) => Component;
export declare const resultRowDeficit: (balance: ResultRowBalance, width: number) => number;
export {};
//# sourceMappingURL=row-balance.d.ts.map