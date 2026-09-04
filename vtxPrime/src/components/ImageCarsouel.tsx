import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageCarouselProps {
    images: string[];
    interval?: number;
    autoPlay?: boolean;
    className?: string;
}

export default function ImageCarousel({
    images,
    interval = 5000,
    autoPlay = true,
    className = "",
}: ImageCarouselProps) {
    const [active, setActive] = useState(0);

    const next = () => {
        setActive((prev) => (prev + 1) % images.length);
    };

    const prev = () => {
        setActive((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;

        const timer = setInterval(next, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, images.length]);

    if (!images.length) return null;

    return (
        <section className={`relative bg-background py-6 ${className}`}>
            <div className="container-page">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border-light bg-card/70 shadow-glow backdrop-blur-2xl">
                    <div
                        className="flex transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                        style={{ transform: `translateX(-${active * 100}%)` }}
                    >
                        {images.map((src, index) => (
                            <div key={src} className="min-w-full">
                                <img
                                    src={src}
                                    alt={`VTX Prime banner ${index + 1}`}
                                    className="h-[180px] w-full object-cover sm:h-[260px] md:h-[360px] lg:h-[430px]"
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                            </div>
                        ))}
                    </div>

                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={prev}
                                className="absolute left-2 sm:left-4 top-1/2 z-10 grid h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 -translate-y-1/2 place-items-center rounded-full border border-border-light bg-surface/80 text-white shadow-glow backdrop-blur transition hover:border-primary hover:bg-card-hover"
                                aria-label="Previous banner"
                            >
                                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                            </button>

                            <button
                                type="button"
                                onClick={next}
                                className="absolute right-2 sm:right-4 top-1/2 z-10 grid h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 -translate-y-1/2 place-items-center rounded-full border border-border-light bg-surface/80 text-white shadow-glow backdrop-blur transition hover:border-primary hover:bg-card-hover"
                                aria-label="Next banner"
                            >
                                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                            </button>

                            <div className="absolute bottom-3 sm:bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setActive(index)}
                                        className={`h-2.5 rounded-full transition-all ${active === index
                                            ? "w-8 bg-primary shadow-glow"
                                            : "w-2.5 bg-steel/60 hover:bg-primary-light"
                                            }`}
                                        aria-label={`Go to banner ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}