export interface SpinnerTimerState {
    timer?: ReturnType<typeof setTimeout>;
}
export declare const spinnerFrame: (now?: number) => string;
export declare const updateSpinner: (state: SpinnerTimerState, active: boolean, invalidate: () => void, now?: number) => string;
//# sourceMappingURL=spinner.d.ts.map