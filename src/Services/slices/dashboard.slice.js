import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getDashboardStatisticsApi,
    getLowStockProductListApi,
    getPaymentTypeOverviewApi,
    getRecentTransactionListApi,
    getSalesOverviewApi,
    getTopProductListApi,
} from "../API/dashboard.api";
const initDashboard = {
    statistics: null,
    isStatisticsLoading: false,
    salesOverview: [],
    isSalesOverviewLoader: false,
    paymentTypeOverview: [],
    isPaymentTypeOverviewLoader: false,
    topProductList: [],
    isTopProductListLoader: false,
    totalLowStockProductCount: 0,
    lowStockProductList: [],
    isLowStockProductListLoader: false,
    recentTransactionList: [],
    recentTransactionListLoader: false,
    recentTransactionListCount: 0,
};

export const getDashboardStatisticsApiService = createAsyncThunk(
    "fetch-dashboard-statistics",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getDashboardStatisticsApi(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

// Sales over view api dispatcher

export const getSalesOverviewApiService = createAsyncThunk(
    "fetch-sales-overview",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getSalesOverviewApi(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

// Payment overview api dispatcher
export const getPaymentTypeOverviewApiService = createAsyncThunk(
    "fetch-payment-overview",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getPaymentTypeOverviewApi(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const getTopProductListApiService = createAsyncThunk(
    "fetch-top-product-list",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getTopProductListApi(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const getLowStockProductListApiService = createAsyncThunk(
    "fetch-low-stock-product-list",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getLowStockProductListApi(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const getRecentTransactionListApiService = createAsyncThunk(
    "fetch-recent-transaction-list",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getRecentTransactionListApi(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);
const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: initDashboard,
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardStatisticsApiService.pending, (state) => {
                state.isStatisticsLoading = true;
                state.statistics = null;
            })
            .addCase(
                getDashboardStatisticsApiService.fulfilled,
                (state, action) => {
                    state.statistics = action.payload.body;
                    state.isStatisticsLoading = false;
                },
            )
            .addCase(
                getDashboardStatisticsApiService.rejected,
                (state, action) => {
                    state.statistics = null;
                    state.isStatisticsLoading = false;
                },
            )

            // Sales overview reducer
            .addCase(getSalesOverviewApiService.pending, (state) => {
                state.isSalesOverviewLoader = true;
                state.salesOverview = [];
            })
            .addCase(getSalesOverviewApiService.fulfilled, (state, action) => {
                state.salesOverview = action.payload.body;
                state.isSalesOverviewLoader = false;
            })
            .addCase(getSalesOverviewApiService.rejected, (state, action) => {
                state.salesOverview = [];
                state.isSalesOverviewLoader = false;
            })

            // Payment type overview reducers
            .addCase(getPaymentTypeOverviewApiService.pending, (state) => {
                state.isPaymentTypeOverviewLoader = true;
                state.paymentTypeOverview = [];
            })
            .addCase(
                getPaymentTypeOverviewApiService.fulfilled,
                (state, action) => {
                    state.paymentTypeOverview = action.payload.body;
                    state.isPaymentTypeOverviewLoader = false;
                },
            )
            .addCase(
                getPaymentTypeOverviewApiService.rejected,
                (state, action) => {
                    state.paymentTypeOverview = [];
                    state.isPaymentTypeOverviewLoader = false;
                },
            )

            // Top product list reducers
            .addCase(getTopProductListApiService.pending, (state, action) => {
                state.isTopProductListLoader = true;
                state.topProductList = [];
            })
            .addCase(getTopProductListApiService.fulfilled, (state, action) => {
                console.log(
                    action.payload.body,
                    "from reducer top product list",
                );
                state.topProductList = action.payload.body;
                state.isTopProductListLoader = false;
            })
            .addCase(getTopProductListApiService.rejected, (state, action) => {
                state.topProductList = [];
                state.isTopProductListLoader = false;
            })

            // Low stock product reducers
            .addCase(getLowStockProductListApiService.pending, (state) => {
                state.isLowStockProductListLoader = true;
                state.lowStockProductList = [];
            })
            .addCase(
                getLowStockProductListApiService.fulfilled,
                (state, action) => {
                    state.lowStockProductList = action.payload.body;
                    state.isLowStockProductListLoader = false;
                    state.totalLowStockProductCount = action.payload.totalCount;
                },
            )
            .addCase(
                getLowStockProductListApiService.rejected,
                (state, action) => {
                    state.lowStockProductList = [];
                    state.isLowStockProductListLoader = false;
                },
            )

            // Recent transaction list
            .addCase(
                getRecentTransactionListApiService.pending,
                (state, action) => {
                    state.recentTransactionListLoader = true;
                    state.recentTransactionList = [];
                },
            )
            .addCase(
                getRecentTransactionListApiService.fulfilled,
                (state, action) => {
                    state.recentTransactionList = action.payload.body;
                    state.recentTransactionListLoader = false;
                    state.recentTransactionListCount =
                        action.payload.totalCount;
                },
            )
            .addCase(
                getRecentTransactionListApiService.rejected,
                (state, action) => {
                    state.recentTransactionList = [];
                    state.recentTransactionListLoader = false;
                },
            );
    },
});

export default dashboardSlice.reducer;
