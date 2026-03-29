import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const useAxiosSecure = () => {
    // const { logout } = useContext(SharedData);
    const navigate = useNavigate();
    const axiosSecure = axios.create({
        baseURL: process.env.REACT_APP_SERVER,
    });
    useEffect(() => {
        axiosSecure.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }
            return config;
        });

        axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        // logout();
                        navigate("/login");
                    }
                    if (error.response.status === 403) {
                        navigate("/forbidden");
                    }
                }
                return Promise.reject(error);
            },
        );
    }, [ navigate, axiosSecure]);
    return [axiosSecure];
};

export default useAxiosSecure;
