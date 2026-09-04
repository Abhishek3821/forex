interface GuideIndicatorProps {
    show?: boolean;
    title?: string;
    direction?: "left" | "right" | "up" | "down";
    className?: string;
}

const GuideIndicator = ({
    show = true,
    title,
    direction = "right",
    className = "",
}: GuideIndicatorProps) => {
    if (!show) return null;

    const icons = {
        left: "arrow_back",
        right: "arrow_forward",
        up: "arrow_upward",
        down: "arrow_downward",
    };

    return (
        <div
            className={`
                group
                relative
                inline-flex
                items-center
                justify-center
                ${className}
            `}
        >
            {/* Indicator */}
            <span
                className="
                    material-symbols-outlined
                    cursor-help
                    animate-pulse
                    text-[24px]
                    font-semibold
                    text-primary
                "
            >
                {icons[direction]}
            </span>

            {title && (
                <div
                    className="
            pointer-events-none
            absolute
            left-1/2
            top-full
            z-50
            mt-2
            -translate-x-1/2
            -translate-y-1

            whitespace-nowrap
            rounded-md
            border border-border
            bg-card
            px-2.5
            py-1.5

            text-xs
            font-medium
            text-text

            opacity-0
            shadow-lg

            transition-all
            duration-150

            group-hover:translate-y-0
            group-hover:opacity-100
        "
                >
                    {title}

                    {/* Tooltip arrow pointing upward */}
                    <span
                        className="
                absolute
                bottom-full
                left-1/2
                -translate-x-1/2

                border-[5px]
                border-transparent
                border-b-card
            "
                    />
                </div>
            )}
        </div>
    );
};

export default GuideIndicator;