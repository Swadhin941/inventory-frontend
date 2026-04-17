import React from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../Components/Spinner/Spinner';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRouter = ({children}) => {
    const { user, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();
    if (isLoading) {
        return <Spinner></Spinner>;
    }
    if (user && user?.email && user?.role.toLowerCase() === "admin") {
        return children;
    }
    return <Navigate to={"/login"} state={{ from: location }}></Navigate>;
};

export default AdminRouter;