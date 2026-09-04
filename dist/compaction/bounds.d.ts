export declare const MAX_SUMMARY_BYTES: number;
export declare const utf8Bytes: (text: string) => number;
export declare const clipUtf8: (text: string, maxBytes: number, suffix?: string) => string;
export interface CanonicalText {
    text: string;
    truncated: boolean;
    sourceBytes: number;
}
export declare const canonicalizeText: (input: string, maxBytes?: number) => CanonicalText;
export interface AddressedValue {
    entryId: string;
}
export interface AddressedSample<T extends AddressedValue> {
    values: T[];
    omitted: number;
    omittedFirstEntryId?: string;
    omittedLastEntryId?: string;
    splitIndex: number;
}
export declare const sampleAddressedFrom: <T extends AddressedValue>(source: Iterable<T>, maxValues: number) => AddressedSample<T>;
export declare const sampleAddressed: <T extends AddressedValue>(values: readonly T[], maxValues: number) => AddressedSample<T>;
export declare const omissionLine: (count: number, firstEntryId: string | undefined, lastEntryId: string | undefined, noun: string) => string;
//# sourceMappingURL=bounds.d.ts.map