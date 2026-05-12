import axiosSecure from "../../Interceptors/useAxiosSecure";

export const getAllDiscountApiService = async (payload) => {
    const response = await axiosSecure.get("/discount/get-all-discount", {
        params: payload,
    });
    const data = await response.data;
    return data;
};

export const addDiscountApiService =async(payload)=>{
    const response = await axiosSecure.post("/discount/add-discount", payload);
    const data = await response.data;
    return data;
}


export const updateDiscountApiService =async(payload)=>{
    const response = await axiosSecure.put("/discount/update-discount", payload);
    const data = await response.data;
    return data;
}
