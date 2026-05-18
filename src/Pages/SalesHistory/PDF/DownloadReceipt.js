import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    formatMoney,
    getBusinessSettings,
} from "../../../Utils/businessSettings";

const formatReceiptDate = (value) => {
    const date = value ? new Date(value) : new Date();

    if (Number.isNaN(date.getTime())) {
        return new Date().toLocaleString();
    }

    return date.toLocaleString();
};

const getCustomerInfo = (sale) => {
    if (sale?.customer && typeof sale.customer === "object") {
        return {
            name: sale.customer.name || "Walk-in Customer",
            phone: sale.customer.phone || sale.customerPhone || "-",
            email: sale.customer.email || sale.customerEmail || "-",
        };
    }

    return {
        name: sale?.customer || "Walk-in Customer",
        phone: sale?.customerPhone || "-",
        email: sale?.customerEmail || "-",
    };
};

const getTotals = (sale) => ({
    subtotal: sale?.totals?.subtotal ?? sale?.subtotal ?? 0,
    vat: sale?.totals?.vat ?? sale?.vat ?? 0,
    total: sale?.totals?.total ?? sale?.totalAmount ?? 0,
});

const safeFileName = (value) =>
    String(value || "sales")
        .trim()
        .replace(/[^\w-]+/g, "-")
        .replace(/-+/g, "-");

const stripCurrency = (value) => String(value ?? "0").replace(/^[A-Z]+\s*/, "");

