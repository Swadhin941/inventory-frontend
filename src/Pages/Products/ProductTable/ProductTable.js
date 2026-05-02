import { Switch, Table } from "antd";
import "./ProductTable.css";
import EditButton from "../../../Components/Buttons/EditButton";

const ProductTable = ({ onEdit, activeFilter }) => {
    const data = [
        {
            _id: "1",
            name: "Samsung Galaxy A55 5G",
            variant: "128GB / Midnight Blue",
            sku: "SM-A556E",
            model: "Model 2024",
            brand: "Samsung",
            cost: 620,
            price: 895,
            stock: 42,
            discount: true,
        },
        {
            _id: "2",
            name: "iPhone 15 Pro 256GB",
            variant: "Natural Titanium",
            sku: "MTU33LL/A",
            model: "A17 Pro Chip",
            brand: "Apple",
            cost: 3800,
            price: 4620,
            stock: 6,
            discount: false,
        },
    ];

    const filteredData = data.filter((item) => {
        if (activeFilter === "All Products") return true;
        return item.brand === activeFilter;
    });

    const columns = [
        {
            title: "PRODUCT",
            width: 260,
            render: (_, record) => (
                <div className="product-cell">
                    <div className="product-img">📱</div>

                    <div>
                        <div className="product-name">{record.name}</div>
                        <div className="product-subtitle">
                            {record.variant}
                        </div>
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
            render: (brand) => <span className="brand-tag">{brand}</span>,
        },

        {
            title: "COST PRICE",
            dataIndex: "cost",
            responsive: ["lg"],
            render: (cost) => <span className="price">QAR {cost}</span>,
        },

        {
            title: "SELL PRICE",
            dataIndex: "price",
            width: 110,
            render: (price) => <span className="price bold">QAR {price}</span>,
        },

        {
            title: "MARGIN",
            responsive: ["lg"],
            render: (_, record) => {
                const margin = ((record.price - record.cost) / record.cost) * 100;
                return (
                    <span className="margin-positive">
                        +{margin.toFixed(1)}%
                    </span>
                );
            },
        },

        {
            title: "STOCK",
            width: 100,
            render: (_, record) => {
                let className = "stock-badge";

                if (record.stock > 20) className += " stock-high";
                else if (record.stock > 0) className += " stock-low";
                else className += " stock-out";

                return (
                    <span className={className}>{record.stock} units</span>
                );
            },
        },

        {
            title: "DISCOUNT OK",
            responsive: ["md"],
            render: (_, record) => <Switch defaultChecked={record.discount} />,
        },

        {
            title: "ACTIONS",
            width: 90,
            render: (_, record) => <EditButton onClick={() => onEdit(record)} />,
        },
    ];

    return (
        <Table
            className="product-table"
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            pagination={{ responsive: true }}
            scroll={{ x: "max-content" }}
        />
    );
};

export default ProductTable;
