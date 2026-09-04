import type React from "react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useUser } from "../constant/UserProvider";
import { containerVariants, rowVariants } from "../hooks/useAnimation";
import {
    useCreateInternalTransfer,
    useInternalTransferHistory,
    type IInternalTransfer,
} from "../hooks/useInternalTransfer";
import { usePagination } from "../hooks/usePagination";
import type { ITradeAccount } from "../interface/interface";
import LoadingScreen from "./Loading";
import NoDataFound from "./NotFound";
import PaginationSelector from "../screens/PaginationSelector";
type InternalTransferMode = "new" | "history";
interface InternalTransferProps {
    mode: InternalTransferMode;
};
interface TransferFormValues {
    sourceAccount: string;
    destinationAccount: string;
    amount: number;
    remark: string;
};
const formatAmount = (value?: number, currency = "USD") =>
    `${Number(value ?? 0).toFixed(2)} ${currency}`;
const getAccountLabel = (account?: ITradeAccount | null) => {
    if (!account) return "N/A";
    return `${account.accountID} - ${account.accountType.toUpperCase()}`;
};

const statusClassName = (status: IInternalTransfer["status"]) =>
    `rounded px-2 py-1 text-xs font-medium capitalize ${status === "completed"
        ? "bg-success/10 text-success"
        : status === "pending"
            ? "bg-warning/10 text-warning"
            : "bg-danger/10 text-danger"
    }`;

const TransferHistoryCards = ({ data }: { data: IInternalTransfer[] }) => (
    <div className="space-y-2">
        {data.map((item, index) => (
            <motion.div
                key={item._id ?? item.transactionId}
                className="rounded-lg border border-border bg-card px-3 py-3 shadow-sm"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                custom={index}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text">
                            {item.transactionId}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                            {getAccountLabel(item.sourceAccount)} to{" "}
                            {getAccountLabel(item.destinationAccount)}
                        </p>
                    </div>
                    <span className={statusClassName(item.status)}>
                        {item.status}
                    </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-text-muted">
                        #{index + 1}
                    </span>
                    <span className="text-base font-semibold text-text">
                        {formatAmount(item.amount, item.sourceAccount?.currency)}
                    </span>
                </div>
            </motion.div>
        ))}
    </div>
);

