import { useCallback, useState } from "react";
export const usePagination = () => {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSizeValue, setPageSizeValue] = useState<number>(10);
    const startItem = (pageNumber - 1) * pageSizeValue + 1;
    const handlePageChange = useCallback((page: number, totalPages: number) => {
        if (page >= 1 && page <= totalPages && page !== pageNumber) {
            setPageNumber(page);
        }
    }, [pageNumber]);
    const handlePageSizeChange = useCallback((size: number) => {
        if (size > 0 && size !== pageSizeValue) {
            setPageSizeValue(size);
            setPageNumber(1);
        }
    }, [pageSizeValue]);
    const resetPagination = useCallback(() => {
        setPageNumber(1);
    }, []);
    return {
        startItem,
        handlePageChange,
        handlePageSizeChange,
        resetPagination,
        pageNumber,
        pageSizeValue,
    };
};
