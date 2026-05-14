import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Router } from "./Router/Router";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { observerApi } from "./Services/slices/auth.slice";
import { ConfigProvider } from "antd"; // ✅ ADD THIS
import { getBusinessInfoApi } from "./Services/slices/business.slice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(observerApi());
        dispatch(getBusinessInfoApi());
    }, [dispatch]);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#166534", // ✅ your green
                    borderRadius: 8,
                },
            }}
        >
            <RouterProvider router={Router} />
            <Toaster />
        </ConfigProvider>
    );
}

export default App;
