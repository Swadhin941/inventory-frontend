import axiosSecure from "../../Interceptors/useAxiosSecure";

export const getAllSalesApiService = async(payload)=>{
    const response = await axiosSecure.get("/purchase/get-all-purchase", {
        params: payload,
    });
    const data = await response.data;
    return data;
}

export const getAllSalesStatisticsApiService = async()=>{
    const response = await axiosSecure.get(
        "/purchase/get-all-purchase-statistics",
    );
    const data = await response.data;
    return data;
}

export const getProductDetailsApi = async(payload)=>{
    const response = await axiosSecure.get("/purchase/get-purchase-product-details", {
        params: payload,
    });
    const data = await response.data;
    return data;
}
