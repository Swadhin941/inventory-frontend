import { createSlice } from "@reduxjs/toolkit";
const initDashboard = {
    statistics: null,
    isStatisticsLoading: false,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: initDashboard,
    extraReducers: (builder) => {},
});

export default dashboardSlice.reducer;
