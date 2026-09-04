import { useEffect, useRef, useState } from "react";
import { cn } from "../components/TradingTerminal";

export type SelectBarOption<T extends string = string> = {
    label: string;
    value: T;
    icon?: string;
    description?: string;
};

type SelectBarProps<T extends string = string> = {
    label: string;
    value: T;
    options: SelectBarOption<T>[];
    onChange: (value: T) => void;
    icon?: string;
    className?: string;
    menuClassName?: string;
};

export default function SelectBar<T extends string = string>({
    label,
    value,
    options,
    onChange,
    icon,
    className = "",
    menuClassName = "",
}: SelectBarProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const selectedOption =
        options.find((option) => option.value === value) ?? options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={rootRef} className={cn("relative", className)}>
            <button
                type="button"
                title={label}
                aria-label={label}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className={cn(
                    "flex h-8 min-w-20 items-center gap-2 rounded-md border border-border bg-card px-2 text-left transition hover:bg-card-hover",
                    isOpen && "border-primary/40 bg-primary/10"
                )}
            >
                {(icon || selectedOption?.icon) && (
                    <span className="material-symbols-outlined shrink-0 text-[17px] text-primary">
                        {selectedOption?.icon || icon}
                    </span>
                )}
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-text">
                    {selectedOption?.label ?? label}
                </span>
                <span className="material-symbols-outlined shrink-0 text-[16px] text-text-muted">
                    expand_more
                </span>
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "custom-scrollbar absolute right-0 top-full z-50 mt-1 max-h-80 w-44 overflow-auto rounded-lg border border-border bg-surface p-1 shadow-xl",
                        menuClassName
                    )}
                >
                    {options.map((option) => {
                        const active = option.value === value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-left text-xs font-semibold transition",
                                    active
                                        ? "bg-primary/10 text-primary"
                                        : "text-text-secondary hover:bg-card-hover hover:text-text"
                                )}
                            >
                                {option.icon && (
                                    <span className="material-symbols-outlined text-[17px]">
                                        {option.icon}
                                    </span>
                                )}
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate">{option.label}</span>
                                    {option.description && (
                                        <span className="block truncate text-[10px] font-medium text-text-muted">
                                            {option.description}
                                        </span>
                                    )}
                                </span>
                                {active && (
                                    <span className="material-symbols-outlined text-[16px]">
                                        check
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

