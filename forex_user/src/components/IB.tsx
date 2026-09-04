import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import MotionWrapper from "../screens/Motion";
import PageHeadline from "./PageHeadline";
import ButtonBar from "../screens/ButtonBar";
import PaginationSelector from "../screens/PaginationSelector";
import LoadingScreen from "./Loading";
import NoDataFound from "./NotFound";
import { ibManagementList } from "../constant";
import { containerVariants, rowVariants } from "../hooks/useAnimation";
import { usePagination } from "../hooks/usePagination";
import {
    type IbTransaction,
    type ReferralData,
    useIbDashboard,
    useIbTransactions,
    useReferralCommission,
} from "../hooks/useIb";

type IbActiveView = {
    main: string | null;
    sub: string | null;
};

const formatAmount = (value?: number, currency = "USD") =>
    `${Number(value ?? 0).toFixed(2)} ${currency}`;

const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleString() : "N/A";

const statusClassName = (status?: string) =>
    `rounded px-2 py-1 text-xs font-medium capitalize ${status === "approved" || status === "success"
        ? "bg-success/10 text-success"
        : status === "pending"
            ? "bg-warning/10 text-warning"
            : "bg-danger/10 text-danger"
    }`;

const paymentModeLabel = (paymentMethod?: string) =>
    paymentMethod === "bank_transfer"
        ? "Bank Transfer"
        : paymentMethod || "N/A";

const copyText = (value?: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
};

function SummaryCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: string;
}) {
    return (
        <div className="rounded-lg border border-border bg-background px-3 py-3 shadow-sm">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">
                    {icon}
                </span>
                <p className="text-[11px] font-semibold uppercase text-text-muted">
                    {label}
                </p>
            </div>
            <p className="mt-2 truncate text-lg font-bold tabular-nums text-text">
                {value}
            </p>
        </div>
    );
}

