import React, { useEffect, useState } from "react";

import { Card, Table, Tag, Skeleton } from "antd";

import { useDispatch, useSelector } from "react-redux";

import { getRecentTransactionListApiService } from "../../../Services/slices/dashboard.slice";

const RecentTransactions = ({ data, dateRange }) => {
    const {
        recentTransactionList,
        recentTransactionListLoader,
        recentTransactionListCount,
    } = useSelector((state) => state.dashboard);

    const dispatch = useDispatch();

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);

    useEffect(() => {
        if (dateRange) {
            dispatch(
                getRecentTransactionListApiService({
                    startDate: dateRange[0].format("YYYY-MM-DD"),
                    endDate: dateRange[1].format("YYYY-MM-DD"),
                    page,
                    limit,
                }),
            );
        }
    }, [dispatch, dateRange, page, limit]);

    const columns = [
        {
            title: "Transaction",
            dataIndex: "TrxID",
        },

        {
            title: "Customer",
            dataIndex: "customerName",
        },

        {
            title: "Payment",
            dataIndex: "paymentMethod",

            render: (_, method) => (
                <Tag color={method.paymentMethod === "cash" ? "green" : "blue"}>
                    {method.paymentMethod.toUpperCase()}
                </Tag>
            ),
        },

        {
            title: "Status",
            dataIndex: "refunded",

            render: (refunded) => (
                <Tag color={refunded ? "red" : "green"}>
                    {refunded ? "Refunded" : "Completed"}
                </Tag>
            ),
        },

        {
            title: "Products",
            dataIndex: "totalProducts",
        },

        {
            title: "Amount",

            render: (_, data) => `QAR ${data.totalAmount}`,
        },

        {
            title: "Date",

            dataIndex: "purchaseDate",

            render: (date) => new Date(date).toLocaleDateString(),
        },
    ];

    return (
        <Card className="dashboard-card">
            <h3>Recent Transactions</h3>

            {recentTransactionListLoader ? (
                <Skeleton active />
            ) : (
                <Table
                    columns={columns}
                    dataSource={recentTransactionList}
                    rowKey="_id"
                    locale={{
                        emptyText: "No transactions found",
                    }}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total: recentTransactionListCount,
                        showSizeChanger: true,
                        onChange: (currentPage, pageSize) => {
                            setPage(currentPage);

                            setLimit(pageSize);
                        },
                    }}
                />
            )}
        </Card>
    );
};

export default RecentTransactions;
