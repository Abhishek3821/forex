import React, { useState } from "react";
export interface SubButtonItem {
    id: string;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
};
export interface ButtonItem {
    id: string;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    subButtons?: SubButtonItem[];
}

interface ButtonBarProps {
    items: ButtonItem[];
    className?: string;
}

const ButtonBar: React.FC<ButtonBarProps> = ({
    items,
    className = "",
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

        setActiveSub(firstSub?.id ?? null);

        item.onClick?.();
    };

    const handleSubClick = (sub: SubButtonItem): void => {
        if (sub.disabled) return;

        setActiveSub(sub.id);

        sub.onClick?.();
    };

    if (!items.length) return null;

    return (
        <div className={`w-full bg-[#050914] p-3 ${className}`}>
            {/* Main Button Bar */}
            <div
                className="
          flex items-center gap-1.5
          overflow-x-auto
          rounded-xl
          border border-[#1E293B]
          bg-[#0B1220]
          p-1.5
        "
            >
                {items.map((item) => {
                    const isActive = activeMain === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            disabled={item.disabled}
                            onClick={() => handleMainClick(item)}
                            className={`
                shrink-0
                cursor-pointer
                rounded-lg
                px-4 py-2
                text-sm font-medium
                transition-all duration-200

                ${isActive
                                    ? `
                      bg-[#0A84FF]
                      text-white
                      shadow-[0_4px_15px_rgba(10,132,255,0.25)]
                    `
                                    : `
                      bg-transparent
                      text-[#A8B3C7]
                      hover:bg-[#172033]
                      hover:text-white
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
            border border-[#1E293B]
            bg-[#101827]
            p-1
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
                        bg-[#0A84FF]/15
                        text-[#38BDF8]
                        ring-1 ring-[#38BDF8]/20
                      `
                                        : `
                        text-[#6B7280]
                        hover:bg-[#172033]
                        hover:text-[#A8B3C7]
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