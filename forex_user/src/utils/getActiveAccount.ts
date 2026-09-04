import Cookies from "js-cookie";
const ACTIVE_ACCOUNT_KEY = "active_account";
export const setActiveAccount = (account_id: string): void => {
    Cookies.set(ACTIVE_ACCOUNT_KEY, account_id, {
        secure: true,
        sameSite: "strict",
    });
};
export const getActiveAccount = (): string | undefined => {
    return Cookies.get(ACTIVE_ACCOUNT_KEY);
};
export const removeActiveAccount = (): void => {
    Cookies.remove(ACTIVE_ACCOUNT_KEY);
};