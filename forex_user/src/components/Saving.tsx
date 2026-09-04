import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import MotionWrapper from "../screens/Motion";
import PageHeadline from "./PageHeadline";
import ButtonBar from "../screens/ButtonBar";
import PaginationSelector from "../screens/PaginationSelector";
import LoadingScreen from "./Loading";
import NoDataFound from "./NotFound";
import { savingManagementList } from "../constant";
import { containerVariants, rowVariants } from "../hooks/useAnimation";
import { usePagination } from "../hooks/usePagination";
import {
    type SavingInvestment,
    type SavingPackage,
    type SavingReferCommission,
    type SavingTransaction,
    useSavingInvestments,
    useSavingPackages,
    useSavingReferCommission,
    useSavingTransactions,
    useSavingWallet,
} from "../hooks/useSaving";

type SavingActiveView = {
    main: string | null;
    sub: string | null;
};

const formatAmount = (value?: number, currency = "USD") =>
    `${Number(value ?? 0).toFixed(2)} ${currency}`;

const statusClassName = (status?: string) =>
    `rounded px-2 py-1 text-xs font-medium capitalize ${status === "active" || status === "running" || status === "credit"
        ? "bg-success/10 text-success"
        : status === "pending"
            ? "bg-warning/10 text-warning"
            : "bg-danger/10 text-danger"
    }`;

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

function WalletView({
    mode = "saving",
    title = "Saving Wallet",
}: {
    mode?: string;
    title?: string;
}) {
    const { data, isLoading, isError } = useSavingWallet(mode);
    const wallet = data?.result;

    if (isLoading) return <LoadingScreen />;
    if (isError || !wallet) return <NoDataFound message={`${title} not found.`} />;

    return (
        <motion.div
            className="grid gap-3 lg:grid-cols-[1.2fr_1fr]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <section className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase text-text-muted">
                            {title}
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tabular-nums text-text">
                            {formatAmount(wallet.amount)}
                        </h2>
                        <p className="mt-1 text-xs text-text-muted">
                            Last updated {wallet.updatedAt}
                        </p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[22px]">
                            savings
                        </span>
                    </span>
                </div>
            </section>

            <section className="grid grid-cols-2 gap-2">
                <SummaryCard label="Mode" value={wallet.type} icon="account_balance" />
                <SummaryCard label="Balance" value={formatAmount(wallet.amount)} icon="payments" />
                <SummaryCard label="Created" value={wallet.createdAt} icon="event" />
                <SummaryCard label="Status" value="Active" icon="verified" />
            </section>
        </motion.div>
    );
}

function SavingProfile() {
    return <WalletView mode="saving" title="Saving Wallet" />;
}

