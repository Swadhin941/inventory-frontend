import React, { useEffect, useState } from "react";
import { Drawer, Input, Button, message, Select } from "antd";

const ModelDrawer = ({
  open,
  onClose,
  onAdd,
  onUpdate,
  editingModel,
  brands, // ✅ receive brands list
  selectedBrand, // ✅ receive selected brand
}) => {
  const [modelName, setModelName] = useState("");
  const [selected, setSelected] = useState(""); // ✅ FIX name conflict

  // ✅ set brand when drawer opens
  useEffect(() => {
    setSelected(selectedBrand || "");
  }, [selectedBrand, open]);

  // ✅ set model when editing
  useEffect(() => {
    if (editingModel) {
      setModelName(editingModel);
    } else {
      setModelName("");
    }
  }, [editingModel]);

  const handleSave = () => {
    const clean = modelName.trim();

    if (!selected) {
      message.warning("Select brand ⚠️");
      return;
    }

    if (!clean) {
      message.warning("Enter model name");
      return;
    }

    if (editingModel) {
      onUpdate(clean, selected);
    } else {
      onAdd(clean, selected);
    }

    onClose();
  };

  return (
    <Drawer
      title={editingModel ? "Edit Model" : "Add Model"}
      open={open}
      onClose={() => {}}
      maskClosable={false}
      keyboard={false}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Close Button */}
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose}>Close</Button>
        </div>

        {/* ✅ BRAND SELECT */}
        <Select
          placeholder="Select Brand"
          value={selected}
          onChange={(value) => setSelected(value)}
          options={brands.map((b) => ({
            label: b,
            value: b,
          }))}
        />

        {/* MODEL INPUT */}
        <Input
          placeholder="Enter model name"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />

        <Button type="primary" onClick={handleSave}>
          {editingModel ? "Update Model" : "Save Model"}
        </Button>
      </div>
    </Drawer>
  );
};

export default ModelDrawer;
