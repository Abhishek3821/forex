import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { capMarketServer } from "../constant/apiclient";
import type { BankDetails, CryptoDetails, upi_details, Withdraw } from "../interface/interface";
import { useUser } from "../constant/UserProvider";
export interface WithdrawQueryParams {
    status?: string;
    searchQuery?: string;
    startDate?: string;
    endDate?: string;
    date?: string;
    pageNumber?: number;
    pageSize?: number;
};
export interface WithdrawListResponse {
    success: boolean;
    results: Withdraw[];
    pagination: {
        total: number;
        pageNumber: number;
        totalPages: number;
        pageSize: number;
        next: boolean;
        previous: boolean;
    };
}
export interface CreateWithdrawPayload {
    trade_user_id: string;
    amount: number;
    paymentMethod: "bank_transfer" | "upi" | "crypto";
    remark?: string;
    bank_details?: BankDetails;
    upi_details?: upi_details;
    crypto_details?: CryptoDetails;
}
export interface CreateWithdrawResponse {
    success: boolean;
    message: string;
    data: Withdraw;
}
const fetchWithdrawData = (params: WithdrawQueryParams): Promise<WithdrawListResponse> =>
    capMarketServer.get("/tradeAccount/WithdrawList", { params }).then(res => res.data);
const createWithdrawApi = (data: CreateWithdrawPayload): Promise<CreateWithdrawResponse> =>
    capMarketServer.post("/tradeAccount/create/withdraw", data).then(res => res.data);
export const useWithdrawsData = ({
    status = "", searchQuery = "", endDate = "", startDate = "", pageNumber = 1, pageSize = 10,
}: WithdrawQueryParams) => {
    const { activeTradeAccount } = useUser();
    const params: WithdrawQueryParams = {
        ...status && { status },
        ...searchQuery && { searchQuery },
        ...startDate && { startDate },
        ...endDate && { endDate },
        ...pageNumber && { pageNumber },
        ...pageSize && { pageSize },
        ...activeTradeAccount?._id && { trade_user_id: activeTradeAccount._id }
    };

    const { isLoading, isError, data, refetch } = useQuery<WithdrawListResponse, AxiosError>({
        queryKey: ["AllWithdraws", params],
        queryFn: () => fetchWithdrawData(params),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });

    return { isLoading, isError, data, refetch };
};

export const useCreateWithdraw = () => {
    const queryClient = useQueryClient();
    return useMutation<CreateWithdrawResponse, AxiosError, CreateWithdrawPayload>({
        mutationFn: createWithdrawApi,
        mutationKey: ["withdraw_create"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["AllWithdraws"],
            });
            queryClient.invalidateQueries({
                queryKey: ["Tradeusers"],
            });
        },
    });
};
