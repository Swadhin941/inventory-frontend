import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice";
import userReducer from "../slices/user.slice";
import brandReducer from "../slices/brand.slice";

const mainStore = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        brand: brandReducer,
    },
});

export default mainStore;
