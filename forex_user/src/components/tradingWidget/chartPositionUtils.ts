import type { LiveProfit } from "../../constant/SocketProvider";
import type { OrderListInterface, SymbolDetail } from "../../interface/interface";

export type PositionLineGroup = {
    position?: string;
    sl?: string;
    target?: string;
};

export type ChartPositionRow = {
    trade: OrderListInterface;
    symbol: string;
    price: number;
    pnl: number;
    top: number;
    slPrice?: number;
    slTop?: number;
    targetPrice?: number;
    targetTop?: number;
};

export type ProtectionKind = "sl" | "target";

export type ProtectionDragState = {
    trade: OrderListInterface;
    kind: ProtectionKind;
    shapeId?: string;
};

export type ProtectionPlacementState = {
    trade: OrderListInterface;
    kind: ProtectionKind;
    top: number;
    price: number | null;
};

export type PositionOverlayOffset = {
    x: number;
    y: number;
};

export function cn(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function normalizeSymbol(symbol?: string | null) {
    return (symbol ?? "").replace(/^[A-Z]+:/i, "").toUpperCase();
}

export function resolveTradeSymbolName(
    tradeSymbol: string,
    symbols: SymbolDetail[]
) {
    const matchedSymbol = symbols.find(
        (symbol) =>
            symbol._id === tradeSymbol ||
            normalizeSymbol(symbol.symbol_name) === normalizeSymbol(tradeSymbol)
    );

    return matchedSymbol?.symbol_name ?? tradeSymbol;
}

export function isNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}

export function formatPrice(value: number) {
    return value.toFixed(5).replace(/\.?0+$/, "");
}

export function getTradePrice(trade: OrderListInterface) {
    return Number(
        trade.avg ??
        (trade.bs === "Buy" ? trade.entryAsk : trade.entryBid) ??
        trade.entryAsk ??
        trade.entryBid
    );
}

export function getLivePnl(
    trade: OrderListInterface,
    liveProfit?: Map<string, LiveProfit>
) {
    const keys = [
        trade._id,
        trade.transactionId,
        ...(trade.execution_id ?? []),
    ].filter(Boolean);

    for (const key of keys) {
        const pnl = liveProfit?.get(String(key))?.pnl;
        if (typeof pnl === "number" && Number.isFinite(pnl)) {
            return pnl;
        }
    }

    return Number(trade.profitLossAmount ?? 0);
}
export const getContractSize = (market: string, lot: number, s: string): number => {
    switch (market.toLowerCase()) {
        case "forex":
            return lot * 100000;
        case "crypto":
        case "stock":
            return lot * 1;
        case "indices":
            return lot * 10;
        case "cfd":
            switch (s) {
                case "XAUUSD":
                case "XAUEUR":
                case "XPTUSD":
                case "XPDUSD":
                    return lot * 100;
                case "XAGUSD":
                    return lot * 5000;
                case "WTI":
                case "WTIcash":
                case "BRENT":
                case "BRENTcash":
                    return lot * 1000;
                case "NGAS":
                case "NGAScash":
                    return lot * 10000;
                case "WHEATcash":
                    return lot * 5000;
                case "COFFEEcash":
                    return lot * 37500;
                case "COPPER":
                    return lot * 25000;
                default:
                    throw new Error(`Unknown CFD symbol: ${s}`);
            }
        default:
            throw new Error(`Unknown market type: ${market}`);
    }
};
export function estimatePnlAtPrice(
    trade: OrderListInterface,
    price: number
) {
    const entryPrice = getTradePrice(trade);
    if (!Number.isFinite(entryPrice) || !Number.isFinite(price)) {
        return 0;
    }
    const direction = trade.bs === "Buy" ? 1 : -1;
    return (price - entryPrice) * direction * getContractSize(trade.market, Number(trade.lot || 0), trade.symbol);
}

export function formatPnl(value: number) {
    const prefix = value >= 0 ? "+" : "";

    return `${prefix}$${value.toFixed(2)}`;
}

export function removeShape(chart: any, entityId?: string) {
    if (!entityId) return;

    try {
        chart.removeEntity(entityId);
    } catch { }
}

