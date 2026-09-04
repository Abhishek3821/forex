import { useEffect, useMemo, useState } from "react";
import {
    cn,
    type ChartStyleType,
    type IndicatorStudy,
    type SymbolQuote,
} from "../components/TradingTerminal";
import type { ModalState } from "../hooks/useModal";
import { usePriceFlash } from "../hooks/usePriceFlash";
import type { SymbolDetail } from "../interface/interface";
import SelectBar, { type SelectBarOption } from "./SelectBar";
import { useIsMobile } from "../hooks/useMobile";

type ToolButtonProps = {
    icon: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
};

type ChartHeaderProps = {
    selectedSymbol: SymbolQuote;
    symbols: SymbolDetail[];
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onSelectSymbol: (symbol: SymbolDetail) => void;
    activeInterval: string;
    onIntervalChange: (interval: string) => void;
    openModal?: (type: ModalState, modalData?: any, isMerge?: boolean) => void;
    closeModal?: (type?: ModalState, isMerge?: boolean) => void;
    isModalOpen?: ModalState;
    onOpenMarkets?: () => void;
    onOpenTrade?: () => void;
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    showDrawingTools?: boolean;
    onToggleDrawingTools?: () => void;
    showVolume?: boolean;
    onToggleVolume?: () => void;
    showOrdersOnChart?: boolean;
    onToggleOrdersOnChart?: () => void;
    hasIndicators?: boolean;
    activeChartStyle?: ChartStyleType;
    onAddIndicator?: (study: IndicatorStudy) => void;
    onChartStyleChange?: (style: ChartStyleType) => void;
};

const intervals: SelectBarOption[] = [
    { label: "1m", value: "1", icon: "timer" },
    { label: "2m", value: "2", icon: "timer" },
    { label: "3m", value: "3", icon: "timer" },
    { label: "5m", value: "5", icon: "timer" },
    { label: "10m", value: "10", icon: "timer" },
    { label: "15m", value: "15", icon: "timer" },
    { label: "30m", value: "30", icon: "timer" },
    { label: "45m", value: "45", icon: "timer" },
    { label: "1h", value: "60", icon: "schedule" },
    { label: "2h", value: "120", icon: "schedule" },
    { label: "3h", value: "180", icon: "schedule" },
    { label: "4h", value: "240", icon: "schedule" },
    { label: "1d", value: "D", icon: "calendar_today" },
    { label: "1w", value: "W", icon: "calendar_view_week" },
    { label: "1M", value: "M", icon: "calendar_month" },
];

const indicatorOptions: Array<{
    label: string;
    study: IndicatorStudy;
    icon: string;
}> = [
        { label: "All Indicators", study: "All Indicators", icon: "add_chart" },
        { label: "Moving Average", study: "Moving Average", icon: "show_chart" },
        { label: "EMA", study: "Exponential Moving Average", icon: "timeline" },
        { label: "WMA", study: "Weighted Moving Average", icon: "moving" },
        { label: "RSI", study: "Relative Strength Index", icon: "speed" },
        { label: "MACD", study: "MACD", icon: "stacked_line_chart" },
        { label: "Bollinger Bands", study: "Bollinger Bands", icon: "ssid_chart" },
        { label: "Stochastic", study: "Stochastic", icon: "query_stats" },
        { label: "ATR", study: "Average True Range", icon: "monitoring" },
        { label: "CCI", study: "Commodity Channel Index", icon: "analytics" },
        { label: "Momentum", study: "Momentum", icon: "trending_up" },
        { label: "Williams %R", study: "Williams %R", icon: "percent" },
        { label: "Volume", study: "Volume", icon: "bar_chart" },
    ];

