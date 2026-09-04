import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useUser } from "../constant/UserProvider";
import { useProfileActions } from "../hooks/useProfile";
import { createMutationHandlers } from "../utils/hanldleQueryResponse";
interface UpiFormValues {
    upi_id: string;
    provider_name: string;
}
export default function UpiDetails() {
    const { user, refetch } = useUser();
    const { updateBankDetailsMutation } = useProfileActions();
    const { register, handleSubmit, reset } = useForm<UpiFormValues>({
        defaultValues: {
            upi_id: "",
            provider_name: "",
        },
    });

    useEffect(() => {
        reset({
            upi_id: user?.upi_details?.upi_id ?? user?.upi?.upi_id ?? "",
            provider_name:
                user?.upi_details?.provider_name ?? user?.upi?.provider_name ?? "",
        });
    }, [reset, user]);

    const onSubmit: SubmitHandler<UpiFormValues> = async (values) => {

        updateBankDetailsMutation.mutate({
            upi_details: values,
            upi: values,
        }, createMutationHandlers(refetch));
    };

    return (
        <section className="p-2 sm:p-3">
            <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-3">
                <div className="mb-3">
                    <h2 className="text-sm font-semibold text-text">UPI Details</h2>
                    <p className="text-xs text-text-muted">Add or update your UPI withdrawal account.</p>
                </div>
                <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <label className="grid gap-1.5">
                        <span className="form-label">UPI ID</span>
                        <input className="form-input" {...register("upi_id")} />
                    </label>
                    <label className="grid gap-1.5">
                        <span className="form-label">Provider Name</span>
                        <input className="form-input" {...register("provider_name")} />
                    </label>
                    <button
                        type="submit"
                        disabled={updateBankDetailsMutation.isPending}
                        className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {updateBankDetailsMutation.isPending ? "Saving..." : "Update UPI"}
                    </button>
                </form>
            </div>
        </section>
    );
}
