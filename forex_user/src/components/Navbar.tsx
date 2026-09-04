import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../constant";
export default function Navbar() {
    const { pathname } = useLocation();
    const [moreOpen, setMoreOpen] = useState(false);
    const visibleMobileItems = navItems.slice(0, 3);
    const moreMobileItems = navItems.slice(3);
    const moreActive = moreMobileItems.some((item) => pathname === item.link);
    return (
        <>
            <aside className="sticky top-0 hidden h-screen w-20 flex-col border-r border-border bg-surface md:flex">
                <div className="flex h-18 items-center justify-center border-b border-border">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-background">
                        V
                    </div>
                </div>
                <nav className="flex flex-1 flex-col items-center gap-3 py-6">
                    {navItems.map((item) => {
                        const active = pathname === item.link;
                        return (
                            <Link
                                key={item.link}
                                to={item.link}
                                title={item.name}
                                className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200
                                    ${active
                                        ? "bg-primary text-background"
                                        : "text-text-secondary hover:bg-card-hover hover:text-text"
                                    }
                                `}
                            >
                                <span className="material-symbols-outlined text-[24px]">
                                    {item.icon}
                                </span>

                                {active && (
                                    <span className="absolute -right-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-accent" />
                                )}

                                <div className="pointer-events-none absolute left-16 z-10 whitespace-nowrap rounded-xl border border-border-light bg-card px-3 py-2 text-xs text-text opacity-0 shadow transition-all group-hover:opacity-100">
                                    {item.name}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="border-t border-border py-4">
                    <Link
                        to="/profile"
                        className="group relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-text-muted transition hover:bg-card-hover hover:text-text"
                    >
                        <span className="material-symbols-outlined">
                            person
                        </span>

                        <div className="pointer-events-none absolute left-16 z-10 whitespace-nowrap rounded-xl border border-border-light bg-card px-3 py-2 text-xs text-text opacity-0 shadow transition-all group-hover:opacity-100">
                            Profile
                        </div>
                    </Link>
                </div>

            </aside>

            {/* Mobile bottom nav */}
            <div className="md:hidden">
                {moreOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-background/40 backdrop-blur-[2px]"
                        onClick={() => setMoreOpen(false)}
                    />
                )}

                <div
                    className={`fixed bottom-[4.75rem] left-3 right-3 z-50 origin-bottom rounded-2xl border border-border bg-surface/95 p-2 shadow-2xl shadow-black/30 backdrop-blur transition-all duration-200 ${moreOpen
                        ? "translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none translate-y-3 scale-95 opacity-0"
                        }`}
                >
                    <div className="grid grid-cols-3 gap-1.5">
                        {moreMobileItems.map((item) => {
                            const active = pathname === item.link;

                            return (
                                <Link
                                    key={item.link}
                                    to={item.link}
                                    onClick={() => setMoreOpen(false)}
                                    className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-center transition-all ${active
                                        ? "bg-primary text-background shadow-lg shadow-primary/20"
                                        : "text-text-secondary hover:bg-card-hover hover:text-text"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[21px]">
                                        {item.icon}
                                    </span>
                                    <span className="max-w-full truncate text-[10px] font-medium leading-none">
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center gap-1 border-t border-border bg-surface/95 px-2 shadow-2xl shadow-black/20 backdrop-blur">
                    {visibleMobileItems.map((item) => {
                        const active = pathname === item.link;

                        return (
                            <Link
                                key={item.link}
                                to={item.link}
                                onClick={() => setMoreOpen(false)}
                                className={`flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl transition-all ${active
                                    ? "bg-primary text-background shadow-lg shadow-primary/20"
                                    : "text-text-secondary hover:bg-card-hover hover:text-text"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[22px]">
                                    {item.icon}
                                </span>
                                <span className="max-w-full truncate px-1 text-[10px] font-medium leading-none">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    <button
                        type="button"
                        aria-expanded={moreOpen}
                        aria-label="Show more pages"
                        onClick={() => setMoreOpen((isOpen) => !isOpen)}
                        className={`flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl transition-all ${moreActive || moreOpen
                            ? "bg-primary text-background shadow-lg shadow-primary/20"
                            : "text-text-secondary hover:bg-card-hover hover:text-text"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[22px]">
                            more_horiz
                        </span>
                        <span className="text-[10px] font-medium leading-none">
                            More
                        </span>
                    </button>
                </nav>
            </div>
        </>
    );
}
