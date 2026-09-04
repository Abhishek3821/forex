import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useUser } from "../constant/UserProvider";
import { containerVariants } from "../hooks/useAnimation";
import {
    useCreateDeposit,
    useMerchantAccounts,
} from "../hooks/useDeposit";
import type { companyMerchantInterface } from "../interface/interface";
import LoadingScreen from "../components/Loading";
import NoDataFound from "../components/NotFound";

type MerchantPaymentMode = companyMerchantInterface["paymentMethod"] | "Crypto";
type MerchantAccount = Omit<companyMerchantInterface, "paymentMethod"> & {
    paymentMethod: MerchantPaymentMode;
    rate?: number;
};

interface DepositFormValues {
    trade_user_id: string;
    amount: number;
    utr_number: string;
}

const formatAmount = (value?: number, currency = "USD") =>
    `${Number(value ?? 0).toFixed(2)} ${currency}`;

const paymentIconMap: Record<MerchantPaymentMode, string> = {
    bank_transfer: "account_balance",
    UPI: "qr_code_2",
    Crypto: "currency_bitcoin",
};

const getPaymentName = (merchant: MerchantAccount) => {
    if (merchant.paymentMethod === "bank_transfer") {
        return merchant.bank_details?.bank_name || "Bank Transfer";
    }
    if (merchant.paymentMethod === "UPI") {
        return merchant.upi_details?.provider_name || "UPI";
    }
    return merchant.crypto_detials?.provider_name || "Crypto";
};

const getPaymentLabel = (paymentMethod: MerchantPaymentMode) =>
    paymentMethod === "bank_transfer" ? "Bank Transfer" : paymentMethod;

const getMerchantDetails = (merchant: MerchantAccount) => {
    if (merchant.paymentMethod === "bank_transfer") {
        return {
            "Account Holder": merchant.bank_details?.account_holder,
            "Account Number": merchant.bank_details?.account_number,
            "IFSC Code": merchant.bank_details?.ifsc_code,
            "Bank Name": merchant.bank_details?.bank_name,
            IBAN: merchant.bank_details?.IBAN,
        };
    }

    if (merchant.paymentMethod === "UPI") {
        return {
            "UPI ID": merchant.upi_details?.upi_id,
            Provider: merchant.upi_details?.provider_name,
        };
    }

    return {
        Provider: merchant.crypto_detials?.provider_name,
        Link: merchant.crypto_detials?.link,
    };
};

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null;

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
            <span className="text-xs font-medium text-text-muted">{label}</span>
            <div className="flex min-w-0 items-center gap-2">
                <span className="break-all text-right text-sm font-semibold text-text">
                    {value}
                </span>
                <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(value)}
                    className="shrink-0 text-text-muted transition hover:text-primary"
                    title="Copy"
                >
                    <span className="material-symbols-outlined text-base">content_copy</span>
                </button>
            </div>
        </div>
    );
};

const MerchantCard = ({
    merchant,
    isSelected,
    onSelect,
}: {
    merchant: MerchantAccount;
    isSelected: boolean;
    onSelect: () => void;
}) => (
    <button
        type="button"
        onClick={onSelect}
        className={`flex min-h-24 w-full items-start gap-3 rounded-lg border p-3 text-left shadow-sm transition ${isSelected
            ? "border-primary bg-primary/10"
            : "border-border bg-card hover:border-primary/35 hover:bg-card-hover"
            }`}
    >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
            <span className="material-symbols-outlined text-[22px]">
                {paymentIconMap[merchant.paymentMethod]}
            </span>
        </span>
        <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-text">
                {getPaymentName(merchant)}
            </span>
            <span className="mt-1 block text-xs font-medium text-text-muted">
                {getPaymentLabel(merchant.paymentMethod)}
            </span>
            <span className="mt-2 block text-xs text-text-muted">
                Limit: {formatAmount(merchant.minDeposit, merchant.currency)} to{" "}
                {formatAmount(merchant.maxDeposit, merchant.currency)}
            </span>
        </span>
    </button>
);

