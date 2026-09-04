import { useEffect, useMemo, useState } from "react";
import {
    cn,
    type ChartGridLayout,
    type ChartStyleType,
    type IndicatorStudy,
    type Side,
    type SymbolQuote,
} from "../../components/TradingTerminal";
import TradingViewWidget from "../../components/TradingWidget";
import type { LiveProfit } from "../../constant/SocketProvider";
import type { OrderListInterface, SymbolDetail } from "../../interface/interface";
import { ChartHeader } from "../ChartHeader";

type ChartPaneState = {
    symbolId: string;
    interval: string;
    showDrawingTools: boolean;
    drawingToolsToggleKey: number;
    showVolume: boolean;
    showOrdersOnChart: boolean;
    hasIndicators: boolean;
    indicatorCommand: { key: number; study: IndicatorStudy };
    clearIndicatorsKey: number;
    chartStyleCommand: { key: number; style: ChartStyleType };
};

const getPaneCount = (layout: ChartGridLayout) =>
    layout === "4" ? 4 : layout === "1" ? 1 : 2;

const createPaneState = (
    selectedQuote: SymbolQuote,
    interval: string,
    style: ChartStyleType
): ChartPaneState => ({
    symbolId: selectedQuote._id,
    interval,
    showDrawingTools: false,
    drawingToolsToggleKey: 0,
    showVolume: false,
    showOrdersOnChart: true,
    hasIndicators: false,
    indicatorCommand: { key: 0, study: "Moving Average" },
    clearIndicatorsKey: 0,
    chartStyleCommand: { key: 0, style },
});

const toChartSymbol = (quote: SymbolQuote) => `${quote.category}:${quote.symbol}`;

