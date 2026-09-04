import { getActiveAccount } from "../utils/getActiveAccount";
import { fetchCandles } from "./useCandlelist";
import type { SymbolDetail } from "../interface/interface";

interface Bar {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}
interface SubscriberInfo {
    subscriberUID: string;
    resolution: string;
    lastBar: Bar | null;
    handler: (bar: Bar) => void;
    symbolName: string;
}
interface MarketData {
    symbol: string;
    timestamp: number;
    bid?: { price?: number; size?: number };
    ask?: { price?: number; size?: number };
}

interface SearchSymbolResult {
    symbol: string;
    full_name: string;
    description: string;
    exchange: string;
    ticker: string;
    type: string;
}

export interface MarketSessionConfig {
    session: string;
    timezone: string;
    defaultPriceScale: number;
};
export type MarketType =
    | "forex"
    | "stock"
    | "crypto"
    | "indices"
    | "cfd";
export const MARKET_SESSIONS: Record<MarketType, MarketSessionConfig> = {
    crypto: {
        session: "24x7",
        timezone: "Etc/UTC",
        defaultPriceScale: 100,
    },
    // Forex: Sun 22:00 to Fri 21:00 UTC (Continuous)
    forex: {
        session: "2200-2100:23456",
        timezone: "Etc/UTC",
        defaultPriceScale: 100000,
    },
    // CFD: Daily break from 21:00 to 22:00 UTC
    cfd: {
        session: "2200-2100:23456",
        timezone: "Etc/UTC",
        defaultPriceScale: 100,
    },
    // US Stocks: 09:30-16:00 ET is 1430-2100 UTC
    stock: {
        session: "1430-2100:23456",
        timezone: "Etc/UTC",
        defaultPriceScale: 100,
    },
    indices: {
        session: "1430-2100:23456",
        timezone: "Etc/UTC",
        defaultPriceScale: 100,
    },
};

export class CustomDatafeed {
    private subscribers: Map<string, SubscriberInfo> = new Map();
    lastBars: Map<string, Bar> = new Map();
    private symbolPriceCache: Map<string, number> = new Map();
    private market: MarketType | null = null;
    private availableSymbols: SymbolDetail[] = [];

    constructor(symbols: SymbolDetail[] = []) {
        this.availableSymbols = symbols;
        this.setupBrowserEventListeners();
    }
    setSymbols(symbols: SymbolDetail[]) {
        this.availableSymbols = symbols;
    }
    getLastBars(symbol: string) {
        return this.lastBars.get(symbol);
    }
    private normalizeSymbol(symbol: string): string {
        return symbol.replace(/^[A-Z]+:/, "").toUpperCase();
    }
    private isRangeOutsideMarketSession(
        market: MarketType,
        fromMs: number,
        toMs: number
    ): boolean {
        const config = MARKET_SESSIONS[market];
        if (config.session === "24x7") return false;

        const [timeRange, daysStr] = config.session.split(":");
        const [startStr, endStr] = timeRange.split("-");

        const startMinutes = parseInt(startStr.slice(0, 2)) * 60 + parseInt(startStr.slice(2, 4));
        const endMinutes = parseInt(endStr.slice(0, 2)) * 60 + parseInt(endStr.slice(2, 4));

        // Map TradingView days (1=Sun...7=Sat) to JS days (0=Sun...6=Sat)
        const validJsDays = daysStr.split("").map((d) => {
            const day = Number(d);
            return day === 1 ? 0 : day - 1; // 1 becomes 0 (Sun), 2 becomes 1 (Mon)... 7 becomes 6 (Sat)
        });

        const isInside = (timeMs: number): boolean => {
            const d = new Date(timeMs);
            const day = d.getUTCDay();
            const minutes = d.getUTCHours() * 60 + d.getUTCMinutes();

            if (!validJsDays.includes(day)) return false;

            // Handle overnight sessions (e.g., 2200-2100)
            if (startMinutes > endMinutes) {
                return minutes >= startMinutes || minutes <= endMinutes;
            }
            return minutes >= startMinutes && minutes <= endMinutes;
        };

        // Logic: The range is "Outside" ONLY if both points are outside 
        // AND the gap isn't so large that it spans across a session.
        const fromInside = isInside(fromMs);
        const toInside = isInside(toMs);

        // If even one point is inside, the range is NOT fully outside.
        if (fromInside || toInside) return false;
        // Safety check: If the range is > 24h, it likely crossed a session.
        if (toMs - fromMs > 86400000) return false;
        return true;
    }

