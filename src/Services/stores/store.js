import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice";
import userReducer from "../slices/user.slice";
import brandReducer from "../slices/brand.slice";
import modelReducer from "../slices/model.slice";
import productReducer from "../slices/product.slice";

const mainStore = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        brand: brandReducer,
        model : modelReducer,
        product: productReducer
    },
});

export default mainStore;
