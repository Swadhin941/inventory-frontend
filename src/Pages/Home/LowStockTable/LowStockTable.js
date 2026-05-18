import React, { useEffect, useState } from "react";

import { Card, Table, Tag } from "antd";

import { useDispatch, useSelector } from "react-redux";

import { getLowStockProductListApiService } from "../../../Services/slices/dashboard.slice";

const LowStockTable = ({ data, dateRange }) => {
    const {
        totalLowStockProductCount,
        lowStockProductList,
        isLowStockProductListLoader,
    } = useSelector((state) => state.dashboard);

    const dispatch = useDispatch();

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);

    useEffect(() => {
        if (dateRange) {
            dispatch(
                getLowStockProductListApiService({
                    startDate: dateRange[0].format("YYYY-MM-DD"),

                    endDate: dateRange[1].format("YYYY-MM-DD"),

                    page: page,

                    limit: limit,
                }),
            );
        }
    }, [dispatch, page, limit, dateRange]);

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
                dataSource={lowStockProductList}
                loading={isLowStockProductListLoader}
                rowKey="_id"
                locale={{
                    emptyText: "No low stock products found",
                }}
                pagination={{
                    current: page,

                    pageSize: limit,

                    total: totalLowStockProductCount,

                    showSizeChanger: true,

                    onChange: (currentPage, pageSize) => {
                        setPage(currentPage);

                        setLimit(pageSize);
                    },
                }}
            />
        </Card>
    );
};

export default LowStockTable;
