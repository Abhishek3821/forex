import type React from "react";
import { useForm } from "react-hook-form";
import { vtxLogo } from "../assests";
import { AuthFooter, AuthLayout } from "../screens/AuthLayout";
import { Input } from "./SingUp";
import { useLogin } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "../utils/getTocken";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { useUser } from "../constant/UserProvider";
import type { LoginData } from "../interface/interface";
import { useEffect } from "react";
const Login: React.FC = () => {
    const companyName = "VTX Prime";
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>();
    const { mutateAsync, isPending } = useLogin();
    const { login } = useUser();
    const navigate = useNavigate();
    const onSubmit = async (data: LoginData) => {
        try {
            const res = await mutateAsync({ ...data });
            if (res?.success) {
                login(res);
                const { token } = res;
                setToken(token);
                toast.success(res.message);
                return navigate("/");
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
            <div className="mb-6 text-center">
                <img
                    src={vtxLogo}
                    alt={companyName}
                    className="mx-auto mb-3 h-12 w-12 rounded-lg bg-surface object-contain p-2"
                />
                <h1 className="text-xl font-bold">{companyName}</h1>
                <p className="mt-1 text-sm text-text-secondary">
                    Sign in to your trading account
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Email address"
                    type="email"
                    placeholder="user@example.com"
                    error={errors.email?.message}
                    register={register("email", {
                        required: "Email is required",
                    })}
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    error={errors.password?.message}
                    register={register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    })}
                />

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-text-secondary">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border accent-primary"
                        />
                        Remember me
                    </label>

                    <button
                        type="button"
                        className="font-medium text-primary hover:text-primary-hover"
                    >
                        Forgot password?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? "Signing in..." : "Sign in"}
                </button>
            </form>
            <AuthFooter mode="login" />
        </AuthLayout>
    );
};
export default Login;