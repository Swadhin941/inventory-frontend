import {
    EditOutlined,
    ExclamationCircleOutlined,
    PercentageOutlined,
    PlusOutlined,
    StopOutlined,
} from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import AddDiscount from "../AddDiscount/AddDiscount";
import "./DiscountTable.css";

const DiscountTable = () => {
    const initialData = [
        {
            key: "1",
            coupon: "WINTER10",
            discount: "10%",
            type: "Percentage",
            value: 10,
            applicable: ["Samsung", "Xiaomi"],
            expiry: "31 Mar 2026",
            expiryDate: "2026-03-31",
            used: 24,
            limit: 50,
            status: "Active",
        },
        {
            key: "2",
            coupon: "EID50",
            discount: "QAR 50",
            type: "Fixed Amount",
            value: 50,
            applicable: ["All Eligible Products"],
            expiry: "15 Apr 2026",
            expiryDate: "2026-04-15",
            used: 8,
            limit: 100,
            status: "Active",
        },
        {
            key: "3",
            coupon: "SUMMER25",
            discount: "25%",
            type: "Percentage",
            value: 25,
            applicable: ["Accessories"],
            expiry: "28 Feb 2026",
            expiryDate: "2026-02-28",
            used: 67,
            limit: 100,
            status: "Expired",
        },
    ];
    const [discounts, setDiscounts] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);

    const handleOpenNew = () => {
        setEditingDiscount(null);
        setOpen(true);
    };

    const handleOpenEdit = (record) => {
        setEditingDiscount(record);
        setOpen(true);
    };

    const handleExpire = (record) => {
        setDiscounts((prev) =>
            prev.map((item) =>
                item.key === record.key ? { ...item, status: "Expired" } : item,
            ),
        );
    };

    const handleSaveDiscount = (values) => {
        const normalizedStatus = dayjs(values.expiry).isBefore(dayjs(), "day")
            ? "Expired"
            : values.status;
        const payload = {
            coupon: values.coupon,
            type: values.type,
            value: Number(values.value),
            discount:
                values.type === "Fixed Amount"
                    ? `QAR ${values.value}`
                    : `${values.value}%`,
            applicable: values.applicable,
            expiry: values.expiry.format("DD MMM YYYY"),
            expiryDate: values.expiry.format("YYYY-MM-DD"),
            limit: Number(values.limit),
            status: normalizedStatus,
        };

        if (editingDiscount) {
            setDiscounts((prev) =>
                prev.map((item) =>
                    item.key === editingDiscount.key
                        ? { ...item, ...payload, used: item.used }
                        : item,
                ),
            );
        } else {
            setDiscounts((prev) => [
                ...prev,
                {
                    key: String(Date.now()),
                    used: 0,
                    ...payload,
                },
            ]);
        }

        setEditingDiscount(null);
        setOpen(false);
    };

    const dataSource = useMemo(() => discounts, [discounts]);

    const columns = [
        {
            title: "COUPON",
            dataIndex: "coupon",
            key: "coupon",
            width: 240,
            render: (coupon, record) => (
                <div className="discount-coupon-cell">
                    <div className="discount-coupon-icon">
                        <PercentageOutlined />
                    </div>

                    <div>
                        <div
                            className={`discount-code ${
                                record.status === "Expired" ? "muted" : ""
                            }`}
                        >
                            {coupon}
                        </div>
                        <div className="discount-subtitle">{record.type}</div>
                    </div>
                </div>
            ),
        },
        {
            title: "DISCOUNT",
            dataIndex: "discount",
            key: "discount",
            width: 120,
            render: (discount, record) => (
                <span
                    className={`discount-value ${
                        record.status === "Expired" ? "muted" : ""
                    }`}
                >
                    {discount}
                </span>
            ),
        },
        {
            title: "APPLICABLE TO",
            dataIndex: "applicable",
            key: "applicable",
            responsive: ["md"],
            render: (items) => (
                <Space wrap size={[6, 6]}>
                    {items.map((item) => (
                        <span className="discount-tag" key={item}>
                            {item}
                        </span>
                    ))}
                </Space>
            ),
        },
        {
            title: "EXPIRY",
            dataIndex: "expiry",
            key: "expiry",
            responsive: ["sm"],
            render: (expiry, record) => (
                <span
                    className={`discount-expiry ${
                        record.status === "Expired" ? "expired" : ""
                    }`}
                >
                    {expiry}
                    {record.status === "Expired" && (
                        <ExclamationCircleOutlined />
                    )}
                </span>
            ),
        },
        {
            title: "USED / LIMIT",
            key: "used",
            width: 130,
            render: (_, record) => (
                <span className="discount-usage">
                    {record.used}
                    <span> / {record.limit}</span>
                </span>
            ),
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            width: 110,
            render: (status) => (
                <span
                    className={
                        status === "Active"
                            ? "discount-status active"
                            : "discount-status expired"
                    }
                >
                    {status}
                </span>
            ),
        },
        {
            title: "ACTIONS",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <div className="discount-actions">
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenEdit(record)}
                    >
                        {record.status === "Expired" ? "Renew" : "Edit"}
                    </Button>

                    {record.status !== "Expired" && (
                        <Button
                            danger
                            size="small"
                            icon={<StopOutlined />}
                            onClick={() => handleExpire(record)}
                        >
                            Expire
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="discount-table-container">
            <div className="discount-table-header">
                <div className="discount-title-group">
                    <div className="discount-page-icon">
                        <PercentageOutlined />
                    </div>
                    <div>
                        <h3>Discounts</h3>
                        <p>Manage coupon codes and active campaigns.</p>
                    </div>
                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleOpenNew}
                >
                    New Coupon
                </Button>
            </div>

            <Table
                className="discount-table"
                columns={columns}
                dataSource={dataSource}
                rowKey="key"
                pagination={{ responsive: true }}
                scroll={{ x: "max-content" }}
            />

            <AddDiscount
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditingDiscount(null);
                }}
                onSave={handleSaveDiscount}
                editingDiscount={editingDiscount}
            />
        </div>
    );
};

export default DiscountTable;
