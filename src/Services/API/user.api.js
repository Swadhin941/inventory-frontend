import axiosSecure from "../../Interceptors/useAxiosSecure"

export const fetchAllUserApi= async(payload)=>{
    const response = await axiosSecure.get(`/auth/all-list?page=${payload.page}&limit=${payload.limit}`);
    const data = await response.data;
    return data;
}

export const fetchAllUserStatistics = async(payload)=>{
    const response = await axiosSecure(`/auth/user-statistics`);
    const data = response.data;
    return data;
}