    private setupBrowserEventListeners() {
        window.addEventListener("marketDataUpdate", ((event: CustomEvent) => {
            const data = event.detail;
            if (data && data.symbol && (data.bid || data.ask)) {
                const bidPrice = data.bid?.price || 0;
                const askPrice = data.ask?.price || 0;
                const avgPrice = (bidPrice + askPrice) / 2;
                if (avgPrice > 0) {
                    this.handleMarketData({
                        symbol: this.normalizeSymbol(data.symbol),
                        bid: { price: bidPrice, size: data.bid?.size },
                        ask: { price: askPrice, size: data.ask?.size },
                        timestamp: data.timestamp,
                    });
                }
            }
        }) as EventListener);
    }
    private handleMarketData(data: MarketData) {
        const normalizedSymbol = this.normalizeSymbol(data.symbol);
        const bidPrice = data.bid?.price;
        const askPrice = data.ask?.price;
        const currentPrice =
            bidPrice !== undefined && askPrice !== undefined
                ? bidPrice
                : bidPrice ?? askPrice;
        if (!currentPrice) return;
        const tickVolume = (data.bid?.size || 0) + (data.ask?.size || 0);
        const tickTime = data.timestamp;
        this.symbolPriceCache.set(normalizedSymbol, currentPrice);
        this.subscribers.forEach((subscriber) => {
            const subscriberSymbol = this.normalizeSymbol(subscriber.symbolName);
            if (subscriberSymbol !== normalizedSymbol) return;
            const lastBar = subscriber.lastBar;
            let newBar: Bar;
            const safeTickTime = Number(tickTime) || Date.now();
            const barTime = this.getBarTime(safeTickTime, subscriber.resolution);
            if (lastBar && barTime < lastBar.time) {
                return;
            }
            if (lastBar && this.isSameBar(safeTickTime, lastBar.time, subscriber.resolution)) {
                newBar = {
                    ...lastBar,
                    time: lastBar.time,
                    high: Math.max(lastBar.high, currentPrice),
                    low: Math.min(lastBar.low, currentPrice),
                    close: currentPrice,
                    volume: (lastBar.volume || 0) + tickVolume,
                };
            } else {
                const lastClosedClose = lastBar?.close ?? currentPrice;
                newBar = {
                    time: Number(barTime) || safeTickTime,
                    open: lastClosedClose,
                    high: currentPrice,
                    low: currentPrice,
                    close: currentPrice,
                    volume: tickVolume,
                };
            }
            subscriber.lastBar = newBar;
            subscriber.handler({ ...newBar });
        });
    };
    private isSameBar(timestamp1: number, timestamp2: number, resolution: string): boolean {
        const interval = this.getResolutionInMs(resolution);
        return Math.floor(timestamp1 / interval) === Math.floor(timestamp2 / interval);
    }
    private getBarTime(timestamp: number, resolution: string): number {
        const interval = this.getResolutionInMs(resolution);
        return Math.floor(timestamp / interval) * interval;
    }
    private getResolutionInMs(resolution: string): number {
        const resolutionMap: Record<string, number> = {
            "1": 60 * 1000,
            "3": 3 * 60 * 1000,
            "5": 5 * 60 * 1000,
            "15": 15 * 60 * 1000,
            "30": 30 * 60 * 1000,
            "45": 45 * 60 * 1000,
            "60": 60 * 60 * 1000,
            "120": 2 * 60 * 60 * 1000,
            "180": 3 * 60 * 60 * 1000,
            "240": 4 * 60 * 60 * 1000,
            "1D": 24 * 60 * 60 * 1000,
            "1W": 7 * 24 * 60 * 60 * 1000,
            "1M": 30 * 24 * 60 * 60 * 1000,
        };
        return resolutionMap[resolution] || 60 * 1000;
    }
    onReady(callback: (configuration: any) => void) {
        setTimeout(() => {
            callback({
                supported_resolutions: [
                    "1",
                    "3",
                    "5",
                    "15",
                    "30",
                    "45",
                    "60",
                    "120",
                    "180",
                    "240",
                    "1D",
                    "1W",
                    "1M",
                ],
                supports_marks: true,
                supports_timescale_marks: true,
                supports_time: true,
                supports_search: true,
                supports_group_request: false,
                supports_time_scale_marks: true,
            });
        }, 0);
    }
    searchSymbols(
        userInput: string,
        _exchange: string,
        _symbolType: string,
        onResultReadyCallback: (symbols: SearchSymbolResult[]) => void,
        _searchSource?: string
    ) {
        const companyName = "Vtx Terminal";
        const availableSymbols = this.availableSymbols;
        if (availableSymbols.length === 0) {
            console.warn(
                "[CustomDatafeed] Symbols cache is empty. Pass symbols into CustomDatafeed."
            );
        }
        const searchTerm = userInput.toUpperCase();
        const filteredSymbols = availableSymbols
            .filter((symbol) => {
                const symbolName = this.normalizeSymbol(symbol.symbol_name);
                return (
                    symbolName.includes(searchTerm) ||
                    symbol.symbol_name.includes(searchTerm)
                );
            })
            .slice(0, 30);
        const results: SearchSymbolResult[] = filteredSymbols.map((symbol) => {
            const cleanSymbol = this.normalizeSymbol(symbol.symbol_name);
            const market = symbol.market || "forex";
            const fullSymbol = `${market}:${cleanSymbol}`;
            return {
                symbol: cleanSymbol,
                full_name: fullSymbol,
                description: `${cleanSymbol} - ${companyName}`,
                exchange: companyName,
                ticker: cleanSymbol,
                type: this.getSymbolType(cleanSymbol),
            };
        });
        setTimeout(() => {
            onResultReadyCallback(results);
        }, 0);
    };
    private getSymbolType(symbol: string): string {
        const normalizedSymbol = symbol.toUpperCase();
        if (normalizedSymbol.includes("XAU") || normalizedSymbol.includes("XAG"))
            return "commodity";
        if (normalizedSymbol.includes("BTC") || normalizedSymbol.includes("ETH"))
            return "crypto";
        if (normalizedSymbol.includes("USD") || normalizedSymbol.includes("EUR"))
            return "forex";
        return "forex";
    }

