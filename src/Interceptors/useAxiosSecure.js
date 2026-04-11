import axios from "axios";

const axiosSecure = axios.create({
    baseURL: process.env.REACT_APP_SERVER,
});

axiosSecure.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
});

axiosSecure.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            if (currentPath !== "/login") {
                localStorage.removeItem("token"); // cleanup
                // window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default axiosSecure;
