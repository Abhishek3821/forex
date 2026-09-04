import { useMutation } from "@tanstack/react-query";
import { capMarketServer } from "../constant/apiclient";
import type { LoginData, LoginResponse, OtpData, RequestOtpData, SingUpData } from "../interface/interface";
import type { AxiosError } from "axios";
const loginApi = (data: LoginData): Promise<any> =>
  capMarketServer
    .post<LoginResponse>("/auth/login", data)
    .then((res) => res.data);
export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginData>({
    mutationFn: loginApi,
    mutationKey: ["login"],
  });
};
const singUpApi = (data: SingUpData): Promise<any> =>
  capMarketServer
    .post<LoginResponse>("/auth/register", data)
    .then((res) => res.data);
export const useSingUp = () => {
  return useMutation<LoginResponse, Error, SingUpData>({
    mutationFn: singUpApi,
    mutationKey: ["signup"],
  });
};
const resendEmailApi = (data: { user_id: string }): Promise<any> =>
  capMarketServer
    .post<LoginResponse>("/auth/resend-email", data)
    .then((res) => res.data);
export const useResendEmail = () => {
  return useMutation<LoginResponse, Error, { user_id: string }>({
    mutationFn: resendEmailApi,
    mutationKey: ["resend_email"],
  });
};
const verifyEmailApi = (token: string): Promise<any> =>
  capMarketServer
    .get<LoginResponse>("/auth/verify-email", {
      params: {
        token
      }
    })
    .then((res) => res.data);
export const useVerifyEmail = () => {
  return useMutation<LoginResponse, Error, string>({
    mutationFn: verifyEmailApi,
    mutationKey: ["verify_email"],
  });
};
const verifyApi = (data: OtpData): Promise<any> =>
  capMarketServer
    .post<LoginResponse>("/verify-otp", data)
    .then((res) => res.data);
export const useVerifyOtp = () => {
  return useMutation<LoginResponse, Error, OtpData>({
    mutationFn: verifyApi,
    mutationKey: ["verify-otp"],
  });
};
const requestOtpApi = (data: RequestOtpData): Promise<any> =>
  capMarketServer
    .post<LoginResponse>("/request-otp", data)
    .then((res) => res.data);
export const useRequestOtp = () => {
  return useMutation<LoginResponse, Error, RequestOtpData>({
    mutationFn: requestOtpApi,
    mutationKey: ["request-otp"],
  });
};
export interface SetupMfaResponse {
  success: boolean;
  message: string;
  data: {
    uniqueId: string;
    secretCode: string;
  };
};
export const setupMfa = async (): Promise<SetupMfaResponse> => {
  const { data } = await capMarketServer.post("/setup-mfa");
  return data;
};
export const useSetupMfa = () => {
  return useMutation<SetupMfaResponse, AxiosError>({
    mutationFn: setupMfa,
  });
};