import { Form, Input, Row, Col, Select, Modal, message, Switch } from "antd";
import React, { useEffect, useState } from "react";
import "./ProductForm.css";
import QrScanner from "../../../Components/QrScanner/QrScanner";
import BrandDrawer from "../../../Components/BrandDrawer/BrandDrawer";
import ModelDrawer from "../../../Components/ModelDrawer/ModelDrawer";

const ProductForm = ({ product, onClose }) => {
  const [form] = Form.useForm();

  const selectedBrand = Form.useWatch("brand", form);

  const [scanOpen, setScanOpen] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);

  const [brandDrawerOpen, setBrandDrawerOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  // const [models, setModels] = useState([]);
  const [modelDrawerOpen, setModelDrawerOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);

  // ✅ Brand state
  const [brands, setBrands] = useState([
    "Samsung",
    "Apple",
    "Xiaomi",
    "Google",
    "OnePlus",
  ]);

  // ✅ Model state (linked to brand)
  const [models, setModels] = useState([]);
  // [{ name: "iPhone 14", brand: "Apple" }]

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
          setBrands((prev) => [...prev, brand]);
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
  const handleValuesChange = (_, values) => {
    const cost = parseFloat(values.cost_price);
    const sell = parseFloat(values.sell_price);

    if (cost && sell) {
      const margin = (((sell - cost) / cost) * 100).toFixed(1);
      form.setFieldsValue({ margin: `+${margin}%` });
    }
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
      setBrands((prev) => [...prev, brand]);

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

    setBrands((prev) => prev.map((b) => (b === editingBrand ? clean : b)));

    form.setFieldsValue({ brand: clean });
    setEditingBrand(null);
  };

  // ✅ Delete brand
  const deleteBrand = (brand) => {
    setBrands(brands.filter((b) => b !== brand));
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
        m.brand === brand
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
        m.name === editingModel
          ? { ...m, name: clean, brand }
          : m
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
                      options={brands.map((b) => ({
                        label: b,
                        value: b,
                      }))}
                      onChange={() => form.setFieldsValue({ model: null })}
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

              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
              </Form.Item>
            </div>

            <div className="form-card">
              {" "}
              <h3>Pricing & Margin</h3>{" "}
              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item name="cost" label="Cost Price (Purchase Price) *">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="price" label="Selling Price *">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="discount"
                label="Available for Discount"
                valuePropName="checked"
              >
                {" "}
                <Switch />{" "}
              </Form.Item>{" "}
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

            {/* Brand Management */}
            <div className="form-card">
              <div className="brand-header">
                <h3>Brand Management</h3>

                <button className="btn-add" onClick={openBrandDrawer}>
                  + Add Brand
                </button>
              </div>

              <div className="brand-list">
                {brands.map((brand) => (
                  <div key={brand} className="brand-item">
                    <span>{brand}</span>

                    <div>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditBrand(brand)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteBrand(brand)}
                      >
                        Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-card">
              <div className="brand-header">
                <h3>Model Management</h3>

                <button
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
                    <div key={model.name} className="brand-item">
                      <span>{model.name}</span>

                      <div>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditModel(model.name)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteModel(model.name)}
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Col>
        </Row>
      </Form>

      {/* ✅ Scanner Modal */}
      <Modal
        open={scanOpen}
        onCancel={handleCloseScanner}
        footer={null}
        title="Scan QR / Barcode"
      >
        {loadingScan ? (
          <p>Fetching product...</p>
        ) : (
          <QrScanner onScan={handleScan} />
        )}
      </Modal>

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
  brands={brands}              // ✅ pass brands
  selectedBrand={selectedBrand} // ✅ pass current brand
/>
    </>
  );
};

export default ProductForm;
