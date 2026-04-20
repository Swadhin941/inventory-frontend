import axiosSecure from "../../Interceptors/useAxiosSecure"

export const addBrandApiService = async(payload)=>{
    const response= await axiosSecure.post('/product/add-brand', payload);
    const data = await response.data;
    return data;
}

export const getAllBrandApiService = async(payload)=>{
    const response = await axiosSecure.get("/product/get-all-brand", {params: payload});
    const data = await response.data;
    return data;
}

export const updateBrandApiService = async(payload)=>{
    const response = await axiosSecure.put('/product/update-brand', payload);
    const data = await response.data;
    return data;
}

export const deleteBrandApiService = async(payload)=>{
    const response = await axiosSecure.delete('/product/delete-brand', {data: payload});
    const data = await response.data;
    return data;
}