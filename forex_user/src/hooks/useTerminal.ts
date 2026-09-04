import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { useUser } from "../constant/UserProvider";
import { useWebSocket } from "../constant/SocketProvider";

import {
    useCreateTrade,
    useCloseTrade,
    useBulkCloseTrade,
    useUpdateTrade,
    useTradeList,
    type CreateTradePayload,
} from "./useTrade";
import { useSymbolDetailList } from "./useSymbolDetail";
import useModal from "./useModal";
import { useResizableTerminal } from "./useResize";
import type { BulkCloseFilters, Leverage, MobilePanel, OrderType, Side, SymbolQuote } from "../components/TradingTerminal";
import type { OrderListInterface, SymbolDetail, TradeListResponse } from "../interface/interface";
import type { PlaceOrderPayload } from "../screens/OrderExecution";
import { createMutationHandlers } from "../utils/hanldleQueryResponse";
import { usePagination } from "./usePagination";
export function toSymbolQuote(symbol: SymbolDetail | undefined, tickPrice: Map<string, { b: number; a: number }>): SymbolQuote {
    const tick = symbol?.symbol_name ? tickPrice.get(symbol.symbol_name) : undefined;
    const bid = Number(tick?.b ?? 0);
    const ask = Number(tick?.a ?? bid);
    return {
        symbol: symbol?.symbol_name ?? "",
        name: symbol?.symbol_name ?? "Symbol",
        bid,
        ask,
        _id: symbol?._id || '',
        change: 0,
        category: symbol?.market ?? "forex",
        spread: Number((ask - bid).toFixed((symbol?.market) === "forex" ? 5 : 2)),
    };
}

const emptyTradeListResponse: TradeListResponse = {
    success: true,
    results: [],
    pagination: {
        total: 0,
        pageNumber: 1,
        totalPages: 1,
        pageSize: 10,
        next: false,
        previous: false,
    },
};

function mergeTradePages(
    current: OrderListInterface[],
    next: OrderListInterface[]
) {
    const merged = new Map<string, OrderListInterface>();

    current.forEach((trade) => {
        merged.set(trade._id, trade);
    });

    next.forEach((trade) => {
        merged.set(trade._id, trade);
    });

    return Array.from(merged.values());
}

