import React, { useEffect, useMemo, useState } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { Card, Empty, Select, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getTopProductListApiService } from "../../../Services/slices/dashboard.slice";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopProductsChart = ({ data = [], dateRange }) => {
    const [limit, setLimit] = useState(5);
    const dispatch = useDispatch();
    const { topProductList, isTopProductListLoader } = useSelector(
        (state) => state.dashboard,
    );

    useEffect(() => {
        if (dateRange) {
            dispatch(
                getTopProductListApiService({
                    startDate: dateRange[0].format("YYYY-MM-DD"),
                    endDate: dateRange[1].format("YYYY-MM-DD"),
                    limit: limit,
                }),
            );
        }
    }, [dateRange, dispatch, limit]);

    useEffect(() => {
        console.log(topProductList, isTopProductListLoader);
    }, [topProductList, isTopProductListLoader]);

    const chartData = {
        labels: topProductList.map((item) => item.name),

        datasets: [
            {
                label: "Units Sold",

                data: topProductList.map((item) => item.sold),

                backgroundColor: "#722ed1",
            },
        ],
    };

    return (
        <Card className="dashboard-card">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <h3 style={{ margin: 0 }}>Top Products</h3>

                <Select
                    value={limit}
                    onChange={setLimit}
                    style={{ width: 120 }}
                    options={[
                        {
                            label: "Top 5",
                            value: 5,
                        },

                        {
                            label: "Top 10",
                            value: 10,
                        },

                        {
                            label: "Top 15",
                            value: 15,
                        },

                        {
                            label: "Top 20",
                            value: 20,
                        },
                    ]}
                />
            </div>
            {isTopProductListLoader ? (
                <Skeleton active />
            ) : topProductList.length === 0 ? (
                <Empty description="No data found" />
            ) : (
                <Bar data={chartData} />
            )}
        </Card>
    );
};

export default TopProductsChart;
