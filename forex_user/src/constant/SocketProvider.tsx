import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

import type { Socket } from "socket.io-client";
import { useUser } from "./UserProvider";
import { vtxSocketClient } from "./apiclient";
import { decodeMessage } from "../utils/decodeMessage";

interface FilterQuery {
    page_size: number;
    page_number: number;
}

export interface ITickPrice {
    s: string;
    dt: number;
    b: number;
    a: number;
    bs: number;
    as: number;
}

export interface LiveProfit {
    trade_id: string;
    price: number;
    pnl: number;
}

export interface EquityPayload {
    freeMargin: number;
    PNL: number;
    equity: number;
    usedMargin: number;
    marginLevel: number;
    balance: number;
}

interface WebSocketContextType {
    socket: Socket;
    isConnected: boolean;
    connectionError: string | null;

    liveProfit: Map<string, LiveProfit>;
    equity_payload: EquityPayload | null;
    tickPrice: Map<string, ITickPrice>;

    setRefetch: (fn: () => void) => void;

    connect: () => void;
    disconnect: () => void;

    subscribeToSymbol: (symbol: string) => void;

    startEquityStream: (
        accountId: string,
        filter?: FilterQuery
    ) => void;

    clearLiveProfit: () => void;
}

const WebSocketContext =
    createContext<WebSocketContextType | null>(null);

const normalizeSymbol = (symbol: string) =>
    symbol.replace(/^C:/, "").toUpperCase();

