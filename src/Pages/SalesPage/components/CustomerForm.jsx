import React from "react";
import { Card, Col, Input, Row } from "antd";

const CustomerForm = () => {
    return (
        <Card title="Customer Details">
            <Row gutter={[12, 12]}>
                <Col xs={24} md={8}>
                    <Input placeholder="Customer Name" />
                </Col>
                <Col xs={24} md={8}>
                    <Input placeholder="Phone" />
                </Col>
                <Col xs={24} md={8}>
                    <Input placeholder="Email (optional)" />
                </Col>
            </Row>
        </Card>
    );
};

export default CustomerForm;
