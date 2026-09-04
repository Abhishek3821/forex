import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { capMarketServer } from "../constant/apiclient";
import type { TradeListResponse } from "../interface/interface";
import { AxiosError } from "axios";
interface TradeListParams {
    status: "open" | "closed";
    pageNumber?: number;
    pageSize?: number;
    accountId: string;
    startDate?: string;
    endDate?: string;
}
export interface CloseTradePayload {
    tradeId: string;
    closing_lot: number;
}

export interface BulkCloseTradePayload {
    mode?: "profit" | "loss";
    symbol?: string;
    trade_user_id: string;
    bs?: "Buy" | "Sell";
}

interface UpdateTradePayload {
    _id: string;
    sl?: number;
    target?: number;
}
interface RemoveSLTPPayload {
    _id: string;
    removeSL?: boolean;
    removeTarget?: boolean;
}

export interface CreateTradePayload {
    tradeAccountId: string;
    symbol: string;
    lot: number;
    bs: "Buy" | "Sell";
    executionType: "limit" | "market";
    avg?: number;
    target?: number;
    sl?: number;
}

const getTradeListApi = (
    params: TradeListParams
): Promise<TradeListResponse> =>
    capMarketServer
        .get<TradeListResponse>("/trade/list", {
            params,
        })
        .then((res) => res.data);

export const useTradeList = (
    params: TradeListParams,
    enabled = true
) => {
    return useQuery<TradeListResponse, AxiosError>({
        queryKey: ["trade_list", params],
        queryFn: () => getTradeListApi(params),
        enabled,
    });
};

const closeTradeApi = (
    data: CloseTradePayload
): Promise<any> =>
    capMarketServer
        .post("/trade-close", data)
        .then((res) => res.data);

const bulkCloseTradeApi = (
    data: BulkCloseTradePayload
): Promise<any> =>
    capMarketServer
        .post("/bulk-trade-close", data)
        .then((res) => res.data);

export const useCloseTrade = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, CloseTradePayload>({
        mutationFn: closeTradeApi,
        mutationKey: ["trade_close"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trade_list"],
            });
        },
    });
};

const updateTradeApi = ({
    _id,
    ...data
}: UpdateTradePayload): Promise<any> =>
    capMarketServer
        .put(`/trade-update/${_id}`, data)
        .then((res) => res.data);

export const useUpdateTrade = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, UpdateTradePayload>({
        mutationFn: updateTradeApi,
        mutationKey: ["trade_update"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trade_list"],
            });
        },
    });
};

const removeSLTPApi = ({
    _id,
    ...data
}: RemoveSLTPPayload): Promise<any> =>
    capMarketServer
        .put(`/trade-sl-tp-rm/${_id}`, data)
        .then((res) => res.data);

export const useRemoveSLTP = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, RemoveSLTPPayload>({
        mutationFn: removeSLTPApi,
        mutationKey: ["trade_sl_tp_remove"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trade_list"],
            });
        },
    });
};

const createTradeApi = (
    data: CreateTradePayload
): Promise<any> =>
    capMarketServer
        .post("/tradeAccount/create/trade", data)
        .then((res) => res.data);

export const useCreateTrade = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, CreateTradePayload>({
        mutationFn: createTradeApi,
        mutationKey: ["trade_create"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trade_list"],
            });
        },
    });
};
export const useBulkCloseTrade = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, BulkCloseTradePayload>({
        mutationFn: bulkCloseTradeApi,
        mutationKey: ["bulk_trade_close"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trade_list"],
            });
        },
    });
};
