import axiosSecure from "../../Interceptors/useAxiosSecure"

export const getBusinessInfoApiService = async()=>{
    const response = await axiosSecure.get("/business-settings/get-business-info");
    const data = await response.data;
    return data
}

export const addBusinessInfoApiService = async(payload)=>{
    const response = await axiosSecure.post("/business-settings/add-business-info", payload);
    const data = await response.data;
    return data
}
export const updateBusinessInfoApiService = async(payload)=>{
    const response = await axiosSecure.post("/business-settings/update-business-info", payload);
    const data = await response.data;
    return data
}