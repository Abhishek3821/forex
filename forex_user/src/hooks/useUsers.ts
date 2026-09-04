import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { capMarketServer } from "../constant/apiclient";
import type { ITradeAccount, User } from "../interface/interface";
import { getToken } from "../utils/getTocken";
interface VerifyUserResponse {
    success: boolean;
    message: string;
    data?: any;
}
export interface VerifyUserPayload {
    user_id: string;
    status: string;
}
const kycVerifyApi = ({ user_id, status }: VerifyUserPayload) =>
    capMarketServer.put(`/verifyuser/${user_id}`, { status }).then((res) => res.data);
export const useActionUser = () => {
    const verifyKycUser = useMutation<VerifyUserResponse, AxiosError, VerifyUserPayload>({
        mutationFn: kycVerifyApi,
    });
    return { verifyKycUser };
};
export interface UsersQueryParams {
    status?: string;
    searchQuery?: string;
    startDate?: string;
    endDate?: string;
    date?: string;
    pageNumber?: number;
    pageSize?: number;
    broker_id?: string;
    countryCode?: string;
    refered_by?: string;
    accountType?: "live" | "demo";
};
export interface UsersResponse {
    success: boolean;
    results: User[];
    pagination: {
        total: number;
        pageNumber: number;
        totalPages: number;
        pageSize: number;
        next: boolean;
        previous: boolean;
    };
};
const fetchUsersData = (params: UsersQueryParams): Promise<UsersResponse> =>
    capMarketServer.get(`/users`, { params }).then(res => res.data);
export const useUsersData = ({ countryCode = "", refered_by = "", status = "", searchQuery = "", endDate = "", startDate = "", pageNumber = 1, pageSize = 10, }: UsersQueryParams) => {
    const params: UsersQueryParams = {
        ...status && { status },
        ...searchQuery && { searchQuery },
        ...startDate && { startDate },
        ...endDate && { endDate },
        ...pageNumber && { pageNumber },
        ...pageSize && { pageSize },
        ...refered_by && { refered_by },
        ...countryCode && { countryCode },
    }
    const { isLoading, isError, data, refetch } = useQuery<UsersResponse, AxiosError>({
        queryKey: ["Allusers", params],
        queryFn: () => fetchUsersData(params),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });
    return { isLoading, isError, data, refetch }
};
export interface TradeAccountResPonse {
    success: boolean;
    results: ITradeAccount[];
    pagination: {
        total: number;
        pageNumber: number;
        totalPages: number;
        pageSize: number;
        next: boolean;
        previous: boolean;
    };
}
const FetchUserTradeAccount = (params: UsersQueryParams): Promise<TradeAccountResPonse> =>
    capMarketServer.get(`tradeAccounts`, { params }).then(res => res.data);
export const useUserTradeAccount = ({ status = "", searchQuery = "", endDate = "", startDate = "", pageNumber = 1, pageSize = 10, accountType = undefined }: UsersQueryParams) => {
    const params: UsersQueryParams = {
        ...status && { status },
        ...searchQuery && { searchQuery },
        ...startDate && { startDate },
        ...endDate && { endDate },
        ...pageNumber && { pageNumber },
        ...pageSize && { pageSize },
        ...accountType && { accountType }
    }
    const { isLoading, isError, data, refetch } = useQuery<TradeAccountResPonse, AxiosError>({
        queryKey: ["Tradeusers", params],
        queryFn: () => FetchUserTradeAccount(params),
        staleTime: 3000,
        enabled: !!getToken(),
        refetchOnWindowFocus: false,
    });
    return { isLoading, isError, data, refetch }
};
interface updateTradeAccountPayload {
    data: Partial<ITradeAccount>
}
interface updateTradeAccountResponse {
    success: boolean;
    message: string,
    data: ITradeAccount
}
export const updateTradeAccountApi = ({ data }: updateTradeAccountPayload) => capMarketServer.put(`/tradeUser/update/`, data).then(res => res.data);
export const createTradeAccountApi = ({ data }: updateTradeAccountPayload) => capMarketServer.post(`/createTradeAccount`, data).then(res => res.data);
export const useUserTradeAccountAction = () => {
    const updateUserTradeAccountUpdate = useMutation<updateTradeAccountResponse, AxiosError, updateTradeAccountPayload>({
        mutationFn: updateTradeAccountApi,
    });
    const createUserTradeAccount = useMutation<updateTradeAccountResponse, AxiosError, updateTradeAccountPayload>({
        mutationFn: createTradeAccountApi,
    });
    return { updateUserTradeAccountUpdate, createUserTradeAccount };
}
type UpdateUserPayload = {
    user_id: string;
    data: Partial<User>
};
const updateUser = async ({ user_id, data }: UpdateUserPayload) => {
    const response = await capMarketServer.put(`/user/update/${user_id}`, data);
    return response.data;
};
export const createUserAccount = (data: Partial<User>) => capMarketServer.post("/user/create-account", data).then(res => res.data);
export const useUserActionHook = () => {
    const createAccountMutation = useMutation<updateTradeAccountResponse, AxiosError, Partial<User>>({
        mutationFn: createUserAccount,
    });
    const updateUserMutation = useMutation<updateTradeAccountResponse, AxiosError, UpdateUserPayload>({
        mutationFn: updateUser,
    });
    return { createAccountMutation, updateUserMutation };
}