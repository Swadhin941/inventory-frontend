import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addModelApiService, getAllModelApiService } from "../API/model.api";
import toast from "react-hot-toast";
import { getAllBrandApiService } from "../API/brand.api";

const modelInit = {
    models: [],
    isModelLoading: false,
    brands: [],
    isBrandLoading : false,
    error: null,
};

export const getAllModelApi = createAsyncThunk(
    "fetch/model",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getAllModelApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const addModelApi = createAsyncThunk(
    "create/model",
    (payload, { rejectWithValue }) => {
        try {
            const response = addModelApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const getAllBrand = createAsyncThunk(
    "fetch/all-brand",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getAllBrandApiService(payload);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const modelSlice = createSlice({
    name: "model",
    initialState: modelInit,
    extraReducers: (builder) => {
        builder
            // Get all model reducers
            .addCase(getAllModelApi.pending, (state, action) => {
                state.isModelLoading = true;
                state.models = [];
            })
            .addCase(getAllModelApi.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isModelLoading = false;
                    state.models = action.payload.body;
                }
            })
            .addCase(getAllModelApi.rejected, (state, action) => {
                toast.error(action.payload.message);
                state.error = action.payload;
                state.isModelLoading = false;
                state.models = [];
            })

            // Add model reducers

            .addCase(addModelApi.pending, (state, action) => {
                state.addModelLoading = true;
                state.addModel = null;
            })
            .addCase(addModelApi.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.addModelLoading = false;
                    state.addModel = action.payload.body;
                }
            })
            .addCase(addModelApi.rejected, (state, action) => {
                toast.error(action.payload.message);
                state.error = action.payload;
                state.addModelLoading = false;
                state.addModel = null;
            })

            // All Brands
            .addCase(getAllBrand.pending, (state, action) => {
                state.isBrandLoading = true;
                state.brands = [];
            })
            .addCase(getAllBrand.fulfilled, (state, action)=>{
                if (action.payload.success) {
                    state.isBrandLoading = false;
                    state.brands = action.payload.body;
                }   
            })
            .addCase(getAllBrand.rejected, (state, action) => {
                toast.error(action.payload.message);
                state.error = action.payload;
                state.isBrandLoading = false;
                state.brands = [];
            });
    },
});

export default modelSlice.reducer;
