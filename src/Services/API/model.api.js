import axiosSecure from "../../Interceptors/useAxiosSecure"

export const getAllModelApiService = (payload)=>{
    const response = axiosSecure.get("/product/get-all-model", {params: payload});
    const data = response.data;
    return data;
}

export const addModelApiService = (payload)=>{
    const response= axiosSecure.post('/product/add-model', payload);
    const data = response.data;
    return data;
}