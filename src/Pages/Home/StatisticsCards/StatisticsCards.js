import React from "react";
import { Card, Col, Row, Statistic } from "antd";

const StatisticsCards = ({ data }) => {
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card">
                    <Statistic
                        title="Total Sales"
                        value={data.totalSales}
                        prefix="QAR"
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card">
                    <Statistic title="Orders" value={data.totalOrders} />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card">
                    <Statistic
                        title="Refunds"
                        value={data.totalRefunds}
                        prefix="QAR"
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card">
                    <Statistic
                        title="Profit"
                        value={data.totalProfit}
                        prefix="QAR"
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default StatisticsCards;
