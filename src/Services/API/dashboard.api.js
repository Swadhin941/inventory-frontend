import axiosSecure from "../../Interceptors/useAxiosSecure";

export const getDashboardStatisticsApi = async (payload) => {
    const response = await axiosSecure.get(
        "/dashboard/get-dashboard-statistics",
        { params: payload },
    );
    const data = await response.data;
    return data;
};

export const getSalesOverviewApi= async(payload)=>{
    const response = await axiosSecure.get("/dashboard/get-sales-overview", {params: payload});
    const data = await response.data;
    return data;
}

export const getPaymentTypeOverviewApi = async(payload)=>{
    const response = await axiosSecure.get("/dashboard/get-payment-type-overview", {params: payload});
    const data = await response.data;
    return data;
}


export const getTopProductListApi = async(payload)=>{
    const response = await axiosSecure.get("/dashboard/get-top-product-list", {params: payload});
    const data = await response.data;
    return data;
}

export const getLowStockProductListApi = async(payload)=>{
    const response = await axiosSecure.get(
        "/dashboard/get-low-stock-product-list",
        { params: payload },
    );
    const data = await response.data;
    return data;
}


export const getRecentTransactionListApi = async (payload) => {
    const response = await axiosSecure.get(
        "/dashboard/get-all-recent-purchases",
        {
            params: payload,
        },
    );
    const data = await response.data;
    return data;
}

