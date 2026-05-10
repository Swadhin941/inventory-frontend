import React, { use } from "react";
import "./ProductCard.css";
import { useSelector } from "react-redux";

const ProductCard = ({ item, addToCart, cartQty = 0 }) => {
    const isSelected = cartQty > 0;
    const isOutOfStock = item.stock === 0;
    const reachedStockLimit = isSelected && cartQty >= item.stock;
    const { products} = useSelector((state) => state.product);

    return (
        <div className={`product-card ${isSelected ? "selected" : ""}`}>
            <div className="product-icon">📱</div>

            <h4>{item.name}</h4>
            {isOutOfStock ? (
                <span className="out-of-stock">Out of Stock</span>
            ) : (
                <p className="stock">{item.stock} in stock</p>
            )}

            <h3 className="price">QAR {item.finalPrice}</h3>

            {isOutOfStock ? (
                <button className="btn-disabled">Unavailable</button>
            ) : isSelected ? (
                <button
                    className="btn-added"
                    onClick={() => addToCart(item)}
                    disabled={reachedStockLimit}
                >
                    {reachedStockLimit ? "Stock limit reached" : `Added (${cartQty})`}
                </button>
            ) : (
                <button
                    className="btn-add"
                    onClick={() => addToCart(item)}
                    disabled={isOutOfStock}
                >
                    + Add
                </button>
            )}
        </div>
    );
};
export default ProductCard;
