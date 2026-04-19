import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../Components/Spinner/Spinner";

const SalesRouter = ({ children }) => {
    const { user, isLoading } = useSelector((state) => state.auth.auth);
    const location = useLocation();
    if (isLoading) {
        return <Spinner></Spinner>;
    }
    if (
        user &&
        user?.email &&
        user?.role.toLowerCase() === "sales" &&
        user?.accountApproved
    ) {
        return children;
    }
    return <Navigate to={"/login"} state={{ from: location }}></Navigate>;
};

export default SalesRouter;
