import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { capMarketServer } from "../constant/apiclient";
import type { BankInfo, UpiInfo, User } from "../interface/interface";
import { getToken } from "../utils/getTocken";

export interface ApiMessageResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    result?: T;
}

export interface UpdateProfilePayload {
    fullName?: string;
    phone?: string;
    country?: string | null;
    city?: string | null;
}

export interface UpdateBankDetailsPayload {
    bank?: Partial<BankInfo>;
    upi_details?: Partial<UpiInfo>;
    upi?: Partial<UpiInfo>;
}

export interface CryptoAddress {
    _id: string;
    network?: string;
    coin?: string;
    symbol?: string;
    address?: string;
    walletAddress?: string;
    label?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
}

export interface CryptoAddressPayload {
    network: string;
    coin?: string;
    symbol?: string;
    address: string;
    label?: string;
}

export interface CryptoAddressListResponse {
    success: boolean;
    results?: CryptoAddress[];
    data?: CryptoAddress[];
    message?: string;
}

const updateUserProfile = (
    data: UpdateProfilePayload
): Promise<ApiMessageResponse<User>> =>
    capMarketServer.put("/profile/update", data).then((res) => res.data);

const updateBankAndUpiDetails = (
    data: UpdateBankDetailsPayload
): Promise<ApiMessageResponse<User>> =>
    capMarketServer
        .patch("/update-bank-details", data)
        .then((res) => res.data);

const fetchCryptoAddresses = (): Promise<CryptoAddressListResponse> =>
    capMarketServer.get("/get-crypto-address").then((res) => res.data);

const createCryptoAddress = (
    data: CryptoAddressPayload
): Promise<ApiMessageResponse<CryptoAddress>> =>
    capMarketServer
        .post("/create-crypto-address", data)
        .then((res) => res.data);

const updateCryptoAddress = ({
    id,
    data,
}: {
    id: string;
    data: CryptoAddressPayload;
}): Promise<ApiMessageResponse<CryptoAddress>> =>
    capMarketServer
        .put(`/update-crypto-address/${id}`, data)
        .then((res) => res.data);

export const useCryptoAddresses = () =>
    useQuery<CryptoAddressListResponse, AxiosError>({
        queryKey: ["crypto-addresses"],
        queryFn: fetchCryptoAddresses,
        enabled: !!getToken(),
        staleTime: 3000,
        refetchOnWindowFocus: false,
    });

export const useProfileActions = () => {
    const queryClient = useQueryClient();

    const invalidateProfile = () => {
        queryClient.invalidateQueries({ queryKey: ["admin-details"] });
        queryClient.invalidateQueries({ queryKey: ["crypto-addresses"] });
    };

    const updateProfileMutation = useMutation<
        ApiMessageResponse<User>,
        AxiosError,
        UpdateProfilePayload
    >({
        mutationFn: updateUserProfile,
        onSuccess: invalidateProfile,
    });

    const updateBankDetailsMutation = useMutation<
        ApiMessageResponse<User>,
        AxiosError,
        UpdateBankDetailsPayload
    >({
        mutationFn: updateBankAndUpiDetails,
        onSuccess: invalidateProfile,
    });

    const createCryptoAddressMutation = useMutation<
        ApiMessageResponse<CryptoAddress>,
        AxiosError,
        CryptoAddressPayload
    >({
        mutationFn: createCryptoAddress,
        onSuccess: invalidateProfile,
    });

    const updateCryptoAddressMutation = useMutation<
        ApiMessageResponse<CryptoAddress>,
        AxiosError,
        { id: string; data: CryptoAddressPayload }
    >({
        mutationFn: updateCryptoAddress,
        onSuccess: invalidateProfile,
    });

    return {
        updateProfileMutation,
        updateBankDetailsMutation,
        createCryptoAddressMutation,
        updateCryptoAddressMutation,
    };
};
