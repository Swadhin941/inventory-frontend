import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import PageError from "../Error/PageError";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import PageNotFound from "../Error/PageNotFound";
import ForgetPassword from "../Pages/ForgetPassword/ForgetPassword";
import Root from "../Layout/Root";
export const Router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <PageError></PageError>,
        children: [
            {
                path: "/",
                element: <Home></Home>,
            },
            {
                path: "/login",
                element: <Login></Login>,
            },
            {
                path: "/register",
                element: <Register></Register>
            },
            {
                path: "/forget-password",
                element: <ForgetPassword></ForgetPassword>
            }
        ]
        
    },
    {
        path: "*",
        element: <PageNotFound></PageNotFound>
    }
]);
