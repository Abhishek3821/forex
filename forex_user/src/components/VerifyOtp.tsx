// VerifyOtp.tsx
import type React from "react";
import { useForm } from "react-hook-form";
import { vtxLogo } from "../assests";
import { AuthFooter, AuthLayout } from "../screens/AuthLayout";
import { Input } from "./SingUp";

type VerifyOtpFormData = {
    otp: string;
};

const VerifyOtp: React.FC = () => {
    const companyName = "VTX Prime";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<VerifyOtpFormData>();

    const onSubmit = async (data: VerifyOtpFormData) => {
        console.log(data);
    };

    return (
        <AuthLayout companyName={companyName}>
            <div className="mb-6 text-center">
                <img
                    src={vtxLogo}
                    alt={companyName}
                    className="mx-auto mb-3 h-12 w-12 rounded-lg bg-surface object-contain p-2"
                />

                <h1 className="text-xl font-bold">{companyName}</h1>

                <p className="mt-1 text-sm text-text-secondary">
                    Enter the verification code sent to your email
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Verification Code"
                    type="text"
                    placeholder="Enter OTP"
                    error={errors.otp?.message}
                    register={register("otp", {
                        required: "OTP is required",
                        minLength: {
                            value: 4,
                            message: "OTP must be at least 4 digits",
                        },
                        maxLength: {
                            value: 6,
                            message: "OTP must not exceed 6 digits",
                        },
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "OTP must contain only numbers",
                        },
                    })}
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                    type="button"
                    className="w-full text-sm font-medium text-primary hover:text-primary-hover"
                >
                    Resend code
                </button>
            </form>

            <AuthFooter mode="login" />
        </AuthLayout>
    );
};

export default VerifyOtp;