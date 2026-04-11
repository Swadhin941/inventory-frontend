import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    loginApiService,
    observerApiService,
    registerApiService,
} from "../API/auth.api";
import toast from "react-hot-toast";

export const loginApi = createAsyncThunk(
    "fetch/login",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await loginApiService(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const registerApi = createAsyncThunk(
    "fetch/register",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await registerApiService(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const observerApi = createAsyncThunk(
    "fetch/observer",
    async (_, { rejectWithValue }) => {
        try {
            const observer = await observerApiService();
            return observer;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const initAuthState = {
    auth: {
        user: null,
        isLoading: false,
        error: null,
        isRegisterLoading: false,
        isLoginLoading: false,
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState: initAuthState,
    extraReducers: (builder) => {
        // Login api actions

        builder
            .addCase(loginApi.pending, (state, action) => {
                state.auth.isLoginLoading = true;
                state.auth.user = null;
            })
            .addCase(loginApi.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.auth.user = action.payload.body;
                    state.auth.isLoginLoading = false;
                    state.auth.error= null;
                    localStorage.setItem("token", action.payload.token)
                } else {
                    toast.error(action.payload.message);
                    state.auth.isLoginLoading = false;
                    state.auth.user = null;
                    state.auth.error= action.payload.message;
                }
            })
            .addCase(loginApi.rejected, (state, action) => {
                console.log(action.payload);
                toast.error(action.payload.message);
                state.auth.isLoginLoading = false;
                state.auth.user = null;
                state.auth.error= action.payload;
            })

            //Register api actions
            .addCase(registerApi.pending, (state, action) => {
                state.auth.isRegisterLoading = true;
            })
            .addCase(registerApi.fulfilled, (state, action) => {
                if (action.payload.success) {
                    toast.success(action.payload.message);
                    state.auth.isRegisterLoading = false;
                    state.auth.error= null;
                } else {
                    toast.error(action.payload.message);
                    state.auth.isRegisterLoading = false;
                    state.auth.error= action.payload.message;
                }
            })
            .addCase(registerApi.rejected, (state, action) => {
                toast.error(action.payload.message);
                state.auth.isRegisterLoading = false;
            })

            // Observer api actions
            .addCase(observerApi.pending, (state, action) => {
                state.auth.isLoading = true;
                state.auth.user = null;
            })
            .addCase(observerApi.fulfilled, (state, action) => {
                state.auth.isLoading = false;
                state.auth.user = action.payload;
            })
            .addCase(observerApi.rejected, (state, action) => {
                state.auth.isLoading = false;
                state.auth.user = null;
            });
    },
});

export default authSlice.reducer;
