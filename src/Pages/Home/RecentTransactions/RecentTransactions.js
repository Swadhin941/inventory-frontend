import React from "react";

import { Card, Table } from "antd";

const RecentTransactions = ({ data }) => {
    const columns = [
        {
            title: "Transaction",
            dataIndex: "trxId",
        },

        {
            title: "Customer",
            dataIndex: "customer",
        },

        {
            title: "Amount",
            dataIndex: "amount",
            render: (amount) => `QAR ${amount}`,
        },
    ];

    return (
        <Card className="dashboard-card">
            <h3>Recent Transactions</h3>

            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="_id"
            />
        </Card>
    );
};

export default RecentTransactions;
