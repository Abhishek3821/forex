import { useQuery } from "@tanstack/react-query";
import type { UsersQueryParams } from "./useUsers";
import { capMarketServer } from "../constant/apiclient";
import type { SymbolDetail } from "../interface/interface";
import type { AxiosError } from "axios";
export interface SymbolDetailResponse {
    success: boolean;
    results: SymbolDetail[];
    pagination: {
        total: number;
        pageNumber: number;
        totalPages: number;
        pageSize: number;
        next: boolean;
        previous: boolean;
    };
};
const fetchSymbolDetail = (params: UsersQueryParams): Promise<SymbolDetailResponse> =>
    capMarketServer.get(`/symbol/details`, { params }).then(res => res.data);
export const useSymbolDetailList = ({ status = "", searchQuery = "", endDate = "", startDate = "", pageNumber = 1, pageSize = 10 }: UsersQueryParams) => {
    const params: UsersQueryParams = {
        ...status && { status },
        ...searchQuery && { searchQuery },
        ...startDate && { startDate },
        ...endDate && { endDate },
        ...pageNumber && { pageNumber },
        ...pageSize && { pageSize },
    };
    const { isLoading, isError, data, refetch } = useQuery<SymbolDetailResponse, AxiosError>({
        queryKey: ["SymbolDetails", params],
        queryFn: () => fetchSymbolDetail(params),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });
    return { isLoading, isError, data, refetch }
};
