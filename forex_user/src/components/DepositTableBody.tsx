import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";
import type { Deposit, Withdraw } from "../interface/interface";
import { rowVariants } from "../hooks/useAnimation";
interface DepositTableBodyProps {
    data: Withdraw[] | Deposit[];
    isPending?: boolean;
    isWithdraw?: boolean
};

const statusClassName = (status: Deposit["status"] | Withdraw["status"]) =>
    `rounded px-2 py-1 text-xs font-medium ${status === "success"
        ? "bg-success/10 text-success"
        : status === "pending"
            ? "bg-warning/10 text-warning"
            : "bg-danger/10 text-danger"
    }`;

const getPaymentMode = (paymentMethod: Deposit["paymentMethod"] | Withdraw["paymentMethod"]) =>
    paymentMethod === "Direct" ? "Crypto" : paymentMethod || "N/A";

const getWithdrawDetails = (item: Withdraw) =>
    Object.entries(
        item.paymentMethod === "upi"
            ? item.upi_details ?? {}
            : item.paymentMethod === "bank_transfer"
                ? item.bank_details ?? {}
                : item.crypto_details ?? {}
    )
        .filter(([_, value]) => value)
        .filter(([_, value]) => !/^https?:\/\//i.test(String(value)));

const DetailItem = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="rounded-lg border border-border bg-surface px-3 py-2">
        <p className="text-xs text-text-muted">{label}</p>
        <div className="mt-1 break-words text-sm font-medium text-text">{value}</div>
    </div>
);

const DepositWithdrawTableBody: React.FC<DepositTableBodyProps> = ({ data, isPending, isWithdraw }) => {
    return (
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
                    <td className="px-4 py-3 font-semibold text-text">{index + 1}</td>
                    <td className="px-4 py-3 text-text">{item.transactionId}</td>
                    <td className="px-4 py-3 font-medium text-text text-nowrap">{item.currency || "USD"}</td>
                    {isWithdraw && (
                        <td className="px-4 py-3">
                            <div className="space-y-1 text-sm">
                                {getWithdrawDetails(item as Withdraw)
                                    .map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between gap-3">
                                            <span className="capitalize text-text-muted">
                                                {key.replace(/_/g, " ")}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-text">
                                                    {String(value)}
                                                </span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(String(value))}
                                                    className="text-text-muted transition hover:text-primary"
                                                    title="Copy"
                                                >
                                                    <span className="material-symbols-outlined text-base">
                                                        content_copy
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </td>
                    )}
                    <td className="px-4 py-3 font-semibold text-text">{item.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-text-secondary">{getPaymentMode(item.paymentMethod)}</td>
                    <td className="px-4 py-3 capitalize">
                        <span className={statusClassName(item.status)}>
                            {item.status}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                        {item.createdAt}
                    </td>
                    {
                        !isPending &&
                        <>
                            <td className="px-4 py-3 text-text-secondary">
                                {(item as Deposit).completedAt || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-text-secondary">{item.remark || "N/A"}</td>
                        </>
                    }
                </motion.tr>
            ))}
        </tbody>
    );
};

export const DepositWithdrawCards: React.FC<DepositTableBodyProps> = ({ data, isPending, isWithdraw }) => {
    const [selectedItem, setSelectedItem] = useState<Deposit | Withdraw | null>(null);

    return (
        <>
            <div className="space-y-2">
                {data.map((item, index) => (
                    <motion.button
                        key={item._id}
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="w-full rounded-lg border border-border bg-card px-3 py-3 text-left shadow-sm transition active:scale-[0.99]"
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-text">{item.transactionId}</p>
                                <p className="mt-1 text-xs text-text-muted">
                                    {getPaymentMode(item.paymentMethod)} - {item.createdAt}
                                </p>
                            </div>
                            <span className={statusClassName(item.status)}>{item.status}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-xs font-medium text-text-muted">#{index + 1}</span>
                            <span className="text-base font-semibold text-text">
                                {item.amount.toFixed(2)} {item.currency || "USD"}
                            </span>
                        </div>
                    </motion.button>
                ))}
            </div>

            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-[2px] md:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        onClick={() => setSelectedItem(null)}
                        aria-label="Close transaction details"
                    />
                    <motion.div
                        className="relative max-h-[86dvh] w-full overflow-hidden rounded-t-xl border-t border-border bg-card shadow-2xl"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                            <div className="min-w-0">
                                <p className="text-xs font-medium uppercase text-text-muted">
                                    {isWithdraw ? "Withdraw Details" : "Deposit Details"}
                                </p>
                                <p className="mt-1 break-all text-sm font-semibold text-text">
                                    {selectedItem.transactionId}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedItem(null)}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-text-muted transition hover:bg-card-hover hover:text-text"
                                aria-label="Close"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        <div className="custom-scrollbar max-h-[calc(86dvh-74px)] overflow-auto px-4 py-3">
                            <div className="grid grid-cols-2 gap-3">
                                <DetailItem label="Amount" value={`${selectedItem.amount.toFixed(2)} ${selectedItem.currency || "USD"}`} />
                                <DetailItem label="Status" value={<span className={statusClassName(selectedItem.status)}>{selectedItem.status}</span>} />
                                <DetailItem label="Payment Mode" value={getPaymentMode(selectedItem.paymentMethod)} />
                                <DetailItem label="Created At" value={selectedItem.createdAt} />
                                {!isPending && (
                                    <DetailItem label="Completed At" value={(selectedItem as Deposit).completedAt || "N/A"} />
                                )}
                                {!isPending && (
                                    <DetailItem label="Remark" value={selectedItem.remark || "N/A"} />
                                )}
                            </div>

                            {isWithdraw && (
                                <div className="mt-3 rounded-lg border border-border bg-surface px-3 py-2">
                                    <p className="text-xs font-medium uppercase text-text-muted">Withdraw Details</p>
                                    <div className="mt-2 space-y-2 text-sm">
                                        {getWithdrawDetails(selectedItem as Withdraw).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between gap-3">
                                                <span className="capitalize text-text-muted">{key.replace(/_/g, " ")}</span>
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <span className="break-all font-medium text-text">{String(value)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigator.clipboard.writeText(String(value))}
                                                        className="shrink-0 text-text-muted transition hover:text-primary"
                                                        title="Copy"
                                                    >
                                                        <span className="material-symbols-outlined text-base">content_copy</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default DepositWithdrawTableBody;
