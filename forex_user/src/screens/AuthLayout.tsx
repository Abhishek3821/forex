import { Link } from "react-router-dom";

type AuthFooterProps = {
    mode: "login" | "signup";
};

export const AuthFooter: React.FC<AuthFooterProps> = ({ mode }) => {
    const isLogin = mode === "login";

    return (
        <div className="mt-5">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-text-muted">
                    or continue with
                </span>
                <div className="h-px flex-1 bg-border" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface py-2.5 text-sm font-medium text-text transition hover:bg-card-hover"
                >
                    <span className="text-base font-bold text-primary">G</span>
                    Google
                </button>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface py-2.5 text-sm font-medium text-text transition hover:bg-card-hover"
                >
                    <span className="text-base font-bold text-primary">f</span>
                    Facebook
                </button>
            </div>

            <p className="mt-5 text-center text-sm text-text-secondary">
                {isLogin ? (
                    <>
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold text-primary hover:text-primary-hover"
                        >
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-primary hover:text-primary-hover"
                        >
                            Sign In
                        </Link>
                    </>
                )}
            </p>
        </div>
    );
};
// AuthLayout.tsx
import { motion } from "framer-motion";
import { ThemeConverter } from "../screens/ThemeSwitcher";
import { bannerImage } from "../assests";

export function AuthLayout({
    children,
    companyName = "VTX Prime",
}: {
    children: React.ReactNode;
    companyName?: string;
}) {
    return (
        <main className="relative min-h-screen overflow-hidden bg-background text-text">
            <img
                src={bannerImage[0]}
                alt={companyName}
                className="absolute inset-0 h-full w-full object-contain"
            />

            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-background/85" />

            <div className="absolute right-5 top-5 z-20">
                <ThemeConverter />
            </div>

            <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 lg:justify-end lg:px-16">
                <motion.div
                    initial={{ opacity: 0, x: 35 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45 }}
                    className="w-full max-w-md"
                >
                    <div className="max-h-[calc(100vh-48px)] custom-scrollbar rounded-2xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
                        {children}
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
