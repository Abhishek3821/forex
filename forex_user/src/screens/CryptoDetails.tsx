import {
    Dialog,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
    useCryptoAddresses,
    useProfileActions,
    type CryptoAddress,
    type CryptoAddressPayload,
} from "../hooks/useProfile";

import CryptoDetailsCards from "./CryptoDetailsCards";
import CryptoDetailsTableBody from "./CryptoDetailsTableBody";
import useModal from "../hooks/useModal";
import { createMutationHandlers } from "../utils/hanldleQueryResponse";
import LoadingScreen from "../components/Loading";
import NoDataFound from "../components/NotFound";

const emptyCryptoForm: CryptoAddressPayload = {
    coin: "",
    symbol: "",
    network: "",
    address: "",
    label: "",
};

const getAddressValue = (address?: CryptoAddress | null) =>
    address?.address || address?.walletAddress || "";

const getCryptoTitle = (address?: CryptoAddress | null) =>
    address?.label ||
    address?.coin ||
    address?.symbol ||
    "Crypto Address";

/* -------------------------------------------------------
   FORM FIELDS
------------------------------------------------------- */

interface CryptoAddressFieldsProps {
    submitLabel: string;
    isSaving: boolean;
    onSubmit: (
        values: CryptoAddressPayload,
        resetForm: () => void
    ) => void;
    defaultValues?: CryptoAddressPayload;
}

