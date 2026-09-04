// SignUp.tsx
import { useForm } from "react-hook-form";
import { vtxLogo } from "../assests";
import { AuthFooter, AuthLayout } from "../screens/AuthLayout";
import { useNavigate } from "react-router-dom";
import type { SingUpData } from "../interface/interface";
import { useSingUp } from "../hooks/useAuth";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getToken } from "../utils/getTocken";
export default function SignUp() {
    const companyName = "VTX Prime";
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SingUpData>();
    const { mutateAsync, isPending } = useSingUp();
    const navigate = useNavigate();
    const onSubmit = async (data: SingUpData) => {
        try {
            const res = await mutateAsync({ ...data });
            if (res?.success) {
                return navigate("/login");
            }
        } catch (err) {
            const axiosError = err as AxiosError;
            if (axiosError.response) {
                const errorData = axiosError.response.data as { message: string };
                toast.error(errorData.message || "failed to login !");
            } else {
                toast.error(axiosError.message || "Login failed:");
            }
        }
    };
    useEffect(() => {
        getToken() && navigate("/")
    }, []);
    return (
        <AuthLayout companyName={companyName}>
            <div className="mb-5 text-center">
                <img
                    src={vtxLogo}
                    alt={companyName}
                    className="mx-auto mb-3 h-12 w-12 rounded-lg bg-surface object-contain p-2"
                />

                <h1 className="text-xl font-bold">{companyName}</h1>

                <p className="mt-1 text-sm text-text-secondary">
                    Create your account
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    error={errors.fullName?.message}
                    register={register("fullName", {
                        required: "Full name is required",
                        minLength: {
                            value: 3,
                            message: "Minimum 3 characters",
                        },
                    })}
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    error={errors.email?.message}
                    register={register("email", {
                        required: "Email is required",
                    })}
                />

                <Input
                    label="Phone Number"
                    placeholder="+91 9876543210"
                    register={register("phone")}
                />



                <div className="flex justify-between gap-2">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        register={register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Minimum 6 characters",
                            },
                        })}
                    />
                    <Input
                        label="Confirm Password"
                        type="confirmPassword"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        register={register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Minimum 6 characters",
                            },
                        })}
                    />
                </div>
                <Input
                    label="Referral Code"
                    placeholder="Optional"
                    register={register("referedBy")}
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? "Creating Account..." : "Create Account"}
                </button>
            </form>

            <AuthFooter mode="signup" />
        </AuthLayout>
    );
}

type InputProps = {
    label: string;
    error?: string;
    type?: string;
    placeholder?: string;
    register: any;
};
export function Input({
    label,
    error,
    type = "text",
    placeholder: _placeholder,
    register,
}: InputProps) {
    return (
        <div className="relative">
            <input
                {...register}
                id={label}
                type={type}
                placeholder=" "
                className="peer w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-all placeholder-transparent focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            <label
                htmlFor={label}
                className="
            absolute left-3 top-1/2 z-10
            -translate-y-1/2
            bg-surface px-1
            text-sm text-text-muted
            transition-all duration-200
            pointer-events-none
            peer-focus:-top-2
            peer-focus:left-2
            peer-focus:-translate-y-0
            peer-focus:bg-surface
            peer-focus:px-1
            peer-focus:text-xs
            peer-focus:text-primary

            peer-not-placeholder-shown:-top-2
            peer-not-placeholder-shown:left-2
            peer-not-placeholder-shown:-translate-y-0
            peer-not-placeholder-shown:bg-surface
            peer-not-placeholder-shown:px-1
            peer-not-placeholder-shown:text-xs
            peer-not-placeholder-shown:text-primary
        "
            >
                {label}
            </label>

            {error && (
                <p className="mt-1 text-xs text-danger">{error}</p>
            )}
        </div>
    );
}
