import React, {
    useEffect,
    useMemo,
    useRef,
} from "react";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode;

    currentPage: number;

    handlePageChange: (
        page: number,
        totalPages: number
    ) => void;

    pageSize: number;

    handlePageSizeChange: (size: number) => void;

    pageSizeOptions?: number[];

    totalCount: number;

    isLoading?: boolean;

    height?: string | number;

    loader?: ReactNode;

    endMessage?: ReactNode;

    className?: string;
};

const InfiniteScrollSelector: React.FC<Props> = ({
    children,

    currentPage,
    handlePageChange,
    pageSize,
    totalCount,

    isLoading = false,

    height,

    loader,
    endMessage,

    className = "",
}) => {
    const scrollContainerRef =
        useRef<HTMLDivElement | null>(null);

    const observerTargetRef =
        useRef<HTMLDivElement | null>(null);

    const totalPages = useMemo(() => {
        return Math.max(
            1,
            Math.ceil(totalCount / pageSize)
        );
    }, [totalCount, pageSize]);

    const hasMore = currentPage < totalPages;
    useEffect(() => {
        const target = observerTargetRef.current;
        if (!target) return;
        if (!hasMore) return;
        if (isLoading) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (
                    entry.isIntersecting &&
                    hasMore &&
                    !isLoading
                ) {
                    handlePageChange(
                        currentPage + 1,
                        totalPages
                    );
                }
            },
            {
                root: height
                    ? scrollContainerRef.current
                    : null,

                rootMargin: "100px",

                threshold: 0.1,
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [
        currentPage,
        totalPages,
        hasMore,
        isLoading,
        height,
        handlePageChange,
    ]);

    return (
        <div
            className={`
        w-full
        overflow-hidden
        rounded-lg
        border
        border-border
        bg-surface
        text-text
        ${className}
      `}
        >
            {/* Scroll Content */}
            <div
                ref={scrollContainerRef}
                style={
                    height
                        ? {
                            height,
                        }
                        : undefined
                }
                className={`
          bg-background
          text-text
          ${height
                        ? "overflow-y-auto overflow-x-hidden"
                        : "overflow-visible"
                    }
        `}
            >
                {children}

                {/* Intersection Observer Target */}
                {hasMore && !isLoading && (
                    <div
                        ref={observerTargetRef}
                        className="h-px w-full"
                    />
                )}

                {/* Loader */}
                {isLoading &&
                    (loader ?? (
                        <div
                            className="
                flex
                items-center
                justify-center
                py-4
              "
                        >
                            <div
                                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-text-muted
                "
                            >
                                <span
                                    className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-border
                    border-t-primary
                  "
                                />

                                Loading...
                            </div>
                        </div>
                    ))}

                {/* End */}
                {!hasMore &&
                    totalCount > 0 &&
                    !isLoading &&
                    (endMessage ?? (
                        <div
                            className="
                border-t
                border-border
                py-3
                text-center
                text-xs
                text-text-muted
              "
                        >
                            No more records
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default InfiniteScrollSelector;
