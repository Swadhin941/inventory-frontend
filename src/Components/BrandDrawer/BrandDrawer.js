import React, { useEffect, useState } from "react";
import { Drawer, Input, Button, message } from "antd";

const BrandDrawer = ({ open, onClose, onAdd, onUpdate, editingBrand }) => {
    const [brandName, setBrandName] = useState("");

    // ✅ When editing, pre-fill input
    useEffect(() => {
        if (editingBrand) {
            setBrandName(editingBrand);
        } else {
            setBrandName("");
        }
    }, [editingBrand]);

    const handleSave = () => {
        if (!brandName.trim()) {
            message.warning("Enter brand name");
            return;
        }

        if (editingBrand) {
            // ✅ Update mode
            onUpdate(brandName);
            message.success("Brand updated ✅");
        } else {
            // ✅ Add mode
            onAdd(brandName);
            message.success("Brand added ✅");
        }

        setBrandName("");
        onClose();
    };

    return (
        <Drawer
            title={editingBrand ? "Edit Brand" : "Add New Brand"}
            placement="right"
            onClose={onClose}
            open={open}
            width={320}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Input
                    placeholder="Enter brand name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                />

                <Button type="primary" onClick={handleSave}>
                    {editingBrand ? "Update Brand" : "Save Brand"}
                </Button>
            </div>
        </Drawer>
    );
};

export default BrandDrawer;
