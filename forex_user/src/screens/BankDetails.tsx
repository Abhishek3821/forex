import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useUser } from "../constant/UserProvider";
import { useProfileActions } from "../hooks/useProfile";

interface BankFormValues {
    bankAccountNumber: string;
    ifscCode: string;
    bankName: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return (
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        fallback
    );
};

export default function BankDetails() {
    const { user, refetch } = useUser();
    const { updateBankDetailsMutation } = useProfileActions();
    const { register, handleSubmit, reset } = useForm<BankFormValues>({
        defaultValues: {
            bankAccountNumber: "",
            ifscCode: "",
            bankName: "",
        },
    });

    useEffect(() => {
        reset({
            bankAccountNumber: user?.bank?.bankAccountNumber ?? "",
            ifscCode: user?.bank?.ifscCode ?? "",
            bankName: user?.bank?.bankName ?? "",
        });
    }, [reset, user]);

    const onSubmit: SubmitHandler<BankFormValues> = async (values) => {
        try {
            const response = await updateBankDetailsMutation.mutateAsync({
                bank: values,
            });
            refetch();
            toast.success(response.message || "Bank details updated");
        } catch (error) {
            toast.error(getErrorMessage(error, "Unable to update bank details"));
        }
    };

    return (
        <section className="p-2 sm:p-3">
            <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-3">
                <div className="mb-3">
                    <h2 className="text-sm font-semibold text-text">Bank Details</h2>
                    <p className="text-xs text-text-muted">Add or update your bank withdrawal account.</p>
                </div>
                <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <label className="grid gap-1.5">
                        <span className="form-label">Bank Name</span>
                        <input className="form-input" {...register("bankName")} />
                    </label>
                    <label className="grid gap-1.5">
                        <span className="form-label">Account Number</span>
                        <input className="form-input" {...register("bankAccountNumber")} />
                    </label>
                    <label className="grid gap-1.5">
                        <span className="form-label">IFSC Code</span>
                        <input className="form-input" {...register("ifscCode")} />
                    </label>
                    <button
                        type="submit"
                        disabled={updateBankDetailsMutation.isPending}
                        className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {updateBankDetailsMutation.isPending ? "Saving..." : "Update Bank"}
                    </button>
                </form>
            </div>
        </section>
    );
}

