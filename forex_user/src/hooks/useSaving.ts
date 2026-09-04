import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { capMarketServer } from "../constant/apiclient";
import { useUser } from "../constant/UserProvider";
import type { PaginationInterface } from "../interface/interface";

export interface SavingWallet {
    _id: string;
    type: "saving" | string;
    user_id: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export interface SavingWalletResponse {
    success: boolean;
    result: SavingWallet;
}

export interface SavingPackage {
    _id: string;
    broker_id: string;
    name: string;
    amount: number;
    roiType: string;
    roiPercentage: number;
    autoProfitGeneration: boolean;
    lockInPeriod: number;
    status: "active" | "inactive" | string;
    first_level_comm_per: number;
    first_level_comm_status: string;
    level_com_dis_status: string;
    createdAt: string;
    updatedAt: string;
}

export interface SavingPackageResponse {
    success: boolean;
    results: SavingPackage[];
    pagination: PaginationInterface;
}

export interface SavingTransaction {
    _id: string;
    user_id: string;
    transaction_id: string;
    wallet_type: string;
    type: "credit" | "debit" | string;
    amount: number;
    tax: number;
    net_amount: number;
    prev_balance: number;
    current_balance: number;
    source: string;
    source_path: string;
    remark: string;
    createdAt: string;
    updatedAt: string;
}

export interface SavingTransactionResponse {
    success: boolean;
    results: SavingTransaction[];
    pagination: PaginationInterface;
}

export interface SavingInvestment {
    _id: string;
    userId: string;
    broker_id: string;
    packageId: string;
    transaction_id: string;
    investedAmount: number;
    roiType: string;
    roiPercentage: number;
    autoProfitGeneration: boolean;
    lockInPeriod: number;
    startDate: string;
    endDate: string;
    totalProfitEarned: number;
    investmentStatus: "running" | "completed" | "cancelled" | string;
    createdAt: string;
    updatedAt: string;
    duration: number;
    total_return_amount: number;
}

export interface SavingInvestmentResponse {
    success: boolean;
    results: SavingInvestment[];
    pagination: PaginationInterface;
}

export interface SavingQueryParams {
    pageNumber?: number;
    pageSize?: number;
    mode?: string;
    max_level?: number;
    start_date?: string;
    end_date?: string;
}

export interface SavingReferCommission {
    _id?: string;
    userId?: string;
    primary_user_id?: string;
    referred_user_id?: string;
    accountId?: string;
    trade_accountId?: string;
    name?: string;
    level?: number;
    lot?: number;
    totalLot?: number;
    amount?: number;
    commission?: number;
    commissionAmount?: number;
    totalCommissionAmount?: number;
    remark?: string;
    createdAt?: string;
}

export interface SavingReferCommissionResponse {
    success: boolean;
    message?: string;
    data?: SavingReferCommission[];
    results?: SavingReferCommission[];
    summary?: {
        totalLot?: number;
        totalCommission?: number;
    };
    pagination?: PaginationInterface;
}

const cleanParams = (params: SavingQueryParams & { trade_user_id?: string; primary_user_id?: string }) =>
    Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== "" && value !== undefined)
    );

const fetchSavingWallet = (mode: string): Promise<SavingWalletResponse> =>
    capMarketServer
        .get("/saving-wallet", { params: { mode } })
        .then((res) => res.data);

const fetchSavingPackages = (
    params: SavingQueryParams
): Promise<SavingPackageResponse> =>
    capMarketServer
        .get("/package", { params: cleanParams(params) })
        .then((res) => res.data);

const fetchSavingTransactions = (
    params: SavingQueryParams
): Promise<SavingTransactionResponse> =>
    capMarketServer
        .get("/saving-transactions", { params: cleanParams(params) })
        .then((res) => res.data);

const fetchSavingInvestments = (
    params: SavingQueryParams & { trade_user_id?: string }
): Promise<SavingInvestmentResponse> =>
    capMarketServer
        .get("/getInvestment", { params: cleanParams(params) })
        .then((res) => res.data);

const fetchSavingReferCommission = (
    params: SavingQueryParams & { primary_user_id?: string }
): Promise<SavingReferCommissionResponse> =>
    capMarketServer
        .get("/saving-refer-commison", { params: cleanParams(params) })
        .then((res) => res.data);

export const useSavingWallet = (mode = "saving") =>
    useQuery<SavingWalletResponse, AxiosError>({
        queryKey: ["SavingWallet", mode],
        queryFn: () => fetchSavingWallet(mode),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });

export const useSavingPackages = ({
    pageNumber = 1,
    pageSize = 10,
}: SavingQueryParams) =>
    useQuery<SavingPackageResponse, AxiosError>({
        queryKey: ["SavingPackages", { pageNumber, pageSize }],
        queryFn: () => fetchSavingPackages({ pageNumber, pageSize }),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });

export const useSavingTransactions = ({
    pageNumber = 1,
    pageSize = 10,
    mode = "saving",
}: SavingQueryParams) =>
    useQuery<SavingTransactionResponse, AxiosError>({
        queryKey: ["SavingTransactions", { pageNumber, pageSize, mode }],
        queryFn: () => fetchSavingTransactions({ pageNumber, pageSize, mode }),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });

export const useSavingInvestments = ({
    pageNumber = 1,
    pageSize = 10,
}: SavingQueryParams) => {
    const { activeTradeAccount } = useUser();

    return useQuery<SavingInvestmentResponse, AxiosError>({
        queryKey: [
            "SavingInvestments",
            { trade_user_id: activeTradeAccount?._id, pageNumber, pageSize },
        ],
        queryFn: () =>
            fetchSavingInvestments({
                trade_user_id: activeTradeAccount?._id,
                pageNumber,
                pageSize,
            }),
        enabled: Boolean(activeTradeAccount?._id),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });
};

export const useSavingReferCommission = ({
    pageNumber = 1,
    pageSize = 10,
    max_level = 4,
    start_date = "",
    end_date = "",
}: SavingQueryParams) => {
    const { activeTradeAccount } = useUser();

    return useQuery<SavingReferCommissionResponse, AxiosError>({
        queryKey: [
            "SavingReferCommission",
            {
                primary_user_id: activeTradeAccount?._id,
                pageNumber,
                pageSize,
                max_level,
                start_date,
                end_date,
            },
        ],
        queryFn: () =>
            fetchSavingReferCommission({
                primary_user_id: activeTradeAccount?._id,
                pageNumber,
                pageSize,
                max_level,
                start_date,
                end_date,
            }),
        enabled: Boolean(activeTradeAccount?._id),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });
};
