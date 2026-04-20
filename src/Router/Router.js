import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import PageError from "../Error/PageError";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import PageNotFound from "../Error/PageNotFound";
import ForgetPassword from "../Pages/ForgetPassword/ForgetPassword";
import Root from "../Layout/Root";
import User from "../Pages/Users/User";
import PrivateRouter from "../ProtectedRouter/PrivateRouter";
import ProductPage from "../Pages/Products/ProductPage";
import SalesPage from "../Pages/SalesPage/SalesPage";
import SalesHistory from "../Pages/SalesHistory/SalesHistory";
export const Router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <PageError></PageError>,
        children: [
            {
                path: "/login",
                element: <Login></Login>,
            },
            {
                path: "/register",
                element: <Register></Register>,
            },
            {
                path: "/forget-password",
                element: <ForgetPassword></ForgetPassword>,
            },
        ],
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRouter>
                <Root></Root>
            </PrivateRouter>
        ),
        errorElement: <PageError></PageError>,
        children: [
            {
                path: "",
                element: <Home></Home>,
            },
            {
                path: "user",
                element: <User></User>,
            },
            {
                path: "product",
                element: <ProductPage></ProductPage>

            },
            {
                path: "sales",
                element: <SalesPage></SalesPage>
            },
            {
                path: "sales-history",
                element: <SalesHistory></SalesHistory>
            }
           
        ]
            
    },

    {
        path: "*",
        element: <PageNotFound></PageNotFound>,
    },
]);
