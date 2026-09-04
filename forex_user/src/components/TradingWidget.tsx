import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useChartPositionOverlay } from "../hooks/useChartPositionOverlay";
import { CustomDatafeed } from "../hooks/useTradingView";
import type { ChartStyleType, IndicatorStudy } from "./TradingTerminal";
import type { OrderListInterface, SymbolDetail } from "../interface/interface";
import type { LiveProfit } from "../constant/SocketProvider";
import { ChartPositionOverlay } from "./tradingWidget/ChartPositionOverlay";
import {
    clearLineGroup,
    executeWidgetAction,
    getActiveChart,
} from "./tradingWidget/chartPositionUtils";
declare global {
    interface Window {
        TradingView: any;
    }
}

type TradingViewWidgetProps = {
    symbol?: string | null;
    interval: string;
    symbols?: SymbolDetail[];
    drawingToolsToggleKey?: number;
    positions?: OrderListInterface[];
    liveProfit?: Map<string, LiveProfit>;
    showVolume?: boolean;
    indicatorCommand?: { key: number; study: IndicatorStudy };
    clearIndicatorsKey?: number;
    chartStyleCommand?: { key: number; style: ChartStyleType };
    onClosePosition?: (trade: OrderListInterface) => void;
    onUpdateProtection?: (
        trade: OrderListInterface,
        values: { sl?: number; target?: number }
    ) => void;
    updatingProtectionTradeId?: string;
    updatingProtectionKind?: "sl" | "target";
    closingTradeId?: string;
};

type ChartTheme = "dark" | "light";

type LastPriceTick = {
    price: number;
    timestamp: number;
};

function getStoredTheme(): ChartTheme {
    return localStorage.getItem("theme") === "light" ? "light" : "dark";
}

function normalizeSymbolName(symbol?: string | null): string {
    return (symbol || "").replace(/^[A-Z]+:/, "").toUpperCase();
}

function formatLastPrice(value: number) {
    if (!Number.isFinite(value)) return "--";
    return value >= 100 ? value.toFixed(2) : value.toFixed(5);
}

function formatTickAge(timestamp: number | undefined, now: number) {
    if (!timestamp) return "--";

    const ageSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));

    if (ageSeconds < 60) {
        return `${ageSeconds}s`;
    }

    const minutes = Math.floor(ageSeconds / 60);
    const seconds = ageSeconds % 60;

    return `${minutes}m ${seconds}s`;
}

function getThemeName(theme: ChartTheme) {
    return theme === "dark" ? "Dark" : "Light";
}

function getThemeOverrides(theme: ChartTheme) {
    const isDark = theme === "dark";

    return {
        "paneProperties.background": isDark ? "#0d1117" : "#ffffff",
        "paneProperties.backgroundType": "solid",
        "paneProperties.vertGridProperties.color": isDark ? "#1e293b" : "#e5e7eb",
        "paneProperties.horzGridProperties.color": isDark ? "#1e293b" : "#e5e7eb",
        "scalesProperties.backgroundColor": isDark ? "#0d1117" : "#ffffff",
        "scalesProperties.textColor": isDark ? "#64748b" : "#475569",
        "mainSeriesProperties.candleStyle.upColor": "#22c55e",
        "mainSeriesProperties.candleStyle.downColor": "#ef4444",
        "mainSeriesProperties.candleStyle.borderUpColor": "#22c55e",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
        "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
    };
}

