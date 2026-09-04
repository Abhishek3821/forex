import type React from "react";
import { motion } from "framer-motion";
import { useUser } from "../constant/UserProvider";
import { containerVariants, rowVariants } from "../hooks/useAnimation";
import {
    useMasterLeaderboard,
    type MasterLeaderboardItem,
    type MasterMode,
} from "../hooks/useMaster";
import { usePagination } from "../hooks/usePagination";
import LoadingScreen from "./Loading";
import NoDataFound from "./NotFound";
import PaginationSelector from "../screens/PaginationSelector";
interface MasterLeaderboardProps {
    mode: MasterMode;
};
const formatPercent = (value?: number) => `${Number(value ?? 0).toFixed(2)}%`;
const formatAmount = (value?: number) =>
    Number(value ?? 0).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    });
const returnClassName = (value?: number) =>
    Number(value ?? 0) >= 0 ? "text-success" : "text-danger";

const rankClassName = (rank: number) => {
    if (rank === 1) return "bg-warning/10 text-warning";
    if (rank === 2) return "bg-primary/10 text-primary";
    if (rank === 3) return "bg-success/10 text-success";
    return "bg-surface text-text-secondary";
};

const FollowBadge = ({ item }: { item: MasterLeaderboardItem }) => {
    if (item.isSelf) {
        return (
            <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Your Account
            </span>
        );
    }

    return (
        <span
            className={`rounded px-2 py-1 text-xs font-medium ${item.following
                ? "bg-success/10 text-success"
                : "bg-surface text-text-muted"
                }`}
        >
            {item.following ? "Following" : "Not Following"}
        </span>
    );
};

const MasterLeaderboardCards = ({
    data,
    startItem,
}: {
    data: MasterLeaderboardItem[];
    startItem: number;
}) => (
    <div className="space-y-2">
        {data.map((item, index) => {
            const rank = startItem + index;
            return (
                <motion.div
                    key={item._id}
                    className="rounded-lg border border-border bg-card px-3 py-3 shadow-sm"
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold ${rankClassName(rank)}`}
                                >
                                    {rank}
                                </span>
                                <p className="truncate text-sm font-semibold text-text">
                                    {item.strategyName || "Master Strategy"}
                                </p>
                            </div>
                            <p className="mt-2 text-xs text-text-muted">
                                {item.followers} followers - AUM {formatAmount(item.aum)}
                            </p>
                        </div>
                        <FollowBadge item={item} />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded border border-border bg-surface px-2 py-2">
                            <p className="text-[11px] text-text-muted">7D</p>
                            <p className={`text-sm font-semibold ${returnClassName(item.seven_day_return)}`}>
                                {formatPercent(item.seven_day_return)}
                            </p>
                        </div>
                        <div className="rounded border border-border bg-surface px-2 py-2">
                            <p className="text-[11px] text-text-muted">Month</p>
                            <p className={`text-sm font-semibold ${returnClassName(item.current_month_return)}`}>
                                {formatPercent(item.current_month_return)}
                            </p>
                        </div>
                        <div className="rounded border border-border bg-surface px-2 py-2">
                            <p className="text-[11px] text-text-muted">Risk</p>
                            <p className="text-sm font-semibold text-text">
                                {formatPercent(item.riskFactor)}
                            </p>
                        </div>
                    </div>
                </motion.div>
            );
        })}
    </div>
);

const MasterLeaderboard: React.FC<MasterLeaderboardProps> = ({ mode }) => {
    const { activeTradeAccount } = useUser();
    const {
        handlePageChange,
        handlePageSizeChange,
        pageNumber,
        pageSizeValue,
        startItem,
    } = usePagination();
    const { data, isError, isLoading } = useMasterLeaderboard({
        mode,
        trade_user_id: activeTradeAccount?._id,
        pageNumber,
        pageSize: pageSizeValue,
    });

    return (
        <motion.div
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="custom-scrollbar h-[calc(100vh-350px)] overflow-auto">
                {!isError && data?.results?.length !== 0 && !isLoading && (
                    <div className="p-2 md:hidden">
                        <MasterLeaderboardCards
                            data={data?.results || []}
                            startItem={startItem}
                        />
                    </div>
                )}
                <table className="hidden min-w-full text-left text-sm text-text md:table">
                    <thead className="sticky top-0 z-40 border-b border-border bg-surface text-xs uppercase text-text-muted">
                        <tr>
                            <th className="px-4 py-3 text-nowrap">Rank</th>
                            <th className="px-4 py-3 text-nowrap">Strategy</th>
                            <th className="px-4 py-3 text-nowrap">Followers</th>
                            <th className="px-4 py-3 text-nowrap">7D Return</th>
                            <th className="px-4 py-3 text-nowrap">Month Return</th>
                            <th className="px-4 py-3 text-nowrap">AUM</th>
                            <th className="px-4 py-3 text-nowrap">Risk</th>
                            <th className="px-4 py-3 text-nowrap">Status</th>
                        </tr>
                    </thead>
                    {!isError && data?.results?.length !== 0 && !isLoading && (
                        <tbody className="divide-y divide-border">
                            {(data?.results || []).map((item, index) => {
                                const rank = startItem + index;
                                return (
                                    <motion.tr
                                        key={item._id}
                                        className="transition-colors duration-150 hover:bg-card-hover"
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={index}
                                    >
                                        <td className="px-4 py-3">
                                            <span
                                                className={`flex h-7 w-7 items-center justify-center rounded text-xs font-bold ${rankClassName(rank)}`}
                                            >
                                                {rank}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-text">
                                            {item.strategyName || "Master Strategy"}
                                        </td>
                                        <td className="px-4 py-3 text-text-secondary">
                                            {item.followers}
                                        </td>
                                        <td className={`px-4 py-3 font-semibold ${returnClassName(item.seven_day_return)}`}>
                                            {formatPercent(item.seven_day_return)}
                                        </td>
                                        <td className={`px-4 py-3 font-semibold ${returnClassName(item.current_month_return)}`}>
                                            {formatPercent(item.current_month_return)}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-text">
                                            {formatAmount(item.aum)}
                                        </td>
                                        <td className="px-4 py-3 text-text-secondary">
                                            {formatPercent(item.riskFactor)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <FollowBadge item={item} />
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    )}
                </table>
                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    (isError || data?.results?.length === 0) && <NoDataFound />
                )}
            </div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                <PaginationSelector
                    currentPage={pageNumber}
                    handlePageChange={handlePageChange}
                    pageSize={pageSizeValue}
                    handlePageSizeChange={handlePageSizeChange}
                    totalCount={data?.pagination?.total || 1}
                />
            </motion.div>
        </motion.div>
    );
};

export default MasterLeaderboard;
