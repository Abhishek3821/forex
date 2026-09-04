import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { LiveProfit } from "../constant/SocketProvider";
import type { OrderListInterface, SymbolDetail } from "../interface/interface";
import {
    arePositionRowsEqual,
    clampOverlayOffset,
    clearLineGroup,
    getActiveChart,
    getLineColor,
    getLivePnl,
    getPriceFromTopOffset,
    getPriceTopOffset,
    getShapeAnchorTime,
    getThemeColor,
    getTradePrice,
    isNumber,
    normalizeSymbol,
    resolveTradeSymbolName,
    type ChartPositionRow,
    type PositionLineGroup,
    type PositionOverlayOffset,
    type ProtectionDragState,
    type ProtectionKind,
    type ProtectionPlacementState,
} from "../components/tradingWidget/chartPositionUtils";

type UseChartPositionOverlayArgs = {
    widgetRef: RefObject<any>;
    containerRef: RefObject<HTMLDivElement | null>;
    symbol?: string | null;
    positions: OrderListInterface[];
    symbols: SymbolDetail[];
    liveProfit?: Map<string, LiveProfit>;
    isChartReady: boolean;
    onUpdateProtection?: (
        trade: OrderListInterface,
        values: { sl?: number; target?: number }
    ) => void;
};

export function useChartPositionOverlay({
    widgetRef,
    containerRef,
    symbol,
    positions,
    symbols,
    liveProfit,
    isChartReady,
    onUpdateProtection,
}: UseChartPositionOverlayArgs) {
    const [chartPositionRows, setChartPositionRows] = useState<ChartPositionRow[]>([]);
    const positionLinesRef = useRef<Map<string, PositionLineGroup>>(new Map());
    const dragStateRef = useRef<ProtectionDragState | null>(null);
    const [positionOverlayOffsets, setPositionOverlayOffsets] =
        useState<Map<string, PositionOverlayOffset>>(() => new Map());
    const [protectionPlacement, setProtectionPlacement] =
        useState<ProtectionPlacementState | null>(null);

    useEffect(() => {
        if (!widgetRef.current || !isChartReady || !symbol) {
            return;
        }

        let cancelled = false;
        const chart = getActiveChart(widgetRef.current);

        if (!chart) {
            return;
        }

        const chartSymbol = normalizeSymbol(symbol);

        const getVisiblePositions = () =>
            positions.filter((trade) => {
                const tradePrice = getTradePrice(trade);
                const tradeSymbol = resolveTradeSymbolName(trade.symbol, symbols);

                return (
                    trade.status?.toLowerCase() === "open" &&
                    normalizeSymbol(tradeSymbol) === chartSymbol &&
                    Number.isFinite(tradePrice)
                );
            });

        const syncPositionOverlay = () => {
            const nextRows = getVisiblePositions().reduce<ChartPositionRow[]>(
                (rows, trade) => {
                    const price = getTradePrice(trade);
                    const top = getPriceTopOffset(chart, price, containerRef.current);

                    if (top === null) {
                        return rows;
                    }

                    rows.push({
                        trade,
                        symbol: resolveTradeSymbolName(trade.symbol, symbols),
                        price,
                        pnl: getLivePnl(trade, liveProfit),
                        top,
                        slPrice: isNumber(trade.sl) ? trade.sl : undefined,
                        slTop: isNumber(trade.sl)
                            ? getPriceTopOffset(chart, trade.sl, containerRef.current) ?? undefined
                            : undefined,
                        targetPrice: isNumber(trade.target) ? trade.target : undefined,
                        targetTop: isNumber(trade.target)
                            ? getPriceTopOffset(chart, trade.target, containerRef.current) ?? undefined
                            : undefined,
                    });

                    return rows;
                },
                []
            );

            setChartPositionRows((currentRows) =>
                arePositionRowsEqual(currentRows, nextRows)
                    ? currentRows
                    : nextRows
            );
        };

        const createHorizontalLine = async (
            price: number,
            color: string,
            text?: string,
            editable = false
        ) => {
            const entityId = await chart.createShape(
                {
                    time: getShapeAnchorTime(chart),
                    price,
                },
                {
                    shape: "horizontal_line",
                    lock: !editable,
                    disableSelection: !editable,
                    disableSave: true,
                    disableUndo: true,
                    text,
                    zOrder: "top",
                    overrides: {
                        linecolor: color,
                        linewidth: editable ? 2 : 1,
                        linestyle: editable ? 1 : 2,
                        showLabel: Boolean(text),
                    },
                }
            );

            return entityId;
        };

        const syncPositionLines = async () => {
            const visiblePositions = getVisiblePositions();
            const visibleIds = new Set(visiblePositions.map((trade) => trade._id));

            positionLinesRef.current.forEach((group, tradeId) => {
                if (!visibleIds.has(tradeId)) {
                    clearLineGroup(chart, group);
                    positionLinesRef.current.delete(tradeId);
                }
            });

            setPositionOverlayOffsets((currentOffsets) => {
                let changed = false;
                const nextOffsets = new Map(currentOffsets);

                nextOffsets.forEach((_, tradeId) => {
                    if (!visibleIds.has(tradeId)) {
                        nextOffsets.delete(tradeId);
                        changed = true;
                    }
                });

                return changed ? nextOffsets : currentOffsets;
            });

            for (const trade of visiblePositions) {
                if (cancelled) return;

                const oldGroup = positionLinesRef.current.get(trade._id);

                if (oldGroup) {
                    clearLineGroup(chart, oldGroup);
                }

                const group: PositionLineGroup = {};
                const tradePrice = getTradePrice(trade);
                const isBuy = trade.bs === "Buy";

                group.position = await createHorizontalLine(
                    tradePrice,
                    getLineColor(isBuy)
                );

                if (cancelled) return;

                if (isNumber(trade.sl)) {
                    group.sl = await createHorizontalLine(
                        trade.sl,
                        getThemeColor("--color-danger", "#ef4444"),
                        undefined,
                        true
                    );
                }

                if (cancelled) return;

                if (isNumber(trade.target)) {
                    group.target = await createHorizontalLine(
                        trade.target,
                        getThemeColor("--color-success", "#16a34a"),
                        undefined,
                        true
                    );
                }

                if (cancelled) return;

                positionLinesRef.current.set(trade._id, group);
            }

            syncPositionOverlay();
        };

        const runWhenDataReady = () => {
            chart.dataReady(() => {
                if (cancelled) return;

                void syncPositionLines().catch(() => {
                    if (cancelled) return;

                    chart.onDataLoaded?.().subscribe(
                        null,
                        () => {
                            if (!cancelled) {
                                void syncPositionLines();
                            }
                        },
                        true
                    );
                });
            });
        };

        runWhenDataReady();

        const handleVisibleRangeChange = () => {
            if (!cancelled) {
                syncPositionOverlay();
            }
        };

        chart.onVisibleRangeChanged?.().subscribe(null, handleVisibleRangeChange);
        window.addEventListener("resize", handleVisibleRangeChange);

        const overlaySyncInterval = window.setInterval(handleVisibleRangeChange, 250);

        return () => {
            cancelled = true;
            chart.onVisibleRangeChanged?.().unsubscribe(null, handleVisibleRangeChange);
            window.removeEventListener("resize", handleVisibleRangeChange);
            window.clearInterval(overlaySyncInterval);
            setChartPositionRows([]);
        };
    }, [
        symbol,
        positions,
        liveProfit,
        isChartReady,
        symbols,
        widgetRef,
        containerRef,
    ]);

    const updateProtectionShape = useCallback(
        (shapeId: string | undefined, price: number) => {
            const chart = getActiveChart(widgetRef.current);

            if (!shapeId || !chart) {
                return;
            }

            try {
                chart.getShapeById(shapeId).setPoints([
                    {
                        time: getShapeAnchorTime(chart),
                        price,
                    },
                ]);
            } catch { }
        },
        [widgetRef]
    );

    const startProtectionDrag = useCallback(
        (
            event: ReactPointerEvent<HTMLButtonElement>,
            trade: OrderListInterface,
            kind: ProtectionKind
        ) => {
            const chart = getActiveChart(widgetRef.current);

            if (!chart || !onUpdateProtection) {
                return;
            }

            const group = positionLinesRef.current.get(trade._id);
            const shapeId = kind === "sl" ? group?.sl : group?.target;

            dragStateRef.current = {
                trade,
                kind,
                shapeId,
            };

            event.currentTarget.setPointerCapture(event.pointerId);
            let frameId: number | null = null;
            let pendingClientY = event.clientY;

            const moveProtection = (clientY: number) => {
                const rect = containerRef.current?.getBoundingClientRect();

                if (!rect) {
                    return null;
                }

                const top = clientY - rect.top;
                const price = getPriceFromTopOffset(chart, top, containerRef.current);

                if (price === null) {
                    return null;
                }

                const roundedPrice = Number(price.toFixed(5));

                updateProtectionShape(shapeId, roundedPrice);

                setChartPositionRows((rows) =>
                    rows.map((row) => {
                        if (row.trade._id !== trade._id) {
                            return row;
                        }

                        return kind === "sl"
                            ? {
                                ...row,
                                slPrice: roundedPrice,
                                slTop: Math.min(rect.height - 18, Math.max(18, top)),
                            }
                            : {
                                ...row,
                                targetPrice: roundedPrice,
                                targetTop: Math.min(rect.height - 18, Math.max(18, top)),
                            };
                    })
                );

                return roundedPrice;
            };

            let nextPrice = moveProtection(event.clientY);

            const scheduleMove = () => {
                if (frameId !== null) {
                    return;
                }

                frameId = window.requestAnimationFrame(() => {
                    frameId = null;
                    const movedPrice = moveProtection(pendingClientY);

                    if (movedPrice !== null) {
                        nextPrice = movedPrice;
                    }
                });
            };

            const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
                pendingClientY = moveEvent.clientY;
                scheduleMove();
            };

            const finishDrag = () => {
                if (frameId !== null) {
                    window.cancelAnimationFrame(frameId);
                    frameId = null;
                    const movedPrice = moveProtection(pendingClientY);

                    if (movedPrice !== null) {
                        nextPrice = movedPrice;
                    }
                }

                window.removeEventListener("pointermove", handlePointerMove);
                window.removeEventListener("pointerup", finishDrag);
                window.removeEventListener("pointercancel", finishDrag);

                const activeDrag = dragStateRef.current;
                dragStateRef.current = null;

                if (activeDrag && nextPrice !== null && Number.isFinite(nextPrice)) {
                    onUpdateProtection(
                        trade,
                        kind === "sl" ? { sl: nextPrice } : { target: nextPrice }
                    );
                }
            };

            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", finishDrag);
            window.addEventListener("pointercancel", finishDrag);
        },
        [
            containerRef,
            onUpdateProtection,
            updateProtectionShape,
            widgetRef,
        ]
    );

    const startProtectionPlacement = useCallback(
        (
            event: ReactPointerEvent<HTMLButtonElement>,
            trade: OrderListInterface,
            kind: ProtectionKind,
            fallbackTop: number
        ) => {
            event.preventDefault();
            event.stopPropagation();

            const chart = getActiveChart(widgetRef.current);
            const rect = containerRef.current?.getBoundingClientRect();

            if (!chart || !rect || !onUpdateProtection) {
                return;
            }

            let frameId: number | null = null;
            let latestClientY = rect.top + fallbackTop;
            const startClientX = event.clientX;
            const startClientY = event.clientY;
            let hasDragged = false;
            let nextPrice: number | null = null;

            const updateFromClientY = (clientY: number) => {
                const currentRect = containerRef.current?.getBoundingClientRect();

                if (!currentRect) {
                    return;
                }

                const top = Math.min(
                    currentRect.height - 18,
                    Math.max(18, clientY - currentRect.top)
                );
                const price = getPriceFromTopOffset(chart, top, containerRef.current);

                nextPrice = price === null ? null : Number(price.toFixed(5));

                setProtectionPlacement({
                    trade,
                    kind,
                    top,
                    price: nextPrice,
                });
            };

            const scheduleUpdate = () => {
                if (frameId !== null) {
                    return;
                }

                frameId = window.requestAnimationFrame(() => {
                    frameId = null;
                    updateFromClientY(latestClientY);
                });
            };

            const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
                if (
                    Math.abs(moveEvent.clientX - startClientX) > 3 ||
                    Math.abs(moveEvent.clientY - startClientY) > 3
                ) {
                    hasDragged = true;
                }

                latestClientY = moveEvent.clientY;
                scheduleUpdate();
            };

            const cancelPlacement = () => {
                if (frameId !== null) {
                    window.cancelAnimationFrame(frameId);
                }

                window.removeEventListener("pointermove", handlePointerMove);
                window.removeEventListener("pointerup", finishPlacement);
                window.removeEventListener("pointercancel", cancelPlacement);
                setProtectionPlacement(null);
            };

            const finishPlacement = () => {
                if (frameId !== null) {
                    window.cancelAnimationFrame(frameId);
                    frameId = null;
                }

                updateFromClientY(latestClientY);

                window.removeEventListener("pointermove", handlePointerMove);
                window.removeEventListener("pointerup", finishPlacement);
                window.removeEventListener("pointercancel", cancelPlacement);

                if (!hasDragged) {
                    return;
                }

                if (nextPrice !== null) {
                    onUpdateProtection(
                        trade,
                        kind === "sl" ? { sl: nextPrice } : { target: nextPrice }
                    );
                }

                setProtectionPlacement(null);
            };

            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromClientY(latestClientY);

            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", finishPlacement);
            window.addEventListener("pointercancel", cancelPlacement);
        },
        [
            containerRef,
            onUpdateProtection,
            widgetRef,
        ]
    );

    const updateProtectionPlacement = useCallback(
        (clientY: number) => {
            const chart = getActiveChart(widgetRef.current);
            const rect = containerRef.current?.getBoundingClientRect();

            if (!chart || !rect) {
                return;
            }

            const top = Math.min(rect.height - 18, Math.max(18, clientY - rect.top));
            const price = getPriceFromTopOffset(chart, top, containerRef.current);

            if (price === null) {
                return;
            }

            setProtectionPlacement((current) =>
                current
                    ? {
                        ...current,
                        top,
                        price: Number(price.toFixed(5)),
                    }
                    : current
            );
        },
        [
            containerRef,
            widgetRef,
        ]
    );

    const commitProtectionPlacement = useCallback(
        (clientY?: number) => {
            if (!protectionPlacement || !onUpdateProtection) {
                return;
            }

            let nextPrice = protectionPlacement.price;

            if (typeof clientY === "number") {
                const chart = getActiveChart(widgetRef.current);
                const rect = containerRef.current?.getBoundingClientRect();

                if (chart && rect) {
                    const top = Math.min(rect.height - 18, Math.max(18, clientY - rect.top));
                    const price = getPriceFromTopOffset(chart, top, containerRef.current);

                    if (price !== null) {
                        nextPrice = Number(price.toFixed(5));
                    }
                }
            }

            if (nextPrice === null) {
                return;
            }

            onUpdateProtection(
                protectionPlacement.trade,
                protectionPlacement.kind === "sl"
                    ? { sl: nextPrice }
                    : { target: nextPrice }
            );

            setProtectionPlacement(null);
        },
        [
            containerRef,
            onUpdateProtection,
            protectionPlacement,
            widgetRef,
        ]
    );

    useEffect(() => {
        if (!protectionPlacement) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setProtectionPlacement(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [protectionPlacement]);

    const startPositionOverlayDrag = useCallback(
        (
            event: ReactPointerEvent<HTMLDivElement>,
            tradeId: string,
            fallbackTop: number
        ) => {
            const rect = containerRef.current?.getBoundingClientRect();

            if (!rect) {
                return;
            }

            const existingOffset = positionOverlayOffsets.get(tradeId) ?? {
                x: rect.width - 260,
                y: fallbackTop,
            };
            const startX = event.clientX;
            const startY = event.clientY;

            event.currentTarget.setPointerCapture(event.pointerId);

            const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
                const nextOffset = clampOverlayOffset(
                    {
                        x: existingOffset.x + moveEvent.clientX - startX,
                        y: existingOffset.y + moveEvent.clientY - startY,
                    },
                    containerRef.current
                );

                setPositionOverlayOffsets((currentOffsets) => {
                    const nextOffsets = new Map(currentOffsets);
                    nextOffsets.set(tradeId, nextOffset);

                    return nextOffsets;
                });
            };

            const finishDrag = () => {
                window.removeEventListener("pointermove", handlePointerMove);
                window.removeEventListener("pointerup", finishDrag);
                window.removeEventListener("pointercancel", finishDrag);
            };

            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", finishDrag);
            window.addEventListener("pointercancel", finishDrag);
        },
        [
            containerRef,
            positionOverlayOffsets,
        ]
    );

    return {
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
    };
}