export const WebSocketProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { activeTradeAccount } = useUser();

    const activeAccountId =
        activeTradeAccount?._id ?? null;

    /**
     * --------------------------------------------------------
     * REFS
     * --------------------------------------------------------
     */

    const activeAccountRef =
        useRef<string | null>(activeAccountId);

    const profitRef =
        useRef<Map<string, LiveProfit>>(new Map());

    const refetchRef =
        useRef<(() => void) | null>(null);

    /**
     * --------------------------------------------------------
     * STATE
     * --------------------------------------------------------
     */

    const [isConnected, setIsConnected] =
        useState(vtxSocketClient.connected);

    const [
        connectionError,
        setConnectionError,
    ] = useState<string | null>(null);

    const [
        liveProfit,
        setLiveProfit,
    ] = useState<Map<string, LiveProfit>>(
        new Map()
    );

    const [
        tickPrice,
        setTickPrice,
    ] = useState<Map<string, ITickPrice>>(
        new Map()
    );

    const [
        equity_payload,
        setEquityPayload,
    ] = useState<EquityPayload | null>(null);

    /**
     * --------------------------------------------------------
     * CLEAR LIVE PROFIT
     * --------------------------------------------------------
     */

    const clearLiveProfit = useCallback(() => {
        profitRef.current = new Map();

        setLiveProfit((prev) => {
            if (prev.size === 0) {
                return prev;
            }

            return new Map();
        });
    }, []);

    /**
     * --------------------------------------------------------
     * SAVE REFETCH FUNCTION
     * --------------------------------------------------------
     */

    const setRefetch = useCallback(
        (fn: () => void) => {
            refetchRef.current = fn;
        },
        []
    );

    /**
     * --------------------------------------------------------
     * START EQUITY STREAM
     * --------------------------------------------------------
     */

    const startEquityStream = useCallback(
        (
            accountId: string,
            filter: FilterQuery = {
                page_number: 1,
                page_size: 10,
            }
        ) => {
            if (
                !vtxSocketClient.connected ||
                !accountId
            ) {
                return;
            }

            vtxSocketClient.emit(
                "subscribe",
                accountId
            );

            vtxSocketClient.emit(
                "equity:value",
                accountId,
                filter
            );
        },
        []
    );

    /**
     * --------------------------------------------------------
     * HANDLE EQUITY
     * --------------------------------------------------------
     */

    const handleEquity = useCallback(
        (rawData: unknown) => {
            const mainData = decodeMessage(
                rawData,
                "Equity"
            );

            if (!mainData) {
                return;
            }

            const data =
                mainData.data ?? mainData;

            let currentProfit =
                profitRef.current;

            const rawProfit =
                data.liveprofit ??
                data.LiveProfit;

            /**
             * ----------------------------------------
             * LIVE PROFIT
             * ----------------------------------------
             */
            if (rawProfit) {
                const decoded =
                    decodeMessage(
                        rawProfit,
                        "Live Profit"
                    );

                const items: LiveProfit[] =
                    Array.isArray(decoded)
                        ? decoded
                        : decoded
                            ? [decoded]
                            : [];

                if (items.length > 0) {
                    const updated =
                        new Map(currentProfit);

                    let hasChanged = false;

                    for (const trade of items) {
                        if (
                            trade?.trade_id == null
                        ) {
                            continue;
                        }

                        const tradeId =
                            String(
                                trade.trade_id
                            );

                        const price =
                            Number(
                                trade.price ?? 0
                            );

                        const pnl =
                            Number(
                                trade.pnl ?? 0
                            );

                        const nextTrade: LiveProfit =
                        {
                            trade_id: tradeId,

                            price:
                                Number.isFinite(
                                    price
                                )
                                    ? price
                                    : 0,

                            pnl:
                                Number.isFinite(
                                    pnl
                                )
                                    ? pnl
                                    : 0,
                        };

                        const previous =
                            updated.get(
                                tradeId
                            );

                        if (
                            !previous ||
                            previous.price !==
                            nextTrade.price ||
                            previous.pnl !==
                            nextTrade.pnl
                        ) {
                            updated.set(
                                tradeId,
                                nextTrade
                            );

                            hasChanged = true;
                        }
                    }

                    if (hasChanged) {
                        currentProfit =
                            updated;

                        profitRef.current =
                            updated;

                        setLiveProfit(
                            updated
                        );
                    }
                }
            }

            /**
             * ----------------------------------------
             * CALCULATE PROFIT
             * ----------------------------------------
             */
            const calculatedPnl =
                Array.from(
                    currentProfit.values()
                ).reduce(
                    (total, trade) =>
                        total +
                        (
                            Number.isFinite(
                                trade.pnl
                            )
                                ? trade.pnl
                                : 0
                        ),
                    0
                );

            /**
             * ----------------------------------------
             * NORMALIZE NUMBERS
             * ----------------------------------------
             */

            const toNumber = (
                value: unknown,
                fallback = 0
            ) => {
                const num =
                    Number(value);

                return Number.isFinite(num)
                    ? num
                    : fallback;
            };

            const balance =
                toNumber(
                    data.balance
                );

            const usedMargin =
                toNumber(
                    data.usedMargin ??
                    data.used_margin
                );

            const pnl =
                toNumber(
                    data.PNL ??
                    data.pnl,
                    calculatedPnl
                );

            const equity =
                toNumber(
                    data.equity,
                    balance + pnl
                );

            const freeMargin =
                toNumber(
                    data.freeMargin ??
                    data.free_margin,
                    equity - usedMargin
                );

            const calculatedMarginLevel =
                usedMargin > 0
                    ? (
                        equity /
                        usedMargin
                    ) * 100
                    : 0;

            const marginLevel =
                toNumber(
                    data.marginLevel ??
                    data.margin_level,
                    calculatedMarginLevel
                );

            const nextPayload: EquityPayload =
            {
                freeMargin,
                PNL: pnl,
                equity,
                usedMargin,
                marginLevel,
                balance,
            };

            /**
             * ----------------------------------------
             * UPDATE ONLY WHEN SOMETHING CHANGED
             * ----------------------------------------
             */
            setEquityPayload((prev) => {
                if (!prev) {
                    return nextPayload;
                }

                const unchanged =
                    prev.freeMargin ===
                    nextPayload.freeMargin &&
                    prev.PNL ===
                    nextPayload.PNL &&
                    prev.equity ===
                    nextPayload.equity &&
                    prev.usedMargin ===
                    nextPayload.usedMargin &&
                    prev.marginLevel ===
                    nextPayload.marginLevel &&
                    prev.balance ===
                    nextPayload.balance;

                return unchanged
                    ? prev
                    : nextPayload;
            });
        },
        []
    );

    /**
     * --------------------------------------------------------
     * HANDLE LIVE MARKET DATA
     * --------------------------------------------------------
     */

    const handleLiveData = useCallback(
        (rawData: unknown) => {
            const decoded =
                decodeMessage(
                    rawData,
                    "Tick"
                );

            if (!decoded) {
                return;
            }

            const items: ITickPrice[] =
                Array.isArray(decoded)
                    ? decoded
                    : [decoded];

            const first =
                items[0] as any;

            /**
             * Sometimes equity payload
             * may arrive through live-data.
             */
            if (
                first &&
                (
                    first.balance != null ||
                    first.liveprofit !=
                    null ||
                    first.LiveProfit !=
                    null ||
                    first.equity != null
                )
            ) {
                handleEquity(rawData);

                return;
            }

            setTickPrice((prev) => {
                const updated = new Map(prev);
                let hasAnyChange = false;

                for (const item of items) {
                    if (
                        !item?.s ||
                        item.b == null ||
                        item.a == null
                    ) {
                        continue;
                    }

                    const symbol = normalizeSymbol(item.s);

                    const tick: ITickPrice = {
                        ...item,
                        s: symbol,
                        b: Number(item.b),
                        a: Number(item.a),
                        bs: Number(item.bs ?? 0),
                        as: Number(item.as ?? 0),
                        dt: Number(item.dt ?? Date.now()),
                    };

                    const oldTick = prev.get(symbol);

                    const hasChanged =
                        !oldTick ||
                        oldTick.b !== tick.b ||
                        oldTick.a !== tick.a ||
                        oldTick.bs !== tick.bs ||
                        oldTick.as !== tick.as ||
                        oldTick.dt !== tick.dt;

                    if (hasChanged) {
                        updated.set(symbol, tick);
                        hasAnyChange = true;
                    }

                    window.dispatchEvent(
                        new CustomEvent("marketDataUpdate", {
                            detail: {
                                symbol,
                                bid: {
                                    price: tick.b,
                                },
                                ask: {
                                    price: tick.a,
                                },
                                bid_size: tick.bs,
                                ask_size: tick.as,
                                timestamp: tick.dt,
                            },
                        })
                    );
                }

                // No price changed → keep same React state reference
                if (!hasAnyChange) {
                    return prev;
                }

                return updated;
            });
        },
        [handleEquity]
    );

    /**
     * --------------------------------------------------------
     * SUBSCRIBE SYMBOL
     * --------------------------------------------------------
     */

    const subscribeToSymbol =
        useCallback(
            (symbol: string) => {
                if (
                    !vtxSocketClient.connected ||
                    !symbol
                ) {
                    return;
                }

                vtxSocketClient.emit(
                    "live-data",
                    normalizeSymbol(
                        symbol
                    )
                );
            },
            []
        );

    /**
     * --------------------------------------------------------
     * CONNECT
     * --------------------------------------------------------
     */

    const connect =
        useCallback(() => {
            if (
                !vtxSocketClient.connected
            ) {
                vtxSocketClient.connect();
            }
        }, []);

    /**
     * --------------------------------------------------------
     * DISCONNECT
     * --------------------------------------------------------
     */

    const disconnect =
        useCallback(() => {
            if (
                vtxSocketClient.connected
            ) {
                vtxSocketClient.disconnect();
            }
        }, []);

    /**
     * --------------------------------------------------------
     * ACCOUNT CHANGE
     * --------------------------------------------------------
     */

    useEffect(() => {
        activeAccountRef.current =
            activeAccountId;

        if (!activeAccountId) {
            clearLiveProfit();

            setEquityPayload(null);

            return;
        }

        if (
            !vtxSocketClient.connected
        ) {
            return;
        }

        clearLiveProfit();

        startEquityStream(
            activeAccountId
        );
    }, [
        activeAccountId,
        startEquityStream,
        clearLiveProfit,
    ]);

    /**
     * --------------------------------------------------------
     * SOCKET LISTENERS
     * --------------------------------------------------------
     */

    useEffect(() => {
        const onConnect = () => {
            setIsConnected(
                (prev) =>
                    prev === true
                        ? prev
                        : true
            );

            setConnectionError(
                null
            );

            const accountId =
                activeAccountRef.current;

            if (accountId) {
                startEquityStream(
                    accountId
                );
            }
        };

        const onDisconnect = () => {
            setIsConnected(
                (prev) =>
                    prev === false
                        ? prev
                        : false
            );
        };

        const onError = (
            error: Error
        ) => {
            setIsConnected(false);

            setConnectionError(
                (prev) =>
                    prev ===
                        error.message
                        ? prev
                        : error.message
            );
        };

        const onTradeResponse =
            () => {
                /**
                 * Calling stored refetch
                 * doesn't update Provider state.
                 */
                refetchRef.current?.();
            };

        /**
         * SOCKET EVENTS
         */
        vtxSocketClient.on(
            "connect",
            onConnect
        );

        vtxSocketClient.on(
            "disconnect",
            onDisconnect
        );

        vtxSocketClient.on(
            "connect_error",
            onError
        );

        vtxSocketClient.on(
            "live-data",
            handleLiveData
        );

        vtxSocketClient.on(
            "trade:response",
            onTradeResponse
        );

        vtxSocketClient.on(
            "equity:value",
            handleEquity
        );

        vtxSocketClient.on(
            "equity",
            handleEquity
        );

        vtxSocketClient.on(
            "liveprofit",
            handleEquity
        );

        /**
         * INITIAL CONNECTION
         */
        if (
            vtxSocketClient.connected
        ) {
            onConnect();
        } else {
            vtxSocketClient.connect();
        }

        /**
         * CLEANUP
         */
        return () => {
            vtxSocketClient.off(
                "connect",
                onConnect
            );

            vtxSocketClient.off(
                "disconnect",
                onDisconnect
            );

            vtxSocketClient.off(
                "connect_error",
                onError
            );

            vtxSocketClient.off(
                "live-data",
                handleLiveData
            );

            vtxSocketClient.off(
                "trade:response",
                onTradeResponse
            );

            vtxSocketClient.off(
                "equity:value",
                handleEquity
            );

            vtxSocketClient.off(
                "equity",
                handleEquity
            );

            vtxSocketClient.off(
                "liveprofit",
                handleEquity
            );

            /**
             * IMPORTANT:
             *
             * Do NOT disconnect here.
             *
             * In React StrictMode effect cleanup
             * can run during development and cause
             * disconnect -> reconnect -> state
             * updates repeatedly.
             *
             * Explicit disconnect() can still
             * be called where required.
             */
        };
    }, [
        handleEquity,
        handleLiveData,
        startEquityStream,
    ]);

    /**
     * --------------------------------------------------------
     * MEMOIZED CONTEXT VALUE
     * --------------------------------------------------------
     *
     * THIS IS IMPORTANT.
     *
     * Without useMemo:
     *
     * value={{ ... }}
     *
     * creates a brand new object every render,
     * causing every useWebSocket() consumer
     * to rerender.
     */

    const contextValue =
        useMemo<WebSocketContextType>(
            () => ({
                socket:
                    vtxSocketClient,

                isConnected,

                connectionError,

                liveProfit,

                equity_payload,

                tickPrice,

                setRefetch,

                connect,

                disconnect,

                subscribeToSymbol,

                startEquityStream,

                clearLiveProfit,
            }),
            [
                isConnected,
                connectionError,
                liveProfit,
                equity_payload,
                tickPrice,
                setRefetch,
                connect,
                disconnect,
                subscribeToSymbol,
                startEquityStream,
                clearLiveProfit,
            ]
        );

    return (
        <WebSocketContext.Provider
            value={contextValue}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

/**
 * --------------------------------------------------------
 * USE WEBSOCKET HOOK
 * --------------------------------------------------------
 */

export const useWebSocket = () => {
    const context =
        useContext(
            WebSocketContext
        );

    if (!context) {
        throw new Error(
            "useWebSocket must be used inside WebSocketProvider"
        );
    }

    return context;
};