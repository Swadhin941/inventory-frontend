import logo from "./logo.svg";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Router } from "./Router/Router";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { observerApi } from "./Services/slices/auth.slice";

function App() {
    const {user, isLoading}= useSelector(state=>state.auth);
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(observerApi())
    },[dispatch])
    return (
        <div>
            <RouterProvider router={Router}></RouterProvider>
            <Toaster  />
        </div>
    );
}

export default App;
