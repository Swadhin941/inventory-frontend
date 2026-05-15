import React from "react";

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
import { Card } from "antd";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
);

const SalesOverviewChart = ({ data }) => {
    const chartData = {
        labels: data.map((item) => item.date),

        datasets: [
            {
                label: "Sales",
                data: data.map((item) => item.amount),
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

            <Line data={chartData} />
        </Card>
    );
};

export default SalesOverviewChart;
