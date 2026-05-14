import React, { useEffect } from "react";
import "./SalesStats.css";
import { Card, Col, Row, Skeleton, Statistic } from "antd";
import Text from "antd/es/typography/Text";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesStatistics } from "../../../Services/slices/sales.slice";
import { formatMoney } from "../../../Utils/businessSettings";

const SalesStats = () => {
    const dispatch = useDispatch();
    const { purchaseStats, purchaseStatsLoading } = useSelector(
        (state) => state.sales,
    );
    const { businessInfo } = useSelector((state) => state.business);

    useEffect(()=>{
        dispatch(fetchSalesStatistics());
    },[dispatch])
    return purchaseStatsLoading ? (
        <Skeleton active />
    ) : (
        <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
                <Card
                    style={{
                        borderRadius: 24,
                    }}
                >
                    <Text type="secondary" strong>
                        💵 Cash Received
                    </Text>

                    <Statistic
                        value={formatMoney(purchaseStats?.totalCashReceived, businessInfo)}
                        valueStyle={{
                            fontWeight: 800,
                            marginTop: 10,
                        }}
                    />

                    <Text type="secondary">
                        {purchaseStats?.cashTransactions} transactions
                    </Text>
                </Card>
            </Col>

            <Col xs={24} md={8}>
                <Card
                    style={{
                        borderRadius: 24,
                    }}
                >
                    <Text type="secondary" strong>
                        💳 Card Received
                    </Text>

                    <Statistic
                        value={formatMoney(purchaseStats?.totalCardReceived, businessInfo)}
                        valueStyle={{
                            fontWeight: 800,
                            marginTop: 10,
                        }}
                    />

                    <Text type="secondary">
                        {purchaseStats?.cardTransactions} transactions
                    </Text>
                </Card>
            </Col>

            <Col xs={24} md={8}>
                <Card
                    style={{
                        borderRadius: 24,
                    }}
                >
                    <Text type="secondary" strong>
                        ↩ Total Refunded
                    </Text>

                    <Statistic
                        value={formatMoney(purchaseStats?.totalRefunded, businessInfo)}
                        valueStyle={{
                            color: "#dc2626",
                            fontWeight: 800,
                            marginTop: 10,
                        }}
                    />

                    <Text type="secondary">
                        {purchaseStats?.refundTransactions} refunds this month
                    </Text>
                </Card>
            </Col>
        </Row>
    );
};

export default SalesStats;
