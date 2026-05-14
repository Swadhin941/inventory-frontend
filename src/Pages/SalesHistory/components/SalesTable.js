import React, { useEffect, useMemo, useState } from "react";
import { Input, Skeleton, Table, Tag } from "antd";
import {
    CreditCardOutlined,
    DollarOutlined,
    RollbackOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesApi } from "../../../Services/slices/sales.slice";
import "./SalesTable.css";
import { formatMoney } from "../../../Utils/businessSettings";

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const getStatusKey = (sale) => {
    if (sale.refunded) return "refunded";
    return String(sale.status || "received").toLowerCase();
};

const SalesTable = () => {
    const { sales, totalCount, isSalesLoading } = useSelector(
        (state) => state.sales,
    );
    const { businessInfo } = useSelector((state) => state.business);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchSalesApi({ page, limit, search }));
    }, [dispatch, page, limit, search]);

    const tableData = useMemo(
        () =>
            sales.map((sale) => ({
                key: sale._id,
                id: sale._id,
                trxId: sale.TrxID,
                customer: sale.customer,
                customerPhone: sale.customerPhone,
                customerEmail: sale.customerEmail,
                paymentMethod: sale.paymentMethod,
                cardInfo: sale.cardInfo,
                totalAmount: sale.totalAmount,
                subtotal: sale.subtotal,
                vat: sale.vat,
                totalProducts: sale.totalProducts,
                totalQuantity: sale.totalQuantity,
                couponCode: sale.couponCode,
                refunded: sale.refunded,
                purchaseDate: sale.purchaseDate,
                status: sale.status,
                statusKey: getStatusKey(sale),
            })),
        [sales],
    );

    const filteredData = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return tableData.filter((item) => {
            const matchesFilter =
                activeFilter === "all"
                    ? true
                    : activeFilter === "refund"
                      ? item.refunded || item.statusKey === "refunded"
                      : item.paymentMethod === activeFilter;

            const matchesSearch =
                !normalizedSearch ||
                [
                    item.trxId,
                    item.customer,
                    item.customerPhone,
                    item.customerEmail,
                    item.paymentMethod,
                    item.status,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value).toLowerCase().includes(normalizedSearch),
                    );

            return matchesFilter && matchesSearch;
        });
    }, [activeFilter, search, tableData]);

    const columns = [
        {
            title: "Transaction",
            dataIndex: "trxId",
            render: (trxId, record) => (
                <div className="sales-trx-cell">
                    <span className="sales-trx-id">{trxId || record.id}</span>
                    <span className="sales-trx-subtitle">
                        {formatDate(record.purchaseDate)}
                    </span>
                </div>
            ),
        },
        {
            title: "Customer",
            dataIndex: "customer",
            render: (customer, record) => (
                <div className="sales-customer-cell">
                    <span className="sales-customer-name">
                        {customer || "Walk-in Customer"}
                    </span>
                    <span className="sales-trx-subtitle">
                        {record.customerPhone || "-"}
                    </span>
                    {record.customerEmail && (
                        <span className="sales-trx-subtitle">
                            {record.customerEmail}
                        </span>
                    )}
                </div>
            ),
        },
        {
            title: "Payment",
            dataIndex: "paymentMethod",
            render: (method, record) => (
                <div className="sales-payment-cell">
                    <Tag className={`sales-method-tag ${method}`}>
                        {method === "card" ? "Card" : "Cash"}
                    </Tag>
                    <span className="sales-trx-subtitle">
                        {record.cardInfo || "-"}
                    </span>
                </div>
            ),
        },
        {
            title: "Items",
            dataIndex: "totalProducts",
            render: (totalProducts, record) => (
                <div className="sales-items-cell">
                    <span>{totalProducts || 0} products</span>
                    <span className="sales-trx-subtitle">
                        {record.totalQuantity || 0} qty
                    </span>
                </div>
            ),
        },
        {
            title: "Amount",
            dataIndex: "totalAmount",
            align: "right",
            render: (amount, record) => (
                <div className="sales-amount-cell">
                    <span>{formatMoney(amount, businessInfo)}</span>
                    <span className="sales-trx-subtitle">
                        VAT {formatMoney(record.vat, businessInfo)}
                    </span>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "statusKey",
            render: (statusKey, record) => (
                <Tag className={`sales-status ${statusKey}`}>
                    {record.refunded ? "Refunded" : record.status || "Received"}
                </Tag>
            ),
        },
    ];

    return (
        <div className="sales-table-container">
            <div className="sales-table-header">
                <div className="sales-title-group">
                    <div className="sales-page-icon">
                        <ShoppingCartOutlined />
                    </div>
                    <div>
                        <h3>Sales History</h3>
                        <p>Review completed payments, customer details, and totals.</p>
                    </div>
                </div>

                <Input
                    allowClear
                    className="sales-search-input"
                    placeholder="Search transaction or customer"
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(event) => {
                        setPage(1);
                        setSearch(event.target.value);
                    }}
                />
            </div>

            <div className="sales-filter-section">
                <button
                    className={`sales-filter-btn ${
                        activeFilter === "all" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("all")}
                    type="button"
                >
                    All Payments
                </button>
                <button
                    className={`sales-filter-btn ${
                        activeFilter === "cash" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("cash")}
                    type="button"
                >
                    <DollarOutlined /> Cash
                </button>
                <button
                    className={`sales-filter-btn ${
                        activeFilter === "card" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("card")}
                    type="button"
                >
                    <CreditCardOutlined /> Card
                </button>
                <button
                    className={`sales-filter-btn ${
                        activeFilter === "refund" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("refund")}
                    type="button"
                >
                    <RollbackOutlined /> Refunds
                </button>
            </div>

            {isSalesLoading ? (
                <div className="sales-table-skeleton">
                    <Skeleton active paragraph={{ rows: 8 }} />
                </div>
            ) : (
                <Table
                    className="sales-table"
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total: totalCount || filteredData.length,
                        showSizeChanger: true,
                        onChange: (nextPage, nextLimit) => {
                            setPage(nextPage);
                            setLimit(nextLimit);
                        },
                    }}
                    scroll={{ x: "max-content" }}
                />
            )}
        </div>
    );
};

export default SalesTable;
