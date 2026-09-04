import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { capMarketServer } from "../constant/apiclient";
import type { Deposit, PaginationInterface, companyMerchantInterface } from "../interface/interface";
import { useUser } from "../constant/UserProvider";
export interface DepositQueryParams {
    status?: 'pending' | 'success' | 'failed' | 'rejected' | "";
    mode?: "online" | "manual" | ""
    searchQuery?: string;
    startDate?: string;
    endDate?: string;
    date?: string;
    pageNumber?: number;
    pageSize?: number;
}
export interface MerchantQueryParams {
    status?: "active" | "inactive" | "";
    searchQuery?: string;
    startDate?: string;
    endDate?: string;
    date?: string;
    pageNumber?: number;
    pageSize?: number;
}
export interface DepositListResponse {
    success: boolean;
    results: Deposit[];
    pagination: PaginationInterface;
}
export interface MerchantListResponse {
    success: boolean;
    results: companyMerchantInterface[];
    pagination: PaginationInterface;
}
export interface CreateDepositPayload {
    trade_user_id: string;
    amount: number;
    payment_mode: "bank_transfer" | "UPI" | "Crypto";
    merchant_id?: string;
    utr_number?: string;
    gateway_name?: "manual" | "online";
}
export interface CreateDepositResponse {
    success: boolean;
    message: string;
    data: Deposit;
}
const fetchDepositData = (params: DepositQueryParams): Promise<DepositListResponse> =>
    capMarketServer.get("/tradeAccount/depositList", { params }).then(res => res.data);
const fetchMerchantData = (params: MerchantQueryParams): Promise<MerchantListResponse> =>
    capMarketServer.get("/merchant/account-list", { params }).then(res => res.data);
const createDepositApi = (data: CreateDepositPayload): Promise<CreateDepositResponse> =>
    capMarketServer.post("/tradeAccount/create/deposit", data).then(res => res.data);

export const useDepositsData = ({
    status = "", searchQuery = "", endDate = "", startDate = "", pageNumber = 1, pageSize = 10, mode = "",
}: DepositQueryParams) => {
    const { activeTradeAccount } = useUser();
    const params: DepositQueryParams = {
        ...status && { status },
        ...searchQuery && { searchQuery },
        ...startDate && { startDate },
        ...endDate && { endDate },
        ...pageNumber && { pageNumber },
        ...pageSize && { pageSize },
        ...mode && { mode },
        ...activeTradeAccount?._id && { trade_user_id: activeTradeAccount._id }
    };

    const { isLoading, isError, data, refetch } = useQuery<DepositListResponse, AxiosError>({
        queryKey: ["AllDeposits", params],
        queryFn: () => fetchDepositData(params),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });

    return { isLoading, isError, data, refetch };
};

export const useMerchantAccounts = ({
    status = "active", searchQuery = "", endDate = "", startDate = "", pageNumber = 1, pageSize = 50,
}: MerchantQueryParams = {}) => {
    const params: MerchantQueryParams = {
        ...status && { status },
        ...searchQuery && { searchQuery },
        ...startDate && { startDate },
        ...endDate && { endDate },
        ...pageNumber && { pageNumber },
        ...pageSize && { pageSize },
    };

    return useQuery<MerchantListResponse, AxiosError>({
        queryKey: ["merchant_accounts", params],
        queryFn: () => fetchMerchantData(params),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });
};

export const useCreateDeposit = () => {
    const queryClient = useQueryClient();
    return useMutation<CreateDepositResponse, AxiosError, CreateDepositPayload>({
        mutationFn: createDepositApi,
        mutationKey: ["deposit_create"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["AllDeposits"],
            });
            queryClient.invalidateQueries({
                queryKey: ["Tradeusers"],
            });
        },
    });
};
