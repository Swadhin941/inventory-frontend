import axiosSecure from "../../Interceptors/useAxiosSecure";
export const loginApiService = async (payload) => {
    const response = await fetch(`${process.env.REACT_APP_SERVER}/auth/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
};

export const registerApiService = async (payload) => {
    const response = await fetch(
        `${process.env.REACT_APP_SERVER}/auth/register`,
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(payload),
        },
    );
    const data = await response.json();
    return data;
};

export const observerApiService = async () => {
    const response = await axiosSecure.get(`/auth/validate-info`);
    const data = response.data;
    return data;
};

export const getAllRolesApiService = async()=>{
    const response = await axiosSecure.get(`/auth/get-all-roles`);
    const data = response.data;
    return data;
}
