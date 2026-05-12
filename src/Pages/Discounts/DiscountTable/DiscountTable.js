import {
    EditOutlined,
    ExclamationCircleOutlined,
    PercentageOutlined,
    PlusOutlined,
    StopOutlined,
} from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import AddDiscount from "../AddDiscount/AddDiscount";
import "./DiscountTable.css";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllDiscountApi,
    updateDiscountApi,
} from "../../../Services/slices/discount.slice";
import { getAllBrand } from "../../../Services/slices/model.slice";

const formatDiscountTypeLabel = (discountType) => {
    if (discountType === "fixed_amount") return "Fixed Amount";
    if (discountType === "percentage") return "Percentage";
    return discountType ? String(discountType).replace(/_/g, " ") : "—";
};

const formatDiscountAmount = (record) => {
    if (record.discountType === "fixed_amount") {
        return `QAR ${record.discountValue}`;
    }
    if (record.discountType === "percentage") {
        return `${record.discountValue}%`;
    }
    return record.discountValue != null ? String(record.discountValue) : "—";
};

const getRowStatus = (record) => {
    const expiredByDate =
        record.expiryDate &&
        dayjs(record.expiryDate).endOf("day").isBefore(dayjs());
    if (expiredByDate) return "Expired";
    if (record.isActive === false) return "Inactive";
    return "Active";
};

const DiscountTable = () => {
    const { discounts, getAllDiscountLoading } = useSelector(
        (state) => state.discount,
    );
    const { brands: brandCatalog } = useSelector((state) => state.model);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const dispatch = useDispatch();

    useEffect(() => {
        if (brandCatalog?.length === 0) {
            dispatch(getAllBrand({ limit: "all" }));
        }
    }, [dispatch, brandCatalog?.length]);

    useEffect(() => {
        if (discounts.length === 0) {
        dispatch(getAllDiscountApi({ page, limit }));
        }
    }, [dispatch, page, limit]);

    const [open, setOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);

    const dataSource = useMemo(
        () => (Array.isArray(discounts) ? discounts : []),
        [discounts],
    );

    const handleOpenNew = () => {
        setEditingDiscount(null);
        setOpen(true);
    };

    const handleOpenEdit = (record) => {
        setEditingDiscount(record);
        setOpen(true);
    };

    const handleExpire = (record) => {
        dispatch(
            updateDiscountApi({
                ...record,
                isActive: false,
            }),
        );
    };

    const columns = [
        {
            title: "COUPON",
            dataIndex: "name",
            key: "name",
            width: 240,
            render: (name, record) => {
                const status = getRowStatus(record);
                return (
                    <div className="discount-coupon-cell">
                        <div className="discount-coupon-icon">
                            <PercentageOutlined />
                        </div>

                        <div>
                            <div
                                className={`discount-code ${
                                    status === "Expired" ? "muted" : ""
                                }`}
                            >
                                {name}
                            </div>
                            <div className="discount-subtitle">
                                {formatDiscountTypeLabel(record.discountType)}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "DISCOUNT",
            key: "discountValue",
            width: 120,
            render: (_, record) => {
                const status = getRowStatus(record);
                return (
                    <span
                        className={`discount-value ${
                            status === "Expired" ? "muted" : ""
                        }`}
                    >
                        {formatDiscountAmount(record)}
                    </span>
                );
            },
        },
        {
            title: "APPLICABLE TO",
            dataIndex: "applicableBrands",
            key: "applicableBrands",
            responsive: ["md"],
            render: (applicableBrands) => {
                const list = applicableBrands || [];
                const totalBrands = Array.isArray(brandCatalog)
                    ? brandCatalog.length
                    : 0;
                const coversAllBrands =
                    totalBrands > 0 && list.length === totalBrands;

                if (coversAllBrands) {
                    return (
                        <span className="discount-tag">
                            All Eligible Product
                        </span>
                    );
                }

                return (
                    <Space wrap size={[6, 6]}>
                        {list.map((item) => (
                            <span
                                className="discount-tag"
                                key={item._id || item.brand}
                            >
                                {item.brand}
                            </span>
                        ))}
                    </Space>
                );
            },
        },
        {
            title: "EXPIRY",
            key: "expiryDate",
            responsive: ["sm"],
            render: (_, record) => {
                const status = getRowStatus(record);
                const label = record.expiryDate
                    ? dayjs(record.expiryDate).format("DD MMM YYYY")
                    : "—";
                return (
                    <span
                        className={`discount-expiry ${
                            status === "Expired" ? "expired" : ""
                        }`}
                    >
                        {label}
                        {status === "Expired" && <ExclamationCircleOutlined />}
                    </span>
                );
            },
        },
        {
            title: "USED / LIMIT",
            key: "usage",
            width: 130,
            render: (_, record) => {
                const used =
                    record.timesUsed ?? record.usedCount ?? record.used ?? 0;
                const limit = record.usageLimit ?? "—";
                return (
                    <span className="discount-usage">
                        {used}
                        <span> / {limit}</span>
                    </span>
                );
            },
        },
        {
            title: "STATUS",
            key: "status",
            width: 110,
            render: (_, record) => {
                const status = getRowStatus(record);
                const activeClass = status === "Active" ? "active" : "expired";
                return (
                    <span className={`discount-status ${activeClass}`}>
                        {status}
                    </span>
                );
            },
        },
        {
            title: "ACTIONS",
            key: "actions",
            width: 150,
            render: (_, record) => {
                const status = getRowStatus(record);
                return (
                    <div className="discount-actions">
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleOpenEdit(record)}
                        >
                            {status === "Expired" ? "Renew" : "Edit"}
                        </Button>

                        {status !== "Expired" && record.isActive !== false && (
                            <Button
                                danger
                                size="small"
                                icon={<StopOutlined />}
                                onClick={() => handleExpire(record)}
                            >
                                Deactivate
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    const hasMorePages = dataSource.length === limit;
    const paginationTotal = hasMorePages
        ? page * limit + 1
        : (page - 1) * limit + dataSource.length;

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
                rowKey="_id"
                loading={getAllDiscountLoading}
                pagination={{
                    responsive: true,
                    current: page,
                    pageSize: limit,
                    total: paginationTotal,
                    showSizeChanger: true,
                    onChange: (nextPage, nextLimit) => {
                        setPage(nextPage);
                        setLimit(nextLimit);
                    },
                }}
                scroll={{ x: "max-content" }}
            />

            <AddDiscount
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditingDiscount(null);
                }}
                editingDiscount={editingDiscount}
            />
        </div>
    );
};

export default DiscountTable;
