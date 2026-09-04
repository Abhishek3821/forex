import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    cn,
    type Leverage,
    type OrderType,
    type Side,
    type SymbolQuote,
} from "../components/TradingTerminal";
import { Input } from "../components/SingUp";
import { createSparklinePoints, useSparklineHistory } from "../hooks/useSparkline";

type OrderFormValues = {
    orderType: OrderType;
    side: Side;
    lot: string;
    stopLoss: string;
    takeProfit: string;
};

export type PlaceOrderPayload = {
    symbol: string;
    orderType: OrderType;
    side: Side;
    lot: number;
    leverage: Leverage;
    stopLoss?: number;
    takeProfit?: number;
    price: number;
};

const LOT_PRESETS = [0.01, 0.05, 0.1, 0.5, 1, 5];
const LEVERAGE_OPTIONS: Leverage[] = ["1:100", "1:200", "1:500", "1:1000"];

export function OrderPanel({
    selectedSymbol,
    orderType,
    setOrderType,
    side,
    setSide,
    lot,
    setLot,
    marginPreview,
    leverage,
    setLeverage,
    oneClickTrading,
    setOneClickTrading,
    onPlaceOrder,
    isPlacingOrder = false,
    className = "hidden lg:flex",
}: {
    selectedSymbol: SymbolQuote;
    orderType: OrderType;
    setOrderType: (type: OrderType) => void;
    side: Side;
    setSide: (side: Side) => void;
    lot: string;
    setLot: (lot: string) => void;
    marginPreview: number;
    leverage: Leverage;
    setLeverage: (leverage: Leverage) => void;
    oneClickTrading: boolean;
    setOneClickTrading: (value: boolean) => void;
    onPlaceOrder: (payload: PlaceOrderPayload) => void;
    isPlacingOrder?: boolean;
    className?: string;
}) {
    const [showSltpInputs, setShowSltpInputs] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = useForm<OrderFormValues>({
        defaultValues: {
            orderType,
            side,
            lot,
            stopLoss: "",
            takeProfit: "",
        },
    });

    const watchedOrderType = watch("orderType");
    const watchedSide = watch("side");
    const watchedLot = watch("lot");

    useEffect(() => {
        setOrderType(watchedOrderType);
    }, [watchedOrderType, setOrderType]);

    useEffect(() => {
        setSide(watchedSide);
    }, [watchedSide, setSide]);

    useEffect(() => {
        setLot(watchedLot);
    }, [watchedLot, setLot]);

    useEffect(() => {
        setValue("orderType", orderType);
    }, [orderType, setValue]);

    useEffect(() => {
        setValue("side", side);
    }, [side, setValue]);

    useEffect(() => {
        setValue("lot", lot);
    }, [lot, setValue]);

    useEffect(() => {
        if (!showSltpInputs) {
            setValue("stopLoss", "");
            setValue("takeProfit", "");
        }
    }, [setValue, showSltpInputs]);

    const submitOrder = (submitSide: Side) => {
        const values = getValues();
        const payload: PlaceOrderPayload = {
            symbol: selectedSymbol._id,
            orderType: values.orderType,
            side: submitSide,
            lot: Number(values.lot),
            leverage,
            stopLoss: showSltpInputs && values.stopLoss ? Number(values.stopLoss) : undefined,
            takeProfit: showSltpInputs && values.takeProfit ? Number(values.takeProfit) : undefined,
            price: submitSide === "buy" ? selectedSymbol.ask : selectedSymbol.bid,
        };

        onPlaceOrder(payload);
    };

    const onSubmit = (values: OrderFormValues) => {
        submitOrder(values.side);
    };

    const adjustLot = (delta: number) => {
        const current = Number(watchedLot) || 0;
        const next = Math.min(100, Math.max(0.01, Number((current + delta).toFixed(2))));
        setValue("lot", String(next));
    };

    return (
        <aside
            className={cn(
                "flex-col bg-surface custom-scrollbar",
                className
            )}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex h-full  flex-col">
                <div className="border-b border-border px-3 py-2.5 sm:block hidden">
                    <p className="text-xs font-semibold text-text">Place Order</p>
                    <p className="text-[11px] text-text-muted">
                        Execute on {selectedSymbol.symbol}
                    </p>
                </div>
                <div className="flex-1 space-y-3  p-3">
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
                        <div>
                            <p className="text-xs font-medium text-text">One-Click Trading</p>
                            <p className="text-[10px] text-text-muted">
                                Buy/Sell executes instantly
                            </p>
                        </div>
                        <ToggleSwitch
                            checked={oneClickTrading}
                            onChange={setOneClickTrading}
                        />
                    </div>

                    <div className="sticky top-0 z-20 shrink-0  bg-surface ">
                        <div className="grid grid-cols-2 gap-2">
                            <QuoteCard label="Bid" value={selectedSymbol.bid} tone="danger" />
                            <QuoteCard label="Ask" value={selectedSymbol.ask} tone="success" />
                        </div>
                    </div>
                    <div>
                        <p className="mb-1.5 text-[11px] font-medium text-text-muted">
                            Order Type
                        </p>

                        <div className="grid grid-cols-3 gap-1.5">
                            {(["market", "limit", "stop"] as OrderType[]).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setValue("orderType", type)}
                                    className={cn(
                                        "rounded-md border px-2 py-1.5 text-[11px] font-medium capitalize transition active:scale-95",
                                        watchedOrderType === type
                                            ? "border-primary bg-primary text-white"
                                            : "border-border bg-card text-text-secondary hover:bg-card-hover"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="mb-1.5 text-[11px] font-medium text-text-muted">
                            Direction
                        </p>

                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setValue("side", "buy");
                                    if (oneClickTrading && !isPlacingOrder) submitOrder("buy");
                                }}
                                disabled={isPlacingOrder}
                                className={cn(
                                    "rounded-lg border py-2 text-xs font-semibold transition active:scale-95",
                                    watchedSide === "buy"
                                        ? "border-success bg-success text-white"
                                        : "border-border bg-card text-success hover:bg-card-hover"
                                )}
                            >
                                Buy
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setValue("side", "sell");
                                    if (oneClickTrading && !isPlacingOrder) submitOrder("sell");
                                }}
                                disabled={isPlacingOrder}
                                className={cn(
                                    "rounded-lg border py-2 text-xs font-semibold transition active:scale-95",
                                    watchedSide === "sell"
                                        ? "border-danger bg-danger text-white"
                                        : "border-border bg-card text-danger hover:bg-card-hover"
                                )}
                            >
                                Sell
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="mb-1.5 text-[11px] font-medium text-text-muted">
                            Leverage
                        </p>

                        <div className="grid grid-cols-4 gap-1.5">
                            {LEVERAGE_OPTIONS.map((lev) => (
                                <button
                                    key={lev}
                                    type="button"
                                    onClick={() => setLeverage(lev)}
                                    className={cn(
                                        "rounded-md border px-2 py-1.5 text-[11px] font-medium transition active:scale-95",
                                        leverage === lev
                                            ? "border-primary bg-primary text-white"
                                            : "border-border bg-card text-text-secondary hover:bg-card-hover"
                                    )}
                                >
                                    {lev}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <p className="text-[11px] font-medium text-text-muted">
                                Lot Size
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => adjustLot(-0.01)}
                                    className="flex h-5 w-5 items-center justify-center rounded-md border border-border text-text-secondary transition hover:bg-card-hover active:scale-90"
                                >
                                    <span className="material-symbols-outlined text-[14px]">
                                        remove
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => adjustLot(0.01)}
                                    className="flex h-5 w-5 items-center justify-center rounded-md border border-border text-text-secondary transition hover:bg-card-hover active:scale-90"
                                >
                                    <span className="material-symbols-outlined text-[14px]">
                                        add
                                    </span>
                                </button>
                            </div>
                        </div>

                        <input
                            {...register("lot", {
                                required: "Lot size is required",
                                validate: (value) => {
                                    const num = Number(value);

                                    if (Number.isNaN(num)) return "Invalid lot size";
                                    if (num <= 0) return "Lot must be greater than 0";
                                    if (num > 100) return "Lot cannot be greater than 100";

                                    return true;
                                },
                            })}
                            className={cn(
                                "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-text outline-none transition placeholder:text-text-muted focus:border-primary",
                                errors.lot && "border-danger focus:border-danger"
                            )}
                        />

                        {errors.lot && (
                            <p className="mt-1 text-[10px] font-medium text-danger">
                                {errors.lot.message}
                            </p>
                        )}

                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {LOT_PRESETS.map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setValue("lot", String(val))}
                                    className={cn(
                                        "rounded-md border px-2 py-1 text-[10px] font-medium transition active:scale-95",
                                        Number(watchedLot) === val
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border bg-card text-text-secondary hover:border-primary/40 hover:text-primary"
                                    )}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium text-text">SL / TP</p>
                                <p className="text-[10px] text-text-muted">
                                    Add stop loss and take profit
                                </p>
                            </div>
                            <ToggleSwitch
                                checked={showSltpInputs}
                                onChange={setShowSltpInputs}
                            />
                        </div>

                        {showSltpInputs && (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <Input
                                    label="Stop Loss"
                                    placeholder="Optional"
                                    register={register}
                                />
                                <Input
                                    label="Take Profit"
                                    placeholder="Optional"
                                    register={register}
                                />
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-border bg-card p-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                            Risk Preview
                        </p>

                        <PreviewRow
                            label="Required Margin"
                            value={`$${marginPreview.toFixed(2)}`}
                        />
                        <PreviewRow label="Leverage" value={leverage} />
                        <PreviewRow label="Spread" value={`${selectedSymbol.spread}`} />
                        <PreviewRow label="Execution" value={watchedOrderType.toUpperCase()} />
                        <PreviewRow label="Stop-out Level" value="30%" danger />
                    </div>
                </div>

                <div className="sticky bottom-0 z-10 border-t border-border bg-surface p-3">
                    <button
                        type="submit"
                        disabled={isPlacingOrder}
                        className={cn(
                            "w-full rounded-lg py-2.5 text-xs font-bold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-70",
                            watchedSide === "buy"
                                ? "bg-success hover:bg-success/90"
                                : "bg-danger hover:bg-danger/90"
                        )}
                    >
                        {isPlacingOrder
                            ? "Placing Order..."
                            : `${watchedSide === "buy" ? "Buy" : "Sell"} ${selectedSymbol.symbol}`}
                    </button>
                </div>
            </form>
        </aside>
    );
}

function ToggleSwitch({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                "relative h-5 w-9 shrink-0 rounded-full transition",
                checked ? "bg-primary" : "bg-border"
            )}
        >
            <span
                className={cn(
                    "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                    checked && "translate-x-4"
                )}
            />
        </button>
    );
}