function IbProfile() {
    const { data, isLoading, isError } = useIbDashboard();
    const profile = data?.data;

    if (isLoading) return <LoadingScreen />;
    if (isError || !profile) return <NoDataFound message="IB profile not found." />;

    return (
        <motion.div
            className="grid gap-3 lg:grid-cols-[1.2fr_1fr]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <section className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-text">
                            Referral Profile
                        </h3>
                        <p className="mt-1 text-xs text-text-muted">
                            Share your invite link and track IB performance.
                        </p>
                    </div>
                    <span className="material-symbols-outlined text-primary">
                        group_add
                    </span>
                </div>

                <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-[11px] font-semibold uppercase text-text-muted">
                        Referral Link
                    </p>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <span className="min-w-0 flex-1 break-all rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text">
                            {profile.referralLink}
                        </span>
                        <button
                            type="button"
                            onClick={() => copyText(profile.referralLink)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                content_copy
                            </span>
                            Copy
                        </button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-2 gap-2">
                <SummaryCard
                    label="Wallet"
                    value={formatAmount(profile.walletBalance)}
                    icon="account_balance_wallet"
                />
                <SummaryCard
                    label="Commission"
                    value={formatAmount(profile.totalCommission)}
                    icon="payments"
                />
                <SummaryCard
                    label="Trades"
                    value={String(profile.totalTrades)}
                    icon="candlestick_chart"
                />
                <SummaryCard
                    label="Status"
                    value="Active"
                    icon="verified"
                />
            </section>
        </motion.div>
    );
}

function ReferralTable({ data }: { data: ReferralData[] }) {
    return (
        <table className="hidden min-w-full text-left text-sm text-text md:table">
            <thead className="sticky top-0 z-40 border-b border-border bg-surface text-xs uppercase text-text-muted">
                <tr>
                    <th className="px-4 py-3 text-nowrap">S.N</th>
                    <th className="px-4 py-3 text-nowrap">Name</th>
                    <th className="px-4 py-3 text-nowrap">User ID</th>
                    <th className="px-4 py-3 text-nowrap">Account ID</th>
                    <th className="px-4 py-3 text-nowrap">Trade Account</th>
                    <th className="px-4 py-3 text-nowrap">Level</th>
                    <th className="px-4 py-3 text-nowrap">Total Lot</th>
                    <th className="px-4 py-3 text-nowrap">Commission</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {data.map((item, index) => (
                    <motion.tr
                        key={`${item.userId}-${item.level}-${index}`}
                        className="transition-colors duration-150 hover:bg-card-hover"
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                    >
                        <td className="px-4 py-3 font-semibold">{index + 1}</td>
                        <td className="px-4 py-3 font-semibold">{item.name || "N/A"}</td>
                        <td className="px-4 py-3">{item.userId || "N/A"}</td>
                        <td className="px-4 py-3">{item.accountId || "N/A"}</td>
                        <td className="px-4 py-3">{item.trade_accountId || "N/A"}</td>
                        <td className="px-4 py-3">{item.level}</td>
                        <td className="px-4 py-3 font-semibold tabular-nums">{item.totalLot}</td>
                        <td className="px-4 py-3 font-semibold tabular-nums">
                            {formatAmount(item.totalCommissionAmount)}
                        </td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    );
}

function ReferralCards({ data }: { data: ReferralData[] }) {
    return (
        <div className="space-y-2 p-3 md:hidden">
            {data.map((item, index) => (
                <motion.div
                    key={`${item.userId}-${item.level}-${index}`}
                    className="rounded-lg border border-border bg-card p-3 shadow-sm"
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-text">
                                {item.name || "N/A"}
                            </p>
                            <p className="mt-1 text-xs text-text-muted">
                                Level {item.level} - {item.accountId || "N/A"}
                            </p>
                        </div>
                        <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                            {formatAmount(item.totalCommissionAmount)}
                        </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded border border-border bg-surface px-2 py-1">
                            <span className="text-text-muted">Lot</span>
                            <p className="font-semibold text-text">{item.totalLot}</p>
                        </div>
                        <div className="rounded border border-border bg-surface px-2 py-1">
                            <span className="text-text-muted">User ID</span>
                            <p className="truncate font-semibold text-text">{item.userId}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function ReferralCommission() {
    const { data, isLoading, isError } = useReferralCommission();
    const referrals = data?.data || [];
    const summary = data?.summary;

    if (isLoading) return <LoadingScreen />;
    if (isError) return <NoDataFound message="Commission data not found." />;

    return (
        <motion.div
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="grid grid-cols-2 gap-2 border-b border-border p-3 sm:max-w-md">
                <SummaryCard
                    label="Total Lot"
                    value={String(summary?.totalLot ?? 0)}
                    icon="bar_chart"
                />
                <SummaryCard
                    label="Commission"
                    value={formatAmount(summary?.totalCommission)}
                    icon="payments"
                />
            </div>

            <div className="custom-scrollbar h-[calc(100vh-390px)] overflow-auto">
                {referrals.length ? (
                    <>
                        <ReferralCards data={referrals} />
                        <ReferralTable data={referrals} />
                    </>
                ) : (
                    <NoDataFound message="No referral commission found." />
                )}
            </div>
        </motion.div>
    );
}

function TransactionCards({ data }: { data: IbTransaction[] }) {
    return (
        <div className="space-y-2 p-3 md:hidden">
            {data.map((item, index) => (
                <motion.div
                    key={item._id}
                    className="rounded-lg border border-border bg-card p-3 shadow-sm"
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-text">
                                {item.transaction_id}
                            </p>
                            <p className="mt-1 text-xs text-text-muted">
                                {paymentModeLabel(item.paymentMethod)} - {formatDate(item.createdAt)}
                            </p>
                        </div>
                        <span className={statusClassName(item.status)}>
                            {item.status}
                        </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-text-muted">
                            Closing {formatAmount(item.closingBalance)}
                        </span>
                        <span className="text-base font-semibold text-text">
                            {formatAmount(item.amount)}
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function TransactionTable({ data }: { data: IbTransaction[] }) {
    return (
        <table className="hidden min-w-full text-left text-sm text-text md:table">
            <thead className="sticky top-0 z-40 border-b border-border bg-surface text-xs uppercase text-text-muted">
                <tr>
                    <th className="px-4 py-3 text-nowrap">S.N</th>
                    <th className="px-4 py-3 text-nowrap">Transaction ID</th>
                    <th className="px-4 py-3 text-nowrap">Trade Account</th>
                    <th className="px-4 py-3 text-nowrap">Amount</th>
                    <th className="px-4 py-3 text-nowrap">Closing Balance</th>
                    <th className="px-4 py-3 text-nowrap">Payment Mode</th>
                    <th className="px-4 py-3 text-nowrap">Bank Details</th>
                    <th className="px-4 py-3 text-nowrap">Status</th>
                    <th className="px-4 py-3 text-nowrap">Created At</th>
                    <th className="px-4 py-3 text-nowrap">Completed At</th>
                    <th className="px-4 py-3 text-nowrap">Remark</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {data.map((item, index) => (
                    <motion.tr
                        key={item._id}
                        className="transition-colors duration-150 hover:bg-card-hover"
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                    >
                        <td className="px-4 py-3 font-semibold">{index + 1}</td>
                        <td className="px-4 py-3">{item.transaction_id}</td>
                        <td className="px-4 py-3">{item.trade_user_id || "N/A"}</td>
                        <td className="px-4 py-3 font-semibold tabular-nums">
                            {formatAmount(item.amount)}
                        </td>
                        <td className="px-4 py-3 tabular-nums">
                            {formatAmount(item.closingBalance)}
                        </td>
                        <td className="px-4 py-3">{paymentModeLabel(item.paymentMethod)}</td>
                        <td className="px-4 py-3">
                            <div className="space-y-1 text-xs">
                                {Object.entries(item.bank_details || {})
                                    .filter(([, value]) => value)
                                    .map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between gap-3">
                                            <span className="capitalize text-text-muted">
                                                {key.replace(/([A-Z])/g, " $1")}
                                            </span>
                                            <span className="font-medium text-text">
                                                {String(value)}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <span className={statusClassName(item.status)}>
                                {item.status}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{formatDate(item.createdAt)}</td>
                        <td className="px-4 py-3 text-text-secondary">{formatDate(item.completedAt)}</td>
                        <td className="px-4 py-3 text-text-secondary">{item.remark || "N/A"}</td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    );
}

function IbTransactions() {
    const { handlePageChange, handlePageSizeChange, pageNumber, pageSizeValue } =
        usePagination();
    const { data, isLoading, isError } = useIbTransactions({
        pageNumber,
        pageSize: pageSizeValue,
    });
    const transactions = data?.results || [];

    return (
        <motion.div
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="custom-scrollbar h-[calc(100vh-350px)] overflow-auto">
                {!isError && transactions.length > 0 && !isLoading && (
                    <>
                        <TransactionCards data={transactions} />
                        <TransactionTable data={transactions} />
                    </>
                )}
                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    (isError || transactions.length === 0) && (
                        <NoDataFound message="No IB transactions found." />
                    )
                )}
            </div>

            <PaginationSelector
                currentPage={pageNumber}
                handlePageChange={handlePageChange}
                pageSize={pageSizeValue}
                handlePageSizeChange={handlePageSizeChange}
                totalCount={data?.pagination?.total || 1}
            />
        </motion.div>
    );
}

function IbContent({ activeView }: { activeView: IbActiveView }) {
    if (activeView.main === "earnings" && activeView.sub === "transactions") {
        return <IbTransactions />;
    }

    if (activeView.main === "earnings" && activeView.sub === "commission") {
        return <ReferralCommission />;
    }

    if (activeView.main === "referrals") {
        return <ReferralCommission />;
    }

    return <IbProfile />;
}

const IB: React.FC = () => {
    const [activeView, setActiveView] = useState<IbActiveView>({
        main: "profile",
        sub: null,
    });

    return (
        <MotionWrapper>
            <PageHeadline
                title="IB"
                subtitle="Track referral performance, commissions, and earning transactions."
            />
            <ButtonBar items={ibManagementList} onActiveChange={setActiveView} />
            <div className="p-3 sm:p-4">
                <IbContent activeView={activeView} />
            </div>
        </MotionWrapper>
    );
};

export default IB;
