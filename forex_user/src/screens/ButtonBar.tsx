import React, { useState } from "react";
import type {
    ButtonItem,
    SubButtonItem,
    ButtonBarProps,
} from "../types/index";

const ButtonBar: React.FC<ButtonBarProps> = ({
    items,
    className = "",
    onActiveChange,
}) => {
    const [activeMain, setActiveMain] = useState<string | null>(
        items[0]?.id ?? null
    );

    const [activeSub, setActiveSub] = useState<string | null>(
        items[0]?.subButtons?.[0]?.id ?? null
    );

    const activeItem = items.find(
        (item) => item.id === activeMain
    );

    const handleMainClick = (item: ButtonItem): void => {
        if (item.disabled) return;

        setActiveMain(item.id);

        const firstSub = item.subButtons?.[0];
        const nextSub = firstSub?.id ?? null;

        setActiveSub(nextSub);
        onActiveChange?.({ main: item.id, sub: nextSub });

        item.onClick?.();
    };

    const handleSubClick = (sub: SubButtonItem): void => {
        if (sub.disabled) return;

        setActiveSub(sub.id);
        onActiveChange?.({ main: activeMain, sub: sub.id });

        sub.onClick?.();
    };

    if (!items.length) return null;

    return (
        <div
            className={`w-full bg-background sm:p-3 p-1 ${className}`}
        >
            {/* Main Button Bar */}
            <div
                className="
          flex
          items-center
          gap-1
          overflow-x-auto
          rounded-lg
          border
          border-border
          bg-surface
          p-1
          sm:gap-1.5
          sm:rounded-xl
          sm:p-1.5
          custom-scrollbar
        "
            >
                {items.map((item) => {
                    const isActive =
                        activeMain === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            disabled={item.disabled}
                            onClick={() =>
                                handleMainClick(item)
                            }
                            className={`
                shrink-0
                cursor-pointer
                rounded-md
                px-2.5
                py-1.5
                text-[11px]
                font-medium
                leading-4
                transition-all
                duration-200

                sm:rounded-lg
                sm:px-4
                sm:py-2
                sm:text-sm

                ${isActive
                                    ? `
                        bg-primary
                        text-white
                        shadow-[0_3px_10px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]
                      `
                                    : `
                        bg-transparent
                        text-text-secondary
                        hover:bg-card-hover
                        hover:text-text
                      `
                                }

                disabled:pointer-events-none
                disabled:cursor-not-allowed
                disabled:opacity-40
              `}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
            {/* Sub Button Bar */}
            {!!activeItem?.subButtons?.length && (
                <div
                    className="
                        mt-2
                        flex items-center gap-1
                        overflow-x-auto
                        rounded-lg
                        border border-border
                        bg-card
                        p-1
                        custom-scrollbar
                    "
                >
                    {activeItem.subButtons.map((sub) => {
                        const isActive = activeSub === sub.id;

                        return (
                            <button
                                key={sub.id}
                                type="button"
                                disabled={sub.disabled}
                                onClick={() => handleSubClick(sub)}
                                className={`
                                    shrink-0
                                    cursor-pointer
                                    rounded-md
                                    px-3.5 py-1.5
                                    text-[13px] font-medium
                                    transition-all duration-200

                                    ${isActive
                                        ? `
                                                bg-primary/15
                                                text-primary-light
                                                ring-1
                                                ring-primary-light/20
                                            `
                                        : `
                                                text-text-muted
                                                hover:bg-card-hover
                                                hover:text-text-secondary
                                            `
                                    }

                                    disabled:pointer-events-none
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                `}
                            >
                                {sub.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default ButtonBar;