export default function TradingViewWidget({
    symbol,
    interval,
    symbols = [],
    drawingToolsToggleKey,
    positions = [],
    liveProfit,
    showVolume = false,
    indicatorCommand = { key: 0, study: "Moving Average" },
    clearIndicatorsKey = 0,
    chartStyleCommand = { key: 0, style: "candles" },
    onClosePosition,
    onUpdateProtection,
    updatingProtectionTradeId,
    updatingProtectionKind,
    closingTradeId,
}: TradingViewWidgetProps) {
    const [theme, setTheme] = useState<ChartTheme>(() => getStoredTheme());
    const [isChartReady, setIsChartReady] = useState(false);
    const [lastPriceTick, setLastPriceTick] = useState<LastPriceTick | null>(null);
    const [timerNow, setTimerNow] = useState(Date.now());
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetRef = useRef<any>(null);
    const scriptLoadedRef = useRef(false);
    const customDatafeed = useMemo(() => new CustomDatafeed(symbols), []);
    const intervalRef = useRef(interval);
    const themeRef = useRef(theme);
    const volumeStudyRef = useRef<string | null>(null);
    const {
        chartPositionRows,
        positionLinesRef,
        positionOverlayOffsets,
        protectionPlacement,
        setProtectionPlacement,
        startProtectionDrag,
        startProtectionPlacement,
        updateProtectionPlacement,
        commitProtectionPlacement,
        startPositionOverlayDrag,
    } = useChartPositionOverlay({
        widgetRef,
        containerRef,
        symbol,
        positions,
        symbols,
        liveProfit,
        isChartReady,
        onUpdateProtection,
    });

    useEffect(() => {
        intervalRef.current = interval;
    }, [interval]);

    useEffect(() => {
        customDatafeed.setSymbols(symbols);
    }, [customDatafeed, symbols]);

    useEffect(() => {
        setLastPriceTick(null);
    }, [symbol]);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setTimerNow(Date.now());
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const handleMarketDataUpdate = (event: Event) => {
            const data = (event as CustomEvent).detail;
            const activeSymbol = normalizeSymbolName(symbol);
            const eventSymbol = normalizeSymbolName(data?.symbol);

            if (!activeSymbol || activeSymbol !== eventSymbol) {
                return;
            }

            const bidPrice = Number(data?.bid?.price ?? 0);
            const askPrice = Number(data?.ask?.price ?? 0);
            const price = bidPrice || askPrice;

            if (!price) {
                return;
            }

            setLastPriceTick({
                price,
                timestamp: Number(data?.timestamp) || Date.now(),
            });
        };

        window.addEventListener("marketDataUpdate", handleMarketDataUpdate);

        return () => {
            window.removeEventListener("marketDataUpdate", handleMarketDataUpdate);
        };
    }, [symbol]);

    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    useEffect(() => {
        if (!widgetRef.current || !isChartReady) {
            return;
        }

        const chart = getActiveChart(widgetRef.current);

        if (!chart) {
            return;
        }

        const removeVolumeStudy = () => {
            if (!volumeStudyRef.current) return;

            try {
                chart.removeEntity(volumeStudyRef.current);
            } catch { }

            volumeStudyRef.current = null;
        };

        if (!showVolume) {
            removeVolumeStudy();
            return;
        }

        if (volumeStudyRef.current) {
            return;
        }

        try {
            const studyResult = chart.createStudy("Volume", false, false);

            if (typeof studyResult === "string") {
                volumeStudyRef.current = studyResult;
                return;
            }

            if (studyResult?.then) {
                studyResult.then((studyId: string) => {
                    if (showVolume) {
                        volumeStudyRef.current = studyId;
                        return;
                    }

                    try {
                        chart.removeEntity(studyId);
                    } catch { }
                });
            }
        } catch { }

        return () => {
            removeVolumeStudy();
        };
    }, [showVolume, isChartReady, symbol]);

    useEffect(() => {
        if (!indicatorCommand.key || !widgetRef.current || !isChartReady) {
            return;
        }

        if (indicatorCommand.study === "All Indicators") {
            executeWidgetAction(widgetRef.current, "Chart.Dialogs.ShowInsertIndicators");
            return;
        }

        try {
            const studyResult = getActiveChart(widgetRef.current)
                .createStudy(indicatorCommand.study, false, false);

            if (studyResult?.catch) {
                studyResult.catch(() => {
                    executeWidgetAction(widgetRef.current, "Chart.Dialogs.ShowInsertIndicators");
                });
            }
        } catch {
            executeWidgetAction(widgetRef.current, "Chart.Dialogs.ShowInsertIndicators");
        }
    }, [indicatorCommand.key, indicatorCommand.study, isChartReady]);

    useEffect(() => {
        if (!clearIndicatorsKey || !widgetRef.current || !isChartReady) {
            return;
        }

        volumeStudyRef.current = null;

        executeWidgetAction(widgetRef.current, "Chart.RemoveAllIndicators");
    }, [clearIndicatorsKey, isChartReady]);

    useEffect(() => {
        if (!chartStyleCommand.key || !widgetRef.current || !isChartReady) {
            return;
        }

        const chartStyleMap: Record<ChartStyleType, number> = {
            bars: 0,
            candles: 1,
            line: 2,
            area: 3,
            heikinAshi: 8,
            hollowCandles: 9,
            baseline: 10,
            columns: 13,
        };

        try {
            getActiveChart(widgetRef.current)
                .setChartType(chartStyleMap[chartStyleCommand.style]);
        } catch { }
    }, [chartStyleCommand.key, chartStyleCommand.style, isChartReady]);

    useEffect(() => {
        return () => {
            const chart =
                getActiveChart(widgetRef.current);

            if (!chart) return;

            positionLinesRef.current.forEach(
                (group) => {
                    clearLineGroup(
                        chart,
                        group
                    );
                }
            );

            positionLinesRef.current.clear();
        };
    }, []);

    useEffect(() => {
        const syncTheme = () => {
            setTheme(getStoredTheme());
        };

        window.addEventListener("themechange", syncTheme);
        window.addEventListener("storage", syncTheme);

        return () => {
            window.removeEventListener("themechange", syncTheme);
            window.removeEventListener("storage", syncTheme);
        };
    }, []);

    const initWidget = useCallback(() => {
        if (
            !containerRef.current ||
            !window.TradingView
        ) {
            return;
        }

        if (widgetRef.current) {
            try {
                const chart =
                    getActiveChart(widgetRef.current);

                if (chart) {
                    positionLinesRef.current.forEach(
                        (group) => {
                            clearLineGroup(chart, group);
                        }
                    );
                }
                positionLinesRef.current.clear();
                widgetRef.current.remove();
            } catch { }

            widgetRef.current = null;
        }

        setIsChartReady(false);

        widgetRef.current =
            new window.TradingView.widget({
                symbol,
                interval: intervalRef.current,

                container:
                    containerRef.current,

                library_path:
                    "/charting_library/",

                datafeed: customDatafeed
                ,

                locale: "en",

                autosize: true,

                fullscreen: false,

                theme: getThemeName(themeRef.current),

                disabled_features: [
                    "header_widget",
                    "legend_widget",
                    "edit_buttons_in_legend",
                    "display_market_status",
                    "header_symbol_search",
                    "symbol_search_hot_key",
                    "header_resolutions",
                    "header_compare",
                    "header_saveload",
                    "header_screenshot",
                    "header_undo_redo",
                    "timeframes_toolbar",
                    "use_localstorage_for_settings",
                    "create_volume_indicator_by_default",
                ],

                enabled_features: [],

                overrides: getThemeOverrides(themeRef.current),
            });

        widgetRef.current.onChartReady(() => {
            setIsChartReady(true);
        });
    }, [symbol, customDatafeed]);

    useEffect(() => {
        if (window.TradingView) {
            scriptLoadedRef.current = true;
            initWidget();
            return;
        }

        const existingScript =
            document.querySelector(
                'script[src="/charting_library/charting_library.js"]'
            );

        if (existingScript) {
            existingScript.addEventListener(
                "load",
                initWidget
            );

            return () => {
                existingScript.removeEventListener(
                    "load",
                    initWidget
                );
            };
        }

        const script =
            document.createElement("script");

        script.src =
            "/charting_library/charting_library.js";

        script.async = true;

        script.onload = () => {
            scriptLoadedRef.current = true;
            initWidget();
        };

        document.head.appendChild(script);
    }, [initWidget]);

    useEffect(() => {
        if (
            !widgetRef.current ||
            !symbol
        ) {
            return;
        }

        widgetRef.current.onChartReady(
            () => {
                getActiveChart(widgetRef.current)?.setSymbol(symbol);
            }
        );
    }, [symbol]);
    useEffect(() => {
        if (!widgetRef.current) {
            return;
        }

        widgetRef.current.onChartReady(
            () => {
                getActiveChart(widgetRef.current)?.setResolution(interval);
            }
        );
    }, [interval]);

    useEffect(() => {
        if (!widgetRef.current || !drawingToolsToggleKey) {
            return;
        }

        widgetRef.current.onChartReady(() => {
            executeWidgetAction(widgetRef.current, "Chart.DrawingToolbar.ToggleVisibility");
        });
    }, [drawingToolsToggleKey]);

    useEffect(() => {
        if (!widgetRef.current) {
            return;
        }

        widgetRef.current.onChartReady(
            () => {
                widgetRef.current
                    ?.changeTheme(getThemeName(theme))
                    .then(() => {
                        widgetRef.current?.applyOverrides(getThemeOverrides(theme));
                    });
            }
        );
    }, [theme]);

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-background">
            <div className="relative min-h-0 flex-1">
                <div
                    ref={containerRef}
                    className="h-full w-full"
                />
                <ChartPositionOverlay
                    theme={theme}
                    containerRef={containerRef}
                    rows={chartPositionRows}
                    positionOverlayOffsets={positionOverlayOffsets}
                    protectionPlacement={protectionPlacement}
                    setProtectionPlacement={setProtectionPlacement}
                    updateProtectionPlacement={updateProtectionPlacement}
                    commitProtectionPlacement={commitProtectionPlacement}
                    startProtectionDrag={startProtectionDrag}
                    startProtectionPlacement={startProtectionPlacement}
                    startPositionOverlayDrag={startPositionOverlayDrag}
                    onClosePosition={onClosePosition}
                    updatingProtectionTradeId={updatingProtectionTradeId}
                    updatingProtectionKind={updatingProtectionKind}
                    closingTradeId={closingTradeId}
                />
                {lastPriceTick && (
                    <div className="pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-2 rounded-lg border border-border bg-card/95 px-2.5 py-1.5 text-xs shadow-lg backdrop-blur">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
                        <span className="font-semibold tabular-nums text-text">
                            {formatLastPrice(lastPriceTick.price)}
                        </span>
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-primary">
                            {formatTickAge(lastPriceTick.timestamp, timerNow)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