const InternalTransferHistory = () => {
    const { activeTradeAccount } = useUser();
    const {
        handlePageChange,
        handlePageSizeChange,
        pageNumber,
        pageSizeValue,
        startItem,
    } = usePagination();
    const { data, isError, isLoading } = useInternalTransferHistory(
        activeTradeAccount?._id,
        {
            pageNumber,
            pageSize: pageSizeValue,
        }
    );
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
                        <TransferHistoryCards data={data?.results || []} />
                    </div>
                )}
                <table className="hidden min-w-full text-left text-sm text-text md:table">
                    <thead className="sticky top-0 z-40 border-b border-border bg-surface text-xs uppercase text-text-muted">
                        <tr>
                            <th className="px-4 py-3 text-nowrap">S.N</th>
                            <th className="px-4 py-3 text-nowrap">Transaction ID</th>
                            <th className="px-4 py-3 text-nowrap">From</th>
                            <th className="px-4 py-3 text-nowrap">To</th>
                            <th className="px-4 py-3 text-nowrap">Amount</th>
                            <th className="px-4 py-3 text-nowrap">Fee</th>
                            <th className="px-4 py-3 text-nowrap">Type</th>
                            <th className="px-4 py-3 text-nowrap">Status</th>
                            <th className="px-4 py-3 text-nowrap">Created At</th>
                            <th className="px-4 py-3 text-nowrap">Remark</th>
                        </tr>
                    </thead>
                    {!isError && data?.results?.length !== 0 && !isLoading && (
                        <tbody className="divide-y divide-border">
                            {(data?.results || []).map((item, index) => (
                                <motion.tr
                                    key={item._id ?? item.transactionId}
                                    className="transition-colors duration-150 hover:bg-card-hover"
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={index}
                                >
                                    <td className="px-4 py-3 font-semibold text-text">
                                        {startItem + index}
                                    </td>
                                    <td className="px-4 py-3 text-text">
                                        {item.transactionId}
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary">
                                        {getAccountLabel(item.sourceAccount)}
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary">
                                        {getAccountLabel(item.destinationAccount)}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-text">
                                        {formatAmount(
                                            item.amount,
                                            item.sourceAccount?.currency
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary">
                                        {formatAmount(item.fee, item.sourceAccount?.currency)}
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary">
                                        {item.transferType?.replace(/_/g, " ") || "N/A"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={statusClassName(item.status)}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary">
                                        {item.createdAt}
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary">
                                        {item.remark || "N/A"}
                                    </td>
                                </motion.tr>
                            ))}
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

const InternalTransferForm = () => {
    const {
        activeTradeAccount,
        tradeAccountList,
        refetchTradeAccounts,
    } = useUser();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TransferFormValues>({
        defaultValues: {
            sourceAccount: activeTradeAccount?._id ?? "",
            destinationAccount: "",
            amount: 0,
            remark: "",
        },
    });
    const createTransfer = useCreateInternalTransfer();
    const sourceAccountId = watch("sourceAccount");
    const selectedSourceAccount = useMemo(
        () => tradeAccountList.find((account) => account._id === sourceAccountId),
        [sourceAccountId, tradeAccountList]
    );
    const destinationAccounts = useMemo(
        () =>
            tradeAccountList.filter(
                (account) =>
                    account._id !== selectedSourceAccount?._id &&
                    account.accountType === selectedSourceAccount?.accountType
            ),
        [selectedSourceAccount, tradeAccountList]
    );

    useEffect(() => {
        if (activeTradeAccount?._id) {
            setValue("sourceAccount", activeTradeAccount._id);
        }
    }, [activeTradeAccount?._id, setValue]);

    useEffect(() => {
        const firstDestination = destinationAccounts[0]?._id ?? "";
        setValue("destinationAccount", firstDestination);
    }, [destinationAccounts, setValue]);

    const onSubmit = async (values: TransferFormValues) => {
        try {
            const response = await createTransfer.mutateAsync({
                sourceAccount: values.sourceAccount,
                destinationAccount: values.destinationAccount,
                amount: Number(values.amount),
                remark: values.remark?.trim() || undefined,
            });
            toast.success(response.message || "Transfer created successfully");
            reset({
                sourceAccount: activeTradeAccount?._id ?? values.sourceAccount,
                destinationAccount: "",
                amount: 0,
                remark: "",
            });
            refetchTradeAccounts();
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string; error?: string }>;
            toast.error(
                axiosError.response?.data?.message ||
                axiosError.response?.data?.error ||
                axiosError.message ||
                "Transfer failed"
            );
        }
    };

    return (
        <motion.div
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                        <span className="form-label">
                            From Account
                        </span>
                        <select
                            className="form-input"
                            {...register("sourceAccount", {
                                required: "Source account is required",
                            })}
                        >
                            {tradeAccountList.map((account) => (
                                <option key={account._id} value={account._id}>
                                    {getAccountLabel(account)} -{" "}
                                    {formatAmount(account.balance, account.currency)}
                                </option>
                            ))}
                        </select>
                        {errors.sourceAccount?.message && (
                            <p className="text-xs text-danger">
                                {errors.sourceAccount.message}
                            </p>
                        )}
                    </label>

                    <label className="space-y-2">
                        <span className="form-label">
                            To Account
                        </span>
                        <select
                            className="form-input"
                            disabled={!destinationAccounts.length}
                            {...register("destinationAccount", {
                                required: "Destination account is required",
                            })}
                        >
                            {destinationAccounts.map((account) => (
                                <option key={account._id} value={account._id}>
                                    {getAccountLabel(account)} -{" "}
                                    {formatAmount(account.balance, account.currency)}
                                </option>
                            ))}
                        </select>
                        {errors.destinationAccount?.message && (
                            <p className="text-xs text-danger">
                                {errors.destinationAccount.message}
                            </p>
                        )}
                    </label>

                    <label className="space-y-2">
                        <span className="form-label">
                            Amount
                        </span>
                        <input
                            type="number"
                            step="0.01"
                            min="1"
                            className="form-input"
                            {...register("amount", {
                                required: "Amount is required",
                                valueAsNumber: true,
                                min: {
                                    value: 1,
                                    message: "Amount must be greater than 0",
                                },
                                validate: (value) =>
                                    !selectedSourceAccount ||
                                    value <= selectedSourceAccount.balance ||
                                    "Amount exceeds source account balance",
                            })}
                        />
                        {errors.amount?.message && (
                            <p className="text-xs text-danger">{errors.amount.message}</p>
                        )}
                    </label>

                    <label className="space-y-2 md:col-span-2">
                        <span className="form-label">
                            Remark
                        </span>
                        <textarea
                            className="form-textarea"
                            placeholder="Optional note"
                            {...register("remark")}
                        />
                    </label>
                </div>

                <div className="rounded-lg border border-border bg-surface p-3">
                    <p className="text-xs font-medium uppercase text-text-muted">
                        Source Balance
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-text">
                        {formatAmount(
                            selectedSourceAccount?.balance,
                            selectedSourceAccount?.currency
                        )}
                    </p>
                    <p className="mt-2 text-sm text-text-muted">
                        Transfers are available between accounts with the same type.
                    </p>
                    <button
                        type="submit"
                        disabled={
                            createTransfer.isPending ||
                            !tradeAccountList.length ||
                            !destinationAccounts.length
                        }
                        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            swap_horiz
                        </span>
                        {createTransfer.isPending ? "Submitting..." : "Submit Transfer"}
                    </button>
                    {!destinationAccounts.length && (
                        <p className="mt-3 text-xs text-warning">
                            Add another {selectedSourceAccount?.accountType || "same type"} account
                            to transfer internally.
                        </p>
                    )}
                </div>
            </form>
        </motion.div>
    );
};
const InternalTransfer: React.FC<InternalTransferProps> = ({ mode }) => {
    if (mode === "history") {
        return <InternalTransferHistory />;
    };
    return <InternalTransferForm />;
};
export default InternalTransfer;