export const DownloadReceipt = ({ sale, businessInfo }) => {
    if (!sale) return;

    const doc = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
    });

    const settings = getBusinessSettings(businessInfo);

    const { storeInformation, receiptSettings } = settings;

    const pageWidth = doc.internal.pageSize.getWidth();

    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 14;

    const rightEdge = pageWidth - margin;

    const transactionId =
        sale.TrxID || sale.trxId || sale._id || sale.id || "-";

    const customer = getCustomerInfo(sale);

    const totals = getTotals(sale);

    const lineItems = sale.lineItems || [];

    const purchasedAt =
        sale.purchaseDate || sale.createdAt || sale.updatedAt || new Date();

    // =====================================
    // BUSINESS HEADER
    // =====================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    if (receiptSettings.showLogoOnReceipt) {
        doc.setFontSize(9);
        doc.text("LOGO", margin, 10);
        doc.setFontSize(18);
    }
    doc.text(
        String(storeInformation.storeName || "Business Name"),
        margin,
        18,
        { maxWidth: 95 },
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const addressLines = doc.splitTextToSize(
        String(storeInformation.address || "-"),
        95,
    );

    doc.text(addressLines, margin, 25);

    const businessMetaY = 25 + addressLines.length * 4.2;

    doc.text(
        String(`Phone: ${storeInformation.phone || "-"}`),
        margin,
        businessMetaY,
    );
    doc.text(
        String(`Email: ${storeInformation.storeEmail || "-"}`),
        margin,
        businessMetaY + 5,
    );

    if (storeInformation.taxCrNumber) {
        doc.text(
            String(`Tax/CR: ${storeInformation.taxCrNumber}`),
            margin,
            businessMetaY + 10,
        );
    }

    // =====================================
    // RECEIPT INFO
    // =====================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("SALES RECEIPT", rightEdge, 18, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(String(`Transaction: ${transactionId}`), rightEdge, 26, {
        align: "right",
    });
    doc.text(
        String(`Purchase date: ${formatReceiptDate(purchasedAt)}`),
        rightEdge,
        32,
        { align: "right" },
    );
    doc.text(String(`Generated: ${formatReceiptDate()}`), rightEdge, 38, {
        align: "right",
    });
    doc.text(
        String(`Payment: ${String(sale.paymentMethod || "-").toUpperCase()}`),
        rightEdge,
        44,
        { align: "right" },
    );
    if (receiptSettings.showStaffName && (sale.staffName || sale.staff?.name)) {
        doc.text(
            String(`Staff: ${sale.staffName || sale.staff?.name}`),
            rightEdge,
            50,
            { align: "right" },
        );
    }

    // =====================================
    // DIVIDER
    // =====================================

    const dividerY = Math.max(businessMetaY + 16, 52);

    doc.setDrawColor(220);
    doc.line(margin, dividerY, rightEdge, dividerY);

    // =====================================
    // CUSTOMER INFO
    // =====================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Customer Information", margin, dividerY + 9);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(String(`Name: ${customer.name}`), margin, dividerY + 16);
    doc.text(String(`Phone: ${customer.phone}`), margin, dividerY + 22);
    doc.text(String(`Email: ${customer.email}`), margin, dividerY + 28);

    // =====================================
    // PRODUCT TABLE
    // =====================================

    const tableData = lineItems.map((product) => [
        product.name || "-",
        String(product.qty ?? 0),
        product.warranty ? `${product.warrantyPeriod || 0} Months` : "No",
        stripCurrency(formatMoney(product.unitPrice, settings)),
        stripCurrency(
            formatMoney(
                Number(product.unitPrice || 0) * Number(product.qty || 0),
                settings,
            ),
        ),
    ]);

    const tableCellPadding = 3;

    const usableWidth = pageWidth - margin * 2;

    const columnWidths = {
        product: 66,
        qty: 14,
        warranty: 28,
        unitPrice: 37,
        total: 37,
    };

    autoTable(doc, {
        startY: dividerY + 37,

        head: [
            ["Product", "Qty", "Warranty", "Unit Price (QAR)", "Total (QAR)"],
        ],

        body: tableData.length
            ? tableData
            : [["No products found", "-", "-", "-", "-"]],

        margin: { left: margin, right: margin },

        tableWidth: usableWidth,

        styles: {
            fontSize: 9,
            cellPadding: tableCellPadding,
            overflow: "linebreak",
            valign: "middle",
        },

        headStyles: {
            fillColor: [22, 119, 255],
            textColor: 255,
        },

        didParseCell: (data) => {
            if (data.section === "head") {
                const alignMap = ["left", "center", "center", "right", "right"];
                data.cell.styles.halign = alignMap[data.column.index] ?? "left";
            }
        },

        bodyStyles: { textColor: 40 },

        columnStyles: {
            0: { cellWidth: columnWidths.product, halign: "left" },
            1: { cellWidth: columnWidths.qty, halign: "center" },
            2: { cellWidth: columnWidths.warranty, halign: "center" },
            3: { cellWidth: columnWidths.unitPrice, halign: "right" },
            4: { cellWidth: columnWidths.total, halign: "right" },
        },
    });

    // =====================================
    // TOTALS SECTION
    // =====================================

    let finalY = doc.lastAutoTable.finalY + 12;

    const totalsHeight = receiptSettings.showVatBreakdown ? 24 : 16;

    if (finalY + totalsHeight + 20 > pageHeight - margin) {
        doc.addPage();
        finalY = margin;
    }

    const summaryLabelX =
        margin +
        columnWidths.product +
        columnWidths.qty +
        columnWidths.warranty +
        columnWidths.unitPrice -
        tableCellPadding;
    const summaryValueX =
        margin +
        columnWidths.product +
        columnWidths.qty +
        columnWidths.warranty +
        columnWidths.unitPrice +
        columnWidths.total -
        tableCellPadding;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // SUBTOTAL
    doc.text("Subtotal (QAR):", summaryLabelX, finalY, { align: "right" });
    doc.text(
        stripCurrency(formatMoney(totals.subtotal, settings)),
        summaryValueX,
        finalY,
        { align: "right" },
    );

    // VAT
    if (receiptSettings.showVatBreakdown) {
        doc.text("VAT (QAR):", summaryLabelX, finalY + 7, { align: "right" });
        doc.text(
            stripCurrency(formatMoney(totals.vat, settings)),
            summaryValueX,
            finalY + 7,
            { align: "right" },
        );
    }

    const grandTotalY = finalY + (receiptSettings.showVatBreakdown ? 16 : 9);

    // GRAND TOTAL
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Grand Total (QAR):", summaryLabelX, grandTotalY, {
        align: "right",
    });
    doc.text(
        stripCurrency(formatMoney(totals.total, settings)),
        summaryValueX,
        grandTotalY,
        { align: "right" },
    );

    // =====================================
    // FOOTER
    // =====================================

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const footerText =
        receiptSettings.printFooterMessage && receiptSettings.footerMessage
            ? receiptSettings.footerMessage
            : "Thank you for your purchase!";

    doc.text(String(footerText), pageWidth / 2, grandTotalY + 18, {
        align: "center",
        maxWidth: pageWidth - margin * 2,
    });

    // =====================================
    // SAVE PDF
    // =====================================

    doc.save(`${safeFileName(transactionId)}-receipt.pdf`);
};