const CryptoAddressFields: React.FC<CryptoAddressFieldsProps> = ({
    submitLabel,
    isSaving,
    onSubmit,
    defaultValues,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CryptoAddressPayload>({
        defaultValues: defaultValues ?? emptyCryptoForm,
    });

    useEffect(() => {
        reset(defaultValues ?? emptyCryptoForm);
    }, [defaultValues, reset]);

    return (
        <form
            className="
                grid
                gap-3
                rounded-xl
                border border-border
                bg-surface
                p-3
            "
            onSubmit={handleSubmit((values) =>
                onSubmit(values, () =>
                    reset(defaultValues ?? emptyCryptoForm)
                )
            )}
        >
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                    <span className="form-label">
                        Coin
                    </span>

                    <input
                        className="form-input"
                        disabled={isSaving}
                        placeholder="USDT"
                        {...register("coin")}
                    />
                </label>

                <label className="grid gap-1.5">
                    <span className="form-label">
                        Symbol
                    </span>

                    <input
                        className="form-input"
                        disabled={isSaving}
                        placeholder="USDT"
                        {...register("symbol")}
                    />
                </label>
            </div>

            <label className="grid gap-1.5">
                <span className="form-label">
                    Network
                </span>

                <input
                    className="form-input"
                    disabled={isSaving}
                    placeholder="TRC20"
                    {...register("network", {
                        required: "Network is required",
                    })}
                />

                {errors.network?.message && (
                    <span className="text-xs text-danger">
                        {errors.network.message}
                    </span>
                )}
            </label>

            <label className="grid gap-1.5">
                <span className="form-label">
                    Address
                </span>

                <input
                    className="form-input"
                    disabled={isSaving}
                    placeholder="Wallet address"
                    {...register("address", {
                        required: "Address is required",
                    })}
                />

                {errors.address?.message && (
                    <span className="text-xs text-danger">
                        {errors.address.message}
                    </span>
                )}
            </label>

            <label className="grid gap-1.5">
                <span className="form-label">
                    Label
                </span>

                <input
                    className="form-input"
                    disabled={isSaving}
                    placeholder="My USDT Wallet"
                    {...register("label")}
                />
            </label>

            <button
                type="submit"
                disabled={isSaving}
                className="
                    h-10
                    rounded-lg
                    bg-primary
                    px-4
                    text-sm
                    font-semibold
                    text-background
                    transition
                    hover:bg-primary-hover
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >
                {isSaving ? "Saving..." : submitLabel}
            </button>
        </form>
    );
};
interface CryptoFormProps {
    data?: CryptoAddress | null;
    open: boolean;
    isAdd?: boolean;
    closeModal: () => void;
    onSuccess?: () => void;
}

export const CryptoForm: React.FC<CryptoFormProps> = ({
    data,
    open,
    isAdd = false,
    closeModal,
    onSuccess,
}) => {
    const {
        createCryptoAddressMutation,
        updateCryptoAddressMutation,
    } = useProfileActions();

    const isSaving =
        createCryptoAddressMutation.isPending ||
        updateCryptoAddressMutation.isPending;

    const defaultValues = useMemo<CryptoAddressPayload>(
        () => ({
            coin: data?.coin ?? "",
            symbol: data?.symbol ?? "",
            network: data?.network ?? "",
            address: getAddressValue(data),
            label: data?.label ?? "",
        }),
        [data]
    );

    const cleanPayload = (
        values: CryptoAddressPayload
    ): CryptoAddressPayload => ({
        coin: values.coin?.trim() || undefined,
        symbol: values.symbol?.trim() || undefined,
        network: values.network.trim(),
        address: values.address.trim(),
        label: values.label?.trim() || undefined,
    });

    const handleSubmit = (
        values: CryptoAddressPayload,
        resetForm: () => void
    ) => {
        const payload = cleanPayload(values);

        if (isAdd) {
            createCryptoAddressMutation.mutate(
                payload,
                createMutationHandlers(
                    onSuccess,
                    resetForm,
                    closeModal
                )
            );

            return;
        }

        if (!data?._id) return;

        updateCryptoAddressMutation.mutate(
            {
                id: data._id,
                data: payload,
            },
            createMutationHandlers(
                onSuccess,
                resetForm,
                closeModal
            )
        );
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                if (!isSaving) {
                    closeModal();
                }
            }}
            className="relative z-[70]"
        >
            <div
                className="
                    fixed
                    inset-0
                    bg-black/55
                    backdrop-blur-[2px]
                "
                aria-hidden="true"
            />

            <div
                className="
                    fixed
                    inset-0
                    flex
                    items-end
                    justify-center
                    p-0

                    sm:items-center
                    sm:p-4
                "
            >
                <DialogPanel
                    className="
                        max-h-[90dvh]
                        w-full
                        overflow-auto
                        rounded-t-xl
                        border border-border
                        bg-background
                        p-3
                        shadow-2xl

                        sm:max-w-lg
                        sm:rounded-xl
                    "
                >
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <DialogTitle className="text-sm font-semibold text-text">
                                {isAdd
                                    ? "Add Crypto Address"
                                    : "Edit Crypto Address"}
                            </DialogTitle>

                            {!isAdd && data && (
                                <p className="mt-1 truncate text-xs text-text-muted">
                                    {getCryptoTitle(data)}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={isSaving}
                            className="
                                flex
                                h-8 w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-md
                                border border-border
                                text-text-muted
                                transition

                                hover:bg-card-hover
                                hover:text-text

                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                            aria-label="Close"
                        >
                            <span className="material-symbols-outlined text-lg">
                                close
                            </span>
                        </button>
                    </div>

                    <CryptoAddressFields
                        submitLabel={
                            isAdd
                                ? "Add Address"
                                : "Update Address"
                        }
                        isSaving={isSaving}
                        onSubmit={handleSubmit}
                        defaultValues={defaultValues}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    );
};
export default function CryptoDetails() {
    const {
        data: cryptoAddressData,
        isLoading: isCryptoLoading,
        isError: isCryptoError,
        refetch,
    } = useCryptoAddresses();

    const {
        isModalOpen,
        openModal,
        closeModal,
        data: selectedCrypto,
    } = useModal<any>();
    const cryptoAddresses = useMemo(
        () =>
            cryptoAddressData?.results ??
            cryptoAddressData?.data ??
            [],
        [cryptoAddressData]
    );

    const handleEdit = (item: CryptoAddress) => {
        openModal(
            {
                crypto_details: true,
            },
            item
        );
    };
    const handleClose = () => {
        closeModal({
            crypto_details: false,
        });
    };
    return (
        <>
            <section className="p-2 sm:p-3">
                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border border-border
                        bg-card
                        shadow-sm
                    "
                >
                    <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-2.5">
                        {/* Title */}
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-text">
                                Crypto Addresses
                            </h2>

                            <p className="mt-0.5 text-xs text-text-muted">
                                Manage withdrawal wallets
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                openModal(
                                    { crypto_details: true },
                                    { isAdd: true }
                                )
                            }
                            className="
            inline-flex
            h-8
            shrink-0
            items-center
            justify-center
            gap-1.5
            rounded-md
            bg-primary
            px-3
            text-xs
            font-semibold
            text-white
            transition-all
            hover:bg-primary-hover
            active:scale-[0.97]
        "
                        >
                            <span className="material-symbols-outlined text-[17px]">
                                add
                            </span>

                            <span className="hidden sm:inline">
                                Add Address
                            </span>
                        </button>
                    </div>

                    <div
                        className="
                            custom-scrollbar
                            h-[calc(100vh-350px)]
                            overflow-auto
                        "
                    >
                        {!isCryptoLoading &&
                            !isCryptoError &&
                            cryptoAddresses.length > 0 && (
                                <CryptoDetailsCards
                                    data={cryptoAddresses}
                                    onEdit={handleEdit}
                                />
                            )}

                        <table className="hidden min-w-full text-left text-sm text-text md:table">
                            <thead
                                className="
                                    sticky
                                    top-0
                                    z-40
                                    border-b border-border
                                    bg-surface
                                    text-xs
                                    uppercase
                                    text-text-muted
                                "
                            >
                                <tr>
                                    <th className="px-4 py-3">
                                        S.N
                                    </th>

                                    <th className="px-4 py-3">
                                        Coin
                                    </th>

                                    <th className="px-4 py-3">
                                        Symbol
                                    </th>

                                    <th className="px-4 py-3">
                                        Network
                                    </th>

                                    <th className="px-4 py-3">
                                        Address
                                    </th>

                                    <th className="px-4 py-3">
                                        Label
                                    </th>

                                    <th className="px-4 py-3">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            {!isCryptoLoading &&
                                !isCryptoError &&
                                cryptoAddresses.length > 0 && (
                                    <CryptoDetailsTableBody
                                        data={cryptoAddresses}
                                        onEdit={handleEdit}
                                    />
                                )}
                        </table>
                        {isCryptoLoading && (
                            <LoadingScreen />
                        )}
                        {!isCryptoLoading && (isCryptoError || cryptoAddresses.length === 0) && (
                            <NoDataFound />
                        )}
                    </div>
                </div>
            </section>
            <CryptoForm
                data={selectedCrypto ?? null}
                open={Boolean(
                    isModalOpen?.crypto_details
                )}
                isAdd={selectedCrypto?.isAdd}
                closeModal={handleClose}
                onSuccess={refetch}
            />
        </>
    );
}
