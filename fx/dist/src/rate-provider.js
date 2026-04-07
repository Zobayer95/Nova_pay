"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProviderFailureMode = setProviderFailureMode;
exports.isProviderInFailureMode = isProviderInFailureMode;
exports.fetchRate = fetchRate;
const shared_1 = require("@novapay/shared");
const logger = (0, shared_1.createLogger)('fx-rate-provider');
const BASE_RATES = {
    'USD/EUR': 0.92,
    'USD/GBP': 0.79,
    'USD/NGN': 1550.0,
    'USD/KES': 153.5,
    'USD/GHS': 15.4,
    'USD/ZAR': 18.2,
    'EUR/USD': 1.087,
    'EUR/GBP': 0.858,
    'EUR/NGN': 1685.0,
    'GBP/USD': 1.266,
    'GBP/EUR': 1.165,
    'GBP/NGN': 1962.0,
    'NGN/USD': 0.000645,
    'KES/USD': 0.00651,
    'GHS/USD': 0.0649,
    'ZAR/USD': 0.0549,
};
const RATE_VALIDITY_SECONDS = 30;
const MAX_SPREAD_PERCENT = 0.5;
let failureMode = false;
function setProviderFailureMode(enabled) {
    failureMode = enabled;
    logger.warn({ failureMode: enabled }, 'Provider failure mode changed');
}
function isProviderInFailureMode() {
    return failureMode;
}
function fetchRate(sourceCurrency, targetCurrency) {
    if (failureMode) {
        logger.error({ sourceCurrency, targetCurrency }, 'FX provider unavailable (failure mode enabled)');
        throw new shared_1.AppError(shared_1.ErrorCode.FX_PROVIDER_UNAVAILABLE, 'FX rate provider is currently unavailable', 503);
    }
    const pair = `${sourceCurrency}/${targetCurrency}`;
    const baseRate = BASE_RATES[pair];
    if (baseRate === undefined) {
        // Try computing via USD as intermediate
        const sourceToUsd = BASE_RATES[`${sourceCurrency}/USD`];
        const usdToTarget = BASE_RATES[`USD/${targetCurrency}`];
        if (sourceToUsd !== undefined && usdToTarget !== undefined) {
            const crossRate = sourceToUsd * usdToTarget;
            const spread = (Math.random() - 0.5) * 2 * (MAX_SPREAD_PERCENT / 100) * crossRate;
            const finalRate = crossRate + spread;
            logger.info({ sourceCurrency, targetCurrency, rate: finalRate, method: 'cross-rate' }, 'Rate fetched via cross-rate');
            return {
                sourceCurrency,
                targetCurrency,
                rate: parseFloat(finalRate.toFixed(8)),
                validForSeconds: RATE_VALIDITY_SECONDS,
            };
        }
        throw new shared_1.AppError(shared_1.ErrorCode.VALIDATION_ERROR, `Unsupported currency pair: ${pair}`, 400);
    }
    const spread = (Math.random() - 0.5) * 2 * (MAX_SPREAD_PERCENT / 100) * baseRate;
    const finalRate = baseRate + spread;
    logger.info({ sourceCurrency, targetCurrency, rate: finalRate, method: 'direct' }, 'Rate fetched from provider');
    return {
        sourceCurrency,
        targetCurrency,
        rate: parseFloat(finalRate.toFixed(8)),
        validForSeconds: RATE_VALIDITY_SECONDS,
    };
}
//# sourceMappingURL=rate-provider.js.map