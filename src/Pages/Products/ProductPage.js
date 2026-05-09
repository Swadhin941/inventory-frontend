import React, { useEffect, useState } from "react";
import ProductTable from "./ProductTable/ProductTable";
import ProductForm from "./ProductForm/ProductForm";
import { Drawer, Button } from "antd";
import "./ProductPage.css";
import ProductStats from "./ProductStats/ProductStats";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrandApi } from "../../Services/slices/brand.slice";
import { getAllProductsApi } from "../../Services/slices/product.slice";

const ProductPage = () => {
    const { brands } = useSelector((state) => state.model);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All Products");
    const [selectedBrandId, setSelectedBrandId] = useState("");
    const brandPage = 1;
    const brandLimit = 5;
    const [filter, setFilter] = useState([]);

    useEffect(() => {
        if (brands.length > 0) {
            const brandFilters = brands.map((brand) => ({
                name: brand.brand,
                icon: "📱",
                brandId: brand._id,
            }));
            setFilter([
                { name: "All Products", icon: "🟢", brandId: "" },
                ...brandFilters,
            ]);
        }
    }, [brands]);
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

    const handleProductFilter = (brandId, filterName) => {
        setActiveFilter(filterName);
        setSelectedBrandId(brandId);
        dispatch(getAllProductsApi({ page: 1, limit: 10, search: brandId }));
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
                {filter.map((item) => (
                    <button
                        key={item.name}
                        className={`filter-btn ${
                            activeFilter === item.name ? "active" : ""
                        }`}
                        onClick={() => {
                            handleProductFilter(item.brandId, item.name);
                        }}
                    >
                        <span className="icon">{item.icon}</span>
                        {item.name}
                    </button>
                ))}
            </div>

            {/* Table */}
            <ProductTable onEdit={handleEdit} search={selectedBrandId} />

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
