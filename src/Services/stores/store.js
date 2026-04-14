import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice";
import userReducer from "../slices/user.slice";

const mainStore = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer
    },
});

export default mainStore;
