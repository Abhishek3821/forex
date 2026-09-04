import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { capMarketServer } from "../constant/apiclient";
import type { PaginationInterface } from "../interface/interface";

export type MasterMode = "MAM" | "PAMM" | "COPY";

export interface MasterLeaderboardItem {
    _id: string;
    strategyName: string;
    followers: number;
    seven_day_return: number;
    current_month_return: number;
    aum: number;
    following: boolean;
    isSelf: boolean;
    riskFactor: number;
}

export interface MasterLeaderboardParams {
    mode: MasterMode;
    trade_user_id?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface MasterLeaderboardResponse {
    success: boolean;
    results: MasterLeaderboardItem[];
    pagination: PaginationInterface;
}

const fetchMasterLeaderboard = ({
    mode,
    ...params
}: MasterLeaderboardParams): Promise<MasterLeaderboardResponse> =>
    capMarketServer
        .get(`/leaderboard/${mode}`, { params })
        .then((res) => res.data);

export const useMasterLeaderboard = ({
    mode,
    trade_user_id = "",
    pageNumber = 1,
    pageSize = 10,
}: MasterLeaderboardParams) => {
    const params: MasterLeaderboardParams = {
        mode,
        ...trade_user_id && { trade_user_id },
        ...pageNumber && { pageNumber },
        ...pageSize && { pageSize },
    };

    return useQuery<MasterLeaderboardResponse, AxiosError>({
        queryKey: ["master_leaderboard", params],
        queryFn: () => fetchMasterLeaderboard(params),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });
};
