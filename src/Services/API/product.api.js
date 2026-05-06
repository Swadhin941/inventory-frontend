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