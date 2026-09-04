import { Link } from "react-router-dom";
import PageHeadline from "./PageHeadline";
import MotionWrapper from "../screens/Motion";
import TradeAccountSwitchBar from "../screens/TradeAccountSwitcher";
import { useUser } from "../constant/UserProvider";
import { useWebSocket } from "../constant/SocketProvider";
import { useEffect, useState } from "react";
const quickActions = [
    {
        title: "Deposit",
        icon: "south",
        href: "/wallet/deposit",
    },
    {
        title: "Withdraw",
        icon: "north",
        href: "/wallet/withdraw",
    },
    {
        title: "Transfer",
        icon: "swap_horiz",
        href: "/wallet/transfer",
    },
    {
        title: "Trade",
        icon: "candlestick_chart",
        href: "/trade",
    },
    {
        title: "Bonus",
        icon: "redeem",
        href: "/bonus",
    },
    {
        title: "IB",
        icon: "groups",
        href: "/ib",
    },
];
function MiniStat({
    label,
    value,
    icon,
    tone = "text-text",
}: {
    label: string;
    value: string;
    icon: string;
    tone?: string;
}) {
    return (
        <div className="rounded-lg border border-border bg-background px-2.5 py-2 shadow-sm transition hover:border-primary/30 hover:bg-card-hover">
            <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-primary">{icon}</span>
                <p className="truncate text-[10px] font-semibold uppercase text-text-muted">{label}</p>
            </div>
            <p className={`mt-1 truncate text-sm font-bold tabular-nums ${tone}`}>{value}</p>
        </div>
    );
}
export default function Dashboard() {
    const { activeTradeAccount } = useUser();
    const { equity_payload } = useWebSocket();
    const equity = Number(
        equity_payload?.equity ??
        activeTradeAccount?.balance ??
        0
    );
    const pnl = Number(equity_payload?.PNL ?? 0);
    const balance = Number(activeTradeAccount?.balance ?? 0);
    const freeMargin = Number(
        equity_payload?.freeMargin ??
        activeTradeAccount?.balance ??
        0
    );
    const usedMargin = Number(equity_payload?.usedMargin ?? 0);
    const marginLevel = Number(equity_payload?.marginLevel ?? 99999);
    const hasChartData = Boolean(activeTradeAccount?._id && equity_payload);

    return (
        <>
            <MotionWrapper>
                <PageHeadline
                    title="Dashboard"
                    subtitle="Account health, market movement, and quick trading actions."
                >

                    <TradeAccountSwitchBar />


                </PageHeadline>
            </MotionWrapper>
            <div className="flex flex-col gap-3 p-3 sm:p-4">
                <MotionWrapper delay={0.05}>
                    <section className="relative mx-auto w-full max-w-5xl rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success sm:right-4 sm:top-4">
                            <span className="pulse-live h-1.5 w-1.5 rounded-full bg-success" />
                            Live
                        </span>

                        <div className="mb-3 flex flex-col items-center gap-2 pr-16 text-center">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px] text-primary">
                                    account_balance
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-text">
                                        {activeTradeAccount?.accountID || "No Account"}
                                    </p>
                                    <p className="text-[11px] font-medium uppercase text-text-muted">
                                        {activeTradeAccount?.accountType || "Trading"} Account
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-[10px] font-semibold uppercase text-text-muted">
                                    Equity
                                </span>
                                <span className="text-2xl font-bold tabular-nums text-text sm:text-[28px]">
                                    ${equity.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                            <MiniStat label="Balance" value={`$${balance.toFixed(2)}`} icon="account_balance_wallet" />
                            <MiniStat
                                label="P&L"
                                value={`${pnl > 0 ? "+" : ""}$${pnl.toFixed(2)}`}
                                icon="monitoring"
                                tone={pnl > 0 ? "text-success" : pnl < 0 ? "text-danger" : "text-text-muted"}
                            />
                            <MiniStat label="Free Margin" value={`$${freeMargin.toFixed(2)}`} icon="payments" />
                            <MiniStat label="Used Margin" value={`$${usedMargin.toFixed(2)}`} icon="show_chart" />
                            <MiniStat label="Margin Level" value={`${marginLevel.toFixed(2)}%`} icon="speed" />
                            <MiniStat label="Leverage" value={`1:${activeTradeAccount?.leverage || 100}`} icon="tune" />
                        </div>
                    </section>
                </MotionWrapper>

                <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
                    <MotionWrapper delay={0.1}>
                        <PnlChart hasData={hasChartData} />
                    </MotionWrapper>

                    <MotionWrapper delay={0.15}>
                        <LotChart hasData={hasChartData} />
                    </MotionWrapper>
                </div>

                <MotionWrapper delay={0.2}>
                    <section className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-text">
                                    Quick Actions
                                </h3>
                                <p className="mt-1 text-xs text-text-muted">
                                    Move funds, trade, and manage account programs.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                            {quickActions.map((item, index) => (
                                <MotionWrapper
                                    key={item.title}
                                    delay={index * 0.05}
                                    y={12}
                                >
                                    <Link
                                        to={item.href}
                                        className="group flex min-h-20 flex-col justify-between rounded-lg border border-border bg-surface px-3 py-2.5 transition-all hover:border-primary/35 hover:bg-card-hover hover:shadow-md hover:shadow-primary/10"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                                            <span className="material-symbols-outlined text-[18px]">
                                                {item.icon}
                                            </span>
                                        </span>

                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-text sm:text-sm">
                                                {item.title}
                                            </span>
                                            <span className="material-symbols-outlined text-[16px] text-text-muted transition group-hover:translate-x-0.5 group-hover:text-primary">
                                                arrow_forward
                                            </span>
                                        </div>
                                    </Link>
                                </MotionWrapper>
                            ))}
                        </div>
                    </section>
                </MotionWrapper>

            </div>
        </>
    );
}
const pnlHistory = [820, 640, 910, 780, 1120, 980, 1340, 1180, 1490];
const currentPnl = pnlHistory[pnlHistory.length - 1];
const previousPnl = pnlHistory[pnlHistory.length - 2];
const changePct = (((currentPnl - previousPnl) / previousPnl) * 100).toFixed(2);
const positive = currentPnl >= previousPnl;
const pnlForecast = Math.round(currentPnl + (currentPnl - previousPnl) * 0.7);

