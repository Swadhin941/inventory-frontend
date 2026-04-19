import { Form, Input, Row, Col, Select, Modal, message, Button, Switch } from "antd";
import React, { useEffect, useState } from "react";
import "./ProductForm.css";
import QrScanner from "../../../Components/QrScanner/QrScanner";
import { CameraOutlined } from "@ant-design/icons";

const ProductForm = ({ product, onClose }) => {
  const [form] = Form.useForm();

  const [scanOpen, setScanOpen] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const handleCloseScanner = () => {
    setScanOpen(false);
  };

  const playBeep = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );
    audio.play();
  };

  // ✅ Brand state
  const [brands, setBrands] = useState([
    "Samsung",
    "Apple",
    "Xiaomi",
    "Google",
    "OnePlus",
  ]);

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
  const addBrand = () => {
    const newBrand = prompt("Enter new brand");
    if (newBrand && !brands.includes(newBrand)) {
      setBrands([...brands, newBrand]);
    }
  };

  // ✅ Delete brand
  const deleteBrand = (brand) => {
    setBrands(brands.filter((b) => b !== brand));
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

              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item name="sku" label="SKU / Model">
                    <Input
                      placeholder="Enter or scan SKU"
                      addonAfter={
                        <Button
                          type="text"
                          icon={<CameraOutlined />}
                          onClick={() => setScanOpen(true)}
                        />
                      }
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="model" label="Model">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="brand" label="Brand">
                <Select
                  options={brands.map((b) => ({
                    label: b,
                    value: b,
                  }))}
                />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
              </Form.Item>
            </div>

            <div className="form-card"> <h3>Discount Settings</h3> <Form.Item name="discount" label="Available for Discount" valuePropName="checked" > <Switch /> </Form.Item> </div>
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

                <button className="btn-add" onClick={addBrand}>
                  + Add Brand
                </button>
              </div>

              <div className="brand-list">
                {brands.map((brand) => (
                  <div key={brand} className="brand-item">
                    <span>{brand}</span>

                    <div>
                      <button className="edit-btn">Edit</button>

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
    </>
  );
};

export default ProductForm;
