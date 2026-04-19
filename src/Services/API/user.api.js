import axiosSecure from "../../Interceptors/useAxiosSecure"

export const fetchAllUserApi= async(payload)=>{
    const response = await axiosSecure.get(`/auth/all-list?page=${payload.page}&limit=${payload.limit}&search=${payload.search}`);
    const data = await response.data;
    return data;
}

export const fetchAllUserStatistics = async(payload)=>{
    const response = await axiosSecure(`/auth/user-statistics`);
    const data = response.data;
    return data;
}

// Update user info api service
export const updateUserInfoApiService = async(payload)=>{
    const response = await axiosSecure.put(`/auth/update-user-info`,payload);
    const data = response.data;
    return data;
}




