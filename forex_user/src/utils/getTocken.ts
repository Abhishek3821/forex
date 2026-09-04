import Cookies from "js-cookie";
const TOKEN_KEY = "accessToken";
const DEVICE_KEY = "device_id";
export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, {
    secure: true,
    sameSite: "strict",
  });
};
export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};
export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};
export const getOrSetDeviceId = (): string => {
  let tabId = sessionStorage.getItem(DEVICE_KEY);
  if (!tabId) {
    tabId = crypto.randomUUID();
    sessionStorage.setItem(DEVICE_KEY, tabId);
  }
  return tabId;
};