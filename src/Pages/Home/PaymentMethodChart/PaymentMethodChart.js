import React from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { Card } from "antd";

ChartJS.register(ArcElement, Tooltip, Legend);

const PaymentMethodChart = ({ data }) => {
    const chartData = {
        labels: data.map((item) => item.label),

        datasets: [
            {
                data: data.map((item) => item.value),

                backgroundColor: ["#1677ff", "#52c41a"],
            },
        ],
    };

    return (
        <Card className="dashboard-card">
            <h3>Payment Methods</h3>

            <Doughnut data={chartData} />
        </Card>
    );
};

export default PaymentMethodChart;