export function QuoteCard({
    label,
    value,
    tone,
    maxPoints = 20,
}: {
    label: string;
    value: number;
    tone: "success" | "danger";
    maxPoints?: number;
}) {
    const { history } = useSparklineHistory(value, maxPoints);

    const chartPoints = createSparklinePoints(history, 90, 28, 5);

    const firstValue = history[0];
    const lastValue = history[history.length - 1];

    const chartTone =
        lastValue > firstValue
            ? "success"
            : lastValue < firstValue
                ? "danger"
                : "neutral";

    return (
        <div className="rounded-lg border border-border bg-card p-2.5">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-[11px] text-text-muted">{label}</p>

                    <p
                        className={cn(
                            "mt-0.5 truncate text-sm font-bold",
                            tone === "success" ? "text-success" : "text-danger"
                        )}
                    >
                        {value}
                    </p>
                </div>

                <div className="h-7 w-12.5 shrink-0 overflow-hidden">
                    <svg
                        viewBox="0 0 90 28"
                        className={cn(
                            "h-full w-full",
                            chartTone === "success" && "text-success",
                            chartTone === "danger" && "text-danger",
                            chartTone === "neutral" && "text-text-muted"
                        )}
                        preserveAspectRatio="none"
                    >
                        <polyline
                            points={chartPoints}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

function PreviewRow({
    label,
    value,
    danger,
}: {
    label: string;
    value: string;
    danger?: boolean;
}) {
    return (
        <div className="mb-1.5 flex items-center justify-between last:mb-0">
            <span className="text-[11px] text-text-muted">{label}</span>
            <span
                className={cn(
                    "text-[11px] font-semibold text-text",
                    danger && "text-danger"
                )}
            >
                {value}
            </span>
        </div>
    );
}
