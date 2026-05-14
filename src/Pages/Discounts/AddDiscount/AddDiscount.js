import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    DatePicker,
    Drawer,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
} from "antd";
import dayjs from "dayjs";
import "./AddDiscount.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrand } from "../../../Services/slices/model.slice";
import { addDiscountApi, updateDiscountApi } from "../../../Services/slices/discount.slice";

const AddDiscount = ({ open, onClose, editingDiscount }) => {
    const { brands } = useSelector((state) => state.model);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const discountType = Form.useWatch("type", form);
    const [allBrands, setAllBrands] = useState([]);
    const [selectAllBrands, setSelectAllBrands] = useState(false);
    useEffect(() => {
        console.log("Brands in AddDiscount:", brands);
        if (brands.length === 0) {
            dispatch(getAllBrand({ limit: "all" }));
        }
    }, [dispatch]);

    useEffect(() => {
        if (brands.length > 0) {
            setAllBrands([...brands]);
        }
    }, [brands]);

    useEffect(() => {
        if (!open) {
            return;
        }

        if (editingDiscount) {
            form.setFieldsValue({
                coupon: editingDiscount.name,
                type: editingDiscount.discountType,
                value: Number(editingDiscount.discountValue),
                applicableBrands: (editingDiscount.applicableBrands || []).map(
                    (b) => b._id,
                ),
                expiry: dayjs(editingDiscount.expiryDate),
                limit: editingDiscount.usageLimit,
                status: editingDiscount.isActive ? "Active" : "Inactive",
            });
            return;
        }

        form.setFieldsValue({
            type: "percentage",
            value: 0,
            applicableBrands: [],
            limit: 1,
            status: "Active",
        });
    }, [editingDiscount, form, open]);

    const handleSubmit = (values) => {
        console.log("Form values on submit:", values);
        // onSave({
        //     ...values,
        //     coupon: values.coupon.trim().toUpperCase(),
        // });
        // form.resetFields();
        let payload = {
            name: values.coupon.trim().toLowerCase(),
            discountType: values.type,
            discountValue: Number(values.value),
            applicableBrands: values.applicableBrands,
            expiryDate: values.expiry.format("YYYY-MM-DD"),
            usageLimit: Number(values.limit),
            isActive: values.status === "Active" ? true : false,
        };
        if (!editingDiscount) { 
            dispatch(addDiscountApi(payload));
        }
        else{
            payload._id = editingDiscount._id;
            dispatch(updateDiscountApi(payload));
        }
        onClose();
    };

    const handleBrandChange = (value) => {
        form.setFieldsValue({
            applicableBrands: value,
        });

        setSelectAllBrands(value.length === allBrands.length);
    };

    return (
        <Drawer
            title={editingDiscount ? "Edit Coupon" : "Create New Coupon"}
            placement="right"
            onClose={() => {
                form.resetFields();
                onClose();
            }}
            open={open}
            width={420}
            rootClassName="small-form-drawer discount-drawer"
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                className="discount-form"
            >
                <Form.Item
                    label="Coupon Code"
                    name="coupon"
                    rules={[
                        { required: true, message: "Enter coupon code" },
                        { min: 3, message: "At least 3 characters required" },
                    ]}
                >
                    <Input placeholder="e.g. SUMMER25" maxLength={20} />
                </Form.Item>

                <Form.Item
                    label="Discount Type"
                    name="type"
                    rules={[
                        { required: true, message: "Select discount type" },
                    ]}
                >
                    <Select
                        disabled={!!editingDiscount}
                        options={[
                            { label: "Percentage", value: "percentage" },
                            { label: "Fixed Amount", value: "fixed_amount" },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        discountType === "fixed_amount"
                            ? "Discount Amount (QAR)"
                            : "Discount Value (%)"
                    }
                    name="value"
                    rules={[
                        { required: true, message: "Enter discount value" },
                    ]}
                >
                    <InputNumber
                        disabled={!!editingDiscount}
                        className="discount-input-number"
                        min={1}
                        max={discountType === "fixed_amount" ? 99999 : 100}
                        precision={0}
                    />
                </Form.Item>

                <Form.Item label="Applicable To">
                    <Checkbox
                        checked={selectAllBrands}
                        onChange={(e) => {
                            const checked = e.target.checked;

                            setSelectAllBrands(checked);

                            if (checked) {
                                form.setFieldsValue({
                                    applicableBrands: allBrands.map(
                                        (brand) => brand._id,
                                    ),
                                });
                            } else {
                                form.setFieldsValue({
                                    applicableBrands: [],
                                });
                            }
                        }}
                    >
                        Select All Brands
                    </Checkbox>

                    <Form.Item
                        name="applicableBrands"
                        noStyle
                        rules={[
                            {
                                required: true,
                                message: "Select at least one brand",
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            style={{
                                width: "100%",
                                marginTop: 10,
                            }}
                            placeholder="Select brands"
                            options={allBrands.map((brand) => ({
                                label:
                                    brand.brand[0].toUpperCase() +
                                    brand.brand.slice(1),
                                value: brand._id,
                            }))}
                            onChange={handleBrandChange}
                        />
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    label="Expiry Date"
                    name="expiry"
                    rules={[{ required: true, message: "Select expiry date" }]}
                >
                    <DatePicker
                        className="discount-date-picker"
                        format="YYYY-MM-DD"
                        disabledDate={(current) =>
                            current && current < dayjs().startOf("day")
                        }
                    />
                </Form.Item>

                <Form.Item
                    label="Usage Limit"
                    name="limit"
                    rules={[{ required: true, message: "Enter usage limit" }]}
                >
                    <InputNumber
                        className="discount-input-number"
                        min={1}
                        precision={0}
                    />
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: "Select status" }]}
                >
                    <Radio.Group
                        options={[
                            { label: "Active", value: "Active" },
                            { label: "Inactive", value: "Inactive" },
                        ]}
                    />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                    {editingDiscount ? "Update Coupon" : "Save Coupon"}
                </Button>
            </Form>
        </Drawer>
    );
};

export default AddDiscount;
