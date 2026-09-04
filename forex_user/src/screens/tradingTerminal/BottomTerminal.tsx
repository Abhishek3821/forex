import { useState } from "react";
import { PositionsPanel } from "../../components/Order";
import { cn, type BulkCloseFilters } from "../../components/TradingTerminal";
import type { LiveProfit } from "../../constant/SocketProvider";
import type { usePagination } from "../../hooks/usePagination";
import type { OrderListInterface, TradeListResponse } from "../../interface/interface";
import InfiniteScrollSelector from "../InfiniteScrollbar";
export function BottomTerminal({
    activeTab,
    setActiveTab,
    height,
    openTrades,
    closedTrades,
    isOpenTradesLoading,
    isClosedTradesLoading,
    tickPrice,
    liveProfit,
    selectedSymbol,
    onClosePosition,
    onBulkClose,
    isClosing,
    isBulkClosing,
    total_pnl,
    positionPagination,
    historyPagination,
}: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    height: number;
    openTrades: TradeListResponse;
    closedTrades: TradeListResponse;
    isOpenTradesLoading: boolean;
    isClosedTradesLoading: boolean;
    tickPrice: Map<string, { b: number; a: number }>;
    liveProfit: Map<string, LiveProfit>;
    selectedSymbol: string;
    onClosePosition: (
        trade: OrderListInterface,
        closingLot?: number
    ) => void;
    onBulkClose: (filters?: BulkCloseFilters) => void;
    isClosing?: boolean;
    isBulkClosing?: boolean;
    total_pnl: number;
    positionPagination: ReturnType<typeof usePagination>;
    historyPagination: ReturnType<typeof usePagination>;
}) {
    const [showCloseOptions, setShowCloseOptions] =
        useState(false);

    const [closeOptions, setCloseOptions] = useState({
        profit: false,
        loss: false,
        buy: false,
        sell: false,
        symbol: false,
    });

    const tabs = [
        {
            key: "positions",
            label: "Positions",
        },
        {
            key: "orders",
            label: "Orders",
            icon: "pending_actions",
        },
        {
            key: "history",
            label: "History",
            icon: "history",
        },
        {
            key: "transactions",
            label: "Transactions",
            icon: "receipt_long",
        },
    ];

    const activeMeta = tabs.find(
        (tab) => tab.key === activeTab
    );

    const openTradeRows = openTrades.results ?? [];
    const closedTradeRows = closedTrades.results ?? [];
    const activeTrades =
        activeTab === "positions"
            ? openTrades
            : closedTrades;
    const activePagination =
        activeTab === "positions"
            ? positionPagination
            : historyPagination;
    const activeIsLoading =
        activeTab === "positions"
            ? isOpenTradesLoading
            : isClosedTradesLoading;

    const totalMargin = openTradeRows.reduce(
        (total, trade) =>
            total + Number(trade.margin ?? 0),
        0
    );

    const toggleCloseOption = (
        key: keyof typeof closeOptions
    ) => {
        setCloseOptions((prev) => {
            const next = {
                ...prev,
                [key]: !prev[key],
            };

            if (key === "profit" && !prev.profit) {
                next.loss = false;
            }

            if (key === "loss" && !prev.loss) {
                next.profit = false;
            }

            if (key === "buy" && !prev.buy) {
                next.sell = false;
            }

            if (key === "sell" && !prev.sell) {
                next.buy = false;
            }

            return next;
        });
    };

    const resetCloseOptions = () => {
        setCloseOptions({
            profit: false,
            loss: false,
            buy: false,
            sell: false,
            symbol: false,
        });
    };

    const handleProceedClose = () => {
        const filters: BulkCloseFilters = {};

        if (closeOptions.profit) {
            filters.mode = "profit";
        }

        if (closeOptions.loss) {
            filters.mode = "loss";
        }

        if (closeOptions.buy) {
            filters.bs = "Buy";
        }

        if (closeOptions.sell) {
            filters.bs = "Sell";
        }

        if (
            closeOptions.symbol &&
            selectedSymbol
        ) {
            filters.symbol = selectedSymbol;
        }

        const hasFilter =
            Object.keys(filters).length > 0;

        onBulkClose(
            hasFilter ? filters : undefined
        );

        setShowCloseOptions(false);
        resetCloseOptions();
    };

    const handleCancelClose = () => {
        setShowCloseOptions(false);
        resetCloseOptions();
    };

    return (
        <section
            style={{ height }}
            className="flex shrink-0 flex-col border-t border-border bg-surface"
        >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-3">
                <div className="flex gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() =>
                                setActiveTab(tab.key)
                            }
                            className={cn(
                                "border-b-2 px-2.5 py-2 text-[11px] font-medium transition",
                                activeTab === tab.key
                                    ? "border-primary text-primary"
                                    : "border-transparent text-text-muted hover:text-text"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 bg-card/40 py-1.5">
                    <div className="flex flex-wrap items-center gap-3 text-[11px]">
                        <span className="text-text-muted">
                            Open Positions:{" "}
                            <b className="text-text">
                                {openTrades.pagination.total}
                            </b>
                        </span>

                        <span className="text-text-muted">
                            Floating P&L:{" "}
                            <b
                                className={
                                    total_pnl >= 0
                                        ? "text-success"
                                        : "text-danger"
                                }
                            >
                                {total_pnl >= 0
                                    ? "+"
                                    : ""}
                                $
                                {Number(
                                    total_pnl
                                ).toFixed(2)}
                            </b>
                        </span>

                        <span className="text-text-muted">
                            Used Margin:{" "}
                            <b className="text-text">
                                $
                                {totalMargin.toFixed(
                                    2
                                )}
                            </b>
                        </span>
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            disabled={
                                isBulkClosing ||
                                openTradeRows.length === 0
                            }
                            onClick={() =>
                                setShowCloseOptions(
                                    (prev) => !prev
                                )
                            }
                            className="flex h-7 items-center gap-1 rounded-md border border-danger/40 bg-danger/10 px-2.5 text-[10px] font-semibold text-danger transition hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isBulkClosing ? (
                                <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                            ) : (
                                <span className="material-symbols-outlined text-[15px]">
                                    close
                                </span>
                            )}

                            Close All

                            <span
                                className={cn(
                                    "material-symbols-outlined text-[15px] transition-transform",
                                    showCloseOptions &&
                                    "rotate-180"
                                )}
                            >
                                keyboard_arrow_down
                            </span>
                        </button>

                        {showCloseOptions && (
                            <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
                                <div className="border-b border-border px-3 py-2">
                                    <p className="text-xs font-semibold text-text">
                                        Close Positions
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-text-muted">
                                        Select filters or
                                        proceed without
                                        selection to close all.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                    <CloseOption
                                        label="In Profit"
                                        checked={closeOptions.profit}
                                        onChange={() =>
                                            toggleCloseOption("profit")
                                        }
                                    />

                                    <CloseOption
                                        label="In Loss"
                                        checked={closeOptions.loss}
                                        onChange={() =>
                                            toggleCloseOption("loss")
                                        }
                                    />

                                    <div className="col-span-2 my-1 border-t border-border" />

                                    <CloseOption
                                        label="Buy Positions"
                                        checked={closeOptions.buy}
                                        onChange={() =>
                                            toggleCloseOption("buy")
                                        }
                                    />

                                    <CloseOption
                                        label="Sell Positions"
                                        checked={closeOptions.sell}
                                        onChange={() =>
                                            toggleCloseOption("sell")
                                        }
                                    />

                                    <div className="col-span-2 my-1 border-t border-border" />

                                    <div className="col-span-2">
                                        <CloseOption
                                            label={
                                                selectedSymbol
                                                    ? `Only ${selectedSymbol}`
                                                    : "Current Symbol"
                                            }
                                            checked={closeOptions.symbol}
                                            disabled={!selectedSymbol}
                                            onChange={() =>
                                                toggleCloseOption("symbol")
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 border-t border-border p-2">
                                    <button
                                        type="button"
                                        onClick={
                                            handleCancelClose
                                        }
                                        className="h-8 flex-1 rounded-md border border-border text-[11px] font-semibold text-text-secondary transition hover:bg-card-hover"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            isBulkClosing
                                        }
                                        onClick={
                                            handleProceedClose
                                        }
                                        className="flex h-8 flex-1 items-center justify-center gap-1 rounded-md bg-danger text-[11px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                                    >
                                        {isBulkClosing && (
                                            <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                                        )}

                                        Proceed
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="min-h-0 flex-1 custom-scroll">
                {(activeTab === "positions" || activeTab === "history") && (
                    <InfiniteScrollSelector
                        currentPage={activePagination.pageNumber}
                        handlePageChange={activePagination.handlePageChange}
                        pageSize={activePagination.pageSizeValue}
                        handlePageSizeChange={activePagination.handlePageSizeChange}
                        totalCount={activeTrades.pagination.total}
                        isLoading={activeIsLoading}
                        height="100%"
                        pageSizeOptions={[5, 10, 20, 50]}
                        className="h-full rounded-none border-0 bg-background"
                        endMessage={
                            <div className="border-t border-border py-3 text-center text-[11px] text-text-muted">
                                All records loaded
                            </div>
                        }
                    >
                        <PositionsPanel
                            trades={
                                activeTab === "positions"
                                    ? openTradeRows
                                    : closedTradeRows
                            }
                            isLoading={activeIsLoading && activeTrades.results.length === 0}
                            tickPrice={tickPrice}
                            liveProfit={liveProfit}
                            onClosePosition={onClosePosition}
                            mode={activeTab}
                            isClosing={isClosing}
                            scrollable={false}
                        />
                    </InfiniteScrollSelector>
                )}
                {activeTab !== "positions" &&
                    activeTab !== "history" && (
                        <EmptyState
                            icon={
                                activeMeta?.icon ??
                                "inbox"
                            }
                            label={`No ${activeTab} yet`}
                            hint="Your activity will show up here."
                        />
                    )}
            </div>
        </section>
    );
};
function CloseOption({
    label,
    checked,
    disabled = false,
    onChange,
}: {
    label: string;
    checked: boolean;
    disabled?: boolean;
    onChange: () => void;
}) {
    return (
        <label
            className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] transition",
                disabled
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer hover:bg-card-hover"
            )}
        >
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-primary"
            />

            <span className="truncate text-text">
                {label}
            </span>
        </label>
    );
}
export function EmptyState({
    icon,
    label,
    hint,
}: {
    icon: string;
    label: string;
    hint?: string;
}) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="material-symbols-outlined text-3xl text-text-muted">
                {icon}
            </span>
            <p className="text-sm font-medium text-text">{label}</p>
            {hint && <p className="text-xs text-text-muted">{hint}</p>}
        </div>
    );
}
