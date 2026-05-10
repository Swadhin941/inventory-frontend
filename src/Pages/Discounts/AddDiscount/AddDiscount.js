import React, { useEffect } from "react";
import {
    Button,
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

const AddDiscount = ({ open, onClose, onSave, editingDiscount }) => {
    const [form] = Form.useForm();
    const discountType = Form.useWatch("type", form);

    useEffect(() => {
        if (!open) {
            return;
        }

        if (editingDiscount) {
            form.setFieldsValue({
                coupon: editingDiscount.coupon,
                type: editingDiscount.type,
                value: Number(editingDiscount.value),
                applicable: editingDiscount.applicable,
                expiry: dayjs(editingDiscount.expiryDate),
                limit: editingDiscount.limit,
                status: editingDiscount.status,
            });
            return;
        }

        form.setFieldsValue({
            type: "Percentage",
            value: 0,
            applicable: [],
            limit: 1,
            status: "Active",
        });
    }, [editingDiscount, form, open]);

    const handleSubmit = (values) => {
        onSave({
            ...values,
            coupon: values.coupon.trim().toUpperCase(),
        });
        form.resetFields();
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
                    rules={[{ required: true, message: "Select discount type" }]}
                >
                    <Select
                        options={[
                            { label: "Percentage", value: "Percentage" },
                            { label: "Fixed Amount", value: "Fixed Amount" },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        discountType === "Fixed Amount"
                            ? "Discount Amount (QAR)"
                            : "Discount Value (%)"
                    }
                    name="value"
                    rules={[{ required: true, message: "Enter discount value" }]}
                >
                    <InputNumber
                        className="discount-input-number"
                        min={1}
                        max={discountType === "Fixed Amount" ? 99999 : 100}
                        precision={0}
                    />
                </Form.Item>

                <Form.Item
                    label="Applicable To"
                    name="applicable"
                    rules={[
                        {
                            required: true,
                            message: "Add at least one product/category",
                        },
                    ]}
                >
                    <Select
                        mode="tags"
                        tokenSeparators={[","]}
                        placeholder="Type and press Enter (e.g. Samsung, Accessories)"
                    />
                </Form.Item>

                <Form.Item
                    label="Expiry Date"
                    name="expiry"
                    rules={[{ required: true, message: "Select expiry date" }]}
                >
                    <DatePicker
                        className="discount-date-picker"
                        format="DD MMM YYYY"
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
                            { label: "Expired", value: "Expired" },
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