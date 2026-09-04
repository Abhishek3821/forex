import { cn } from "../components/TradingTerminal";
import type { EquityPayload } from "../constant/SocketProvider";

type AccountStatProps = {
    label: string;
    value: string;
    tone?: "success" | "danger";
};

export function AccountStat({ label, value, tone }: AccountStatProps) {
    const valueClass =
        tone === "success"
            ? "text-success"
            : tone === "danger"
                ? "text-danger"
                : "text-text";

    return (
        <div
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/70 px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
        >
            <span className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                {label}
            </span>

            <span className={cn("text-sm font-semibold", valueClass)}>
                {value}
            </span>
        </div>
    );
}
export function MobileAccountSummary({
    equity_payload,
}: {
    equity_payload: EquityPayload;
}) {
    return (
        <div className="grid grid-cols-4 gap-2 border-b border-border bg-background px-3 py-2">
            <MobileStat
                label="Bal"
                value={`$${equity_payload.balance.toFixed(2)}`}
            />
            <MobileStat
                label="Equity"
                value={`$${equity_payload.equity.toFixed(2)}`}
                tone="success"
            />
            <MobileStat
                label="Margin"
                value={`$${equity_payload.usedMargin.toFixed(2)}`}
            />
            <MobileStat
                label="Level"
                value={`${equity_payload.marginLevel.toFixed(2)}%`}
                tone="success"
            />
        </div>
    );
}

export function MobileStat({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone?: "success" | "danger";
}) {
    return (
        <div className="rounded-lg border border-border bg-surface px-2 py-2">
            <p className="text-[10px] text-text-muted">{label}</p>
            <p
                className={cn(
                    "mt-0.5 truncate text-xs font-semibold text-text",
                    tone === "success" && "text-success",
                    tone === "danger" && "text-danger"
                )}
            >
                {value}
            </p>
        </div>
    );
}
