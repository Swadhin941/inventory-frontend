import React, { useEffect, useState } from "react";
import { Drawer, Input, Button, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addModelApi, getAllBrand } from "../../Services/slices/model.slice";

const ModelDrawer = ({
    open,
    onClose,
    onAdd,
    onUpdate,
    editingModel,
    selectedBrand, // ✅ receive selected brand
}) => {
    const { brands } = useSelector((state) => state.model);
    const dispatch = useDispatch();
    const [modelName, setModelName] = useState("");
    const [selected, setSelected] = useState(""); // ✅ FIX name conflict

    useEffect(()=>{
        dispatch(getAllBrand({limit: "all"}))
    },[dispatch])

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
            // onAdd(clean, selected);
            dispatch(addModelApi({model: clean, brand: selected}));
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
            width={360}
            rootClassName="small-form-drawer"
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Close Button */}
                <div style={{ textAlign: "right" }}>
                    <Button onClick={onClose}>Close</Button>
                </div>

                {brands.length !== 0 && (
                    <Select
                        placeholder="Select Brand"
                        value={selected}
                        onChange={(value) => setSelected(value)}
                        options={brands.map((brand) => ({
                            label:
                                brand.brand[0].toUpperCase() +
                                brand.brand.slice(1),
                            value: brand._id,
                        }))}
                    />
                )}

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
