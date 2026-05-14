import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addProductApiService,
    addPurchaseProductApiService,
    getAllProductsApiService,
    getProductStatisticsApiService,
    updateProductApiService,
    validateCouponApiService,
} from "../API/product.api";
import toast from "react-hot-toast";

const initialState = {
    products: [],
    addProductLoading: false,
    getAllProductsLoading: false,
    error: null,
    totalProducts: 0,
    updateProductLoading: false,
    statistics: null,
    statsLoader: false,
    loadMoreProductLoading: false,
    discountInfo: null,
    couponValidatorLoading: false,
    couponValid: false,
    purchaseProduct: null,
    purchaseProductLoading: false,
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

export const getProductStatisticsApi = createAsyncThunk(
    "product/getProductStatisticsApi",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getProductStatisticsApiService();
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const loadMoreProductsApi = createAsyncThunk(
    "product/loadMoreProductsApi",
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

export const validateCouponApi = createAsyncThunk(
    "product/validateCouponApi",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await validateCouponApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

// Add purchase product API
export const addPurchaseProductApi = createAsyncThunk(
    "product/addPurchaseProductApi",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await addPurchaseProductApiService(payload);
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
    reducers: {
        clearCouponState: (state) => {
            state.discountInfo = null;
            state.couponValidatorLoading = false;
            state.couponValid = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addProductApi.pending, (state, action) => {
            state.addProductLoading = true;
            state.error = null;
        });
        builder.addCase(addProductApi.fulfilled, (state, action) => {
            toast.success(action.payload.message);
            state.addProductLoading = false;
            state.products.push(action.payload.body);
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
            console.log("Updated Product:", updatedProduct);
            const index = state.products.findIndex(
                (product) => product._id === updatedProduct._id,
            );
            if (index !== -1) {
                state.products[index] = updatedProduct;
            }
            console.log("Updated Products List:", state.products);
        });
        builder.addCase(updateProductApi.rejected, (state, action) => {
            toast.error(action.payload.message);
            state.updateProductLoading = false;
            state.error = action.payload;
        });

        // Get product statistics
        builder.addCase(getProductStatisticsApi.pending, (state, action) => {
            state.getProductStatisticsLoading = true;
            state.error = null;
            state.statsLoader = true;
        });
        builder.addCase(getProductStatisticsApi.fulfilled, (state, action) => {
            state.getProductStatisticsLoading = false;
            state.statistics = action.payload.body;
            state.statsLoader = false;
        });
        builder.addCase(getProductStatisticsApi.rejected, (state, action) => {
            toast.error(action.payload.message);
            state.getProductStatisticsLoading = false;
            state.error = action.payload;
            state.statsLoader = false;
        });

        // Load more products
        builder.addCase(loadMoreProductsApi.pending, (state, action) => {
            state.loadMoreProductLoading = true;
            state.error = null;
        });
        builder.addCase(loadMoreProductsApi.fulfilled, (state, action) => {
            state.loadMoreProductLoading = false;
            state.products = [...state.products, ...action.payload.body];
        });
        builder.addCase(loadMoreProductsApi.rejected, (state, action) => {
            toast.error(action.payload.message);
            state.loadMoreProductLoading = false;
            state.error = action.payload;
        });

        // Check coupon validity
        builder.addCase(validateCouponApi.pending, (state, action) => {
            state.couponValidatorLoading = true;
            state.couponValid = false;
            state.discountInfo = null;
            state.error = null;
        });
        builder.addCase(validateCouponApi.fulfilled, (state, action) => {
            state.couponValidatorLoading = false;
            state.couponValid = true;
            state.discountInfo = action.payload.body;
            if (action.payload.message) {
                toast.success(action.payload.message);
            }
        });
        builder.addCase(validateCouponApi.rejected, (state, action) => {
            toast.error(action.payload?.message || "Unable to apply coupon");
            state.couponValidatorLoading = false;
            state.couponValid = false;
            state.discountInfo = null;
            state.error = action.payload;
        });

        // Add purchase product reducers
        builder.addCase(addPurchaseProductApi.pending, (state, action) => {
            state.purchaseProductLoading = true;
            state.error = null;
        });
        builder.addCase(addPurchaseProductApi.fulfilled, (state, action) => {
            toast.success(action.payload.message);

            state.purchaseProductLoading = false;

            state.purchaseProduct = action.payload.body;

            // update product stock in UI instantly
            const purchasedItems = action.payload.body.lineItems || [];

            purchasedItems.forEach((item) => {
                const productIndex = state.products.findIndex(
                    (product) => product._id === item.productId,
                );

                if (productIndex !== -1) {
                    state.products[productIndex].stock -= item.qty;
                }
            });
        });
        builder.addCase(addPurchaseProductApi.rejected, (state, action) => {
            toast.error(action.payload.message);
            state.purchaseProductLoading = false;
            state.error = action.payload;
        });
    },
});

export const { clearCouponState } = productSlice.actions;
export default productSlice.reducer;
