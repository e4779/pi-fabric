export type DynamicBorderColor = (text: string) => string;
export declare class DynamicBorder {
    #private;
    constructor(color?: DynamicBorderColor);
    invalidate(): void;
    render(width: number): string[];
}
//# sourceMappingURL=dynamic-border.d.ts.map