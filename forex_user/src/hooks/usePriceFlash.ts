import { useEffect, useRef, useState } from "react";

export function usePriceFlash(value: number, duration = 400) {
    const [flash, setFlash] = useState<"up" | "down" | null>(null);
    const prevValue = useRef(value);

    useEffect(() => {
        if (value === prevValue.current) return;

        if (value > prevValue.current) setFlash("up");
        else setFlash("down");

        prevValue.current = value;

        const timeout = setTimeout(() => setFlash(null), duration);
        return () => clearTimeout(timeout);
    }, [value, duration]);

    return flash;
}
