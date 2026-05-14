export const defaultBusinessSettings = {
    storeInformation: {
        storeName: "",
        ownerName: "",
        address: "",
        taxCrNumber: "",
        phone: "",
        storeEmail: "",
    },
    currencyVat: {
        currency: "QAR",
        currencyName: "Qatari Riyal",
        currencySymbol: "QAR",
        vatRate: 5,
        decimalPlaces: 2,
        vatIncludedInPrice: true,
    },
    receiptSettings: {
        showLogoOnReceipt: true,
        showStaffName: true,
        showVatBreakdown: true,
        printFooterMessage: false,
        footerMessage: "",
    },
    backupExport: {
        enableSalesExport: true,
        enableProductExport: true,
        enablePaymentExport: true,
    },
    isActive: true,
};

export const extractBusinessSettings = (value) => {
    if (!value) return null;
    return value.body || value.data || value.businessInfo || value.businessSettings || value;
};

export const getBusinessSettings = (businessInfo) => ({
    ...defaultBusinessSettings,
    ...(extractBusinessSettings(businessInfo) || {}),
    storeInformation: {
        ...defaultBusinessSettings.storeInformation,
        ...(extractBusinessSettings(businessInfo)?.storeInformation || {}),
    },
    currencyVat: {
        ...defaultBusinessSettings.currencyVat,
        ...(extractBusinessSettings(businessInfo)?.currencyVat || {}),
    },
    receiptSettings: {
        ...defaultBusinessSettings.receiptSettings,
        ...(extractBusinessSettings(businessInfo)?.receiptSettings || {}),
    },
    backupExport: {
        ...defaultBusinessSettings.backupExport,
        ...(extractBusinessSettings(businessInfo)?.backupExport || {}),
    },
});

export const getCurrencyVatSettings = (businessInfo) =>
    getBusinessSettings(businessInfo).currencyVat;

export const formatMoney = (amount, businessInfo) => {
    const settings = getCurrencyVatSettings(businessInfo);
    const decimalPlaces = Number(settings.decimalPlaces ?? 2);

    return `${settings.currencySymbol || settings.currency || "QAR"} ${Number(
        amount || 0,
    ).toLocaleString("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    })}`;
};

export const calculateVat = (subtotal, businessInfo) => {
    const { vatRate } = getCurrencyVatSettings(businessInfo);
    return Number(subtotal || 0) * (Number(vatRate || 0) / 100);
};
