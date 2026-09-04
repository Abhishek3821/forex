import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { capMarketServer } from "./apiclient";

import type {
  ITradeAccount,
  LoginResponse,
  PermissionList,
  User,
} from "../interface/interface";

import { useUserDetails } from "../hooks/useUserDetails";
import { useUserTradeAccount } from "../hooks/useUsers";

import { removeToken } from "../utils/getTocken";
import {
  getActiveAccount,
  setActiveAccount,
} from "../utils/getActiveAccount";

interface UserContextType {
  user: User | null;

  isLoading: boolean;
  isAuthenticated: boolean;

  login: (data: LoginResponse) => boolean;
  logout: () => Promise<void>;
  refetch: () => void;

  slugPermissionMap: Map<string, PermissionList>;
  pathPermissionMap: Map<string, PermissionList>;

  actionPermissionCheck: (actionKey: string) => boolean;

  tradeAccountList: ITradeAccount[];
  activeTradeAccount: ITradeAccount | null;

  setActiveTradeAccount: (accountId: string) => void;

  refetchTradeAccounts: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tradeAccountMap, setTradeAccountMap] = useState<
    Map<string, ITradeAccount>
  >(() => new Map());
  const [activeTradeAccountId, setActiveTradeAccountId] = useState<
    string | undefined
  >(() => getActiveAccount());
  const [slugPermissionMap, setSlugPermissionMap] = useState<
    Map<string, PermissionList>
  >(() => new Map());
  const [pathPermissionMap, setPathPermissionMap] = useState<
    Map<string, PermissionList>
  >(() => new Map());
  const {
    data,
    refetch,
    isLoading: isUserLoading,
  } = useUserDetails();
  const tradeAccountListQuery = useUserTradeAccount({
    pageSize: 100,
  });
  useEffect(() => {
    if (!data) return;
    if (data.profile) {
      setUser(data.profile);
    }
    const slugMap = new Map<string, PermissionList>();
    const pathMap = new Map<string, PermissionList>();
    data?.data?.permission?.forEach((permission: PermissionList) => {
      if (permission.slug) {
        slugMap.set(permission.slug, permission);
      }

      if (permission.path && permission.path !== "#") {
        pathMap.set(permission.path, permission);
      }
    });

    setSlugPermissionMap(slugMap);
    setPathPermissionMap(pathMap);
  }, [data]);
  useEffect(() => {
    const accounts = tradeAccountListQuery.data?.accounts;
    if (!accounts?.length) {
      setTradeAccountMap(new Map());
      setActiveTradeAccountId(undefined);
      return;
    }
    const accountMap = new Map<string, ITradeAccount>();
    accounts.forEach((account) => {
      accountMap.set(account._id, account);
    });
    setTradeAccountMap(accountMap);
    const existingAccountId = getActiveAccount();
    if (existingAccountId && accountMap.has(existingAccountId)) {
      setActiveTradeAccountId(existingAccountId);
      return;
    }
    const firstAccount = accounts[0];
    if (firstAccount) {
      setActiveAccount(firstAccount._id);
      setActiveTradeAccountId(firstAccount._id);
    }
  }, [tradeAccountListQuery.data]);
  const tradeAccountList = useMemo(
    () => [...tradeAccountMap.values()],
    [tradeAccountMap]
  );
  const activeTradeAccount = useMemo(() => {
    if (!activeTradeAccountId) return null;

    return tradeAccountMap.get(activeTradeAccountId) ?? null;
  }, [activeTradeAccountId, tradeAccountMap]);
  const handleSetActiveTradeAccount = useCallback(
    (accountId: string) => {
      if (!tradeAccountMap.has(accountId)) {
        console.warn(`Trade account not found: ${accountId}`);
        return;
      }

      setActiveAccount(accountId);
      setActiveTradeAccountId(accountId);
    },
    [tradeAccountMap]
  );
  const login = useCallback((response: LoginResponse): boolean => {
    const token = response?.token;

    if (!token) {
      return false;
    }

    setUser(response.user);

    localStorage.setItem("accessToken", token);

    capMarketServer.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    return true;
  }, []);
  const actionPermissionCheck = useCallback(
    (actionKey: string): boolean => {
      const permission = pathPermissionMap.get(location.pathname);

      if (!permission?.actions?.length) {
        return false;
      }

      return permission.actions.includes(actionKey);
    },
    [location.pathname, pathPermissionMap]
  );
  const logout = useCallback(async (): Promise<void> => {
    try {
      await capMarketServer.post("/admin-auth/logOut/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      removeToken();

      delete capMarketServer.defaults.headers.common[
        "Authorization"
      ];
      setUser(null);
      window.location.reload();
    }
  }, []);
  const isLoading =
    isUserLoading || tradeAccountListQuery.isLoading;
  const contextValue = useMemo<UserContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refetch,
      slugPermissionMap,
      pathPermissionMap,
      actionPermissionCheck,
      tradeAccountList,
      activeTradeAccount,
      setActiveTradeAccount: handleSetActiveTradeAccount,
      refetchTradeAccounts: tradeAccountListQuery.refetch,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      refetch,
      slugPermissionMap,
      pathPermissionMap,
      actionPermissionCheck,
      tradeAccountList,
      activeTradeAccount,
      handleSetActiveTradeAccount,
      tradeAccountListQuery.refetch,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be used within a UserProvider"
    );
  }

  return context;
};