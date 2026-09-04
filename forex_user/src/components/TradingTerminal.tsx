import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { usePagination } from "../hooks/usePagination";
import { useTradingTerminal } from "../hooks/useTerminal";
import type { BulkCloseTradePayload } from "../hooks/useTrade";
import type { OrderListInterface, SymbolDetail, TradeListResponse } from "../interface/interface";
import { AccountStat, MobileAccountSummary } from "../screens/AccountStatus";
import InfiniteScrollSelector from "../screens/InfiniteScrollbar";
import { OrderPanel } from "../screens/OrderExecution";
import { ResizeHandle } from "../screens/ResizeHandler";
import { BottomTerminal, EmptyState } from "../screens/tradingTerminal/BottomTerminal";
import { ChartWorkspace } from "../screens/tradingTerminal/ChartWorkSpace";
import { MarketTicker } from "../screens/tradingTerminal/MarketTicker";
import { MobileBottomNav, MobileSheet } from "../screens/tradingTerminal/Mobile_terminal";
import { Watchlist } from "./Watchlist";
import { PositionsPanel } from "./Order";
import type { EquityPayload, LiveProfit } from "../constant/SocketProvider";
import { ThemeConverter } from "../screens/ThemeSwitcher";
import TradeAccountSwitchBar from "../screens/TradeAccountSwitcher";
export type Side = "buy" | "sell";
export type OrderType = "market" | "limit" | "stop";
export type Leverage = "1:100" | "1:200" | "1:500" | "1:1000";
export type ChartStyleType =
    | "candles"
    | "bars"
    | "line"
    | "area"
    | "hollowCandles"
    | "heikinAshi"
    | "baseline"
    | "columns";
export type IndicatorStudy =
    | "All Indicators"
    | "Moving Average"
    | "Exponential Moving Average"
    | "Weighted Moving Average"
    | "Relative Strength Index"
    | "MACD"
    | "Bollinger Bands"
    | "Stochastic"
    | "Average True Range"
    | "Commodity Channel Index"
    | "Momentum"
    | "Williams %R"
    | "Volume";
export type ChartGridLayout = "1" | "2h" | "2v" | "4";
export type SymbolQuote = {
    symbol: string;
    name: string;
    bid: number;
    ask: number;
    change: number;
    category: SymbolDetail["market"];
    spread: number;
    _id: string;
};
export function cn(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}
export type MobilePanel = "markets" | "trade" | "positions" | null;
export type BulkCloseFilters = Omit<BulkCloseTradePayload, "trade_user_id">



