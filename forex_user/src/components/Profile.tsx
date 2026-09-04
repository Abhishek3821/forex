import type React from "react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useUser } from "../constant/UserProvider";
import { useProfileActions } from "../hooks/useProfile";
import BankDetails from "../screens/BankDetails";
import ButtonBar from "../screens/ButtonBar";
import CryptoDetails from "../screens/CryptoDetails";
import MotionWrapper from "../screens/Motion";
import UpiDetails from "../screens/UpiDetails";
import PageHeadline from "./PageHeadline";
import { profileButtonList } from "../constant";
interface ProfileFormValues {
    fullName: string;
    phone: string;
    country: string;
    city: string;
}
const formatValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "Not added";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return (
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        fallback
    );
};

const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value: unknown;
}) => (
    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border/70 py-2 last:border-b-0">
        <span className="shrink-0 text-[11px] font-medium uppercase text-text-muted">
            {label}
        </span>
        <span className="min-w-0 truncate text-right text-sm font-semibold text-text">
            {formatValue(value)}
        </span>
    </div>
);

const DetailBox = ({
    label,
    value,
}: {
    label: string;
    value: unknown;
}) => (
    <div className="min-w-0 rounded-lg border border-border bg-card px-3 py-2.5">
        <p className="truncate text-[11px] font-medium uppercase leading-none text-text-muted">
            {label}
        </p>
        <p className="mt-1.5 truncate text-sm font-semibold leading-5 text-text">
            {formatValue(value)}
        </p>
    </div>
);

const InputBox = ({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) => (
    <label className="grid min-w-0 gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5">
        <span className="truncate text-[11px] font-medium uppercase leading-none text-text-muted">
            {label}
        </span>
        {children}
        {error && <span className="text-[11px] text-danger">{error}</span>}
    </label>
);
const ProfileSection = () => {
    const { user, isLoading, refetch } = useUser();
    const { updateProfileMutation } = useProfileActions();
    const [isEditing, setIsEditing] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        defaultValues: {
            fullName: "",
            phone: "",
            country: "",
            city: "",
        },
    });

    useEffect(() => {
        reset({
            fullName: user?.fullName ?? "",
            phone: user?.phone ?? "",
            country: user?.country ?? "",
            city: user?.city ?? "",
        });
    }, [reset, user]);

    const closeEdit = () => {
        reset({
            fullName: user?.fullName ?? "",
            phone: user?.phone ?? "",
            country: user?.country ?? "",
            city: user?.city ?? "",
        });
        setIsEditing(false);
    };

    const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
        try {
            const response = await updateProfileMutation.mutateAsync({
                fullName: values.fullName,
                phone: values.phone,
                country: values.country,
                city: values.city,
            });
            refetch();
            setIsEditing(false);
            toast.success(response.message || "Profile updated");
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to update profile"));
        }
    };

    return (
        <div className="p-2 sm:p-3">
            <div className="mx-auto grid max-w-6xl gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
                <aside className="rounded-xl border border-border bg-surface p-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-bold text-background">
                            {(user?.fullName || user?.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <h2 className="truncate text-base font-bold text-text">
                                {user?.fullName || "Account"}
                            </h2>
                            <p className="truncate text-xs text-text-muted">
                                {user?.email || "No email available"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 rounded-lg border border-border bg-card px-3 py-1">
                        <InfoRow label="Status" value={user?.account_status ?? "active"} />
                        <InfoRow label="KYC" value={user?.kycStatus} />
                        <InfoRow label="Currency" value={user?.currency} />
                    </div>
                </aside>

                <section className="rounded-xl border border-border bg-surface p-3">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-text">
                                Account Details
                            </h3>
                            <p className="truncate text-xs text-text-muted">
                                View and update your basic profile information.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={closeEdit}
                                    disabled={updateProfileMutation.isPending}
                                    className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-text-secondary transition hover:bg-card-hover hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        close
                                    </span>
                                    Cancel
                                </button>
                            )}
                            <button
                                type={isEditing ? "submit" : "button"}
                                form={isEditing ? "profile-form" : undefined}
                                onClick={() => {
                                    if (!isEditing) setIsEditing(true);
                                }}
                                disabled={updateProfileMutation.isPending}
                                className="flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {isEditing ? "check" : "edit"}
                                </span>
                                {updateProfileMutation.isPending
                                    ? "Saving..."
                                    : isEditing
                                        ? "Save"
                                        : "Edit"}
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="rounded-lg border border-border bg-card p-4 text-sm text-text-secondary">
                            Loading profile...
                        </div>
                    ) : isEditing ? (
                        <form
                            id="profile-form"
                            className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <InputBox label="Full Name" error={errors.fullName?.message}>
                                <input
                                    className={`form-input`}
                                    disabled={updateProfileMutation.isPending}
                                    {...register("fullName", {
                                        required: "Full name is required",
                                    })}
                                />
                            </InputBox>
                            <InputBox label="Email">
                                <input className={`form-input`} disabled readOnly value={user?.email ?? ""} />
                            </InputBox>
                            <InputBox label="Phone">
                                <input
                                    className={`form-input`}
                                    disabled={updateProfileMutation.isPending}
                                    {...register("phone")}
                                />
                            </InputBox>
                            <InputBox label="Account ID">
                                <input className={`form-input`} disabled readOnly value={user?.accountId ?? ""} />
                            </InputBox>
                            <InputBox label="Currency">
                                <input className={`form-input`} disabled readOnly value={user?.currency ?? ""} />
                            </InputBox>
                            <InputBox label="KYC Status">
                                <input className={`form-input`} disabled readOnly value={user?.kycStatus ?? ""} />
                            </InputBox>
                            <InputBox label="Referral Code">
                                <input className={`form-input`} disabled readOnly value={user?.refered_code ?? ""} />
                            </InputBox>
                            <InputBox label="Country">
                                <input
                                    className={`form-input`}
                                    disabled={updateProfileMutation.isPending}
                                    {...register("country")}
                                />
                            </InputBox>
                            <InputBox label="City">
                                <input
                                    className={`form-input`}
                                    disabled={updateProfileMutation.isPending}
                                    {...register("city")}
                                />
                            </InputBox>
                        </form>
                    ) : (
                        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            <DetailBox label="Full name" value={user?.fullName} />
                            <DetailBox label="Email" value={user?.email} />
                            <DetailBox label="Phone" value={user?.phone} />
                            <DetailBox label="Account ID" value={user?.accountId} />
                            <DetailBox label="Currency" value={user?.currency} />
                            <DetailBox label="KYC status" value={user?.kycStatus} />
                            <DetailBox label="Referral code" value={user?.refered_code} />
                            <DetailBox label="Country" value={user?.country} />
                            <DetailBox label="City" value={user?.city} />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const Profile: React.FC = () => {
    const [activeView, setActiveView] = useState<{
        main: string | null;
        sub: string | null;
    }>({
        main: "profile",
        sub: null,
    });

    const renderActiveSection = () => {
        if (activeView.main === "withdraw_details") {
            if (activeView.sub === "crypto") return <CryptoDetails />;
            if (activeView.sub === "upi") return <UpiDetails />;
            return <BankDetails />;
        }
        return <ProfileSection />;
    };

    return (
        <MotionWrapper>
            <PageHeadline
                title="Profile"
                subtitle="Manage personal details, bank information, UPI, and crypto withdrawal addresses."
            />
            <ButtonBar
                items={profileButtonList}
                onActiveChange={(active) => setActiveView(active)}
            />
            {renderActiveSection()}
        </MotionWrapper>
    );
};

export default Profile;
