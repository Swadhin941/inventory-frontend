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
   const [dateRange, setDateRange] = useState([
       dayjs().subtract(6, "day"),
       dayjs(),
   ]);

    const [dashboardData, setDashboardData] = useState({
        statistics: {},
        salesOverview: [],
        paymentMethods: [],
        topProducts: [],
        lowStockProducts: [],
        recentTransactions: [],
    });

    const [loading, setLoading] = useState(false);



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

            <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} lg={16}>
                    <SalesOverviewChart data={dashboardData.salesOverview} />
                </Col>

                <Col xs={24} lg={8}>
                    {/* <PaymentMethodChart data={dashboardData.paymentMethods} dateRange={dateRange} /> */}
                    <TopProductsChart
                        data={dashboardData.topProducts}
                        dateRange={dateRange}
                    />
                </Col>
            </Row>

            {/* <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <LowStockTable
                        data={dashboardData.lowStockProducts}
                        dateRange={dateRange}
                    />
                </Col>
            </Row> */}

            <RecentTransactions
                data={dashboardData.recentTransactions}
                dateRange={dateRange}
            />
        </div>
    );
};

export default Home;
