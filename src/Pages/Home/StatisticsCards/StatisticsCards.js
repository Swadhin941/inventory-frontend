import React, { useEffect } from "react";
import { Card, Col, Row, Skeleton, Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStatistics } from "../../../Services/API/dashboard.api";
import { getDashboardStatisticsApiService } from "../../../Services/slices/dashboard.slice";

const StatisticsCards = ({ data, dateRange }) => {
    const dispatch = useDispatch();
    const { statistics, isStatisticsLoading } = useSelector(
        (state) => state.dashboard,
    );
    useEffect(() => {
        console.log(dateRange, "date range");
        if (dateRange) {
            const startDate = dateRange[0].format("YYYY-MM-DD");
            const endDate = dateRange[1].format("YYYY-MM-DD");
            dispatch(getDashboardStatisticsApiService({ startDate, endDate }));
        }
    }, [dateRange, dispatch]);

    useEffect(() => {
        console.log(statistics, "stats data");
    }, [statistics]);
    return (isStatisticsLoading || !statistics) ? (
        <Skeleton active />
    ) : (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card">
                    <Statistic
                        title="Total Sales"
                        value={statistics?.totalSales}
                        prefix="QAR"
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card">
                    <Statistic title="Orders" value={statistics?.totalOrders} />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card">
                    <Statistic
                        title="Refunds"
                        value={statistics?.totalRefunds}
                        prefix="QAR"
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card">
                    <Statistic
                        title="Profit"
                        value={statistics?.totalProfit}
                        prefix="QAR"
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default StatisticsCards;
