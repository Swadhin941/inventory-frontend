import React from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { Card } from "antd";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopProductsChart = ({ data }) => {
    const chartData = {
        labels: data.map((item) => item.name),

        datasets: [
            {
                label: "Units Sold",
                data: data.map((item) => item.sold),
                backgroundColor: "#722ed1",
            },
        ],
    };

    return (
        <Card className="dashboard-card">
            <h3>Top Products</h3>

            <Bar data={chartData} />
        </Card>
    );
};

export default TopProductsChart;
