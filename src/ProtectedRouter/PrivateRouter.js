import React from "react";
import { useSelector } from "react-redux";
import Spinner from "../Components/Spinner/Spinner";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRouter = ({ children }) => {
    const { user, isLoading } = useSelector((state) => state.auth.auth);
    const location = useLocation();
    if (isLoading ) {
        return <Spinner></Spinner>;
    }
    if (user && user?.email && user?.accountApproved) {
        return children;
    }
    return <Navigate to={"/login"} state={{from: location?.pathname}}></Navigate>;
};

export default PrivateRouter;
