import { useQuery } from "@tanstack/react-query";
import type { UsersQueryParams } from "./useUsers";
import { capMarketServer } from "../constant/apiclient";
import type { ComapanyGroupInterface } from "../interface/interface";
import type { AxiosError } from "axios";
export interface CompanyGroupResponse {
    success: boolean;
    results: ComapanyGroupInterface[];
    pagination: {
        total: number;
        pageNumber: number;
        totalPages: number;
        pageSize: number;
        next: boolean;
        previous: boolean;
    };
}
const fetchCompanyGroupData = (params: UsersQueryParams): Promise<CompanyGroupResponse> =>
    capMarketServer.get(`/company-group`, { params }).then(res => res.data);
export const useCompanyGroupList = ({ status = "", searchQuery = "", endDate = "", startDate = "", pageNumber = 1, pageSize = 10, broker_id = "" }: UsersQueryParams) => {
    const params: UsersQueryParams = {
        ...status && { status },
        ...searchQuery && { searchQuery },
        ...startDate && { startDate },
        ...endDate && { endDate },
        ...pageNumber && { pageNumber },
        ...pageSize && { pageSize },
        ...broker_id && { broker_id }
    }
    const { isLoading, isError, data, refetch } = useQuery<CompanyGroupResponse, AxiosError>({
        queryKey: ["CompanyGroup", params],
        queryFn: () => fetchCompanyGroupData(params),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });
    return { isLoading, isError, data, refetch }
};
