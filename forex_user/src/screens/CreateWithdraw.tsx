import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useUser } from "../constant/UserProvider";
import { containerVariants } from "../hooks/useAnimation";
import { useCreateWithdraw } from "../hooks/useWithdraw";
type WithdrawMethod = "bank_transfer" | "upi" | "crypto";
interface WithdrawFormValues {
    trade_user_id: string;
    amount: number;
    paymentMethod: WithdrawMethod;
    remark: string;
    bankAccountNumber: string;
    ifscCode: string;
    bankName: string;
    upi_id: string;
    provider_name: string;
    network: string;
    address: string;
}

const formatAmount = (value?: number, currency = "USD") =>
    `${Number(value ?? 0).toFixed(2)} ${currency}`;

const CreateWithdraw: React.FC = () => {
    const {
        activeTradeAccount,
        tradeAccountList,
        user,
        refetchTradeAccounts,
    } = useUser();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<WithdrawFormValues>({
        defaultValues: {
            trade_user_id: activeTradeAccount?._id ?? "",
            amount: 0,
            paymentMethod: "bank_transfer",
            remark: "",
            bankAccountNumber: user?.bank?.bankAccountNumber ?? "",
            ifscCode: user?.bank?.ifscCode ?? "",
            bankName: user?.bank?.bankName ?? "",
            upi_id: user?.upi_details?.upi_id ?? user?.upi?.upi_id ?? "",
            provider_name:
                user?.upi_details?.provider_name ?? user?.upi?.provider_name ?? "",
            network: "USDT",
            address: "",
        },
    });
    const createWithdraw = useCreateWithdraw();
    const selectedAccountId = watch("trade_user_id");
    const paymentMethod = watch("paymentMethod");
    const selectedAccount =
        tradeAccountList.find((account) => account._id === selectedAccountId) ??
        activeTradeAccount;

    useEffect(() => {
        if (activeTradeAccount?._id) {
            setValue("trade_user_id", activeTradeAccount._id);
        }
    }, [activeTradeAccount?._id, setValue]);

    const onSubmit = async (values: WithdrawFormValues) => {
        try {
            const payload = {
                trade_user_id: values.trade_user_id,
                amount: Number(values.amount),
                paymentMethod: values.paymentMethod,
                remark: values.remark?.trim() || undefined,
                ...(values.paymentMethod === "bank_transfer" && {
                    bank_details: {
                        bankAccountNumber: values.bankAccountNumber,
                        ifscCode: values.ifscCode,
                        bankName: values.bankName,
                    },
                }),
                ...(values.paymentMethod === "upi" && {
                    upi_details: {
                        upi_id: values.upi_id,
                        provider_name: values.provider_name,
                    },
                }),
                ...(values.paymentMethod === "crypto" && {
                    crypto_details: {
                        currency: "USDT" as const,
                        network: values.network,
                        address: values.address,
                    },
                }),
            };
            const response = await createWithdraw.mutateAsync(payload);
            toast.success(response.message || "Withdrawal request created");
            reset({
                trade_user_id: activeTradeAccount?._id ?? values.trade_user_id,
                amount: 0,
                paymentMethod: values.paymentMethod,
                remark: "",
                bankAccountNumber: user?.bank?.bankAccountNumber ?? "",
                ifscCode: user?.bank?.ifscCode ?? "",
                bankName: user?.bank?.bankName ?? "",
                upi_id: user?.upi_details?.upi_id ?? user?.upi?.upi_id ?? "",
                provider_name:
                    user?.upi_details?.provider_name ?? user?.upi?.provider_name ?? "",
                network: "USDT",
                address: "",
            });
            refetchTradeAccounts();
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string; error?: string }>;
            toast.error(
                axiosError.response?.data?.message ||
                axiosError.response?.data?.error ||
                axiosError.message ||
                "Withdrawal request failed"
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
                                    !selectedAccount ||
                                    value <= selectedAccount.balance ||
                                    "Amount exceeds account balance",
                            })}
                        />
                        {errors.amount?.message && (
                            <p className="text-xs text-danger">{errors.amount.message}</p>
                        )}
                    </label>

                    <label className="space-y-2">
                        <span className="form-label">
                            Withdraw Method
                        </span>
                        <select className="form-input" {...register("paymentMethod")}>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="upi">UPI</option>
                            <option value="crypto">Crypto</option>
                        </select>
                    </label>

                    {paymentMethod === "bank_transfer" && (
                        <>
                            <label className="space-y-2">
                                <span className="form-label">
                                    Bank Account Number
                                </span>
                                <input
                                    className="form-input"
                                    {...register("bankAccountNumber", {
                                        required: "Bank account number is required",
                                    })}
                                />
                                {errors.bankAccountNumber?.message && (
                                    <p className="text-xs text-danger">
                                        {errors.bankAccountNumber.message}
                                    </p>
                                )}
                            </label>
                            <label className="space-y-2">
                                <span className="form-label">
                                    IFSC Code
                                </span>
                                <input
                                    className="form-input"
                                    {...register("ifscCode", {
                                        required: "IFSC code is required",
                                    })}
                                />
                                {errors.ifscCode?.message && (
                                    <p className="text-xs text-danger">
                                        {errors.ifscCode.message}
                                    </p>
                                )}
                            </label>
                            <label className="space-y-2">
                                <span className="form-label">
                                    Bank Name
                                </span>
                                <input
                                    className="form-input"
                                    {...register("bankName", {
                                        required: "Bank name is required",
                                    })}
                                />
                                {errors.bankName?.message && (
                                    <p className="text-xs text-danger">
                                        {errors.bankName.message}
                                    </p>
                                )}
                            </label>
                        </>
                    )}

                    {paymentMethod === "upi" && (
                        <>
                            <label className="space-y-2">
                                <span className="form-label">
                                    UPI ID
                                </span>
                                <input
                                    className="form-input"
                                    {...register("upi_id", {
                                        required: "UPI ID is required",
                                    })}
                                />
                                {errors.upi_id?.message && (
                                    <p className="text-xs text-danger">
                                        {errors.upi_id.message}
                                    </p>
                                )}
                            </label>
                            <label className="space-y-2">
                                <span className="form-label">
                                    Provider
                                </span>
                                <input className="form-input" {...register("provider_name")} />
                            </label>
                        </>
                    )}

                    {paymentMethod === "crypto" && (
                        <>
                            <label className="space-y-2">
                                <span className="form-label">
                                    Network
                                </span>
                                <input
                                    className="form-input"
                                    placeholder="TRC20 / ERC20"
                                    {...register("network", {
                                        required: "Network is required",
                                    })}
                                />
                                {errors.network?.message && (
                                    <p className="text-xs text-danger">
                                        {errors.network.message}
                                    </p>
                                )}
                            </label>
                            <label className="space-y-2 md:col-span-2">
                                <span className="form-label">
                                    Wallet Address
                                </span>
                                <input
                                    className="form-input"
                                    {...register("address", {
                                        required: "Wallet address is required",
                                    })}
                                />
                                {errors.address?.message && (
                                    <p className="text-xs text-danger">
                                        {errors.address.message}
                                    </p>
                                )}
                            </label>
                        </>
                    )}

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
                        Available Balance
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-text">
                        {formatAmount(selectedAccount?.balance, selectedAccount?.currency)}
                    </p>
                    <p className="mt-2 text-sm text-text-muted">
                        Withdrawal requests are submitted for approval after KYC checks.
                    </p>
                    <button
                        type="submit"
                        disabled={createWithdraw.isPending || !selectedAccount}
                        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            account_balance
                        </span>
                        {createWithdraw.isPending ? "Submitting..." : "Submit Withdrawal"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default CreateWithdraw;

