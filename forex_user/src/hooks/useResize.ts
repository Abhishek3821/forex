import { useCallback, useState } from "react";
import { type PointerEvent as ReactPointerEvent } from "react";
type ResizeTarget = "left" | "right" | "bottom";

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function useResizableTerminal() {
    const [leftWidth, setLeftWidth] = useState(260);
    const [rightWidth, setRightWidth] = useState(330);
    const [bottomHeight, setBottomHeight] = useState(260);

    const startResize = useCallback(
        (target: ResizeTarget) =>
            (event: ReactPointerEvent<HTMLDivElement>) => {
                event.preventDefault();
                event.currentTarget.setPointerCapture?.(event.pointerId);

                const startX = event.clientX;
                const startY = event.clientY;

                const startLeftWidth = leftWidth;
                const startRightWidth = rightWidth;
                const startBottomHeight = bottomHeight;
                let frameId: number | null = null;
                let nextLeftWidth = startLeftWidth;
                let nextRightWidth = startRightWidth;
                let nextBottomHeight = startBottomHeight;

                const applySize = () => {
                    frameId = null;

                    if (target === "left") {
                        setLeftWidth(nextLeftWidth);
                    }

                    if (target === "right") {
                        setRightWidth(nextRightWidth);
                    }

                    if (target === "bottom") {
                        setBottomHeight(nextBottomHeight);
                    }
                };

                const scheduleSize = () => {
                    if (frameId !== null) return;

                    frameId = window.requestAnimationFrame(applySize);
                };

                const onPointerMove = (moveEvent: PointerEvent) => {
                    if (target === "left") {
                        const nextWidth = startLeftWidth + (moveEvent.clientX - startX);
                        nextLeftWidth = clamp(nextWidth, 220, 420);
                    }

                    if (target === "right") {
                        const nextWidth = startRightWidth - (moveEvent.clientX - startX);
                        nextRightWidth = clamp(nextWidth, 300, 480);
                    }

                    if (target === "bottom") {
                        const nextHeight = startBottomHeight - (moveEvent.clientY - startY);
                        nextBottomHeight = clamp(nextHeight, 180, 420);
                    }

                    scheduleSize();
                };

                const onPointerUp = () => {
                    if (frameId !== null) {
                        window.cancelAnimationFrame(frameId);
                        applySize();
                    }

                    window.removeEventListener("pointermove", onPointerMove);
                    window.removeEventListener("pointerup", onPointerUp);
                    document.body.style.userSelect = "";
                    document.body.style.cursor = "";
                };

                document.body.style.userSelect = "none";
                document.body.style.cursor =
                    target === "bottom" ? "row-resize" : "col-resize";

                window.addEventListener("pointermove", onPointerMove);
                window.addEventListener("pointerup", onPointerUp);
            },
        [bottomHeight, leftWidth, rightWidth]
    );

    return {
        leftWidth,
        rightWidth,
        bottomHeight,
        startResize,
    };
}
