import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { capMarketServer } from "../constant/apiclient";
export interface ICandle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

export interface ICandleResponse {
    success: boolean;
    results: ICandle[];
    pagination: {
        total: number;
        pageNumber: number;
        totalPages: number;
        pageSize: number;
        next: boolean;
        previous: boolean;
    };
}

interface CandleProgramParams {
    symbol: string;
    timeframe: string;
    fromMs: number,
    toMs: number,
    trade_user_id?: string
}
export const fetchCandles = async (
    params: CandleProgramParams
): Promise<ICandleResponse> =>
    capMarketServer.get("/candle-list", { params }).then(res => res.data);
export const useCandleList = ({
    symbol = "", timeframe = "", fromMs = 1, toMs = 10
}: CandleProgramParams) => {
    const params = {
        symbol, timeframe, fromMs, toMs
    };
    return useQuery<ICandleResponse, AxiosError>({
        queryKey: ["candles", params],
        queryFn: () =>
            fetchCandles(params),
        staleTime: 1000 * 60 * 5,
    });
};