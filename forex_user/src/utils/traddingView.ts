export function toTradingViewSymbol(symbol: string) {
    const map: Record<string, string> = {
        EURUSD: "FX:EURUSD",
        GBPUSD: "FX:GBPUSD",
        XAUUSD: "OANDA:XAUUSD",
        BTCUSD: "BINANCE:BTCUSDT",
        ETHUSD: "BINANCE:ETHUSDT",
        US30: "BLACKBULL:US30",
        NAS100: "BLACKBULL:NAS100",
    };

    return map[symbol] || symbol;
}