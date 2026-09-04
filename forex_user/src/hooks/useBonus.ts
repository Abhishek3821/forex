import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { capMarketServer } from "../constant/apiclient";
import { getToken } from "../utils/getTocken";

export interface BonusItem {
    _id: string;
    title?: string;
    name?: string;
    bonusName?: string;
    amount?: number;
    bonusAmount?: number;
    percentage?: number;
    status?: string;
    type?: string;
    description?: string;
    minDeposit?: number;
    maxBonus?: number;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
}

export interface BonusListResponse {
    success: boolean;
    results?: BonusItem[];
    data?: BonusItem[];
    message?: string;
}

const fetchBonusList = (): Promise<BonusListResponse> =>
    capMarketServer.get("/bonus-list").then((res) => res.data);

const fetchRedeemBonusList = (): Promise<BonusListResponse> =>
    capMarketServer.get("/reedem-bonus-list").then((res) => res.data);

export const useBonusList = () =>
    useQuery<BonusListResponse, AxiosError>({
        queryKey: ["bonus-list"],
        queryFn: fetchBonusList,
        enabled: !!getToken(),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });

export const useRedeemBonusList = () =>
    useQuery<BonusListResponse, AxiosError>({
        queryKey: ["redeem-bonus-list"],
        queryFn: fetchRedeemBonusList,
        enabled: !!getToken(),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });

