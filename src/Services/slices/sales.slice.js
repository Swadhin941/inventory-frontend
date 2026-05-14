import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllSalesApiService, getAllSalesStatisticsApiService } from "../API/sales.api";

const initSalesState = {
    sales: [],
    isSalesLoading: false,
    error: null,
    totalCount: 0,
    purchaseStats: null,
    purchaseStatsLoading: false,
};

export const fetchSalesApi = createAsyncThunk(
    "fetch/sales",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await getAllSalesApiService(payload);
            if (!data.success) {
                return rejectWithValue(data);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const fetchSalesStatistics = createAsyncThunk(
    "fetch/sales/statistics",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAllSalesStatisticsApiService();
            if (!data.success) {
                return rejectWithValue(data);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }   
    })

const salesSlice = createSlice({
    name: "sales",
    initialState: initSalesState,
    extraReducers: (builder) => {
        // Fetch all sales
        builder.addCase(fetchSalesApi.pending, (state, action) => {
            state.sales = [];
            state.isSalesLoading = true;
            state.error = null;
            state.totalCount = 0
        });
        builder.addCase(fetchSalesApi.fulfilled, (state, action) => {
            state.sales = action.payload.body;
            state.totalCount = action.payload.total;
            state.isSalesLoading = false;
            state.error = null;
        });
        builder.addCase(fetchSalesApi.rejected, (state, action) => {
            state.sales = [];
            state.isSalesLoading = false;
            state.error = action.payload;
        });

        // Fetch sales statistics
        builder.addCase(fetchSalesStatistics.pending, (state, action) => {
            state.purchaseStats = null;
            state.purchaseStatsLoading = true;
            state.error = null;
        });
        builder.addCase(fetchSalesStatistics.fulfilled, (state, action) => {
            state.purchaseStats = action.payload.body;
            state.purchaseStatsLoading = false;
            state.error = null;
        });
        builder.addCase(fetchSalesStatistics.rejected, (state, action) => {
            state.purchaseStats = null;
            state.purchaseStatsLoading = false;
            state.error = action.payload;
        });
    },
});

export default salesSlice.reducer;
