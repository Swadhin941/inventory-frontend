import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice";

const mainStore = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default mainStore;
