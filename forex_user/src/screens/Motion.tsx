import type { Variants } from "framer-motion";
import { motion } from "framer-motion"
import type { ReactNode } from "react";

interface MotionWrapperProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    y?: number;
    x?: number;
    scale?: number;
    once?: boolean;
}

export default function MotionWrapper({
    children,
    className,
    delay = 0,
    duration = 0.4,
    y = 20,
    x = 0,
    scale = 1,
    once = true,
}: MotionWrapperProps) {
    const variants: Variants = {
        hidden: {
            opacity: 0,
            y,
            x,
            scale,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            transition: {
                duration,
                delay,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount: 0.2 }}
        >
            {children}
        </motion.div>
    );
}