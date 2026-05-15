import React from "react";
import { Card, Table, Tag } from "antd";

const LowStockTable = ({ data }) => {
    const columns = [
        {
            title: "Product",
            dataIndex: "name",
        },

        {
            title: "Stock",
            dataIndex: "stock",
            render: (stock) => <Tag color="red">{stock} Left</Tag>,
        },
    ];

    return (
        <Card className="dashboard-card">
            <h3>Low Stock Products</h3>

            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="_id"
            />
        </Card>
    );
};

export default LowStockTable;
