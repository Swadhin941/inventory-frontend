import React from "react";
import {
    Alert,
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    Space,
    Switch,
} from "antd";
import {
    DatabaseOutlined,
    DollarOutlined,
    DownloadOutlined,
    FileTextOutlined,
    SaveOutlined,
    ShopOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import "./BusinessSettings.css";

const receiptSettings = [
    {
        title: "Show Logo on Receipt",
        desc: "Print the QuddusShop logo on every receipt.",
        checked: true,
    },
    {
        title: "Show Staff Name",
        desc: "Display the staff member who processed the sale.",
        checked: true,
    },
    {
        title: "Show VAT Breakdown",
        desc: "Itemize 5% VAT separately on the receipt.",
        checked: true,
    },
    {
        title: "Print Footer Message",
        desc: "Show a custom thank-you note at the bottom.",
        checked: false,
    },
];

const exportItems = [
    {
        title: "Export Sales History",
        desc: "All transactions with customer, staff, and payment data.",
    },
    {
        title: "Export Product List",
        desc: "All products with pricing, stock, and brand info.",
    },
    {
        title: "Export Payment Records",
        desc: "All payment logs with method, timestamps, and amounts.",
    },
];

const SectionHeader = ({ icon, title, description, danger }) => (
    <div className="settings-section-header">
        <div
            className={`settings-section-icon ${
                danger ? "settings-section-icon-danger" : ""
            }`}
        >
            {icon}
        </div>
        <div>
            <h3 className={danger ? "settings-danger-title" : ""}>{title}</h3>
            <p>{description}</p>
        </div>
    </div>
);

const BusinessSettings = () => {
    return (
        <div className="business-settings-page">
            <div className="business-settings-header">
                <div>
                    <h2>Business Settings</h2>
                    <p>Manage store details, receipts, currency, and exports.</p>
                </div>

                <Button type="primary" icon={<SaveOutlined />}>
                    Save Changes
                </Button>
            </div>

            <Row gutter={[16, 16]} align="top">
                <Col xs={24} xl={12}>
                    <div className="settings-panel">
                        <SectionHeader
                            icon={<ShopOutlined />}
                            title="Store Information"
                            description="Your store details appear on receipts and exports."
                        />

                        <Form layout="vertical" className="settings-form">
                            <Form.Item label="Store Name">
                                <Input defaultValue="QuddusShop" />
                            </Form.Item>

                            <Form.Item label="Owner Name">
                                <Input defaultValue="Abdul Quddus" />
                            </Form.Item>

                            <Form.Item label="Address">
                                <Input.TextArea
                                    rows={3}
                                    defaultValue={`Al Rayyan Road, Doha Mall, Shop #42
Doha, Qatar`}
                                />
                            </Form.Item>

                            <Row gutter={12}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Tax / CR Number">
                                        <Input defaultValue="QA-2024-00831" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item label="Phone">
                                        <Input defaultValue="+974 4412 0088" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Store Email">
                                <Input defaultValue="info@quddusshop.qa" />
                            </Form.Item>
                        </Form>
                    </div>

                    <div className="settings-panel">
                        <SectionHeader
                            icon={<FileTextOutlined />}
                            title="Receipt Settings"
                            description="Configure what appears on printed and digital receipts."
                        />

                        <div className="settings-list">
                            {receiptSettings.map((item) => (
                                <div className="settings-toggle-row" key={item.title}>
                                    <div>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>

                                    <Switch defaultChecked={item.checked} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>

                <Col xs={24} xl={12}>
                    <div className="settings-panel">
                        <SectionHeader
                            icon={<DollarOutlined />}
                            title="Currency & VAT"
                            description="Applies across all transactions and exports."
                        />

                        <Form layout="vertical" className="settings-form">
                            <Row gutter={12}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Currency">
                                        <Select
                                            defaultValue="qar"
                                            options={[
                                                {
                                                    label: "QAR - Qatari Riyal",
                                                    value: "qar",
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item label="Currency Symbol">
                                        <Input defaultValue="QAR" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={12}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="VAT Rate (%)"
                                        extra="Qatar standard VAT is 5%"
                                    >
                                        <Input defaultValue="5" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item label="Decimal Places">
                                        <Select
                                            defaultValue={2}
                                            options={[
                                                {
                                                    label: "2 decimal places (100.00)",
                                                    value: 2,
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className="settings-toggle-row settings-toggle-row-last">
                                <div>
                                    <h4>VAT Included in Price</h4>
                                    <p>
                                        Show prices as VAT-inclusive on all
                                        displays.
                                    </p>
                                </div>

                                <Switch defaultChecked />
                            </div>
                        </Form>
                    </div>

                    <div className="settings-panel">
                        <SectionHeader
                            icon={<DatabaseOutlined />}
                            title="Backup & Export"
                            description="Download your data as CSV or Excel files."
                        />

                        <div className="settings-export-list">
                            {exportItems.map((item) => (
                                <div className="settings-export-row" key={item.title}>
                                    <div>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>

                                    <Space className="settings-export-actions">
                                        <Button icon={<DownloadOutlined />}>CSV</Button>
                                        <Button icon={<DownloadOutlined />}>
                                            Excel
                                        </Button>
                                    </Space>
                                </div>
                            ))}
                        </div>

                        <Alert
                            className="settings-alert"
                            type="warning"
                            showIcon
                            message="Exported files may contain sensitive financial data. Only share them with authorized personnel."
                        />
                    </div>

                    <div className="settings-panel settings-danger-panel">
                        <SectionHeader
                            danger
                            icon={<WarningOutlined />}
                            title="Danger Zone"
                            description="These actions are irreversible. Proceed with caution."
                        />

                        <div className="settings-danger-action">
                            <div>
                                <h4>Clear All Sales Data</h4>
                                <p>
                                    Permanently removes all transaction records.
                                    This cannot be undone.
                                </p>
                            </div>

                            <Button danger>Clear Data</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default BusinessSettings;
