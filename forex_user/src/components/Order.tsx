import { useState } from "react";
import { cn } from "./TradingTerminal";
import type { OrderListInterface } from "../interface/interface";
import type { LiveProfit } from "../constant/SocketProvider";
type PositionsPanelProps = {
    trades?: OrderListInterface[];
    isLoading?: boolean;
    tickPrice?: Map<string, { b: number; a: number }>;
    liveProfit?: Map<string, LiveProfit>;
    onClosePosition?: (trade: OrderListInterface, closingLot?: number) => void;
    isClosing?: boolean;
    mode: "history" | "positions";
    variant?: "table" | "cards";
    scrollable?: boolean;
};

function formatNumber(value?: number, decimals = 2) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "-";
    }

    return value.toFixed(decimals);
}

function formatMoney(value?: number) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "-";
    }

    return `${value >= 0 ? "+" : ""}$${value.toFixed(2)}`;
}

function getLivePnl(
    trade: OrderListInterface,
    liveProfit?: Map<string, LiveProfit>
) {
    return getLiveProfitValue(trade, liveProfit)?.pnl ?? Number(trade.profitLossAmount ?? 0);
}

function getLiveProfitValue(
    trade: OrderListInterface,
    liveProfit?: Map<string, LiveProfit>
) {
    const keys = [
        trade._id,
        trade.transactionId,
        ...(trade.execution_id ?? []),
    ].filter(Boolean);

    for (const key of keys) {
        const value = liveProfit?.get(String(key));
        if (value) {
            return value;
        }
    }
}

function getCurrentPrice(
    trade: OrderListInterface,
    tickPrice?: Map<string, { b: number; a: number }>
) {
    const tick = tickPrice?.get(trade.symbol);

    if (trade.bs === "Buy") {
        return tick?.b ?? trade.exit ?? trade.avg;
    }

    return tick?.a ?? trade.exit ?? trade.avg;
}

function EmptyTradeState({
    label,
    hint,
}: {
    label: string;
    hint: string;
}) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="material-symbols-outlined text-3xl text-text-muted">
                inbox
            </span>
            <p className="text-sm font-medium text-text">{label}</p>
            <p className="text-xs text-text-muted">{hint}</p>
        </div>
    );
}

function LoadingTradeState() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="material-symbols-outlined animate-spin text-3xl text-text-muted">
                progress_activity
            </span>
            <p className="text-sm font-medium text-text">Loading trades</p>
        </div>
    );
}

function DetailRow({
    label,
    value,
    valueClassName,
}: {
    label: string;
    value: string | number;
    valueClassName?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-border/70 py-2.5 last:border-b-0">
            <span className="text-[11px] font-medium uppercase text-text-muted">
                {label}
            </span>
            <span className={cn("text-right text-sm font-semibold text-text", valueClassName)}>
                {value}
            </span>
        </div>
    );
}

function PartialCloseCell({
    trade,
    isClosing,
    onClosePosition,
}: {
    trade: OrderListInterface;
    isClosing?: boolean;
    onClosePosition?: (
        trade: OrderListInterface,
        closingLot: number
    ) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [closingLot, setClosingLot] = useState(String(trade.lot));

    const lotValue = Number(closingLot);
    const maxLot = Number(trade.lot);

    const isInvalid =
        !Number.isFinite(lotValue) ||
        lotValue <= 0 ||
        lotValue > maxLot;

    const handleOpen = () => {
        setClosingLot(String(trade.lot));
        setIsOpen(true);
    };

    const handleCancel = () => {
        setClosingLot(String(trade.lot));
        setIsOpen(false);
    };

    const handleExecute = () => {
        if (isInvalid || isClosing || !onClosePosition) return;

        onClosePosition(trade, lotValue);
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                type="button"
                title="Partial Close"
                disabled={isClosing || !onClosePosition}
                onClick={handleOpen}
                className="inline-flex h-6 w-6 items-center justify-center rounded border border-warning/30 bg-warning/10 text-warning transition hover:bg-warning hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className="material-symbols-outlined text-[12px]">
                    call_split
                </span>
            </button>
        );
    };
    return (
        <div className="flex items-center gap-1">
            <input
                autoFocus
                title={`Maximum lot: ${trade.lot}`}
                value={closingLot}
                onChange={(event) => {
                    const value = event.target.value;

                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setClosingLot(value);
                    }
                }}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        handleExecute();
                    }

                    if (event.key === "Escape") {
                        handleCancel();
                    }
                }}
                className="h-6 w-14 rounded border border-border bg-background px-1 text-center text-[10px] font-semibold text-text outline-none focus:border-primary"
            />

            <button
                type="button"
                title="Execute Partial Close"
                disabled={
                    isClosing ||
                    isInvalid ||
                    !onClosePosition
                }
                onClick={handleExecute}
                className="inline-flex h-6 w-6 items-center justify-center rounded bg-danger text-white transition hover:opacity-80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isClosing ? (
                    <span className="h-2.5 w-2.5 animate-spin rounded-full border border-white border-t-transparent" />
                ) : (
                    <span className="material-symbols-outlined text-[12px]">
                        check
                    </span>
                )}
            </button>

            <button
                type="button"
                title="Cancel"
                disabled={isClosing}
                onClick={handleCancel}
                className="inline-flex h-6 w-6 items-center justify-center rounded border border-border text-text-muted transition hover:bg-card-hover hover:text-text disabled:opacity-50"
            >
                <span className="material-symbols-outlined text-[12px]">
                    close
                </span>
            </button>
        </div>
    );
}

