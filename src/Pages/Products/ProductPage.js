import React, { useEffect, useState } from "react";
import ProductTable from "./ProductTable/ProductTable";
import ProductForm from "./ProductForm/ProductForm";
import { Drawer, Button } from "antd";
import "./ProductPage.css";
import ProductStats from "./ProductStats/ProductStats";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrandApi } from "../../Services/slices/brand.slice";

const ProductPage = () => {
    const { brands, isBrandLoading } = useSelector((state) => state.brand);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All Products");
    const [brandPage, setBrandPage] = useState(1);
    const [brandLimit, setBrandLimit] = useState(5);

    useEffect(() => {
        console.log(brands, "brand list check");
    }, [brands]);
    const filters = [
        { name: "All Products", icon: "🟢" },
        { name: "Samsung", icon: "📱" },
        { name: "Apple", icon: "🍎" },
        { name: "Google", icon: "📱" },
        { name: "Xiaomi", icon: "📱" },
        { name: "Accessories", icon: "🎧" },
    ];
    // ✅ FIX ADDED
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleOpenAddProductDrawer = () => {
        setSelectedProduct(null); // reset for add
        setOpen(true);
        dispatch(getAllBrandApi({ page: brandPage, limit: brandLimit }));
    };

    return (
        <div className="product-page">
            {/* Add Button */}
            <div className="product-page-actions">
                <Button
                    className="add-product-btn"
                    type="primary"
                    onClick={() => handleOpenAddProductDrawer()}
                >
                    + Add Product
                </Button>
            </div>

            <ProductStats />

            <div className="filter-bar">
                {filters.map((item) => (
                    <button
                        key={item.name}
                        className={`filter-btn ${
                            activeFilter === item.name ? "active" : ""
                        }`}
                        onClick={() => setActiveFilter(item.name)}
                    >
                        <span className="icon">{item.icon}</span>
                        {item.name}
                    </button>
                ))}
            </div>

            {/* Table */}
            <ProductTable onEdit={handleEdit} activeFilter={activeFilter} />

            {/* Drawer */}
            <Drawer
                title={selectedProduct ? "Edit Product" : "Add New Product"}
                open={open}
                onClose={() => setOpen(false)}
                width="80%"
                placement="right"
                rootClassName="product-drawer"
                bodyStyle={{ padding: "16px", background: "#f5f5f5" }}
            >
                <ProductForm
                    product={selectedProduct}
                    onClose={() => setOpen(false)}
                />
            </Drawer>
        </div>
    );
};

export default ProductPage;
