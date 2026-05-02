import React, { useEffect, useState } from "react";
import { Drawer, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addBrandApi, updateBrandApi } from "../../Services/slices/brand.slice";
import Spinner from "../Spinner/Spinner";
import toast from "react-hot-toast";

const BrandDrawer = ({ open, onClose,  onUpdate, editingBrand }) => {
    const [brandName, setBrandName] = useState("");
    const {
        brands,
        addBrand,
        addBrandLoading,
        updateBrand,
        updateBrandLoading,
    } = useSelector((state) => state.brand);
    const dispatch = useDispatch();
    // Add brand effects
    useEffect(() => {
        if (addBrand && !addBrandLoading) {
            onClose();
        }
    }, [brands, addBrand, addBrandLoading]);

    // Update brand effects
    useEffect(() => {
        if (updateBrand && !updateBrandLoading) {
            onClose();
        }
    }, [updateBrand, updateBrandLoading]);
    // ✅ When editing, pre-fill input
    useEffect(() => {
        if (editingBrand) {
            setBrandName(editingBrand.brand);
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
            if (brandName.trim().length === 0) {
                toast.error("Enter brand name");
                return;
            }
            if (brandName.toLowerCase() === editingBrand.brand.toLowerCase()) {
                toast.error("Brand name already exists");
                return;
            }
            dispatch(
                updateBrandApi({
                    brandId: editingBrand._id,
                    brandName: brandName.toLowerCase(),
                }),
            );
        } else {
            const payload = {
                brand: brandName.toLowerCase(),
            };
            dispatch(addBrandApi(payload));
        }
        // onClose();
    };

    const handleBrandNameChange = (text) => {
        console.log(text, "value changes");
        if (text.trim().length === 0) {
            setBrandName("");
            return;
        } else {
            setBrandName(text.trim()[0] + text.trim().slice(1, text.length));
        }
    };

    return (
        <Drawer
            title={editingBrand ? "Edit Brand" : "Add New Brand"}
            placement="right"
            onClose={onClose}
            open={open}
            width={320}
            rootClassName="small-form-drawer"
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Input
                    placeholder="Enter brand name"
                    value={
                        brandName
                            ? brandName[0].toUpperCase() +
                              brandName.slice(1, brandName.length)
                            : ""
                    }
                    onChange={(e) => handleBrandNameChange(e.target.value)}
                />

                <Button
                    type="primary"
                    onClick={handleSave}
                    disabled={addBrandLoading || updateBrandLoading}
                >
                    {editingBrand ? "Update Brand" : "Save Brand"}{" "}
                    {(addBrandLoading || updateBrandLoading) && <Spinner />}
                </Button>
            </div>
        </Drawer>
    );
};

export default BrandDrawer;
