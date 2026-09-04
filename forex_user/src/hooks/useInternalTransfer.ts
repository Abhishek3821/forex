import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { capMarketServer } from "../constant/apiclient";
import type { ITradeAccount, PaginationInterface } from "../interface/interface";
export interface IInternalTransfer {
    _id: string;
    transactionId: string;
    sourceAccount: ITradeAccount;
    destinationAccount: ITradeAccount;
    amount: number;
    fee: number;
    transferType: "DEMO_TO_DEMO" | "LIVE_TO_LIVE";
    status: "pending" | "completed" | "failed" | "rejected";
    initiatedBy: ITradeAccount;
    sourceClosingBalance: number;
    destinationClosingBalance: number;
    createdAt: string;
    updatedAt: string;
    remark: string;
}
export interface CreateInternalTransferPayload {
    sourceAccount: string;
    destinationAccount: string;
    amount: number;
    remark?: string;
}
export interface InternalTransferQueryParams {
    pageNumber?: number;
    pageSize?: number;
}

export interface InternalTransferListResponse {
    success: boolean;
    results: IInternalTransfer[];
    pagination: PaginationInterface;
}

export interface CreateInternalTransferResponse {
    success: boolean;
    message: string;
    data: IInternalTransfer;
}
const createInternalTransferApi = (
    data: CreateInternalTransferPayload
): Promise<CreateInternalTransferResponse> =>
    capMarketServer
        .post("/tradeAccount/create/internal-transfer", data)
        .then((res) => res.data);

const fetchInternalTransferHistory = (
    accountId: string,
    params: InternalTransferQueryParams
): Promise<InternalTransferListResponse> =>
    capMarketServer
        .get(`/tradeAccount/${accountId}/transfer-history`, { params })
        .then((res) => res.data);
export const useCreateInternalTransfer = () => {
    const queryClient = useQueryClient();
    return useMutation<
        CreateInternalTransferResponse,
        AxiosError,
        CreateInternalTransferPayload
    >({
        mutationFn: createInternalTransferApi,
        mutationKey: ["internal_transfer_create"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["internal_transfer_history"],
            });
            queryClient.invalidateQueries({
                queryKey: ["Tradeusers"],
            });
        },
    });
};

export const useInternalTransferHistory = (
    accountId: string | undefined,
    {
        pageNumber = 1,
        pageSize = 10,
    }: InternalTransferQueryParams = {}
) => {
    const params: InternalTransferQueryParams = {
        ...pageNumber && { pageNumber },
        ...pageSize && { pageSize },
    };

    return useQuery<InternalTransferListResponse, AxiosError>({
        queryKey: ["internal_transfer_history", accountId, params],
        queryFn: () => fetchInternalTransferHistory(accountId ?? "", params),
        enabled: !!accountId,
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });
};
