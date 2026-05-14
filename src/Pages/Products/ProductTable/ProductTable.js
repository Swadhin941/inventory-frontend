import { Skeleton, Switch, Table } from "antd";
import "./ProductTable.css";
import EditButton from "../../../Components/Buttons/EditButton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    getAllProductsApi,
    updateProductApi,
} from "../../../Services/slices/product.slice";
import { getAllBrand } from "../../../Services/slices/model.slice";
import { formatMoney } from "../../../Utils/businessSettings";

const ProductTable = ({ onEdit, search }) => {
    const dispatch = useDispatch();
    const { products, getAllProductsLoading, totalProducts } = useSelector(
        (state) => state.product,
    );
    const { brands } = useSelector((state) => state.model);
    const { businessInfo } = useSelector((state) => state.business);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        setPage(1);
        setLimit(10);
    }, [search]);

    useEffect(() => {
        dispatch(getAllProductsApi({ page, limit, search }));
        dispatch(getAllBrand({ limit: "all" }));
    }, [dispatch, page, limit, search]);

    useEffect(() => {
        console.log(products, "product list check", getAllProductsLoading);
    }, [products, getAllProductsLoading]);

    const handleDiscountToggle = (event, record) => {
        console.log(event, "discount toggle value", record);
        const payload = {
            ...record,
            hasDiscount: event,
        };
        dispatch(updateProductApi(payload));
    };

    const handleTableChange = (pagination) => {
        setPage(pagination.current);
        setLimit(pagination.pageSize);
    };

    const columns = [
        {
            title: "PRODUCT",
            width: 260,
            render: (_, record) => (
                <div className="product-cell">
                    <div className="product-img">📱</div>

                    <div>
                        <div className="product-name">{record.name}</div>
                        {/* <div className="product-subtitle">
                            {record.variant}
                        </div> */}
                    </div>
                </div>
            ),
        },

        {
            title: "SKU / MODEL",
            responsive: ["md"],
            render: (_, record) => (
                <div>
                    <div>{record.sku}</div>
                    <div className="product-subtitle">{record.model}</div>
                </div>
            ),
        },

        {
            title: "BRAND",
            dataIndex: "brand",
            responsive: ["sm"],
            render: (brand) => (
                <span className="brand-tag">
                    {brands.find((b) => b._id === brand)?.brand}
                </span>
            ),
        },

        {
            title: "COST PRICE",
            dataIndex: "cost",
            responsive: ["lg"],
            render: (_, record) => (
                <span className="price">
                    {formatMoney(record.purchasePrice, businessInfo)}
                </span>
            ),
        },

        {
            title: "SELL PRICE",
            dataIndex: "price",
            width: 110,
            render: (_, record) => (
                <span className="price bold">
                    {formatMoney(record.finalPrice, businessInfo)}
                </span>
            ),
        },

        {
            title: "MARGIN",
            responsive: ["lg"],
            render: (_, record) => {
                return (
                    <span className="margin-positive">
                        {record.marginPercentage > 0 ? "+" : "-"}
                        {record.marginPercentage}%
                    </span>
                );
            },
        },

        {
            title: "STOCK",
            width: 100,
            render: (_, record) => {
                let className = "stock-badge";

                if (record.stock > record.lowStockThreshold)
                    className += " stock-high";
                else if (record.stock < record.lowStockThreshold)
                    className += " stock-low";
                else className += " stock-out";

                return <span className={className}>{record.stock} units</span>;
            },
        },

        {
            title: "DISCOUNT OK",
            responsive: ["md"],
            render: (_, record) => (
                <Switch
                    defaultChecked={record.hasDiscount}
                    onChange={(checked) =>
                        handleDiscountToggle(checked, record)
                    }
                />
            ),
        },

        {
            title: "ACTIONS",
            width: 90,
            render: (_, record) => (
                <EditButton onClick={() => onEdit(record)} />
            ),
        },
    ];

    return getAllProductsLoading ? (
        <Skeleton active />
    ) : (
        <Table
            className="product-table"
            columns={columns}
            dataSource={products}
            rowKey="_id"
            pagination={{
                current: page,
                pageSize: limit,
                total: totalProducts,
                responsive: true,
            }}
            scroll={{ x: "max-content" }}
            onChange={handleTableChange}
        />
    );
};

export default ProductTable;
