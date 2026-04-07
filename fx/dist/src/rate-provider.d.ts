interface ProviderRate {
    sourceCurrency: string;
    targetCurrency: string;
    rate: number;
    validForSeconds: number;
}
export declare function setProviderFailureMode(enabled: boolean): void;
export declare function isProviderInFailureMode(): boolean;
export declare function fetchRate(sourceCurrency: string, targetCurrency: string): ProviderRate;
export {};
//# sourceMappingURL=rate-provider.d.ts.map