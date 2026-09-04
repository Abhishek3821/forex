import React, { useMemo } from "react";

const DOTS = "...";

type Props = {
    siblingCount?: number;
    currentPage: number;
    handlePageChange: (
        page: number,
        totalPages: number
    ) => void;
    pageSize: number;
    handlePageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
    totalCount: number;
};

const PaginationSelector: React.FC<Props> = ({
    currentPage,
    handlePageChange,
    pageSize,
    handlePageSizeChange,
    pageSizeOptions = [5, 10, 20, 50, 100, 200],
    siblingCount = 1,
    totalCount,
}) => {
    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(totalCount / pageSize)),
        [totalCount, pageSize]
    );

    const paginationRange = useMemo(() => {
        const totalPageNumbers = siblingCount + 5;

        if (totalPageNumbers >= totalPages) {
            return Array.from(
                { length: totalPages },
                (_, i) => i + 1
            );
        }

        const leftSibling = Math.max(
            currentPage - siblingCount,
            1
        );

        const rightSibling = Math.min(
            currentPage + siblingCount,
            totalPages
        );

        const shouldShowLeftDots = leftSibling > 2;
        const shouldShowRightDots =
            rightSibling < totalPages - 1;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftRange = Array.from(
                { length: 3 + 2 * siblingCount },
                (_, i) => i + 1
            );

            return [...leftRange, DOTS, totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightRange = Array.from(
                { length: 3 + 2 * siblingCount },
                (_, i) =>
                    totalPages -
                    (3 + 2 * siblingCount) +
                    i +
                    1
            );

            return [1, DOTS, ...rightRange];
        }

        const middleRange = Array.from(
            {
                length: rightSibling - leftSibling + 1,
            },
            (_, i) => leftSibling + i
        );

        return [
            1,
            DOTS,
            ...middleRange,
            DOTS,
            totalPages,
        ];
    }, [currentPage, siblingCount, totalPages]);

    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;

    return (
        <div
            className="
        flex
        flex-col
        items-center
        justify-between
        gap-3
        rounded-b-lg
        border-t
        border-border
        bg-surface
        px-3
        py-2
        text-text
        sm:flex-row
      "
        >
            <div className="hidden items-center gap-2 sm:flex">
                <label className="text-xs text-text-secondary">
                    Rows:
                </label>

                <select
                    value={pageSize}
                    onChange={(e) =>
                        handlePageSizeChange(Number(e.target.value))
                    }
                    className="
            rounded-md
            border
            border-border
            bg-card
            px-2
            py-1
            text-xs
            text-text
            outline-none
            transition
            hover:border-border-light
            focus:border-primary
          "
                >
                    {pageSizeOptions.map((size) => (
                        <option
                            key={size}
                            value={size}
                            className="bg-card text-text"
                        >
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1">
                <button
                    type="button"
                    onClick={() =>
                        handlePageChange(
                            currentPage - 1,
                            totalPages
                        )
                    }
                    disabled={isFirstPage}
                    className="
            rounded-md
            border
            border-border
            bg-card
            px-2.5
            py-1.5
            text-xs
            font-medium
            text-text-secondary
            transition
            hover:border-border-light
            hover:bg-card-hover
            hover:text-text
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
                >
                    Prev
                </button>

                {paginationRange.map((page, idx) =>
                    page === DOTS ? (
                        <span
                            key={`dots-${idx}`}
                            className="px-2 text-xs text-text-muted"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            type="button"
                            key={Number(page)}
                            onClick={() =>
                                handlePageChange(
                                    Number(page),
                                    totalPages
                                )
                            }
                            className={`
                rounded-md
                border
                px-2.5
                py-1.5
                text-xs
                font-medium
                transition
                ${currentPage === page
                                    ? `
                      border-primary
                      bg-primary
                      text-white
                      shadow-sm
                    `
                                    : `
                      border-border
                      bg-card
                      text-text-secondary
                      hover:border-border-light
                      hover:bg-card-hover
                      hover:text-text
                    `
                                }
              `}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() =>
                        handlePageChange(
                            currentPage + 1,
                            totalPages
                        )
                    }
                    disabled={isLastPage}
                    className="
            rounded-md
            border
            border-border
            bg-card
            px-2.5
            py-1.5
            text-xs
            font-medium
            text-text-secondary
            transition
            hover:border-border-light
            hover:bg-card-hover
            hover:text-text
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PaginationSelector;