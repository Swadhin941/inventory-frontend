import React from "react";
import { Card, Col, Input, Row } from "antd";

const CustomerForm = () => {
    return (
        <Card title="Customer Details">
            <Row gutter={12}>
                <Col span={8}>
                    <Input placeholder="Customer Name" />
                </Col>
                <Col span={8}>
                    <Input placeholder="Phone" />
                </Col>
                <Col span={8}>
                    <Input placeholder="Email (optional)" />
                </Col>
            </Row>
        </Card>
    );
};

export default CustomerForm; 