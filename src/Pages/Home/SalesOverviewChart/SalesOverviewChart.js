import React, { useEffect } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { Card, Empty, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getSalesOverviewApiService } from "../../../Services/slices/dashboard.slice";
import dayjs from "dayjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
);

const SalesOverviewChart = ({ data, dateRange }) => {
    const dispatch = useDispatch();
    const { salesOverview, isSalesOverviewLoader } = useSelector(
        (state) => state.dashboard,
    );

    useEffect(() => {
        if (dateRange) {
            dispatch(
                getSalesOverviewApiService({
                    startDate: dateRange[0].format("YYYY-MM-DD"),
                    endDate: dateRange[1].format("YYYY-MM-DD"),
                }),
            );
        }
    }, [dispatch, dateRange]);

    useEffect(() => {
        console.log(salesOverview, isSalesOverviewLoader);
    }, [salesOverview, isSalesOverviewLoader]);
    const chartData = {
        labels: salesOverview.map((item) =>
        dayjs(item.label).format("DD MMM YYYY")),

        datasets: [
            {
                label: "Sales (QAR)",
                data: salesOverview.map((item) => item.totalSales),
                borderColor: "#1677ff",
                backgroundColor: "rgba(22,119,255,0.2)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    return (
        <Card className="dashboard-card">
            <h3>Sales Overview</h3>

            {isSalesOverviewLoader ? (
                <Skeleton active />
            ) : salesOverview.length > 0 ? (
                <Line data={chartData} />
            ) : (
                <Empty description="No Sales Data Found" />
            )}
        </Card>
    );
};

export default SalesOverviewChart;
