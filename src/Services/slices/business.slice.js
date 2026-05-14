import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addBusinessInfoApiService, getBusinessInfoApiService, updateBusinessInfoApiService } from "../API/business.api";
import { extractBusinessSettings } from "../../Utils/businessSettings";

const initBusinessState = {
    businessInfo: null,
    businessInfoLoader: false,
};

const getSettingsPayload = (response, fallback) => {
    const extracted = extractBusinessSettings(response);

    if (extracted?.storeInformation || extracted?.currencyVat || extracted?._id) {
        return extracted;
    }

    return fallback || extracted || null;
};

export const getBusinessInfoApi = createAsyncThunk(
    "fetch/business",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getBusinessInfoApiService();
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);


export const addBusinessInfoApi = createAsyncThunk(
    "create/business",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await addBusinessInfoApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const updateBusinessInfoApi = createAsyncThunk(
    "update/business",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await updateBusinessInfoApiService(payload);
            if (!response.success) {
                return rejectWithValue(response);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

const businessSlice = createSlice({
    name: "business",
    initialState: initBusinessState,
    extraReducers: (builder) => {
        builder.addCase(getBusinessInfoApi.pending, (state) => {
            state.businessInfoLoader = true;
        });
        builder.addCase(getBusinessInfoApi.fulfilled, (state, action) => {
            state.businessInfo = getSettingsPayload(action.payload);
            state.businessInfoLoader = false;
        });
        builder.addCase(getBusinessInfoApi.rejected, (state) => {
            state.businessInfoLoader = false;
        });

        builder.addCase(addBusinessInfoApi.pending, (state) => {
            state.businessInfoLoader = true;
        });
        builder.addCase(addBusinessInfoApi.fulfilled, (state, action) => {
            state.businessInfo = getSettingsPayload(
                action.payload,
                action.meta.arg,
            );
            state.businessInfoLoader = false;
        });
        builder.addCase(addBusinessInfoApi.rejected, (state) => {
            state.businessInfoLoader = false;
        });

        builder.addCase(updateBusinessInfoApi.pending, (state) => {
            state.businessInfoLoader = true;
        });
        builder.addCase(updateBusinessInfoApi.fulfilled, (state, action) => {
            state.businessInfo = getSettingsPayload(
                action.payload,
                action.meta.arg,
            );
            state.businessInfoLoader = false;
        });
        builder.addCase(updateBusinessInfoApi.rejected, (state) => {
            state.businessInfoLoader = false;
        });
    },
});

export default businessSlice.reducer;
