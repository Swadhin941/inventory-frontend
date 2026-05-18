import React, { useEffect } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { Card, Empty, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentTypeOverviewApiService } from "../../../Services/slices/dashboard.slice";

ChartJS.register(ArcElement, Tooltip, Legend);

const PaymentMethodChart = ({ data, dateRange }) => {
    const dispatch= useDispatch();
    const { paymentTypeOverview , isPaymentTypeOverviewLoader} = useSelector((state) => state.dashboard);

    useEffect(()=>{
        if(dateRange){
            dispatch(getPaymentTypeOverviewApiService({
                startDate: dateRange[0].format("YYYY-MM-DD"),
                endDate: dateRange[1].format("YYYY-MM-DD"),
            }))
        }
    },[dateRange, dispatch])

    useEffect(()=>{
        console.log(paymentTypeOverview, isPaymentTypeOverviewLoader);
    },[paymentTypeOverview, isPaymentTypeOverviewLoader])

    const chartData = {
        labels: paymentTypeOverview.map((item) => item.label),

        datasets: [
            {
                data: paymentTypeOverview.map((item) => item.value),

                backgroundColor: ["#1677ff", "#52c41a"],
            },
        ],
    };

    return (
        <Card className="dashboard-card">
            <h3>Payment Methods</h3>
            {isPaymentTypeOverviewLoader ? (
                <Skeleton active />
            ) : (
                paymentTypeOverview.length === 0?<Empty description="No Payments Data Found" /> :(<Doughnut data={chartData} />)
            )}
        </Card>
    );
};

export default PaymentMethodChart;
