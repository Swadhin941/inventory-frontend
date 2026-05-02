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
    (state) => state.brand
  );
  const modelSelector = useSelector((state) => state.model);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(
      totalBrandCount,
      "total brand count",
      Math.round(totalBrandCount / brandLimit),
      Math.round(totalBrandCount / brandLimit) > brandPage
    );
    const modelSelector = useSelector((state) => state.model);
    const dispatch = useDispatch();
    useEffect(() => {
        console.log(
            totalBrandCount,
            "total brand count",
            Math.round(totalBrandCount / brandLimit),
            Math.round(totalBrandCount / brandLimit) > brandPage,
        );
    }, [totalBrandCount]);

    useEffect(() => {
        dispatch(getAllBrand({ limit: "all" }));
    }, [dispatch]);
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

    const playBeep = () => {
        const audio = new Audio(
            "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
        );
        audio.play();
    };

    const handleCloseScanner = () => {
        setScanOpen(false);
    };

    // ✅ HANDLE SCAN (IMPROVED)
    const handleScan = async (barcode) => {
        setLoadingScan(true);

        try {
            const current = form.getFieldsValue();

            console.log("Scanned:", barcode);

            // 🔊 Beep sound
            playBeep();

            // ✅ Smart fill SKU / Model
            if (!current.sku) {
                form.setFieldsValue({ sku: barcode });
            } else if (!current.model) {
                form.setFieldsValue({ model: barcode });
            }

            // 🌐 Fetch product
            const res = await fetch(
                `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
            );

            const data = await res.json();

            if (data.status === 1) {
                const productData = data.product;

                const name = productData.product_name;
                const brand = productData.brands;
                const description = productData.generic_name;

                // ✅ Auto add brand
                if (brand && !brands.includes(brand)) {
                    // setBrands((prev) => [...prev, brand]);
                }

  useEffect(() => {
    dispatch(getAllBrand({ limit: "all" }));
  }, [dispatch]);
  const selectedBrand = Form.useWatch("brand", form);

        // ✅ Auto close scanner
        setTimeout(() => {
            setScanOpen(false);
            setLoadingScan(false);
        }, 500);
    };

    // ✅ Auto margin calc
    //   const handleValuesChange = (_, values) => {
    //     const cost = parseFloat(values.cost_price);
    //     const sell = parseFloat(values.sell_price);

    //     if (cost && sell) {
    //       const margin = (((sell - cost) / cost) * 100).toFixed(1);
    //       form.setFieldsValue({ margin: `+${margin}%` });
    //     }
    //   };
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

    // ✅ Delete brand
    const deleteBrand = (brand) => {
        // setBrands(brands.filter((b) => b !== brand));
    };

    // Open model add
    const openModelDrawer = () => {
        setEditingModel(null);
        setModelDrawerOpen(true);
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

  const playBeep = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );
    audio.play();
  };

  const handleCloseScanner = () => {
    setScanOpen(false);
  };

  // ✅ HANDLE SCAN (IMPROVED)
  const handleScan = async (barcode) => {
    setLoadingScan(true);

    try {
      const current = form.getFieldsValue();

      console.log("Scanned:", barcode);

      // 🔊 Beep sound
      playBeep();

      // ✅ Smart fill SKU / Model
      if (!current.sku) {
        form.setFieldsValue({ sku: barcode });
      } else if (!current.model) {
        form.setFieldsValue({ model: barcode });
      }

      // 🌐 Fetch product
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );

      const data = await res.json();

      if (data.status === 1) {
        const productData = data.product;

        const name = productData.product_name;
        const brand = productData.brands;
        const description = productData.generic_name;

        // ✅ Auto add brand
        if (brand && !brands.includes(brand)) {
          // setBrands((prev) => [...prev, brand]);
        }

        // ✅ Fill only empty fields
        form.setFieldsValue({
          name: current.name || name,
          brand: current.brand || brand,
          description: current.description || description,
        });

        // ✅ Success message
        message.success("Product loaded from barcode ✅");
      } else {
        message.warning("Product not found, only barcode added ⚠️");
      }
    } catch (err) {
      console.error(err);
      message.error("Scan failed ❌");
    }

    // ✅ Auto close scanner
    setTimeout(() => {
      setScanOpen(false);
      setLoadingScan(false);
    }, 500);
  };

  // ✅ Auto margin calc
  //   const handleValuesChange = (_, values) => {
  //     const cost = parseFloat(values.cost_price);
  //     const sell = parseFloat(values.sell_price);

  //     if (cost && sell) {
  //       const margin = (((sell - cost) / cost) * 100).toFixed(1);
  //       form.setFieldsValue({ margin: `+${margin}%` });
  //     }
  //   };
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
    const exists = brands.some((b) => b.toLowerCase() === brand.toLowerCase());

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

  // ✅ Delete brand
  const deleteBrand = (brand) => {
    // setBrands(brands.filter((b) => b !== brand));
  };

  // Open model add
  const openModelDrawer = () => {
    setEditingModel(null);
    setModelDrawerOpen(true);
  };

  const handleAddModel = (modelName, brand) => {
    const exists = models.some(
      (m) =>
        m.name.toLowerCase() === modelName.toLowerCase() && m.brand === brand
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

  const handleEditModel = (model) => {
    setEditingModel(model);
    setModelDrawerOpen(true);
  };

  const handleUpdateModel = (updated, brand) => {
    const clean = updated.trim();

    setModels((prev) =>
      prev.map((m) =>
        m.name === editingModel ? { ...m, name: clean, brand } : m
      )
    );

    form.setFieldsValue({
      model: clean,
      brand: brand,
    });

    setEditingModel(null);
  };

  const deleteModel = (model) => {
    setModels(
      models.filter((m) => !(m.name === model && m.brand === selectedBrand))
    );
  };

  const filteredModels = models.filter((m) => m.brand === selectedBrand);

  return (
    <>
      {/* Header */}
      <div className="form-header">
        <h2>{product ? "Edit Product" : "Add New Product"}</h2>

        <div className="form-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-save" onClick={() => form.submit()}>
            Save Product
          </button>
        </div>
      </div>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
      >
        <Row gutter={16}>
          {/* LEFT */}
          <Col span={16}>
            <div className="form-card">
              <h3>Product Information</h3>

              <Form.Item name="name" label="Product Name">
                <Input />
              </Form.Item>

              <Form.Item name="sku" label="SKU / Model">
                <Input placeholder="Enter SKU" />
              </Form.Item>

              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item name="brand" label="Brand">
                    <Select
                      options={modelSelector.brands.map((b) => ({
                        label: b.brand[0].toUpperCase() + b.brand.slice(1),
                        value: b._id,
                      }))}
                      onChange={() =>
                        form.setFieldsValue({
                          model: null,
                        })
                      }
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="model" label="Model">
                    <Select
                      options={filteredModels.map((m) => ({
                        label: m.name,
                        value: m.name,
                      }))}
                      disabled={!selectedBrand}
                    />
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

            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                onValuesChange={handleValuesChange}
            >
                <Row gutter={16}>
                    {/* LEFT */}
                    <Col span={16}>
                        <div className="form-card">
                            <h3>Product Information</h3>

                            <Form.Item name="name" label="Product Name">
                                <Input />
                            </Form.Item>

                            <Form.Item name="sku" label="SKU / Model">
                                <Input placeholder="Enter SKU" />
                            </Form.Item>

                            <Row gutter={10}>
                                <Col span={12}>
                                    <Form.Item name="brand" label="Brand">
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
                                    <Form.Item name="model" label="Model">
                                        <Select
                                            options={filteredModels.map(
                                                (m) => ({
                                                    label: m.name,
                                                    value: m.name,
                                                }),
                                            )}
                                            disabled={!selectedBrand}
                                        />
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
                                        label="Cost Price (Purchase Price) *"
                                    >
                                        <Input
                                            type="number"
                                            placeholder="e.g. 500"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        name="price"
                                        label="Selling Price *"
                                    >
                                        <Input
                                            type="number"
                                            placeholder="e.g. 800"
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
                                <Input />
                            </Form.Item>

                            <Form.Item name="low_stock" label="Low Stock Alert">
                                <Input />
                            </Form.Item>
                        </div>

          {/* RIGHT */}
          <Col span={8}>
            <div className="form-card">
              <h3>Stock</h3>

              <Form.Item name="quantity" label="Quantity">
                <Input />
              </Form.Item>

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
                            Math.round(totalBrandCount / brandLimit) > brandPage
                          }
                          onClick={handleBrandPrevPage}
                        >
                          Prev
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="brand-page-btn"
                          disabled={totalBrandCount < brandPage * brandLimit}
                          onClick={handleBrandNextPage}
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