function PlansView() {
    const { handlePageChange, handlePageSizeChange, pageNumber, pageSizeValue } =
        usePagination();
    const { data, isLoading, isError } = useSavingPackages({
        pageNumber,
        pageSize: pageSizeValue,
    });
    const packages = data?.results || [];

    return (
        <motion.div
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="custom-scrollbar h-[calc(100vh-350px)] overflow-auto">
                {!isError && packages.length > 0 && !isLoading && (
                    <>
                        <PackageCards data={packages} />
                        <PackageTable data={packages} />
                    </>
                )}
                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    (isError || packages.length === 0) && (
                        <NoDataFound message="No saving packages found." />
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

function PackageCards({ data }: { data: SavingPackage[] }) {
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
                        <div>
                            <p className="text-sm font-semibold text-text">{item.name}</p>
                            <p className="mt-1 text-xs text-text-muted">{item.roiType}</p>
                        </div>
                        <span className={statusClassName(item.status)}>{item.status}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <SummaryMini label="Amount" value={formatAmount(item.amount)} />
                        <SummaryMini label="ROI" value={`${item.roiPercentage}%`} />
                        <SummaryMini label="Lock In" value={`${item.lockInPeriod} days`} />
                        <SummaryMini label="Level Comm." value={`${item.first_level_comm_per}%`} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function PackageTable({ data }: { data: SavingPackage[] }) {
    return (
        <table className="hidden min-w-full text-left text-sm text-text md:table">
            <thead className="sticky top-0 z-40 border-b border-border bg-surface text-xs uppercase text-text-muted">
                <tr>
                    <th className="px-4 py-3 text-nowrap">S.N</th>
                    <th className="px-4 py-3 text-nowrap">Name</th>
                    <th className="px-4 py-3 text-nowrap">Amount</th>
                    <th className="px-4 py-3 text-nowrap">ROI Type</th>
                    <th className="px-4 py-3 text-nowrap">ROI</th>
                    <th className="px-4 py-3 text-nowrap">Lock In</th>
                    <th className="px-4 py-3 text-nowrap">Auto Profit</th>
                    <th className="px-4 py-3 text-nowrap">Level Comm.</th>
                    <th className="px-4 py-3 text-nowrap">Status</th>
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
                        <td className="px-4 py-3 font-semibold">{item.name}</td>
                        <td className="px-4 py-3 tabular-nums">{formatAmount(item.amount)}</td>
                        <td className="px-4 py-3">{item.roiType}</td>
                        <td className="px-4 py-3 font-semibold">{item.roiPercentage}%</td>
                        <td className="px-4 py-3">{item.lockInPeriod} days</td>
                        <td className="px-4 py-3">{item.autoProfitGeneration ? "Yes" : "No"}</td>
                        <td className="px-4 py-3">{item.first_level_comm_per}%</td>
                        <td className="px-4 py-3"><span className={statusClassName(item.status)}>{item.status}</span></td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    );
}

function SummaryMini({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded border border-border bg-surface px-2 py-1">
            <span className="text-text-muted">{label}</span>
            <p className="truncate font-semibold text-text">{value}</p>
        </div>
    );
}

function TransactionsView({
    mode = "saving",
    emptyMessage = "No saving transactions found.",
}: {
    mode?: string;
    emptyMessage?: string;
}) {
    const { handlePageChange, handlePageSizeChange, pageNumber, pageSizeValue } =
        usePagination();
    const { data, isLoading, isError } = useSavingTransactions({
        pageNumber,
        pageSize: pageSizeValue,
        mode,
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
                        <NoDataFound message={emptyMessage} />
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

function ReferCommissionCards({ data }: { data: SavingReferCommission[] }) {
    return (
        <div className="space-y-2 p-3 md:hidden">
            {data.map((item, index) => {
                const amount =
                    item.totalCommissionAmount ??
                    item.commissionAmount ??
                    item.commission ??
                    item.amount ??
                    0;

                return (
                    <motion.div
                        key={item._id || `${item.userId}-${item.level}-${index}`}
                        className="rounded-lg border border-border bg-card p-3 shadow-sm"
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-text">
                                    {item.name || item.userId || "Referral"}
                                </p>
                                <p className="mt-1 text-xs text-text-muted">
                                    Level {item.level ?? "N/A"} - {item.trade_accountId || item.accountId || "N/A"}
                                </p>
                            </div>
                            <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                {formatAmount(amount)}
                            </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <SummaryMini label="Lot" value={String(item.totalLot ?? item.lot ?? 0)} />
                            <SummaryMini label="Date" value={item.createdAt || "N/A"} />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

function ReferCommissionTable({ data }: { data: SavingReferCommission[] }) {
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
                    <th className="px-4 py-3 text-nowrap">Lot</th>
                    <th className="px-4 py-3 text-nowrap">Commission</th>
                    <th className="px-4 py-3 text-nowrap">Created At</th>
                    <th className="px-4 py-3 text-nowrap">Remark</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {data.map((item, index) => {
                    const amount =
                        item.totalCommissionAmount ??
                        item.commissionAmount ??
                        item.commission ??
                        item.amount ??
                        0;

                    return (
                        <motion.tr
                            key={item._id || `${item.userId}-${item.level}-${index}`}
                            className="transition-colors duration-150 hover:bg-card-hover"
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                        >
                            <td className="px-4 py-3 font-semibold">{index + 1}</td>
                            <td className="px-4 py-3 font-semibold">{item.name || "N/A"}</td>
                            <td className="px-4 py-3">{item.userId || item.referred_user_id || "N/A"}</td>
                            <td className="px-4 py-3">{item.accountId || "N/A"}</td>
                            <td className="px-4 py-3">{item.trade_accountId || "N/A"}</td>
                            <td className="px-4 py-3">{item.level ?? "N/A"}</td>
                            <td className="px-4 py-3 tabular-nums">{item.totalLot ?? item.lot ?? 0}</td>
                            <td className="px-4 py-3 font-semibold tabular-nums">{formatAmount(amount)}</td>
                            <td className="px-4 py-3 text-text-secondary">{item.createdAt || "N/A"}</td>
                            <td className="px-4 py-3 text-text-secondary">{item.remark || "N/A"}</td>
                        </motion.tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function ReferCommissionView() {
    const { handlePageChange, handlePageSizeChange, pageNumber, pageSizeValue } =
        usePagination();
    const { data, isLoading, isError } = useSavingReferCommission({
        pageNumber,
        pageSize: pageSizeValue,
        max_level: 4,
    });
    const commissions = data?.results || data?.data || [];

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
                    value={String(data?.summary?.totalLot ?? 0)}
                    icon="bar_chart"
                />
                <SummaryCard
                    label="Commission"
                    value={formatAmount(data?.summary?.totalCommission)}
                    icon="payments"
                />
            </div>
            <div className="custom-scrollbar h-[calc(100vh-420px)] overflow-auto">
                {!isError && commissions.length > 0 && !isLoading && (
                    <>
                        <ReferCommissionCards data={commissions} />
                        <ReferCommissionTable data={commissions} />
                    </>
                )}
                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    (isError || commissions.length === 0) && (
                        <NoDataFound message="No saving referral commission found." />
                    )
                )}
            </div>
            <PaginationSelector
                currentPage={pageNumber}
                handlePageChange={handlePageChange}
                pageSize={pageSizeValue}
                handlePageSizeChange={handlePageSizeChange}
                totalCount={data?.pagination?.total || commissions.length || 1}
            />
        </motion.div>
    );
}

function TransactionCards({ data }: { data: SavingTransaction[] }) {
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
                            <p className="truncate text-sm font-semibold text-text">{item.transaction_id}</p>
                            <p className="mt-1 text-xs text-text-muted">{item.createdAt}</p>
                        </div>
                        <span className={statusClassName(item.type)}>{item.type}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs text-text-muted">{item.remark || item.source_path}</span>
                        <span className="text-base font-semibold text-text">{formatAmount(item.net_amount)}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function TransactionTable({ data }: { data: SavingTransaction[] }) {
    return (
        <table className="hidden min-w-full text-left text-sm text-text md:table">
            <thead className="sticky top-0 z-40 border-b border-border bg-surface text-xs uppercase text-text-muted">
                <tr>
                    <th className="px-4 py-3 text-nowrap">S.N</th>
                    <th className="px-4 py-3 text-nowrap">Transaction ID</th>
                    <th className="px-4 py-3 text-nowrap">Wallet</th>
                    <th className="px-4 py-3 text-nowrap">Type</th>
                    <th className="px-4 py-3 text-nowrap">Amount</th>
                    <th className="px-4 py-3 text-nowrap">Tax</th>
                    <th className="px-4 py-3 text-nowrap">Net Amount</th>
                    <th className="px-4 py-3 text-nowrap">Prev Balance</th>
                    <th className="px-4 py-3 text-nowrap">Current Balance</th>
                    <th className="px-4 py-3 text-nowrap">Remark</th>
                    <th className="px-4 py-3 text-nowrap">Created At</th>
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
                        <td className="px-4 py-3 capitalize">{item.wallet_type}</td>
                        <td className="px-4 py-3"><span className={statusClassName(item.type)}>{item.type}</span></td>
                        <td className="px-4 py-3">{formatAmount(item.amount)}</td>
                        <td className="px-4 py-3">{formatAmount(item.tax)}</td>
                        <td className="px-4 py-3 font-semibold">{formatAmount(item.net_amount)}</td>
                        <td className="px-4 py-3">{formatAmount(item.prev_balance)}</td>
                        <td className="px-4 py-3">{formatAmount(item.current_balance)}</td>
                        <td className="px-4 py-3">{item.remark || "N/A"}</td>
                        <td className="px-4 py-3 text-text-secondary">{item.createdAt}</td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    );
}

function PortfolioView() {
    const { handlePageChange, handlePageSizeChange, pageNumber, pageSizeValue } =
        usePagination();
    const { data, isLoading, isError } = useSavingInvestments({
        pageNumber,
        pageSize: pageSizeValue,
    });
    const investments = data?.results || [];

    return (
        <motion.div
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="custom-scrollbar h-[calc(100vh-350px)] overflow-auto">
                {!isError && investments.length > 0 && !isLoading && (
                    <>
                        <InvestmentCards data={investments} />
                        <InvestmentTable data={investments} />
                    </>
                )}
                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    (isError || investments.length === 0) && (
                        <NoDataFound message="No saving investments found." />
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

function InvestmentCards({ data }: { data: SavingInvestment[] }) {
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
                            <p className="truncate text-sm font-semibold text-text">{item.transaction_id}</p>
                            <p className="mt-1 text-xs text-text-muted">{item.roiType}</p>
                        </div>
                        <span className={statusClassName(item.investmentStatus)}>{item.investmentStatus}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <SummaryMini label="Invested" value={formatAmount(item.investedAmount)} />
                        <SummaryMini label="Profit" value={formatAmount(item.totalProfitEarned)} />
                        <SummaryMini label="ROI" value={`${item.roiPercentage}%`} />
                        <SummaryMini label="Return" value={formatAmount(item.total_return_amount)} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function InvestmentTable({ data }: { data: SavingInvestment[] }) {
    return (
        <table className="hidden min-w-full text-left text-sm text-text md:table">
            <thead className="sticky top-0 z-40 border-b border-border bg-surface text-xs uppercase text-text-muted">
                <tr>
                    <th className="px-4 py-3 text-nowrap">S.N</th>
                    <th className="px-4 py-3 text-nowrap">Transaction ID</th>
                    <th className="px-4 py-3 text-nowrap">Invested</th>
                    <th className="px-4 py-3 text-nowrap">ROI Type</th>
                    <th className="px-4 py-3 text-nowrap">ROI</th>
                    <th className="px-4 py-3 text-nowrap">Profit</th>
                    <th className="px-4 py-3 text-nowrap">Return</th>
                    <th className="px-4 py-3 text-nowrap">Duration</th>
                    <th className="px-4 py-3 text-nowrap">Status</th>
                    <th className="px-4 py-3 text-nowrap">Start Date</th>
                    <th className="px-4 py-3 text-nowrap">End Date</th>
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
                        <td className="px-4 py-3 font-semibold">{formatAmount(item.investedAmount)}</td>
                        <td className="px-4 py-3">{item.roiType}</td>
                        <td className="px-4 py-3">{item.roiPercentage}%</td>
                        <td className="px-4 py-3 text-success">{formatAmount(item.totalProfitEarned)}</td>
                        <td className="px-4 py-3 font-semibold">{formatAmount(item.total_return_amount)}</td>
                        <td className="px-4 py-3">{item.duration}</td>
                        <td className="px-4 py-3"><span className={statusClassName(item.investmentStatus)}>{item.investmentStatus}</span></td>
                        <td className="px-4 py-3 text-text-secondary">{item.startDate}</td>
                        <td className="px-4 py-3 text-text-secondary">{item.endDate}</td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    );
}

function SavingContent({ activeView }: { activeView: SavingActiveView }) {
    if (activeView.main === "invest" && activeView.sub === "portfolio") {
        return <PortfolioView />;
    }

    if (activeView.main === "invest" && activeView.sub === "transactions") {
        return <TransactionsView />;
    }

    if (activeView.main === "invest") {
        return <PlansView />;
    }

    if (activeView.main === "earnings" && activeView.sub === "transactions") {
        return (
            <TransactionsView
                mode="commission"
                emptyMessage="No commission transactions found."
            />
        );
    }

    if (activeView.main === "earnings" && activeView.sub === "history") {
        return <ReferCommissionView />;
    }

    if (activeView.main === "earnings") {
        return <WalletView mode="commission" title="Commission Wallet" />;
    }

    return <SavingProfile />;
}

const Saving: React.FC = () => {
    const [activeView, setActiveView] = useState<SavingActiveView>({
        main: "profile",
        sub: null,
    });

    return (
        <MotionWrapper>
            <PageHeadline
                title="Saving"
                subtitle="Track your saving wallet, plans, investments, and transactions."
            />
            <ButtonBar
                items={savingManagementList}
                onActiveChange={setActiveView}
            />
            <div className="p-3 sm:p-4">
                <SavingContent activeView={activeView} />
            </div>
        </MotionWrapper>
    );
};

export default Saving;