const CreateDeposit: React.FC = () => {
    const { activeTradeAccount, tradeAccountList, refetchTradeAccounts } = useUser();
    const [selectedMerchantId, setSelectedMerchantId] = useState("");
    const merchantQuery = useMerchantAccounts({ pageSize: 100 });
    const createDeposit = useCreateDeposit();
    const merchants = useMemo(
        () => (merchantQuery.data?.results || []) as MerchantAccount[],
        [merchantQuery.data?.results]
    );
    const selectedMerchant =
        merchants.find((merchant) => merchant._id === selectedMerchantId) ?? null;
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<DepositFormValues>({
        defaultValues: {
            trade_user_id: activeTradeAccount?._id ?? "",
            amount: 0,
            utr_number: "",
        },
    });
    const selectedAccountId = watch("trade_user_id");
    const selectedAccount =
        tradeAccountList.find((account) => account._id === selectedAccountId) ??
        activeTradeAccount;
    const isReferenceRequired =
        selectedMerchant?.paymentMethod === "bank_transfer" ||
        selectedMerchant?.paymentMethod === "Crypto";

    useEffect(() => {
        if (!selectedMerchantId && merchants[0]?._id) {
            setSelectedMerchantId(merchants[0]._id);
        }
    }, [merchants, selectedMerchantId]);

    useEffect(() => {
        if (activeTradeAccount?._id) {
            setValue("trade_user_id", activeTradeAccount._id);
        }
    }, [activeTradeAccount?._id, setValue]);

    const onSubmit = async (values: DepositFormValues) => {
        if (!selectedMerchant) {
            toast.error("Please select a payment account");
            return;
        }

        try {
            const response = await createDeposit.mutateAsync({
                trade_user_id: values.trade_user_id,
                amount: Number(values.amount),
                merchant_id: selectedMerchant._id,
                payment_mode: selectedMerchant.paymentMethod,
                gateway_name: "manual",
                utr_number: values.utr_number?.trim() || undefined,
            });
            toast.success(response.message || "Deposit request created");
            reset({
                trade_user_id: activeTradeAccount?._id ?? values.trade_user_id,
                amount: 0,
                utr_number: "",
            });
            refetchTradeAccounts();
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string | string[]; error?: string }>;
            const message = axiosError.response?.data?.message;
            toast.error(
                (Array.isArray(message) ? message.join(", ") : message) ||
                axiosError.response?.data?.error ||
                axiosError.message ||
                "Deposit request failed"
            );
        }
    };

    if (merchantQuery.isLoading) {
        return <LoadingScreen />;
    }

    if (merchantQuery.isError || !merchants.length) {
        return <NoDataFound message="No payment accounts found." />;
    }

    return (
        <motion.div
            className="grid gap-4 lg:grid-cols-[340px_1fr]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <section className="rounded-xl border border-border bg-card p-3 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-text">Payment Accounts</p>
                        <p className="text-xs text-text-muted">Select a method to deposit</p>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-primary">
                        payments
                    </span>
                </div>
                <div className="custom-scrollbar max-h-[calc(100vh-360px)] space-y-2 overflow-auto">
                    {merchants.map((merchant) => (
                        <MerchantCard
                            key={merchant._id}
                            merchant={merchant}
                            isSelected={merchant._id === selectedMerchant?._id}
                            onSelect={() => setSelectedMerchantId(merchant._id)}
                        />
                    ))}
                </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-text">
                            {selectedMerchant ? getPaymentName(selectedMerchant) : "Deposit"}
                        </p>
                        <p className="text-xs text-text-muted">
                            {selectedMerchant
                                ? getPaymentLabel(selectedMerchant.paymentMethod)
                                : "Select a payment account"}
                        </p>
                    </div>
                    {selectedMerchant?.rate && (
                        <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                            Rate {selectedMerchant.rate}
                        </span>
                    )}
                </div>

                {selectedMerchant && (
                    <div className="mb-4 grid gap-2 md:grid-cols-2">
                        {Object.entries(getMerchantDetails(selectedMerchant)).map(([label, value]) => (
                            <DetailRow key={label} label={label} value={value} />
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                        <span className="form-label">
                            Trade Account
                        </span>
                        <select
                            className="form-input"
                            {...register("trade_user_id", {
                                required: "Trade account is required",
                            })}
                        >
                            {tradeAccountList.map((account) => (
                                <option key={account._id} value={account._id}>
                                    {account.accountID} - {account.accountType.toUpperCase()} -{" "}
                                    {formatAmount(account.balance, account.currency)}
                                </option>
                            ))}
                        </select>
                        {errors.trade_user_id?.message && (
                            <p className="text-xs text-danger">
                                {errors.trade_user_id.message}
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
                            min={selectedMerchant?.minDeposit ?? 1}
                            className="form-input"
                            {...register("amount", {
                                required: "Amount is required",
                                valueAsNumber: true,
                                min: {
                                    value: selectedMerchant?.minDeposit ?? 1,
                                    message: `Minimum deposit is ${formatAmount(
                                        selectedMerchant?.minDeposit,
                                        selectedMerchant?.currency
                                    )}`,
                                },
                                max: selectedMerchant?.maxDeposit
                                    ? {
                                        value: selectedMerchant.maxDeposit,
                                        message: `Maximum deposit is ${formatAmount(
                                            selectedMerchant.maxDeposit,
                                            selectedMerchant.currency
                                        )}`,
                                    }
                                    : undefined,
                            })}
                        />
                        {errors.amount?.message && (
                            <p className="text-xs text-danger">{errors.amount.message}</p>
                        )}
                    </label>

                    <label className="space-y-2 md:col-span-2">
                        <span className="form-label">
                            Payment Reference
                        </span>
                        <input
                            className="form-input"
                            placeholder={
                                isReferenceRequired
                                    ? "Enter UTR / transaction reference"
                                    : "Optional transaction reference"
                            }
                            {...register("utr_number", {
                                validate: (value) =>
                                    !isReferenceRequired ||
                                    !!value?.trim() ||
                                    "Payment reference is required",
                            })}
                        />
                        {errors.utr_number?.message && (
                            <p className="text-xs text-danger">
                                {errors.utr_number.message}
                            </p>
                        )}
                    </label>

                    <div className="rounded-lg border border-border bg-surface p-3 md:col-span-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium uppercase text-text-muted">
                                    Selected Account Balance
                                </p>
                                <p className="mt-1 text-lg font-semibold text-text">
                                    {formatAmount(
                                        selectedAccount?.balance,
                                        selectedAccount?.currency
                                    )}
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={createDeposit.isPending || !selectedMerchant}
                                className="flex h-10 min-w-44 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    add_card
                                </span>
                                {createDeposit.isPending ? "Submitting..." : "Submit Deposit"}
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </motion.div>
    );
};

export default CreateDeposit;

