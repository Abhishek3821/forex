import { motion } from "framer-motion";
import { usePagination } from "../hooks/usePagination";
import DepositWithdrawTableBody, { DepositWithdrawCards } from "./DepositTableBody";
import { containerVariants } from "../hooks/useAnimation";
import LoadingScreen from "./Loading";
import NoDataFound from "./NotFound";
import PaginationSelector from "../screens/PaginationSelector";
import { useDepositsData } from "../hooks/useDeposit";
export interface DepositProps {
    status?: 'pending' | 'success' | 'failed' | 'rejected' | ""
};
const DepositList: React.FC<DepositProps> = ({ status }) => {
    const { handlePageChange, handlePageSizeChange, pageNumber, pageSizeValue } =
        usePagination();
    const { data, isError, isLoading } = useDepositsData({
        pageNumber: pageNumber,
        pageSize: pageSizeValue,
        status
    })
    return (
        <motion.div
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="custom-scrollbar h-[calc(100vh-350px)] overflow-auto">
                {!isError && data?.results?.length != 0 && !isLoading && (
                    <div className="p-2 md:hidden">
                        <DepositWithdrawCards data={data?.results || []} />
                    </div>
                )}
                <table className="hidden min-w-full text-left text-sm text-text md:table">
                    <thead className="sticky top-0 z-40 border-b border-border bg-surface text-xs uppercase text-text-muted">
                        <tr>
                            <th className="px-4 py-3 text-nowrap">S.N</th>
                            <th className="px-4 py-3 text-nowrap">Transaction ID</th>
                            <th className="px-4 py-3 text-nowrap">Currency</th>
                            <th className="px-4 py-3 text-nowrap">Amount</th>
                            <th className="px-4 py-3 text-nowrap">Payment Mode</th>
                            <th className="px-4 py-3 text-nowrap">Status</th>
                            <th className="px-4 py-3 text-nowrap">Created At</th>
                            <th className="px-4 py-3 text-nowrap">Completed At</th>
                            <th className="px-4 py-3 text-nowrap">Remark</th>
                        </tr>
                    </thead>
                    {!isError && data?.results?.length != 0 && !isLoading && (
                        <DepositWithdrawTableBody data={data?.results || []} />
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

export default DepositList;