function PnlChart({ hasData }: { hasData: boolean }) {
    return (
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-border px-3 py-2.5">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                            auto_graph
                        </span>
                        <p className="text-xs font-semibold uppercase text-text-muted">
                            AI P/L Trend
                        </p>
                    </div>
                    <h3 className="mt-1 text-lg font-bold tabular-nums text-text">
                        ${currentPnl.toLocaleString()}
                    </h3>
                </div>

                <div className="text-right">
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${positive
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                            }`}
                    >
                        {positive ? "+" : ""}
                        {changePct}%
                    </span>
                    <p className="mt-1 text-[10px] font-medium text-text-muted">
                        Forecast ${pnlForecast.toLocaleString()}
                    </p>
                </div>
            </div>

            {hasData ? (
                <>
                    <div className="h-36 px-2 py-3">
                        <AdvancedLineChart
                            data={pnlHistory}
                            forecast={pnlForecast}
                            positive={positive}
                        />
                    </div>

                    <div className="grid grid-cols-3 border-t border-border bg-surface/60 text-center">
                        <ChartMetric label="Signal" value={positive ? "Bullish" : "Risk"} tone={positive ? "text-success" : "text-danger"} />
                        <ChartMetric label="Volatility" value="Medium" />
                        <ChartMetric label="Confidence" value="78%" tone="text-primary" />
                    </div>
                </>
            ) : (
                <EmptyChartState
                    icon="insights"
                    title="AI trend will appear after your first trades"
                    subtitle="Open a position and the dashboard will build your P/L pattern, forecast, and confidence score."
                    actionLabel="Start Trading"
                    actionHref="/trade"
                />
            )}
        </section>
    );
}
const lotHistory = [0.2, -0.1, 0.35, 0.1, -0.25, 0.5, 0.15, -0.05, 0.3];
const currentLot = lotHistory.reduce((a, b) => a + b, 0);
const lotBias = currentLot >= 0 ? "Long Bias" : "Short Bias";

function LotChart({ hasData }: { hasData: boolean }) {
    return (
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-border px-3 py-2.5">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                            query_stats
                        </span>
                        <p className="text-xs font-semibold uppercase text-text-muted">
                            AI Lot Flow
                        </p>
                    </div>
                    <h3 className="mt-1 text-lg font-bold tabular-nums text-text">
                        {currentLot.toFixed(2)} lots
                    </h3>
                </div>

                <div className="text-right">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${currentLot >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                        {lotBias}
                    </span>
                    <p className="mt-1 text-[10px] font-medium text-text-muted">
                        Pattern scan active
                    </p>
                </div>
            </div>

            {hasData ? (
                <>
                    <div className="h-36 px-2 py-3">
                        <AdvancedBarChart data={lotHistory} />
                    </div>

                    <div className="grid grid-cols-3 border-t border-border bg-surface/60 text-center">
                        <ChartMetric label="Buy Flow" value="64%" tone="text-success" />
                        <ChartMetric label="Sell Flow" value="36%" tone="text-danger" />
                        <ChartMetric label="AI Mode" value="Live" tone="text-primary" />
                    </div>
                </>
            ) : (
                <EmptyChartState
                    icon="stacked_bar_chart"
                    title="Lot flow is waiting for activity"
                    subtitle="Your buy/sell pressure, position sizing, and flow bias will unlock once order history starts coming in."
                    actionLabel="View Markets"
                    actionHref="/trade"
                />
            )}
        </section>
    );
}

function EmptyChartState({
    icon,
    title,
    subtitle,
    actionLabel,
    actionHref,
}: {
    icon: string;
    title: string;
    subtitle: string;
    actionLabel: string;
    actionHref: string;
}) {
    return (
        <div className="relative min-h-48 overflow-hidden bg-surface px-4 py-5">
            <div className="pointer-events-none absolute inset-0 opacity-80">
                <svg viewBox="0 0 420 180" className="h-full w-full" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="emptyChartLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.1" />
                            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                        </linearGradient>
                    </defs>
                    {[38, 76, 114, 152].map((y) => (
                        <line
                            key={y}
                            x1="18"
                            y1={y}
                            x2="402"
                            y2={y}
                            stroke="var(--color-border)"
                            strokeDasharray="5 7"
                            opacity="0.8"
                        />
                    ))}
                    <path
                        d="M18 132 C76 70 116 156 166 92 S260 52 314 92 S374 146 402 84"
                        fill="none"
                        stroke="url(#emptyChartLine)"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    {[70, 128, 84, 112, 58, 96].map((height, index) => (
                        <rect
                            key={index}
                            x={44 + index * 56}
                            y={156 - height}
                            width="18"
                            height={height}
                            rx="6"
                            fill="var(--color-primary)"
                            opacity={0.08 + index * 0.025}
                        />
                    ))}
                </svg>
            </div>

            <div className="relative z-10 flex min-h-40 flex-col items-center justify-center text-center">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10">
                    <span className="material-symbols-outlined text-[26px]">
                        {icon}
                    </span>
                </span>
                <h3 className="max-w-sm text-sm font-semibold text-text">
                    {title}
                </h3>
                <p className="mt-1 max-w-md text-xs leading-5 text-text-muted">
                    {subtitle}
                </p>
                <Link
                    to={actionHref}
                    className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
                >
                    <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                    </span>
                    {actionLabel}
                </Link>
            </div>
        </div>
    );
}

function ChartMetric({
    label,
    value,
    tone = "text-text",
}: {
    label: string;
    value: string;
    tone?: string;
}) {
    return (
        <div className="px-2 py-2">
            <p className="text-[10px] font-semibold uppercase text-text-muted">{label}</p>
            <p className={`mt-0.5 text-xs font-bold ${tone}`}>{value}</p>
        </div>
    );
}

function AdvancedBarChart({ data }: { data: number[] }) {
    const width = 420;
    const height = 130;
    const padding = 14;
    const mid = height / 2;
    const max = Math.max(...data.map(Math.abs)) || 1;
    const step = (width - padding * 2) / data.length;
    const barWidth = Math.max(step * 0.55, 10);

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-full w-full"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="lotPositiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="lotNegativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-danger)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--color-danger)" stopOpacity="0.95" />
                </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((line) => (
                <line
                    key={line}
                    x1={padding}
                    y1={height * line}
                    x2={width - padding}
                    y2={height * line}
                    stroke="var(--color-border)"
                    strokeDasharray="4 5"
                    strokeWidth="1"
                    opacity="0.65"
                />
            ))}
            {data.map((val, i) => {
                const barHeight = (Math.abs(val) / max) * (height / 2 - padding);
                const x = padding + i * step + (step - barWidth) / 2;
                const positive = val >= 0;
                return (
                    <rect
                        key={i}
                        x={x}
                        y={positive ? mid - barHeight : mid}
                        width={barWidth}
                        height={barHeight || 1}
                        rx="4"
                        fill={positive ? "url(#lotPositiveGradient)" : "url(#lotNegativeGradient)"}
                    />
                );
            })}
            <line
                x1={padding}
                y1={mid}
                x2={width - padding}
                y2={mid}
                stroke="var(--color-text-muted)"
                strokeWidth="1.25"
                opacity="0.65"
            />
            <text x={width - padding} y={padding + 2} textAnchor="end" className="fill-primary text-[10px] font-semibold">
                AI volume clusters
            </text>
        </svg>
    );
}

function AdvancedLineChart({
    data,
    forecast,
    positive = true,
}: {
    data: number[];
    forecast: number;
    positive?: boolean;
}) {
    const width = 420;
    const height = 130;
    const padding = 14;
    const chartData = [...data, forecast];
    const min = Math.min(...chartData);
    const max = Math.max(...chartData);
    const range = max - min || 1;
    const color = positive ? "var(--color-success)" : "var(--color-danger)";
    const toPoint = (val: number, i: number, total: number) => {
        const x = padding + (i / (total - 1)) * (width - padding * 2);
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        return { x, y };
    };

    const actualPoints = data.map((val, i) => toPoint(val, i, chartData.length));
    const forecastStart = actualPoints[actualPoints.length - 1];
    const forecastPoint = toPoint(forecast, chartData.length - 1, chartData.length);
    const linePath = `M${actualPoints.map((point) => `${point.x},${point.y}`).join(" L")}`;
    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-full w-full"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="pnlAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
                <filter id="chartGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {[0.25, 0.5, 0.75].map((line) => (
                <line
                    key={line}
                    x1={padding}
                    y1={height * line}
                    x2={width - padding}
                    y2={height * line}
                    stroke="var(--color-border)"
                    strokeDasharray="4 5"
                    strokeWidth="1"
                    opacity="0.65"
                />
            ))}
            <path d={areaPath} fill="url(#pnlAreaGradient)" />
            <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#chartGlow)"
            />
            <line
                x1={forecastStart.x}
                y1={forecastStart.y}
                x2={forecastPoint.x}
                y2={forecastPoint.y}
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeDasharray="6 5"
                strokeLinecap="round"
            />
            <circle cx={forecastStart.x} cy={forecastStart.y} r="4" fill={color} />
            <circle cx={forecastPoint.x} cy={forecastPoint.y} r="4" fill="var(--color-primary)" />
            <text x={width - padding} y={padding + 2} textAnchor="end" className="fill-primary text-[10px] font-semibold">
                AI projection
            </text>
        </svg>
    );
}

export const EquityCell: React.FC<{ pnl: number | string, fixed: number }> = ({ pnl, fixed }) => {
    const pnlNumber = Number(pnl);
    const [prevPnl, setPrevPnl] = useState(pnlNumber);
    const pnlChanged = pnlNumber !== prevPnl;
    useEffect(() => {
        if (pnlNumber !== prevPnl) {
            setPrevPnl(pnlNumber);
        }
    }, [pnlNumber, prevPnl]);
    const pnlClass =
        pnlNumber > 0
            ? "!text-success"
            : pnlNumber < 0
                ? "!text-danger"
                : "!text-text-muted";
    return (
        <span
            className={`
        rounded-md px-2.5 py-1
        tabular-nums min-w-[90px] text-right text-sm font-bold
        transition-colors duration-300
        ${pnlChanged ? "bg-warning/10" : ""}
        ${pnlClass}
      `}
        >
            {pnlNumber.toFixed(fixed)}
        </span>
    );
};