const chartStyleOptions: Array<{
    label: string;
    style: ChartStyleType;
    icon: string;
}> = [
        { label: "Candles", style: "candles", icon: "candlestick_chart" },
        { label: "Bars", style: "bars", icon: "bar_chart" },
        { label: "Line", style: "line", icon: "show_chart" },
        { label: "Area", style: "area", icon: "area_chart" },
        { label: "Hollow Candles", style: "hollowCandles", icon: "candlestick_chart" },
        { label: "Heikin Ashi", style: "heikinAshi", icon: "ssid_chart" },
        { label: "Baseline", style: "baseline", icon: "stacked_line_chart" },
        { label: "Columns", style: "columns", icon: "align_vertical_bottom" },
    ];

function ToolButton({
    icon,
    label,
    active = false,
    onClick,
}: ToolButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            aria-label={label}
            className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent transition-colors",
                active
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-card-hover hover:text-text"
            )}
        >
            <span className="material-symbols-outlined text-[17px] leading-none">
                {icon}
            </span>
        </button>
    );
}

export function ChartHeader({
    selectedSymbol,
    symbols,
    isFavorite,
    onToggleFavorite,
    onSelectSymbol,
    activeInterval,
    onIntervalChange,
    closeModal,
    openModal,
    isModalOpen,
    onOpenMarkets,
    onOpenTrade,
    isFullscreen = false,
    onToggleFullscreen,
    showDrawingTools = false,
    onToggleDrawingTools,
    showVolume = false,
    onToggleVolume,
    showOrdersOnChart = true,
    onToggleOrdersOnChart,
    hasIndicators = false,
    activeChartStyle = "candles",
    onAddIndicator,
    onChartStyleChange,
}: ChartHeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const isMobile = useIsMobile()
    const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
    const [isChartStyleOpen, setIsChartStyleOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const decimals = selectedSymbol.category === "forex" ? 5 : 2;
    const bidFlash = usePriceFlash(selectedSymbol.bid);
    const askFlash = usePriceFlash(selectedSymbol.ask);
    const filteredSymbols = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return symbols
            .filter((symbol) => {
                if (!query) return true;
                return symbol.symbol_name.toLowerCase().includes(query);
            })
            .slice(0, 12);
    }, [searchQuery, symbols]);
    useEffect(() => {
        !isMobile ? setToolsOpen(true) : setToolsOpen(false)
    }, [isMobile])
    const handleMarketWatch = () => {
        if (onOpenMarkets) {
            onOpenMarkets();
            return;
        }

        if (!openModal || !closeModal) return;

        if (isModalOpen?.market_watch) {
            closeModal({ market_watch: false }, true);
            return;
        }

        openModal({ market_watch: true }, {}, true);
    };

    const handleOrderExecution = () => {
        if (onOpenTrade) {
            onOpenTrade();
            return;
        }

        if (!openModal || !closeModal) return;

        if (isModalOpen?.order_execution) {
            closeModal({ order_execution: false }, true);
            return;
        }

        openModal({ order_execution: true }, {}, true);
    };

    const handleIndicatorSelect = (study: IndicatorStudy) => {
        onAddIndicator?.(study);
        setIsIndicatorsOpen(false);
    };

    const handleChartStyleSelect = (style: ChartStyleType) => {
        onChartStyleChange?.(style);
        setIsChartStyleOpen(false);
    };

    return (
        <div className="relative z-20 shrink-0 border-b border-border bg-surface">
            <div className="flex min-h-12 flex-col gap-2 px-2 py-2 md:flex-row md:items-center md:justify-between md:gap-3 md:py-1.5">
                <div className="flex min-w-0 items-center sm:gap-2 gap-1">
                    <button
                        type="button"
                        onClick={onToggleFavorite}
                        title="Toggle favorite"
                        aria-label="Toggle favorite"
                        className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card transition-colors",
                            isFavorite
                                ? "text-warning"
                                : "text-text-muted hover:bg-card-hover hover:text-text"
                        )}
                    >
                        <span className="material-symbols-outlined text-[17px] leading-none">
                            {isFavorite ? "star" : "star_outline"}
                        </span>
                    </button>

                    <div className="relative min-w-0">
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen((open) => !open)}
                            className="flex h-8 min-w-0 max-w-[220px] items-center gap-2 rounded-md border border-border bg-card px-2 text-left transition hover:bg-card-hover"
                        >
                            <span className="truncate text-sm font-semibold text-text">
                                {selectedSymbol.symbol}
                            </span>
                            <span
                                className={cn(
                                    "shrink-0 rounded px-1 py-px text-[10px] font-medium leading-3",
                                    selectedSymbol.change >= 0
                                        ? "bg-success/10 text-success"
                                        : "bg-danger/10 text-danger"
                                )}
                            >
                                {selectedSymbol.change >= 0 ? "+" : ""}
                                {selectedSymbol.change.toFixed(2)}%
                            </span>
                            <span className="material-symbols-outlined shrink-0 text-[15px] text-text-muted">
                                search
                            </span>
                        </button>

                        {isSearchOpen && (
                            <div className="absolute left-0 top-full z-40 mt-1 w-[min(280px,calc(100vw-24px))] overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
                                <div className="border-b border-border p-2">
                                    <input
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        placeholder="Search symbol"
                                        className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm text-text outline-none focus:border-primary"
                                    />
                                </div>

                                <div className="custom-scrollbar max-h-64 overflow-auto py-1">
                                    {filteredSymbols.map((symbol) => (
                                        <button
                                            key={symbol._id}
                                            type="button"
                                            onClick={() => {
                                                onSelectSymbol(symbol);
                                                setIsSearchOpen(false);
                                                setSearchQuery("");
                                            }}
                                            className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-text-secondary hover:bg-card-hover hover:text-text"
                                        >
                                            <span className="truncate font-semibold">
                                                {symbol.symbol_name}
                                            </span>
                                            <span className="shrink-0 text-[10px] uppercase text-text-muted">
                                                {symbol.market}
                                            </span>
                                        </button>
                                    ))}

                                    {!filteredSymbols.length && (
                                        <div className="px-3 py-4 text-sm text-text-muted">
                                            No symbols found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden min-w-0 text-[10px] leading-3 text-text-muted sm:block">
                        <p className="truncate">{selectedSymbol.name}</p>
                    </div>
                    <SelectBar
                        label="Timeframe"
                        value={activeInterval}
                        options={intervals}
                        onChange={onIntervalChange}
                        icon="timer"
                        className="shrink-0"
                        menuClassName="left-0 right-auto sm:left-auto sm:right-0"
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setToolsOpen((open) => !open)
                        }
                        className={cn(
                            `
                    flex
                    h-8 w-8
                    items-center
                    justify-center
                    rounded-md
                    border border-border
                    bg-card
                    text-text-secondary
                    transition
                    active:scale-95
                    sm:hidden 
                `,
                            toolsOpen &&
                            "border-primary/40 bg-primary/10 text-primary"
                        )}
                        aria-label="Chart tools"
                        title="Chart tools"
                    >
                        <span className="material-symbols-outlined text-[19px]">
                            more_vert
                        </span>
                    </button>
                </div>
                {
                    toolsOpen && <div className="flex min-w-0 items-center justify-between gap-2 md:justify-end">
                        <div className="hidden shrink-0 items-center gap-2 lg:flex">
                            <div className="text-right">
                                <p className="text-[9px] leading-3 text-text-muted">Bid</p>
                                <p
                                    className={cn(
                                        "rounded px-1.5 text-[11px] font-semibold leading-5 transition-colors duration-300",
                                        bidFlash === "up" && "bg-success/20 text-success",
                                        bidFlash === "down" && "bg-danger/20 text-danger",
                                        !bidFlash && "text-danger"
                                    )}
                                >
                                    {selectedSymbol.bid.toFixed(decimals)}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-[9px] leading-3 text-text-muted">Ask</p>
                                <p
                                    className={cn(
                                        "rounded px-1.5 text-[11px] font-semibold leading-5 transition-colors duration-300",
                                        askFlash === "up" && "bg-success/20 text-success",
                                        askFlash === "down" && "bg-danger/20 text-danger",
                                        !askFlash && "text-success"
                                    )}
                                >
                                    {selectedSymbol.ask.toFixed(decimals)}
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                            {/* <ToolButton
                                icon="design_services"
                                label="Toggle drawing tools"
                                active={showDrawingTools}
                                onClick={onToggleDrawingTools}
                            /> */}

                            <div className="relative">
                                <ToolButton
                                    icon="analytics"
                                    label="Indicators"
                                    active={isIndicatorsOpen || hasIndicators}
                                    onClick={() => {
                                        setIsChartStyleOpen(false);
                                        setIsIndicatorsOpen((open) => !open);
                                    }}
                                />

                                {isIndicatorsOpen && (
                                    <div className="custom-scrollbar absolute right-0 top-full z-50 mt-1 max-h-80 w-56 overflow-auto rounded-lg border border-border bg-surface p-1 shadow-xl">
                                        {indicatorOptions.map((option) => (
                                            <button
                                                key={option.study}
                                                type="button"
                                                onClick={() => handleIndicatorSelect(option.study)}
                                                className="flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-xs font-semibold text-text-secondary transition hover:bg-card-hover hover:text-text"
                                            >
                                                <span className="material-symbols-outlined text-[17px] text-primary">
                                                    {option.icon}
                                                </span>
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <ToolButton
                                    icon="candlestick_chart"
                                    label="Chart style"
                                    active={isChartStyleOpen || activeChartStyle === "candles"}
                                    onClick={() => {
                                        setIsIndicatorsOpen(false);
                                        setIsChartStyleOpen((open) => !open);
                                    }}
                                />

                                {isChartStyleOpen && (
                                    <div className="custom-scrollbar absolute right-0 top-full z-50 mt-1 max-h-80 w-44 overflow-auto rounded-lg border border-border bg-surface p-1 shadow-xl">
                                        {chartStyleOptions.map((option) => (
                                            <button
                                                key={option.style}
                                                type="button"
                                                onClick={() => handleChartStyleSelect(option.style)}
                                                className={cn(
                                                    "flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-xs font-semibold transition",
                                                    activeChartStyle === option.style
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-text-secondary hover:bg-card-hover hover:text-text"
                                                )}
                                            >
                                                <span className="material-symbols-outlined text-[17px]">
                                                    {option.icon}
                                                </span>
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <ToolButton
                                icon="bar_chart"
                                label={showVolume ? "Hide volume" : "Show volume"}
                                active={showVolume}
                                onClick={onToggleVolume}
                            />

                            <ToolButton
                                icon={showOrdersOnChart ? "visibility" : "visibility_off"}
                                label={showOrdersOnChart ? "Hide chart orders" : "Show chart orders"}
                                active={showOrdersOnChart}
                                onClick={onToggleOrdersOnChart}
                            />

                            <ToolButton
                                icon="format_list_bulleted"
                                label="Watchlist"
                                active={Boolean(isModalOpen?.market_watch)}
                                onClick={handleMarketWatch}
                            />

                            <ToolButton
                                icon="add_chart"
                                label="Trade"
                                active={Boolean(isModalOpen?.order_execution)}
                                onClick={handleOrderExecution}
                            />

                            <ToolButton
                                icon={isFullscreen ? "fullscreen_exit" : "fullscreen"}
                                label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                                active={isFullscreen}
                                onClick={() => {
                                    onToggleFullscreen?.(), !isFullscreen ? openModal?.({ order_execution: false, }, {}, true) : closeModal?.({ order_execution: true }, true)
                                }}
                            />
                        </div>
                    </div>
                }

            </div>
        </div>
    );
}
