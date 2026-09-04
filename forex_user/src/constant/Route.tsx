import { lazy, Suspense, type ComponentType, type ReactElement } from "react";
import { createBrowserRouter } from 'react-router-dom'
import LoadingScreen from "../components/Loading";
import App from "../App";
import { AuthProvider } from "./AuthProvider";
const Login = lazy(() => import("../components/Login"));
const SingUp = lazy(() => import("../components/SingUp"));
const VerifyOtp = lazy(() => import("../components/VerifyOtp"));
const DashBoard = lazy(() => import("../components/Dashboard"));
const TradingTerminal = lazy(() => import("../components/TradingTerminal"));
const Leaderboard = lazy(() => import("../components/Leaderboard"));
const WalletManagment = lazy(() => import("../components/Wallet"));
const Profile = lazy(() => import("../components/Profile"));
const Setting = lazy(() => import("../components/Setting"));
const Portfolio = lazy(() => import("../components/Portfolio"));
const Saving = lazy(() => import("../components/Saving"));
const Bonus = lazy(() => import("../components/Bonus"));
const IB = lazy(() => import("../components/IB"));
export default function withSuspense<P extends object = object>(
    Component: ComponentType<P>,
    props?: P
): ReactElement {
    return (
        <Suspense fallback={<LoadingScreen fixed={true} />}>
            <Component {...(props ?? ({} as P))} />
        </Suspense>
    );
}
export const router = createBrowserRouter([
    {
        path: "/login",
        element: withSuspense(Login)
    },
    {
        path: "/signup",
        element: withSuspense(SingUp)
    },
    {
        path: "/verify-otp",
        element: withSuspense(VerifyOtp)
    },
    {
        path: "/terminal/:user_id",
        element: <AuthProvider>
            {withSuspense(TradingTerminal)}
        </AuthProvider>
    },
    {
        path: "/",
        element: <AuthProvider>
            <App />
        </AuthProvider>,
        children: [
            {
                path: "/",
                element: withSuspense(DashBoard),
            }
            , {
                path: "/wallet",
                element: withSuspense(WalletManagment),
            },
            {
                path: "/profile",
                element: withSuspense(Profile),
            }
            , {
                path: "/leaderboard",
                element: withSuspense(Leaderboard),
            },
            {
                path: "/setting",
                element: withSuspense(Setting),
            },
            {
                path: "/portfolio",
                element: withSuspense(Portfolio),
            },
            {
                path: "/ib",
                element: withSuspense(IB),
            }
            ,
            {
                path: "/bonus",
                element: withSuspense(Bonus),
            }
            , {
                path: "/saving",
                element: withSuspense(Saving),
            }
        ]
    },
])