    resolveSymbol(
        symbolName: string,
        onSymbolResolvedCallback: (symbolInfo: any) => void,
    ) {
        const [marketPrefix, rawSymbol] = symbolName.includes(":")
            ? symbolName.split(":")
            : ["forex", symbolName];
        const normalizedSymbol = this.normalizeSymbol(rawSymbol);
        const matchedSymbol = this.availableSymbols.find(
            (symbol) => this.normalizeSymbol(symbol.symbol_name) === normalizedSymbol
        );
        const marketType = (
            matchedSymbol?.market ||
            marketPrefix?.toLowerCase() ||
            "forex"
        ) as MarketType;
        this.market = marketType;
        const companyName = "vtx Terminal";
        const supported_resolutions = [
            "1",
            "3",
            "5",
            "15",
            "30",
            "45",
            "60",
            "120",
            "180",
            "240",
            "1D",
            "1W",
            "1M",
        ];
        const sessionConfig =
            MARKET_SESSIONS[marketType] || MARKET_SESSIONS["forex"];
        setTimeout(() => {
            const symbolInfo = {
                name: normalizedSymbol,
                ticker: normalizedSymbol,
                description: normalizedSymbol,
                type: marketType,
                session: sessionConfig.session,
                timezone: sessionConfig.timezone,
                exchange: companyName,
                minmov: 1,
                pricescale: sessionConfig.defaultPriceScale,
                has_intraday: true,
                has_daily: true,
                has_weekly_and_monthly: true,
                supported_resolutions: supported_resolutions,
                volume_precision: 2,
                data_status: "streaming",
            };

            onSymbolResolvedCallback(symbolInfo);
        }, 0);
    }
    async getBars(
        symbolInfo: any,
        resolution: string,
        periodParams: { from: number; to: number },
        onHistoryCallback: (bars: Bar[], meta: { noData: boolean }) => void,
        onErrorCallback: (error: string) => void
    ) {
        try {
            setTimeout(async () => {
                const fromMs = periodParams.from * 1000;
                const toMs = periodParams.to * 1000;
                const market = this.market;
                if (!market) return;
                if (this.isRangeOutsideMarketSession(market, fromMs, toMs)) {
                    console.log(new Date(fromMs).toISOString(), new Date(toMs).toISOString(), "skipping")
                    onHistoryCallback([], { noData: false });
                    return;
                }
                console.log(new Date(fromMs).toISOString(), new Date(toMs).toISOString(), "getting")
                const symbol = this.normalizeSymbol(symbolInfo.name);
                const res = await fetchCandles({
                    symbol,
                    timeframe: resolution,
                    fromMs: periodParams.from * 1000,
                    toMs: periodParams.to * 1000,
                    trade_user_id: getActiveAccount() ?? ""
                });
                const bars = (res.results as any).results || [];
                if (bars.length) {
                    const lastBar = bars[bars.length - 1];
                    const alreadySetBar = this.lastBars.get(`${symbol}_${resolution}`);
                    if (!alreadySetBar || lastBar.time > alreadySetBar.time) {
                        this.lastBars.set(`${symbol}_${resolution}`, lastBar);
                    };
                };
                onHistoryCallback(bars, { noData: !(res.results as any).hasPrevious });
            }, 150)
        } catch (err) {
            onErrorCallback(err instanceof Error ? err.message : "Unknown error");
        }
    }


    subscribeBars(
        symbolInfo: any,
        resolution: string,
        onRealtimeCallback: (bar: Bar) => void,
        subscriberUID: string
    ) {
        const normalizedSymbol = this.normalizeSymbol(symbolInfo.name);
        const key = `${normalizedSymbol}_${resolution}`;
        const lastBar = this.lastBars.get(key) || null;

        this.subscribers.set(subscriberUID, {
            subscriberUID,
            resolution,
            lastBar,
            handler: onRealtimeCallback,
            symbolName: normalizedSymbol,
        });
        if (lastBar) {
            setTimeout(() => onRealtimeCallback(lastBar), 100);
        }
    };
    unsubscribeBars(subscriberUID: string) {
        this.subscribers.delete(subscriberUID);
    };
    getServerTime(callback: (serverTime: number) => void) {
        callback(Math.floor(Date.now() / 1000));
    };
    calculateHistoryDepth() {
        return { resolutionBack: "D", intervalBack: 365 };
    };
    // getMarks(onDataCallback: (marks: any[]) => void) {
    //   onDataCallback([]);
    // };
    // getTimescaleMarks(onDataCallback: (marks: any[]) => void) {
    //   onDataCallback([]);
    // }
}
export default CustomDatafeed;
