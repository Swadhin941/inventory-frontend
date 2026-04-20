import React, { useState } from "react";
import { Row, Col } from "antd";
import CustomerForm from "./components/CustomerForm";
import ProductGrid from "./components/ProductGrid";
import OrderSummary from "./components/OrderSummary";
import "./SalesPage.css";

const SalesPage = () => {
    const [cart, setCart] = useState([]);
    const products = [
        { id: 1, name: "Samsung A55", price: 895, stock: 10 },
        { id: 2, name: "iPhone 15 Pro", price: 4620, stock: 5 },
    ];

    const addToCart = (product) => {
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
            setCart(
                cart.map((item) =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const increaseQty = (id) => {
        setCart(
            cart.map((item) =>
                item.id === id ? { ...item, qty: item.qty + 1 } : item
            )
        );
    };

    const decreaseQty = (id) => {
        setCart(
            cart
                .map((item) =>
                    item.id === id
                        ? { ...item, qty: item.qty - 1 }
                        : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const removeItem = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    return (
        <div className="container-fluid">
            <div className="row mt-3">
    
                {/* LEFT SIDE */}
                <div className="col-12 col-lg-8">
                    
                    <div className="mb-3">
                        <CustomerForm />
                    </div>
    
                    <div>
                        <ProductGrid
                            products={products}
                            cart={cart}
                            addToCart={addToCart}
                        />
                    </div>
    
                </div>
    
                {/* RIGHT SIDE */}
                <div className="col-12 col-lg-4">
                    <OrderSummary
                        cart={cart}
                        increaseQty={increaseQty}
                        decreaseQty={decreaseQty}
                        removeItem={removeItem}
                    />
                </div>
    
            </div>
        </div>
    );
};

export default SalesPage;