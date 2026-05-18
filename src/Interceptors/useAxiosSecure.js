import axios from "axios";

const axiosSecure = axios.create({
    baseURL: process.env.REACT_APP_SERVER,
});

let refreshPromise = null;

axiosSecure.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
});

axiosSecure.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem("refreshToken");
        const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh-token");

        if (
            error.response?.status === 401 &&
            refreshToken &&
            !originalRequest?._retry &&
            !isRefreshRequest
        ) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = axios
                        .post(`${process.env.REACT_APP_SERVER}/auth/refresh-token`, {
                            refreshToken,
                        })
                        .then((response) => response.data)
                        .finally(() => {
                            refreshPromise = null;
                        });
                }

                const data = await refreshPromise;
                localStorage.setItem("token", data.accessToken);
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                originalRequest.headers.authorization = `Bearer ${data.accessToken}`;
                return axiosSecure(originalRequest);
            } catch (_refreshError) {
                localStorage.removeItem("token");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        }

        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            if (currentPath !== "/login") {
                localStorage.removeItem("token");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                // window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default axiosSecure;