export default function TradingTerminal() {
    const mobilePositionsRef = useRef<HTMLElement>(null);
    const [showVolume, setShowVolume] = useState(false);
    const [showOrdersOnChart, setShowOrdersOnChart] = useState(true);
    const [chartGridLayout, setChartGridLayout] = useState<ChartGridLayout>("1");
    const [showDrawingTools, setShowDrawingTools] = useState(false);
    const [hasIndicators, setHasIndicators] = useState(false);
    const [clearIndicatorsKey, setClearIndicatorsKey] = useState(0);
    const [indicatorCommand, setIndicatorCommand] = useState<{
        key: number;
        study: IndicatorStudy;
    }>({ key: 0, study: "Moving Average" });
    const [chartStyleCommand, setChartStyleCommand] = useState<{
        key: number;
        style: ChartStyleType;
    }>({ key: 0, style: "candles" });
    const {
        equity_payload,
        tickPrice,
        liveProfit,


        openTradesQuery,
        closedTradesQuery,
        openTradesData,
        closedTradesData,

        createTradeMutation,
        closeTradeMutation,
        bulkCloseTradeMutation,
        updateTradeMutation,

        symbol_list,

        setSelectedCode,
        selectedSymbol,
        selectedQuote,
        chartSymbol,
        tickerQuotes,

        favorites,
        toggleFavorite,

        orderType,
        setOrderType,
        side,
        setSide,
        lot,
        setLot,
        leverage,
        setLeverage,
        oneClickTrading,
        setOneClickTrading,

        activeTab,
        setActiveTab,

        mobilePanel,
        setMobilePanel,

        chartInterval,
        setChartInterval,

        isChartFullscreen,
        setIsChartFullscreen,

        drawingToolsToggleKey,
        toggleDrawingTools,

        accountSnapshot,

        leftWidth,
        rightWidth,
        bottomHeight,
        startResize,

        openModal,
        closeModal,
        showMarketWatch,
        showOrderExecution,

        handlePlaceOrder,
        handleQuickOrder,
        handleClosePosition,
        handleBulkClose,
        handleUpdateProtection,
        isModalOpen,
        // isCreatingTrade,

        // isClosingTrade,

        // isBulkClosing,

        // isUpdatingTrade,

        // isOpenTradesLoading,
        // isClosedTradesLoading,
        //         updateTradeMutation,
        //  selectedCode,
        //  symbolDetailsQuery,
        isSymbolLoading,
        historyPagination, positionPagination
    } = useTradingTerminal();
    const scrollToMobilePositions = () => {
        setActiveTab("positions");
        setMobilePanel(null);
        requestAnimationFrame(() => {
            mobilePositionsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    };
    const handleToggleDrawingTools = () => {
        setShowDrawingTools((value) => !value);
        toggleDrawingTools();
    };
    const handleAddIndicator = (study: IndicatorStudy) => {
        if (study !== "All Indicators") {
            setHasIndicators(true);
        }
        setIndicatorCommand((current) => ({
            key: current.key + 1,
            study,
        }));
    };
    const handleClearIndicators = () => {
        setHasIndicators(false);
        setShowVolume(false);
        setClearIndicatorsKey((value) => value + 1);
    };
    const handleChartStyleChange = (style: ChartStyleType) => {
        setChartStyleCommand((current) => ({
            key: current.key + 1,
            style,
        }));
    };
    const desktopGridColumns = [
        showMarketWatch && `${leftWidth}px`,
        showMarketWatch && "8px",
        "minmax(0,1fr)",
        showOrderExecution && "8px",
        showOrderExecution && `${rightWidth}px`,
    ]
        .filter(Boolean)
        .join(" ");

    if (!selectedSymbol || isSymbolLoading) {
        return (
            <div className="min-h-screen bg-background text-text overflow-hidden">
                <TerminalTopBar
                    equity_payload={accountSnapshot}
                    chartGridLayout={chartGridLayout}
                    onChartGridLayoutChange={setChartGridLayout}
                />

                <div className="flex h-[calc(100vh-56px)] items-center justify-center">
                    <EmptyState
                        icon="candlestick_chart"
                        label="Loading markets"
                        hint="Symbols will appear here once market data is available."
                    />
                </div>
            </div>
        );
    };
    return (
        <div className="min-h-screen bg-background text-text custom-scrollbar">
            <TerminalTopBar
                equity_payload={accountSnapshot}
                chartGridLayout={chartGridLayout}
                onChartGridLayoutChange={setChartGridLayout}
            />
            <MarketTicker quotes={tickerQuotes} />
            {/* Desktop View */}
            <div
                className="hidden h-[calc(100vh-90px)] overflow-hidden lg:grid"
                style={{
                    gridTemplateColumns: desktopGridColumns,
                }}
            >

                {
                    showMarketWatch &&
                    <>
                        <Watchlist
                            symbols={symbol_list}
                            selectedSymbol={selectedSymbol}
                            onSelect={(symbol) => setSelectedCode(symbol)}
                            favorites={favorites}
                            onToggleFavorite={toggleFavorite}
                            tickPrice={tickPrice}
                        />
                        <ResizeHandle
                            direction="vertical"
                            onPointerDown={startResize("left")}
                        />
                    </>
                }
                <main className="flex min-w-0 flex-col border-x border-border">
                    <ChartWorkspace
                        selectedQuote={selectedQuote}
                        tickerQuotes={tickerQuotes}
                        symbols={symbol_list}
                        isFavorite={favorites.has(selectedQuote.symbol)}
                        onToggleFavorite={() => toggleFavorite(selectedQuote.symbol)}
                        onSelectSymbol={setSelectedCode}
                        chartInterval={chartInterval}
                        onIntervalChange={setChartInterval}
                        closeModal={closeModal}
                        openModal={openModal}
                        isModalOpen={isModalOpen}
                        isFullscreen={isChartFullscreen}
                        onToggleFullscreen={() => setIsChartFullscreen((value) => !value)}
                        showDrawingTools={showDrawingTools}
                        onToggleDrawingTools={handleToggleDrawingTools}
                        showVolume={showVolume}
                        onToggleVolume={() => setShowVolume((value) => !value)}
                        showOrdersOnChart={showOrdersOnChart}
                        onToggleOrdersOnChart={() => setShowOrdersOnChart((value) => !value)}
                        hasIndicators={hasIndicators}
                        onClearIndicators={handleClearIndicators}
                        indicatorCommand={indicatorCommand}
                        clearIndicatorsKey={clearIndicatorsKey}
                        onAddIndicator={handleAddIndicator}
                        chartStyleCommand={chartStyleCommand}
                        onChartStyleChange={handleChartStyleChange}
                        chartGridLayout={chartGridLayout}
                        drawingToolsToggleKey={drawingToolsToggleKey}
                        chartSymbol={chartSymbol}
                        showQuickOrder={!showOrderExecution}
                        lot={lot}
                        setLot={setLot}
                        isPlacingOrder={createTradeMutation.isPending}
                        onQuickOrder={handleQuickOrder}
                        openTrades={openTradesData.results}
                        liveProfit={liveProfit}
                        onClosePosition={handleClosePosition}
                        onUpdateProtection={handleUpdateProtection}
                        updatingProtectionTradeId={
                            updateTradeMutation.isPending
                                ? updateTradeMutation.variables?._id
                                : undefined
                        }
                        updatingProtectionKind={
                            updateTradeMutation.isPending
                                ? updateTradeMutation.variables?.sl !== undefined
                                    ? "sl"
                                    : updateTradeMutation.variables?.target !== undefined
                                        ? "target"
                                        : undefined
                                : undefined
                        }
                        closingTradeId={
                            closeTradeMutation.isPending
                                ? closeTradeMutation.variables?.tradeId
                                : undefined
                        }
                        className="min-h-0 flex-1"
                    />
                    <ResizeHandle
                        direction="horizontal"
                        onPointerDown={startResize("bottom")}
                    />
                    <BottomTerminal
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        height={bottomHeight}
                        openTrades={openTradesData}
                        closedTrades={closedTradesData}
                        isOpenTradesLoading={openTradesQuery.isLoading}
                        isClosedTradesLoading={closedTradesQuery.isLoading}
                        tickPrice={tickPrice}
                        liveProfit={liveProfit}
                        selectedSymbol={selectedQuote.symbol}
                        onClosePosition={handleClosePosition}
                        onBulkClose={handleBulkClose}
                        isClosing={closeTradeMutation.isPending}
                        total_pnl={equity_payload?.PNL || 0}
                        isBulkClosing={bulkCloseTradeMutation.isPending}
                        positionPagination={positionPagination}
                        historyPagination={historyPagination}
                    />
                </main>
                {
                    showOrderExecution &&
                    <>
                        <ResizeHandle
                            direction="vertical"
                            onPointerDown={startResize("right")}
                        />
                        <OrderPanel
                            selectedSymbol={selectedQuote}
                            orderType={orderType}
                            setOrderType={setOrderType}
                            side={side}
                            setSide={setSide}
                            lot={lot}
                            setLot={setLot}
                            marginPreview={0}
                            leverage={leverage}
                            setLeverage={setLeverage}
                            oneClickTrading={oneClickTrading}
                            setOneClickTrading={setOneClickTrading}
                            onPlaceOrder={handlePlaceOrder}
                            isPlacingOrder={createTradeMutation.isPending}
                        />
                    </>

                }
            </div>

            {/* Mobile View */}
            <div className="flex h-[calc(100dvh-56px)] flex-col bg-background lg:hidden">
                <div className="custom-scrollbarbar min-h-0 flex-1  pb-4">
                    <MobileAccountSummary equity_payload={accountSnapshot} />
                    <ChartWorkspace
                        selectedQuote={selectedQuote}
                        tickerQuotes={tickerQuotes}
                        symbols={symbol_list}
                        isFavorite={favorites.has(selectedQuote.symbol)}
                        onToggleFavorite={() => toggleFavorite(selectedQuote.symbol)}
                        onSelectSymbol={setSelectedCode}
                        chartInterval={chartInterval}
                        onIntervalChange={setChartInterval}
                        isModalOpen={isModalOpen}
                        onOpenMarkets={() => setMobilePanel("markets")}
                        onOpenTrade={() => setMobilePanel("trade")}
                        isFullscreen={isChartFullscreen}
                        onToggleFullscreen={() => setIsChartFullscreen((value) => !value)}
                        showDrawingTools={showDrawingTools}
                        onToggleDrawingTools={handleToggleDrawingTools}
                        showVolume={showVolume}
                        onToggleVolume={() => setShowVolume((value) => !value)}
                        showOrdersOnChart={showOrdersOnChart}
                        onToggleOrdersOnChart={() => setShowOrdersOnChart((value) => !value)}
                        hasIndicators={hasIndicators}
                        onClearIndicators={handleClearIndicators}
                        indicatorCommand={indicatorCommand}
                        clearIndicatorsKey={clearIndicatorsKey}
                        onAddIndicator={handleAddIndicator}
                        chartStyleCommand={chartStyleCommand}
                        onChartStyleChange={handleChartStyleChange}
                        chartGridLayout={chartGridLayout}
                        drawingToolsToggleKey={drawingToolsToggleKey}
                        chartSymbol={chartSymbol}
                        showQuickOrder={mobilePanel !== "trade"}
                        lot={lot}
                        setLot={setLot}
                        isPlacingOrder={createTradeMutation.isPending}
                        onQuickOrder={handleQuickOrder}
                        openTrades={openTradesData.results}
                        liveProfit={liveProfit}
                        onClosePosition={handleClosePosition}
                        onUpdateProtection={handleUpdateProtection}
                        updatingProtectionTradeId={
                            updateTradeMutation.isPending
                                ? updateTradeMutation.variables?._id
                                : undefined
                        }
                        updatingProtectionKind={
                            updateTradeMutation.isPending
                                ? updateTradeMutation.variables?.sl !== undefined
                                    ? "sl"
                                    : updateTradeMutation.variables?.target !== undefined
                                        ? "target"
                                        : undefined
                                : undefined
                        }
                        closingTradeId={
                            closeTradeMutation.isPending
                                ? closeTradeMutation.variables?.tradeId
                                : undefined
                        }
                        className="h-[68dvh] min-h-[500px] px-2 pb-2"
                    />

                    {!isChartFullscreen && (
                        <MobileTradeTabs
                            sectionRef={mobilePositionsRef}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            openCount={openTradesData.pagination.total}
                            historyCount={closedTradesData.pagination.total}
                            positions={
                                <MobilePaginatedTrades
                                    trades={openTradesData}
                                    isLoading={openTradesQuery.isLoading}
                                    tickPrice={tickPrice}
                                    liveProfit={liveProfit}
                                    onClosePosition={handleClosePosition}
                                    isClosing={closeTradeMutation.isPending}
                                    mode="positions"
                                    pagination={positionPagination}
                                />
                            }
                            history={
                                <MobilePaginatedTrades
                                    trades={closedTradesData}
                                    isLoading={closedTradesQuery.isLoading}
                                    tickPrice={tickPrice}
                                    liveProfit={liveProfit}
                                    onClosePosition={handleClosePosition}
                                    mode="history"
                                    pagination={historyPagination}
                                />
                            }
                        />
                    )}
                </div>

                {!isChartFullscreen && (
                    <MobileBottomNav
                        activePanel={mobilePanel}
                        onChart={() => setMobilePanel(null)}
                        onMarkets={() => setMobilePanel("markets")}
                        onTrade={() => setMobilePanel("trade")}
                        onPositions={scrollToMobilePositions}
                    />
                )}

                <AnimatePresence>
                    {mobilePanel === "markets" && (
                        <MobileSheet
                            key="markets"
                            title="Markets"
                            onClose={() => setMobilePanel(null)}
                        >
                            <Watchlist
                                symbols={symbol_list}
                                selectedSymbol={selectedSymbol}
                                onSelect={(symbol) => {
                                    setSelectedCode(symbol);
                                    setMobilePanel(null);
                                }}
                                favorites={favorites}
                                onToggleFavorite={toggleFavorite}
                                tickPrice={tickPrice}
                                className="flex h-full border-r-0"
                            />
                        </MobileSheet>
                    )}

                    {mobilePanel === "trade" && (
                        <MobileSheet
                            key="trade"
                            title={`Trade ${selectedQuote.symbol}`}
                            onClose={() => setMobilePanel(null)}
                        >
                            <OrderPanel
                                selectedSymbol={selectedQuote}
                                orderType={orderType}
                                setOrderType={setOrderType}
                                side={side}
                                setSide={setSide}
                                lot={lot}
                                setLot={setLot}
                                marginPreview={0}
                                leverage={leverage}
                                setLeverage={setLeverage}
                                oneClickTrading={oneClickTrading}
                                setOneClickTrading={setOneClickTrading}
                                onPlaceOrder={handlePlaceOrder}
                                isPlacingOrder={createTradeMutation.isPending}
                                className="flex h-full"
                            />
                        </MobileSheet>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function MobilePaginatedTrades({
    trades,
    isLoading,
    tickPrice,
    liveProfit,
    onClosePosition,
    isClosing,
    mode,
    pagination,
}: {
    trades: TradeListResponse;
    isLoading: boolean;
    tickPrice: Map<string, { b: number; a: number }>;
    liveProfit: Map<string, LiveProfit>;
    onClosePosition: (trade: OrderListInterface, closingLot?: number) => void;
    isClosing?: boolean;
    mode: "positions" | "history";
    pagination: ReturnType<typeof usePagination>;
}) {

    return (
        <InfiniteScrollSelector
            currentPage={pagination.pageNumber}
            handlePageChange={pagination.handlePageChange}
            pageSize={pagination.pageSizeValue}
            handlePageSizeChange={pagination.handlePageSizeChange}
            totalCount={trades.pagination.total}
            isLoading={isLoading}
            height="360px"
            pageSizeOptions={[5, 10, 20, 50]}
            className="h-full rounded-none border-0 bg-background"
            endMessage={
                <div className="py-3 text-center text-[11px] text-text-muted">
                    All records loaded
                </div>
            }
        >
            <PositionsPanel
                trades={trades.results}
                isLoading={isLoading && trades.results.length === 0}
                tickPrice={tickPrice}
                liveProfit={liveProfit}
                onClosePosition={onClosePosition}
                isClosing={isClosing}
                mode={mode}
                variant="cards"
                scrollable={false}
            />
        </InfiniteScrollSelector>
    );
}

function MobileTradeTabs({
    sectionRef,
    activeTab,
    setActiveTab,
    openCount,
    historyCount,
    positions,
    history,
}: {
    sectionRef?: React.Ref<HTMLElement>;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    openCount: number;
    historyCount: number;
    positions: React.ReactNode;
    history: React.ReactNode;
}) {
    const selectedTab = activeTab === "history" ? "history" : "positions";

    return (
        <section
            ref={sectionRef}
            className="mx-2  overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
            <div className="grid grid-cols-2 gap-1 border-b border-border bg-card p-1">
                <MobileTradeTabButton
                    label="Positions"
                    count={openCount}
                    icon="receipt_long"
                    active={selectedTab === "positions"}
                    onClick={() => setActiveTab("positions")}
                />
                <MobileTradeTabButton
                    label="History"
                    count={historyCount}
                    icon="history"
                    active={selectedTab === "history"}
                    onClick={() => setActiveTab("history")}
                />
            </div>

            <div className="h-[360px] min-h-0 bg-background">
                {selectedTab === "positions" ? positions : history}
            </div>
        </section>
    );
}

function MobileTradeTabButton({
    label,
    count,
    icon,
    active,
    onClick,
}: {
    label: string;
    count: number;
    icon: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex h-8 items-center justify-center gap-1.5 rounded-md text-[11px] font-bold transition active:scale-[0.98]",
                active
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-surface text-text-secondary"
            )}
        >
            <span className="material-symbols-outlined text-[16px]">
                {icon}
            </span>
            <span>{label}</span>
            <span
                className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px]",
                    active ? "bg-white/20 text-white" : "bg-card text-text-muted"
                )}
            >
                {count}
            </span>
        </button>
    );
}

function TerminalTopBar({
    equity_payload,
    chartGridLayout,
    onChartGridLayoutChange,
}: {
    equity_payload: EquityPayload;
    chartGridLayout: ChartGridLayout;
    onChartGridLayoutChange: (layout: ChartGridLayout) => void;
}) {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <header className="flex h-14 items-center justify-between sm:gap-3 gap-1 border-b border-border bg-surface px-3">
            <div className="flex items-center sm:gap-2 gap-1">
                {/* Back Button */}
                <button
                    type="button"
                    onClick={handleBack}
                    title="Back"
                    className="
                        flex
                        h-8 w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border border-border
                        bg-card
                        text-text-secondary
                        transition
                        hover:bg-card-hover
                        hover:text-primary
                        active:scale-95
                    "
                >
                    <span className="material-symbols-outlined text-[18px]">
                        arrow_back
                    </span>
                </button>

                {/* Logo */}
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white shadow-lg shadow-primary/20">
                    V
                </div>

                <div className="hidden sm:block">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xs font-semibold text-text">
                            VTX Prime Terminal
                        </h1>

                        <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-semibold text-success sm:flex">
                            <span className="pulse-live h-1.5 w-1.5 rounded-full bg-success" />
                            Market Open
                        </span>
                    </div>

                    <p className="text-[10px] text-text-muted">
                        Live Trading Workspace
                    </p>
                </div>
            </div>

            <div className="hidden items-center divide-x divide-border lg:flex">
                <div className="flex items-center gap-4 pr-4">
                    <AccountStat
                        label="Balance"
                        value={`$${Number(
                            equity_payload?.balance ?? 0
                        ).toFixed(2)}`}
                    />

                    <AccountStat
                        label="Equity"
                        value={`$${Number(
                            equity_payload?.equity ?? 0
                        ).toFixed(2)}`}
                        tone="success"
                    />
                </div>

                <div className="flex items-center gap-4 pl-4">
                    <AccountStat
                        label="Free Margin"
                        value={`$${Number(
                            equity_payload?.freeMargin ?? 0
                        ).toFixed(2)}`}
                    />

                    <AccountStat
                        label="Margin Level"
                        value={`${Number(
                            equity_payload?.marginLevel ?? 99999
                        ).toFixed(2)}%`}
                        tone="success"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* <button
                    type="button"
                    title="Notifications"
                    className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-text-secondary transition hover:bg-card-hover hover:text-text active:scale-95"
                >
                    <span className="material-symbols-outlined text-[16px]">
                        notifications
                    </span>

                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
                </button> */}
                <ThemeConverter />
                <ChartGridSelector
                    value={chartGridLayout}
                    onChange={onChartGridLayoutChange}
                />

                <TradeAccountSwitchBar />
            </div>
        </header>
    );
}

const chartGridOptions: Array<{
    value: ChartGridLayout;
    label: string;
    icon: string;
}> = [
        { value: "1", label: "Single chart", icon: "crop_square" },
        { value: "2h", label: "2 charts horizontal", icon: "splitscreen_top" },
        { value: "2v", label: "2 charts vertical", icon: "splitscreen_left" },
        { value: "4", label: "4 charts grid", icon: "grid_view" },
    ];

function ChartGridSelector({
    value,
    onChange,
}: {
    value: ChartGridLayout;
    onChange: (layout: ChartGridLayout) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const activeOption =
        chartGridOptions.find((option) => option.value === value) ??
        chartGridOptions[0];
    return (
        <div className="relative sm:block hidden">
            <button
                type="button"
                title="Chart layout"
                aria-label="Chart layout"
                onClick={() => setIsOpen((open) => !open)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-text-secondary transition hover:bg-card-hover hover:text-primary active:scale-95"
            >
                <span className="material-symbols-outlined text-[18px]">
                    {activeOption.icon}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-border bg-surface p-1 shadow-xl">
                    {chartGridOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-xs font-semibold transition",
                                option.value === value
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
    );
}
