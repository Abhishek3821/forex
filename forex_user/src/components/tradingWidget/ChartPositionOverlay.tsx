import { motion } from "framer-motion";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { OrderListInterface } from "../../interface/interface";
import type {
    ChartPositionRow,
    PositionOverlayOffset,
    ProtectionKind,
    ProtectionPlacementState,
} from "./chartPositionUtils";
import {
    clampOverlayOffset,
    cn,
    estimatePnlAtPrice,
    formatPnl,
    formatPrice,
} from "./chartPositionUtils";

type ChartPositionOverlayProps = {
    theme: "dark" | "light";
    containerRef: RefObject<HTMLDivElement | null>;
    rows: ChartPositionRow[];
    positionOverlayOffsets: Map<string, PositionOverlayOffset>;
    protectionPlacement: ProtectionPlacementState | null;
    setProtectionPlacement: (placement: ProtectionPlacementState | null) => void;
    updateProtectionPlacement: (clientY: number) => void;
    commitProtectionPlacement: (clientY?: number) => void;
    startProtectionDrag: (
        event: ReactPointerEvent<HTMLButtonElement>,
        trade: OrderListInterface,
        kind: ProtectionKind
    ) => void;
    startProtectionPlacement: (
        event: ReactPointerEvent<HTMLButtonElement>,
        trade: OrderListInterface,
        kind: ProtectionKind,
        fallbackTop: number
    ) => void;
    startPositionOverlayDrag: (
        event: ReactPointerEvent<HTMLDivElement>,
        tradeId: string,
        fallbackTop: number
    ) => void;
    onClosePosition?: (trade: OrderListInterface) => void;
    updatingProtectionTradeId?: string;
    updatingProtectionKind?: ProtectionKind;
    closingTradeId?: string;
};

function Spinner({ className }: { className?: string }) {
    return (
        <span
            className={cn(
                "block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent",
                className
            )}
        />
    );
}

const orderAccentColors = [
    "#0A84FF",
    "#8B5CF6",
    "#F59E0B",
    "#14B8A6",
    "#EC4899",
    "#84CC16",
];

