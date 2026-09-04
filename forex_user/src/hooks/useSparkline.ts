import { useEffect, useState } from "react";

export function createSparklinePoints(
    data: number[],
    width: number,
    height: number,
    padding = 3
) {
    if (!data.length) return "";

    if (data.length === 1) {
        const y = height / 2;
        return `${padding},${y} ${width - padding},${y}`;
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    return data
        .map((value, index) => {
            const x = padding + (index / (data.length - 1)) * innerWidth;
            const y = padding + (1 - (value - min) / range) * innerHeight;

            return `${x},${y}`;
        })
        .join(" ");
}

export function useSparklineHistory(value: number, maxPoints = 20) {
    const [history, setHistory] = useState<number[]>(() => [value]);

    useEffect(() => {
        setHistory((prev) => {
            const lastValue = prev[prev.length - 1];
            if (lastValue === value) return prev.slice(-maxPoints);
            return [...prev, value].slice(-maxPoints);
        });
    }, [value, maxPoints]);

    const firstValue = history[0];
    const lastValue = history[history.length - 1];

    const trend: "up" | "down" | "neutral" =
        lastValue > firstValue ? "up" : lastValue < firstValue ? "down" : "neutral";

    return { history, trend };
}