export function PositionsPanel({
    trades = [],
    isLoading = false,
    tickPrice,
    liveProfit,
    onClosePosition,
    isClosing,
    mode = "history",
    variant = "table",
    scrollable = true,
}: PositionsPanelProps) {
    const [selectedTrade, setSelectedTrade] =
        useState<OrderListInterface | null>(null);
    if (isLoading && trades.length < 1) {
        return <LoadingTradeState />;
    };
    if (!trades.length) {
        return (
            <EmptyTradeState
                label={mode === "positions" ? "No open positions" : "No trade history"}
                hint={
                    mode === "positions"
                        ? "Positions you open will appear here."
                        : "Closed trades will appear here."
                }
            />
        );
    }

    if (variant === "cards") {
        return (
            <div className={cn("flex min-h-0 flex-col", scrollable && "h-full")}>
                <div
                    className={cn(
                        "space-y-2 p-3",
                        scrollable && "custom-scrollbar min-h-0 flex-1"
                    )}
                >
                    {trades.map((item) => {
                        const pnl = getLivePnl(item, liveProfit);
                        const currentPrice =
                            getLiveProfitValue(item, liveProfit)?.price ??
                            getCurrentPrice(item, tickPrice);
                        const pnlPositive = pnl >= 0;
                        return (
                            <button
                                key={item._id}
                                type="button"
                                onClick={() => setSelectedTrade(item)}
                                className="w-full rounded-lg border border-border bg-surface p-3 text-left shadow-sm transition active:scale-[0.99]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate text-base font-bold text-text">
                                                {item.symbol}
                                            </span>
                                            <span
                                                className={cn(
                                                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                                                    item.bs === "Buy"
                                                        ? "bg-success/10 text-success"
                                                        : "bg-danger/10 text-danger"
                                                )}
                                            >
                                                {item.bs}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-[11px] text-text-muted">
                                            {item.transactionId || item._id}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p
                                            className={cn(
                                                "text-base font-black tabular-nums",
                                                pnlPositive ? "text-success" : "text-danger"
                                            )}
                                        >
                                            {formatMoney(pnl)}
                                        </p>
                                        <p className="mt-1 text-[11px] text-text-muted">
                                            {mode === "positions" ? "Live P&L" : item.result ?? "Closed"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    <div className="rounded-md bg-card px-2 py-2">
                                        <p className="text-[10px] uppercase text-text-muted">Lot</p>
                                        <p className="mt-0.5 text-sm font-semibold text-text">{item.lot}</p>
                                    </div>
                                    <div className="rounded-md bg-card px-2 py-2">
                                        <p className="text-[10px] uppercase text-text-muted">Open</p>
                                        <p className="mt-0.5 text-sm font-semibold text-text">
                                            {formatNumber(item.avg, 5)}
                                        </p>
                                    </div>
                                    <div className="rounded-md bg-card px-2 py-2">
                                        <p className="text-[10px] uppercase text-text-muted">
                                            {mode === "positions" ? "Current" : "Close"}
                                        </p>
                                        <p className="mt-0.5 text-sm font-semibold text-text">
                                            {formatNumber(
                                                mode === "positions" ? currentPrice : item.exit,
                                                5
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {selectedTrade && (
                    <TradeDetailSheet
                        trade={selectedTrade}
                        mode={mode}
                        tickPrice={tickPrice}
                        liveProfit={liveProfit}
                        isClosing={isClosing}
                        onClose={() => setSelectedTrade(null)}
                        onClosePosition={onClosePosition}
                    />
                )}
            </div>
        );
    }

    return (
        <div className={cn("flex min-h-0 flex-col")}>
            <div
                className={cn(
                    " min-h-0 flex-1",
                    "custom-scrollbar"
                )}
            >
                <table className="w-full min-w-[940px] text-left text-xs">
                    <thead className="sticky top-0 z-10 bg-card text-[10px] uppercase text-text-muted">
                        <tr>
                            <th className="px-2.5 py-2">Trade ID</th>
                            <th className="px-2.5 py-2">Symbol</th>
                            <th className="px-2.5 py-2">Side</th>
                            <th className="px-2.5 py-2">Lot</th>
                            <th className="px-2.5 py-2">Open</th>
                            {
                                mode === "positions" && <th className="px-2.5 py-2">Current</th>
                            }
                            {mode === "history" &&
                                <>
                                    <th className="px-2.5 py-2">Close</th>
                                    <th className="px-2.5 py-2">Result</th>
                                </>
                            }
                            <th className="px-2.5 py-2">P&L</th>

                            {
                                mode === "positions" ?

                                    <>
                                        <th className="px-2.5 py-2">Margin</th>
                                        <th className="px-2.5 py-2">SL</th>
                                        <th className="px-2.5 py-2">TP</th>
                                        <th className="px-2.5 py-2">Partial Close</th>
                                    </>
                                    :
                                    <>


                                        <th className="px-2.5 py-2">Opened</th>
                                        <th className="px-2.5 py-2">Closed</th>
                                    </>
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {trades.map((item) => {
                            const pnl = mode === "history" ? (item.profitLossAmount ?? 0) : getLivePnl(item, liveProfit);
                            const currentPrice =
                                getLiveProfitValue(item, liveProfit)?.price ??
                                getCurrentPrice(item, tickPrice);
                            const side = item.bs.toLowerCase();

                            return (
                                <tr
                                    key={item._id}
                                    className={cn(
                                        "border-b border-l-2 border-border transition hover:bg-card/60",
                                        pnl >= 0
                                            ? "border-l-success/60"
                                            : "border-l-danger/60"
                                    )}
                                >
                                    <td className="px-2.5 py-2 text-[11px] text-text-secondary">
                                        {item.transactionId || item._id}
                                    </td>

                                    <td className="px-2.5 py-2 font-semibold text-text">
                                        {item.symbol}
                                    </td>

                                    <td className="px-2.5 py-2">
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                                                item.bs === "Buy"
                                                    ? "bg-success/10 text-success"
                                                    : "bg-danger/10 text-danger"
                                            )}
                                        >
                                            <span className="material-symbols-outlined text-[12px]">
                                                {item.bs === "Buy"
                                                    ? "trending_up"
                                                    : "trending_down"}
                                            </span>
                                            {side}
                                        </span>
                                    </td>

                                    <td className="px-2.5 py-2">{item.lot}</td>
                                    <td className="px-2.5 py-2">{formatNumber(item.avg, 5)}</td>
                                    {
                                        mode === "positions" && <td className="px-2.5 py-2">
                                            {formatNumber(currentPrice, 5)}
                                        </td>
                                    }
                                    {
                                        mode === "history" && <>
                                            <td className="px-2.5 py-2">{formatNumber(item.exit, 5)}</td>
                                            <td className="px-2.5 py-2 capitalize">
                                                {item.result ?? "-"}
                                            </td>
                                        </>
                                    }
                                    <td
                                        className={cn(
                                            "px-2.5 py-2 font-semibold",
                                            pnl >= 0 ? "text-success" : "text-danger"
                                        )}
                                    >
                                        {formatMoney(pnl)}
                                    </td>
                                    {
                                        mode === "positions" ? <>


                                            <td className="px-2.5 py-2">
                                                ${formatNumber(item.margin, 2)}
                                            </td>
                                            <td className="px-2.5 py-2">{formatNumber(item.sl, 5)}</td>
                                            <td className="px-2.5 py-2">
                                                {formatNumber(item.target, 5)}
                                            </td>
                                            <td className="px-2.5 py-2">
                                                <div className="flex items-center gap-1">
                                                    <PartialCloseCell
                                                        trade={item}
                                                        isClosing={isClosing}
                                                        onClosePosition={onClosePosition}
                                                    />

                                                    <button
                                                        type="button"
                                                        title="Close Position"
                                                        disabled={isClosing || !onClosePosition}
                                                        onClick={() => onClosePosition?.(item)}
                                                        className="inline-flex h-6 w-6 items-center justify-center rounded border border-danger/30 bg-danger/10 text-danger transition hover:bg-danger hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <span className="material-symbols-outlined text-[12px]">
                                                            close
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </> : <>
                                            <td className="px-2.5 py-2">
                                                {item.openedAt
                                                    || "-"}
                                            </td>
                                            <td className="px-2.5 py-2">
                                                {item.closedAt || "-"}
                                            </td>
                                        </>
                                    }
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

function TradeDetailSheet({
    trade,
    mode,
    tickPrice,
    liveProfit,
    isClosing,
    onClose,
    onClosePosition,
}: {
    trade: OrderListInterface;
    mode: "history" | "positions";
    tickPrice?: Map<string, { b: number; a: number }>;
    liveProfit?: Map<string, LiveProfit>;
    isClosing?: boolean;
    onClose: () => void;
    onClosePosition?: (trade: OrderListInterface, closingLot?: number) => void;
}) {
    const pnl = getLivePnl(trade, liveProfit);
    const currentPrice =
        getLiveProfitValue(trade, liveProfit)?.price ??
        getCurrentPrice(trade, tickPrice);
    const pnlClass = pnl >= 0 ? "text-success" : "text-danger";

    return (
        <div
            className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-[2px] lg:hidden"
            onClick={onClose}
        >
            <div
                className="max-h-[86dvh] w-full overflow-hidden rounded-t-xl border-t border-border bg-card shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
                <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate text-base font-bold text-text">
                                {trade.symbol}
                            </h3>
                            <span
                                className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                                    trade.bs === "Buy"
                                        ? "bg-success/10 text-success"
                                        : "bg-danger/10 text-danger"
                                )}
                            >
                                {trade.bs}
                            </span>
                        </div>
                        <p className="mt-1 truncate text-[11px] text-text-muted">
                            {trade.transactionId || trade._id}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-text-muted transition active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            close
                        </span>
                    </button>
                </div>

                <div className="custom-scrollbar max-h-[calc(86dvh-74px)]  px-4 py-3">
                    <div className="rounded-lg border border-border bg-surface px-3">
                        <DetailRow label="P&L" value={formatMoney(pnl)} valueClassName={pnlClass} />
                        <DetailRow label="Status" value={trade.status} />
                        <DetailRow label="Lot" value={trade.lot} />
                        <DetailRow label="Open Price" value={formatNumber(trade.avg, 5)} />
                        <DetailRow
                            label={mode === "positions" ? "Current Price" : "Close Price"}
                            value={formatNumber(mode === "positions" ? currentPrice : trade.exit, 5)}
                        />
                        {mode === "history" && (
                            <DetailRow label="Result" value={trade.result ?? "-"} />
                        )}
                        <DetailRow label="Margin" value={`$${formatNumber(trade.margin, 2)}`} />
                        <DetailRow label="Stop Loss" value={formatNumber(trade.sl, 5)} />
                        <DetailRow label="Take Profit" value={formatNumber(trade.target, 5)} />
                        <DetailRow label="Leverage" value={`1:${trade.leverage}`} />
                        <DetailRow label="Spread" value={formatNumber(trade.spread, 2)} />
                        <DetailRow label="Opened" value={trade.openedAt || "-"} />
                        {mode === "history" && (
                            <DetailRow label="Closed" value={trade.closedAt || "-"} />
                        )}
                    </div>

                    {mode === "positions" && (
                        <div className="mt-3 flex gap-2">
                            <div className="flex h-10 items-center rounded-lg border border-warning/30 bg-warning/10 px-2">
                                <PartialCloseCell
                                    trade={trade}
                                    isClosing={isClosing}
                                    onClosePosition={onClosePosition}
                                />
                            </div>
                            <button
                                type="button"
                                disabled={isClosing || !onClosePosition}
                                onClick={() => {
                                    onClosePosition?.(trade);
                                    onClose();
                                }}
                                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-danger text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isClosing ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
                                ) : (
                                    <span className="material-symbols-outlined text-[18px]">
                                        close
                                    </span>
                                )}
                                Close Position
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
