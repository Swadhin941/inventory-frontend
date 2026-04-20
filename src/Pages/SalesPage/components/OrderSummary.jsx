import { useState } from "react";
import "./OrderSummary.css";

const OrderSummary = ({ cart, increaseQty, decreaseQty, removeItem }) => {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [coupon, setCoupon] = useState("");

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const vat = subtotal * 0.05;
    const discount = coupon === "SAVE10" ? 10 : 0;

    const total = subtotal + vat - discount;

    return (
        <div className="summary-card">
            <h3>Order Summary</h3>

            {/* ITEMS */}
            {cart.map((item) => (
                <div className="summary-item" key={item.id}>
                    <div>
                        <strong>{item.name}</strong>
                        <p>QAR {item.price}</p>
                    </div>

                    <div className="qty-box">
                        <button onClick={() => decreaseQty(item.id)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>

                    <div>QAR {item.price * item.qty}</div>

                    <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                    >
                        ✕
                    </button>
                </div>
            ))}

            <hr />

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
            </div>

            {/* TOTALS */}
            <div className="totals">
                <div>
                    <span>Subtotal</span>
                    <span>QAR {subtotal}</span>
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

            <h2>Total: QAR {total.toFixed(2)}</h2>

            <button className="btn-complete">
                Complete Sale
            </button>
        </div>
    );
};

export default OrderSummary;