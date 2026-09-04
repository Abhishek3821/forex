import { Link } from "react-router-dom";
import { ThemeConverter } from "../screens/ThemeSwitcher";
import { useUser } from "../constant/UserProvider";
export default function Header() {
    const { user } = useUser();
    const title = `VTX Prime`;
    return (
        <header className="sticky top-0 z-30  flex h-16 items-center justify-between border-b border-border bg-surface px-6 backdrop-blur-xl">
            <div>
                <h1 className="text-lg font-semibold text-text">{title}</h1>
                <p className="text-xs text-text-muted">Welcome back, {user?.fullName}</p>
            </div>
            <div className="flex items-center gap-3">
                {/* <TradeAccountSwitchBar /> */}
                {/* <button className="relative flex items-center justify-center   text-text-secondary transition hover:text-text cursor-pointer">
                    <span className="material-symbols-outlined text-[22px]">
                        notifications
                    </span>
                    <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger" />
                </button> */}
                {/* Theme */}
                <ThemeConverter />

                {/* Profile */}
                <Link
                    to="/profile"
                    className="flex h-10 items-center gap-2"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-light text-sm font-bold text-primary">
                        N
                    </div>

                    <div className="hidden text-left md:block">
                        <p className="text-xs font-medium leading-none text-text">
                            {user?.fullName || "N/A"}
                        </p>
                        <p className="mt-1 text-[11px] leading-none text-text-muted">
                            {user?.accountId || "N/As"}
                        </p>
                    </div>
                </Link>
            </div>
        </header>
    );
}
