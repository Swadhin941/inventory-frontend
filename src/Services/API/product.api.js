import axiosSecure from "../../Interceptors/useAxiosSecure";

export const addProductApiService = async(payload)=>{
    const response = await axiosSecure.post("/product/add-product", payload);
    const data = await response.data;
    return data;
}

export const getAllProductsApiService = async(payload)=>{
    const response = await axiosSecure.get("/product/get-all-product", {params: payload});
    const data = await response.data;
    return data;
}

export const updateProductApiService = async(payload)=>{    
    const response = await axiosSecure.put("/product/update-product", payload);
    const data = await response.data;
    return data;
}

export const getProductStatisticsApiService = async()=>{
    const response = await axiosSecure.get("/product/product-statistics");
    const data = await response.data;
    return data;
}

export const validateCouponApiService = async(payload)=>{
    const response = await axiosSecure.post("/product/check-coupon-validity", payload);
    const data = await response.data;
    return data;
}

export const addPurchaseProductApiService = async(payload)=>{
    const response = await axiosSecure.post("/purchase/add-purchase", payload);
    const data = await response.data;
    return data;
}