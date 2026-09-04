import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { capMarketServer } from "../constant/apiclient";
import type { PaginationInterface } from "../interface/interface";

export interface IbDashboardData {
    referralLink: string;
    walletBalance: number;
    totalCommission: number;
    totalTrades: number;
}

export interface IbDashboardResponse {
    success: boolean;
    data: IbDashboardData;
}

export interface IbBankDetails {
    bankAccountNumber?: string | null;
    ifscCode?: string | null;
    bankName?: string | null;
}

export interface IbTransaction {
    _id: string;
    user_id: string;
    completedAt?: string | null;
    trade_user_id?: string;
    source?: string;
    transaction_id: string;
    amount: number;
    closingBalance: number;
    bank_details?: IbBankDetails | null;
    paymentMethod: "bank_transfer" | "upi" | "crypto" | string;
    gateway_name?: string;
    conversion_rate?: number;
    credited_amount?: number;
    conversion_currency?: string;
    payment_unique_number?: string | null;
    merchant_id?: string | null;
    status: "pending" | "approved" | "success" | "failed" | "rejected" | string;
    remark?: string;
    createdAt: string;
    updatedAt?: string;
    actionBy?: string;
    broker_id?: string;
}

export interface IbTransactionResponse {
    success: boolean;
    results: IbTransaction[];
    pagination: PaginationInterface;
}

export interface ReferralData {
    userId: string;
    accountId: string;
    trade_accountId?: string;
    name: string;
    level: number;
    totalLot: number;
    totalCommissionAmount: number;
}

export interface ReferralSummary {
    totalLot: number;
    totalCommission: number;
}

export interface ReferralResponse {
    success: boolean;
    message: string;
    data: ReferralData[];
    summary: ReferralSummary;
}

export interface IbQueryParams {
    pageNumber?: number;
    pageSize?: number;
    status?: string;
    searchQuery?: string;
    startDate?: string;
    endDate?: string;
}

const IB_TRANSACTION_ENDPOINT = "/ib-transactions";

const cleanParams = (params: IbQueryParams) =>
    Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== "" && value !== undefined)
    );

const fetchIbDashboard = (): Promise<IbDashboardResponse> =>
    capMarketServer.get("/ib-dashborad").then((res) => res.data);

const fetchIbTransactions = (params: IbQueryParams): Promise<IbTransactionResponse> =>
    capMarketServer
        .get(IB_TRANSACTION_ENDPOINT, { params: cleanParams(params) })
        .then((res) => res.data);

const fetchReferralCommission = (): Promise<ReferralResponse> =>
    capMarketServer.get("/referelal-commision").then((res) => res.data);

export const useIbDashboard = () =>
    useQuery<IbDashboardResponse, AxiosError>({
        queryKey: ["IbDashboard"],
        queryFn: fetchIbDashboard,
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });

export const useIbTransactions = ({
    pageNumber = 1,
    pageSize = 10,
    status = "",
    searchQuery = "",
    startDate = "",
    endDate = "",
}: IbQueryParams) =>
    useQuery<IbTransactionResponse, AxiosError>({
        queryKey: [
            "IbTransactions",
            { pageNumber, pageSize, status, searchQuery, startDate, endDate },
        ],
        queryFn: () =>
            fetchIbTransactions({
                pageNumber,
                pageSize,
                status,
                searchQuery,
                startDate,
                endDate,
            }),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });

export const useReferralCommission = () =>
    useQuery<ReferralResponse, AxiosError>({
        queryKey: ["ReferralCommission"],
        queryFn: fetchReferralCommission,
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });
