import React from "react";
import { Card, Col, Input, Row } from "antd";

const CustomerForm = ({ customer, onCustomerChange }) => {
    const { customerName, phone, email } = customer || {};
    return (
        <Card title="Customer Details">
            <Row gutter={[12, 12]}>
                <Col xs={24} md={8}>
                    <Input
                        placeholder="Customer name *"
                        value={customerName ?? ""}
                        onChange={(e) =>
                            onCustomerChange("customerName", e.target.value)
                        }
                    />
                </Col>
                <Col xs={24} md={8}>
                    <Input
                        placeholder="Phone *"
                        value={phone ?? ""}
                        onChange={(e) =>
                            onCustomerChange("phone", e.target.value)
                        }
                    />
                </Col>
                <Col xs={24} md={8}>
                    <Input
                        placeholder="Email (optional)"
                        value={email ?? ""}
                        onChange={(e) =>
                            onCustomerChange("email", e.target.value)
                        }
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default CustomerForm;
