import { useUser } from "../constant/UserProvider";
import { useResendEmail } from "../hooks/useAuth";
import { createMutationHandlers } from "../utils/hanldleQueryResponse";
const ResendEmail = () => {
    const { user } = useUser();
    const { mutate, isPending, isSuccess } = useResendEmail();
    const handleResend = () => {
        if (!user?._id) return;
        mutate(
            { user_id: user._id },
            createMutationHandlers()
        );
    };
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">

                {/* Icon */}
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                    <span className="material-symbols-outlined text-primary text-[30px]">
                        {isSuccess ? "mark_email_read" : "mail"}
                    </span>
                </div>

                {/* Heading */}
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-text">
                        Check your email
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                        We sent a verification link
                        {user?.email ? (
                            <>
                                {" "}to{" "}
                                <span className="font-medium text-text">
                                    {user.email}
                                </span>
                            </>
                        ) : (
                            " to your email address"
                        )}
                        .
                    </p>

                    <p className="mt-1 text-sm text-text-muted">
                        Please check your inbox and click the link to verify your account.
                    </p>
                </div>

                {/* Success Message */}
                {isSuccess && (
                    <div className="mt-6 rounded-lg border border-success/20 bg-success/10 px-4 py-3">
                        <div className="flex items-center justify-center gap-2 text-success">
                            <span className="material-symbols-outlined text-[20px]">
                                check_circle
                            </span>

                            <p className="text-sm font-medium">
                                Verification email sent successfully.
                            </p>
                        </div>
                    </div>
                )}

                {/* Action */}
                <div className="mt-7">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isPending || !user?._id}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-[20px]">
                                    progress_activity
                                </span>
                                Sending...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">
                                    forward_to_inbox
                                </span>
                                Resend verification email
                            </>
                        )}
                    </button>
                </div>

                <p className="mt-6 text-center text-xs text-text-muted">
                    Didn't receive the email? Check your spam or junk folder.
                </p>
            </div>
        </div>
    );
};

export default ResendEmail;