interface GuestSourcePosition {
    line: number;
    column: number;
}
export interface GuestStackMap {
    lookup(line: number, column: number): GuestSourcePosition | undefined;
}
export declare const createGuestStackMap: (sourceMapText: string | undefined) => GuestStackMap | undefined;
export declare const remapGuestErrorText: (text: string, stackMap: GuestStackMap | undefined, guestLineCount?: number) => string;
export {};
//# sourceMappingURL=guest-stack-map.d.ts.map