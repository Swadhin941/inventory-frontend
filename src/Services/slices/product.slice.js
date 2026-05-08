import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addProductApiService,
    getAllProductsApiService,
    updateProductApiService,
} from "../API/product.api";
import toast from "react-hot-toast";

const initialState = {
    products: [],
    addProductLoading: false,
    getAllProductsLoading: false,
    error: null,
    totalProducts: 0,
    updateProductLoading: false,
};

export const addProductApi = createAsyncThunk(
    "product/addProductApi",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await addProductApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const updateProductApi = createAsyncThunk(
    "product/updateProductApi",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await updateProductApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getAllProductsApi = createAsyncThunk(
    "product/getAllProductsApi",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getAllProductsApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

const productSlice = createSlice({
    name: "product",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(addProductApi.pending, (state, action) => {
            state.addProductLoading = true;
            state.error = null;
        });
        builder.addCase(addProductApi.fulfilled, (state, action) => {
            state.addProductLoading = false;
            state.products.push(action.payload);
        });
        builder.addCase(addProductApi.rejected, (state, action) => {
            toast.error(action.payload.message);
            state.addProductLoading = false;
            state.error = action.payload;
        });

        // Get all products
        builder.addCase(getAllProductsApi.pending, (state, action) => {
            state.getAllProductsLoading = true;
            state.error = null;
        });
        builder.addCase(getAllProductsApi.fulfilled, (state, action) => {
            state.getAllProductsLoading = false;
            state.products = action.payload.body;
            state.totalProducts = action.payload.total;
        });
        builder.addCase(getAllProductsApi.rejected, (state, action) => {
            toast.error(action.payload.message);
            state.getAllProductsLoading = false;
            state.error = action.payload;
        });

        //Update product reducer
        builder.addCase(updateProductApi.pending, (state, action) => {
            state.updateProductLoading = true;
            state.error = null;
        });
        builder.addCase(updateProductApi.fulfilled, (state, action) => {
            state.updateProductLoading = false;
            const updatedProduct = action.payload.body;
            const index = state.products.findIndex(
                (product) => product._id === updatedProduct._id,
            );
            if (index !== -1) {
                state.products[index] = updatedProduct;
            }
        });
        builder.addCase(updateProductApi.rejected, (state, action) => {
            toast.error(action.payload.message);
            state.updateProductLoading = false;
            state.error = action.payload;
        });
    },
});

export default productSlice.reducer;
