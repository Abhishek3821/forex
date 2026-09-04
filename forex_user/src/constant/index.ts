import type { SymbolQuote } from "../components/TradingTerminal";
import type { ButtonItem, NavItem } from "../types/index";
export const navItems: NavItem[] = [
    {
        name: "Dashboard",
        icon: "dashboard",
        link: "/",
    },
    {
        name: "Trade",
        icon: "candlestick_chart",
        link: "/terminal/mdkkd",
    },
    {
        name: "Wallet",
        icon: "account_balance_wallet",
        link: "/wallet",
    },
    // {
    //     name: "Accounts",
    //     icon: "person_add",
    //     link: "/leaderboard",
    // },
    {
        name: "Leaderboard",
        icon: "leaderboard",
        link: "/leaderboard",
    },
    // {
    //     name: "Portfolio",
    //     icon: "work",
    //     link: "/portfolio",
    // },
    {
        name: "Saving",
        icon: "money_bag",
        link: "/saving",
    },
    {
        name: "IB",
        icon: "group_add",
        link: "/ib",
    },
    {
        name: "Bonus",
        icon: "rewarded_ads",
        link: "/bonus",
    },


    // {
    //     name: "Profile",
    //     icon: "person",
    //     link: "/profile",
    // },
];
export const rawSymbols: Omit<SymbolQuote, "spread" | "_id">[] = [
    // Forex
    { symbol: "EURUSD", name: "Euro / US Dollar", bid: 1.08421, ask: 1.08434, change: 0.12, category: "forex" },
    { symbol: "GBPUSD", name: "Pound / US Dollar", bid: 1.2644, ask: 1.26458, change: -0.08, category: "forex" },
    { symbol: "USDJPY", name: "US Dollar / Yen", bid: 155.234, ask: 155.249, change: 0.15, category: "forex" },
    { symbol: "USDCHF", name: "US Dollar / Swiss Franc", bid: 0.8921, ask: 0.89228, change: -0.04, category: "forex" },
    { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", bid: 1.3712, ask: 1.37138, change: 0.09, category: "forex" },
    { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", bid: 0.6642, ask: 0.66436, change: 0.18, category: "forex" },
    { symbol: "NZDUSD", name: "New Zealand Dollar / US Dollar", bid: 0.6114, ask: 0.61158, change: -0.11, category: "forex" },
    { symbol: "EURGBP", name: "Euro / Pound", bid: 0.8572, ask: 0.85736, change: 0.05, category: "forex" },
    { symbol: "EURJPY", name: "Euro / Yen", bid: 168.35, ask: 168.372, change: 0.21, category: "forex" },
    { symbol: "EURCHF", name: "Euro / Swiss Franc", bid: 0.9674, ask: 0.96758, change: -0.03, category: "forex" },
    { symbol: "EURCAD", name: "Euro / Canadian Dollar", bid: 1.4868, ask: 1.48702, change: 0.14, category: "forex" },
    { symbol: "EURAUD", name: "Euro / Australian Dollar", bid: 1.6324, ask: 1.63266, change: -0.07, category: "forex" },
    { symbol: "EURNZD", name: "Euro / New Zealand Dollar", bid: 1.7738, ask: 1.77408, change: 0.19, category: "forex" },
    { symbol: "GBPJPY", name: "Pound / Yen", bid: 196.28, ask: 196.314, change: -0.16, category: "forex" },
    { symbol: "GBPCHF", name: "Pound / Swiss Franc", bid: 1.1282, ask: 1.12844, change: 0.08, category: "forex" },
    { symbol: "GBPCAD", name: "Pound / Canadian Dollar", bid: 1.7334, ask: 1.73368, change: 0.13, category: "forex" },
    { symbol: "GBPAUD", name: "Pound / Australian Dollar", bid: 1.9032, ask: 1.90352, change: -0.09, category: "forex" },
    { symbol: "GBPNZD", name: "Pound / New Zealand Dollar", bid: 2.0678, ask: 2.06815, change: 0.17, category: "forex" },
    { symbol: "AUDJPY", name: "Australian Dollar / Yen", bid: 103.12, ask: 103.145, change: 0.23, category: "forex" },
    { symbol: "AUDCHF", name: "Australian Dollar / Swiss Franc", bid: 0.5928, ask: 0.59296, change: -0.05, category: "forex" },
    { symbol: "AUDCAD", name: "Australian Dollar / Canadian Dollar", bid: 0.9106, ask: 0.91082, change: 0.06, category: "forex" },
    { symbol: "AUDNZD", name: "Australian Dollar / New Zealand Dollar", bid: 1.0862, ask: 1.08646, change: -0.02, category: "forex" },
    { symbol: "NZDJPY", name: "New Zealand Dollar / Yen", bid: 94.92, ask: 94.946, change: 0.11, category: "forex" },
    { symbol: "NZDCHF", name: "New Zealand Dollar / Swiss Franc", bid: 0.5458, ask: 0.54598, change: -0.06, category: "forex" },
    { symbol: "NZDCAD", name: "New Zealand Dollar / Canadian Dollar", bid: 0.8386, ask: 0.83884, change: 0.04, category: "forex" },
    { symbol: "CADJPY", name: "Canadian Dollar / Yen", bid: 113.22, ask: 113.248, change: 0.16, category: "forex" },
    { symbol: "CADCHF", name: "Canadian Dollar / Swiss Franc", bid: 0.6506, ask: 0.65078, change: -0.01, category: "forex" },
    { symbol: "CHFJPY", name: "Swiss Franc / Yen", bid: 173.94, ask: 173.982, change: 0.2, category: "forex" },
    { symbol: "USDSEK", name: "US Dollar / Swedish Krona", bid: 10.462, ask: 10.467, change: -0.18, category: "forex" },
    { symbol: "USDNOK", name: "US Dollar / Norwegian Krone", bid: 10.518, ask: 10.524, change: 0.12, category: "forex" },
    { symbol: "USDDKK", name: "US Dollar / Danish Krone", bid: 6.887, ask: 6.891, change: 0.03, category: "forex" },
    { symbol: "USDZAR", name: "US Dollar / South African Rand", bid: 18.242, ask: 18.258, change: -0.27, category: "forex" },
    { symbol: "USDTRY", name: "US Dollar / Turkish Lira", bid: 32.84, ask: 32.872, change: 0.41, category: "forex" },
    { symbol: "USDMXN", name: "US Dollar / Mexican Peso", bid: 17.124, ask: 17.136, change: -0.22, category: "forex" },
    { symbol: "EURSEK", name: "Euro / Swedish Krona", bid: 11.342, ask: 11.349, change: 0.09, category: "forex" },
    { symbol: "EURNOK", name: "Euro / Norwegian Krone", bid: 11.408, ask: 11.416, change: -0.13, category: "forex" },
    { symbol: "EURTRY", name: "Euro / Turkish Lira", bid: 35.612, ask: 35.648, change: 0.38, category: "forex" },
    { symbol: "GBPSEK", name: "Pound / Swedish Krona", bid: 13.224, ask: 13.235, change: 0.15, category: "forex" },
    { symbol: "AUDSGD", name: "Australian Dollar / Singapore Dollar", bid: 0.8964, ask: 0.89662, change: -0.04, category: "forex" },
    { symbol: "USDSGD", name: "US Dollar / Singapore Dollar", bid: 1.3512, ask: 1.35142, change: 0.02, category: "forex" },

    // Commodities
    { symbol: "XAUUSD", name: "Gold", bid: 2362.45, ask: 2362.89, change: 0.42, category: "commodity" },
    { symbol: "XAGUSD", name: "Silver", bid: 28.14, ask: 28.19, change: 0.31, category: "commodity" },
    { symbol: "XPTUSD", name: "Platinum", bid: 984.2, ask: 985.1, change: -0.18, category: "commodity" },
    { symbol: "XPDUSD", name: "Palladium", bid: 921.4, ask: 922.6, change: 0.27, category: "commodity" },
    { symbol: "WTIUSD", name: "WTI Crude Oil", bid: 81.42, ask: 81.48, change: -0.35, category: "commodity" },
    { symbol: "BRENTUSD", name: "Brent Crude Oil", bid: 85.36, ask: 85.43, change: -0.29, category: "commodity" },
    { symbol: "NGASUSD", name: "Natural Gas", bid: 2.81, ask: 2.84, change: 0.66, category: "commodity" },
    { symbol: "COPPER", name: "Copper", bid: 4.52, ask: 4.55, change: 0.21, category: "commodity" },
    { symbol: "WHEAT", name: "Wheat", bid: 612.4, ask: 613.2, change: -0.14, category: "commodity" },
    { symbol: "CORN", name: "Corn", bid: 454.6, ask: 455.3, change: 0.09, category: "commodity" },
    { symbol: "SOYBEAN", name: "Soybean", bid: 1184.2, ask: 1185.8, change: -0.22, category: "commodity" },
    { symbol: "COFFEE", name: "Coffee", bid: 226.4, ask: 227.1, change: 0.48, category: "commodity" },
    { symbol: "COCOA", name: "Cocoa", bid: 7210.5, ask: 7222.8, change: -1.12, category: "commodity" },
    { symbol: "SUGAR", name: "Sugar", bid: 19.84, ask: 19.91, change: 0.19, category: "commodity" },
    { symbol: "COTTON", name: "Cotton", bid: 72.42, ask: 72.58, change: -0.08, category: "commodity" },
    { symbol: "OILUSD", name: "Crude Oil", bid: 82.14, ask: 82.21, change: 0.17, category: "commodity" },
    { symbol: "GASOIL", name: "Gas Oil", bid: 765.4, ask: 766.8, change: -0.11, category: "commodity" },
    { symbol: "ALUMINUM", name: "Aluminum", bid: 2492.5, ask: 2496.2, change: 0.24, category: "commodity" },
    { symbol: "ZINC", name: "Zinc", bid: 2874.2, ask: 2878.5, change: -0.16, category: "commodity" },
    { symbol: "NICKEL", name: "Nickel", bid: 17124.5, ask: 17142.7, change: 0.33, category: "commodity" },

    // Crypto
    { symbol: "BTCUSD", name: "Bitcoin", bid: 64250.2, ask: 64271.8, change: -1.21, category: "crypto" },
    { symbol: "ETHUSD", name: "Ethereum", bid: 3145.6, ask: 3147.9, change: 0.68, category: "crypto" },
    { symbol: "BNBUSD", name: "BNB", bid: 586.4, ask: 587.1, change: 0.34, category: "crypto" },
    { symbol: "SOLUSD", name: "Solana", bid: 147.24, ask: 147.48, change: -0.72, category: "crypto" },
    { symbol: "XRPUSD", name: "Ripple", bid: 0.5214, ask: 0.5221, change: 0.19, category: "crypto" },
    { symbol: "ADAUSD", name: "Cardano", bid: 0.4382, ask: 0.4389, change: -0.28, category: "crypto" },
    { symbol: "DOGEUSD", name: "Dogecoin", bid: 0.1245, ask: 0.1249, change: 0.44, category: "crypto" },
    { symbol: "DOTUSD", name: "Polkadot", bid: 6.84, ask: 6.87, change: -0.36, category: "crypto" },
    { symbol: "MATICUSD", name: "Polygon", bid: 0.724, ask: 0.727, change: 0.22, category: "crypto" },
    { symbol: "LTCUSD", name: "Litecoin", bid: 82.42, ask: 82.58, change: -0.17, category: "crypto" },
    { symbol: "BCHUSD", name: "Bitcoin Cash", bid: 412.8, ask: 413.6, change: 0.31, category: "crypto" },
    { symbol: "AVAXUSD", name: "Avalanche", bid: 31.24, ask: 31.32, change: -0.49, category: "crypto" },
    { symbol: "LINKUSD", name: "Chainlink", bid: 14.82, ask: 14.87, change: 0.26, category: "crypto" },
    { symbol: "ATOMUSD", name: "Cosmos", bid: 7.48, ask: 7.52, change: -0.21, category: "crypto" },
    { symbol: "UNIUSD", name: "Uniswap", bid: 9.34, ask: 9.38, change: 0.39, category: "crypto" },
    { symbol: "ETCUSD", name: "Ethereum Classic", bid: 24.18, ask: 24.26, change: -0.12, category: "crypto" },
    { symbol: "XLMUSD", name: "Stellar", bid: 0.1124, ask: 0.1129, change: 0.18, category: "crypto" },
    { symbol: "TRXUSD", name: "TRON", bid: 0.1182, ask: 0.1187, change: 0.09, category: "crypto" },
    { symbol: "FILUSD", name: "Filecoin", bid: 5.62, ask: 5.66, change: -0.33, category: "crypto" },
    { symbol: "APTUSD", name: "Aptos", bid: 7.92, ask: 7.97, change: 0.41, category: "crypto" },
    { symbol: "ARBUSD", name: "Arbitrum", bid: 1.126, ask: 1.132, change: -0.26, category: "crypto" },
    { symbol: "OPUSD", name: "Optimism", bid: 2.184, ask: 2.192, change: 0.23, category: "crypto" },
    { symbol: "NEARUSD", name: "Near Protocol", bid: 5.84, ask: 5.89, change: -0.31, category: "crypto" },
    { symbol: "ICPUSD", name: "Internet Computer", bid: 10.42, ask: 10.48, change: 0.37, category: "crypto" },
    { symbol: "SUIUSD", name: "Sui", bid: 1.184, ask: 1.192, change: -0.18, category: "crypto" },

    // Indices
    { symbol: "US30", name: "Dow Jones", bid: 39210.4, ask: 39212.1, change: 0.27, category: "index" },
    { symbol: "US100", name: "Nasdaq 100", bid: 19842.6, ask: 19845.2, change: -0.19, category: "index" },
    { symbol: "US500", name: "S&P 500", bid: 5482.4, ask: 5483.1, change: 0.11, category: "index" },
    { symbol: "UK100", name: "FTSE 100", bid: 8234.8, ask: 8236.2, change: -0.08, category: "index" },
    { symbol: "GER40", name: "DAX 40", bid: 18422.6, ask: 18425.4, change: 0.22, category: "index" },
    { symbol: "FRA40", name: "CAC 40", bid: 7624.2, ask: 7625.8, change: -0.14, category: "index" },
    { symbol: "ESP35", name: "IBEX 35", bid: 11124.5, ask: 11127.2, change: 0.18, category: "index" },
    { symbol: "IT40", name: "Italy 40", bid: 33842.4, ask: 33848.6, change: -0.09, category: "index" },
    { symbol: "JPN225", name: "Nikkei 225", bid: 39142.8, ask: 39148.4, change: 0.31, category: "index" },
    { symbol: "HK50", name: "Hong Kong 50", bid: 18342.6, ask: 18346.2, change: -0.44, category: "index" },
    { symbol: "AUS200", name: "Australia 200", bid: 7842.4, ask: 7844.1, change: 0.16, category: "index" },
    { symbol: "EU50", name: "Euro Stoxx 50", bid: 4984.6, ask: 4985.8, change: -0.07, category: "index" },
    { symbol: "CHINA50", name: "China A50", bid: 12482.4, ask: 12486.6, change: 0.29, category: "index" },
    { symbol: "INDIA50", name: "India 50", bid: 23542.8, ask: 23546.4, change: 0.38, category: "index" },
    { symbol: "VIX", name: "Volatility Index", bid: 13.42, ask: 13.49, change: -1.04, category: "index" },
];

export const leaderboardButtonList = [
    {
        id: "mam",
        label: "MAM",
        onClick: () => true,
        subButtons: [
            {
                id: "overview",
                label: "Overview",
                onClick: () => true,
            },
            {
                id: "profiles",
                label: "Profiles",
                onClick: () => true,
            },
            {
                id: "followers",
                label: "Followers",
                onClick: () => true,
            },
            {
                id: "leaderboard",
                label: "Leaderboard",
                onClick: () => true,
            },
        ],
    },
    {
        id: "pamm",
        label: "PAMM",
        onClick: () => true,
        subButtons: [
            {
                id: "overview",
                label: "Overview",
                onClick: () => true,
            },
            {
                id: "profiles",
                label: "Profiles",
                onClick: () => true,
            },
            {
                id: "followers",
                label: "Followers",
                onClick: () => true,
            },
            {
                id: "leaderboard",
                label: "Leaderboard",
                onClick: () => true,
            },
        ],
    },
    {
        id: "copy_trading",
        label: "Copy Trading",
        onClick: () => true,
        subButtons: [
            {
                id: "overview",
                label: "Overview",
                onClick: () => true,
            },
            {
                id: "profiles",
                label: "Profiles",
                onClick: () => true,
            },
            {
                id: "followers",
                label: "Followers",
                onClick: () => true,
            },
            {
                id: "leaderboard",
                label: "Leaderboard",
                onClick: () => true,
            },
        ],
    },
];
export const walletManagementButtonList = [
    {
        id: "deposit",
        label: "Add Funds",
        onClick: () => true,
        subButtons: [
            {
                id: "history",
                label: "History",
                onClick: () => true,
            },
            {
                id: "new",
                label: "New Deposit",
                onClick: () => true,
            },
        ],
    },
    {
        id: "withdraw",
        label: "Withdraw",
        onClick: () => true,
        subButtons: [
            {
                id: "history",
                label: "History",
                onClick: () => true,
            },
            {
                id: "new",
                label: "New Withdrawal",
                onClick: () => true,
            },
        ],
    },
    {
        id: "transfer",
        label: "Transfer",
        onClick: () => true,
        subButtons: [
            {
                id: "history",
                label: "History",
                onClick: () => true,
            },
            {
                id: "new",
                label: "New Transfer",
                onClick: () => true,
            },
        ],
    },
];
export const savingManagementList = [
    {
        id: "profile",
        label: "Profile",
        onClick: () => true,
    },
    {
        id: "invest",
        label: "Invest",
        onClick: () => true,
        subButtons: [
            {
                id: "plans",
                label: "Plans",
                onClick: () => true,
            },
            {
                id: "portfolio",
                label: "Portfolio",
                onClick: () => true,
            },
            {
                id: "transactions",
                label: "Transactions",
                onClick: () => true,
            },
        ],
    },
    {
        id: "earnings",
        label: "Earnings",
        onClick: () => true,
        subButtons: [
            {
                id: "wallet",
                label: "Wallet",
                onClick: () => true,
            },
            {
                id: "history",
                label: "History",
                onClick: () => true,
            },
            {
                id: "transactions",
                label: "Transactions",
                onClick: () => true,
            },
        ],
    },
];
export const ibManagementList = [
    {
        id: "profile",
        label: "Profile",
        onClick: () => true,
    },
    {
        id: "referrals",
        label: "Referrals",
        onClick: () => true,
    },
    {
        id: "earnings",
        label: "Earnings",
        onClick: () => true,
        subButtons: [
            {
                id: "commission",
                label: "Commission",
                onClick: () => true,
            },
            {
                id: "transactions",
                label: "Transactions",
                onClick: () => true,
            },
        ],
    },
];

export const bonusManagementList = [
    {
        id: "profile",
        label: "Profile",
        onClick: () => true,
    },
    {
        id: "bonuses",
        label: "Bonuses",
        onClick: () => true,
        subButtons: [
            {
                id: "available",
                label: "Available",
                onClick: () => true,
            },
            {
                id: "claimed",
                label: "Claimed",
                onClick: () => true,
            },
            {
                id: "history",
                label: "History",
                onClick: () => true,
            },
        ],
    },
];
export const profileButtonList: ButtonItem[] = [
    {
        id: "profile",
        label: "Profile",
    },
    {
        id: "withdraw_details",
        label: "Withdraw Details",
        subButtons: [
            {
                id: "bank",
                label: "Bank",
            },
            {
                id: "crypto",
                label: "Crypto",
            },
            {
                id: "upi",
                label: "UPI",
            },
        ],
    },
];
