import React, { useEffect } from "react";

import { Card, Col, Row, Skeleton } from "antd";

import {
    ShopOutlined,
    ShoppingCartOutlined,
    UndoOutlined,
    RiseOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";

import { getDashboardStatisticsApiService } from "../../../Services/slices/dashboard.slice";

const StatisticsCards = ({ dateRange }) => {
    const dispatch = useDispatch();

    const { statistics, isStatisticsLoading } = useSelector(
        (state) => state.dashboard,
    );

    useEffect(() => {
        if (dateRange) {
            dispatch(
                getDashboardStatisticsApiService({
                    startDate: dateRange[0].format("YYYY-MM-DD"),

                    endDate: dateRange[1].format("YYYY-MM-DD"),
                }),
            );
        }
    }, [dispatch, dateRange]);

    const cards = [
        {
            title: "Total Sales",

            value: statistics?.totalSales || 0,

            prefix: "QAR",

            icon: <ShopOutlined />,

            bg: "#E8F5EC",

            color: "#167C3D",
        },

        {
            title: "Orders",

            value: statistics?.totalOrders || 0,

            icon: <ShoppingCartOutlined />,

            bg: "#E8F0FF",

            color: "#2563EB",
        },

        {
            title: "Refunds",

            value: statistics?.totalRefunds || 0,

            prefix: "QAR",

            icon: <UndoOutlined />,

            bg: "#FCEAEA",

            color: "#DC2626",
        },

        {
            title: "Profit",

            value: statistics?.totalProfit || 0,

            prefix: "QAR",

            icon: <RiseOutlined />,

            bg: "#F3E8FF",

            color: "#7C3AED",
        },
    ];

    if (isStatisticsLoading) {
        return <Skeleton active />;
    }

    return (
        <Row gutter={[16, 16]}>
            {cards.map((card, index) => (
                <Col key={index} xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 20,

                            height: 210,

                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        }}
                    >
                        {/* ICON */}

                        <div
                            style={{
                                width: 58,

                                height: 58,

                                borderRadius: 16,

                                background: card.bg,

                                display: "flex",

                                alignItems: "center",

                                justifyContent: "center",

                                color: card.color,

                                fontSize: 24,

                                marginBottom: 28,
                            }}
                        >
                            {card.icon}
                        </div>

                        {/* TITLE */}

                        <div
                            style={{
                                color: "#64748B",

                                fontSize: 16,

                                fontWeight: 500,

                                marginBottom: 14,
                            }}
                        >
                            {card.title}
                        </div>

                        {/* VALUE */}

                        <div
                            style={{
                                fontSize: "26px",
                                fontWeight: 800,
                                lineHeight: 1.1,
                                color: "#0F172A",
                            }}
                        >
                            {card.prefix
                                ? `${card.prefix} ${card.value.toLocaleString()}`
                                : card.value.toLocaleString()}
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default StatisticsCards;
