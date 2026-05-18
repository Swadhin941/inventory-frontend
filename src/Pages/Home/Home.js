import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import DashboardFilters from "./DashboardFilters/DashboardFilters";
import StatisticsCards from "./StatisticsCards/StatisticsCards";
import { Col, Row } from "antd";
import SalesOverviewChart from "./SalesOverviewChart/SalesOverviewChart";
import PaymentMethodChart from "./PaymentMethodChart/PaymentMethodChart";
import TopProductsChart from "./TopProductsChart/TopProductsChart";
import LowStockTable from "./LowStockTable/LowStockTable";
import RecentTransactions from "./RecentTransactions/RecentTransactions";
const Home = () => {
    const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);

    const [dashboardData, setDashboardData] = useState({
        statistics: {},
        salesOverview: [],
        paymentMethods: [],
        topProducts: [],
        lowStockProducts: [],
        recentTransactions: [],
    });

    const [loading, setLoading] = useState(false);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // API CALL HERE
            // const response = await axios.get(...)

            // Dummy Data
            setDashboardData({
                statistics: {
                    totalSales: 45820,
                    totalOrders: 182,
                    totalRefunds: 1200,
                    totalProfit: 11800,
                },

                salesOverview: [
                    { date: "Mon", amount: 1200 },
                    { date: "Tue", amount: 2400 },
                    { date: "Wed", amount: 1800 },
                    { date: "Thu", amount: 3200 },
                    { date: "Fri", amount: 2800 },
                    { date: "Sat", amount: 4100 },
                    { date: "Sun", amount: 3600 },
                ],

                paymentMethods: [
                    {
                        label: "Cash",
                        value: 42,
                    },
                    {
                        label: "Card",
                        value: 58,
                    },
                ],

                topProducts: [
                    {
                        name: "Samsung A55",
                        sold: 82,
                    },
                    {
                        name: "iPhone 15",
                        sold: 48,
                    },
                    {
                        name: "AirPods",
                        sold: 32,
                    },
                ],

                lowStockProducts: [
                    {
                        _id: 1,
                        name: "Samsung A55",
                        stock: 2,
                    },
                    {
                        _id: 2,
                        name: "iPhone 15",
                        stock: 1,
                    },
                ],

                recentTransactions: [
                    {
                        _id: 1,
                        trxId: "TRX-001",
                        customer: "Ahmed",
                        amount: 1200,
                    },
                    {
                        _id: 2,
                        trxId: "TRX-002",
                        customer: "Sara",
                        amount: 850,
                    },
                ],
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, [dateRange]);

    return (
        <div className="dashboard-page">
            <DashboardFilters
                dateRange={dateRange}
                setDateRange={setDateRange}
            />

            <StatisticsCards
                data={dashboardData.statistics}
                loading={loading}
                dateRange={dateRange}
            />

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <SalesOverviewChart data={dashboardData.salesOverview} dateRange={dateRange} />
                </Col>

                <Col xs={24} lg={8}>
                    <PaymentMethodChart data={dashboardData.paymentMethods} dateRange={dateRange} />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <TopProductsChart data={dashboardData.topProducts} dateRange={dateRange} />
                </Col>

                <Col xs={24} lg={12}>
                    <LowStockTable data={dashboardData.lowStockProducts} dateRange={dateRange} />
                </Col>
            </Row>

            <RecentTransactions data={dashboardData.recentTransactions} dateRange={dateRange} />
        </div>
    );
};

export default Home;
