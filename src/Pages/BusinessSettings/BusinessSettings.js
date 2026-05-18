import React, { useEffect } from "react";
import {
    Alert,
    Button,
    Col,
    Form,
    Input,
    InputNumber,
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
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import "./BusinessSettings.css";
import {
    addBusinessInfoApi,
    getBusinessInfoApi,
    updateBusinessInfoApi,
} from "../../Services/slices/business.slice";
import {
    defaultBusinessSettings,
    getBusinessSettings,
} from "../../Utils/businessSettings";
import {
    exportPaymentRecordsApiService,
    exportProductListApiService,
    exportSalesHistoryApiService,
} from "../../Services/API/business.api";

const currencies = [
    {
        label: "QAR - Qatari Riyal",
        value: "QAR",
        currencyName: "Qatari Riyal",
        currencySymbol: "QAR",
    },
    {
        label: "USD - US Dollar",
        value: "USD",
        currencyName: "US Dollar",
        currencySymbol: "$",
    },
    {
        label: "BDT - Bangladeshi Taka",
        value: "BDT",
        currencyName: "Bangladeshi Taka",
        currencySymbol: "Tk",
    },
    {
        label: "SAR - Saudi Riyal",
        value: "SAR",
        currencyName: "Saudi Riyal",
        currencySymbol: "SAR",
    },
    {
        label: "AED - UAE Dirham",
        value: "AED",
        currencyName: "UAE Dirham",
        currencySymbol: "AED",
    },
];

const receiptSettings = [
    {
        title: "Show Logo on Receipt",
        desc: "Print the store logo on every receipt.",
        name: ["receiptSettings", "showLogoOnReceipt"],
    },
    {
        title: "Show Staff Name",
        desc: "Display the staff member who processed the sale.",
        name: ["receiptSettings", "showStaffName"],
    },
    {
        title: "Show VAT Breakdown",
        desc: "Itemize VAT separately on the receipt.",
        name: ["receiptSettings", "showVatBreakdown"],
    },
    {
        title: "Print Footer Message",
        desc: "Show a custom thank-you note at the bottom.",
        name: ["receiptSettings", "printFooterMessage"],
    },
];

const exportItems = [
    {
        title: "Export Sales History",
        desc: "All transactions with customer, staff, and payment data.",
        name: ["backupExport", "enableSalesExport"],
        exportApi: exportSalesHistoryApiService,
    },
    {
        title: "Export Product List",
        desc: "All products with pricing, stock, and brand info.",
        name: ["backupExport", "enableProductExport"],
        exportApi: exportProductListApiService,
    },
    {
        title: "Export Payment Records",
        desc: "All payment logs with method, timestamps, and amounts.",
        name: ["backupExport", "enablePaymentExport"],
        exportApi: exportPaymentRecordsApiService,
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
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { businessInfo, businessInfoLoader } = useSelector(
        (state) => state.business,
    );
    const settings = getBusinessSettings(businessInfo);
    const existingId = businessInfo?._id;

    useEffect(() => {
        dispatch(getBusinessInfoApi());
    }, [dispatch]);

   useEffect(() => {
       if (businessInfo) {
           form.setFieldsValue({
               _id: businessInfo._id,

               ...getBusinessSettings(businessInfo),
           });
       }
   }, [form, businessInfo]);

    const handleCurrencyChange = (currencyCode) => {
        const selectedCurrency = currencies.find(
            (currency) => currency.value === currencyCode,
        );

        if (selectedCurrency) {
            form.setFieldsValue({
                currencyVat: {
                    currency: selectedCurrency.value,
                    currencyName: selectedCurrency.currencyName,
                    currencySymbol: selectedCurrency.currencySymbol,
                },
            });
        }
    };

    const handleSave = async (values) => {
        const payload = {
            ...defaultBusinessSettings,
            ...settings,
            ...values,
            storeInformation: {
                ...settings.storeInformation,
                ...values.storeInformation,
                storeEmail: values.storeInformation.storeEmail.toLowerCase(),
            },
            currencyVat: {
                ...settings.currencyVat,
                ...values.currencyVat,
                vatRate: Number(values.currencyVat.vatRate),
                decimalPlaces: Number(values.currencyVat.decimalPlaces),
            },
            receiptSettings: {
                ...settings.receiptSettings,
                ...values.receiptSettings,
            },
            backupExport: {
                ...settings.backupExport,
                ...values.backupExport,
            },
            isActive: values.isActive ?? true,
        };

        if (existingId) {
            payload._id = existingId;
        }

        try {
            if (existingId) {
                await dispatch(updateBusinessInfoApi(payload)).unwrap();
            } else {
                await dispatch(addBusinessInfoApi(payload)).unwrap();
            }
            toast.success("Business settings saved");
        } catch (_error) {
            toast.error("Could not save business settings");
        }
    };

    const handleExport = async (item) => {
        const enabled = form.getFieldValue(item.name);

        if (!enabled) {
            toast.error("Enable this export in settings first");
            return;
        }

        try {
            await item.exportApi();
            toast.success("Export downloaded");
        } catch (_error) {
            toast.error("Could not export file");
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            className="business-settings-page"
            initialValues={defaultBusinessSettings}
            onFinish={handleSave}
        >
            <div className="business-settings-header">
                <div>
                    <h2>Business Settings</h2>
                    <p>
                        Manage store details, receipts, currency, and exports.
                    </p>
                </div>

                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    htmlType="submit"
                    loading={businessInfoLoader}
                >
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

                        <div className="settings-form">
                            <Form.Item
                                label="Store Name"
                                name={["storeInformation", "storeName"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter store name",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Owner Name"
                                name={["storeInformation", "ownerName"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter owner name",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Address"
                                name={["storeInformation", "address"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter address",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={3}
                                    style={{
                                        minHeight: 60,
                                    }}
                                />
                            </Form.Item>

                            <Row gutter={12}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Tax / CR Number"
                                        name={[
                                            "storeInformation",
                                            "taxCrNumber",
                                        ]}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Enter tax or CR number",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Phone"
                                        name={["storeInformation", "phone"]}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Enter phone",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Store Email"
                                name={["storeInformation", "storeEmail"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter store email",
                                    },
                                    {
                                        type: "email",
                                        message: "Enter a valid email",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="settings-panel">
                        <SectionHeader
                            icon={<FileTextOutlined />}
                            title="Receipt Settings"
                            description="Configure what appears on printed and digital receipts."
                        />

                        <div className="settings-list">
                            {receiptSettings.map((item) => (
                                <div
                                    className="settings-toggle-row"
                                    key={item.title}
                                >
                                    <div>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>

                                    <Form.Item
                                        name={item.name}
                                        valuePropName="checked"
                                        noStyle
                                    >
                                        <Switch />
                                    </Form.Item>
                                </div>
                            ))}
                        </div>

                        <Form.Item
                            className="settings-footer-message"
                            label="Footer Message"
                            name={["receiptSettings", "footerMessage"]}
                        >
                            <Input.TextArea
                                rows={2}
                                size="small"
                                style={{
                                    maxHeight: 60,
                                }}
                            />
                        </Form.Item>
                    </div>
                </Col>

                <Col xs={24} xl={12}>
                    <div className="settings-panel">
                        <SectionHeader
                            icon={<DollarOutlined />}
                            title="Currency & VAT"
                            description="Applies across all transactions and exports."
                        />

                        <div className="settings-form">
                            <Row gutter={12}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Currency"
                                        name={["currencyVat", "currency"]}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Select currency",
                                            },
                                        ]}
                                    >
                                        <Select
                                            options={currencies}
                                            onChange={handleCurrencyChange}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Currency Symbol"
                                        name={["currencyVat", "currencySymbol"]}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Enter currency symbol",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                hidden
                                name={["currencyVat", "currencyName"]}
                            >
                                <Input />
                            </Form.Item>

                            <Row gutter={12}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="VAT Rate (%)"
                                        name={["currencyVat", "vatRate"]}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Enter VAT rate",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            precision={2}
                                            className="settings-number-input"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Decimal Places"
                                        name={["currencyVat", "decimalPlaces"]}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Select decimal places",
                                            },
                                        ]}
                                    >
                                        <Select
                                            options={[0, 1, 2, 3, 4].map(
                                                (value) => ({
                                                    label: `${value} decimal places`,
                                                    value,
                                                }),
                                            )}
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

                                <Form.Item
                                    name={["currencyVat", "vatIncludedInPrice"]}
                                    valuePropName="checked"
                                    noStyle
                                >
                                    <Switch />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className="settings-panel">
                        <SectionHeader
                            icon={<DatabaseOutlined />}
                            title="Backup & Export"
                            description="Control which data can be exported."
                        />

                        <div className="settings-export-list">
                            {exportItems.map((item) => (
                                <div
                                    className="settings-export-row"
                                    key={item.title}
                                >
                                    <div>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>

                                    <Space className="settings-export-actions">
                                        <Form.Item
                                            name={item.name}
                                            valuePropName="checked"
                                            noStyle
                                        >
                                            <Switch />
                                        </Form.Item>
                                        <Button
                                            icon={<DownloadOutlined />}
                                            onClick={() => handleExport(item)}
                                        >
                                            CSV
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
        </Form>
    );
};

export default BusinessSettings;
