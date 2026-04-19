import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchAllUserApi,
    fetchAllUserStatistics,
    updateUserInfoApiService,
} from "../API/user.api";
import toast from "react-hot-toast";

const initUserState = {
    users: [],
    isLoading: false,
    error: null,
    statistics: null,
    isStatsLoading: false,
    updateUserData: null,
    isUpdateUserLoading: false
};

export const fetchAllUser = createAsyncThunk(
    "fetch-all-user",
    async (payload, { rejectWithValue }) => {
        try {
            console.log(payload, "from fetch user thunk");
            const userData = await fetchAllUserApi(payload);
            return userData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const fetchUserStatistics = createAsyncThunk(
    "fetch-user-statistics",
    async (_, { rejectWithValue }) => {
        try {
            const userStats = await fetchAllUserStatistics();
            return userStats;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

// User info update api
export const updateUserInfoApi = createAsyncThunk(
    "update/user-info",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await updateUserInfoApiService(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const userSlice = createSlice({
    name: "users",
    initialState: initUserState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUser.pending, (state, action) => {
                state.users = [];
                state.isLoading = true;
            })
            .addCase(fetchAllUser.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;

                    state.users = [
                        ...state.users,
                        ...action.payload.body.map((item) => item),
                    ];
                } else {
                    toast.error(action.payload.message);
                    state.error = action.payload.message;
                    state.isLoading = false;
                    state.users = [];
                }
            })
            .addCase(fetchAllUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            // Statistics  loading state
            .addCase(fetchUserStatistics.pending, (state, action) => {
                state.isStatsLoading = true;
                state.statistics = null;
            })
            .addCase(fetchUserStatistics.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isStatsLoading = false;
                    state.statistics = action.payload.body;
                } else {
                    toast.error(action.payload.message);
                    state.isStatsLoading = false;
                    state.error = action.payload.message;
                    state.statistics = null;
                }
            })
            .addCase(fetchUserStatistics.rejected, (state, action) => {
                state.isStatsLoading = false;
                state.statistics = null;
                state.error = action.payload?.message || null;
            })

            // Update user info reducer
            .addCase(updateUserInfoApi.pending, (state, action)=>{
                state.isUpdateUserLoading= true;
                state.updateUserData = null;
            })
            .addCase(updateUserInfoApi.fulfilled, (state, action)=>{
                toast.success(action.payload.message);
                state.isUpdateUserLoading= false;
                state.updateUserData = action.payload.body;
            })
            .addCase(updateUserInfoApi.rejected, (state, action)=>{
                state.isUpdateUserLoading= false;
                state.updateUserData = null;
                state.error = action.payload?.message || null;
            })
    },
});

export default userSlice.reducer;
