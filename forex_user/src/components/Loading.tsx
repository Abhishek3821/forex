import { motion } from "framer-motion";
import { vtxLogo } from "../assests";
type LoadingScreenProps = {
    fixed?: boolean;
    height?: string | number;
};
export default function LoadingScreen({
    fixed = false,
    height = "100%",
}: LoadingScreenProps) {
    const dark = localStorage.getItem("theme") === "dark";

    return (
        <div
            style={{
                height: fixed ? undefined : height,
            }}
            className={`
        flex
        items-center
        justify-center
        transition-colors
        duration-300
        ${fixed ? "fixed inset-0 z-50" : "w-full"}
        ${dark ? "bg-[#09090B]" : "bg-white"}
      `}
        >
            <div className="relative flex h-21 w-21 items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    className="absolute inset-0"
                >
                    <svg
                        viewBox="0 0 220 220"
                        className="h-full w-full"
                    >
                        <defs>
                            <linearGradient
                                id="loaderGradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="40%" stopColor="#2563EB" />
                                <stop offset="100%" stopColor="#06B6D4" />
                            </linearGradient>

                            <filter id="glow">
                                <feGaussianBlur
                                    stdDeviation="4"
                                    result="blur"
                                />

                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <circle
                            cx="110"
                            cy="110"
                            r="90"
                            fill="none"
                            stroke={dark ? "#1F2937" : "#E5E7EB"}
                            strokeWidth="5"
                        />

                        <circle
                            cx="110"
                            cy="110"
                            r="90"
                            fill="none"
                            stroke="url(#loaderGradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="180 420"
                            filter="url(#glow)"
                        />
                    </svg>
                </motion.div>

                <motion.div
                    animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                    }}
                    className="absolute h-40 w-40 rounded-full border border-blue-500/20"
                />

                <div className="z-10">
                    <img
                        src={vtxLogo}
                        alt="logo"
                        className="h-20 w-20 object-contain"
                    />
                </div>
            </div>
        </div>
    );
}