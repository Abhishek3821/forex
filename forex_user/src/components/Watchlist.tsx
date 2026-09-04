import { useMemo, useState } from "react";
import { createSparklinePoints, useSparklineHistory } from "../hooks/useSparkline";
import { usePriceFlash } from "../hooks/usePriceFlash";
import type { SymbolDetail } from "../interface/interface";
import { cn } from "./TradingTerminal";
import type { ITickPrice } from "../constant/SocketProvider";
type CategoryFilter = "all" | "favorites" | SymbolDetail["market"];
const CATEGORY_TABS: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "favorites", label: "★" },
    { key: "forex", label: "Forex" },
    { key: "crypto", label: "Crypto" },
    { key: "commodity", label: "Metals" },
    { key: "index", label: "Indices" },
];

export function Watchlist({
    symbols,
    selectedSymbol,
    onSelect,
    favorites,
    onToggleFavorite,
    tickPrice,
    className = "hidden lg:flex",
}: {
    symbols: SymbolDetail[];
    tickPrice: Map<string, ITickPrice>,
    selectedSymbol: SymbolDetail;
    onSelect: (symbol: SymbolDetail) => void;
    favorites: Set<string>;
    onToggleFavorite: (symbol: string) => void;
    className?: string;
}) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<CategoryFilter>("all");

    const filtered = useMemo(() => {
        return symbols.filter((item) => {
            if (category === "favorites" && !favorites.has(item.symbol_name)) return false;
            if (
                category !== "all" &&
                category !== "favorites" &&
                item.market !== category
            )
                return false;

            if (query) {
                const q = query.toLowerCase();
                if (
                    !item.symbol_name.toLowerCase().includes(q)
                )
                    return false;
            }

            return true;
        });
    }, [symbols, category, favorites, query]);

    return (
        <aside
            className={cn(
                "min-w-0 flex-col border-r border-border bg-surface custom-scrollbar",
                className
            )}>
            <div className="border-b border-border p-3">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-text-muted">
                        search
                    </span>
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search symbol"
                        className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm text-text outline-none transition focus:border-primary"
                    />
                </div>

                <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
                    {CATEGORY_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setCategory(tab.key)}
                            className={cn(
                                "shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition",
                                category === tab.key
                                    ? "bg-primary text-white"
                                    : "bg-card text-text-secondary hover:bg-card-hover"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Watchlist
                </p>
                <span className="text-[11px] text-text-muted">
                    {filtered.length} symbol{filtered.length === 1 ? "" : "s"}
                </span>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-3 custom-scrollbar">
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                        <span className="material-symbols-outlined text-2xl text-text-muted">
                            search_off
                        </span>
                        <p className="text-xs text-text-muted">No symbols match</p>
                    </div>
                )}

                {filtered.map((item) => (
                    <WatchlistRow
                        key={item.symbol_name}
                        item={item}
                        active={item._id === selectedSymbol._id}
                        isFavorite={favorites.has(item.symbol_name)}
                        onSelect={() => onSelect(item)}
                        quote={tickPrice.get(item.symbol_name)}
                        onToggleFavorite={() => onToggleFavorite(item.symbol_name)}
                    />
                ))}
            </div>
        </aside>
    );
}

function WatchlistRow({
    item,
    active,
    isFavorite,
    onSelect,
    quote,
    onToggleFavorite,
}: {
    item: SymbolDetail;
    quote?: ITickPrice;
    active: boolean;
    isFavorite: boolean;
    onSelect: () => void;
    onToggleFavorite: () => void;
}) {
    const { history, trend } = useSparklineHistory(Number(quote?.b || 0), 24);
    const flash = usePriceFlash(Number(quote?.b || 0));
    const change = 0;
    const isUp = change >= 0;
    const points = createSparklinePoints(history, 60, 24, 3);
    const decimals = item.market === "forex" ? 5 : 2;
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect();
            }}
            className={cn(
                "mb-1 flex w-full cursor-pointer items-center gap-2 rounded-xl border border-l-2 px-3 py-3 text-left transition",
                active
                    ? "border-primary border-l-primary bg-primary/10"
                    : "border-transparent border-l-transparent hover:border-border hover:bg-card"
            )}
        >
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite();
                }}
                className={cn(
                    "shrink-0 transition",
                    isFavorite ? "text-warning" : "text-text-muted/40 hover:text-text-muted"
                )}
            >
                <span className="material-symbols-outlined text-[16px]">
                    {isFavorite ? "star" : "star_outline"}
                </span>
            </button>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text">{item.symbol_name}</p>
                <p className="truncate text-[11px] text-text-muted">{item.symbol_name}</p>
            </div>

            <div className="h-6 w-11 shrink-0">
                <svg
                    viewBox="0 0 60 24"
                    className={cn(
                        "h-full w-full",
                        trend === "up" && "text-success",
                        trend === "down" && "text-danger",
                        trend === "neutral" && "text-text-muted"
                    )}
                    preserveAspectRatio="none"
                >
                    <polyline
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <div className="text-right">
                <p
                    className={cn(
                        "rounded px-1 text-xs font-medium transition-colors duration-300",
                        flash === "up" && "bg-success/20 text-success",
                        flash === "down" && "bg-danger/20 text-danger",
                        !flash && "text-text"
                    )}
                >
                    {Number(quote?.b || 0).toFixed(decimals)}
                </p>
                <p
                    className={cn(
                        "text-[11px] font-medium",
                        isUp ? "text-success" : "text-danger"
                    )}
                >
                    {isUp ? "+" : ""}
                    {change.toFixed(2)}%
                </p>
            </div>
        </div>
    );
}