export function ChartPositionOverlay({
    theme,
    containerRef,
    rows,
    positionOverlayOffsets,
    protectionPlacement,
    setProtectionPlacement,
    updateProtectionPlacement,
    commitProtectionPlacement,
    startProtectionDrag,
    startProtectionPlacement,
    startPositionOverlayDrag,
    onClosePosition,
    updatingProtectionTradeId,
    updatingProtectionKind,
    closingTradeId,
}: ChartPositionOverlayProps) {
    return (
        <div
            className={cn(
                "absolute inset-0 z-10",
                protectionPlacement
                    ? "pointer-events-auto cursor-crosshair"
                    : "pointer-events-none"
            )}
            onPointerMove={(event) => {
                if (protectionPlacement) {
                    updateProtectionPlacement(event.clientY);
                }
            }}
            onPointerDown={(event) => {
                if (!protectionPlacement || event.button !== 0) {
                    return;
                }

                if ((event.target as HTMLElement).closest("[data-position-control]")) {
                    return;
                }

                event.preventDefault();
                commitProtectionPlacement(event.clientY);
            }}
            onContextMenu={(event) => {
                if (!protectionPlacement) {
                    return;
                }

                event.preventDefault();
                setProtectionPlacement(null);
            }}
        >
            {rows.map((row, index) => {
                const isBuy = row.trade.bs === "Buy";
                const pnlPositive = row.pnl >= 0;
                const toneClasses = isBuy
                    ? "bg-success/85 text-white"
                    : "bg-danger/85 text-white";
                const positionClasses = theme === "dark"
                    ? "border-border-light/45 bg-card/70 text-text shadow-black/25"
                    : "border-border-light/55 bg-card/75 text-text shadow-slate-300/25";
                const mutedText = theme === "dark"
                    ? "text-text-secondary"
                    : "text-text-secondary";
                const protectionClasses = theme === "dark"
                    ? "border-border-light/45 bg-card/80 text-text shadow-black/25"
                    : "border-border-light/55 bg-card/85 text-text shadow-slate-300/25";
                const defaultOverlayOffset = clampOverlayOffset(
                    {
                        x: (containerRef.current?.clientWidth ?? 320) - 250,
                        y: row.top,
                    },
                    containerRef.current
                );
                const overlayOffset =
                    positionOverlayOffsets.get(row.trade._id) ??
                    defaultOverlayOffset;
                const chartWidth = containerRef.current?.clientWidth ?? 0;
                const connectorX = chartWidth
                    ? Math.min(chartWidth - 12, Math.max(12, overlayOffset.x + 12))
                    : overlayOffset.x + 12;
                const badgeAnchorX = chartWidth
                    ? Math.min(chartWidth - 14, Math.max(14, overlayOffset.x + 8))
                    : overlayOffset.x + 8;
                const protectionAnchorX = chartWidth ? chartWidth / 2 : connectorX;
                const successColor = "var(--color-success)";
                const dangerColor = "var(--color-danger)";
                const connectorColor = isBuy ? successColor : dangerColor;
                const orderAccentColor =
                    orderAccentColors[index % orderAccentColors.length];
                const pnlIcon = pnlPositive ? "trending_up" : "trending_down";
                const pnlClasses = pnlPositive
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger";
                const isPlacingSl =
                    protectionPlacement?.trade._id === row.trade._id &&
                    protectionPlacement.kind === "sl";
                const isPlacingTarget =
                    protectionPlacement?.trade._id === row.trade._id &&
                    protectionPlacement.kind === "target";
                const isUpdatingSl =
                    updatingProtectionTradeId === row.trade._id &&
                    updatingProtectionKind === "sl";
                const isUpdatingTarget =
                    updatingProtectionTradeId === row.trade._id &&
                    updatingProtectionKind === "target";
                const isClosing = closingTradeId === row.trade._id;
                const slPnl =
                    row.slPrice === undefined
                        ? undefined
                        : estimatePnlAtPrice(row.trade, row.slPrice);
                const targetPnl =
                    row.targetPrice === undefined
                        ? undefined
                        : estimatePnlAtPrice(row.trade, row.targetPrice);
                const placingPnl =
                    protectionPlacement?.price === null ||
                        protectionPlacement?.price === undefined
                        ? null
                        : estimatePnlAtPrice(row.trade, protectionPlacement.price);

                return (
                    <div key={row.trade._id}>
                        <svg
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                        >
                            <line
                                x1="0"
                                y1={row.top}
                                x2="100%"
                                y2={row.top}
                                stroke={connectorColor}
                                strokeWidth="1"
                                strokeDasharray="6 5"
                                opacity="0.32"
                            />

                            {row.slTop !== undefined && (
                                <line
                                    x1="0"
                                    y1={row.slTop}
                                    x2="100%"
                                    y2={row.slTop}
                                    stroke={dangerColor}
                                    strokeWidth="1"
                                    strokeDasharray="3 5"
                                    opacity="0.42"
                                />
                            )}

                            {row.targetTop !== undefined && (
                                <line
                                    x1="0"
                                    y1={row.targetTop}
                                    x2="100%"
                                    y2={row.targetTop}
                                    stroke={successColor}
                                    strokeWidth="1"
                                    strokeDasharray="3 5"
                                    opacity="0.42"
                                />
                            )}

                            {(isPlacingSl || isPlacingTarget) && (
                                <line
                                    x1="0"
                                    y1={protectionPlacement?.top ?? row.top}
                                    x2="100%"
                                    y2={protectionPlacement?.top ?? row.top}
                                    stroke={isPlacingSl ? dangerColor : successColor}
                                    strokeWidth="1.5"
                                    strokeDasharray="5 4"
                                    opacity="0.88"
                                />
                            )}
                        </svg>

                        <svg
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                        >
                            {row.slTop !== undefined && (
                                <>
                                    <path
                                        d={`M ${protectionAnchorX} ${row.slTop} C ${protectionAnchorX + 44} ${row.slTop}, ${badgeAnchorX - 44} ${overlayOffset.y}, ${badgeAnchorX} ${overlayOffset.y}`}
                                        fill="none"
                                        stroke={orderAccentColor}
                                        strokeWidth="1.5"
                                        strokeDasharray="5 4"
                                        strokeLinecap="round"
                                        opacity="0.78"
                                    />
                                    <circle
                                        cx={protectionAnchorX}
                                        cy={row.slTop}
                                        r="3"
                                        fill={orderAccentColor}
                                        opacity="0.95"
                                    />
                                </>
                            )}

                            {row.targetTop !== undefined && (
                                <>
                                    <path
                                        d={`M ${protectionAnchorX} ${row.targetTop} C ${protectionAnchorX + 44} ${row.targetTop}, ${badgeAnchorX - 44} ${overlayOffset.y}, ${badgeAnchorX} ${overlayOffset.y}`}
                                        fill="none"
                                        stroke={orderAccentColor}
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        opacity="0.78"
                                    />
                                    <circle
                                        cx={protectionAnchorX}
                                        cy={row.targetTop}
                                        r="3"
                                        fill={orderAccentColor}
                                        opacity="0.95"
                                    />
                                </>
                            )}

                            {(row.slTop !== undefined || row.targetTop !== undefined) && (
                                <circle
                                    cx={badgeAnchorX}
                                    cy={overlayOffset.y}
                                    r="3"
                                    fill={orderAccentColor}
                                    opacity="0.95"
                                />
                            )}
                        </svg>

                        {(isPlacingSl || isPlacingTarget) && (
                            <div
                                className={cn(
                                    "pointer-events-none absolute left-1/2 flex h-6 -translate-x-1/2 -translate-y-1/2 items-center overflow-hidden rounded border text-[9px] font-bold shadow-md backdrop-blur",
                                    protectionClasses
                                )}
                                style={{
                                    top: protectionPlacement?.top ?? row.top,
                                }}
                            >
                                <span
                                    className={cn(
                                        "flex h-full items-center px-1.5 text-white",
                                        isPlacingSl ? "bg-danger/90" : "bg-success/90"
                                    )}
                                >
                                    {isPlacingSl ? "SL" : "TP"}
                                </span>
                                <span
                                    className={cn(
                                        "px-1.5",
                                        placingPnl !== null && placingPnl >= 0
                                            ? "text-success"
                                            : "text-danger"
                                    )}
                                >
                                    {placingPnl !== null ? formatPnl(placingPnl) : "--"}
                                </span>
                            </div>
                        )}

                        {row.slTop !== undefined && row.slPrice !== undefined && (
                            <motion.button
                                data-position-control
                                type="button"
                                title="Drag to update stop loss"
                                disabled={isUpdatingSl}
                                whileTap={{ scale: 0.97 }}
                                onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) =>
                                    startProtectionDrag(event, row.trade, "sl")
                                }
                                className={cn(
                                    "pointer-events-auto absolute left-1/2 flex h-6 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize items-center overflow-hidden rounded border text-[9px] font-bold shadow-md backdrop-blur transition hover:bg-opacity-80 disabled:cursor-wait disabled:opacity-80",
                                    protectionClasses
                                )}
                                style={{
                                    top: row.slTop,
                                    touchAction: "none",
                                }}
                            >
                                <span className="flex h-full items-center bg-danger/85 px-1.5 text-white">
                                    SL
                                </span>
                                <span
                                    className={cn(
                                        "px-1.5",
                                        slPnl !== undefined && slPnl >= 0
                                            ? "text-success"
                                            : "text-danger"
                                    )}
                                >
                                    {slPnl === undefined ? "--" : formatPnl(slPnl)}
                                </span>
                                {isUpdatingSl ? (
                                    <Spinner className="mr-1 text-danger" />
                                ) : (
                                    <span className="material-symbols-outlined pr-1 text-[12px] text-danger">
                                        drag_indicator
                                    </span>
                                )}
                            </motion.button>
                        )}

                        {row.targetTop !== undefined && row.targetPrice !== undefined && (
                            <motion.button
                                data-position-control
                                type="button"
                                title="Drag to update take profit"
                                disabled={isUpdatingTarget}
                                whileTap={{ scale: 0.97 }}
                                onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) =>
                                    startProtectionDrag(event, row.trade, "target")
                                }
                                className={cn(
                                    "pointer-events-auto absolute left-1/2 flex h-6 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize items-center overflow-hidden rounded border text-[9px] font-bold shadow-md backdrop-blur transition hover:bg-opacity-80 disabled:cursor-wait disabled:opacity-80",
                                    protectionClasses
                                )}
                                style={{
                                    top: row.targetTop,
                                    touchAction: "none",
                                }}
                            >
                                <span className="flex h-full items-center bg-success/85 px-1.5 text-white">
                                    TP
                                </span>
                                <span
                                    className={cn(
                                        "px-1.5",
                                        targetPnl !== undefined && targetPnl >= 0
                                            ? "text-success"
                                            : "text-danger"
                                    )}
                                >
                                    {targetPnl === undefined ? "--" : formatPnl(targetPnl)}
                                </span>
                                {isUpdatingTarget ? (
                                    <Spinner className="mr-1 text-success" />
                                ) : (
                                    <span className="material-symbols-outlined pr-1 text-[12px] text-success">
                                        drag_indicator
                                    </span>
                                )}
                            </motion.button>
                        )}

                        <svg
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                        >
                            <line
                                x1={connectorX}
                                y1={row.top}
                                x2={connectorX}
                                y2={overlayOffset.y}
                                stroke={connectorColor}
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                                strokeLinecap="round"
                                opacity="0.72"
                            />
                            <circle
                                cx={connectorX}
                                cy={row.top}
                                r="3"
                                fill={connectorColor}
                                opacity="0.95"
                            />
                            <circle
                                cx={connectorX}
                                cy={overlayOffset.y}
                                r="2"
                                fill={connectorColor}
                                opacity="0.85"
                            />
                        </svg>

                        <motion.div
                            layout
                            transition={{
                                type: "spring",
                                stiffness: 420,
                                damping: 36,
                            }}
                            className="absolute flex -translate-y-1/2 items-center"
                            style={{
                                left: overlayOffset.x,
                                top: overlayOffset.y,
                            }}
                        >
                            <motion.div
                                data-position-control
                                whileHover={{ scale: 1.02 }}
                                onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
                                    const target = event.target as HTMLElement;

                                    if (target.closest("button")) {
                                        return;
                                    }

                                    startPositionOverlayDrag(event, row.trade._id, row.top);
                                }}
                                className={cn(
                                    "pointer-events-auto flex h-6 cursor-move items-center overflow-hidden rounded border shadow-md backdrop-blur-md transition hover:opacity-100",
                                    positionClasses
                                )}
                                style={{
                                    touchAction: "none",
                                }}
                            >
                                <span
                                    className={cn(
                                        "flex h-full min-w-8 items-center justify-center px-1.5 text-[9px] font-black uppercase leading-none",
                                        toneClasses
                                    )}
                                >
                                    {row.trade.bs}
                                </span>

                                <div className="flex h-full items-center gap-1.5 px-1.5">
                                    <span className="text-[10px] font-bold leading-none">
                                        {row.symbol}
                                    </span>
                                    <span className={cn("text-[9px] font-semibold leading-none", mutedText)}>
                                        {formatPrice(row.price)}
                                    </span>
                                    <span
                                        className={cn(
                                            "flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-black leading-none",
                                            pnlClasses
                                        )}
                                    >
                                        <span className="material-symbols-outlined text-[12px] leading-none">
                                            {pnlIcon}
                                        </span>
                                        {formatPnl(row.pnl)}
                                    </span>

                                    {row.slPrice === undefined && (
                                        <button
                                            data-position-control
                                            type="button"
                                            title="Place stop loss"
                                            disabled={isUpdatingSl}
                                            onPointerDown={(event) =>
                                                startProtectionPlacement(event, row.trade, "sl", row.top)
                                            }
                                            className={cn(
                                                "flex h-4 min-w-5 items-center justify-center rounded border px-1 text-[8px] font-black transition disabled:cursor-wait disabled:opacity-80",
                                                isPlacingSl
                                                    ? "border-danger bg-danger text-white"
                                                    : "border-danger/35 text-danger hover:bg-danger hover:text-white"
                                            )}
                                        >
                                            {isUpdatingSl ? <Spinner className="h-2.5 w-2.5" /> : "SL"}
                                        </button>
                                    )}

                                    {row.targetPrice === undefined && (
                                        <button
                                            data-position-control
                                            type="button"
                                            title="Place take profit"
                                            disabled={isUpdatingTarget}
                                            onPointerDown={(event) =>
                                                startProtectionPlacement(event, row.trade, "target", row.top)
                                            }
                                            className={cn(
                                                "flex h-4 min-w-5 items-center justify-center rounded border px-1 text-[8px] font-black transition disabled:cursor-wait disabled:opacity-80",
                                                isPlacingTarget
                                                    ? "border-success bg-success text-white"
                                                    : "border-success/35 text-success hover:bg-success hover:text-white"
                                            )}
                                        >
                                            {isUpdatingTarget ? <Spinner className="h-2.5 w-2.5" /> : "TP"}
                                        </button>
                                    )}
                                </div>

                                <button
                                    data-position-control
                                    type="button"
                                    title="Close position"
                                    disabled={!onClosePosition || isClosing}
                                    onClick={() => onClosePosition?.(row.trade)}
                                    className={cn(
                                        "flex h-6 w-6 items-center justify-center border-l transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
                                        theme === "dark"
                                            ? "border-slate-600/45 hover:bg-slate-700/80"
                                            : "border-slate-300/55 hover:bg-slate-100/80"
                                    )}
                                >
                                    {isClosing ? (
                                        <Spinner />
                                    ) : (
                                        <span className="material-symbols-outlined text-[13px] leading-none">
                                            close
                                        </span>
                                    )}
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                );
            })}
        </div>
    );
}
