import {
    type PointerEvent as ReactPointerEvent,
} from "react";
export function ResizeHandle({
    direction,
    onPointerDown,
}: {
    direction: "vertical" | "horizontal";
    onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
}) {
    if (direction === "horizontal") {
        return (
            <div
                onPointerDown={onPointerDown}
                className="group flex h-2 shrink-0 touch-none select-none cursor-row-resize items-center justify-center bg-border transition hover:bg-primary/40"
            >
                <div className="h-px w-16 rounded-full bg-text-muted/40 transition group-hover:bg-primary" />
            </div>
        );
    }

    return (
        <div
            onPointerDown={onPointerDown}
            className="group flex w-2 touch-none select-none cursor-col-resize items-center justify-center bg-border transition hover:bg-primary/40"
        >
            <div className="h-16 w-px rounded-full bg-text-muted/40 transition group-hover:bg-primary" />
        </div>
    );
}
