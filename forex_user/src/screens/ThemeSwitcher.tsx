import { useEffect, useState } from "react";
export const ThemeConverter: React.FC = () => {
    const [isDark, setIsDark] = useState(true);
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") ?? "dark";
        setIsDark(savedTheme === "dark");
        document.documentElement.classList.toggle(
            "dark",
            savedTheme === "dark"
        );
    }, []);
    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
        window.dispatchEvent(new Event("themechange"));
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-text-secondary transition hover:bg-card-hover hover:text-text active:scale-95"
        >
            <span className="material-symbols-outlined text-[18px]">
                {isDark ? "light_mode" : "dark_mode"}
            </span>
        </button>
    );
}
