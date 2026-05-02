import logo from "./logo.svg";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Router } from "./Router/Router";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { observerApi } from "./Services/slices/auth.slice";
import { ConfigProvider } from "antd"; // ✅ ADD THIS

function App() {
    const { user, isLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(observerApi());
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