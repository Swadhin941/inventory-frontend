import React, { useEffect } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import { Card, Empty, Skeleton } from "antd";

import { useDispatch, useSelector } from "react-redux";

import dayjs from "dayjs";

import { getSalesOverviewApiService } from "../../../Services/slices/dashboard.slice";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const SalesOverviewChart = () => {
    const dispatch = useDispatch();

    const { salesOverview, isSalesOverviewLoader } = useSelector(
        (state) => state.dashboard,
    );

    useEffect(() => {
        const endDate = dayjs();

        const startDate = dayjs().subtract(6, "day");

        dispatch(
            getSalesOverviewApiService({
                startDate: startDate.format("YYYY-MM-DD"),

                endDate: endDate.format("YYYY-MM-DD"),
            }),
        );
    }, [dispatch]);

    const chartData = {
        labels: salesOverview.map((item) => dayjs(item.label).format("DD MMM")),

        datasets: [
            {
                label: "Sales (QAR)",

                data: salesOverview.map((item) => item.totalSales),

                backgroundColor: "#1677ff",

                borderRadius: 8,

                barThickness: 40,
            },
        ],
    };

    const options = {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: true,
            },
        },

        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <Card className="dashboard-card">
            <h3>Sales Overview (Last 7 Days)</h3>

            {isSalesOverviewLoader ? (
                <Skeleton active />
            ) : salesOverview.length > 0 ? (
                <div
                    style={{
                        height: "350px",
                    }}
                >
                    <Bar data={chartData} options={options} />
                </div>
            ) : (
                <Empty description="No Sales Data Found" />
            )}
        </Card>
    );
};

export default SalesOverviewChart;
