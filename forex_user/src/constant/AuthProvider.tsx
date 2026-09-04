import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/getTocken";

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const isAuthenticated = Boolean(getToken());

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};