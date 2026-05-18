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

const downloadCsv = async (path, fileName) => {
    const response = await axiosSecure.get(path, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

export const exportSalesHistoryApiService = () =>
    downloadCsv("/business-settings/export/sales-history", "sales-history.csv");

export const exportProductListApiService = () =>
    downloadCsv("/business-settings/export/product-list", "product-list.csv");

export const exportPaymentRecordsApiService = () =>
    downloadCsv("/business-settings/export/payment-records", "payment-records.csv");