export const useTradingTerminal = () => {
    const { activeTradeAccount } = useUser();
    const positionPagination = usePagination();
    const historyPagination = usePagination();
    const {
        equity_payload,
        tickPrice,
        subscribeToSymbol,
        liveProfit,
        startEquityStream
    } = useWebSocket();

    const symbolDetailsQuery = useSymbolDetailList({
        pageSize: 100,
    });

    const createTradeMutation = useCreateTrade();
    const closeTradeMutation = useCloseTrade();
    const bulkCloseTradeMutation = useBulkCloseTrade();
    const updateTradeMutation = useUpdateTrade();

    const {
        openModal,
        closeModal,
        isModalOpen,
    } = useModal();

    const {
        leftWidth,
        rightWidth,
        bottomHeight,
        startResize,
    } = useResizableTerminal();

    const [selectedCode, setSelectedCode] = useState<any>(null);

    const [favorites, setFavorites] = useState<Set<string>>(
        () => new Set(["EURUSD", "XAUUSD"])
    );

    const [orderType, setOrderType] =
        useState<OrderType>("market");

    const [side, setSide] =
        useState<Side>("buy");

    const [lot, setLot] =
        useState("0.01");

    const [leverage, setLeverage] =
        useState<Leverage>("1:1000");

    const [oneClickTrading, setOneClickTrading] =
        useState(false);

    const [activeTab, setActiveTab] =
        useState("positions");

    const [mobilePanel, setMobilePanel] =
        useState<MobilePanel>(null);

    const [chartInterval, setChartInterval] =
        useState("1");

    const [isChartFullscreen, setIsChartFullscreen] =
        useState(false);

    const [
        drawingToolsToggleKey,
        setDrawingToolsToggleKey,
    ] = useState(0);

    const tradeListEnabled =
        Boolean(activeTradeAccount?._id);

    const openTradesQuery = useTradeList(
        {
            status: "open",
            accountId: activeTradeAccount?._id ?? "",
            pageSize: positionPagination.pageSizeValue,
            pageNumber: positionPagination.pageNumber
        },
        tradeListEnabled
    );

    const closedTradesQuery = useTradeList(
        {
            status: "closed",
            accountId: activeTradeAccount?._id ?? "",
            pageSize: historyPagination.pageSizeValue,
            pageNumber: historyPagination.pageNumber
        },
        tradeListEnabled
    );

    const [openTrades, setOpenTrades] = useState<OrderListInterface[]>([]);
    const [closedTrades, setClosedTrades] = useState<OrderListInterface[]>([]);

    useEffect(() => {
        positionPagination.resetPagination();
        historyPagination.resetPagination();
        setOpenTrades([]);
        setClosedTrades([]);
    }, [
        activeTradeAccount?._id,
        positionPagination.resetPagination,
        historyPagination.resetPagination,
    ]);

    useEffect(() => {
        const data = openTradesQuery.data;

        if (!data) return;

        setOpenTrades((current) =>
            data.pagination.pageNumber === 1
                ? data.results
                : mergeTradePages(current, data.results)
        );
        activeTradeAccount && data.pagination.total < 2 && startEquityStream(activeTradeAccount?._id)
    }, [openTradesQuery.data]);

    useEffect(() => {
        const data = closedTradesQuery.data;

        if (!data) return;

        setClosedTrades((current) =>
            data.pagination.pageNumber === 1
                ? data.results
                : mergeTradePages(current, data.results)
        );
    }, [closedTradesQuery.data]);

    const openTradesData = useMemo<TradeListResponse>(() => ({
        ...(openTradesQuery.data ?? emptyTradeListResponse),
        results: openTrades,
    }), [openTrades, openTradesQuery.data]);

    const closedTradesData = useMemo<TradeListResponse>(() => ({
        ...(closedTradesQuery.data ?? emptyTradeListResponse),
        results: closedTrades,
    }), [closedTrades, closedTradesQuery.data]);

    const symbol_list =
        symbolDetailsQuery.data?.results ?? [];

    useEffect(() => {
        openModal({
            market_watch: true,
            order_execution: true,
        });
    }, [openModal]);

    useEffect(() => {
        if (
            !selectedCode &&
            symbolDetailsQuery.data?.results?.length
        ) {
            setSelectedCode(
                symbolDetailsQuery.data.results[0]
            );
        }
    }, [
        selectedCode,
        symbolDetailsQuery.data?.results,
    ]);

    const accountSnapshot = useMemo(
        () => ({
            balance: Number(
                activeTradeAccount?.balance ?? 0
            ),

            equity: Number(
                equity_payload?.equity ??
                activeTradeAccount?.balance ??
                0
            ),

            freeMargin: Number(
                equity_payload?.freeMargin ??
                activeTradeAccount?.balance ??
                0
            ),

            marginLevel: Number(
                equity_payload?.marginLevel ?? 99999
            ),

            PNL: Number(
                equity_payload?.PNL ?? 0
            ),

            usedMargin: Number(
                equity_payload?.usedMargin ?? 0
            ),
        }),
        [
            activeTradeAccount?.balance,
            equity_payload,
        ]
    );

    const selectedSymbol = useMemo(
        () =>
            symbol_list.find(
                (quote) =>
                    quote._id === selectedCode?._id
            ) ?? symbol_list[0],
        [
            symbol_list,
            selectedCode?._id,
        ]
    );

    const selectedQuote = useMemo(
        () =>
            toSymbolQuote(
                selectedSymbol,
                tickPrice
            ),
        [
            selectedSymbol,
            tickPrice,
        ]
    );

    const chartSymbol = useMemo(
        () =>
            selectedSymbol
                ? `${selectedSymbol.market}:${selectedSymbol.symbol_name}`
                : null,
        [
            selectedSymbol?.market,
            selectedSymbol?.symbol_name,
        ]
    );

    const tickerQuotes = useMemo(
        () =>
            symbol_list.map((symbol) =>
                toSymbolQuote(
                    symbol,
                    tickPrice
                )
            ),
        [
            symbol_list,
            tickPrice,
        ]
    );

    useEffect(() => {
        if (!selectedSymbol?.symbol_name) {
            return;
        }

        subscribeToSymbol(
            selectedSymbol.symbol_name
        );
    }, [
        selectedSymbol?.symbol_name,
        subscribeToSymbol,
    ]);

    const toggleFavorite = useCallback(
        (symbol: string) => {
            setFavorites((prev) => {
                const next = new Set(prev);

                if (next.has(symbol)) {
                    next.delete(symbol);
                } else {
                    next.add(symbol);
                }

                return next;
            });
        },
        []
    );

    const handlePlaceOrder = useCallback(
        (order: PlaceOrderPayload) => {
            if (!activeTradeAccount?._id) {
                toast.error(
                    "Please select a trading account before placing an order."
                );
                return;
            }

            const payload: CreateTradePayload = {
                tradeAccountId:
                    activeTradeAccount._id,

                symbol:
                    order.symbol,

                lot:
                    order.lot,

                bs:
                    order.side === "buy"
                        ? "Buy"
                        : "Sell",

                executionType:
                    order.orderType === "market"
                        ? "market"
                        : "limit",

                avg:
                    order.orderType === "market"
                        ? undefined
                        : order.price,

                target:
                    order.takeProfit,

                sl:
                    order.stopLoss,
            };

            createTradeMutation.mutate(
                payload,
                createMutationHandlers(() => {
                    positionPagination.resetPagination();
                    setOpenTrades([]);
                    setActiveTab("positions");
                    setMobilePanel(null);
                })
            );
        },
        [
            activeTradeAccount?._id,
            createTradeMutation,
            positionPagination.resetPagination,
        ]
    );

    const handleQuickOrder = useCallback(
        (quickSide: Side, quickQuote: SymbolQuote = selectedQuote) => {
            if (!quickQuote) return;

            handlePlaceOrder({
                symbol: quickQuote._id,
                orderType: "market",
                side: quickSide,
                lot: Number(lot) || 0.01,
                leverage,
                price:
                    quickSide === "buy"
                        ? quickQuote.ask
                        : quickQuote.bid,
            });
        },
        [
            handlePlaceOrder,
            leverage,
            lot,
            selectedQuote,
        ]
    );

    const toggleDrawingTools =
        useCallback(() => {
            setDrawingToolsToggleKey(
                Date.now()
            );
        }, []);

    const handleClosePosition =
        useCallback(
            (
                trade: OrderListInterface,
                closingLot = trade.lot
            ) => {
                closeTradeMutation.mutate({
                    tradeId: trade._id,
                    closing_lot: closingLot,
                }, createMutationHandlers(openTradesQuery.refetch));
            },
            [closeTradeMutation]
        );

    const handleBulkClose =
        useCallback(
            (
                filters: BulkCloseFilters = {}
            ) => {
                if (!activeTradeAccount?._id) {
                    toast.error(
                        "Please select a trading account before closing positions."
                    );
                    return;
                }

                bulkCloseTradeMutation.mutate({
                    trade_user_id:
                        activeTradeAccount._id,
                    ...filters,
                }, createMutationHandlers(openTradesQuery.refetch));
            },
            [
                activeTradeAccount?._id,
                bulkCloseTradeMutation,
            ]
        );

    const handleUpdateProtection =
        useCallback(
            (
                trade: OrderListInterface,
                values: {
                    sl?: number;
                    target?: number;
                }
            ) => {
                updateTradeMutation.mutate({
                    _id: trade._id,
                    ...values,
                }, createMutationHandlers(openTradesQuery.refetch));
            },
            [updateTradeMutation]
        );

    const showMarketWatch =
        Boolean(isModalOpen?.market_watch);

    const showOrderExecution =
        Boolean(isModalOpen?.order_execution);

    return {
        activeTradeAccount,
        equity_payload,
        tickPrice,
        liveProfit,

        symbolDetailsQuery,
        openTradesQuery,
        closedTradesQuery,
        openTradesData,
        closedTradesData,
        isModalOpen,
        createTradeMutation,
        closeTradeMutation,
        bulkCloseTradeMutation,
        updateTradeMutation,
        historyPagination,
        positionPagination,
        symbol_list,
        selectedCode,
        setSelectedCode,
        selectedSymbol,
        selectedQuote,
        chartSymbol,
        tickerQuotes,

        favorites,
        toggleFavorite,

        orderType,
        setOrderType,
        side,
        setSide,
        lot,
        setLot,
        leverage,
        setLeverage,
        oneClickTrading,
        setOneClickTrading,

        activeTab,
        setActiveTab,

        mobilePanel,
        setMobilePanel,

        chartInterval,
        setChartInterval,

        isChartFullscreen,
        setIsChartFullscreen,

        drawingToolsToggleKey,
        toggleDrawingTools,

        accountSnapshot,

        leftWidth,
        rightWidth,
        bottomHeight,
        startResize,

        openModal,
        closeModal,
        showMarketWatch,
        showOrderExecution,

        handlePlaceOrder,
        handleQuickOrder,
        handleClosePosition,
        handleBulkClose,
        handleUpdateProtection,

        isCreatingTrade:
            createTradeMutation.isPending,

        isClosingTrade:
            closeTradeMutation.isPending,

        isBulkClosing:
            bulkCloseTradeMutation.isPending,

        isUpdatingTrade:
            updateTradeMutation.isPending,

        isSymbolLoading:
            symbolDetailsQuery.isLoading,

        isOpenTradesLoading:
            openTradesQuery.isLoading,

        isClosedTradesLoading:
            closedTradesQuery.isLoading,
    };
};
