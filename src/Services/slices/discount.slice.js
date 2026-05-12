import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addDiscountApiService,
    getAllDiscountApiService,
    updateDiscountApiService,
} from "../API/discount.api";

export const discountState = {
    discounts: [],
    getAllDiscountLoading: false,
    addDiscountLoading: false,
    error: null,
};

export const getAllDiscountApi = createAsyncThunk(
    "fetch/discount",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getAllDiscountApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const addDiscountApi = createAsyncThunk(
    "create/discount",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await addDiscountApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const updateDiscountApi = createAsyncThunk(
    "update/discount",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await updateDiscountApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const discountSlice = createSlice({
    name: "discount",
    initialState: discountState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllDiscountApi.pending, (state) => {
                state.getAllDiscountLoading = true;
            })
            .addCase(getAllDiscountApi.fulfilled, (state, action) => {
                state.getAllDiscountLoading = false;
                state.discounts = action.payload.body;
            })
            .addCase(getAllDiscountApi.rejected, (state, action) => {
                state.getAllDiscountLoading = false;
                state.error = action.payload || "Failed to fetch discounts";
            })
            // Add discount reducers
            .addCase(addDiscountApi.pending, (state) => {
                state.addDiscountLoading = true;
            })
            .addCase(addDiscountApi.fulfilled, (state, action) => {
                state.addDiscountLoading = false;
                state.discounts.push(action.payload.body);
            })
            .addCase(addDiscountApi.rejected, (state, action) => {
                state.addDiscountLoading = false;
                state.error = action.payload || "Failed to add discount";
            })
            // Update discount reducers
            .addCase(updateDiscountApi.pending, (state) => {
                state.addDiscountLoading = true;
            })
            .addCase(updateDiscountApi.fulfilled, (state, action) => {
                state.addDiscountLoading = false;
                const index = state.discounts.findIndex(
                    (item) => item._id === action.payload.body._id,
                );
                if (index !== -1) {
                    state.discounts[index] = action.payload.body;
                }
            })
            .addCase(updateDiscountApi.rejected, (state, action) => {
                state.addDiscountLoading = false;
                state.error = action.payload || "Failed to update discount";
            });
    },
});

export default discountSlice.reducer;
