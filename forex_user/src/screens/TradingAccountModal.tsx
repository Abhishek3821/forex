import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { ITradeAccount } from "../interface/interface";
import { useCompanyGroupList } from "../hooks/useCompanyGroup";
import { useUserTradeAccountAction } from "../hooks/useUsers";
import { createMutationHandlers } from "../utils/hanldleQueryResponse";

type TradeAccountFormProps = {
    isOpen: boolean;
    isAdd?: boolean;
    closeModal: () => void;
    refetch?: () => void;
};

type TradeAccountFormValues = Pick<
    ITradeAccount,
    "accountType" | "currency" | "group" | "leverage"
>;

const currencyOptions: ITradeAccount["currency"][] = ["USD", "EURO", "GBP"];
const accountTypeOptions: ITradeAccount["accountType"][] = ["demo", "live"];

export default function EditTradeAccountModel({
    isOpen,
    isAdd = false,
    closeModal,
    refetch,
}: TradeAccountFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TradeAccountFormValues>({
        defaultValues: {
            accountType: "demo",
            currency: "USD",
            group: "",
            leverage: undefined,
        },
    });
    const { data: companyGroup } = useCompanyGroupList({
        pageSize: 100,
    });
    const groups = useMemo(
        () =>
            (companyGroup?.results || []).filter(
                (group) => !isAdd || group.status === "yes"
            ),
        [companyGroup?.results, isAdd]
    );
    const selectedGroupId = watch("group");
    const selectedGroup =
        groups.find((group) => group._id.toString() === selectedGroupId) ?? null;
    const {
        createUserTradeAccount,
    } = useUserTradeAccountAction();

    useEffect(() => {
        if (!isOpen) {
            reset({
                accountType: "demo",
                currency: "USD",
                group: "",
                leverage: undefined,
            });
        }
    }, [isOpen, reset]);

    useEffect(() => {
        if (selectedGroup?.leverage) {
            setValue("leverage", selectedGroup.leverage, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    }, [selectedGroup?.leverage, setValue]);

    const handleClose = () => {
        reset({
            accountType: "demo",
            currency: "USD",
            group: "",
            leverage: undefined,
        });
        closeModal();
    };

    const submitForm = (formData: TradeAccountFormValues) => {
        const {
            accountType,
            currency,
            group,
            leverage,
        } = formData;
        return createUserTradeAccount.mutate({
            data: {
                accountType,
                currency,
                group,
                leverage: Number(leverage),
            },
        }, createMutationHandlers(refetch, handleClose));
    };
    const isPending =
        createUserTradeAccount.isPending;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[1000]"
                onClose={handleClose}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        aria-hidden="true"
                    />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-3">
                        <Dialog.Panel
                            className="modal-panel max-w-lg"
                        >
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div>
                                    <Dialog.Title className="modal-title">
                                        {isAdd
                                            ? "Create Trading Account"
                                            : "Edit Trading Account"}
                                    </Dialog.Title>
                                    <p className="modal-description mt-0.5">
                                        {selectedGroup
                                            ? "Step 2: choose account details"
                                            : "Step 1: select company group"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-card-hover hover:text-text"
                                    title="Close"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        close
                                    </span>
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit(submitForm)}
                                className="space-y-3"
                            >
                                <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-background p-1 text-[11px] font-semibold text-text-muted">
                                    <div
                                        className={`flex items-center justify-center gap-1 rounded-md px-2 py-1.5 ${!selectedGroup
                                            ? "bg-primary text-white"
                                            : "bg-primary/10 text-primary"
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            looks_one
                                        </span>
                                        Group
                                    </div>
                                    <div
                                        className={`flex items-center justify-center gap-1 rounded-md px-2 py-1.5 ${selectedGroup
                                            ? "bg-primary text-white"
                                            : "text-text-muted"
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            looks_two
                                        </span>
                                        Account
                                    </div>
                                </div>

                                {!selectedGroup && (
                                <section className="modal-section">
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-text">
                                                Company Groups
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-[18px] text-primary">
                                            groups
                                        </span>
                                    </div>

                                    {errors.group?.message && (
                                        <p className="mb-2 text-xs text-danger">
                                            {errors.group.message}
                                        </p>
                                    )}

                                    <input
                                        type="hidden"
                                        {...register("group", {
                                            required: "Company group is required",
                                        })}
                                    />

                                    <div className="custom-scrollbar max-h-[320px] space-y-1.5 overflow-auto pr-1">
                                        {groups.length ? (
                                            groups.map((group) => {
                                                const groupId = group._id.toString();
                                                const isSelected = groupId === selectedGroupId;

                                                return (
                                                    <button
                                                        type="button"
                                                        key={groupId}
                                                        onClick={() =>
                                                            setValue("group", groupId, {
                                                                shouldDirty: true,
                                                                shouldValidate: true,
                                                            })
                                                        }
                                                        className={`w-full rounded-lg border px-3 py-2 text-left transition ${isSelected
                                                            ? "border-primary bg-primary/10"
                                                            : "border-border bg-card hover:border-primary/35 hover:bg-card-hover"
                                                            }`}
                                                    >
                                                        <span className="flex items-center justify-between gap-3">
                                                            <span className="min-w-0">
                                                                <span className="block truncate text-sm font-semibold leading-5 text-text">
                                                                    {group.groupName}
                                                                </span>
                                                                <span className="block truncate text-[11px] leading-4 text-text-muted">
                                                                    1:{group.leverage} leverage | Spread {group.spread} | Brokerage {group.brokerage}
                                                                </span>
                                                            </span>
                                                            {isSelected && (
                                                                <span className="material-symbols-outlined shrink-0 text-[18px] text-primary">
                                                                    check_circle
                                                                </span>
                                                            )}
                                                        </span>
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-muted">
                                                No active company groups found.
                                            </div>
                                        )}
                                    </div>
                                </section>
                                )}

                                {selectedGroup && (
                                <section className="modal-section">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-text">
                                                {selectedGroup.groupName}
                                            </p>
                                            <p className="text-[11px] text-text-muted">
                                                1:{selectedGroup.leverage} leverage
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={isPending}
                                            onClick={() =>
                                                setValue("group", "", {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                })
                                            }
                                            className="text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Change
                                        </button>
                                    </div>

                                    <fieldset
                                        disabled={isPending}
                                        className="grid gap-3"
                                    >
                                        <label className="space-y-1.5">
                                            <span className="form-label">
                                                Account Type
                                            </span>
                                            <select
                                                {...register("accountType", {
                                                    required: "Account type is required",
                                                })}
                                                className="form-input"
                                            >
                                                {accountTypeOptions.map((accountType) => (
                                                    <option key={accountType} value={accountType}>
                                                        {accountType.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.accountType?.message && (
                                                <p className="text-xs text-danger">
                                                    {errors.accountType.message}
                                                </p>
                                            )}
                                        </label>

                                        <label className="space-y-1.5">
                                            <span className="form-label">
                                                Currency
                                            </span>
                                            <select
                                                {...register("currency", {
                                                    required: "Currency is required",
                                                })}
                                                className="form-input"
                                            >
                                                {currencyOptions.map((currency) => (
                                                    <option key={currency} value={currency}>
                                                        {currency}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.currency?.message && (
                                                <p className="text-xs text-danger">
                                                    {errors.currency.message}
                                                </p>
                                            )}
                                        </label>

                                        <label className="space-y-1.5">
                                            <span className="form-label">
                                                Leverage
                                            </span>
                                            <select
                                                {...register("leverage", {
                                                    required: "Leverage is required",
                                                    valueAsNumber: true,
                                                })}
                                                className="form-input"
                                            >
                                                <option value={selectedGroup.leverage}>
                                                    1:{selectedGroup.leverage}
                                                </option>
                                            </select>
                                            {errors.leverage?.message && (
                                                <p className="text-xs text-danger">
                                                    {errors.leverage.message}
                                                </p>
                                            )}
                                        </label>
                                    </fieldset>
                                </section>
                                )}

                                <div className="modal-action-bar">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="modal-button-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={isPending || !selectedGroup}
                                        type="submit"
                                        className="modal-button-primary"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            add
                                        </span>
                                        {isPending ? "Processing..." : "Save Account"}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
