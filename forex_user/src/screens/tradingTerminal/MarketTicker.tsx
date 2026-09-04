import { cn, type SymbolQuote } from "../../components/TradingTerminal";

export function MarketTicker({ quotes }: { quotes: SymbolQuote[] }) {
    const loopedQuotes = [...quotes, ...quotes];
    return (
        <div className="hidden overflow-hidden border-b border-border bg-surface/60 lg:block">
            <div className="flex w-max animate-ticker items-center gap-7 py-1.5">
                {loopedQuotes.map((item, index) => {
                    const isUp = item.change >= 0;
                    const decimals = item.category === "forex" ? 5 : 2;
                    return (
                        <div
                            key={`${item.symbol}-${index}`}
                            className="flex shrink-0 items-center gap-1.5 px-2 text-[11px]"
                        >
                            <span className="font-semibold text-text">{item.symbol}</span>
                            <span className="text-text-secondary">
                                {item.bid.toFixed(decimals)}
                            </span>
                            <span
                                className={cn(
                                    "flex items-center font-medium",
                                    isUp ? "text-success" : "text-danger"
                                )}
                            >
                                <span className="material-symbols-outlined text-[14px]">
                                    {isUp ? "arrow_drop_up" : "arrow_drop_down"}
                                </span>
                                {isUp ? "+" : ""}
                                {item.change.toFixed(2)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
