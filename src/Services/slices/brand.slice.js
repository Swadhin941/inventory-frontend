import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addBrandApiService,
    deleteBrandApiService,
    getAllBrandApiService,
    updateBrandApiService,
} from "../API/brand.api";
import toast from "react-hot-toast";

const initBrandState = {
    brands: [],
    isBrandLoading: false,
    error: null,
    addBrand: null,
    addBrandLoading: false,
    totalBrandCount: 0,
};

export const addBrandApi = createAsyncThunk(
    "create/brand",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await addBrandApiService(payload);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const getAllBrandApi = createAsyncThunk(
    "fetch/brand",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getAllBrandApiService(payload);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const updateBrandApi = createAsyncThunk(
    "update/brand",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await updateBrandApiService(payload);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const deleteBrandApi = createAsyncThunk(
    "delete/brand",
    async (payload, { rejectWithValue }) => {
        try{
            const response = await deleteBrandApiService(payload);
            return response;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    })

const brandSlice = createSlice({
    name: "brand",
    initialState: initBrandState,
    extraReducers: (builder) => {
        builder

            //Get all brand reducer
            .addCase(getAllBrandApi.pending, (state, action) => {
                state.isBrandLoading = true;
                state.brands = [];
            })
            .addCase(getAllBrandApi.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isBrandLoading = false;
                    state.brands = action.payload.body;
                    state.totalBrandCount = action.payload.totalCount;
                } else {
                    toast.error(action.payload.message);
                    state.error = action.payload.message;
                    state.isBrandLoading = false;
                    state.brands = [];
                }
            })
            .addCase(getAllBrandApi.rejected, (state, action) => {
                state.error = action.payload;
                state.isBrandLoading = false;
                state.brands = [];
            })

            // Add Brand reducers
            .addCase(addBrandApi.pending, (state, action) => {
                state.addBrandLoading = true;
                state.addBrand = null;
            })
            .addCase(addBrandApi.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.addBrandLoading = false;
                    state.addBrand = action.payload.body;
                    state.totalBrandCount += 1;
                } else {
                    toast.error(action.payload.message);
                    state.error = action.payload.message;
                    state.addBrandLoading = false;
                    state.addBrand = null;
                }
            })
            .addCase(addBrandApi.rejected, (state, action) => {
                state.error = action.payload;
                state.addBrandLoading = false;
                state.addBrand = null;
            });
    },
});

export default brandSlice.reducer;