export function ChartWorkspace({
    selectedQuote,
    tickerQuotes = [],
    symbols,
    isFavorite,
    onToggleFavorite,
    closeModal,
    openModal,
    isModalOpen,
    onOpenMarkets,
    onOpenTrade,
    isFullscreen,
    onToggleFullscreen,
    chartInterval,
    chartStyleCommand,
    chartGridLayout,
    showQuickOrder,
    lot,
    setLot,
    isPlacingOrder,
    onQuickOrder,
    openTrades,
    liveProfit,
    onClosePosition,
    onUpdateProtection,
    updatingProtectionTradeId,
    updatingProtectionKind,
    closingTradeId,
    className,
}: {
    selectedQuote: SymbolQuote;
    tickerQuotes?: SymbolQuote[];
    symbols: SymbolDetail[];
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onSelectSymbol: (symbol: SymbolDetail) => void;
    chartInterval: string;
    onIntervalChange: (interval: string) => void;
    closeModal?: (type?: any, isMerge?: boolean) => void;
    openModal?: (type: any, modalData?: any, isMerge?: boolean) => void;
    isModalOpen?: any;
    onOpenMarkets?: () => void;
    onOpenTrade?: () => void;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    showDrawingTools: boolean;
    onToggleDrawingTools: () => void;
    showVolume: boolean;
    onToggleVolume: () => void;
    showOrdersOnChart: boolean;
    onToggleOrdersOnChart: () => void;
    hasIndicators: boolean;
    onClearIndicators: () => void;
    indicatorCommand: { key: number; study: IndicatorStudy };
    clearIndicatorsKey: number;
    onAddIndicator: (study: IndicatorStudy) => void;
    chartStyleCommand: { key: number; style: ChartStyleType };
    onChartStyleChange: (style: ChartStyleType) => void;
    chartGridLayout: ChartGridLayout;
    drawingToolsToggleKey: number;
    chartSymbol: string | null;
    showQuickOrder: boolean;
    lot: string;
    setLot: (lot: string) => void;
    isPlacingOrder: boolean;
    onQuickOrder: (side: Side, quote: SymbolQuote) => void;
    openTrades: OrderListInterface[];
    liveProfit: Map<string, LiveProfit>;
    onClosePosition: (trade: OrderListInterface, closingLot?: number) => void;
    onUpdateProtection: (
        trade: OrderListInterface,
        values: { sl?: number; target?: number }
    ) => void;
    updatingProtectionTradeId?: string;
    updatingProtectionKind?: "sl" | "target";
    closingTradeId?: string;
    className?: string;
}) {
    const paneCount = getPaneCount(chartGridLayout);
    const quoteById = useMemo(
        () => new Map(tickerQuotes.map((quote) => [quote._id, quote])),
        [tickerQuotes]
    );
    const [panes, setPanes] = useState<ChartPaneState[]>(() => [
        createPaneState(selectedQuote, chartInterval, chartStyleCommand.style),
    ]);
    const gridClassName =
        chartGridLayout === "4"
            ? "grid-cols-2 grid-rows-2"
            : chartGridLayout === "2h"
                ? "grid-cols-1 grid-rows-2"
                : chartGridLayout === "2v"
                    ? "grid-cols-2 grid-rows-1"
                    : "grid-cols-1 grid-rows-1";

    useEffect(() => {
        setPanes((current) => {
            const next = current.slice(0, paneCount);

            while (next.length < paneCount) {
                next.push(
                    createPaneState(
                        selectedQuote,
                        chartInterval,
                        chartStyleCommand.style
                    )
                );
            }

            return next;
        });
    }, [chartInterval, chartStyleCommand.style, paneCount, selectedQuote]);

    const updatePane = (
        index: number,
        updater: (pane: ChartPaneState) => ChartPaneState
    ) => {
        setPanes((current) =>
            current.map((pane, paneIndex) =>
                paneIndex === index ? updater(pane) : pane
            )
        );
    };

    return (
        <section
            className={cn(
                "flex min-h-0 flex-col bg-background",
                className,
                isFullscreen && "fixed inset-0 z-50 h-[100dvh] w-screen p-0"
            )}
        >
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className={`grid min-h-0 flex-1 gap-1 bg-border p-1 ${gridClassName}`}>
                    {panes.slice(0, paneCount).map((pane, index) => (
                        <ChartPane
                            key={index}
                            index={index}
                            pane={pane}
                            quoteById={quoteById}
                            selectedQuote={selectedQuote}
                            symbols={symbols}
                            isFavorite={isFavorite}
                            onToggleFavorite={onToggleFavorite}
                            closeModal={closeModal}
                            openModal={openModal}
                            isModalOpen={isModalOpen}
                            onOpenMarkets={onOpenMarkets}
                            onOpenTrade={onOpenTrade}
                            isFullscreen={isFullscreen}
                            onToggleFullscreen={onToggleFullscreen}
                            openTrades={openTrades}
                            liveProfit={liveProfit}
                            onClosePosition={onClosePosition}
                            onUpdateProtection={onUpdateProtection}
                            updatingProtectionTradeId={updatingProtectionTradeId}
                            updatingProtectionKind={updatingProtectionKind}
                            closingTradeId={closingTradeId}
                            showQuickOrder={showQuickOrder}
                            lot={lot}
                            setLot={setLot}
                            isPlacingOrder={isPlacingOrder}
                            onQuickOrder={onQuickOrder}
                            updatePane={updatePane}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ChartPane({
    index,
    pane,
    quoteById,
    selectedQuote,
    symbols,
    isFavorite,
    onToggleFavorite,
    closeModal,
    openModal,
    isModalOpen,
    onOpenMarkets,
    onOpenTrade,
    isFullscreen,
    onToggleFullscreen,
    openTrades,
    liveProfit,
    onClosePosition,
    onUpdateProtection,
    updatingProtectionTradeId,
    updatingProtectionKind,
    closingTradeId,
    showQuickOrder,
    lot,
    setLot,
    isPlacingOrder,
    onQuickOrder,
    updatePane,
}: {
    index: number;
    pane: ChartPaneState;
    quoteById: Map<string, SymbolQuote>;
    selectedQuote: SymbolQuote;
    symbols: SymbolDetail[];
    isFavorite: boolean;
    onToggleFavorite: () => void;
    closeModal?: (type?: any, isMerge?: boolean) => void;
    openModal?: (type: any, modalData?: any, isMerge?: boolean) => void;
    isModalOpen?: any;
    onOpenMarkets?: () => void;
    onOpenTrade?: () => void;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    openTrades: OrderListInterface[];
    liveProfit: Map<string, LiveProfit>;
    onClosePosition: (trade: OrderListInterface, closingLot?: number) => void;
    onUpdateProtection: (
        trade: OrderListInterface,
        values: { sl?: number; target?: number }
    ) => void;
    updatingProtectionTradeId?: string;
    updatingProtectionKind?: "sl" | "target";
    closingTradeId?: string;
    showQuickOrder: boolean;
    lot: string;
    setLot: (lot: string) => void;
    isPlacingOrder: boolean;
    onQuickOrder: (side: Side, quote: SymbolQuote) => void;
    updatePane: (
        index: number,
        updater: (pane: ChartPaneState) => ChartPaneState
    ) => void;
}) {
    const paneQuote = quoteById.get(pane.symbolId) ?? selectedQuote;

    return (
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg bg-background">
            <ChartHeader
                selectedSymbol={paneQuote}
                symbols={symbols}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
                onSelectSymbol={(symbol) =>
                    updatePane(index, (current) => ({
                        ...current,
                        symbolId: symbol._id,
                    }))
                }
                activeInterval={pane.interval}
                onIntervalChange={(interval) =>
                    updatePane(index, (current) => ({
                        ...current,
                        interval,
                    }))
                }
                closeModal={closeModal}
                openModal={openModal}
                isModalOpen={isModalOpen}
                onOpenMarkets={onOpenMarkets}
                onOpenTrade={onOpenTrade}
                isFullscreen={isFullscreen}
                onToggleFullscreen={onToggleFullscreen}
                showDrawingTools={pane.showDrawingTools}
                onToggleDrawingTools={() =>
                    updatePane(index, (current) => ({
                        ...current,
                        showDrawingTools: !current.showDrawingTools,
                        drawingToolsToggleKey: current.drawingToolsToggleKey + 1,
                    }))
                }
                showVolume={pane.showVolume}
                onToggleVolume={() =>
                    updatePane(index, (current) => ({
                        ...current,
                        showVolume: !current.showVolume,
                    }))
                }
                showOrdersOnChart={pane.showOrdersOnChart}
                onToggleOrdersOnChart={() =>
                    updatePane(index, (current) => ({
                        ...current,
                        showOrdersOnChart: !current.showOrdersOnChart,
                    }))
                }
                hasIndicators={pane.hasIndicators}
                activeChartStyle={pane.chartStyleCommand.style}
                onAddIndicator={(study) =>
                    updatePane(index, (current) => ({
                        ...current,
                        hasIndicators: study !== "All Indicators" || current.hasIndicators,
                        indicatorCommand: {
                            key: current.indicatorCommand.key + 1,
                            study,
                        },
                    }))
                }
                onChartStyleChange={(style) =>
                    updatePane(index, (current) => ({
                        ...current,
                        chartStyleCommand: {
                            key: current.chartStyleCommand.key + 1,
                            style,
                        },
                    }))
                }
            />
            <div className="relative min-h-0 flex-1">
                <TradingViewWidget
                    symbol={toChartSymbol(paneQuote)}
                    interval={pane.interval}
                    symbols={symbols}
                    drawingToolsToggleKey={pane.drawingToolsToggleKey}
                    positions={pane.showOrdersOnChart ? openTrades : []}
                    liveProfit={liveProfit}
                    onClosePosition={onClosePosition}
                    onUpdateProtection={onUpdateProtection}
                    updatingProtectionTradeId={updatingProtectionTradeId}
                    updatingProtectionKind={updatingProtectionKind}
                    closingTradeId={closingTradeId}
                    showVolume={pane.showVolume}
                    indicatorCommand={pane.indicatorCommand}
                    clearIndicatorsKey={pane.clearIndicatorsKey}
                    chartStyleCommand={pane.chartStyleCommand}
                />

                {pane.hasIndicators && (
                    <button
                        type="button"
                        title="Remove indicators"
                        onClick={() =>
                            updatePane(index, (current) => ({
                                ...current,
                                hasIndicators: false,
                                showVolume: false,
                                clearIndicatorsKey: current.clearIndicatorsKey + 1,
                            }))
                        }
                        className="absolute left-3 top-3 z-30 flex h-8 items-center gap-1.5 rounded-md border border-danger/30 bg-surface/95 px-2.5 text-[11px] font-bold text-danger shadow-lg backdrop-blur transition hover:bg-danger hover:text-white active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            close
                        </span>
                        Indicators
                    </button>
                )}
                {showQuickOrder && (
                    <QuickOrderOverlay
                        selectedSymbol={paneQuote}
                        lot={lot}
                        setLot={setLot}
                        isPlacingOrder={isPlacingOrder}
                        onQuickOrder={(side) => onQuickOrder(side, paneQuote)}
                    />
                )}
            </div>
        </div>
    );
}

function QuickOrderOverlay({
    selectedSymbol,
    lot,
    setLot,
    isPlacingOrder,
    onQuickOrder,
}: {
    selectedSymbol: SymbolQuote;
    lot: string;
    setLot: (lot: string) => void;
    isPlacingOrder: boolean;
    onQuickOrder: (side: Side) => void;
}) {
    const decimals = selectedSymbol.category === "forex" ? 5 : 2;
    const updateLot = (nextLot: string) => {
        if (/^\d*\.?\d{0,2}$/.test(nextLot)) {
            setLot(nextLot);
        }
    };
    const adjustLot = (delta: number) => {
        const current = Number(lot) || 0.01;
        const next = Math.min(
            100,
            Math.max(0.01, Number((current + delta).toFixed(2)))
        );
        setLot(String(next));
    };

    return (
        <div className="absolute bottom-0 left-2 right-2 z-20 flex shrink-0 justify-center lg:bottom-auto lg:left-14 lg:right-auto lg:top-1 lg:pointer-events-none">
            <div className="grid w-full max-w-[300px] grid-cols-[1fr_auto_1fr] items-stretch overflow-hidden rounded-md border border-border/50 bg-surface/60 shadow-md backdrop-blur-md lg:pointer-events-auto lg:w-auto">
                {/* content */}
                <button
                    type="button"
                    disabled={isPlacingOrder}
                    onClick={() => onQuickOrder("sell")}
                    className="flex min-w-20 items-center bg-danger/80 px-2 py-1.5 text-left text-white transition hover:bg-danger/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span>
                        <span className="block text-[8px] font-semibold uppercase leading-3 opacity-80">
                            Sell
                        </span>
                        <span className="block text-xs font-bold leading-4">
                            {selectedSymbol.bid.toFixed(decimals)}
                        </span>
                    </span>
                </button>

                <div className="flex w-16 flex-col items-center justify-center border-x border-border/40 bg-card/50 px-1 py-0.5 backdrop-blur">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => adjustLot(-0.01)}
                            className="flex h-3.5 w-3.5 items-center justify-center rounded text-text-muted hover:bg-card-hover"
                        >
                            <span className="material-symbols-outlined text-[10px]">
                                remove
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => adjustLot(0.01)}
                            className="flex h-3.5 w-3.5 items-center justify-center rounded text-text-muted hover:bg-card-hover"
                        >
                            <span className="material-symbols-outlined text-[10px]">
                                add
                            </span>
                        </button>
                    </div>

                    <input
                        value={lot}
                        onChange={(event) => updateLot(event.target.value)}
                        onBlur={() => {
                            if (!Number(lot) || Number(lot) <= 0) {
                                setLot("0.01");
                            }
                        }}
                        aria-label="Lot size"
                        className="h-5 w-full border-0 bg-transparent px-0.5 text-center text-[10px] font-semibold text-text outline-none"
                    />
                </div>

                <button
                    type="button"
                    disabled={isPlacingOrder}
                    onClick={() => onQuickOrder("buy")}
                    className="flex min-w-20 items-center bg-success/80 px-2 py-1.5 text-left text-white transition hover:bg-success/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span>
                        <span className="block text-[8px] font-semibold uppercase leading-3 opacity-80">
                            Buy
                        </span>
                        <span className="block text-xs font-bold leading-4">
                            {selectedSymbol.ask.toFixed(decimals)}
                        </span>
                    </span>
                </button>
            </div>
        </div>
    );
}