export function clearLineGroup(
    chart: any,
    group: PositionLineGroup
) {
    removeShape(chart, group.position);
    removeShape(chart, group.sl);
    removeShape(chart, group.target);
}

export function getActiveChart(widget: any) {
    if (!widget) return null;

    try {
        return widget.activeChart?.() ?? null;
    } catch {
        return null;
    }
}

export function executeWidgetAction(widget: any, actionId: string) {
    if (!widget) return;

    try {
        widget.executeActionById?.(actionId);
    } catch {
        try {
            getActiveChart(widget)?.executeActionById?.(actionId);
        } catch { }
    }
}

export function getShapeAnchorTime(chart: any) {
    try {
        const range = chart.getVisibleRange?.();
        const from = Number(range?.from);
        const to = Number(range?.to);

        if (Number.isFinite(from) && Number.isFinite(to) && to > from) {
            return Math.floor(from + (to - from) * 0.75);
        }
    } catch { }

    return Math.floor(Date.now() / 1000);
}

function getMainPriceScale(chart: any) {
    try {
        return chart.getPanes?.()[0]?.getMainSourcePriceScale?.() ?? null;
    } catch { }

    return null;
}

export function getPriceTopOffset(
    chart: any,
    price: number,
    container: HTMLDivElement | null
) {
    const priceScale = getMainPriceScale(chart);
    const range = priceScale?.getVisiblePriceRange?.();
    const height = chart.getPanes?.()[0]?.getHeight?.() ?? container?.clientHeight ?? 0;
    const from = Number(range?.from);
    const to = Number(range?.to);

    if (!height || !Number.isFinite(from) || !Number.isFinite(to) || from === to) {
        return null;
    }

    const min = Math.min(from, to);
    const max = Math.max(from, to);

    if (price < min || price > max) {
        return null;
    }

    const offset = ((max - price) / (max - min)) * height;

    return Math.min(height - 18, Math.max(18, offset));
}

export function getPriceFromTopOffset(
    chart: any,
    top: number,
    container: HTMLDivElement | null
) {
    const priceScale = getMainPriceScale(chart);
    const range = priceScale?.getVisiblePriceRange?.();
    const height = chart.getPanes?.()[0]?.getHeight?.() ?? container?.clientHeight ?? 0;
    const from = Number(range?.from);
    const to = Number(range?.to);

    if (!height || !Number.isFinite(from) || !Number.isFinite(to) || from === to) {
        return null;
    }

    const min = Math.min(from, to);
    const max = Math.max(from, to);
    const clampedTop = Math.min(height, Math.max(0, top));

    return max - (clampedTop / height) * (max - min);
}

export function getLineColor(isBuy: boolean) {
    return isBuy ? getThemeColor("--color-success", "#16a34a") : getThemeColor("--color-danger", "#ef4444");
}

export function getThemeColor(variableName: string, fallback: string) {
    if (typeof window === "undefined") {
        return fallback;
    }

    const value = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();

    return value || fallback;
}

export function clampOverlayOffset(
    offset: PositionOverlayOffset,
    container: HTMLDivElement | null
) {
    const width = container?.clientWidth ?? 0;
    const height = container?.clientHeight ?? 0;

    return {
        x: Math.min(width - 24, Math.max(8, offset.x)),
        y: Math.min(height - 16, Math.max(16, offset.y)),
    };
}

export function arePositionRowsEqual(
    currentRows: ChartPositionRow[],
    nextRows: ChartPositionRow[]
) {
    if (currentRows.length !== nextRows.length) {
        return false;
    }

    return currentRows.every((currentRow, index) => {
        const nextRow = nextRows[index];

        return (
            currentRow.trade._id === nextRow.trade._id &&
            currentRow.top === nextRow.top &&
            currentRow.pnl === nextRow.pnl &&
            currentRow.price === nextRow.price &&
            currentRow.slPrice === nextRow.slPrice &&
            currentRow.slTop === nextRow.slTop &&
            currentRow.targetPrice === nextRow.targetPrice &&
            currentRow.targetTop === nextRow.targetTop
        );
    });
}
