import { cn, type MobilePanel } from "../../components/TradingTerminal";
import { motion } from 'framer-motion';
export function MobileBottomNav({
    activePanel,
    onChart,
    onMarkets,
    onTrade,
    onPositions,
}: {
    activePanel: MobilePanel;
    onChart: () => void;
    onMarkets: () => void;
    onTrade: () => void;
    onPositions: () => void;
}) {
    return (
        <div className="grid grid-cols-4 border-t border-border bg-surface px-1 pb-[max(env(safe-area-inset-bottom),0px)]">
            <MobileNavButton
                icon="candlestick_chart"
                label="Chart"
                active={!activePanel}
                onClick={onChart}
            />

            <MobileNavButton
                icon="format_list_bulleted"
                label="Markets"
                active={activePanel === "markets"}
                onClick={onMarkets}
            />

            <MobileNavButton
                icon="add_chart"
                label="Trade"
                active={activePanel === "trade"}
                onClick={onTrade}
            />
            <MobileNavButton
                icon="receipt_long"
                label="Positions"
                active={activePanel === "positions"}
                onClick={onPositions}
            />
        </div>
    );
}

export function MobileNavButton({
    icon,
    label,
    active,
    onClick,
}: {
    icon: string;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition active:scale-95",
                active ? "bg-primary/10 text-primary" : "text-text-muted"
            )}
        >
            <span className="material-symbols-outlined text-[20px]">
                {icon}
            </span>
            {label}
        </button>
    );
};
export function MobileSheet({
    title,
    children,
    onClose,
    full,
}: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    full?: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-[2px] lg:hidden"
        >
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                onClick={(event) => event.stopPropagation()}
                className={cn(
                    "w-full overflow-hidden rounded-t-2xl border-t border-border bg-surface shadow-2xl",
                    full ? "h-[86dvh]" : "h-[78dvh]"
                )}
            >
                <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
                <div className="flex h-[58px] items-center justify-between border-b border-border px-4">
                    <div>
                        <p className="text-sm font-semibold text-text">{title}</p>
                        <p className="text-[11px] text-text-muted">
                            Manage without leaving the chart
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-text-muted transition active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            close
                        </span>
                    </button>
                </div>

                <div className="custom-scrollbar h-[calc(100%-58px)]">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
}
