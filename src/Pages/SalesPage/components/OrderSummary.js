import { useState } from "react";
import { Empty } from "antd";
import "./OrderSummary.css";

const OrderSummary = ({ cart, increaseQty, decreaseQty, removeItem }) => {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [coupon, setCoupon] = useState("");
    const [cardInfo, setCardInfo] = useState({
        cardHolder: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const getProductId = (product) => product._id || product.id;
    const getProductPrice = (product) =>
        Number(product.finalPrice ?? product.price ?? product.sellingPrice ?? 0);
    const isStockLimitReached = (item) =>
        Boolean(item.stock && item.qty >= item.stock);

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
        const combined =
            cleanYy.length > 0 ? `${cleanMm}/${cleanYy}` : cleanMm;
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

    const subtotal = cart.reduce(
        (sum, item) => sum + getProductPrice(item) * item.qty,
        0
    );

    const vat = subtotal * 0.05;
    const discount = coupon === "SAVE10" ? 10 : 0;

    const total = subtotal + vat - discount;

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
                    onChange={(e) => setCoupon(e.target.value)}
                />

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
                                handleCardInfoChange("cardHolder", e.target.value)
                            }
                        />

                        <input
                            type="password"
                            inputMode="numeric"
                            placeholder="Card number"
                            value={cardInfo.cardNumber}
                            onChange={(e) =>
                                handleCardInfoChange("cardNumber", e.target.value)
                            }
                        />

                        <div className="card-field-row card-sensitive-row">
                            <div className="card-expiry-group">
                                <span className="card-field-label">Expires</span>
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
                                            handleExpiryMonthChange(e.target.value)
                                        }
                                        aria-label="Expiry month"
                                    />
                                    <span className="card-expiry-sep" aria-hidden>
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
                                            handleExpiryYearChange(e.target.value)
                                        }
                                        aria-label="Expiry year"
                                    />
                                </div>
                            </div>

                            <div className="card-cvc-group">
                                <span className="card-field-label">CVC</span>
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

                    <div>
                        <span>Discount</span>
                        <span>- QAR {discount}</span>
                    </div>
                </div>

                <h2 className="summary-total-line">
                    Total: QAR {total.toFixed(2)}
                </h2>

                <button className="btn-complete" type="button">
                    Complete Sale
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;
