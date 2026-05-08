import {
    Form,
    Input,
    Row,
    Col,
    Select,
    Modal,
    message,
    Switch,
    Skeleton,
} from "antd";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./ProductForm.css";
import BrandDrawer from "../../../Components/BrandDrawer/BrandDrawer";
import ModelDrawer from "../../../Components/ModelDrawer/ModelDrawer";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrandApi } from "../../../Services/slices/brand.slice";
import { getAllBrand } from "../../../Services/slices/model.slice";
import {
    addProductApi,
    updateProductApi,
} from "../../../Services/slices/product.slice";
import Spinner from "../../../Components/Spinner/Spinner";

const descriptionEditorModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

const descriptionEditorFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
];

const ProductForm = ({ product, onClose }) => {
    const [form] = Form.useForm();
    const { brands, isBrandLoading, totalBrandCount } = useSelector(
        (state) => state.brand,
    );
    const modelSelector = useSelector((state) => state.model);
    const { products, updateProductLoading } = useSelector(
        (state) => state.product,
    );
    const dispatch = useDispatch();
    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                _id: product._id,
                name: product.name,
                brand: product.brand,
                sku: product.sku,
                model: product.model,
                description: product.description,
                cost: product.purchasePrice,
                price: product.sellingPrice,
                discount: product.hasDiscount,
                discountType:
                    product.discountType === "fixed_amount"
                        ? "fixed"
                        : product.discountType,
                discountValue: product.discountValue,

                hasWarranty: product.hasWarranty,
                warranty: product.warrantyPeriod,
                quantity: product.stock,
                low_stock: product.lowStockThreshold,

                // Calculated
                margin: `${product.marginPercentage}%`,
                profit: Math.round(product.finalPrice - product.purchasePrice),
            });
        } else {
            form.resetFields();
        }
    }, [form, product]);

    const selectedBrand = Form.useWatch("brand", form);

    const [scanOpen, setScanOpen] = useState(false);
    const [loadingScan, setLoadingScan] = useState(false);

    const [brandDrawerOpen, setBrandDrawerOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);

    // const [models, setModels] = useState([]);
    const [modelDrawerOpen, setModelDrawerOpen] = useState(false);
    const [editingModel, setEditingModel] = useState(null);

    // Brand page and limit
    const [brandPage, setBrandPage] = useState(1);
    const [brandLimit, setBrandLimit] = useState(5);

    // ✅ Model state (linked to brand)
    const [models, setModels] = useState([]);
    // [{ name: "iPhone 14", brand: "Apple" }]

    // Handle pagination of brand
    const handleBrandNextPage = () => {
        setBrandPage((prev) => prev + 1);
        dispatch(getAllBrandApi({ page: brandPage + 1, limit: brandLimit }));
    };

    const handleBrandPrevPage = () => {
        setBrandPage((prev) => prev - 1);
        dispatch(getAllBrandApi({ page: brandPage - 1, limit: brandLimit }));
    };

    const handleValuesChange = (_, values) => {
        const cost = parseFloat(values.cost);
        let price = parseFloat(values.price);

        const discountEnabled = values.discount;
        const discountType = values.discountType;
        const discountValue = parseFloat(values.discountValue);

        if (!cost || !price) return;

        // ✅ Apply discount if enabled
        if (discountEnabled && discountValue) {
            if (discountType === "percentage") {
                price = price - (price * discountValue) / 100;
            } else if (discountType === "fixed") {
                price = price - discountValue;
            }
        }

        const profit = price - cost;
        const margin = ((profit / cost) * 100).toFixed(1);

        form.setFieldsValue({
            margin: `${profit >= 0 ? "+" : ""}${margin}%`,
            profit: Math.round(profit),
        });
    };

    // ✅ Submit
    const onFinish = (values) => {
        console.log("Product:", values);
        const payload = {
            name: values.name,
            sku: values.sku,
            brand: values.brand,
            model: values.model,
            description: values.description,
            purchasePrice: parseInt(values.cost),
            sellingPrice: parseInt(values.price),
            hasDiscount: values.discount,
            discountType:
                values.discountType === "fixed"
                    ? "fixed_amount"
                    : values.discountType,
            discountValue: parseInt(values.discountValue),
            hasWarranty: values.hasWarranty,
            warrantyPeriod: parseInt(values.warranty),
            stock: parseInt(values.quantity),
            lowStockThreshold: parseInt(values.low_stock),
        };
        console.log("Payload to submit:", payload);
        if (!product) {
            dispatch(addProductApi(payload));
        } else {
            dispatch(updateProductApi(payload));
        }
        onClose();
    };

    // ✅ Load edit data
    useEffect(() => {
        if (product) {
            form.setFieldsValue(product);
        } else {
            form.resetFields();
        }
    }, [product, form]);

    // ✅ Add brand
    const openBrandDrawer = () => {
        setEditingBrand(null); // important
        setBrandDrawerOpen(true);
    };

    const handleAddBrand = (brand) => {
        const exists = brands.some(
            (b) => b.toLowerCase() === brand.toLowerCase(),
        );

        if (!exists) {
            // setBrands((prev) => [...prev, brand]);

            // ✅ auto select brand
            form.setFieldsValue({ brand });

            // ✅ close brand drawer
            setBrandDrawerOpen(false);

            // ✅ open model drawer automatically
            setTimeout(() => {
                setModelDrawerOpen(true);
            }, 300);
        } else {
            message.warning("Brand already exists ⚠️");
        }
    };
    // ✅ Edit brand
    const handleEditBrand = (brand) => {
        setEditingBrand(brand);
        setBrandDrawerOpen(true);
    };

    const handleUpdateBrand = (updatedBrand) => {
        const clean = updatedBrand.trim();

        // setBrands((prev) => prev.map((b) => (b === editingBrand ? clean : b)));

        form.setFieldsValue({ brand: clean });
        setEditingBrand(null);
    };

    const handleAddModel = (modelName, brand) => {
        const exists = models.some(
            (m) =>
                m.name.toLowerCase() === modelName.toLowerCase() &&
                m.brand === brand,
        );

        if (!exists) {
            setModels((prev) => [...prev, { name: modelName, brand }]);

            form.setFieldsValue({
                model: modelName,
                brand: brand,
            });
        } else {
            message.warning("Model exists ⚠️");
        }
    };

    const handleUpdateModel = (updated, brand) => {
        const clean = updated.trim();

        setModels((prev) =>
            prev.map((m) =>
                m.name === editingModel ? { ...m, name: clean, brand } : m,
            ),
        );
        form.setFieldsValue({
            model: clean,
            brand: brand,
        });

        setEditingModel(null);
    };

    const validateNumber = (value) => {
        return value.replace(/[^0-9.]/g, "");
    };

    return (
        <>
            {/* Header */}
            <div className="form-header">
                <h2>{product ? "Edit Product" : "Add New Product"}</h2>

                <div className="form-actions">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>

                    <button className="btn-save" onClick={() => form.submit()} disabled={updateProductLoading}>
                        Save Product {updateProductLoading && <Spinner />}
                    </button>
                </div>
            </div>

            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                onValuesChange={handleValuesChange}
                requiredMark={false}
            >
                <Row gutter={16}>
                    {/* LEFT */}
                    <Col span={16}>
                        <div className="form-card">
                            <h3>Product Information</h3>

                            <Form.Item
                                name="name"
                                label={
                                    <span>
                                        Product Name{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </span>
                                }
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="sku"
                                label={
                                    <span>
                                        SKU / Serial Number{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter SKU / Serial Number",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter SKU / Serial Number" />
                            </Form.Item>

                            <Row gutter={10}>
                                <Col span={12}>
                                    <Form.Item
                                        name="brand"
                                        label={
                                            <span>
                                                Brand {""}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                    >
                                        <Select
                                            options={modelSelector.brands.map(
                                                (b) => ({
                                                    label:
                                                        b.brand[0].toUpperCase() +
                                                        b.brand.slice(1),
                                                    value: b._id,
                                                }),
                                            )}
                                            onChange={() =>
                                                form.setFieldsValue({
                                                    model: null,
                                                })
                                            }
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        name="model"
                                        label={
                                            <span>
                                                Model{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                    >
                                        <Input placeholder="Enter model" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="description"
                                label="Description"
                                getValueFromEvent={(content) => content}
                            >
                                <ReactQuill
                                    className="product-description-editor"
                                    theme="snow"
                                    modules={descriptionEditorModules}
                                    formats={descriptionEditorFormats}
                                    placeholder="Write product description"
                                />
                            </Form.Item>
                        </div>

                        <div className="form-card">
                            <h3>Pricing & Margin</h3>

                            {/* COST + SELL PRICE */}
                            <Row gutter={10}>
                                <Col span={12}>
                                    <Form.Item
                                        name="cost"
                                        label={
                                            <span>
                                                Cost Price (Purchase Price){" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                    >
                                        <Input
                                            type="number"
                                            placeholder="e.g. 500"
                                            onChange={(e) =>
                                                form.setFieldsValue({
                                                    cost: validateNumber(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        name="price"
                                        label={
                                            <span>
                                                Selling Price{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                    >
                                        <Input
                                            type="number"
                                            placeholder="e.g. 800"
                                            onChange={(e) =>
                                                form.setFieldsValue({
                                                    price: validateNumber(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* DISCOUNT TOGGLE */}
                            <Form.Item
                                name="discount"
                                label="Available for Discount"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            {/* DISCOUNT FIELDS */}
                            <Form.Item shouldUpdate>
                                {({ getFieldValue }) =>
                                    getFieldValue("discount") && (
                                        <Row gutter={10}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="discountType"
                                                    label="Discount Type"
                                                >
                                                    <Select placeholder="Select type">
                                                        <Select.Option value="percentage">
                                                            Percentage (%)
                                                        </Select.Option>
                                                        <Select.Option value="fixed">
                                                            Fixed Amount (QAR)
                                                        </Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item
                                                    name="discountValue"
                                                    label="Discount Value"
                                                >
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter value"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    )
                                }
                            </Form.Item>

                            {/* AUTO CALCULATIONS */}
                            <Form.Item shouldUpdate>
                                {({ getFieldValue }) => {
                                    const margin = getFieldValue("margin");
                                    const profit = getFieldValue("profit");
                                    const isLoss = profit < 0;

                                    if (
                                        margin === undefined ||
                                        profit === undefined
                                    )
                                        return null;

                                    return (
                                        <div
                                            className={`margin-box ${isLoss ? "loss" : ""}`}
                                        >
                                            <div>
                                                <p className="margin-label">
                                                    CALCULATED MARGIN
                                                </p>
                                                <h2 className="margin-value">
                                                    {margin}
                                                </h2>
                                            </div>

                                            <div className="profit-box">
                                                <p className="profit-label">
                                                    Profit per unit
                                                </p>
                                                <h3 className="profit-value">
                                                    QAR {profit}
                                                </h3>
                                            </div>
                                        </div>
                                    );
                                }}
                            </Form.Item>
                        </div>

                        <div className="form-card">
                            <h3>Warranty</h3>

                            {/* Switch */}
                            <Form.Item
                                name="hasWarranty"
                                label="Has Warranty"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            {/* Conditional Input */}
                            <Form.Item
                                shouldUpdate={(prev, curr) =>
                                    prev.hasWarranty !== curr.hasWarranty
                                }
                            >
                                {({ getFieldValue }) =>
                                    getFieldValue("hasWarranty") && (
                                        <Form.Item
                                            name="warranty"
                                            label="Warranty (Months)"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Enter warranty months",
                                                },
                                            ]}
                                        >
                                            <Input
                                                type="number"
                                                placeholder="Enter warranty in months"
                                                addonAfter="Months"
                                            />
                                        </Form.Item>
                                    )
                                }
                            </Form.Item>
                        </div>
                    </Col>

                    {/* RIGHT */}
                    <Col span={8}>
                        <div className="form-card">
                            <h3>Stock</h3>

                            <Form.Item name="quantity" label="Quantity">
                                <Input
                                    type={"text"}
                                    placeholder="Enter quantity"
                                    onChange={(e) =>
                                        form.setFieldsValue({
                                            quantity: validateNumber(
                                                e.target.value,
                                            ),
                                        })
                                    }
                                />
                            </Form.Item>

                            <Form.Item name="low_stock" label="Low Stock Alert">
                                <Input
                                    type={"text"}
                                    placeholder="Enter low stock threshold"
                                    onChange={(e) =>
                                        form.setFieldsValue({
                                            low_stock: validateNumber(
                                                e.target.value,
                                            ),
                                        })
                                    }
                                />
                            </Form.Item>
                        </div>

                        {/* Brand Management */}
                        <div className="form-card brand-management-card">
                            <div className="brand-header">
                                <h3>Brand Management</h3>

                                <button
                                    type="button"
                                    className="btn-add"
                                    onClick={openBrandDrawer}
                                >
                                    + Add Brand
                                </button>
                            </div>

                            <div className="brand-list">
                                {isBrandLoading ? (
                                    <Skeleton active />
                                ) : (
                                    <>
                                        {brands.map((brand, index) => (
                                            <div
                                                className="brand-item"
                                                key={index}
                                            >
                                                <div className="brand-name-group">
                                                    <span className="brand-avatar">
                                                        {brand.brand[0].toUpperCase()}
                                                    </span>
                                                    <span className="brand-name">
                                                        {brand.brand[0].toUpperCase() +
                                                            brand.brand.slice(
                                                                1,
                                                            )}
                                                    </span>
                                                </div>

                                                <div className="brand-item-actions">
                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            handleEditBrand(
                                                                brand,
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    {/* <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            deleteBrand(brand)
                                                        }
                                                    >
                                                        Del
                                                    </button> */}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="d-flex justify-content-between mt-2 brand-pagination">
                                            <div>
                                                <button
                                                    type="button"
                                                    className="brand-page-btn"
                                                    disabled={
                                                        Math.round(
                                                            totalBrandCount /
                                                                brandLimit,
                                                        ) > brandPage
                                                    }
                                                    onClick={
                                                        handleBrandPrevPage
                                                    }
                                                >
                                                    Prev
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    type="button"
                                                    className="brand-page-btn"
                                                    disabled={
                                                        totalBrandCount <
                                                        brandPage * brandLimit
                                                    }
                                                    onClick={
                                                        handleBrandNextPage
                                                    }
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {/*

                        Not needed for now
                            <div className="form-card">
                            <div className="brand-header">
                                <h3>Model Management</h3>

                                <button
                                    type="button"
                                    className="btn-add"
                                    onClick={openModelDrawer}
                                >
                                    + Add Model
                                </button>
                            </div>

                            <div className="brand-list">
                                {models
                                    .filter((m) => m.brand === selectedBrand)
                                    .map((model) => (
                                        <div
                                            key={model.name}
                                            className="brand-item"
                                        >
                                            <span>{model.name}</span>

                                            <div>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        handleEditModel(
                                                            model.name,
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteModel(model.name)
                                                    }
                                                >
                                                    Del
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                            */}
                    </Col>
                </Row>
            </Form>

            {/* ✅ Brand Drawer */}
            <BrandDrawer
                open={brandDrawerOpen}
                onClose={() => {
                    setBrandDrawerOpen(false);
                    setEditingBrand(null);
                }}
                onAdd={handleAddBrand}
                onUpdate={handleUpdateBrand}
                editingBrand={editingBrand}
            />

            <ModelDrawer
                open={modelDrawerOpen}
                onClose={() => {
                    setModelDrawerOpen(false);
                    setEditingModel(null);
                }}
                onAdd={handleAddModel}
                onUpdate={handleUpdateModel}
                editingModel={editingModel}
                selectedBrand={selectedBrand} // ✅ pass current brand
            />
        </>
    );
};

export default ProductForm;
