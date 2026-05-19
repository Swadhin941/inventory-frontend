import React, { useEffect, useMemo, useState } from "react";

import { Card, Empty, Progress, Select, Skeleton } from "antd";

import { useDispatch, useSelector } from "react-redux";

import { getTopProductListApiService } from "../../../Services/slices/dashboard.slice";

const TopProductsChart = ({ dateRange }) => {
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

                    limit,
                }),
            );
        }
    }, [dateRange, dispatch, limit]);

    const rankedProducts = useMemo(() => {
        const sorted = [...topProductList].sort((a, b) => b.sold - a.sold);

        const highest = sorted[0]?.sold || 1;

        return sorted.map((item) => ({
            ...item,

            progress: (item.sold / highest) * 100,
        }));
    }, [topProductList]);

    return (
        <Card className="dashboard-card">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <h3
                    style={{
                        margin: 0,
                    }}
                >
                    Top Products
                </h3>

                <Select
                    value={limit}
                    onChange={setLimit}
                    style={{
                        width: 120,
                    }}
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
            ) : rankedProducts.length === 0 ? (
                <Empty description="No data found" />
            ) : (
                <div>
                    {rankedProducts.map((product, index) => (
                        <div
                            key={product._id}
                            style={{
                                marginBottom: 20,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",

                                    justifyContent: "space-between",

                                    marginBottom: 6,

                                    gap: 12,
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 600,

                                        overflow: "hidden",

                                        textOverflow: "ellipsis",

                                        whiteSpace: "nowrap",

                                        maxWidth: "70%",
                                    }}
                                >
                                    {index + 1}. {product.name}
                                </div>

                                <div
                                    style={{
                                        fontWeight: 500,

                                        color: "#666",
                                    }}
                                >
                                    {product.sold} sold
                                </div>
                            </div>

                            <Progress
                                percent={Math.round(product.progress)}
                                showInfo={false}
                                strokeColor={
                                    index === 0 ? "#1677ff" : "#722ED1"
                                }
                            />
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default TopProductsChart;
