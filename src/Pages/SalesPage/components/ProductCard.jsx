import React from "react";
import { Card, Button } from "antd";
import "./ProductCard.css";


const ProductCard = ({ item, addToCart, isSelected }) => {
    return (
        <div className={`product-card ${isSelected ? "selected" : ""}`}>
            <div className="product-icon">📱</div>

            <h4>{item.name}</h4>
            <p className="stock">{item.stock} in stock</p>

            <h3 className="price">QAR {item.price}</h3>

            {item.stock === 0 ? (
                <button className="btn-disabled">Unavailable</button>
            ) : isSelected ? (
                <button className="btn-added">Added ✓</button>
            ) : (
                <button
                    className="btn-add"
                    onClick={() => addToCart(item)}
                >
                    + Add
                </button>
            )}
        </div>
    );
};
export default ProductCard;