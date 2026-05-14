import { useEffect, useState } from "react";
import { Button, Empty, Modal } from "antd";
import { CheckCircleFilled, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    addPurchaseProductApi,
    clearCouponState,
    validateCouponApi,
} from "../../../Services/slices/product.slice";
import "./OrderSummary.css";
import Spinner from "../../../Components/Spinner/Spinner";

/** Digits only; length 13–19 and passes Luhn checksum (major card networks). */
const isValidCardNumber = (digits) => {
    const d = String(digits ?? "").replace(/\D/g, "");
    if (d.length < 13 || d.length > 19) return false;
    let sum = 0;
    let doubleDigit = false;
    for (let i = d.length - 1; i >= 0; i--) {
        let digit = parseInt(d[i], 10);
        if (Number.isNaN(digit)) return false;
        if (doubleDigit) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        doubleDigit = !doubleDigit;
    }
    return sum % 10 === 0;
};

const OrderSummary = ({
    cart,
    customer,
    increaseQty,
    decreaseQty,
    removeItem,
    onPlaceOrder,
}) => {
    const dispatch = useDispatch();
    const {
        couponValidatorLoading,
        couponValid,
        discountInfo,
        purchaseProductLoading,
    } = useSelector((state) => state.product);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [coupon, setCoupon] = useState("");
    const [cardInfo, setCardInfo] = useState({
        cardHolder: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });
    const [saleSuccessModalOpen, setSaleSuccessModalOpen] = useState(false);
    const [, setLastSaleReceipt] = useState(null);

    const getProductId = (product) => product._id || product.id;
    const getProductPrice = (product) =>
        Number(
            product.finalPrice ?? product.price ?? product.sellingPrice ?? 0,
        );
    const isStockLimitReached = (item) =>
        Boolean(item.stock && item.qty >= item.stock);

    const cartFingerprint = cart
        .map((item) => `${getProductId(item)}:${item.qty}`)
        .sort()
        .join("|");

    const handleCardInfoChange = (field, value) => {
        setCardInfo((currentInfo) => ({
            ...currentInfo,
            [field]: value,
        }));
    };

    const getExpiryParts = () => {
        const raw = String(cardInfo.expiryDate);
        if (raw.includes("/")) {
            const [mPart, yPart] = raw.split("/");
            return {
                mm: mPart.replace(/\D/g, "").slice(0, 2),
                yy: (yPart || "").replace(/\D/g, "").slice(0, 2),
            };
        }
        const digits = raw.replace(/\D/g, "").slice(0, 4);
        return { mm: digits.slice(0, 2), yy: digits.slice(2, 4) };
    };

    const setExpiryFromParts = (mm, yy) => {
        const cleanMm = mm.replace(/\D/g, "").slice(0, 2);
        const cleanYy = yy.replace(/\D/g, "").slice(0, 2);
        const combined = cleanYy.length > 0 ? `${cleanMm}/${cleanYy}` : cleanMm;
        handleCardInfoChange("expiryDate", combined);
    };

    const handleExpiryMonthChange = (value) => {
        const { yy } = getExpiryParts();
        setExpiryFromParts(value, yy);
    };

    const handleExpiryYearChange = (value) => {
        const { mm } = getExpiryParts();
        setExpiryFromParts(mm, value);
    };

    const handleCvvChange = (value) => {
        handleCardInfoChange("cvv", value.replace(/\D/g, "").slice(0, 4));
    };

    const resetPaymentFields = () => {
        setPaymentMethod("cash");
        setCardInfo({
            cardHolder: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
        });
    };

    const handleCloseSaleSuccessModal = () => {
        setSaleSuccessModalOpen(false);
        setLastSaleReceipt(null);
        dispatch(clearCouponState());
        setCoupon("");
        resetPaymentFields();
    };




    const handlePrintReceipt = () => {
        
    };

    const handleCardNumberChange = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 19);
        handleCardInfoChange("cardNumber", digits);
    };

    const subtotal = cart.reduce(
        (sum, item) => sum + getProductPrice(item) * item.qty,
        0,
    );

    const vat = subtotal * 0.05;
    const totalBeforeCoupon = subtotal + vat;
    const parsedCouponFinalPrice = Number(discountInfo?.finalPrice);
    const couponFinalPrice =
        couponValid && Number.isFinite(parsedCouponFinalPrice)
            ? parsedCouponFinalPrice
            : null;
    const couponDiscount =
        couponFinalPrice !== null
            ? Math.max(totalBeforeCoupon - couponFinalPrice, 0)
            : 0;

    const total =
        couponFinalPrice !== null ? couponFinalPrice : totalBeforeCoupon;

    useEffect(() => {
        dispatch(clearCouponState());
        setCoupon("");
    }, [cartFingerprint, dispatch]);

    const handleCouponChange = (value) => {
        if (couponValid) {
            dispatch(clearCouponState());
        }
        setCoupon(value);
    };

    const customerNameTrimmed = String(customer?.customerName ?? "").trim();
    const phoneTrimmed = String(customer?.phone ?? "").trim();
    const emailTrimmed = String(customer?.email ?? "").trim();
    const cardDigits = String(cardInfo.cardNumber ?? "").replace(/\D/g, "");

    const handleCompleteSale = async () => {
        if (purchaseProductLoading) {
            return;
        }

        if (cart.length === 0) {
            toast.error("Add products to the cart before completing the sale");
            return;
        }
        if (!customerNameTrimmed) {
            toast.error("Customer name is required");
            return;
        }
        if (!phoneTrimmed) {
            toast.error("Customer phone is required");
            return;
        }
        if (paymentMethod === "card" && !isValidCardNumber(cardDigits)) {
            toast.error(
                "Enter a valid card number (13–19 digits, numeric checksum)",
            );
            return;
        }

        const lineItems = cart.map((item) => ({
            productId: getProductId(item),
            name: item.name,
            qty: item.qty,
            unitPrice: getProductPrice(item),
            warranty: item.warranty ?? item.hasWarranty ?? false,
            warrantyPeriod: Number(item.warrantyPeriod ?? 0),
        }));

        const payload = {
            customer: {
                name: customerNameTrimmed,
                phone: phoneTrimmed,
                ...(emailTrimmed ? { email: emailTrimmed } : {}),
            },
            lineItems,
            paymentMethod,
            couponCode: couponValid ? coupon.trim() || undefined : undefined,
            totals: {
                subtotal,
                vat,
                total,
            },
            discountInfo: couponValid ? discountInfo : null,
            cardInfo:
                paymentMethod === "card"
                    ? {
                          cardHolder: cardInfo.cardHolder,
                          cardNumber: cardInfo.cardNumber,
                          expiryDate: cardInfo.expiryDate,
                          cvv: cardInfo.cvv,
                      }
                    : null,
        };
        const receiptSnapshot = {
            ...payload,
            cardInfo:
                paymentMethod === "card"
                    ? {
                          cardHolder: cardInfo.cardHolder,
                          cardNumber: cardInfo.cardNumber,
                          expiryDate: cardInfo.expiryDate,
                      }
                    : null,
        };

        try {
            await dispatch(addPurchaseProductApi(payload)).unwrap();

            if (typeof onPlaceOrder === "function") {
                onPlaceOrder(payload);
            }

            setLastSaleReceipt(receiptSnapshot);
            setSaleSuccessModalOpen(true);
        } catch (_error) {
            // The slice already shows the API error toast.
        }
    };

    const handleApplyCoupon = () => {
        const couponCode = coupon.trim();

        if (!couponCode) {
            toast.error("Enter a coupon code");
            return;
        }

        if (cart.length === 0) {
            toast.error("Add products before applying a coupon");
            return;
        }

        const applicableBrands = [
            ...new Set(cart.map((item) => item.brand).filter(Boolean)),
        ];

        dispatch(
            validateCouponApi({
                applicableBrands,
                couponCode,
                finalPrice: totalBeforeCoupon,
            }),
        );
    };

    return (
        <div className="summary-card">
            <div className="summary-card-header">
                <h3>Order Summary</h3>
            </div>

            <div
                className={`summary-items-scroll${
                    cart.length === 0 ? " summary-items-scroll--empty" : ""
                }`}
                role="region"
                aria-label="Order line items"
            >
                {cart.length === 0 ? (
                    <Empty
                        className="summary-cart-empty"
                        description="No items in cart"
                    />
                ) : (
                    cart.map((item) => (
                        <div className="summary-item" key={getProductId(item)}>
                            <div className="item-info">
                                <strong>{item.name}</strong>
                                <p>QAR {getProductPrice(item).toFixed(2)}</p>
                            </div>

                            <div className="qty-box">
                                <button
                                    onClick={() =>
                                        decreaseQty(getProductId(item))
                                    }
                                >
                                    -
                                </button>
                                <span>{item.qty}</span>
                                <button
                                    onClick={() =>
                                        increaseQty(getProductId(item))
                                    }
                                    disabled={isStockLimitReached(item)}
                                >
                                    +
                                </button>
                            </div>

                            <div className="item-total">
                                QAR{" "}
                                {(getProductPrice(item) * item.qty).toFixed(2)}
                            </div>

                            <button
                                className="remove-btn"
                                onClick={() => removeItem(getProductId(item))}
                            >
                                x
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="summary-card-footer">
                <hr className="summary-divider" />

                {/* COUPON */}
                <input
                    className="coupon-input"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => handleCouponChange(e.target.value)}
                    disabled={cart.length === 0 || couponValidatorLoading}
                />
                {coupon.length > 0 && !couponValid && (
                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className="primary-btn"
                            onClick={handleApplyCoupon}
                            disabled={
                                cart.length === 0 || couponValidatorLoading
                            }
                        >
                            {couponValidatorLoading ? "Applying..." : "Apply"}
                        </button>
                    </div>
                )}

                {/* PAYMENT */}
                <div className="payment-section">
                    <h4>Payment Method</h4>

                    <div className="payment-options">
                        <button
                            className={paymentMethod === "cash" ? "active" : ""}
                            onClick={() => setPaymentMethod("cash")}
                        >
                            Cash
                        </button>

                        <button
                            className={paymentMethod === "card" ? "active" : ""}
                            onClick={() => setPaymentMethod("card")}
                        >
                            Card
                        </button>
                    </div>

                    {paymentMethod === "card" && (
                        <div className="card-payment-fields">
                            <input
                                type="password"
                                placeholder="Card holder name"
                                value={cardInfo.cardHolder}
                                onChange={(e) =>
                                    handleCardInfoChange(
                                        "cardHolder",
                                        e.target.value,
                                    )
                                }
                            />

                            <input
                                type="password"
                                inputMode="numeric"
                                placeholder="Card number (13–19 digits)"
                                maxLength={19}
                                autoComplete="cc-number"
                                value={cardInfo.cardNumber}
                                onChange={(e) =>
                                    handleCardNumberChange(e.target.value)
                                }
                            />

                            <div className="card-field-row card-sensitive-row">
                                <div className="card-expiry-group">
                                    <span className="card-field-label">
                                        Expires
                                    </span>
                                    <div className="card-expiry-inputs">
                                        <input
                                            type="password"
                                            name="cc-exp-month"
                                            autoComplete="cc-exp-month"
                                            inputMode="numeric"
                                            placeholder="MM"
                                            maxLength={2}
                                            className="card-expiry-part"
                                            value={getExpiryParts().mm}
                                            onChange={(e) =>
                                                handleExpiryMonthChange(
                                                    e.target.value,
                                                )
                                            }
                                            aria-label="Expiry month"
                                        />
                                        <span
                                            className="card-expiry-sep"
                                            aria-hidden
                                        >
                                            /
                                        </span>
                                        <input
                                            type="password"
                                            name="cc-exp-year"
                                            autoComplete="cc-exp-year"
                                            inputMode="numeric"
                                            placeholder="YY"
                                            maxLength={2}
                                            className="card-expiry-part"
                                            value={getExpiryParts().yy}
                                            onChange={(e) =>
                                                handleExpiryYearChange(
                                                    e.target.value,
                                                )
                                            }
                                            aria-label="Expiry year"
                                        />
                                    </div>
                                </div>

                                <div className="card-cvc-group">
                                    <span className="card-field-label">
                                        CVC
                                    </span>
                                    <input
                                        type="password"
                                        name="cc-csc"
                                        autoComplete="cc-csc"
                                        inputMode="numeric"
                                        placeholder="•••"
                                        maxLength={4}
                                        className="card-cvc-input"
                                        value={cardInfo.cvv}
                                        onChange={(e) =>
                                            handleCvvChange(e.target.value)
                                        }
                                        aria-label="Card security code"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* TOTALS */}
                <div className="totals">
                    <div>
                        <span>Subtotal</span>
                        <span>QAR {subtotal.toFixed(2)}</span>
                    </div>

                    <div>
                        <span>VAT (5%)</span>
                        <span>QAR {vat.toFixed(2)}</span>
                    </div>

                    {couponValid && (
                        <div className="coupon-total-row">
                            <span>Coupon</span>
                            <span>- QAR {couponDiscount.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                <h2 className="summary-total-line">
                    Total: QAR {total.toFixed(2)}
                </h2>

                <button
                    className="btn-complete"
                    type="button"
                    onClick={handleCompleteSale}
                    disabled={purchaseProductLoading}
                >
                    Complete Sale
                    {purchaseProductLoading && <Spinner />}
                </button>
            </div>

            <Modal
                title={null}
                open={saleSuccessModalOpen}
                onCancel={handleCloseSaleSuccessModal}
                footer={null}
                closable
                centered
                width={400}
                className="sale-success-modal"
                closeIcon={<CloseOutlined className="sale-success-modal__close" />}
                maskClosable={false}
                destroyOnClose
            >
                <div className="sale-success-modal__content">
                    <CheckCircleFilled className="sale-success-modal__icon" aria-hidden />
                    <h3 className="sale-success-modal__title">Your sale was successful</h3>
                    <p className="sale-success-modal__subtitle">
                        Thank you. You can print a receipt for your records.
                    </p>
                    <Button
                        type="primary"
                        size="large"
                        block
                        className="sale-success-modal__print"
                        onClick={handlePrintReceipt}
                    >
                        Download receipt
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default OrderSummary;
